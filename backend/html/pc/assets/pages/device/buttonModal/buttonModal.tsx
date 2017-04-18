import * as React from 'react';
import { Modal, Button } from '../../../components/antd/index';
import { get, post } from '../../../components/ajax/index';
import { MyTreeSelect } from '../selectTree/selectTree';


export class ButtonModal extends React.Component<any, any> {
    state = {
        visible: false,
        nodeData: []
    }
    componentWillMount() {
        // console.log('11');
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
        console.log(value);
        this.setState({
            nodeData: [value]
        });
    }
    render() {
        return <section>
            <Button onClick={this.onClick.bind(this)}>{this.props.title}</Button>
            <Modal title='Basic Modal' visible={this.state.visible}
                onOk={this.handleOk.bind(this)}
                onCancel={this.handleCancel.bind(this)}
                style={{ width: '10px' }}>
                <MyTreeSelect onGetNode={this.onGetNode.bind(this)} treeType={this.props.treeType} />
            </Modal >
        </section >
    }
}