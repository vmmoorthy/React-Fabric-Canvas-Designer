import '@testing-library/jest-dom';
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import InputText from "./Text";

test("renders InputText and handles changes", () => {
    const mockOnChange = jest.fn();
    render(<InputText value="test" onChange={mockOnChange} />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("test");

    fireEvent.change(input, { target: { value: "new value" } });
    fireEvent.blur(input);

    expect(mockOnChange).toHaveBeenCalledWith("new value");
});
