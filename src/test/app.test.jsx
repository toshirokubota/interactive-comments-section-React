import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import * as libs from '../libs';

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
        //console.log('Before', cardsBefore.length, 'After', cardsAfter.length);
        expect(cardsAfter.length - cardsBefore.length).toEqual(1);
    });
});