export default {
  required: (value) => !!value,
  number: (value) => !isNaN(value),
};
