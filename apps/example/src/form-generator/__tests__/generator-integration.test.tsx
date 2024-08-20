import {
  act,
  cleanup,
  fireEvent,
  render,
  renderHook,
  screen,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import FormGeneratorClass from "../generator";
import { type FieldDataType, FieldType } from "../types";
import { z } from "zod";
import { emptyToUndefined } from "../utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const formTestFields: Record<string, readonly FieldDataType[]> = {
  text: [
    {
      name: "testField",
      label: "Test Field",
      className: "md:col-span-2",
      type: FieldType.Text,
      default: "",
      schema: z.preprocess(emptyToUndefined, z.string()),
    },
  ] as const,
};

afterEach(() => {
  cleanup();
});

const onSubmitStub = vi.fn((_data: Record<string, unknown>) => void 0);

describe("Form Generator", () => {
  it("should render form with text input field", async () => {
    const formFields = formTestFields.text!;
    const formGenerator = new FormGeneratorClass(formFields);
    const schema = z.object(formGenerator.schema);
    type FormSchemaType = z.infer<typeof schema>;
    const { result } = renderHook(() =>
      useForm<FormSchemaType>({
        resolver: zodResolver(schema),
        defaultValues: formGenerator.defaultValues,
      }),
    );
    const form = result.current;
    if (!form) throw new Error("form not found");
    render(
      <form
        data-testid="form"
        onSubmit={form.handleSubmit((data) => onSubmitStub(data))}
      >
        {formGenerator.fields<typeof formFields, FormSchemaType>({
          form,
        })}
        <button data-testid="submit-button" type="submit">
          Submit
        </button>
      </form>,
    );
    const submitButton = screen.getByTestId("submit-button");
    if (!submitButton) throw new Error("submit button not found");
    const formElement = screen.getByTestId("form");
    if (!formElement) throw new Error("form not found");
    const inputField = formElement.querySelector("input");
    if (!inputField) throw new Error("input field not found");
    await act(async () => fireEvent.click(submitButton));
    expect(onSubmitStub).toHaveBeenCalledTimes(0);
    // console.log(screen.getByText("Required"));
    await act(async () => {
      fireEvent.change(inputField, { target: { value: "test value" } });
      fireEvent.click(submitButton);
    });
    expect(onSubmitStub).toHaveBeenCalledWith({ testField: "test value" });
  });
});