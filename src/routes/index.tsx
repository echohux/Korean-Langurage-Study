import { createBrowserRouter } from 'react-router';

import BasicLayout from '@/layouts/BasicLayout';
import AnalyticsPage from '@/pages/analytics';
import DashboardPage from '@/pages/dashboard';
import LearnPage from '@/pages/learn';
import ReversePage from '@/pages/reverse';
import ReviewPage from '@/pages/review';
import SentencesPage from '@/pages/sentences';

const router = createBrowserRouter(
    [
        {
            path: '/',
            element: <BasicLayout />,
            children: [
                { index: true, element: <DashboardPage /> },
                { path: 'analytics', element: <AnalyticsPage /> },
                { path: 'learn', element: <LearnPage /> },
                { path: 'review', element: <ReviewPage /> },
                { path: 'reverse', element: <ReversePage /> },
                { path: 'sentences', element: <SentencesPage /> }
            ]
        }
    ],
    { basename: '/Korean-Langurage-Study' }
);

export default router;
