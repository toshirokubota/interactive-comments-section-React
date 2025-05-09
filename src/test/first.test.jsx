import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  it('renders', () => {
    render(<App />);

    expect(screen.queryByText('Hello World!')).toBeVisible();
  });
});

describe('my first test', () => {
  it('works', () => {
    expect(true);
  });
});

