import { FC } from 'react';
import { Alert, LoadingSpinner } from '@commercetools/nimbus';
import { ComponentProps } from '../../routes';
import {
  getErrorMessage,
  graphQLErrorHandler,
  useCategoryFetcher,
  useCategoryUpdater,
  useTypeDefinitionFetcher,
} from 'commercetools-demo-shared-data-fetching-hooks';
import { useShowNotification } from '@commercetools-frontend/actions-global';
import CategoryPredicateField from './category-predicate-field';

export type TFormValues = {
  predicateField?: string;
};

const Category: FC<ComponentProps> = ({ id }) => {
  const showNotification = useShowNotification();
  const { execute } = useCategoryUpdater();
  const {
    typeDefinition,
    error: stateError,
    loading: stateLoading,
  } = useTypeDefinitionFetcher({
    key: 'dynamic-category-assignment',
  });
  const { category, error, loading, refetch } = useCategoryFetcher({
    id: id,
    includeCustomFields: true,
  });

  const existingValue = category?.custom?.customFieldsRaw?.find(
    (item) => item.name === 'predicateField'
  );
  const submit = async (values: TFormValues) => {
    if (category) {
      await execute({
        actions: existingValue
          ? [
              {
                setCustomField: {
                  name: 'predicateField',
                  value: JSON.stringify(values.predicateField),
                },
              },
            ]
          : [
              {
                setCustomType: {
                  typeKey: 'dynamic-category-assignment',
                  fields: [
                    {
                      name: 'predicateField',
                      value: JSON.stringify(values.predicateField),
                    },
                  ],
                },
              },
            ],
        version: category.version,
        id: category.id,
      })
        .then(() => {
          return refetch();
        })
        .catch(graphQLErrorHandler(showNotification));
    }
  };

  if (error) {
    return (
      <Alert.Root colorPalette="critical">
        <Alert.Description>{getErrorMessage(error)}</Alert.Description>
      </Alert.Root>
    );
  }

  if (stateError) {
    return (
      <Alert.Root colorPalette="critical">
        <Alert.Description>{getErrorMessage(stateError)}</Alert.Description>
      </Alert.Root>
    );
  }

  if (loading || stateLoading) {
    return <LoadingSpinner />;
  }

  if (!category) {
    return (
      <Alert.Root colorPalette="info">
        <Alert.Description>No Results</Alert.Description>
      </Alert.Root>
    );
  }

  if (
    !typeDefinition ||
    !typeDefinition.fieldDefinitions.find(
      (fieldDefinition) => fieldDefinition.name === 'predicateField'
    )
  ) {
    return (
      <Alert.Root colorPalette="info">
        <Alert.Description>{`Missing Type with key "dynamic-category-assignment" for "category" with string field "predicateField"`}</Alert.Description>
      </Alert.Root>
    );
  }

  return (
    <CategoryPredicateField existingValue={existingValue} onSubmit={submit} />
  );
};

export default Category;
