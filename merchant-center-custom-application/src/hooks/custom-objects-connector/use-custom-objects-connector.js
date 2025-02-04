import {
  useMcQuery,
  useMcMutation,
} from '@commercetools-frontend/application-shell';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import { extractErrorFromGraphQlResponse } from '../../helpers';
import QueryCustomObjects from './query-custom-objects.ctp.graphql';
import GetCustomObjectDetails from './get-custom-object-details.ctp.graphql';
import UpdateCustomObject from './update-custom-object-details.ctp.graphql';

export const useCustomObjectsQuery = ({
  param,
  page,
  perPage,
  tableSorting,
}) => {
  const { data, error, loading } = useMcQuery(QueryCustomObjects, {
    variables: {
      container: `${param}`,
      limit: perPage.value,
      offset: (page.value - 1) * perPage.value,
      sort: [`${tableSorting.value.key} ${tableSorting.value.order}`],
    },
    context: {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
    },
  });

  return {
    customObjectsPaginatedResult: data?.customObjects,
    error,
    loading,
  };
};

export const useCustomObjectDetailsGet = ({
  customObjectKey,
  customObjectContainer,
}) => {
  const { data, error, loading } = useMcQuery(GetCustomObjectDetails, {
    variables: {
      customObjectKey,
      customObjectContainer,
    },
    context: {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
    },
  });

  return {
    customObject: data,
    error,
    loading,
  };
};

export const useCustomObjectDetailsUpdater = () => {
  const [updateCustomObject, { loading }] = useMcMutation(UpdateCustomObject);

  const execute = async (formikValues) => {
    const { container, version, key, value } = formikValues;

    try {
      return await updateCustomObject({
        context: {
          target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
        },
        variables: {
          container: container,
          key: key,
          version: version,
          value: JSON.stringify(value),
        },
      });
    } catch (graphQlResponse) {
      throw extractErrorFromGraphQlResponse(graphQlResponse);
    }
  };

  return {
    loading,
    execute,
  };
};
