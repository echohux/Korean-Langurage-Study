import createStyles from '@/utils/createStyles';

const useStyles = createStyles(({ css, token }) =>
    css({
        '&.sentence-card': {
            position: 'relative',
            width: '100%',
            maxWidth: 480,
            minHeight: 300,
            padding: token.paddingLG,
            borderRadius: token.borderRadiusLG,
            background: token.colorBgContainer,
            boxShadow: token.boxShadowTertiary,
            textAlign: 'center',
            touchAction: 'pan-y',
            userSelect: 'none',

            '& .sentence-card__scene': {
                color: token.colorPrimary,
                fontSize: token.fontSizeSM
            },

            '& .sentence-card__korean': {
                marginTop: token.marginLG,
                fontSize: 30,
                fontWeight: 600,
                lineHeight: 1.5
            },

            '& .sentence-card__chinese': {
                marginTop: token.margin,
                color: token.colorTextSecondary,
                fontSize: token.fontSizeHeading4
            },

            '& .sentence-card__word': {
                marginTop: token.marginLG,
                color: token.colorTextTertiary
            },

            '& .sentence-card__hint': {
                marginTop: token.marginSM,
                color: token.colorTextTertiary,
                fontSize: token.fontSizeSM
            },

            '& .sentence-card__actions': {
                marginTop: token.marginLG
            },

            '@media (max-width: 600px)': {
                minHeight: 280,
                padding: token.padding,
                '& .sentence-card__korean': {
                    fontSize: 26
                }
            }
        }
    })
);

export default useStyles;
