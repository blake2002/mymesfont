import { TabPaneProps } from 'antd/lib/tabs/index';
import * as React from 'react';
import { PureComponentGenerics } from '../global/components';

export declare type TabsType = 'line' | 'card' | 'editable-card';
export declare type TabsPosition = 'top' | 'right' | 'bottom' | 'left';
export interface TabsProps {
    activeKey?: string;
    defaultActiveKey?: string;
    hideAdd?: boolean;
    onChange?: (activeKey: string) => void;
    onTabClick?: Function;
    tabBarExtraContent?: React.ReactNode | null;
    type?: TabsType;
    tabPosition?: TabsPosition;
    onEdit?: (targetKey: string, action: any) => void;
    size?: 'default' | 'small';
    style?: React.CSSProperties;
    prefixCls?: string;
    className?: string;
    animated?: boolean
}
export interface TabPaneProps {
    /** 选项卡头显示文字 */
    tab?: React.ReactNode | string;
    style?: React.CSSProperties;
}
class Tabs extends React.Component<TabsProps, any> {
    static TabPane: React.ClassicComponentClass<TabPaneProps>;
    static defaultProps: {
        prefixCls: string;
        hideAdd: boolean;
        animated: boolean;
    };
    createNewTab: (targetKey: any) => void;
    removeTab: (targetKey: any, e: any) => void;
    handleChange: (activeKey: any) => void
}
let tabs: typeof Tabs = require('antd/lib/tabs/index');
export default tabs;

const {TabPane} = tabs;
export { TabPane };

// interface ITabFixedProps { };
// interface ITabFixedState { };
// export class TabFixed extends PureComponentGenerics<ITabFixedProps, ITabFixedState> {

//     getTabText() {
//         let tabPaneArray: any[] = this.props.children as any;
//         let titleArray = {

//         }


//         console.log(this.props.children[0]);
//     }

//     public render(): JSX.Element {
//         this.getTabText();
//         return (<section>
//             <section className='ant-tabsfixed-bar'>

//             </section>
//             {this.props.children}
//         </section>);
//     }
// }

// interface ITabFixedPaneProps {};
// interface ITabFixedPaneState {};
// class TabFixedPane extends PureComponentGenerics<ITabFixedPaneProps, ITabFixedPaneState> {
//     public render(): JSX.Element {
//         return ( <section className='ant-tabsfixed-bar'>

//             </section>);
//     }
// }
