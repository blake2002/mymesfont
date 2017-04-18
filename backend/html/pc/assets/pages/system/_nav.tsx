import * as React from 'react';
export { React };
import { Nav as NavBase } from '../_main';
import { PureComponentGenerics } from '../../components/global/components';


export default class Nav extends PureComponentGenerics<any, any> {
    public render(): JSX.Element {
        return <NavBase
            data={[{
                name: '系统菜单管理',
                url: '/system/systemMenuManager/index',
                operations:this.props.operations
            }, {
                name: '角色管理',
                url: '/system/roleManager/index',
                operations:this.props.operations 
            }, {
                name: '字典管理',
                url: '/system/dict/index',
                operations:this.props.operations 
            }, {
                name: '日志',
                url: '/system/systemMenuManagq111er/index',
                operations:''
            }]} />;
    }
}