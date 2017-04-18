import * as React from 'react';
export { React };
import { Nav as NavBase } from '../_main';
import { PureComponentGenerics } from '../../components/global/components';


export default class Nav extends PureComponentGenerics<any, any> {
    public render(): JSX.Element {
        return <NavBase
            data={[{
                name: '设计时',
                url: '/process/desgin/index',
                operations: this.props.operations
            }, {
                name: '已发布',
                url: '/process/desgin/index',
                operations: ''
            }, {
                name: '运行时',
                url: '/process/desgin/index',
                operations: ''
            }]} />;
    }
}