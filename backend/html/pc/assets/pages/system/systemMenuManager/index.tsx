import * as React from 'react';
export { React };
// import { Link } from 'react-router';
// import { PageGenerics } from '../../../components/global/components';
import { Menu, Button, Table, Switch } from '../../../components/antd/index';

import { MainLeft } from '../../_main';
import Nav from '../_nav';
import { EditableTable } from './_grid'

import './index.css';

export default class Device extends React.Component<any, any>{

    componentWillMount() {
    }

    render() {
        let handleAdd = () => {
            (this.refs['table'] as any).handleAdd();
        }
        let handleAddChildren = () => {
            (this.refs['table'] as any).handleAddChildren();
        }
        let handleSave = () => {
            (this.refs['table'] as any).handleSave();
        }
        const operations = <div>
            <Button className='menu-manager-btn-add' type="ghost" onClick={handleAdd}>新增菜单</Button>
            <Button className='menu-manager-btn-add-lower' type="ghost" onClick={handleAddChildren}>新增下级菜单</Button>
            <Button className='menu-manager-btn-add-lower' type="primary" onClick={handleSave}>保存</Button>
        </div>;
        return <section className='h100 page-device'>
            <section >
                <Nav operations={operations}></Nav>
                <EditableTable ref='table'  ></EditableTable>
            </section>
        </section>;
    }
}
