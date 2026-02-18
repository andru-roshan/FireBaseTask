import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

test('allows adding and submitting a work log entry', () => {
  render(<App />);

  fireEvent.change(screen.getByLabelText(/Work done/i), {
    target: { value: 'Implemented login page validation' },
  });

  fireEvent.change(screen.getByLabelText(/Hours spent/i), {
    target: { value: '4' },
  });

  fireEvent.click(screen.getByRole('button', { name: /Add work log/i }));

  expect(
    screen.getByText(/Implemented login page validation/i)
  ).toBeInTheDocument();

  const submitButton = screen.getByRole('button', {
    name: /Submit to manager/i,
  });

  fireEvent.click(submitButton);

  expect(screen.getByRole('button', { name: /Submitted/i })).toBeDisabled();
});
