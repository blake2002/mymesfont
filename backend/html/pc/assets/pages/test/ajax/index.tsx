import * as React from 'react';
import { get, post, cancelAjaxRecord } from '../../../components/ajax/index';
import Button from '../../../components/button/index';
import { TreeList } from '../../device/tree/tree-list';
import { Label } from '../../device/label/label';
import { TreeSelectCom } from '../../device/tree/treeSelect'
import { ButtonModal } from '../treeSelect/buttomModel'
import { SelectModal } from '../../device/selectTree/selectModal'
/**
 * ajax demo
 * 
 * @export
 * @class Component
 * @extends {React.Component<any, any>}
 */
export default class Component extends React.Component<any, any> {

    /**
     * 状态保存log
     * 
     * 
     * @memberOf Component
     */
    state = {
        text: [],
        disabled: false,
        model: false
    }

    /**
     * log输出
     * 
     * @param {any} msg
     * 
     * @memberOf Component
     */
    log(msg) {
        let textArr = Object.assign(this.state.text);
        textArr.push(msg);
        this.setState({
            text: textArr
        });
    }

    /**
     * 第一个按钮'/test_api'
     * 
     * 
     * @memberOf Component
     */
    async getAjax() {
        this.log('默认400毫秒只能调用一次');
        this.log('调用第一次');

        let res = post('/test_api').then(res => {
            this.log('调用第一次成功');
            this.log('-------');
        });

        this.log('调用第二次');
        post('/test_api').then(res => {
            this.log('调用第二次成功');
        });
    }

    /**
     * 第二个按钮
     * 当按钮点击事件 返回的是 Promise 会有个loading
     * @returns
     * 
     * @memberOf Component
     */
    async getAjax1() {
        this.log('缓存');
        this.log('调用第一次');
        let res = await post({
            url: '/test_api',
            type: 1,
            data: { __request: 1 }
        })
        this.log('调用第一次成功');
        this.log('调用第二次');
        return post({
            url: '/test_api',
            type: 1,
            data: { __request: 1 }
        }).then(res => {
            this.log('调用第二次成功');
            this.log('-------');
        });
    }


    /**
     * 第三个按钮 
     * 当按钮点击事件 返回的是 Promise 会有个loading
     * @returns
     * 
     * @memberOf Component
     */
    async getAjax2() {
        this.log('延迟提交 400ms 只提交最后一次ajax');
        this.log('调用第一次');

        let res = post({
            url: '/test_api',
            type: 2
        }).then(res => {
            this.log('调用第一次成功');
        });
        this.log('调用第二次');
        return post({
            url: '/test_api',
            type: 2
        }).then(res => {
            this.log('调用第二次成功');
            this.log('-------');
        });
    }



    async getAjax3() {
        this.log('监听 assets/components/nav/index.tsx');

        let res = post({
            url: '/test_api',
            type: 3,
            callback: () => {
                this.log('监听成功');
                this.log('-------');
            }
        })
    }

    async getAjax4() {
        this.log('取消监听 assets/components/nav/index.tsx');

        cancelAjaxRecord({
            url: '/test_api',
            type: 3
        });
        cancelAjaxRecord({
            url: '/test_api',
            type: 4
        })
    }

    async getAjax0() {
        post({
            url: '/test_api',
            type: -1
        }).then(res => {
            this.log('调用成功');
            this.log('-------');
        });
    }


    async getAjax5() {
        post({
            url: '/test_api',
            type: 4,
            callback: () => {
                this.log('轮询一次');
            }
        }).then(res => {
            this.log('轮询调用成功');
            this.log('-------');
        });
    }

    async getAjax6() {
        post({
            url: '/test_api',
            type: 4,
            callback: () => {
                this.log('轮询2一次');
            }
        }).then(res => {
            this.log('轮询2调用成功');
            this.log('-------');
        });
    }


    async postAjax() {
        post({
            url: 'data',
            data: { a: 1 },
            callback: (req) => {
                console.log(req);
            }
        })

        post({
            url: 'data',
            data: { status: 3, comment: '登录过时' },
            callback: (req) => {
                console.log(req);
            }
        })

        post({
            url: 'data',
            data: { status: 0, comment: '成功' },
            callback: (req) => {
                console.log(req);
            }
        })

        post({
            url: 'data2',
            data: { a: 1 },
            callback: (req) => {
                console.log(req);
            }
        })
    }


    onclick() {
        let disabled = this.state.disabled ? false : true;
        this.setState({
            disabled: disabled
        })
    }
    /**
     * 渲染
     * 
     * @returns
     * 
     * @memberOf Component
     */
    myClick() {
        this.setState({
            model: true
        })
    }
    render() {
        return <section className='page-home'>
            <h2>简单例子55</h2>
            <div>
                <Button onClick={this.postAjax.bind(this)}>code检查</Button>
                <Button onClick={this.getAjax0.bind(this)}>普通ajax</Button>
                <Button onClick={this.getAjax.bind(this)}>限制连续触发</Button>
                <Button onClick={this.getAjax1.bind(this)}>缓存</Button>
                <Button onClick={this.getAjax2.bind(this)}>延迟提交</Button>
                <Button onClick={this.getAjax3.bind(this)}>监听</Button>
                <Button onClick={this.getAjax5.bind(this)}>轮询</Button>
                <Button onClick={this.getAjax6.bind(this)}>轮询2</Button>
                <Button onClick={this.getAjax4.bind(this)}>取消监听,轮询</Button>
            </div>
            {this.state.text.map((value, index) => {
                return <p key={index}>{value}</p>;
            })}
            <Button onClick={this.myClick.bind(this)}>my click</Button>
            <ButtonModal title='点击操作' treeType='region_tree'
                onGetNode={value => { console.log(value) } }
                value={[{ id: '58', name: '中国' }]} />
            <SelectModal onGetNode={value => { console.log(value) } } />
        </section>
    }
}

