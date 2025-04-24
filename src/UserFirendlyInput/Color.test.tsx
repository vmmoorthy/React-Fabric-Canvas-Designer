import '@testing-library/jest-dom';
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import InputColor from "./Color";

test("renders InputColor and handles color changes", () => {
    const mockOnChange = jest.fn();
    render(<InputColor value="#ffffff" onChange={mockOnChange} />);

    const colorBox = screen.getByText("#FFFFFF");
    fireEvent.click(colorBox);

    // Simulate color change
    fireEvent.blur(colorBox);
    expect(mockOnChange).toHaveBeenCalledWith("#ffffff");
});
