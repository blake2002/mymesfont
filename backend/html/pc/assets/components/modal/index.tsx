import * as React from 'react';
import Modal from 'antd/lib/modal/index';
let modal: typeof Modal = require('antd/lib/modal/index');
export default modal;

import { PureComponentGenerics } from '../global/components';
import IconType from 'antd/lib/icon/index';
let Icon: typeof IconType = require('antd/lib/icon/index');
import './index.css';



interface ISlipProps {
    /**
     * 滑入方式
     * 
     * @type {string}
     * @memberOf ISlipProps
     */
    // type: 'left' | 'right'

    visible: boolean,
    onCancel: () => void,
    title?: string
};
interface ISlipState { };
export class ModalSlip extends React.Component<ISlipProps, ISlipState> {

    public render(): JSX.Element {
        let {props} = this;
        return (<section className={'component-slip ' + (this.props.visible ? 'visible' : '')}>
            <div className='component-slip-content'>
                <div className='component-slip-title'>
                    <Icon onClick={() => this.props.onCancel()} className='component-slip-close' type='close' />
                    {props.title}
                </div>
                {props.children}
            </div>
        </section>);
    }
}
