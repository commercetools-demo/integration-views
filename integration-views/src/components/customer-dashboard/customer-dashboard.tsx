import { FC } from 'react';
import { Grid } from '@commercetools/nimbus';
import {
  Psychology,
  Receipt,
  Person,
  ShoppingCart,
} from '@commercetools/nimbus-icons';
import InfoCard from '../info-card/info-card';
import { useIntl } from 'react-intl';

type Props = {};

export const CustomerDashboard: FC<Props> = ({}) => {
  const { formatNumber } = useIntl();
  const today = new Date();
  return (
    <Grid gap="400" templateColumns="repeat(3, 1fr)">
      <Grid.Item>
        <InfoCard
          title={'Loyalty Program'}
          text={formatNumber(1385)}
          icon={Psychology}
          infos={[
            { label: 'Premium', tone: 'primary', value: formatNumber(1234) },
            { label: 'Status', tone: 'secondary', value: formatNumber(23) },
            {
              label: 'Latest',
              tone: 'information',
              value: formatNumber(423),
            },
          ]}
          ctaText={'Open Loyalty App'}
        />
      </Grid.Item>
      <Grid.Item>
        <InfoCard
          title={'Order Summary'}
          text={'21'}
          icon={ShoppingCart}
          infos={[
            { label: 'Open', tone: 'information', value: formatNumber(1) },
            {
              label: 'Confirmed',
              tone: 'information',
              value: formatNumber(1),
            },
            { label: 'Complete', tone: 'positive', value: formatNumber(17) },
            { label: 'Canceled', tone: 'warning', value: formatNumber(2) },
            { label: 'Lost', tone: 'critical', value: formatNumber(0) },
          ]}
          ctaText={'Open OMS'}
        />
      </Grid.Item>
      <Grid.Item>
        <InfoCard
          title={'Preferred Categories'}
          text={'to buy from'}
          icon={Receipt}
          data={[
            {
              name: 'Home Decor',
              frequency: 7,
              primaryColor: 'var(--nimbus-colors-primary-8)',
              secondaryColor: 'var(--nimbus-colors-primary-11)',
            },
            {
              name: 'Kitchen',
              frequency: 25,
              primaryColor: 'var(--nimbus-colors-purple-8)',
              secondaryColor: 'var(--nimbus-colors-purple-11)',
            },
          ]}
          ctaText={'Open Buying History'}
        />
      </Grid.Item>
      <Grid.Item>
        <InfoCard
          title={'Payment Summary'}
          text={formatNumber(57)}
          icon={Receipt}
          data={[
            {
              name: 'Credit Card',
              frequency: 7,
              primaryColor: 'var(--nimbus-colors-primary-8)',
              secondaryColor: 'var(--nimbus-colors-primary-11)',
            },
            {
              name: 'Paypal',
              frequency: 25,
              primaryColor: 'var(--nimbus-colors-purple-8)',
              secondaryColor: 'var(--nimbus-colors-purple-11)',
            },
            {
              name: 'Pickup & Cash',
              frequency: 25,
              primaryColor: 'var(--nimbus-colors-teal-8)',
              secondaryColor: 'var(--nimbus-colors-teal-11)',
            },
          ]}
          ctaText={'Open PSP'}
        />
      </Grid.Item>
      <Grid.Item>
        <InfoCard
          title={'Contact History'}
          text={'5 Contacts'}
          icon={Person}
          listData={[
            {
              date: today.setDate(today.getDate() - 1),
              headline: 'Call',
              body: 'Waiting for parcel',
            },
            {
              date: today.setDate(today.getDate() - 1),
              headline: 'Newsletter Click',
              body: 'on product 4712',
            },
            {
              date: today.setDate(today.getDate() - 1),
              headline: 'Newsletter Click',
              body: 'on category "Kitchen"',
            },
          ]}
        />
      </Grid.Item>
    </Grid>
  );
};

export default CustomerDashboard;
