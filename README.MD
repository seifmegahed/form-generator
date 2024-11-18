# React Form Generator
**A Type-Safe, Dynamic Form Generator**

An easy way to build type-safe forms with dynamic fields and validations. This component is built on top of `react-hook-form` and `Zod`, and uses `shadcn-ui` components for styling.

### Features
- Single source of truth
- Type-safety
- Dynamically generated fields
- Flexible validations
- Minimal setup

### Supported Fields
- Text
- Number
- Select
- Combo Select
- Checkbox
- Date Picker

You can try out the example at [form-generator](https://create-form-generator.vercel.app/)

## Why?
Writing forms is tedious and repetitive. While react-hook-form is a great library, it usually results in a lot of repetitive code, and making a reusable type-safe component out of it is a bit complicated.
This project aims to solve this problem by providing a reusable form generator component
The component can also be used to dynamically build forms with type-safety, type inference/ts-autocomplete, and flexible validations.


**A form to generate forms.**

You can create user-generated forms as shown in the [example](https://create-form-generator.vercel.app/) where a form is used to generate fields for another form. 

## How?
The way you use the component is by passing an array of objects that describe the fields of the form to a class. You can use the schema and default values provided by the class to initialize your form using `react-hook-form`.

The field object is of type `FieldDataType` and looks like this:
```ts
/**
 * This is a simple representation of the field data type.
 * The actual implementation has more field specific properties.
 * 
 * You can find the implementation in the `src/apps/example/src/form-generator/types.ts` file.
 */
type FieldDataType = {
  name: string;
  label: string;
  type: FieldType;
  default: defaultValueTypes;
  schema: z.ZodType;
  required: boolean;
  options?:
    | readonly string[]
    | readonly { value: string | number; label: string }[];
  hidden?: boolean;
  className?: string;
  description?: string | ReactNode;
};
```

Creating the form should look like this:
```tsx
// Define your form fields
const formData: FieldDataType[] = [ /*...*/ ];

function FormExample() {
...
// Initialize the form generator
const formGenerator = new FormGenerator<typeof formData>(formData)

const schema = z.object(formGenerator.schema)

type SchemaType = z.infer<typeof schema>

// Create a react-hook-form form instance
const form = useForm<SchemaType>({
  resolver: zodResolver(schema),
  defaultValues: formGenerator.defaultValues,
  })
...
}
```

And inside the tsx you can pass the fields like this:
```tsx
return (
  ...
  <form>
    {formGenerator.fields(form)}
  </form>
  ...
)
```

## Structure
This project repo contains two workspaces. 

The `apps` folder contains the example app and the form generator component. 

the `cli` folder contains a cli tool to generate the form generator component files in your project.

```
.
├── apps
│   └── example
│       └── src
│           └── form-generator
└── cli
```

## Installation

The form generator uses [shadcn-ui](https://ui.shadcn.com) components.
Initialize `shadcn-ui`

```bash
npx shadcn-ui init
```

Add the following `shadcn-ui` components. 
The `form` component installs all the necessary dependencies (`react-hook-form`, `zod`, and `@hookform/resolvers`) required by the form-generator component.
```bash
npx shadcn-ui add form label 
```
Add the following components depending on the fields you want to use.
- Text
  - input
- Select
  - select
- Combo Select
  - popover
  - command
- Textarea
  - textarea
- Checkbox
  - checkbox
- Date Picker
  - calendar
  - popover

```bash
npx shadcn-ui add select checkbox input textarea calendar popover
```


Add the form-generator component
```bash
npx create-form-generator
```
You can also copy the code from the form-generator folder located at `./apps/example/src/form-generator` into your project.

## Example Usage

```tsx
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { FormGenerator, FieldType, emptyToUndefined } from '@/components/form-generator'

import { Button } from '@/components/ui/button'

const formData: FieldDataType[] = [
  {
    name: 'name',
    label: 'Name',
    type: FieldType.Text,
    className: "md:col-span-2",
    default: "John Doe",
    description: "Enter your name",
    required: true,
    schema: z.preprocess(emptyToUndefined, z.string()),
  },
  {
    name: 'email',
    label: 'Email',
    type: FieldType.Text,
    className: "md:col-span-2",
    default: "john@doe.com",
    description: "Enter your email",
    required: true,
    schema: z.preprocess(emptyToUndefined, z.string().email()),
  },
  {
    name: 'date-of-admission',
    label: 'Date of Admission',
    type: FieldType.DatePicker,
    className: "md:col-span-2",
    default: new Date(),
    description: <p>Select your date of admission</p>, 
    required: true,
    schema: z.date(),
  },
  {
    name: 'age',
    label: 'Age',
    type: FieldType.Number,
    className: "md:col-span-2",
    default: 18,
    required: true,
    schema: z.preprocess(
      emptyToUndefined, 
      z.preprocess(
        (v) => Number(v), 
        z.number().min(18)
      )
    ),
  },
] as const;

function FormExample() {
  const formGenerator = new FormGenerator<typeof formData>(formData)

  const schema = z.object(formGenerator.schema)

  type SchemaType = z.infer<typeof schema>

  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: formGenerator.defaultValues,
  })

  const onSubmit = (data: SchemaType) => {
    console.log(data)
    form.reset()
  }
  
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid gap-x-3 md:grid-cols-4">
        {formGenerator.fields(form)}
      </div>
      <div className="flex justify-end py-5">
        <Button
          type="submit"
          className="rounded-md px-12 py-2 font-medium"
          disabled={form.formState.isSubmitting}
        >
          Save
        </Button>
      </div>
    </form>
  )
}
```

## The "Optional Field" and Default Values Problem

Normally, when creating a form, some fields are required and some are optional. However in the case of the form-generator, using the zod schema `.optional()` method will result in type errors. Additionally, React does not like it when you pass an undefined value to a controlled field.

To solve this problem, you can use the `emptyToNull` preprocessor method to convert an empty string to null. This will allow you to use the `.nullable()` method on the zod schema to make the field optional. 

```tsx
import { z } from 'zod'
import { emptyToNull } from '@/components/form-generator/utils'

const formData = [
  {
    //...
    defaultValue: "",
    schema: z.preprocess(emptyToNull, z.string().nullable()),
  },
]
```

This will behave as you would expect an optional field to behave. However, the result in the case of an empty string will be null instead of undefined.

In the case of a required field, you can use the `emptyToUndefined` preprocessor method to convert an empty string to undefined.

```tsx
import { z } from 'zod'
import { emptyToUndefined } from '@/components/form-generator/utils'

const formData = [
  {
    //...
    defaultValue: "",
    schema: z.preprocess(emptyToUndefined, z.string()),
  },
]
```

This will behave as you would expect a required field to behave.

## Number field tip

As I mentioned above, React expects a defined default value for a controlled field. And `react-hook-form` expects the default value to match the type of the schema. So in the case of a number field, you need to provide a default value of type number.

In my opinion this is a very ugly design. I prefer to use the `TextField` component and do a bit post-processing using zod's `superRefine` method to parse the string to an int or a float.

Here's an example of how you can use the `superRefine` method to parse the string to a number and check if it is a valid number.

```tsx
import { z } from 'zod'

const formData = [
  {
    //...
    name: "age",
    type: FieldType.Text,
    defaultValue: "",
    schema: z.preprocess(emptyToUndefined, z.string()),
  }
] as const;

const generator = new FormGenerator(formData)

const schema = z.object(generator.schema).superRefine((data, ctx) => {
  // Parse the string to an int or a float
  const age = parseInt(data.age);
  // Check if the parsed number is a valid number
  if (isNaN(registrationNumber)) {
    // Register a custom error message
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Age must be a number",
      path: ["age"],
    });
    // Do not allow the form to be submitted
    return false;
  }
  // Swap the parsed number with the original number and return the data
  data.age = age;
  return data;
})
```

## Contributing
Contributions are welcome. Please check out the [contribution guidelines](https://github.com/seifmegahed/form-generator/blob/main/CONTRIBUTING.md).

## License
MIT License checkout the [license](https://github.com/seifmegahed/form-generator/blob/main/LICENSE.md) file.
