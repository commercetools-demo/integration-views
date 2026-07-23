import { FC, useState } from 'react';
import { Button, NumberInput, Stack } from '@commercetools/nimbus';
import messages from './messages';
import { useIntl } from 'react-intl';

export type Props = {
  onChange: (quantity: number) => void;
  quantity?: number;
};

const QuantitySelector: FC<Props> = ({ quantity, onChange }) => {
  const intl = useIntl();
  const [numberValue, setNumberValue] = useState<number>(quantity || 1);

  return (
    <Stack direction="row">
      <NumberInput
        value={numberValue}
        onChange={setNumberValue}
        label={'quantity'}
      />
      <Button
        colorPalette="primary"
        isDisabled={!numberValue || numberValue === quantity}
        onPress={() => onChange(numberValue)}
      >
        {intl.formatMessage(messages.apply)}
      </Button>
    </Stack>
  );
};

export default QuantitySelector;
