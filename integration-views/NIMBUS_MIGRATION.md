# UI Kit → Nimbus migration notes

Notes from migrating this Custom View from `@commercetools-uikit/*` to
`@commercetools/nimbus`. Read this before touching Nimbus in this repo again.

## Dependencies

```
@chakra-ui/react   ^3.35.0
@commercetools/nimbus         3.2.0
@commercetools/nimbus-icons   ^3.2.0
@commercetools/nimbus-tokens  ^3.2.0
slate, slate-dom, slate-history, slate-hyperscript, slate-react
```

- `slate*` packages are required peer dependencies of `@commercetools/nimbus`
  even though this app doesn't use `RichTextInput` — Nimbus's bundle pulls
  the component in regardless, and `esbuild`-based tooling (see chakra
  typegen below) will fail to resolve the module without them.
- `@chakra-ui/react` version matters: pin close to what Nimbus was built
  against. A too-new chakra minor caused a real type error
  (`Property 'cornerShape' does not exist on type 'CssProperties'` in
  `system.gen.d.ts`) until `chakra:typegen` was re-run (see below).

## Provider wiring

`NimbusProvider` + `NimbusI18nProvider` wrap `CustomViewShell` in
`src/components/entry-point/entry-point.tsx`.

## Regenerating Chakra's styled-system types

Nimbus ships its own recipes/tokens; Chakra's `system.gen.d.ts` (inside
`node_modules/@chakra-ui/react`) needs to be regenerated against Nimbus's
build for some prop typings (notably `Heading`'s `size` prop, see below) to
resolve correctly.

```
yarn chakra:typegen
```

**Do not run `npx @chakra-ui/cli typegen ...`.** `npx` resolves by package
name and always fetches an isolated copy into `~/.npm/_npx/...`, which has no
access to this project's `node_modules` — it fails with
`Cannot find module '@chakra-ui/react'` every time, no matter how many times
you retry it. The `chakra` binary is already installed locally (a transitive
dependency of Nimbus); the `chakra:typegen` script calls it directly.

## Nimbus/Chakra quirks hit during migration

- **`Text` has no `size` prop.** Use `textStyle` (e.g. `textStyle="sm"`,
  values: `2xs`–`7xl`, plus `body`/`caption`/`detail`) or raw `fontSize`.
  This isn't a version bug — `Text`'s recipe genuinely has no size variant.
- **`Heading` with both `as="h1"` and `size="lg"` failed to typecheck**
  before `chakra:typegen` was run against the currently-installed Nimbus
  version (`Property 'size' does not exist on type ...`), even though
  Nimbus's own docs show this exact pattern. Fixed by running
  `yarn chakra:typegen` after installing/upgrading Nimbus. If you upgrade
  `@commercetools/nimbus` again and this error reappears, re-run
  `chakra:typegen` before assuming it's a real bug.
- **`<DataTable<T> ...>` (explicit JSX generic argument) breaks.** Nimbus's
  `DataTable` export is typed as `(<T>(...) => JSX.Element) & { Root, Table,
  Header, ... }` — a generic function intersected with static
  sub-components. TypeScript's generic-tag-argument inference doesn't
  compose cleanly with that shape. Workaround: don't pass the explicit
  generic; let `T` infer from the `rows` prop, and annotate column
  `accessor` callback params explicitly instead:
  ```tsx
  <DataTable
    rows={items}
    columns={[{ id: 'name', header: 'Name', accessor: (item: TLineItem) => ... }]}
  />
  ```

## Scope boundary: what stayed on UI Kit

`@commercetools-uikit/data-table` (`TColumn` type) and
`@commercetools-uikit/hooks` (`useDataTableSortingState`,
`usePaginationState`) are still direct dependencies and still imported in:

- `src/components/customer-carts/column-definitions.ts`
- `src/components/customer-carts/customer-carts.tsx`
- `src/components/customer-shopping-lists/customer-shopping-lists.tsx`

These interop with `PaginatableDataTable` from
`commercetools-demo-shared-paginatable-data-table`, an external published
package that depends on UI Kit's `DataTable` internally. There is no Nimbus
equivalent that's API-compatible with that package. Migrating these three
files would mean forking/rewriting `commercetools-demo-shared-*` packages,
which is out of scope for an app-level migration. Every other
`@commercetools-uikit/*` dependency was removed.

## Component mapping used

| UI Kit | Nimbus |
| --- | --- |
| `Spacings.Stack` / `Spacings.Inline` | `Stack` (`direction="column"` / `"row"`) |
| `Text.Body` / `.Detail` / `.Caption` / `.Headline` / `.Subheadline` | `Text` with `textStyle`, or `Heading` for real headings |
| `ContentNotification` | `Alert.Root` + `Alert.Description` (`colorPalette` replaces `type`) |
| `PrimaryButton` / `SecondaryButton` / `FlatButton` | `Button` (`variant="solid"` / `"outline"` / `"ghost"`) |
| `Card` | `Card.Root` + `Card.Header` / `Card.Body` / `Card.Footer` |
| `Stamp` | `Badge` (`tone` → `colorPalette`, values remapped: `critical`→`critical`, `positive`→`positive`, `information`→`info`, `primary`/`secondary`→`primary`/`neutral`) |
| `CollapsiblePanel` | `Accordion.Root` / `.Item` / `.Header` / `.Content` (controlled via `expandedKeys`/`onExpandedChange`, not `isClosed`/`onToggle`) |
| `Constraints.Horizontal` | `Box maxWidth="<token>"` |
| `Grid` | `Grid` (`gridGap`→`gap`, `gridTemplateColumns`→`templateColumns`) |
| `Label` | `Text as="label" fontWeight="medium"` |
| `@commercetools-uikit/icons` | `Icon as={IconComponent}` from `@commercetools/nimbus-icons` |
| `LoadingSpinner`, `Box`/`Grid.Item` | direct 1:1 rename |

Spacing/sizing conversions used throughout (UI Kit scale → px → Nimbus
token): `xs`=4px→`100`, `s`=8px→`200`, `m`=16px→`400`, `l`=24px→`600`,
`xl`=32px→`800`, `xxl`=48px→`1200`, `xxxl`=64px→`1600`.

## Pre-existing, unrelated typecheck errors

`yarn typecheck` still reports ~9 errors in `src/` about `TCart` /
`TShoppingList` / `TLineItem` mismatches between this app's generated
GraphQL types (`src/types/generated/ctp.ts`) and the bundled types inside
`commercetools-demo-shared-*` packages. Confirmed via `git stash` that these
errors exist identically on the pre-Nimbus code — they're a generated-types
version skew across the monorepo's shared packages, not something this
migration introduced. Don't spend time trying to "fix" them as part of
Nimbus work.
