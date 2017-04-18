import * as React from 'react';
import Table from '../../../components/table/index';

class TableNew extends Table<{ key: string }>{ }
const dataSource = [{
    key: '1',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号'
}, {
    key: '2',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号'
}];

const columns = [{
    title: '姓名',
    dataIndex: 'name',
    key: 'name'
}, {
    title: '年龄',
    dataIndex: 'age',
    key: 'age'
}, {
    title: '住址',
    dataIndex: 'address',
    key: 'address'
}];

export default class Component extends React.PureComponent<any, any> {

    state = {
        text: '点击我',
        text2: 'text2'
    }


    btnClick() {
        this.setState({
            text: '1',
            text2: 'text2'
        });
    }

    render() {
        const {state} = this;
        return <section className='page-home'>
            <h2>表格</h2>
            <TableNew dataSource={dataSource} columns={columns} />
        </section>
    }
}

