# useShortcut react hook

Install it with yarn:

```
yarn add react-use-form
```

Or with npm:

```
npm i react-use-form --save
```

## Demo

The simplest way to start playing around with react-use-form is with this CodeSandbox snippet:
https://codesandbox.io/s/jj8l8y0m79

```javascript
import React, { useState } from 'react';
import useForm from 'react-use-form';

export default function MyComponent() {
  const [Form, formData, serializeFormData] = useForm();

  const { isValid } = formData;
  return (
    <div>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          console.log(serializeFormData());
        }}
      >
        <input type="text" name="field1" validation={['required']} />
        <input type="text" name="field2" validation={['number']} />
        <button type="submit" disabled={!isValid}>
          SUBMIT
        </button>
      </Form>
    </div>
  );
}
```
