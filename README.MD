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
type FieldDataType = {
  name: string;
  label: string;
  type: FieldType;
  default: defaultValueTypes;
  schema: z.ZodType;
  options?:
    | readonly string[]
    | readonly { value: string | number; label: string }[];
  hidden?: boolean;
  className?: string;
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
    schema: z.preprocess(emptyToUndefined, z.string()),
  },
  {
    name: 'email',
    label: 'Email',
    type: FieldType.Text,
    className: "md:col-span-2",
    default: "john@doe.com",
    schema: z.preprocess(emptyToUndefined, z.string().email()),
  },
  {
    name: 'date-of-admission',
    label: 'Date of Admission',
    type: FieldType.DatePicker,
    className: "md:col-span-2",
    default: new Date(),
    schema: z.date(),
  },
  {
    name: 'age',
    label: 'Age',
    type: FieldType.Number,
    className: "md:col-span-2",
    default: 18,
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

## Contributing
Contributions are welcome. Please check out the [contribution guidelines](https://github.com/seifmegahed/form-generator/blob/main/CONTRIBUTING.md).

## License
MIT License checkout the [license](https://github.com/seifmegahed/form-generator/blob/main/LICENSE.md) file.
