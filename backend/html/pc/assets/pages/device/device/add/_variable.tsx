import * as React from 'react';
import { Table } from '../../../../components/antd/index';
import { VariableData, DevicesTemplate, NSDevices, DeviceData, StateType } from '../types';
import { get, post } from '../../../../components/ajax/index';
import { message, ModalSlip, Button, Modal, Pagination, InputSearch } from '../../../../components/antd/index';
import { uuid } from '../../../../components/util/index';
import { TextInput, ParameterText } from '../../../../components/template-input/index';

interface ITableTextProps {

    modelName?: string
    name?: string


    deviceId?: string
    categroy?: string
    showText?: string
    privileges?: string
};
interface ITableTextState {
    data: {
        [key: string]: NSDevices,
    }[],
    template: DevicesTemplate[],

    _ID: string,

    modalSlipVisible: boolean,
    modalSlipTitle: string
    loading: boolean
    selectedRows: {
        [key: string]: NSDevices,
    }[]
    deleteList: {
        [key: string]: NSDevices,
    }[]
    selectedRowKeys: any[],
    selectedIndex: number
    tableWidth: number
};
export default class Com extends React.Component<ITableTextProps, ITableTextState> {

    state: ITableTextState = {
        data: [],
        template: [],
        _ID: '',

        modalSlipVisible: false,
        modalSlipTitle: '批量选择',
        loading: true,
        selectedRows: [],
        selectedRowKeys: [],
        selectedIndex: null,
        deleteList: [],
        tableWidth: 50
    }
    columns = [];
    data: NSDevices[][] = []
    banArray = []

    /**
     * 生成colums
     * 
     * 
     * @memberOf TableText
     */
    saveColums() {
        this.columns = [];
        this.state.tableWidth = 50;
        this.state.template.forEach((value, index) => {
            if (!value.Visible) {
                let width = (value.Form.Properties && value.Form.Properties.Width) || 120;
                this.columns.push({
                    title: value.Description,
                    dataIndex: value.Name,
                    width: width,
                    render: this.renderText(value)
                });
                this.state.tableWidth += width || 100;
            }
        });

        // console.log(this.columns);
    }


    async ajaxGetDate(categroy: string) {
        let { data } = await get('/device_attribute', {
            deviceId: this.props.deviceId,
            categroy: categroy
        });

        data[this.props.categroy].forEach((value, index) => {
            this.state.template.forEach((templateValue, index) => {
                if (!value[templateValue.Name]) {
                    value[templateValue.Name] = '';
                }
            })

            for (let key in value) {
                if (value.hasOwnProperty(key)) {
                    let element = value[key];
                    value[key] = {
                        ParameterName: key,
                        ParameterValue: element
                    }
                }
            }

            value.key = value._ID.ParameterValue;
        })

        return data;
    }


    perfectValue() {

    }


    /**
     * 获取数据
     * 
     * 
     * @memberOf TableText
     */
    async getData(categroy?: string) {
        this.state.loading = true;
        this.setState(this.state);
        let data = await this.ajaxGetDate(this.props.categroy)
        this.state.loading = false;
        // this.state.data = [data[this.props.categroy][0]];
        this.state.data = data[this.props.categroy];
        this.state.template = data[this.props.categroy + 'Template'].Props;
        this.state._ID = data._ID;
        this.saveColums();
        this.setState(this.state);
    }

    componentWillMount() {
        this.getData();
    }


    renderText(template) {
        return (data: NSDevices, value, index) => {
            if (data) {
                if (this.banArray.indexOf(data.ParameterName) === -1) {
                    return <TextInput template={template} data={data}
                        defaultShow={data._stateType === 'add' ? true : false} />;
                } else {
                    return <ParameterText template={template} data={data}></ParameterText>;
                }
            } else {
                return <span>没有值</span>
            }
        };
    }

    async ajaxUpdate() {
        let list = this.getUpdate();
        if (list.length) {
            await post('/modified_device_attribute', {
                _ID: this.state._ID,
                categroy: this.props.categroy,
                deviceId: this.props.deviceId,
                props: list
            });
        }

        let addlist = this.getUpdate('add');
        if (addlist.length) {
            await post('/new_device_attribute', {
                _ID: this.state._ID,
                categroy: this.props.categroy,
                deviceId: this.props.deviceId,
                props: addlist
            });
        }

        let deletelist = this.state.deleteList;
        if (deletelist.length) {
            await post('/delete_device_attribute', {
                _ID: this.state._ID,
                categroy: this.props.categroy,
                deviceId: this.props.deviceId,
                itemIds: deletelist.map(value => value['_ID'].ParameterValue)
            });

            this.modalSlipVisible(false);
            this.state.selectedRows = [];
            this.componentWillMount();
        }

        this.componentWillMount();
        message.success('保存成功!');
    }


    /**
     * 是否有改动
     * 
     * @returns
     * 
     * @memberOf Com
     */
    isChange() {
        let list = this.getUpdate();
        let addlist = this.getUpdate('add');
        let deletelist = this.state.deleteList;
        if (list.length || addlist.length || deletelist.length) {
            return true;
        } else {
            return false;
        }
    }


    add() {
        let newObj = {
            key: uuid()
        };
        this.state.template.forEach(value => {
            newObj[value.Name] = {
                ParameterName: value.Name,
                ParameterValue: value.DefaultValue || '',
                _stateType: 'add'
            }
        })
        this.state.data.push(newObj as any);
        this.setState(this.state);
    }

    // clearUpdata() {
    //     this.state.data.forEach(value => {
    //         for (let key in value) {
    //             let element = value[key];
    //             element._stateType = null;
    //         }
    //     });
    // }

    getUpdate(type: StateType = 'update') {
        let updateList = [];

        this.state.data.forEach(value => {
            let obj = {};
            if (type === 'update') {
                obj['_ID'] = value['_ID'] && value['_ID'].ParameterValue;
            }

            let update = false;
            for (let key in value) {
                let element = value[key];
                if (element._stateType === type) {
                    update = true;
                    obj[element.ParameterName] = element.ParameterValue;
                }
            }
            if (update) {
                updateList.push(obj);
            }
        });

        return updateList;

    }


    selectChange(selectedRowKeys) {
        this.state.selectedRowKeys = selectedRowKeys;

        this.state.selectedRows = [];
        this.state.selectedRowKeys.forEach((value, index) => {
            let data = this.state.data.find(data => data['key'] as any === value);
            this.state.selectedRows.push(data);
        });

        this.modalSlipVisible(selectedRowKeys.length !== 0);
        this.setState(this.state);
    }


    modalSlipVisible(bl) {
        this.state.modalSlipVisible = bl;
        this.setState(this.state);
    }


    async onDelete(value: any[]) {
        this.state.data = this.state.data.filter(value => {
            let index = this.state.selectedRows.indexOf(value);
            if (index === -1) {
                return true;
            } else {
                if (value['_ID']) {
                    this.state.deleteList.push(value);
                }
                return false;
            }
        });
        this.state.modalSlipVisible = false;
        this.state.selectedRows = [];
        // console.log(this.state.deleteList);
        // 临时解决选中和文本失去焦点时候的setState冲突
        setTimeout(() => {
            this.setState(this.state);
        }, 0);
    }

    selectRender() {
        return <section>
            <ul className='ul-details'>
                {this.state.selectedRows.map((data, index) => {
                    return <li key={index}>{data[this.props.showText].ParameterValue}</li>;
                })}
            </ul>
            <section className='component-slip-footer'>
                <Button privileges={this.props.privileges + ':remove'} onClick={() => {
                    this.onDelete(this.state.selectedRows);
                }}>删除</Button>
            </section>
        </section >;
    }

    modalShow() {
        (this.refs['SelectVar'] as any).modalShow(true);
    }

    onOk(data: {
        [key: string]: string,
    }[]) {

        data.forEach(value => {
            let obj = {};
            this.state.template.forEach(template => {
                obj[template.Name] = {
                    ParameterName: template.Name,
                    ParameterValue: value[template.Name] || template.DefaultValue || '',
                    _stateType: 'add'
                }
            })
            obj['key'] = value['_ID'] || value['UserID'];
            this.state.data.push(obj);
        })

        this.setState(this.state);
    }
    moveUp() {
        let { state, props } = this;
        let selectedData = state.data[state.selectedIndex];
        let nextData = state.data[state.selectedIndex - 1];

        if (nextData) {
            let orderbyIndex = selectedData['OrderbyIndex'].ParameterValue;
            selectedData['OrderbyIndex'].ParameterValue = nextData['OrderbyIndex'].ParameterValue;
            nextData['OrderbyIndex'].ParameterValue = orderbyIndex;

            state.data[state.selectedIndex] = nextData;
            state.data[state.selectedIndex - 1] = selectedData;

            state.selectedIndex--;
            this.setState(this.state);
        }
    }


    moveDown() {
        let { state, props } = this;
        let selectedData = state.data[state.selectedIndex];
        let nextData = state.data[state.selectedIndex + 1];

        if (nextData) {
            let orderbyIndex = selectedData['OrderbyIndex'].ParameterValue;
            selectedData['OrderbyIndex'].ParameterValue = nextData['OrderbyIndex'].ParameterValue;
            selectedData['OrderbyIndex']._stateType = 'update';

            nextData['OrderbyIndex'].ParameterValue = orderbyIndex;
            nextData['OrderbyIndex']._stateType = 'update';

            state.data[state.selectedIndex] = nextData;
            state.data[state.selectedIndex + 1] = selectedData;

            state.selectedIndex++;
            this.setState(this.state);
        }
    }

    onRowClick(record, index, e) {
        this.state.selectedIndex = index;
        this.setState(this.state);
    }
    rowClassName(record, index) {
        if (index === this.state.selectedIndex) {
            return 'selected-td';
        }
        if (record.isRelatedProperty) {
            return 'visible-td';
        }
    }

    getTableHeight() {
        let height = document.body.clientHeight - 210;
        if (height <= this.state.data.length * 55) {
            return height;
        } else {
            return null;
        }
    }

    additional() {

    }

    rowSelection() {
        return {
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: this.selectChange.bind(this)
        };
    }

    public render(): JSX.Element {
        let { state, props } = this;

        return (<section>
            <Table className='edit-table'
                loading={state.loading}
                dataSource={this.state.data} columns={this.columns} pagination={false}
                rowSelection={this.rowSelection()}
                scroll={{
                    x: state.tableWidth,
                    y: this.getTableHeight()
                }}
                rowClassName={this.rowClassName.bind(this)}
                onRowClick={this.onRowClick.bind(this)}
            ></Table>

            <ModalSlip title='批量选择'
                onCancel={() => this.modalSlipVisible(false)}
                visible={state.modalSlipVisible}>
                {state.modalSlipVisible && this.selectRender()}
            </ModalSlip>

            {props.categroy === 'NSDutyCard' ?
                <SelectMember ref='SelectVar' onOk={this.onOk.bind(this)} /> :
                <SelectVar deviceId={this.props.deviceId} ref='SelectVar' onOk={this.onOk.bind(this)} />
            }

            {this.additional()}
        </section >);
    }
}


interface ISelectMemberProps {
    departmentId?: string
    onOk?: (data: { [key: string]: string }[]) => void
};
interface ISelectMemberState { };
export class SelectMember extends React.Component<ISelectMemberProps, ISelectMemberState> {

    state = {
        visible: false,
        loading: true,
        selectedRows: [],
        selectedRowKeys: [],
        data: [],

        pageSize: 10,
        total: 0,
        current: 0,
        seachText: ''
    }

    columns = [
        {
            title: '人员编号',
            dataIndex: 'UserID',
            key: 'UserID'
        },
        {
            title: '名字',
            dataIndex: 'Name',
            key: 'Name'
        }
    ];

    modalShow(bl: boolean) {
        if (bl && this.state.data.length === 0) {
            this.getNSDevicesVarInfoList();
        }
        this.setState({
            visible: bl
        })
    }

    async ajaxGetDate() {
        let { data } = await get('/user_list', {
            departmentId: this.props.departmentId || '-1',
            cateFilter: 'all',
            keyword: this.state.seachText,
            pageIndex: 1,
            pageSize: this.state.pageSize
        });

        this.state.total = this.state.pageSize * data.pageCount;
        this.state.current = data.pageIndex;
        this.state.data = data.pageList;
        this.state.data.forEach((value, index) => {
            value.key = value.UserID;
        });
        return data;
    }

    async getNSDevicesVarInfoList() {
        this.state.loading = true;
        let data = await this.ajaxGetDate();
        this.state.loading = false;
        this.setState(this.state);
    }

    handleOk() {
        this.props.onOk(this.state.selectedRows);

        this.modalShow(false);
        // 清空选中
        this.state.selectedRowKeys = [];
        this.state.selectedRows = [];
    }

    selectChange(selectedRowKeys) {
        this.state.selectedRowKeys = selectedRowKeys;

        this.state.selectedRows = [];
        this.state.selectedRowKeys.forEach((value, index) => {
            let data = this.state.data.find(data => data['key'] as any === value);
            this.state.selectedRows.push(data);
        });

        this.setState(this.state);
    }

    /**
     * 分页改变事件
     * 
     * @param {any} index
     * 
     * @memberOf SelectMember
     */
    onPaginationChange(index) {
        this.state.current = index;
        this.getNSDevicesVarInfoList();
        this.setState(this.state);
    }

    onChange(e) {
        let target: HTMLButtonElement = e.target;
        this.state.seachText = target.value;
    }

    onSearch(e) {
        this.getNSDevicesVarInfoList();
    }

    rowSelection() {
        return {
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: this.selectChange.bind(this)
        };
    }

    public render(): JSX.Element {
        let { state, props } = this;

        return <Modal title='选择人员' visible={this.state.visible}
            onOk={this.handleOk.bind(this)} onCancel={() => this.modalShow(false)}
        >
            <div className='modal-Content'>
                <div>
                    <InputSearch style={{ width: '100%' }}
                        placeholder='请输入关键字'
                        onChange={this.onChange.bind(this)}
                        onSearch={this.onSearch.bind(this)} />
                </div>
                <Table className='edit-table mt20'
                    loading={state.loading}
                    dataSource={this.state.data}
                    columns={this.columns}
                    pagination={false}
                    scroll={{ y: 400 }}
                    rowSelection={this.rowSelection()}
                ></Table>
                <Pagination className='mt20'
                    current={state.current}
                    total={state.total}
                    pageSize={state.pageSize}
                    onChange={this.onPaginationChange.bind(this)} />
            </div>
        </Modal>;
    }
}


interface ISelectVarProps {
    deviceId: string
    onOk: (data: { [key: string]: string }[]) => void
};
interface ISelectVarState {
    data?: {
        [key: string]: string,
    }[]
    visible?: boolean
    loading?: boolean

    selectedRows?: {
        [key: string]: string,
    }[],
    selectedRowKeys?: string[]
};
class SelectVar extends React.Component<ISelectVarProps, ISelectVarState> {
    state: ISelectVarState = {
        visible: false,
        loading: true,
        selectedRows: [],
        selectedRowKeys: [],
        data: []
    }

    columns = [
        {
            title: '姓名',
            dataIndex: 'VarName',
            key: 'VarName'
        },
        {
            title: '描述',
            dataIndex: 'Description',
            key: 'Description'
        }
    ];

    renderText() {
        return (text, value, index) => {
            console.log(value);
            return <span></span>;
        };
    }

    async ajaxGetDate(categroy: string) {
        let { data } = await get('/device_attribute', {
            deviceId: this.props.deviceId,
            categroy: categroy
        });

        data[categroy].forEach((value, index) => {
            value.key = value._ID;
        });
        return data;
    }

    async getNSDevicesVarInfoList() {
        this.state.loading = true;
        let data = await this.ajaxGetDate('NSDevicesVarInfo');
        this.state.data = data['NSDevicesVarInfo'];
        this.state.loading = false;
        this.setState(this.state);
    }

    // componentWillMount() {
    //     this.getNSDevicesVarInfoList();
    // }

    modalShow(bl: boolean) {
        if (bl && this.state.data.length === 0) {
            this.getNSDevicesVarInfoList();
        }
        this.setState({
            visible: bl
        })
    }

    handleOk() {

        // let selectRows = this.state.selectedRows.map((value, index) => {
        //     let obj = Object.assign(value);
        //     for (let key in obj) {
        //         if (obj.hasOwnProperty(key)) {
        //             let element = obj[key];
        //             obj[key] = {
        //                 ParameterName: key,
        //                 ParameterValue: element
        //             }
        //         }
        //     }
        //     return obj;
        // })
        // console.log(selectRows);
        this.props.onOk(this.state.selectedRows);

        this.modalShow(false);
        // 清空选中
        this.state.selectedRowKeys = [];
        this.state.selectedRows = [];
    }


    selectChange(selectedRowKeys) {
        this.state.selectedRowKeys = selectedRowKeys;

        this.state.selectedRows = [];
        this.state.selectedRowKeys.forEach((value, index) => {
            let data = this.state.data.find(data => data['key'] as any === value);
            this.state.selectedRows.push(data);
        });

        this.setState(this.state);
    }


    public render(): JSX.Element {
        let { state, props } = this;

        return <Modal title='选择变量' visible={this.state.visible}
            onOk={this.handleOk.bind(this)} onCancel={() => this.modalShow(false)}
        >
            <div className='modal-Content'>
                <Table className='edit-table'
                    loading={state.loading}
                    dataSource={this.state.data}
                    columns={this.columns}
                    pagination={false}
                    scroll={{ y: 400 }}
                    rowSelection={{
                        selectedRowKeys: state.selectedRowKeys,
                        onChange: this.selectChange.bind(this)
                    }}
                ></Table>
            </div>
        </Modal>;
    }
}
