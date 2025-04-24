import '@testing-library/jest-dom';
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import InputNumber from "./Number";

test("renders InputNumber and handles increment/decrement", () => {
    const mockOnChange = jest.fn();
    render(<InputNumber value={10} min={0} step={1} onChange={mockOnChange} />);

    const input = screen.getByRole("spinbutton");
    expect(input).toHaveValue(10);

    fireEvent.change(input, { target: { value: "15" } });
    expect(mockOnChange).toHaveBeenCalledWith(15);
});
