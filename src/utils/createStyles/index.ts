import { createInstance } from 'antd-style';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const { createStyles, useTheme } = createInstance<any>({
    key: 'kh-css',
    hashPriority: 'high'
});

export default createStyles;
export { useTheme };
