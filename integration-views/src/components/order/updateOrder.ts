import { useMcMutation } from '@commercetools-frontend/application-shell-connectors';
import {
  TMutation,
  TMutation_UpdateOrderArgs,
} from '../../types/generated/ctp';

import UpdateQuery from './update-order.ctp.graphql';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
export const useOrderUpdater = () => {
  const [updateCartId, { loading }] = useMcMutation<
    TMutation,
    TMutation_UpdateOrderArgs
  >(UpdateQuery);

  const execute = async ({
    actions,
    id,
    version,
  }: TMutation_UpdateOrderArgs) => {
    try {
      if (actions.length > 0) {
        return await updateCartId({
          context: {
            target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
          },
          variables: {
            id: id,
            version: version || 1,
            actions: actions,
          },
        });
      }
      return Promise.resolve(undefined);
    } catch (graphQlResponse) {
      console.log(graphQlResponse);
      throw new Error();
    }
  };

  return {
    loading,
    execute,
  };
};
