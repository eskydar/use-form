# useForm hook for React

Install it with yarn:

```
yarn add react-use-former
```

Or with npm:

```
npm i react-use-former --save
```

## Demo

The simplest way to start playing around with react-use-former is with this CodeSandbox snippet:
https://codesandbox.io/s/ym9zlov3nj

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
