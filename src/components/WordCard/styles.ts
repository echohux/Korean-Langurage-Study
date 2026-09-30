import createStyles from '@/utils/createStyles';

const useStyles = createStyles(({ css, token }) =>
    css({
        '&.word-card': {
            width: '100%',
            maxWidth: 480,
            margin: '0 auto',
            padding: token.paddingLG,
            minHeight: 270,
            borderRadius: token.borderRadiusLG,
            background: token.colorBgContainer,
            boxShadow: token.boxShadowTertiary,
            textAlign: 'center',
            touchAction: 'pan-y',
            userSelect: 'none',

            '& .word-card__swipe-tip': {
                marginBottom: token.marginSM,
                color: token.colorTextSecondary,
                fontSize: token.fontSizeSM
            },

            '& .word-card__korean': {
                fontSize: 48,
                fontWeight: 700,
                lineHeight: 1.2,
                color: token.colorText
            },

            '& .word-card__romanization': {
                marginTop: token.marginXS,
                fontSize: token.fontSizeLG,
                color: token.colorTextTertiary
            },

            '& .word-card__hanja-line': {
                marginTop: token.margin,
                fontSize: token.fontSizeHeading3,
                color: token.colorText
            },

            '& .word-card__hanja': {
                padding: '0 6px',
                borderRadius: token.borderRadiusSM,
                background: token.colorPrimaryBg,
                color: token.colorPrimary,
                fontWeight: 700
            },

            '& .word-card__chinese': {
                marginTop: token.marginXS,
                fontSize: token.fontSizeHeading4,
                color: token.colorTextSecondary
            },

            '& .word-card__hint': {
                marginTop: token.marginSM,
                fontSize: token.fontSize,
                color: token.colorTextTertiary
            },

            '& .word-card__actions': {
                marginTop: token.marginLG
            },

            '& .word-card__speak-button': {
                width: 36,
                height: 36,
                fontSize: token.fontSize
            },

            '@media (max-width: 600px)': {
                width: '100%',
                padding: token.padding,
                minHeight: 260,
                '& .word-card__korean': {
                    fontSize: 40
                }
            }
        }
    })
);

export default useStyles;
