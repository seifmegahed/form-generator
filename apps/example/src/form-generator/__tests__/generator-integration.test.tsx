import {
  act,
  cleanup,
  fireEvent,
  render,
  renderHook,
  screen,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import ResizeObserver from "resize-observer-polyfill";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import FormGeneratorClass from "../generator";
import { type FieldDataType, FieldType } from "../types";
import { emptyToUndefined } from "../utils";

global.ResizeObserver = ResizeObserver;

const formTestFields: Record<string, readonly FieldDataType[]> = {
  text: [
    {
      name: "testField",
      label: "Test Field",
      className: "md:col-span-2",
      type: FieldType.Text,
      default: "",
      required: true,
      schema: z.preprocess(emptyToUndefined, z.string()),
    },
  ] as const,
  number: [
    {
      name: "testField",
      label: "Test Field",
      className: "md:col-span-2",
      type: FieldType.Number,
      default: 0,
      required: true,
      schema: z.preprocess(
        emptyToUndefined,
        z.preprocess((val) => Number(val), z.number()),
      ),
    },
  ] as const,
  select: [
    {
      name: "testField",
      label: "Test Field",
      className: "md:col-span-2",
      type: FieldType.Select,
      default: undefined,
      schema: z.string(),
      required: true,
      options: [
        { value: "option1", label: "Option 1" },
        { value: "option2", label: "Option 2" },
        { value: "option3", label: "Option 3" },
      ],
    },
  ] as const,
  checkbox: [
    {
      name: "testField",
      label: "Test Field",
      type: FieldType.Checkbox,
      default: false,
      required: true,
      schema: z.boolean(),
      testId: "checkbox-field",
    },
  ] as const,
};

afterEach(() => {
  cleanup();
  vi.resetAllMocks();
});

const onSubmitStub = vi.fn((_data: Record<string, unknown>) => void 0);

describe("Form Generator Integration Test", () => {
  /**
   * Test text input field
   * Make form hook
   * Render form field
   * - test empty value
   * - test valid value
   * - check value is correct
   */
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
        {formGenerator.fields(form)}
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

    /**
     * TODO: Test required message is displayed
     */
    await act(async () => {
      fireEvent.change(inputField, { target: { value: "test value" } });
      fireEvent.click(submitButton);
    });
    expect(onSubmitStub).toHaveBeenCalledWith({ testField: "test value" });
  });

  /**
   * Test number input field
   * Make form hook
   * Render form field
   * - test empty value
   * - test invalid value
   * - test valid value
   * - check value is correct
   */
  it("should render form with number input field", async () => {
    const formFields = formTestFields.number!;
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
        {formGenerator.fields(form)}
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

    /**
     * Test empty value
     * TODO: Test required message is displayed
     */
    await act(async () => {
      fireEvent.change(inputField, { target: { value: "" } });
      fireEvent.click(submitButton);
    });
    expect(onSubmitStub).toHaveBeenCalledTimes(0);

    /**
     * Test invalid value
     */
    await act(async () => {
      fireEvent.change(inputField, { target: { value: "invalid" } });
      fireEvent.click(submitButton);
    });
    expect(onSubmitStub).toHaveBeenCalledTimes(0);

    /**
     * Test valid value
     */
    await act(async () => {
      fireEvent.change(inputField, { target: { value: "10" } });
      fireEvent.click(submitButton);
    });
    expect(onSubmitStub).toHaveBeenCalledWith({ testField: 10 });
  });

  /**
   * Test select input field
   * Make form hook
   * Render form field
   * - test empty value
   * - test valid value
   * - check value is correct
   */
  it("should render form with select input field", async () => {
    const formFields = formTestFields.select!;
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
        {formGenerator.fields(form)}
        <button data-testid="submit-button" type="submit">
          Submit
        </button>
      </form>,
    );
    const submitButton = screen.getByTestId("submit-button");
    if (!submitButton) throw new Error("submit button not found");
    const formElement = screen.getByTestId("form");
    if (!formElement) throw new Error("form not found");
    const selectField = formElement.querySelector("select");
    if (!selectField) throw new Error("select field not found");

    /**
     * Test empty value
     * TODO: Test required message is displayed
     */
    await act(async () => fireEvent.click(submitButton));
    expect(onSubmitStub).toHaveBeenCalledTimes(0);

    // Test valid value
    await act(async () => {
      fireEvent.change(selectField, { target: { value: "option2" } });
      fireEvent.click(submitButton);
    });
    expect(onSubmitStub).toHaveBeenCalledWith({ testField: "option2" });
  });

  /**
   * Test Checkbox input field
   * Make form hook
   * Render form field
   * - test valid value
   * - check value is correct
   */
  it("should render form with checkbox input field", async () => {
    const formFields = formTestFields.checkbox!;
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
        {formGenerator.fields(form)}
        <button data-testid="submit-button" type="submit">
          Submit
        </button>
      </form>,
    );
    const submitButton = screen.getByTestId("submit-button");
    if (!submitButton) throw new Error("submit button not found");
    const formElement = screen.getByTestId("form");
    if (!formElement) throw new Error("form not found");
    const checkboxFieldButton = screen.getByTestId("checkbox-field");
    if (!checkboxFieldButton) throw new Error("checkbox field not found");

    // Test valid true value
    await act(async () => {
      fireEvent.click(checkboxFieldButton);
    });
    await act(async () => {
      fireEvent.click(submitButton);
    });
    expect(onSubmitStub).toHaveBeenCalledWith({ testField: true });

    // Test valid false value
    await act(async () => {
      fireEvent.click(checkboxFieldButton);
      fireEvent.click(submitButton);
    });
    expect(onSubmitStub).toHaveBeenCalledWith({ testField: false });
  });
});
