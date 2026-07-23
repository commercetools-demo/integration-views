import { FC, useState } from 'react';
import {
  Alert,
  DataTable,
  DataTableColumnItem,
  LoadingSpinner,
  Pagination,
  Stack,
} from '@commercetools/nimbus';
import { PageNotFound } from '@commercetools-frontend/application-components';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { useHistory, useRouteMatch } from 'react-router-dom';
import {
  getErrorMessage,
  useShoppingListsFetcher,
} from 'commercetools-demo-shared-data-fetching-hooks';
import { TShoppingList } from '../../types/generated/ctp';
import { SuspendedRoute } from '@commercetools-frontend/application-shell';
import { Switch } from 'react-router';
import CustomerShoppingList from '../customer-shopping-list/customer-shopping-list';
import { formatLocalizedString } from 'commercetools-demo-shared-helpers';
import { NO_VALUE_FALLBACK } from '@commercetools-frontend/constants';

type Props = { id: string };

export const CustomerShoppingLists: FC<Props> = ({ id }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const { push } = useHistory();
  const match = useRouteMatch();

  const { shoppingLists, loading, error, refetch } = useShoppingListsFetcher({
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
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

  const columns: Array<DataTableColumnItem<TShoppingList>> = [
    {
      id: 'name',
      header: 'Name',
      accessor: (row) => {
        return formatLocalizedString(
          row.nameAllLocales,
          dataLocale,
          projectLanguages,
          NO_VALUE_FALLBACK
        );
      },
    },
    {
      id: 'count',
      header: 'Line Item count',
      accessor: (row) => row.lineItems?.reduce((a, c) => a + c.quantity, 0),
    },
  ];

  return (
    <Stack direction="column" gap="600">
      <DataTable<TShoppingList>
        columns={columns}
        rows={shoppingLists.results}
        onRowClick={(row) => {
          push(`${match.url}/${row.id}`);
        }}
      />
      {shoppingLists.total > currentPage && (
        <Pagination
          totalItems={shoppingLists.total}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      )}
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
