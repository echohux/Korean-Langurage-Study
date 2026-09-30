import { App as AntdApp } from 'antd';
import { ThemeProvider } from 'antd-style';
import type { PropsWithChildren } from 'react';

/** 全局主题 Provider：集中配置 prefixCls、字体、token 覆盖 */
const BaseThemeProvider = ({ children }: PropsWithChildren) => (
    <ThemeProvider
        prefixCls="kh"
        theme={{
            token: {
                colorPrimary: '#3b5bdb',
                fontFamily: 'system-ui, -apple-system, "PingFang SC", sans-serif'
            }
        }}
    >
        <AntdApp>{children}</AntdApp>
    </ThemeProvider>
);

export default BaseThemeProvider;
