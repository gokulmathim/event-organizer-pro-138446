import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Event Organizer Pro landing page or login page', () => {
  render(<App />);
  // The app should render either the dashboard/landing or login/register, depending on auth state.
  // Since no user is present, we check for either the app title or login/register buttons.
  expect(
    screen.getByText(/Event Organizer Pro/i)
  ).toBeInTheDocument();
});
