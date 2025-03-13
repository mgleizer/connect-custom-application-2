import React from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import { useIntl } from 'react-intl';
import TextField from '@commercetools-uikit/text-field';
import Spacings from '@commercetools-uikit/spacings';
import validate from './validate';
import messages from './messages';
import CollapsiblePanel from '@commercetools-uikit/collapsible-panel';
import JsonBeautifierPanel from './jsonBeautifier';
import Text from '@commercetools-uikit/text';
import { useState } from 'react';

const CustomObjectsForm = (props) => {
  const intl = useIntl();
  const formik = useFormik({
    initialValues: props.initialValues.customObject,
    onSubmit: props.onSubmit,
    validate,
    enableReinitialize: true,
  });
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let parsedValue = value;

    if (name === 'value' && typeof value === Object) {
      try {
        parsedValue = JSON.parse(value);
      } catch (error) {
        console.error('Invalid JSON:', error);
      }
    }

    formik.setFieldValue(name, parsedValue);
  };

  const formElements = (
    <Spacings.Stack scale="l">
      <TextField
        name="container"
        title={intl.formatMessage(messages.customObjectContainer)}
        value={formik.values.container}
        errors={formik.errors.key}
        touched={Boolean(formik.touched.key)}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        isReadOnly={true}
        horizontalConstraint={13}
        renderError={(errorKey) => {
          if (errorKey === 'duplicate') {
            return intl.formatMessage(messages.duplicateKey);
          }
          return null;
        }}
      />
      <TextField
        name="key"
        title={intl.formatMessage(messages.customObjectKeyLabel)}
        value={formik.values.key}
        errors={formik.errors.key}
        touched={formik.touched.key}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        isReadOnly={true}
        renderError={(errorKey) => {
          if (errorKey === 'duplicate') {
            return intl.formatMessage(messages.duplicateKey);
          }
          return null;
        }}
        isRequired
        horizontalConstraint={13}
      />
      {typeof formik.values.value === 'object' ? (
        <CollapsiblePanel
          isClosed={isPanelOpen}
          onToggle={() => setIsPanelOpen(!isPanelOpen)}
          header="Value"
          name="value"
        >
          <JsonBeautifierPanel
            formik={formik}
            intl={intl}
            messages={messages}
            isReadOnly={props.isReadOnly}
            handleChange={handleChange}
          />
          <Text.Body
            name="value"
            title={intl.formatMessage(messages.customObjectValue)}
            value={JSON.stringify(formik.values.value, null)}
            errors={formik.errors.key}
            touched={formik.touched.key}
            onChange={handleChange}
            onBlur={formik.handleBlur}
            isReadOnly={props.isReadOnly}
            renderError={(errorKey) => {
              if (errorKey === 'duplicate') {
                return intl.formatMessage(messages.duplicateKey);
              }
              return null;
            }}
            isRequired
          />
        </CollapsiblePanel>
      ) : (
        <TextField
          name="value"
          title={intl.formatMessage(messages.customObjectValue)}
          value={formik.values.value}
          errors={formik.errors.key}
          touched={formik.touched.key}
          onChange={handleChange}
          onBlur={formik.handleBlur}
          isReadOnly={props.isReadOnly}
          renderError={(errorKey) => {
            if (errorKey === 'duplicate') {
              return intl.formatMessage(messages.duplicateKey);
            }
            return null;
          }}
          isRequired
          horizontalConstraint={13}
        />
      )}
    </Spacings.Stack>
  );

  return props.children({
    formElements,
    values: formik.values,
    isDirty: formik.dirty,
    isSubmitting: formik.isSubmitting,
    submitForm: formik.handleSubmit,
    handleReset: formik.handleReset,
  });
};
CustomObjectsForm.displayName = 'CustomObjectsForm';
CustomObjectsForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.shape({
    id: PropTypes.string,
    key: PropTypes.string,
    version: PropTypes.number,
    container: PropTypes.string,
  }),
  isReadOnly: PropTypes.bool.isRequired,
  dataLocale: PropTypes.string.isRequired,
};

export default CustomObjectsForm;
