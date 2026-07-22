import { FC } from 'react';
import { Alert, Button, Heading, Icon, Stack } from '@commercetools/nimbus';
import { Add, Download, Chat } from '@commercetools/nimbus-icons';
import {
  TabHeader,
  TabularMainPage,
} from '@commercetools-frontend/application-components';
import { ComponentProps } from '../../routes';
import { Route, Switch, useRouteMatch } from 'react-router';
import CustomerDashboard from '../customer-dashboard/customer-dashboard';
import CustomerActions from '../customer-actions/customer-actions';
import CustomerShoppingLists from '../customer-shopping-lists/customer-shopping-lists';
import {
  useCustomerFetcher,
  getErrorMessage,
} from 'commercetools-demo-shared-data-fetching-hooks';

const Customer: FC<ComponentProps> = ({ id }) => {
  const match = useRouteMatch();
  const { customer, error, loading } = useCustomerFetcher({
    id: id,
  });

  if (error) {
    return (
      <Alert.Root colorPalette="critical">
        <Alert.Description>{getErrorMessage(error)}</Alert.Description>
      </Alert.Root>
    );
  }

  if (!loading && !customer) {
    return (
      <Alert.Root colorPalette="info">
        <Alert.Description>No Results</Alert.Description>
      </Alert.Root>
    );
  }

  return (
    <TabularMainPage
      customTitleRow={
        <Stack direction="row" justify="space-between">
          <Heading as="h2" size="xl">
            Customer View
          </Heading>
          <Stack direction="row" gap="200">
            <Button variant="solid" colorPalette="primary">
              <Icon as={Add} />
              Open in CRM
            </Button>
            <Button variant="outline" colorPalette="primary">
              <Icon as={Chat} />
              Log Complaint
            </Button>
            <Button variant="outline" colorPalette="primary">
              <Icon as={Download} />
              Export as XLS
            </Button>
          </Stack>
        </Stack>
      }
      tabControls={
        <>
          <TabHeader
            to={`${match.url}`}
            label="Customer Dashboard"
            exactPathMatch={true}
          />
          <TabHeader to={`${match.url}/shopping-lists`} label="Shopping List" />
          {(customer?.isEmailVerified === undefined ||
            !customer?.isEmailVerified) && (
            <TabHeader to={`${match.url}/actions`} label="Customer Actions" />
          )}
        </>
      }
    >
      <Switch>
        <Route path={`${match.path}`} exact={true}>
          <CustomerDashboard />
        </Route>
        <Route path={`${match.path}/shopping-lists`}>
          <CustomerShoppingLists id={id} />
        </Route>
        <Route path={`${match.path}/actions`}>
          <CustomerActions id={id} />
        </Route>
      </Switch>
    </TabularMainPage>
  );
};

export default Customer;
