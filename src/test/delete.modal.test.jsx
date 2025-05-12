import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

describe('DeleteConfirmationModal', () => {
    const user = userEvent.setup();
  
    beforeEach(() => {
      vi.resetAllMocks();
    })

    it('checks for creation of buttons', async () => {
        const { container } = render(<DeleteConfirmationModal />);

        expect(screen.queryByText('No Cancel')).toBeVisible();
        expect(screen.queryByText('Yes Delete')).toBeVisible();    
    });
});

