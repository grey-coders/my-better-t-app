import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // Import jest-dom matchers
import Hello from '../../src/tests/Hello'; // Adjust import path based on your folder structure

describe('Hello component', () => {
  test('renders Hello with the correct name', () => {
    const name = 'Kevin';
    
    render(<Hello name={name} />);
    
    // Check if the component renders the correct text
    const helloText = screen.getByText(`Hello, ${name}!`);
    expect(helloText).toBeInTheDocument();
  });

  test('renders Hello with a different name', () => {
    const name = 'Alice';
    
    render(<Hello name={name} />);
    
    // Check if the component renders the correct text
    const helloText = screen.getByText(`Hello, ${name}!`);
    expect(helloText).toBeInTheDocument();
  });
});
