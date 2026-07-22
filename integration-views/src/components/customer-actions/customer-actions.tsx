import { FC, useState } from 'react';
import {
  Alert,
  Button,
  LoadingSpinner,
  Stack,
  Text,
} from '@commercetools/nimbus';
import { PageNotFound } from '@commercetools-frontend/application-components';
import {
  getErrorMessage,
  useCustomerConfirmEmail,
  useCustomerCreateEmailVerificationToken,
  useCustomerFetcher,
} from 'commercetools-demo-shared-data-fetching-hooks';

type Props = { id: string };

export const CustomerActions: FC<Props> = ({ id }) => {
  const { customer, loading, error } = useCustomerFetcher({
    id: id,
  });

  const [updateState, setUpdateState] = useState('');

  const { execute: customerCreateEmailVerificationToken } =
    useCustomerCreateEmailVerificationToken();
  const { execute: customerConfirmEmail } = useCustomerConfirmEmail();

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
  if (!customer) {
    return <PageNotFound />;
  }

  const onClick = () => {
    customerCreateEmailVerificationToken({ id: id, ttlMinutes: 100 })
      .then(({ customerCreateEmailVerificationToken }) => {
        const token = customerCreateEmailVerificationToken?.value;
        if (token) {
          customerConfirmEmail({ tokenValue: token })
            .then(() => {
              setUpdateState('Customer verified');
            })

            .catch((error) => {
              setUpdateState(error);
            });
        } else {
          setUpdateState('No token generated');
        }
      })
      .catch((error) => {
        setUpdateState(error);
      });
  };

  return (
    <Stack direction="column" gap="600">
      <Text textStyle="sm">
        This customer has not yet verified their email.
      </Text>
      <Stack direction="row" gap="600">
        <Button variant="solid" onPress={onClick}>
          Verify now
        </Button>
      </Stack>
      <Text textStyle="sm">{updateState}</Text>
    </Stack>
  );
};

export default CustomerActions;
