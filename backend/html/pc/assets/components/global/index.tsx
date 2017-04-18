import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Route, Redirect, hashHistory, Lifecycle } from 'react-router';
import Nav from '../nav/index';
import { PageComponentGenerics } from './components';
import * as superagent from 'superagent';
import globalValue from './value';
import { havePrivileges } from '../privileges/index';



class Main extends PageComponentGenerics<any, any> {
    state = {
        loading: 0,
        page: <div></div>,
        style: 'separate'
    }
    asyncLoading() {
        this.state.loading = 0;

        let props = this.props;
        // 自动解析
        let url = props.route.path === '*' ? '../../pages' +
            props.location.pathname + '.js' : '../../pages/' + props.route.path + '.js';

        if ((window as any).__md5Array) {
            let md5obj = window.__md5Array.find(value => value.path === url);
            if (md5obj) {
                url = md5obj.md5;
            }
        }

        console.log('加载：' + url);
        this.setState(this.state);

        globalValue.url = props.location.pathname;
        globalValue.query = props.location.query;
        globalValue.jump = (url, data) => this.jump(url, data);
        globalValue.goBack = () => props.router.goBack();

        setTimeout(() => this.setState({ loading: 1 }), 0);

        try {
            require.async(url, (mod) => {
                setTimeout(() => {
                    this.state.loading = 2;

                    let error = 404;
                    let haveP = havePrivileges(mod.privileges);
                    if (!haveP) {
                        error = 401;
                    }
                    if (mod && haveP) {
                        let Page = mod.default;
                        this.setPage(<Page { ...this.getPageProps() } />, mod.style);
                    } else {
                        require.async('../../pages/error/index.js', (mod) => {
                            this.setPage(<mod.default status={404} {...this.getPageProps() } />, mod.style);
                        })
                    }
                }, 0);
            })
        } catch (error) {
            console.log(error);
        }
    }


    /**
     * 获取页面参数
     * 
     * 
     * @memberOf Main
     */
    getPageProps() {
        let {props} = this;
        return {
            goBack: () => props.router.goBack(),
            jump: (url, data) => this.jump(url, data),
            url: props.location.pathname,
            query: props.location.query,
            _router: props
        };
    }
    jump(url, data) {
        let ajaxRequest = superagent.get(url);
        ajaxRequest.query(data);
        let query = (ajaxRequest as any)._query[0] || '';
        query = query ? '?' + query : '';
        this.props.router.push(url + query);
    }

    setPage(Page: any, style?: string) {
        this.setState({
            page: Page,
            style: style
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        let oldLocation = this.props.location;
        let location = nextProps.location;
        if (oldLocation.pathname !== location.pathname
            || oldLocation.search !== location.search) {

            // if (oldLocation.pathname === location.pathname) {
            this.state.page = <div></div>;
            // }
            this.props = nextProps;
            this.state = nextState;
            this.asyncLoading();
            return false;
        }

        return true;
    }

    componentDidMount() {

        this.asyncLoading();
    }

    /**
     * 判断是否有token
     * 
     * 
     * @memberOf Main
     */
    componentWillMount() {
        let token = localStorage.getItem('token');
        if (!token) {
            this.props.router.push('/login/index')
        }
    }


    getLoadingClass() {
        switch (this.state.loading) {
            case 0:
                return '';
            case 1:
                return 'loading-box-loading';
            case 2:
                return 'loading-box-complete';
            case 3:
                return 'loading-box-complete';
        }
    }


    render() {
        let style = this.state.style;
        if (!style) {
            return <div className='h100'>
                <Nav {...this.getPageProps() }></Nav>
                <div className={'loading-box ' + this.getLoadingClass()}>
                    <div className='loading-box-inner'></div>
                </div>
                <section className='main-content'>
                    <section className='main-content-pr'>
                        {this.state.page}
                    </section>
                </section>
            </div>
        } else if (style === 'separate') {
            return <div className='h100'>
                <div className={'loading-box ' + this.getLoadingClass()}>
                    <div className='loading-box-inner'></div>
                </div>
                {this.state.page}
            </div>
        }
    }
}

class AppRouter extends React.Component<any, any> {


    render() {
        return (
            <Router history={hashHistory} >
                <Redirect from='/' to='/device/device/index' />
                <Route path='*' component={Main} />
            </Router>
        )
    }
}


ReactDOM.render(
    <AppRouter />,
    document.getElementById('app')
);

