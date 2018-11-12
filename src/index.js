import React, { useState, useRef } from 'react';
import validators from './validators';

const allowedChildren = ['input'];
const defaultOptions = {
  invalidFieldClass: 'invalid',
};
const initialFieldData = {
  isValid: true,
  value: '',
  isPristine: true,
  isDirty: false,
  error: null,
};
const initialFormData = {
  isValid: true,
  isPristine: true,
  isDirty: false,
  fields: {},
};

const useForm = (options = {}) => {
  // Create options object
  options = { ...defaultOptions, ...options };
  const [formData, setFormData] = useState(initialFormData);
  const focussedInput = useRef(null);
  const initialized = useRef(false);

  // Validate single input value
  const validate = (name, value, fieldValidators) => {
    if (fieldValidators === undefined || !fieldValidators.length) return true;
    let error = null;
    fieldValidators.every((validator) => {
      const isValid = validators[validator](value);
      if (!isValid) error = validator;
      return isValid;
    });
    return { isValid: !error, error };
  };

  // Initialize the fields on first render
  // Will go through children and place them in our config with default values
  const initializeFields = (childrenArray) => {
    const initialFields = childrenArray.reduce((prev, child) => {
      if (allowedChildren.indexOf(child.type) === -1) return prev;
      const { props } = child;
      const isValid = props.validation && props.validation.indexOf('required') > -1 ? false : true;
      prev[props.name] = { ...initialFieldData, isValid };
      return prev;
    }, {});
    const patchedFormData = { ...formData, fields: initialFields };
    if (!isFormValid(patchedFormData)) patchedFormData.isValid = false;
    setFormData(patchedFormData);
  };

  // Return serialized form data
  const serializeFormData = () => {
    const { fields } = formData;
    return Object.keys(fields).reduce((prev, field) => {
      prev[field] = fields[field].value;
      return prev;
    }, {});
  };

  // Check if all the fields in the form are valid
  const isFormValid = (patchedFormData = formData) =>
    Object.keys(patchedFormData.fields).every((key) => patchedFormData.fields[key].isValid);

  // Handle the value change on the input
  const handleInputValueChange = ({ target: { value } }, name, fieldValidators) => {
    const patchedFormData = {
      ...formData,
      fields: {
        ...formData.fields,
        [name]: { value, ...validate(name, value, fieldValidators) },
      },
    };

    const isValid = isFormValid(patchedFormData);

    setFormData({
      ...patchedFormData,
      isValid,
      isDirty: true,
      isPristine: false,
    });
  };

  // Get input data for field with given name
  const getInputData = (name) => formData.fields[name] || {};

  const Form = ({ children, ...rest }) => {
    // Turn children into array of children
    let childrenArray = React.Children.toArray(children);
    // Now that we have an array of children we want to
    // Validate the form on initalize so that required fields are invalid
    if (!initialized.current) {
      initializeFields(childrenArray);
      initialized.current = true;
    }

    childrenArray = childrenArray.map((child) => {
      if (allowedChildren.indexOf(child.type) === -1) return child;
      let { props } = child;
      if (!props.hasOwnProperty('name') || props.name === '') {
        throw new Error(`[useFormValidation]: Your ${child.type} element required the name attribute`);
      }
      const inputData = getInputData(props.name);
      props = {
        ...props,
        autoFocus: focussedInput.current === props.name,
        onChange: (e) => {
          e.preventDefault();
          if (props.handleValueChange) props.handleValueChange(e);
          handleInputValueChange(e, props.name, props.validation);
          focussedInput.current = props.name;
        },
        value: inputData.value,
        className: `${props.className} ${!inputData.isValid && options.invalidFieldClass}`,
      };
      return { ...child, props };
    });
    return <form {...rest}>{childrenArray}</form>;
  };

  return [Form, formData, serializeFormData];
};

export default useForm;
