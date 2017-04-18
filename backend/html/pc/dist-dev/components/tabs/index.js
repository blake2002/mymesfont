define("components/tabs/index.js",function(require, exports, module) {
"use strict";
const React = require("react");
class Tabs extends React.Component {
}
let tabs = require('antd/lib/tabs/index');
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = tabs;
const { TabPane } = tabs;
exports.TabPane = TabPane;
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
});
//# sourceMappingURL=index.js.map
