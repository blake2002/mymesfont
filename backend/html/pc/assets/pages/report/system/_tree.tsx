import * as React from 'react';
import { Tree, TreeNode, Dropdown, Icon, Menu, Input, message, Checkbox } from '../../../components/antd/index';
import { post, get } from '../../../components/ajax/index';
import { uuid, trim } from '../../../components/util/index';


export function getParentString(treeData?: TreeData) {
    if (treeData && treeData.parent && treeData.parent.key !== 'root') {
        let str = getParentString(treeData.parent);
        return str + '$' + treeData.parent.Name;
    } else {
        return '';
    }
}



export type TreeData = {
    parent?: TreeData
    Name: string
    newName?: string
    HasChild?: number
    Children: TreeData[]
    key: string
    type?: 'add' | 'update',
    Id?: string
}

interface IModelTreeProps {
    disabled?: boolean
    onClick: (data: TreeData) => void
};
interface IModelTreeState { };
export default class ModelTree extends React.Component<IModelTreeProps, IModelTreeState> {
    state = {
        data: [],
        expandedKeys: ['root']
    }


    loop(data: TreeData[]) {
        let disabled = this.props.disabled === null ? false : this.props.disabled;
        return data.map((item) => {
            if (item.Children && item.Children.length) {
                return <TreeNode data={item} disabled={disabled}
                    key={item.key} title={this.titleRander(item)} >{this.loop(item.Children)}</TreeNode>;
            }
            return <TreeNode data={item} disabled={disabled} isLeaf={item.HasChild === 0}
                key={item.key} title={this.titleRander(item)} ></TreeNode>;

        })
    }



    textRander(data: TreeData) {
        switch (data.type) {
            case 'add':
                return this.addInputRender(data);
            case 'update':
                setTimeout(() => {
                    (this.refs[data.key] as any).focus();
                }, 1);
                data.newName = data.Name;
                return this.updateInputRender(data);
            default:
                return <span onClick={() => this.onClick(data)}>{data.Name}</span>;

        }
    }

    updateInputRender(data: TreeData) {
        return <Input ref={data.key} defaultValue={data.Name} onBlur={(e) => this.updateInputOnBlur(e, data)}
            onChange={e => this.updateInputOnChange(e, data)} />
    }


    updateInputOnChange(e, data: TreeData) {
        let target: HTMLButtonElement = e.target;
        data.newName = target.value;
    }


    async updateInputOnBlur(e, treeData: TreeData) {
        let target: HTMLButtonElement = e.target;

        let name = trim(treeData.newName);
        if (!name) {
            message.success('请输入！');
            (this.refs[treeData.key] as any).focus();
            return;
        }

        if (name === treeData.Name) {
            treeData.type = null;
            this.setState(this.state);
            return;
        }

        // console.log(this.getParentString(treeData));
        // console.log(name);

        let { data } = await post('/report_modify_dir', {
            parent: getParentString(treeData) || '$',
            dirId: treeData.Id,
            name: name
        })
        treeData.Name = treeData.newName;
        treeData.type = null;
        message.success('添加成功！');
        this.setState(this.state);
    }


    titleRander(data: TreeData) {
        let name = data.Name;

        return <div className='tree-title'>
            <span className='tree-title-text'>
                <span className='tree-span-click'>{this.textRander(data)}</span>
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
        // if (data.key !== 'root') {
        this.props.onClick(data);
        // }
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

        let name = trim(treeData.Name);
        if (!name) {
            treeData.parent.Children = treeData.parent.Children.filter(value => value !== treeData);
            if (treeData.parent.Children.length === 0) {
                treeData.parent.HasChild = 0;
            }
            this.setState(this.state);
            return;
        }


        // console.log(this.getParentString(treeData));
        // console.log(name);

        let { data } = await post('/report_create_dir', {
            parent: getParentString(treeData) || '$',
            name: name
        })

        treeData.type = null;
        treeData.Id = data.id;
        message.success('添加成功！');
        this.setState(this.state);
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
        return <Input ref={data.key} onBlur={(e) => this.addInputOnBlur(e, data)}
            onChange={e => this.addInputOnChange(e, data)} />
    }

    dataChangeName(data: TreeData, name: string) {
        data.Name = name;
    }

    menuRender(data: TreeData) {
        return <Menu onClick={(param) => this.menuClick(param, data)}>
            <Menu.Item key='add'>新增</Menu.Item>
            {data.key !== 'root' && <Menu.Item key='update'>修改</Menu.Item>}
            {data.key !== 'root' && <Menu.Item key='delete'>删除</Menu.Item>}
        </Menu >;
    }

    menuClick(param, data: TreeData) {
        switch (param.key) {
            case 'add':
                this.addChildran(data);
                break;
            case 'update':
                data.type = 'update';
                this.setState(this.state);
                break;
            case 'delete':
                this.deleteModel(data);
                break;
        }
    }

    async deleteModel(data: TreeData) {
        await post('/report_delete_dir', {
            dirId: data.Id
        })

        data.parent.Children = data.parent.Children.filter(value => value !== data);
        this.setState(this.state);
        message.success('删除成功！');
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
        data.HasChild = data.HasChild || 1;
        data.Children.push({
            type: 'add',
            key: key,
            Name: '',
            parent: data,
            Children: [],
            HasChild: 0
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

    async getDirs(treeData?: TreeData) {
        let { data } = await post('/report_dirs', {
            parent: treeData ? getParentString(treeData) : '',
            name: treeData ? treeData.Name : ''
        });

        data.list.forEach(value => {
            value.Children = value.Children || [];
            value.parent = treeData;
            this.addKey(value)
        });

        return data.list;
    }




    /**
     * 获取数据
     * 
     * 
     * @memberOf ModelTree
     */
    async getDataSource() {
        let getData;

        let data = await this.getDirs();
        let id = data.find(value => value.Name === '$').Id;
        data = data.filter(value => value.Name !== '$')

        let fristData = {
            Name: '报表',
            Children: data,
            HasChild: 1,
            Id: id,
            key: 'root'
        };

        data.forEach(value => {
            value.parent = fristData;
        });

        this.props.onClick(data[0]);
        this.state.data = [fristData];

        // this.state.data[0].Children.forEach(value => this.addKey(value, 'root'));
        // if (this.props.onClick) {
        //     let fristNode = this.state.data[0].Children[0];
        //     this.props.onClick(null, this.getName(fristNode), fristNode);
        //     // this.props.onClick('c2', 'ccccTestModel', { level: 'level3+' });
        // }
        this.setState(this.state);
    }


    onLoadData(treeNode) {
        let treeData: TreeData = treeNode.props.data;
        return new Promise(async (resolve) => {
            // const treeData = [...this.state.treeData];
            // getNewTreeData(treeData, treeNode.props.eventKey, generateTreeNodes(treeNode), 2);
            // this.setState({ treeData });
            // resolve();

            if (treeData.HasChild && !treeData.Children.length) {
                let data = await this.getDirs(treeData);
                treeData.Children = data;
                this.setState(this.state);
            }

            resolve();
        });
    }

    addKey(data: TreeData) {
        data.key = uuid();
        // data.level = this.reduceLevel(pLevel);
        // data.Children.forEach(value => {
        //     this.addKey(value, data.level);
        // });
    }

    onExpand(expandedKeys) {

        this.state.expandedKeys = expandedKeys;
        this.setState(this.state);
    }

    public render(): JSX.Element {
        let { props, state } = this;
        return (<section>
            <Tree loadData={this.onLoadData.bind(this)}
                expandedKeys={state.expandedKeys}
                onExpand={this.onExpand.bind(this)}>
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

