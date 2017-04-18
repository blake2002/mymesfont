import * as React from 'react';
import {
    Tree, TreeNode
} from '../../components/antd/index';


export default class Component extends React.Component<any, any> {

    props = {
        keys: ['0-0-0', '0-0-1']
    }
    state = {
        defaultExpandedKeys: this.props.keys,
        defaultSelectedKeys: this.props.keys,
        defaultCheckedKeys: this.props.keys,
    }

    onSelect(info) {
        console.log('selected', info);
    }
    onCheck(info) {
        console.log('onCheck', info);
    }

    async onLoadData() {
        return <TreeNode title="leaf" key="0-0-111gfhdghdghdgh11-1" />;
    }
    render() {
        return (
            <Tree className="myCls" showLine checkable
                defaultExpandedKeys={this.state.defaultExpandedKeys}
                defaultSelectedKeys={this.state.defaultSelectedKeys}
                defaultCheckedKeys={this.state.defaultCheckedKeys}
                onSelect={this.onSelect} onCheck={this.onCheck}
                loadData={this.onLoadData.bind(this)}
            >
                <TreeNode title="parent 1-0" key="0-0-0" >
                    <TreeNode title="parent 1-0" key="0-0-0123" >
                        <TreeNode title="adfasdfadf" key="0-0-0-0123" isLeaf={true} />
                        <TreeNode title="leaf" key="0-0-0-11231" />
                    </TreeNode>
                    <TreeNode title="leaf" key="0-0-0-1" />
                </TreeNode>
                <TreeNode title="parent 1-1" key="0-0-1" isLeaf={true}>
                </TreeNode>
            </Tree>
        );
    }
}


class Component2 extends React.PureComponent<{
    text2: string
}, any> {
    render() {
        return <section className='page=home'>
            <h2>简单例子2</h2>
            <div>
                {this.props.text2}
            </div>
        </section>
    }
}
