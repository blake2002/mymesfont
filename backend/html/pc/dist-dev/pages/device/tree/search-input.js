define("pages/device/tree/search-input.js",function(require, exports, module) {
"use strict";
const React = require("react");
const index_1 = require("../../../components/antd/index");
require("./tree-list.css");
const Option = index_1.Select.Option;
let timeout;
let currentValue;
function fetch(value, callback) {
    //   if (timeout) {
    //     clearTimeout(timeout);
    //     timeout = null;
    //   }
    //   currentValue = value;
    //   function fake() {
    //     const str = querystring.encode({
    //       code: 'utf-8',
    //       q: value,
    //     });
    //     jsonp(`https://suggest.taobao.com/sug?${str}`)
    //       .then(response => response.json())
    //       .then((d) => {
    //         if (currentValue === value) {
    //           const result = d.result;
    //           const data = [];
    //           result.forEach((r) => {
    //             data.push({
    //               value: r[0],
    //               text: r[0],
    //             });
    //           });
    //           callback(data);
    //         }
    //       });
    //   }
    //   timeout = setTimeout(fake, 300);
}
class SearchInput extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            data: [],
            value: '',
            focus: false
        };
    }
    handleChange(value) {
        this.setState({ value });
        fetch(value, data => this.setState({ data }));
    }
    handleSubmit() {
        console.log('输入框内容是: ', this.state.value);
    }
    handleFocus() {
        this.setState({ focus: true });
    }
    handleBlur() {
        this.setState({ focus: false });
    }
    render() {
        // const btnCls = classNames({
        //   'ant-search-btn': true,
        //   'ant-search-btn-noempty': !!this.state.value.trim()
        // });
        // const searchCls = classNames({
        //   'ant-search-input': true,
        //   'ant-search-input-focus': this.state.focus
        // });
        const options = this.state.data.map(d => React.createElement(Option, { key: d.value }, d.text));
        return (React.createElement("div", { className: 'ant-search-input-wrapper', style: this.props.style },
            React.createElement(index_1.Input.Group, null,
                React.createElement(index_1.Select, { combobox: true, value: this.state.value, placeholder: this.props.placeholder, notFoundContent: '', defaultActiveFirstOption: false, showArrow: false, filterOption: false, onChange: this.handleChange, onFocus: this.handleFocus, onBlur: this.handleBlur }, options))));
    }
}
exports.SearchInput = SearchInput;
;
});
//# sourceMappingURL=search-input.js.map
