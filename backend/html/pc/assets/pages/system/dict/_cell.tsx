import * as React from 'react';

// import { get, post } from '../../../components/ajax/index'
import {
    Table, Input, Icon, Button, Switch, Spin,
    ModalSlip
} from '../../../components/antd/index';


interface EditableCellProps {
    value: string,
    onChange: any,
    editable: any
}

export default class EditableCell extends React.Component<any, any> {

    state = {
        value: this.props.value,
        // flag: this.props.flag || CellFlag.None,
        editable: false,
    }
    componentWillMount() {
        this.state.editable = this.props.flag === 'new'
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextProps.finish && nextProps.finish == true) {
            this.state.editable = false;
        }
    }

    /**
     * 编辑框发生变化候触发
     */
    handleChange = (e) => {
        const value = e.target.value;
        if (value != this.props.value) {
            this.props.onChange(value);
        }
        this.setState({ value });
    }

    /**
     * 开始编辑模式
     */
    edit = () => {
        this.setState({ editable: true });
    }

    render() {
        const { value, editable } = this.state;
        return (<span className="editable-cell">
            {
                editable ?
                    <span className="editable-cell-input-wrapper">
                        <Input
                            className='editable-cellName'
                            value={value}
                            onChange={this.handleChange}
                        />
                    </span>
                    :
                    <span className="editable-cell-text-wrapper"
                        onClick={this.edit}>
                        {value || ' '}
                    </span>
            }
        </span>);
    }
}
