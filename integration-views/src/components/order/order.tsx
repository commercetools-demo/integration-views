import { FC, useMemo } from 'react';
import { NO_VALUE_FALLBACK } from '@commercetools-frontend/constants';
import {
  Alert,
  Box,
  Button,
  Card,
  DataTable,
  Grid,
  Heading,
  Icon,
  Stack,
  Steps,
  Text,
} from '@commercetools/nimbus';
import { Add, Chat, Check, Download } from '@commercetools/nimbus-icons';
import { InfoMainPage } from '@commercetools-frontend/application-components';
import { useCustomViewContext } from '@commercetools-frontend/application-shell-connectors';
import OrderDetailsItem from './order-details-item';
import { ComponentProps } from '../../routes';
import {
  getErrorMessage,
  useOrderFetcher,
} from 'commercetools-demo-shared-data-fetching-hooks';
import {
  formatLocalizedString,
  TLineItem,
} from 'commercetools-demo-shared-helpers';

const Order: FC<ComponentProps> = ({ id }) => {
  const { dataLocale, projectLanguages, googleMapOrigin, googleMapKey } =
    useCustomViewContext((context) => {
      const googleMapKey =
        'googleMapKey' in context.environment
          ? context.environment.googleMapKey
          : undefined;
      const googleMapOrigin =
        'googleMapOrigin' in context.environment
          ? context.environment.googleMapOrigin
          : undefined;
      return {
        dataLocale: context.dataLocale ?? '',
        projectLanguages: context.project?.languages ?? [],
        googleMapKey: googleMapKey,
        googleMapOrigin: googleMapOrigin,
      };
    });
  const createStepsDefinition = useMemo(
    () => [
      {
        key: 'Ordered',
        label: 'Ordered',
      },
      {
        key: 'Picking',
        label: 'Picking',
      },
      {
        key: 'Picked',
        label: 'Picked',
      },
      {
        key: 'ReadyToShip',
        label: 'Ready To Ship',
      },
      {
        key: 'InTransit',
        label: 'In Transit',
      },
      {
        key: 'Delivered',
        label: 'Delivered',
      },
    ],
    []
  );
  const { order, error, loading } = useOrderFetcher({
    id: id,
  });

  if (error) {
    return (
      <Alert.Root colorPalette="critical">
        <Alert.Description>{getErrorMessage(error)}</Alert.Description>
      </Alert.Root>
    );
  }

  if (!loading && !order) {
    return (
      <Alert.Root colorPalette="info">
        <Alert.Description>No Results</Alert.Description>
      </Alert.Root>
    );
  }

  let to: string = '';
  if (order?.shippingAddress) {
    const address = order?.shippingAddress;
    if (address?.streetName) {
      to += address?.streetName + '+';
      if (address?.streetNumber) {
        to += address?.streetName + '+';
      }
    }
    if (address?.postalCode) {
      to += address?.postalCode + '+';
    }
    if (address?.city) {
      to += address?.city + '+';
    }
  }

  const today = new Date();
  const deliveryStepy = [
    {
      date: today.setDate(today.getDate() - 1),
      headline: 'In Transit',
      body: 'On its way',
    },
    {
      date: today.setDate(today.getDate() - 1),
      headline: 'In Transit',
      body: 'Arrived at Station',
    },
    {
      date: today.setDate(today.getDate() - 1),
      headline: 'In Transit',
      body: 'Arrived at Facility',
    },
    {
      date: today.setDate(today.getDate() - 1),
      headline: 'Transit Start',
      body: 'Leaving our warehouse',
    },
    {
      date: today.setDate(today.getDate() - 1),
      headline: 'Picking',
      body: 'All items picked',
    },
    {
      date: today.setDate(today.getDate() - 1),
      headline: 'Picking',
      body: 'Started',
    },
  ];

  return (
    <InfoMainPage
      title="Order Tracking Form"
      customTitleRow={
        <Stack direction="row" justify="space-between">
          <Heading as="h2" size="xl">
            Order Tracking Form
          </Heading>
          <Stack direction="row" gap="200">
            <Button colorPalette="primary">
              <Icon as={Add} />
              Open in OMS
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
      subtitle={'This data is coming directly from the Order Management System'}
    >
      <Card.Root variant="elevated">
        <Card.Body>
          <Stack direction="column" gap="800">
            <Grid gap="400" templateColumns="repeat(2, 1fr)">
              <Grid.Item>
                <DataTable<TLineItem>
                  rows={order?.lineItems || []}
                  columns={[
                    {
                      id: 'image',
                      header: 'Image',
                      accessor: (item: TLineItem) => (
                        <Box width="1200" height="1200">
                          <img
                            src={item.variant?.images?.[0]?.url}
                            style={{
                              verticalAlign: 'middle',
                              maxWidth: '100%',
                              maxHeight: '100%',
                              objectFit: 'contain',
                            }}
                          />
                        </Box>
                      ),
                    },
                    {
                      id: 'name',
                      header: 'Name',
                      accessor: (item: TLineItem) =>
                        formatLocalizedString(
                          item.nameAllLocales ?? [],
                          dataLocale,
                          projectLanguages,
                          NO_VALUE_FALLBACK
                        ),
                    },
                  ]}
                />
              </Grid.Item>
              <Grid.Item>
                <Stack direction="column" gap="200">
                  <Stack
                    direction="row"
                    justify="space-between"
                    align="flex-start"
                    gap="400"
                  >
                    <Text as="label" fontWeight="medium">
                      Order ID:
                    </Text>
                    <Text>{order?.id}</Text>
                  </Stack>
                  <Stack
                    direction="row"
                    justify="space-between"
                    align="flex-start"
                    gap="400"
                  >
                    <Text as="label" fontWeight="medium">
                      Carrier
                    </Text>
                    <Text>DHL</Text>
                  </Stack>
                </Stack>
              </Grid.Item>
            </Grid>

            <Steps.Root count={createStepsDefinition.length} step={4}>
              <Steps.List>
                {createStepsDefinition.map((step, index) => {
                  return (
                    <Steps.Item key={step.key} index={index}>
                      <Steps.Trigger>
                        <Steps.Indicator>
                          <Steps.Status
                            complete={<Check />}
                            incomplete={<Steps.Number />}
                          />
                        </Steps.Indicator>
                        <Steps.Title>{step.label}</Steps.Title>
                        <Steps.Separator />
                      </Steps.Trigger>
                    </Steps.Item>
                  );
                })}
              </Steps.List>
            </Steps.Root>
            <Grid gap="400" templateColumns="repeat(2, 1fr)">
              <Grid.Item>
                <Stack direction="column" gap="400">
                  {deliveryStepy.map((item, index) => {
                    return <OrderDetailsItem {...item} key={index} />;
                  })}
                </Stack>
              </Grid.Item>
              {to.length > 0 && (
                <Grid.Item>
                  <iframe
                    width="100%"
                    height="450"
                    frameBorder={0}
                    style={{ border: 0 }}
                    referrerPolicy={'no-referrer-when-downgrade'}
                    src={`https://www.google.com/maps/embed/v1/directions?key=${googleMapKey}&origin=${googleMapOrigin}&destination=${to}`}
                  />
                </Grid.Item>
              )}
            </Grid>
          </Stack>
        </Card.Body>
      </Card.Root>
    </InfoMainPage>
  );
};

export default Order;
