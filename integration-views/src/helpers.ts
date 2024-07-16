import { ApolloError, isApolloError, ServerError } from '@apollo/client';
import {
  TAddress,
  TBaseMoney,
  THighPrecisionMoney,
} from './types/generated/ctp';
import { IntlShape } from 'react-intl';

export const getErrorMessage = (error: ApolloError) =>
  error.graphQLErrors?.map((e) => e.message).join('\n') || error.message;

const isServerError = (
  error: ApolloError['networkError']
): error is ServerError => {
  return Boolean((error as ServerError)?.result);
};

export const extractErrorFromGraphQlResponse = (graphQlResponse: unknown) => {
  if (graphQlResponse instanceof Error && isApolloError(graphQlResponse)) {
    if (
      isServerError(graphQlResponse.networkError) &&
      typeof graphQlResponse.networkError?.result !== 'string' &&
      graphQlResponse.networkError?.result?.errors.length > 0
    ) {
      return graphQlResponse?.networkError?.result.errors;
    }

    if (graphQlResponse.graphQLErrors?.length > 0) {
      return graphQlResponse.graphQLErrors;
    }
  }

  return graphQlResponse;
};

export function getFractionedAmount(moneyValue: TBaseMoney) {
  const { fractionDigits = 2 } = moneyValue;

  // the amount should be available on preciseAmount for highPrecision
  const amount =
    moneyValue.type === 'highPrecision'
      ? (moneyValue as THighPrecisionMoney).preciseAmount
      : moneyValue.centAmount;

  return amount / 10 ** fractionDigits;
}

export function formatMoney(
  moneyValue: TBaseMoney | undefined | null,
  intl: IntlShape,
  options?: Record<string, unknown>
) {
  if (!moneyValue || !moneyValue.currencyCode) {
    return '';
  }
  return intl.formatNumber(getFractionedAmount(moneyValue), {
    style: 'currency',
    currency: moneyValue.currencyCode,
    minimumFractionDigits: moneyValue.fractionDigits,
    ...options,
  });
}

const joinMe = (input: Array<string | undefined | null>, separator = ' ') => {
  return input.filter((item) => item).join(separator);
};

export const formatAddress = (address?: TAddress | null) => {
  if (!address) {
    return '';
  }
  const name = joinMe([address.firstName, address.lastName]);
  const addressAsString = joinMe([address.streetName, address.streetNumber]);
  return joinMe(
    [name, addressAsString, address.postalCode, address.city, address.country],
    ', '
  );
};
