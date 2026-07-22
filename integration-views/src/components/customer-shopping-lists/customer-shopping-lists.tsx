import { FC } from 'react';
import { Alert, LoadingSpinner, Stack } from '@commercetools/nimbus';
import { PageNotFound } from '@commercetools-frontend/application-components';
import { TColumn } from '@commercetools-uikit/data-table';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { usePaginationState } from '@commercetools-uikit/hooks';
import { useHistory, useRouteMatch } from 'react-router-dom';
import {
  getErrorMessage,
  useShoppingListsFetcher,
} from 'commercetools-demo-shared-data-fetching-hooks';
import { TShoppingList } from '../../types/generated/ctp';
import { SuspendedRoute } from '@commercetools-frontend/application-shell';
import { Switch } from 'react-router';
import CustomerShoppingList from '../customer-shopping-list/customer-shopping-list';
import { PaginatableDataTable } from 'commercetools-demo-shared-paginatable-data-table';
import {
  defaultShoppingListsColumnsDefinition,
  defaultShoppingListsItemRenderer,
} from 'commercetools-demo-shared-cart-handling';
import { useIntl } from 'react-intl';

type Props = { id: string };

export const CustomerShoppingLists: FC<Props> = ({ id }) => {
  const intl = useIntl();
  const paginationState = usePaginationState();
  const { push } = useHistory();
  const match = useRouteMatch();

  const { shoppingLists, loading, error, refetch } = useShoppingListsFetcher({
    limit: paginationState.perPage.value,
    offset: (paginationState.page.value - 1) * paginationState.perPage.value,
    where: `customer(id="${id}")`,
  });
  const { dataLocale, projectLanguages } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale ?? '',
    projectLanguages: context.project?.languages ?? [],
  }));
  if (error) {
    return (
      <Alert.Root colorPalette="critical">
        <Alert.Description>{getErrorMessage(error)}</Alert.Description>
      </Alert.Root>
    );
  }
  if (loading) {
    return (
      <Stack direction="column" align="center">
        <LoadingSpinner />
      </Stack>
    );
  }
  if (!shoppingLists) {
    return <PageNotFound />;
  }
  const columns: Array<TColumn<TShoppingList>> = [
    // { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'count', label: 'Line Item count' },
    // { key: 'customer', label: 'Customer' },
  ];

  return (
    <Stack direction="column" gap="600">
      <PaginatableDataTable
        rows={shoppingLists.results}
        visibleColumns={columns}
        columns={defaultShoppingListsColumnsDefinition({ intl })}
        itemRenderer={defaultShoppingListsItemRenderer(
          dataLocale,
          projectLanguages
        )}
        onRowClick={(row) => {
          push(`${match.url}/${row.id}`);
        }}
        paginationState={paginationState}
        totalItems={shoppingLists.total}
      />
      <Switch>
        <SuspendedRoute path={`${match.path}/:id`}>
          <CustomerShoppingList
            onClose={() => {
              refetch();
              push(match.url);
            }}
          />
        </SuspendedRoute>
      </Switch>
    </Stack>
  );
};

export default CustomerShoppingLists;
