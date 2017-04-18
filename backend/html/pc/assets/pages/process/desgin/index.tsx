import * as React from 'react';
export { React };
// import { Link } from 'react-router';
// import { PageGenerics } from '../../../components/global/components';
import { Menu, Button, Table, Switch } from '../../../components/antd/index';

import { MainLeft } from '../../_main';
import Nav from '../_nav';
import { EditableTable } from './_cell'

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
        const operations = <div>
            <Button className='menu-manager-btn-add' type="ghost" onClick={handleAdd}>新建流程</Button>
            <Button className='menu-manager-btn-add-lower' type="ghost" onClick={handleAddChildren}>导入流程</Button>
        </div>;
        return <section className='h100 page-device'>
            <section >
                <Nav operations={operations}></Nav>
                <EditableTable query={
                    1
                } ref='table'  ></EditableTable>
            </section>
        </section>;
    }
}
