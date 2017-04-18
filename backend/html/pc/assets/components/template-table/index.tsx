import * as React from 'react';
import { post, get } from '../ajax/index';
import TemplateInput from '../template-input/index';
import { DevicesTemplate, NSDevices } from '../template-input/types';


interface IAddInformationProps {
    data: NSDevices[]
    template: DevicesTemplate[]
};
interface IAddInformationState {
};
/**
 * 新增设备-表单
 * 
 * @class AddInformation
 * @extends {React.Component<IAddInformationProps, IAddInformationState>}
 */
export default class AddInformation extends React.Component<IAddInformationProps, IAddInformationState> {

    /**
     * 根据模版找值
     * 
     * @param {NSDevices} value
     * @returns
     * 
     * @memberOf AddInformation
     */
    getValue(template) {
        let {data} = this.props;
        data = data || [];
        let value = data.find(data => data.ParameterName === template.Name);
        if (!value) {
            value = {
                ParameterName: template.Name,
                ParameterValue: ''
            }
            data.push(value);
        }
        return value;
    }


    /**
     * 是否显示
     * 
     * @param {DevicesTemplate} template
     * @returns
     * 
     * @memberOf AddInformation
     */
    isShow(template) {
        let show = true;
        if (!template) {
            show = false;
        } else {
            if (template.Visible === 'false') {
                show = false;
            }
            if (template.Form && template.Form.Type === 'Hidden') {
                show = false;
            }

            if (template.Name === 'Latitude') {
                show = false;
            }
        }

        return show;
    }



    public render(): JSX.Element {
        let {props, state} = this;
        let {data, template} = props;
        return (<table className='table-from' >
            {template.map(template => {
                let value = this.getValue(template);
                let bl = this.isShow(template);

                if (bl) {
                    return <tbody key={value.ParameterName}>
                        <tr>
                            {
                                template.Name === 'Longitude' ?
                                    <td>经纬度</td> :
                                    <td>{template.Description}</td>
                            }
                        </tr>
                        <tr>
                            <td>
                                <TemplateInput dataList={data} data={value} template={template} />
                            </td>
                        </tr>
                    </tbody>;
                }
            })}
        </table>);
    }
}
