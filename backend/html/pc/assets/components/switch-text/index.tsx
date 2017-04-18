import * as React from 'react';
import Validate, { IValidateProps } from '../validate/index';
import { PureComponentGenerics } from '../global/components';
import './index.css';



interface ITextInputProps extends IValidateProps {
    text: JSX.Element
    input: JSX.Element

    defaultShow: boolean,
};
interface ITextInputState {



};
class TextInput extends React.Component<ITextInputProps, ITextInputState> {

    state = {
        show: this.props.defaultShow !== undefined ? this.props.defaultShow : false
    }

    clickTarget: any

    public render(): JSX.Element {
        let {state, props} = this;
        return (<section className={'cp-text-input'}>
            {this.state.show ?
                <span className='cp-text-input-input' onClick={this.inputClick.bind(this)}>
                    {this.props.input}
                </span> :
                <span className='cp-text-input-text' onClick={this.spanClick.bind(this)}>
                    {this.props.text}
                </span>
            }
        </section>);
    }

    inputClick(e) {
        e.nativeEvent.stopImmediatePropagation();
    }

    componentWillMount() {
        document.addEventListener('click', this.show.bind(this));
    }
    componentWillUnmount() {
        document.removeEventListener('click', this.show.bind(this));
    }
    spanClick(e) {
        this.state.show = true;
        this.setState(this.state);
        e.nativeEvent.stopImmediatePropagation();
    }
    show(e) {
        if (this.state.show) {
            this.state.show = false;
            this.setState(this.state);
        }
    }

    onChange?(e) {
        let target: HTMLButtonElement = e.target;
    }
}


export default TextInput;



