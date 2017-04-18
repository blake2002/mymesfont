import * as React from 'react';
export { React };
import { Nav as NavBase } from '../_main';
import { PureComponentGenerics } from '../../components/global/components';


interface IDeviceMainLeftProps { };
interface IDeviceMainLeftState { };
export default class Nav extends PureComponentGenerics<IDeviceMainLeftProps, IDeviceMainLeftState> {
    public render(): JSX.Element {
        return <NavBase data={[{
            name: '设备管理',
            url: '/device/device/index',
            privileges: '/device/devices'
        }, {
            name: '关联人员',
            url: '/device/members/index',
            privileges: '/device/members'
        },
            // {
            //     name: '关联角色',
            //     url: '/device/members/index'
            // }
        ]} />;
    }
}


