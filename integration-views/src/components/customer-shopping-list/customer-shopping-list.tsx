import { FC, useEffect, useState } from 'react';
import {
  CustomFormModalPage,
  PageNotFound,
} from '@commercetools-frontend/application-components';
import { useParams } from 'react-router-dom';
import { useIsAuthorized } from '@commercetools-frontend/permissions';
import {
  getErrorMessage,
  graphQLErrorHandler,
  useShoppingListDeleter,
  useShoppingListFetcher,
  useShoppingListUpdater,
} from 'commercetools-demo-shared-data-fetching-hooks';
import {
  Accordion,
  Alert,
  Box,
  Heading,
  LoadingSpinner,
  Stack,
  Text,
} from '@commercetools/nimbus';
import { TShoppingListUpdateAction } from '../../types/generated/ctp';

import { DOMAINS } from '@commercetools-frontend/constants';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { useShowNotification } from '@commercetools-frontend/actions-global';
import { PERMISSIONS } from '../../constants';
import {
  ProductVariantSelector,
  VariantValue,
} from 'commercetools-demo-shared-entity-selectors';
import {
  defaultShoppingListColumnsDefinition,
  defaultShoppingListItemRenderer,
} from 'commercetools-demo-shared-cart-handling';
import { useIntl } from 'react-intl';
import { PaginatableDataTable } from 'commercetools-demo-shared-paginatable-data-table';

type Props = {
  onClose: () => void;
};

export const CustomerShoppingList: FC<Props> = ({ onClose }) => {
  const intl = useIntl();
  const { id } = useParams<{ id: string }>();
  const showNotification = useShowNotification();
  const { dataLocale, projectLanguages } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale ?? '',
    projectLanguages: context.project?.languages ?? [],
  }));
  const shoppingListUpdater = useShoppingListUpdater();
  const shoppingListDeleter = useShoppingListDeleter();
  const canManage = useIsAuthorized({
    demandedPermissions: [PERMISSIONS.Manage],
  });
  const [shoppingListPanelClosed, setShoppingListPanelClosed] = useState(false);

  const { shoppingList, error, loading } = useShoppingListFetcher({
    id: id,
  });
  useEffect(() => {
    if (!shoppingList?.lineItems || shoppingList?.lineItems.length === 0) {
      setShoppingListPanelClosed(true);
    } else {
      setShoppingListPanelClosed(false);
    }
  }, [shoppingList?.lineItems]);
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
  if (!shoppingList) {
    return <PageNotFound />;
  }

  const handleDelete = async () => {
    await shoppingListDeleter.execute({
      id: shoppingList.id,
      version: shoppingList.version,
    });
    showNotification({
      kind: 'success',
      domain: DOMAINS.SIDE,
      text: 'The Shopping list has been deleted.',
    });
    onClose();
  };

  const handleRemoveLineItem = async (id: string) => {
    const action: TShoppingListUpdateAction = {
      removeLineItem: { lineItemId: id },
    };
    await shoppingListUpdater.execute({
      actions: [action],
      id: shoppingList.id,
      version: shoppingList.version,
    });
    showNotification({
      kind: 'success',
      domain: DOMAINS.SIDE,
      text: 'The Shopping List has been updated.',
    });
  };

  const handleChangeQuantity = async (lineItemId: string, quantity: number) => {
    const action: TShoppingListUpdateAction = {
      changeLineItemQuantity: { lineItemId: lineItemId, quantity },
    };
    await shoppingListUpdater.execute({
      actions: [action],
      id: shoppingList.id,
      version: shoppingList.version,
    });
    showNotification({
      kind: 'success',
      domain: DOMAINS.SIDE,
      text: 'The Shopping List has been updated.',
    });
  };
  const handleAddVariantToCart = async (variant: VariantValue) => {
    await shoppingListUpdater
      .execute({
        actions: [{ addLineItem: { sku: variant.sku, quantity: 1 } }],
        id: shoppingList.id,
        version: shoppingList.version,
      })
      .then(() => {
        showNotification({
          kind: 'success',
          domain: DOMAINS.SIDE,
          text: 'Added item',
        });
      })
      .catch(graphQLErrorHandler(showNotification));
  };

  return (
    <CustomFormModalPage
      isOpen
      title={'Edit Shopping List'}
      onClose={onClose}
      formControls={
        <>
          <CustomFormModalPage.FormDeleteButton
            onClick={() => handleDelete()}
          />
        </>
      }
    >
      <Stack direction="column" gap="1200">
        <Stack direction="column" gap="200">
          <Stack direction="row" justify="space-between" gap="600">
            <Box maxWidth="lg">
              <Stack direction="column" gap="400">
                <Heading as="h2" size="lg">
                  Add Item
                </Heading>
                <Text textStyle="xl">Add items to your shopping cart.</Text>
              </Stack>
            </Box>
          </Stack>
          <Box maxWidth="2xl">
            <ProductVariantSelector
              name={'variantSearch'}
              onChange={async (event) => {
                await handleAddVariantToCart(
                  event.target.value as VariantValue
                );
              }}
            />
          </Box>
        </Stack>
        <Accordion.Root
          expandedKeys={shoppingListPanelClosed ? [] : ['shopping-list']}
          onExpandedChange={(keys) =>
            setShoppingListPanelClosed(
              !Array.from(keys as Iterable<string>).includes('shopping-list')
            )
          }
        >
          <Accordion.Item value="shopping-list">
            <Accordion.Header>
              {!shoppingList.lineItems || shoppingList.lineItems.length === 0
                ? 'Shopping List (empty)'
                : 'Shopping List'}
            </Accordion.Header>
            <Accordion.Content>
              {shoppingList.lineItems && (
                <PaginatableDataTable
                  visibleColumns={defaultShoppingListColumnsDefinition({
                    intl,
                  })}
                  rows={shoppingList.lineItems}
                  columns={defaultShoppingListColumnsDefinition({ intl })}
                  itemRenderer={defaultShoppingListItemRenderer(
                    dataLocale,
                    projectLanguages,
                    canManage,
                    handleRemoveLineItem,
                    handleChangeQuantity
                  )}
                />
              )}
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </Stack>
    </CustomFormModalPage>
  );
};

export default CustomerShoppingList;
