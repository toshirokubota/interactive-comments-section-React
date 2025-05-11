import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  it('renders', () => {
    render(<App />);
    //buttons for new comment
    expect(screen.queryByText('Send')).toBeVisible();
    expect(screen.queryByText('Cancel')).toBeVisible();
  });
});



