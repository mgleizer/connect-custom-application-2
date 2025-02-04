import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import {
  PageNotFound,
  FormModalPage,
} from '@commercetools-frontend/application-components';
import { ContentNotification } from '@commercetools-uikit/notifications';
import Text from '@commercetools-uikit/text';
import Spacings from '@commercetools-uikit/spacings';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import { useCallback } from 'react';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { formatLocalizedString } from '@commercetools-frontend/l10n';
import { DOMAINS } from '@commercetools-frontend/constants';
import { useIsAuthorized } from '@commercetools-frontend/permissions';
import {
  useShowNotification,
  useShowApiErrorNotification,
} from '@commercetools-frontend/actions-global';
import { PERMISSIONS } from '../../constants';
import {
  useCustomObjectDetailsGet,
  useCustomObjectDetailsUpdater,
} from '../../hooks/custom-objects-connector/use-custom-objects-connector';
import CustomObjectsForm from './custom-objects-form';
import { transformErrors } from './transform-errors';
import messages from './messages';
import { ApplicationPageTitle } from '@commercetools-frontend/application-shell';

const CustomObjectDetails = (props) => {
  const intl = useIntl();
  const params = useParams();

  const canManage = useIsAuthorized({
    demandedPermissions: [PERMISSIONS.Manage],
  });
  const showNotification = useShowNotification();
  const showApiErrorNotification = useShowApiErrorNotification();
  const customObjectDetailsUpdater = useCustomObjectDetailsUpdater();
  const { dataLocale, projectLanguages } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale ?? '',
    projectLanguages: context.project?.languages ?? [],
  }));
  const { loading, error, customObject } = useCustomObjectDetailsGet({
    customObjectContainer: params.container,
    customObjectKey: params.key,
  });

  const handleSubmit = useCallback(
    async (formikValues, formikHelpers) => {
      try {
        await customObjectDetailsUpdater.execute(formikValues);
        showNotification({
          kind: 'success',
          domain: DOMAINS.SIDE,
          text: intl.formatMessage(messages.customObjectUpdated, {
            customObjectKey: formatLocalizedString(formikValues, {
              key: 'key',
              locale: dataLocale,
              fallbackOrder: projectLanguages,
            }),
          }),
        });
      } catch (error) {
        const transformedErrors = transformErrors(error);
        if (transformedErrors.unmappedErrors.length > 0) {
          showApiErrorNotification({
            errors: transformedErrors.unmappedErrors,
          });
        }

        formikHelpers.setErrors(transformedErrors.formErrors);
      }
    },
    [
      customObject,
      customObjectDetailsUpdater,
      dataLocale,
      intl,
      projectLanguages,
      showApiErrorNotification,
      showNotification,
    ]
  );

  if (customObject) {
    return (
      <CustomObjectsForm
        // initialValues={docToFormValues(customObject, projectLanguages)}
        initialValues={customObject}
        onSubmit={handleSubmit}
        isReadOnly={!canManage}
        dataLocale={dataLocale}
      >
        {(formProps) => {
          const customObjectKey = formProps.values?.key;

          return (
            <FormModalPage
              title={customObjectKey}
              isOpen
              onClose={props.onClose}
              isPrimaryButtonDisabled={
                formProps.isSubmitting || !formProps.isDirty || !canManage
              }
              isSecondaryButtonDisabled={!formProps.isDirty}
              onSecondaryButtonClick={formProps.handleReset}
              onPrimaryButtonClick={formProps.submitForm}
              labelPrimaryButton={FormModalPage.Intl.save}
              labelSecondaryButton={FormModalPage.Intl.revert}
            >
              {loading && (
                <Spacings.Stack alignItems="center">
                  <LoadingSpinner />
                </Spacings.Stack>
              )}
              {error && (
                <ContentNotification type="error">
                  <Text.Body>
                    {intl.formatMessage(
                      messages.customObjectsDetailsErrorMessage
                    )}
                  </Text.Body>
                </ContentNotification>
              )}
              {customObject && formProps.formElements}
              {customObject && (
                <ApplicationPageTitle additionalParts={[customObjectKey]} />
              )}
              {customObject === null && <PageNotFound />}
            </FormModalPage>
          );
        }}
      </CustomObjectsForm>
    );
  } else {
    return <>Loading...</>;
  }
};
CustomObjectDetails.displayName = 'CustomObjectDetails';
CustomObjectDetails.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default CustomObjectDetails;
