import createStyles from '@/utils/createStyles';

const useStyles = createStyles(({ css, token }) =>
    css({
        '&.analytics-page': {
            width: '100%',
            maxWidth: 960,
            margin: '0 auto',

            '& .analytics-page__section': {
                marginTop: token.marginLG
            },

            '& .analytics-page__chart': {
                width: '100%',
                overflow: 'hidden'
            },

            '& .analytics-page__chart svg': {
                display: 'block',
                width: '100%',
                height: 220
            },

            '& .analytics-page__axis': {
                display: 'flex',
                justifyContent: 'space-between',
                color: token.colorTextTertiary,
                fontSize: token.fontSizeSM
            },

            '& .analytics-page__legend': {
                display: 'flex',
                gap: token.marginLG,
                marginTop: token.marginSM,
                color: token.colorTextSecondary,
                fontSize: token.fontSizeSM
            },

            '& .analytics-page__legend-item': {
                display: 'inline-flex',
                alignItems: 'center',
                gap: token.marginXS
            },

            '& .analytics-page__legend-dot': {
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: token.colorPrimary
            },

            '& .analytics-page__legend-dot--secondary': {
                background: token.colorSuccess
            },

            '& .analytics-page__daily-list': {
                display: 'grid',
                gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
                gap: token.marginSM
            },

            '& .analytics-page__daily-item': {
                minWidth: 0,
                textAlign: 'center'
            },

            '& .analytics-page__daily-bar': {
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                height: 120,
                padding: `0 ${token.marginXS}px`,
                borderRadius: token.borderRadiusSM,
                background: token.colorFillQuaternary
            },

            '& .analytics-page__daily-bar-fill': {
                width: '100%',
                minHeight: 4,
                borderRadius: `${token.borderRadiusSM}px ${token.borderRadiusSM}px 0 0`,
                background: token.colorPrimary
            },

            '& .analytics-page__daily-label': {
                display: 'block',
                marginTop: token.marginXS,
                color: token.colorTextTertiary,
                fontSize: token.fontSizeSM
            },

            '@media (max-width: 600px)': {
                '& .analytics-page__daily-list': {
                    gap: 4
                },

                '& .analytics-page__legend': {
                    gap: token.margin
                }
            }
        }
    })
);

export default useStyles;
