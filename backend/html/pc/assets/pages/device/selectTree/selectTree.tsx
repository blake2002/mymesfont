import * as React from 'react';
import { Select } from '../../../components/antd/index';
import { Mytree } from '../selectTree/mytree';
import './selectTree.css'

const Option = Select.Option;
export class MyTreeSelect extends React.Component<any, any> {
    state = {
        value: [],
        gData: this.props.value ? this.props.value : []
    }
    componentWillMount() {
        let value = [];
        this.state.gData.forEach(item => {
            value.push(item.id);
        });
        this.setState({
            value
        })
    }
    onChange(value) {
        let parameter = [];
        value.forEach(item => {
            let nodeObj = this.state.gData.find(obj => {
                return obj.id === item;
            });
            parameter.push(nodeObj);
        });
        if (this.props.onGetNode) {
            this.props.onGetNode(parameter);
        }
        this.setState({
            value
        })
    }
    onClick(e) {
        if (this.props.onGetNode) {
            this.props.onGetNode(e);
        }
        let data = [];
        e.forEach(item => {
            data.push(item.id);
        })
        this.setState({
            value: data,
            gData: e
        })
    }
    render() {
        let children = [];
        this.state.gData.forEach(item => {
            children.push(<Option key={item.id}>{item.name}</Option>);
        });
        return <section>
            <Select
                multiple
                style={{ width: '100%' }}
                dropdownStyle={{ height: '0' }}
                placeholder='Please select'
                onChange={this.onChange.bind(this)}
                value={this.state.value}
                >
                {children}
            </Select>
            <Mytree treeType={this.props.treeType} onClick={this.onClick.bind(this)} value={this.props.value}
                jurisdiction={this.props.jurisdiction} multiple={this.props.multiple} selectedNode={this.state.value} />
        </section >
    }
}

(MyTreeSelect as any).defaultProps = {
    treeType: 'region_tree',
    multiple: false
}