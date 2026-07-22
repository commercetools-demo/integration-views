import { FC } from 'react';
import {
  ConfirmationDialog,
  useModalState,
} from '@commercetools-frontend/application-components';
import { useIntl } from 'react-intl';
import messages from './messages';
import { TCart } from '../../types/generated/ctp';
import {
  graphQLErrorHandler,
  useCartDeleter,
  useCartUpdater,
} from 'commercetools-demo-shared-data-fetching-hooks';
import { useCustomViewContext } from '@commercetools-frontend/application-shell-connectors';
import { useShowNotification } from '@commercetools-frontend/actions-global';
import { DOMAINS } from '@commercetools-frontend/constants';
import { Stack, Text } from '@commercetools/nimbus';

type Props = {
  action: 'delete' | 'freeze' | 'unfreeze';
  onCancel: () => void;
  onClose: () => void;
  items: Array<TCart>;
};

export const CustomerCartsUpdate: FC<Props> = ({
  action,
  onCancel,
  items,
  onClose,
}) => {
  const intl = useIntl();
  const { isModalOpen, closeModal } = useModalState(true);
  const showNotification = useShowNotification();
  const { execute } = useCartUpdater();
  const { execute: deleteCart } = useCartDeleter();
  const { dataLocale } = useCustomViewContext((context) => ({
    dataLocale: context.dataLocale ?? '',
  }));
  console.log(action);

  const handleConfirm = async () => {
    if (action === 'freeze') {
      for (const cart of items) {
        await execute({
          actions: [{ freezeCart: { dummy: '' } }],
          version: cart.version,
          id: cart.id,
          locale: dataLocale,
        }).catch(graphQLErrorHandler(showNotification));
      }
    } else if (action === 'unfreeze') {
      for (const cart of items) {
        await execute({
          actions: [{ unfreezeCart: { dummy: '' } }],
          version: cart.version,
          id: cart.id,
          locale: dataLocale,
        }).catch(graphQLErrorHandler(showNotification));
      }
    } else if (action === 'delete') {
      for (const cart of items) {
        await deleteCart({ version: cart.version, id: cart.id }).catch(
          graphQLErrorHandler(showNotification)
        );
      }
    }
    showNotification({
      kind: 'success',
      domain: DOMAINS.SIDE,
      text: intl.formatMessage(messages.updateSuccess),
    });

    onClose();
  };

  const handleCancel = () => {
    onCancel();
    closeModal();
  };

  let messageTitle;
  let disableConfirmation = false;
  if (action === 'delete') {
    messageTitle = messages.titleDelete;
  } else if (action === 'freeze') {
    messageTitle = messages.titleFreeze;
  } else if (action === 'unfreeze') {
    messageTitle = messages.titleUnfreeze;
  } else {
    messageTitle = messages.titleNotrecognized;
  }
  return (
    <ConfirmationDialog
      title="Confirm Cart Update"
      isOpen={isModalOpen}
      onClose={closeModal}
      onCancel={handleCancel}
      onConfirm={handleConfirm}
      isPrimaryButtonDisabled={disableConfirmation}
    >
      <Stack direction="column" gap="400">
        <Text>{intl.formatMessage(messageTitle)}</Text>
      </Stack>
    </ConfirmationDialog>
  );
};

export default CustomerCartsUpdate;
