import '../antd/style/index.css';
import * as React from 'react';
import { default as Butt, ButtonProps } from 'antd/lib/button/button';
import SpinType from 'antd/lib/spin/index';
let Spin: typeof SpinType = require('antd/lib/spin/index');
let Button: typeof Butt = require('antd/lib/button/index');
export { Button };
let SpinC = Spin as any;
import { havePrivileges } from '../privileges/index';


interface ComponentProps extends ButtonProps {
    privileges?: string
}


export default class Component extends React.Component<ComponentProps, { loading: boolean }> {

    state = {
        loading: false
    }

    onClick(e) {
        let onClickBack: any = this.props.onClick(e);
        let self = this;
        if (onClickBack && onClickBack.then) {
            self.state.loading = true;
            self.setState(self.state);

            return onClickBack.then(function (arg) {
                self.state.loading = false;
                self.setState(self.state);
                return arg;
            }, function (arg) {
                self.state.loading = false;
                self.setState(self.state);
                return arg;
            });
        } else {
            return onClickBack;
        }
    }

    render() {
        let pr = true;

        if (this.props.privileges) {
            pr = havePrivileges(this.props.privileges);
        }
        let prop = Object.assign({}, this.props);
        if (prop.privileges) {
            delete prop.privileges
        }
        if (pr) {
            return (<span className={this.props && this.props.className}>
                <SpinC spinning={this.state.loading} size='small' style={{ display: 'inline-block' }}>
                    <Button {...prop} className='' onClick={this.props.onClick && this.onClick.bind(this)}>
                        {this.props.children}
                    </Button>
                </SpinC>
            </span>);
        } else {
            return null;
        }
    }
}
