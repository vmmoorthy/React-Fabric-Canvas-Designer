import '@testing-library/jest-dom';
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import InputRange from "./Range";

test("renders InputRange and handles changes", () => {
    const mockOnChange = jest.fn();
    render(<InputRange value={50} min={0} max={100} onChange={mockOnChange} />);

    const range = screen.getByRole("slider");
    expect(range).toHaveValue("50");

    fireEvent.change(range, { target: { value: "75" } });
    expect(mockOnChange).toHaveBeenCalledWith(75);
});
