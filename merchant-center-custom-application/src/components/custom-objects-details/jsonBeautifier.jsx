import React from 'react';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactJson from 'react-json-view';

const JsonBeautifierPanel = ({ formik, isReadOnly, handleChange }) => {
  const [jsonObject, setJsonObject] = useState({});

  useEffect(() => {
    setJsonObject(formik.values.value);
  }, [formik.values.value]);

  return (
    <div>
      <ReactJson
        src={jsonObject}
        name={false}
        collapsed={1}
        enableClipboard={false}
        displayDataTypes={false}
        readOnly={isReadOnly}
        onEdit={(e) =>
          handleChange({
            target: {
              name: 'value',
              value: e.updated_src,
            },
          })
        }
      />
    </div>
  );
};

JsonBeautifierPanel.propTypes = {
  formik: PropTypes.object.isRequired,
  isReadOnly: PropTypes.bool.isRequired,
};

export default JsonBeautifierPanel;
