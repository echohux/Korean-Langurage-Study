import { Layout, Typography } from 'antd';
import { NavLink, Outlet } from 'react-router';

import createStyles from '@/utils/createStyles';

const useStyles = createStyles(({ css, token }) =>
    css({
        '&.basic-layout': {
            minHeight: '100vh',
            background: token.colorBgLayout,

            '& .basic-layout__header': {
                display: 'flex',
                alignItems: 'center',
                gap: token.marginLG,
                padding: `0 ${token.paddingLG}px`,
                background: token.colorBgContainer,
                borderBottom: `1px solid ${token.colorBorderSecondary}`
            },

            '& .basic-layout__title': {
                margin: 0,
                marginRight: token.margin,
                whiteSpace: 'nowrap'
            },

            '& .basic-layout__nav': {
                display: 'flex',
                gap: token.marginLG,
                fontSize: token.fontSizeLG
            },

            '& .basic-layout__nav a': {
                color: token.colorTextSecondary
            },

            '& .basic-layout__nav a.is-active': {
                color: token.colorPrimary,
                fontWeight: 600
            },

            '& .basic-layout__content': {
                padding: token.paddingLG
            },

            '@media (max-width: 600px)': {
                '& .basic-layout__header': {
                    height: 'auto',
                    minHeight: 96,
                    lineHeight: 'normal',
                    padding: `${token.paddingSM}px ${token.padding}px`,
                    display: 'flex',
                    alignItems: 'stretch',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    gap: token.marginSM
                },
                '& .basic-layout__title': {
                    fontSize: token.fontSizeLG
                },
                '& .basic-layout__nav': {
                    overflowX: 'auto',
                    whiteSpace: 'nowrap',
                    gap: token.margin,
                    fontSize: token.fontSize,
                    paddingBottom: 4
                },
                '& .basic-layout__content': {
                    padding: token.paddingSM,
                    paddingBottom: 40
                }
            }
        }
    })
);

/** 主布局：顶部导航 + 内容区 */
const BasicLayout = () => {
    const { styles, cx } = useStyles();

    return (
        <Layout className={cx('basic-layout', styles.toString())}>
            <Layout.Header className="basic-layout__header">
                <Typography.Title level={4} className="basic-layout__title">
                    韩语汉字词
                </Typography.Title>
                <nav className="basic-layout__nav">
                    <NavLink to="/" end className={({ isActive }) => (isActive ? 'is-active' : undefined)}>
                        概览
                    </NavLink>
                    <NavLink to="/learn" className={({ isActive }) => (isActive ? 'is-active' : undefined)}>
                        学新词
                    </NavLink>
                    <NavLink to="/review" className={({ isActive }) => (isActive ? 'is-active' : undefined)}>
                        复习
                    </NavLink>
                    <NavLink to="/reverse" className={({ isActive }) => (isActive ? 'is-active' : undefined)}>
                        反向练习
                    </NavLink>
                    <NavLink to="/sentences" className={({ isActive }) => (isActive ? 'is-active' : undefined)}>
                        句子学习
                    </NavLink>
                    <NavLink to="/analytics" className={({ isActive }) => (isActive ? 'is-active' : undefined)}>
                        数据分析
                    </NavLink>
                </nav>
            </Layout.Header>
            <Layout.Content className="basic-layout__content">
                <Outlet />
            </Layout.Content>
        </Layout>
    );
};

export default BasicLayout;
