
import * as React from 'react';
export { React };
import { Link } from 'react-router';
// import { PageGenerics } from '../../../components/global/components';
import { Menu, Button, Table, Switch } from '../../../components/antd/index';

import { MainLeft } from '../../_main';
import Nav from '../_nav';
import { EditableTable } from './_grid'

import './index.css';

export default class Device extends React.Component<any, any>{

    componentWillMount() {
    }

    onSave = () => {
        (this.refs['table'] as EditableTable).onSave()
    }
    onNew = () => {
        (this.refs['table'] as EditableTable).onNew()
    }
    render() {
        const operations = <div>
            <Button className='mr10' onClick={this.onNew}>新增词典</Button>
            <Button type='primary' onClick={this.onSave}>保存</Button>
        </div>;
        return <section className='h100 page-device'>
            <section >
                <Nav operations={operations}></Nav>
                <EditableTable ref='table'  ></EditableTable>
            </section>
        </section>;
    }
}
