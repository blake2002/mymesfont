import * as React from 'react';
export { React };
import { PageGenerics } from '../../../components/global/components';
import { Tabs, TabPane, Button, message, Modal } from '../../../components/antd/index';
import { MainLeft } from '../../_main';
import { post, get } from '../../../components/ajax/index';
import OptionsSelect from '../../../components/options-select/index';
import { uuid } from '../../../components/util/index';




export default class DeviceAdd extends PageGenerics<any, any> {

    state = {

    }

    componentWillMount() {

    }


    render() {
        let {state, props} = this;
        return <section className='h100 page-device'>
            <MainLeft></MainLeft>
            <section className='main-right'>
                <section className='main-right-tabs'>
                    <div className='main-right-tabs-left ml20 mr20'>
                        <Button onClick={() => this.props.goBack()}> 返回</Button>
                    </div>
                </section>


            </section>

        </section>
    }
}

