import { FC } from 'react';
import {
  CustomFormModalPage,
  PageContentWide,
  PageNotFound,
} from '@commercetools-frontend/application-components';
import messages from './messages';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router';
import { useCartDeleter, useCartFetcher } from '../../hooks/use-carts-hook';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { ContentNotification } from '@commercetools-uikit/notifications';
import Text from '@commercetools-uikit/text';
import { getErrorMessage } from '../../helpers';
import Spacings from '@commercetools-uikit/spacings';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import { useShowNotification } from '@commercetools-frontend/actions-global';
import { DOMAINS } from '@commercetools-frontend/constants';
import CartDetailsGeneralInfoHeader from '../cart-details-general-info-header';
import Card from '@commercetools-uikit/card';
import CartDetailsItems from '../cart-details-items/cart-details-items';
import CartSummaryPricingBreakdown from '../cart-summary-pricing-breakdown';
import AddressesPanel from '../addresses-panel';

type Props = { onClose: () => Promise<void> };

export const CustomerCart: FC<Props> = ({ onClose }) => {
  const intl = useIntl();
  const { id } = useParams<{ id: string }>();
  const { dataLocale } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale ?? '',
  }));
  const showNotification = useShowNotification();
  const { cart, loading, error } = useCartFetcher({
    id: id,
    locale: dataLocale,
  });

  const cartDeleter = useCartDeleter();

  const handleDelete = async () => {
    if (cart) {
      await cartDeleter.execute({
        id: cart.id,
        version: cart.version,
      });
      showNotification({
        kind: 'success',
        domain: DOMAINS.SIDE,
        text: intl.formatMessage(messages.deleteSuccess),
      });
      await onClose();
    }
  };

  if (error) {
    return (
      <ContentNotification type="error">
        <Text.Body>{getErrorMessage(error)}</Text.Body>
      </ContentNotification>
    );
  }
  if (loading) {
    return (
      <Spacings.Stack alignItems="center">
        <LoadingSpinner />
      </Spacings.Stack>
    );
  }

  if (!cart) {
    return <PageNotFound />;
  }
  return (
    <CustomFormModalPage
      title={intl.formatMessage(messages.title)}
      subtitle={cart.id}
      topBarPreviousPathLabel={intl.formatMessage(messages.previous)}
      isOpen={true}
      onClose={onClose}
      formControls={
        <>
          <CustomFormModalPage.FormDeleteButton
            onClick={() => handleDelete()}
          />
        </>
      }
    >
      <PageContentWide>
        <Spacings.Stack scale="xl">
          <CartDetailsGeneralInfoHeader cart={cart} />
          {(cart.lineItems.length >= 1 || cart.customLineItems.length >= 1) && (
            <CartDetailsItems cart={cart} />
          )}
          {(cart.lineItems.length >= 1 || cart.customLineItems.length >= 1) && (
            <Card type="raised">
              <CartSummaryPricingBreakdown cart={cart} />
            </Card>
          )}
          <AddressesPanel cart={cart} />
        </Spacings.Stack>
      </PageContentWide>
    </CustomFormModalPage>
  );
};

export default CustomerCart;
