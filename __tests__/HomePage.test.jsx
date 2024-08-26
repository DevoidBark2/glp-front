import {render,screen} from "@testing-library/react";
import userEvent from '@testing-library/user-event'
import PlatformPage from "../src/app/platform/page";

describe('HomePage', () => {
    it('renders correctly', async () => {
        render(<PlatformPage/>)
        const input = screen.getByRole('Поиск...')
        await userEvent.type(input, 'My new todo')
        expect(input).toBeInDocument();
    })
})