import * as React from 'react';
import { get } from '../ajax/index';
import { Select, Option } from '../antd/index';
import { SelectProps } from 'antd/lib/select/index';

type Categroy = 'group' | 'rtdb' | 'flowchart' | 'driver' | 'var_type'
    | 'var_datatype' | 'var_convertor' | 'enum_switch';
/**
 * 获取后台枚举
 * group-设备分组, 如: 空调锅炉
 * rtdb, 实时数据库, 如：RTDB001, RTDB002
 * flowchart - 设备关联流程图, 
 * 设备驱动
 * 注：设备驱动的模板内的选项值，不从此接口取
 * driver - 设备驱动分类, 如: ModbusRTU, OmronHostLink
 * 设备变量
 * var_type - 变量类型
 * var_datatype - 数据类型, 如byte,int,string
 * var_convertor, 工程转换
 * enum_switch, 启用禁用 
 *
 * @export
 * @param {Categroy} categroy
 */
export let getOptions = async (categroy: Categroy) => {
    let {data} = await get({
        url: '/dict_options',
        data: {
            categroy: categroy
        },
        type: 1
    });
    return data;
}
// getOptions('group');




interface IOptionsSelectProps {
    type: Categroy,
    onChange: (value: string, text: string) => void
    style?: any
};
interface IOptionsSelectState { };
export default class OptionsSelect extends React.Component<IOptionsSelectProps, IOptionsSelectState> {

    state: {
        data: {
            Key: string,
            Value: string
        }[]
    } = {
        data: []
    }

    async ajaxData() {
        let data = await getOptions(this.props.type);
        this.state.data = data;
        this.props.onChange(this.state.data[0].Key, this.state.data[0].Value);
        this.setState(this.state);
    }

    onChange(value: string) {
        this.props.onChange(value, this.state.data.find(data => data.Key === value).Value);
    }

    componentDidMount() {
        this.ajaxData();
    }

    public render(): JSX.Element {
        if (this.state.data.length > 0) {
            return <Select {...this.props} onChange={this.onChange.bind(this)} defaultValue={this.state.data[0].Key}>
                {this.state.data.map(value => <Option key={value.Key} value={value.Key}>{value.Value}</Option>)}
            </Select>;
        } else {
            return <span><Select {...this.props} onChange={this.onChange.bind(this)} >
            </Select></span>;
        }
    }
}

