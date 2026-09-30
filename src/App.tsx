import { RouterProvider } from 'react-router';

import router from '@/routes';
import BaseThemeProvider from '@/theme';

const App = () => (
    <BaseThemeProvider>
        <RouterProvider router={router} />
    </BaseThemeProvider>
);

export default App;
