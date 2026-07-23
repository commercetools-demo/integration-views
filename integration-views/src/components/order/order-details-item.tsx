import { Icon, Stack, Text } from '@commercetools/nimbus';
import { CheckCircle } from '@commercetools/nimbus-icons';
import { FormattedDate } from 'react-intl';
import { FC } from 'react';

export type DetailsItemProps = {
  date: number;
  headline: string;
  body: string;
};
const OrderDetailsItem: FC<DetailsItemProps> = ({ date, headline, body }) => {
  return (
    <Stack direction="row" align="center">
      <Icon as={CheckCircle} color="primary.11" size={'2xs'} />

      <Stack direction="column" gap="100">
        <Text textStyle="xs">
          <FormattedDate value={date} />
        </Text>
        <Stack direction="row" gap="200">
          <Text fontWeight="bold">{headline}:</Text>
          <Text>{body}</Text>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default OrderDetailsItem;
