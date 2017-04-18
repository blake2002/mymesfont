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

    render() {
        const operations = <div>
            <Link to={{
                pathname: '/system/roleManager/roleAttribute/_roleNav',
            }} ><Button>新建</Button></Link>
        </div>;
        return <section className='h100 page-device'>
            <section >
                <Nav operations={operations}></Nav>
                <EditableTable ref='table'  ></EditableTable>
            </section>
        </section>;
    }
}
