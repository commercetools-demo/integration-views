import { FC } from 'react';
import { Alert, LoadingSpinner, Stack } from '@commercetools/nimbus';
import { TCart } from '../../types/generated/ctp';
import { PageNotFound } from '@commercetools-frontend/application-components';
import { CartDetailsGeneralInfoHeader as ExternalCartDetailsGeneralInfoHeader } from 'commercetools-demo-shared-cart-handling';
import {
  getErrorMessage,
  useOrdersFetcher,
} from 'commercetools-demo-shared-data-fetching-hooks';

type Props = { cart: TCart };
const CartDetailsGeneralInfoHeader: FC<Props> = ({ cart }) => {
  const { orders, loading, error } = useOrdersFetcher({
    offset: 0,
    limit: 10,
    where: `cart(id="${cart.id}")`,
  });
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

  if (!orders || !orders.results) {
    return <PageNotFound />;
  }

  return (
    <ExternalCartDetailsGeneralInfoHeader
      cart={cart}
      orderId={orders.results[0]?.id}
    />
  );
};

CartDetailsGeneralInfoHeader.displayName = 'OrderDetailsGeneralInfoTabHeader';

export default CartDetailsGeneralInfoHeader;
