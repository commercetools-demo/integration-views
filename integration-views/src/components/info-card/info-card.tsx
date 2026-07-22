import { ElementType, FC } from 'react';
import { useIntl } from 'react-intl';
import {
  Badge,
  Box,
  Button,
  Card,
  Icon,
  Stack,
  Text,
} from '@commercetools/nimbus';
import { List } from '@commercetools/nimbus-icons';
import DonutChart from '../donut-chart';
import { Data } from '../donut-chart/donut-chart';
import OrderDetailsItem, {
  DetailsItemProps,
} from '../order/order-details-item';

type InfoTone =
  | 'positive'
  | 'critical'
  | 'warning'
  | 'information'
  | 'primary'
  | 'secondary';

const toneToColorPalette: Record<
  InfoTone,
  'positive' | 'critical' | 'warning' | 'info' | 'primary' | 'neutral'
> = {
  positive: 'positive',
  critical: 'critical',
  warning: 'warning',
  information: 'info',
  primary: 'primary',
  secondary: 'neutral',
};

type Props = {
  title: string;
  text?: string;
  icon?: ElementType;
  infos?: Array<{ label: string; tone: InfoTone; value: string }>;
  data?: Array<Data>;
  listData?: Array<DetailsItemProps>;
  ctaText?: string;
};

const InfoCard: FC<Props> = ({
  title,
  text,
  icon,
  infos,
  data,
  listData,
  ctaText,
}) => {
  const { formatNumber } = useIntl();
  return (
    <Card.Root>
      <Card.Header>
        <Stack direction="row" gap="300" align="center" justify="flex-start">
          {icon && <Icon as={icon} color="neutral.9" size="2xs" />}
          <Text textStyle="md" color="neutral.11" fontWeight={'500'}>
            {title}
          </Text>
        </Stack>
      </Card.Header>
      <Card.Body>
        <Stack direction="column" gap="300">
          {text && (
            <Text textStyle="lg" fontWeight="500">
              {text}
            </Text>
          )}
          {infos && (
            <Box
              borderTop="solid-25"
              borderTopColor="neutral.6"
              borderBottom="solid-25"
              borderBottomColor="neutral.6"
              py="400"
            >
              <Stack direction="column" gap="300">
                {infos.map((value, index) => (
                  <Stack
                    direction="row"
                    gap="300"
                    justify="space-between"
                    key={index}
                  >
                    <Badge
                      colorPalette={toneToColorPalette[value.tone]}
                      size="2xs"
                    >
                      {value.label}
                    </Badge>
                    <Text>{value.value}</Text>
                  </Stack>
                ))}
              </Stack>
            </Box>
          )}
          {data && (
            <DonutChart
              width={160}
              formatTooltipLabel={(label) => formatNumber(label)}
              data={data}
            />
          )}
          {listData && (
            <Stack direction="column" gap="400">
              {listData.map((item, index) => (
                <OrderDetailsItem {...item} key={index} />
              ))}
            </Stack>
          )}
          {ctaText && (
            <Button
              variant="ghost"
              colorPalette="primary"
              size={'xs'}
              alignSelf="flex-start"
            >
              <Icon as={List} />
              {ctaText}
            </Button>
          )}
        </Stack>
      </Card.Body>
    </Card.Root>
  );
};

export default InfoCard;
