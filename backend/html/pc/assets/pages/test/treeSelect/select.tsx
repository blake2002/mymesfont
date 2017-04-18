import * as React from 'react';
import { Select } from '../../../components/antd/index';
import { Mytree } from '../treeSelect/myTree';

export class MyTreeSelect extends React.Component<any, any> {
    state = {
        value: [],
        nodeData: []
    }
    componentWillMount() {
        // console.log('11');
    }
    onChange(value) {
        this.setState({
            value: value
        })
    }
    onClick(e) {
        if (this.props.onGetNode) {
            this.props.onGetNode(e);
        }
        this.setState({
            value: [e.name]
        })
    }
    render() {
        return <section>
            <Select
                multiple
                style={{ width: '80%' }}
                dropdownStyle={{ height: '0' }}
                placeholder='Please select'
                onChange={this.onChange.bind(this)}
                value={this.state.value}
                >
            </Select>
            <Mytree treeType={this.props.treeType} onClick={this.onClick.bind(this)} />
        </section >
    }
}