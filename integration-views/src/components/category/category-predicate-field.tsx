import { FC } from 'react';
import PredicateConfiguratorFormikField from 'commercetools-demo-shared-predicate-builder';
import { FormikProvider, useFormik } from 'formik';
import { TFormValues } from './category';
import { Button, Heading, Stack } from '@commercetools/nimbus';
import {
  CustomFormMainPage,
  InfoMainPage,
} from '@commercetools-frontend/application-components';
import { useIntl } from 'react-intl';
import { TRawCustomField } from 'commercetools-demo-shared-helpers';

export type Props = {
  existingValue?: TRawCustomField;
  onSubmit: (values: TFormValues) => Promise<void>;
};

const CategoryPredicateField: FC<Props> = ({ existingValue, onSubmit }) => {
  const intl = useIntl();

  const formik = useFormik<TFormValues>({
    initialValues: {
      predicateField: (existingValue?.value as unknown as string) || '',
    },
    onSubmit: onSubmit,
  });
  return (
    <InfoMainPage
      customTitleRow={
        <Stack direction="row" justify="space-between">
          <Heading as="h1" size="lg">
            Category View
          </Heading>
          <Stack direction="row" gap="200">
            <Button
              variant="solid"
              onPress={formik.submitForm}
              isDisabled={formik.isSubmitting || !formik.dirty}
            >
              {intl.formatMessage(CustomFormMainPage.Intl.save)}
            </Button>
            <Button variant="outline">
              {intl.formatMessage(CustomFormMainPage.Intl.delete)}
            </Button>
          </Stack>
        </Stack>
      }
    >
      <FormikProvider value={formik}>
        <PredicateConfiguratorFormikField name={'predicateField'} />
      </FormikProvider>
    </InfoMainPage>
  );
};

export default CategoryPredicateField;
