import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

describe('App', () => {
    const user = userEvent.setup();
  
    beforeEach(() => {
      vi.resetAllMocks();
    })

    it('create a new comment', async () => {
      const { container } = render(<App />);
      
      const cardsBefore = container.querySelectorAll('.card-grid');

      const message = 'hello world!';
      const textarea = screen.getByLabelText('Add Comment');
      await user.type(textarea, message);
      //console.log('TextArea: ', textarea);
      expect(textarea).toHaveValue(message);
      await user.click(screen.getByLabelText('Send'));
      expect(textarea).toHaveValue('');

      const cardsAfter = container.querySelectorAll('.card-grid');
      console.log('Before', cardsBefore.length, 'After', cardsAfter.length);
      expect(cardsAfter.length - cardsBefore.length).toEqual(1);
    });
    it('edit a comment', async () => {
      const { container } = render(<App />);
      
      const editButton = screen.getAllByRole("button", { name: /Edit/i })[0];
      expect(editButton).toBeVisible();
      await user.click(editButton);

      const textarea = screen.getAllByRole("textbox")[0];
      expect(textarea).toBeVisible();
      const message = 'hello world!';
      const message2 = ' is my oyster';
      await user.type(textarea, message2);
      expect(textarea).toHaveValue(message + message2);
      const updateButton = screen.getByRole("button", {name: /Update/});
      await user.click(updateButton);      
  });
  it('deletes a comment', async () => {
    const { container } = render(<App />);

    const cardsBefore = container.querySelectorAll('.card-grid');
    const deleteButton = screen.getAllByRole("button", { name: /Delete/ })[0];
    expect(deleteButton).toBeVisible();
    await user.click(deleteButton);

    const yesButton = screen.queryByText('Yes Delete');
    expect(yesButton).toBeVisible();
    await user.click(yesButton);
    expect(yesButton).not.toBeVisible();
    const cardsAfter = container.querySelectorAll('.card-grid');
    expect(cardsAfter.length - cardsBefore.length).toEqual(-1);
  });
});
