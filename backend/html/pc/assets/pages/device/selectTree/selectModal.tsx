import * as React from 'react';
import { Modal, Button, Select } from '../../../components/antd/index';
import { get, post } from '../../../components/ajax/index';
import { MyTreeSelect } from './selectTree';

export class SelectModal extends React.Component<any, any> {
    state = {
        visible: false,
        nodeData: [],
        value: []
    }
    componentWillMount() {
        console.log('11');
    }
    handleOk() {
        this.state.visible = false;
        this.setState(this.state);
        if (this.props.onGetNode) {
            this.props.onGetNode(this.state.nodeData);
        }
    }
    handleCancel() {
        this.state.visible = false;
        this.setState(this.state);
    }
    onClick() {
        this.state.visible = true;
        this.setState(this.state);
    }
    onGetNode(value) {
        this.setState({
            nodeData: value
        });
    }
    onChange(value) {
        this.setState({
            value: value
        })
    }
    render() {
        return <section>
            <Select
                multiple
                style={{ width: '300px' }}
                dropdownStyle={{ height: '0' }}
                placeholder='Please select'
                onChange={this.onChange.bind(this)}
                value={this.state.value}
                >
            </Select>
            <Modal title='Basic Modal' visible={this.state.visible}
                onOk={this.handleOk.bind(this)}
                onCancel={this.handleCancel.bind(this)}
                style={{ width: '10px' }}>
                <MyTreeSelect onGetNode={(this.onGetNode.bind(this))}
                    jurisdiction='only' />
            </Modal >
        </section >
    }
}