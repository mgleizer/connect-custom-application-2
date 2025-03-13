import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { useState, useEffect } from 'react';
import {
  Link as RouterLink,
  Switch,
  useHistory,
  useRouteMatch,
} from 'react-router-dom';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { NO_VALUE_FALLBACK } from '@commercetools-frontend/constants';
import {
  usePaginationState,
  useDataTableSortingState,
} from '@commercetools-uikit/hooks';
import { BackIcon } from '@commercetools-uikit/icons';
import FlatButton from '@commercetools-uikit/flat-button';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import DataTable from '@commercetools-uikit/data-table';
import { ContentNotification } from '@commercetools-uikit/notifications';
import { Pagination } from '@commercetools-uikit/pagination';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import { SuspendedRoute } from '@commercetools-frontend/application-shell';
import SearchTextInput from '@commercetools-uikit/search-text-input';
import messages from './messages';
import { useCustomObjectsQuery } from '../../hooks/custom-objects-connector/use-custom-objects-connector';
import { getErrorMessage } from '../../helpers';
import CustomObjectDetails from '../custom-objects-details/custom-objects-details';
import { useAsyncDispatch, actions } from '@commercetools-frontend/sdk';
import { MC_API_PROXY_TARGETS } from '@commercetools-frontend/constants';
import { useCustomObjectsContext } from '../../context/custom-objects-context';

const columns = [
  { key: 'container', label: 'Custom object container', isSortable: true },
  { key: 'key', label: 'Custom object key', isSortable: true },
];

const renderItem = (item, column, dataLocale, projectLanguages) => {
  switch (column.key) {
    case 'roles':
      return item.roles.join(', ');
    case 'name':
      return formatLocalizedString(
        { name: transformLocalizedFieldToLocalizedString(item.nameAllLocales) },
        {
          key: 'name',
          locale: dataLocale,
          fallbackOrder: projectLanguages,
          fallback: NO_VALUE_FALLBACK,
        }
      );
    default:
      return item[column.key];
  }
};

const CustomObjects = ({ linkToWelcome }) => {
  const intl = useIntl();
  const { push } = useHistory();
  const match = useRouteMatch();
  const { page, perPage } = usePaginationState();
  const sortingState = useDataTableSortingState({ key: 'key', order: 'asc' });
  const { customObjects, setCustomObjects } = useCustomObjectsContext();

  const { dataLocale, projectLanguages } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale,
    projectLanguages: context.project.languages,
  }));

  const [searchParam, setSearchParam] = useState('');
  const [fetchError, setFetchError] = useState(null);
  const dispatch = useAsyncDispatch();

  // Fetch all custom objects with pagination
  useEffect(() => {
    const fetchAllCustomObjects = async () => {
      try {
        const result = await dispatch(
          actions.get({
            mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
            service: 'customObjects',
            options: {
              page: page.value,
              perPage: perPage.value,
            },
          })
        );
        setCustomObjects(result);
      } catch (error) {
        setFetchError(error);
      }
    };

    fetchAllCustomObjects();
  }, [dispatch, page.value, perPage.value]);

  const {
    customObjectsPaginatedResult,
    error: queryError,
    loading,
  } = useCustomObjectsQuery({
    param: searchParam,
    page,
    perPage,
    tableSorting: sortingState,
  });

  if (fetchError || queryError) {
    return (
      <ContentNotification type="error">
        <Text.Body>{getErrorMessage(fetchError || queryError)}</Text.Body>
      </ContentNotification>
    );
  }

  const handleSearchSubmit = (value) => {
    setSearchParam(value);
  };

  const handleSearchReset = () => {
    setSearchParam('');
  };

  return (
    <Spacings.Stack scale="xl">
      <Spacings.Stack scale="xs">
        <FlatButton
          as={RouterLink}
          to={linkToWelcome}
          label={intl.formatMessage(messages.backToWelcome)}
          icon={<BackIcon />}
        />
        <Text.Headline as="h2" intlMessage={messages.title} />
      </Spacings.Stack>

      {loading && <LoadingSpinner />}

      <SearchTextInput
        placeholder={intl.formatMessage(messages.searchInputTitle)}
        onSubmit={handleSearchSubmit}
        onReset={handleSearchReset}
        horizontalConstraint={7}
      />

      {!searchParam && customObjects ? (
        <>
          <CustomObjectsTable
            data={customObjects.results}
            sortingState={sortingState}
            dataLocale={dataLocale}
            projectLanguages={projectLanguages}
            onRowClick={(row) =>
              push(`${match.url}/${row.container}/${row.key}`)
            }
          />
          <Pagination
            page={page.value}
            onPageChange={page.onChange}
            perPage={perPage.value}
            onPerPageChange={perPage.onChange}
            totalItems={customObjects.total}
          />
          <Switch>
            <SuspendedRoute path={`${match.path}/:container/:key`}>
              <CustomObjectDetails onClose={() => push(`${match.url}`)} />
            </SuspendedRoute>
          </Switch>
        </>
      ) : (
        customObjectsPaginatedResult && (
          <>
            <CustomObjectsTable
              data={customObjectsPaginatedResult.results}
              sortingState={sortingState}
              dataLocale={dataLocale}
              projectLanguages={projectLanguages}
              onRowClick={(row) =>
                push(`${match.url}/${row.container}/${row.key}`)
              }
            />
            <Pagination
              page={page.value}
              onPageChange={page.onChange}
              perPage={perPage.value}
              onPerPageChange={perPage.onChange}
              totalItems={customObjectsPaginatedResult.total}
            />
            <Switch>
              <SuspendedRoute path={`${match.path}/:container/:key`}>
                <CustomObjectDetails onClose={() => push(`${match.url}`)} />
              </SuspendedRoute>
            </Switch>
          </>
        )
      )}
    </Spacings.Stack>
  );
};

const CustomObjectsTable = ({
  data,
  sortingState,
  dataLocale,
  projectLanguages,
  onRowClick,
}) => (
  <Spacings.Stack scale="l">
    <DataTable
      isCondensed
      columns={columns}
      rows={data}
      itemRenderer={(item, column) =>
        renderItem(item, column, dataLocale, projectLanguages)
      }
      sortedBy={sortingState.value.key}
      sortDirection={sortingState.value.order}
      onSortChange={sortingState.onChange}
      onRowClick={onRowClick}
    />
  </Spacings.Stack>
);

CustomObjects.displayName = 'CustomObjects';
CustomObjects.propTypes = {
  linkToWelcome: PropTypes.string.isRequired,
};

CustomObjectsTable.propTypes = {
  data: PropTypes.array.isRequired,
  sortingState: PropTypes.object.isRequired,
  dataLocale: PropTypes.string.isRequired,
  projectLanguages: PropTypes.array.isRequired,
  onRowClick: PropTypes.func.isRequired,
};

export default CustomObjects;
