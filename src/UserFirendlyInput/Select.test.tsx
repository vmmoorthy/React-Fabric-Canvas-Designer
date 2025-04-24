import '@testing-library/jest-dom';
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import InputSelect from "./Select";

test("renders InputSelect and handles selection", () => {
    const mockOnChange = jest.fn();
    const options = [
        { value: "1", displayValue: "Option 1" },
        { value: "2", displayValue: "Option 2" }
    ];
    render(<InputSelect value={options[0]} onChange={mockOnChange} options={options} />);

    const select = screen.getByRole("combobox");
    expect(select).toHaveValue("1");

    fireEvent.change(select, { target: { value: "2" } });
    expect(mockOnChange).toHaveBeenCalledWith(options[1]);
});
