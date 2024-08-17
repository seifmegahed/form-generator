import { describe, expect, it, afterEach } from "vitest";
import { render, cleanup, screen, fireEvent } from "@testing-library/react";
import DatePicker from "../date-picker";

afterEach(() => {
  cleanup();
});

describe("DatePicker", () => {
  it("button should render", () => {
    let _date: Date | undefined = new Date("August 17, 2024");
    const onChange = (date: Date | undefined) => {
      _date = date;
    };
    const { container } = render(DatePicker({ date: _date, onChange }));
    expect(container).toMatchSnapshot();
  });
  it("popover should render", () => {
    let _date: Date | undefined = new Date("August 17, 2024");
    const onChange = (date: Date | undefined) => {
      _date = date;
    };
    render(DatePicker({ date: _date, onChange }));
    const button = screen.getByRole("button");
    if (!button) throw new Error("button not found");
    expect(button.getAttribute("data-state")).toBe("closed");
    fireEvent.click(button);
    expect(button.getAttribute("data-state")).toBe("open");
    expect(screen.getByTestId("date-picker-calendar")).toMatchSnapshot();
  });
  it("should return the selected date", () => {
    let _date: Date | undefined = new Date("August 17, 2024");
    const onChange = (date: Date | undefined) => {
      _date = date;
    };
    render(DatePicker({ date: _date, onChange }));
    const button = screen.getByRole("button");
    if (!button) throw new Error("button not found");
    fireEvent.click(button);
    const calendar = screen.getByTestId("date-picker-calendar");
    if (!calendar) throw new Error("calendar not found");
    const dayButtons = calendar.querySelectorAll("button[name='day']");
    if (!dayButtons) throw new Error("dayButton not found");
    dayButtons.forEach((dayButton) => {
      if (dayButton.innerHTML === "16") fireEvent.click(dayButton);
    });
    expect(_date?.getDate()).toBe(16);
  });
});
