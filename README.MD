# React Form Builder
>A React dynamic form builder component

An easy way to build type-safe forms with dynamic fields and validations. This component is built on top of `react-hook-form` and `Zod`, and uses `shadcn-ui` components for styling. It is still in development and not published yet.

You can try out the example at [form-builder](https://seifmegahed-form-builder.vercel.app/)

## Why?
Writing forms is tedious and repetitive. While react-hook-form is a great library, it usually results in a lot of repetitive code, and making a reusable type-safe component out of it is a bit complicated.
This project aims to solve this problem by providing a reusable form builder component
The component can also be used to dynamically build user generated forms with type-safety and validations as shown in the example where a form is used to generate fields in another form.

## How?
The way you use the component is by passing an array of objects that describe the fields of the form to a class. The class will then give you a schema object and a default values object which you can use to initialize the form like you would normally do with `react-hook-form`.

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

## Structure
This project repo contains two workspaces. 

The `apps` folder contains the example app and the form builder component. 

the `cli` folder contains a cli tool to generate the form builder component files in your project.

```tree
.
├── apps
│   └── example
│       └── src
│           ├── app
│           └── components
│               └── form-builder
└── cli
```

## Installation

Initialize `shadcn-ui`
```bash
npx shadcn-ui init
```

Add the following `shadcn-ui` components. 
The `form` component installs all the necessary dependencies (`react-hook-form`, `zod`, and `@hookform/resolvers`) and adds the form-builder component.
```bash
npx shadcn-ui add form select checkbox label input textarea
```

Add the form-builder component (not published yet)
```bash
npx react-form-builder
```
You can also copy the code from the form-builder folder located at `./apps/example/src/components/form-builder` into your project.

## Usage

```tsx
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { 
  zodResolver, 
  type FieldDataType, 
  FieldType, 
  emptyToUndefined 
} from '@hookform/resolvers/zod'

import { FormBuilder } from '@/components/form-builder'

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

function FormDemo() {
  const formClass = new FormBuilder<typeof formData>(formData)
  const form = useForm<z.infer<typeof formClass.schema>>({
    resolver: zodResolver(formClass.schema),
    defaultValues: formClass.defaultValues,
  })

  const onSubmit = (data: z.infer<typeof formClass.schema>) => {
    console.log(data)
    form.reset()
  }
  
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid gap-x-3 md:grid-cols-4">
        {formClass.fields<typeof formData, z.infer<typeof formClass.schema>>({
          form,
        })}
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
