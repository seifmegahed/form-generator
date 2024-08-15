# React Form Builder
>A React dynamic form builder component

An easy way to build type-safe forms with dynamic fields and validations. This component is built on top of react-hook-form and Zod, and uses shadcn-ui components for styling. It is still in development and not published yet.

Try it out at [form-builder](https://seifmegahed-form-builder.vercel.app/)

## Installation

Install react-hook-form and Zod
```bash
npm install react-hook-form zod @hookform/resolvers
```

Initialize shadcn-ui
```bash
npx shadcn-ui init
```

Add the following shadcn-ui components
```bash
npx shadcn-ui add form select checkbox label input textarea
```

Add the form-builder component (not published yet)
```bash
npx react-form-builder
```

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
