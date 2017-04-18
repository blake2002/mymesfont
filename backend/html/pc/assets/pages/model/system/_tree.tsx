import * as React from 'react';
import { Tree, TreeNode, Dropdown, Icon, Menu, Input, message, Checkbox } from '../../../components/antd/index';
import { post, get } from '../../../components/ajax/index';
import { uuid, trim } from '../../../components/util/index';

export type TreeData = TreeModle | TreeChildren;

export type Level = 'root' | 'model' | 'level2' | 'level3+';

interface TreeModle {
    ModelName: string
    Children: TreeChildren[]
    key: string,
    type?: 'add' | 'select' | 'update'
    level: Level
}

interface TreeChildren {
    key: string
    Name: string
    Children: TreeChildren[]
    type?: 'add' | 'select' | 'update'
    level: Level
}

interface IModelTreeProps {
    disabled?: boolean
    onClick: (name: string, modelName: string, data: TreeData) => void
    type: 'system' | 'custom'
};
interface IModelTreeState { };
export default class ModelTree extends React.Component<IModelTreeProps, IModelTreeState> {

    state = {
        data: [],
        selectedKeys: [],
        expandedKeys: ['root']
    }

    /**
     * 查找父级别
     * 
     * @param {any} key
     * @returns
     * 
     * @memberOf ModelTree
     */
    findParent(key) {
        return this.dataFindParent(this.state.data, key);
    }




    /**
     *  查找父级
     * 
     * @param {TreeData[]} data
     * @param {any} key
     * @returns {TreeData}
     * 
     * @memberOf ModelTree
     */
    dataFindParent(data: TreeData[], key): TreeData {
        let findData = data.find(value => {
            return !!value.Children.find(value => value.key === key);
        });

        if (!findData) {
            data.find(value => {
                findData = this.dataFindParent(value.Children, key);
                return !!findData;
            })
        }

        return findData;
    }

    findFristParent(key: string) {
        return this.dataFindFristParent(this.state.data[0].Children, key);
    }

    /**
     * 查找第一级元素
     * 
     * @param {TreeData[]} data
     * @param {any} key
     * @returns {TreeData}
     * 
     * @memberOf ModelTree
     */
    dataFindFristParent(data: TreeData[], key): TreeData {
        let findData = data.find(value => {
            return !!value.Children.find(value => value.key === key);
        });

        if (!findData) {
            data.find(value => {
                let bl = !!this.dataFindParent(value.Children, key);
                if (bl) {
                    findData = value;
                }
                return bl;
            })
        }
        return findData;
    }

    loop(data: TreeChildren[]) {
        let disabled = this.props.disabled === null ? false : this.props.disabled;
        return data.map((item) => {
            if (item.Children && item.Children.length) {
                return <TreeNode disabled={disabled}
                    key={item.key} title={this.titleRander(item)} >{this.loop(item.Children)}</TreeNode>;
            }
            return <TreeNode disabled={disabled}
                key={item.key} title={this.titleRander(item)} ></TreeNode>;
        })
    }


    titleRander(data: TreeChildren) {
        let name = data.Name || data['ModelName']
        return <div className='tree-title'>
            <span className='tree-title-text'>
                {data.type === 'add' ? this.addInputRender(data) :
                    <span className='tree-span-click' onClick={() => this.onClick(data)}>{name}</span>}
            </span>
            <span>
                <span className='fr'>
                    <Dropdown overlay={this.menuRender(data)} trigger={['click']}>
                        <Icon className='treeIcon' type='ellipsis' />
                    </Dropdown>
                </span>
            </span>
        </div>
    }


    onClick(data: TreeData) {
        if (data.level !== 'root') {
            if (data.level === 'model') {
                this.props.onClick(null, this.getName(data), data)
            } else {
                this.props.onClick(this.getName(data), this.getName(this.findFristParent(data.key)), data)
            }
        }
    }

    addInputOnChange(e, data) {
        let target: HTMLButtonElement = e.target;
        this.dataChangeName(data, target.value)
    }

    /**
     * 添加按钮失去焦点事件
     * 
     * @param {any} e
     * @param {any} data
     * 
     * @memberOf ModelTree
     */
    async addInputOnBlur(e, treeData: TreeData) {
        let target: HTMLButtonElement = e.target;
        let name = trim(this.getName(treeData));

        if (!name) {
            let pData = this.findParent(treeData.key);
            pData.Children = pData.Children.filter(value => value !== treeData);
            this.setState(this.state);
            return;
        }


        if (treeData.level === 'model') {
            let { data } = await post('/new_model', {
                modelName: name,
                category: this.props.type
            })
        } else {
            let { data } = await post('/new_model_node', {
                modelName: this.getName(this.findFristParent(treeData.key)),
                parentName: this.getName(this.findParent(treeData.key)),
                nodeName: name
            });
        }

        // this.props.onClick(name, this.getName(this.findFristParent(treeData.key)), treeData);
        treeData.type = 'select';
        message.success('添加成功！');
        this.setState(this.state);
    }


    /**
     * 获取名字
     * 
     * @param {any} treeData
     * @returns
     * 
     * @memberOf ModelTree
     */
    getName(treeData) {
        return treeData['ModelName'] || treeData['Name'];
    }

    /**
     * 添加输入框渲染
     * 
     * @param {TreeData} data
     * @returns
     * 
     * @memberOf ModelTree
     */
    addInputRender(data: TreeData) {
        return <Input onKeyDown={(e) => this.onKeyDown(e, data)}
            ref={data.key} onBlur={(e) => this.addInputOnBlur(e, data)}
            onChange={e => this.addInputOnChange(e, data)} />
    }

    onKeyDown(e, data) {
        if (e && e.keyCode === 13) {
            this.addInputOnBlur(e, data);
        }
    }

    dataChangeName(data: TreeData, name: string) {
        if (data['ModelName'] === null) {
            data['Name'] = name;
        } else {
            data['ModelName'] = name;
        }
    }

    menuRender(data: TreeData) {
        return <Menu onClick={(param) => this.menuClick(param, data)}>
            {!(data.level === 'model' && data.Children.length === 1) && <Menu.Item key='add'>新增</Menu.Item>}
            {data.level !== 'root' && <Menu.Item key='delete'>删除</Menu.Item>}
        </Menu >;
    }

    menuClick(param, data: TreeData) {
        switch (param.key) {
            case 'add':
                this.addChildran(data);
                break;
            case 'delete':
                this.deleteModel(data);
                break;
        }
    }

    async deleteModel(data: TreeData) {
        if (data.level === 'model') {
            await post('/delete_model', {
                modelName: this.getName(data)
            })
        } else {
            await post('/delete_model_node', {
                modelName: this.getName(this.findFristParent(data.key)),
                nodeName: this.getName(data)
            })
        }
        let pdata = this.findParent(data.key);
        pdata.Children = pdata.Children.filter(value => value !== data);
        this.setState(this.state);
        message.success('删除成功！');
    }

    onNodeClick(modelName: string, name: string) {
        let obj = this.state.data[0].Children.find(value => value.ModelName === modelName);

        let Children = this.dataFindChildren(obj['Children'], name);
        this.props.onClick(this.getName(Children), this.getName(this.findFristParent(Children.key)), Children);
        // this.addExpandedKeys(data.key);
    }


    dataFindChildren(data: TreeChildren[], name: string): TreeChildren {
        let findData = data.find(value => {
            let bl = value.Name === name;
            if (bl) {
                this.state.selectedKeys = [value.key];
                this.addExpandedKeys(value.key);
            }
            return bl;
        });

        if (!findData) {
            data.find(value => {
                findData = this.dataFindChildren(value.Children, name);
                return !!findData;
            })
        }

        return findData;
    }

    /**
     * 添加子级
     * 
     * @param {TreeChildren} data
     * 
     * @memberOf ModelTree
     */
    addChildran(data: TreeData) {
        let key = uuid();
        data.Children.push({
            type: 'add',
            key: key,
            Name: '',
            level: this.reduceLevel(data.level),
            Children: []
        });
        this.addExpandedKeys(data.key);
        this.setState(this.state, () => {
            (this.refs[key] as any).focus();
        });
    }

    /**
     * 添加展开项
     * 
     * @param {string} key
     * 
     * @memberOf ModelTree
     */
    addExpandedKeys(key: string) {
        if (this.state.expandedKeys.indexOf(key) === -1) {
            this.state.expandedKeys.push(key);
        }
    }

    /**
     * 获取数据
     * 
     * 
     * @memberOf ModelTree
     */
    async getDataSource() {
        let getData;

        if (this.props.type === 'system') {
            let { data } = await get('/system_model_list');
            getData = data;
        } else {
            let { data } = await get('/custom_model_list');
            getData = data;
        }
        this.state.data = [{
            ModelName: this.props.type === 'system' ? '系统模型' : '用户模型',
            Children: getData.ModelList,
            key: 'root',
            level: 'root'
        }]

        this.state.data[0].Children.forEach(value => this.addKey(value, 'root'));
        let fristNode = this.state.data[0].Children[0];
        if (this.props.onClick && fristNode) {
            this.props.onClick(null, this.getName(fristNode), fristNode);
            // this.props.onClick('呆呆呆', 'test', { level: 'level3+' });
        }
        this.setState(this.state);
    }

    addKey(data: TreeData | TreeChildren, pLevel?: Level) {
        data.key = uuid();
        data.level = this.reduceLevel(pLevel);
        data.Children.forEach(value => {
            this.addKey(value, data.level);
        });
    }

    reduceLevel(level?: Level): Level {
        switch (level) {
            case undefined:
                return 'root';
            case 'root':
                return 'model';
            case 'model':
                return 'level2';
            default:
                return 'level3+';
        }
    }

    onExpand(expandedKeys, obj) {
        this.state.expandedKeys = expandedKeys;
        this.setState(this.state);
    }

    onSelect(key) {
        this.state.selectedKeys = key;
        this.setState(this.state);
    }

    public render(): JSX.Element {
        let { props, state } = this;
        return (<section>
            <Tree
                selectedKeys={this.state.selectedKeys}
                onSelect={this.onSelect.bind(this)}
                expandedKeys={state.expandedKeys} onExpand={this.onExpand.bind(this)}>
                {this.loop(this.state.data)}
            </Tree>
        </section>);
    }


    /**
     * 组件渲染完毕获取ajax数据
     * 
     * 
     * @memberOf Device
     */
    componentDidMount() {
        this.getDataSource();

    }
}


interface ICheckTreeProps {
    defaultValue: {
        ModelName: string,
        Name: string
    },
    onChange: (obj: {
        ModelName: string,
        Name: string
    }) => void
    type: 'system' | 'custom'
};
interface ICheckTreeState { };
export class CheckTree extends React.Component<ICheckTreeProps, ICheckTreeState> {
    state = {
        value: this.props.defaultValue,
        data: []
    }

    /**
     * 获取数据
     * 
     * 
     * @memberOf ModelTree
     */
    async getDataSource() {
        let getData;

        let { data } = await get('/model_related_node_options', {
            modelType: this.props.type,
            modelName: ''
        });
        getData = data;
        this.state.data = getData.ModelList;

        this.state.data.forEach(value => this.addKey(value, 'root'));
        this.setState(this.state);
    }

    /**
     * ajax数据添加key
     * 
     * @param {(TreeData | TreeChildren)} data
     * 
     * @memberOf ModelTree
     */
    addKey(data: TreeData | TreeChildren, pLevel?: Level) {
        data.key = uuid();
        data.level = this.reduceLevel(pLevel);
        data.Children.forEach(value => {
            this.addKey(value, data.level);
        });
    }

    reduceLevel(level?: Level): Level {
        switch (level) {
            case undefined:
                return 'root';
            case 'root':
                return 'model';
            case 'model':
                return 'level2';
            default:
                return 'level3+';
        }
    }


    findFristParent(key: string) {
        return this.dataFindFristParent(this.state.data, key);
    }

    /**
     * 查找第一级元素
     * 
     * @param {TreeData[]} data
     * @param {any} key
     * @returns {TreeData}
     * 
     * @memberOf ModelTree
     */
    dataFindFristParent(data: TreeData[], key): TreeData {
        let findData = data.find(value => {
            return !!value.Children.find(value => value.key === key);
        });

        if (!findData) {
            data.find(value => {
                let bl = !!this.dataFindParent(value.Children, key);
                if (bl) {
                    findData = value;
                }
                return bl;
            })
        }
        return findData;
    }

    /**
     *  查找父级
     * 
     * @param {TreeData[]} data
     * @param {any} key
     * @returns {TreeData}
     * 
     * @memberOf ModelTree
     */
    dataFindParent(data: TreeData[], key): TreeData {
        let findData = data.find(value => {
            return !!value.Children.find(value => value.key === key);
        });

        if (!findData) {
            data.find(value => {
                findData = this.dataFindParent(value.Children, key);
                return !!findData;
            })
        }

        return findData;
    }

    onChange(obj) {
        this.state.value = obj;
        this.setState(this.state);
        if (this.props.onChange) { this.props.onChange(obj); }
    }

    clearValue() {
        this.state.value = null;
        this.setState(this.state);
    }

    titleRander(data: TreeChildren) {
        let name = data.Name || data['ModelName']
        let checked;
        if (this.state.value) {
            checked = data.Name === this.state.value.Name &&
                this.findFristParent(data.key)['ModelName'] === this.state.value.ModelName;
        }
        return <span>
            {data.level === 'model' ? name :
                <Checkbox checked={checked} onChange={(e) => {
                    if (e.target['checked']) {
                        this.onChange({
                            Name: data['Name'],
                            ModelName: this.findFristParent(data.key)['ModelName']
                        })
                    } else {
                        this.onChange(null)
                    }
                }}>{name}</Checkbox>
            }
        </span >
    }

    loop(data: TreeChildren[]) {
        return data.map((item) => {
            if (item.Children && item.Children.length) {
                return <TreeNode key={item.key} title={this.titleRander(item)} >{this.loop(item.Children)}</TreeNode>;
            }
            return <TreeNode key={item.key} title={this.titleRander(item)} ></TreeNode>;
        })
    }

    public render(): JSX.Element {
        let { props, state } = this;
        return (<section>
            <Tree>
                {this.loop(this.state.data)}
            </Tree>
        </section>);
    }

    /**
     * 组件渲染完毕获取ajax数据
     * 
     * 
     * @memberOf Device
     */
    componentDidMount() {
        this.getDataSource();
    }
}










































// post('/delete_model', {
//     modelName: 'test'
// })


