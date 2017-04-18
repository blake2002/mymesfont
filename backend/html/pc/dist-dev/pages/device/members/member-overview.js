define("pages/device/members/member-overview.js",function(require, exports, module) {
"use strict";
const React = require("react");
require("./member-manager.css");
const index_1 = require("../../../components/antd/index");
const member_vars_1 = require("./member-vars");
class MemberOverview extends React.Component {
    onClose() {
        this.props.onVisible();
    }
    getDescription(k) {
        let memModel = this.getMemberModel();
        for (let obj of memModel) {
            if (obj['Name'] == k) {
                return obj['Description'];
            }
        }
        return null;
    }
    getTrs() {
        let trs = [];
        for (let k in this.props.memberInfo) {
            let dis = this.getDescription(k);
            let v = this.props.memberInfo[k];
            let tr = (React.createElement("tr", null,
                React.createElement("th", null, dis),
                React.createElement("td", null, v)));
            trs.push(tr);
        }
        return trs;
    }
    getMemberModel() {
        return member_vars_1.members_model;
    }
    render() {
        return (React.createElement("section", { className: 'member-overview ' + (this.props.visible ? 'visible' : '') },
            React.createElement("div", { className: 'member-overview-title' },
                React.createElement(index_1.Icon, { className: 'member-overview-close', onClick: this.onClose.bind(this), type: 'close' }),
                "\u4EBA\u5458\u6982\u89C8"),
            React.createElement(index_1.Button, { className: 'btn-concern' }, "\u5173\u6CE8"),
            React.createElement("h4", null,
                React.createElement("p", null, this.props.deviceInfo['@CompanyName']),
                React.createElement("p", null, this.props.deviceInfo['@DeviceID'])),
            React.createElement("table", { className: 'member-overview-table' },
                React.createElement("tbody", null, this.getTrs())),
            React.createElement("section", { className: 'member-overview-footer' },
                React.createElement(index_1.Button, null, "\u7F6E\u9876"),
                React.createElement(index_1.Button, null, "\u4FEE\u6539"),
                React.createElement(index_1.Button, null, "\u542F\u52A8"),
                React.createElement(index_1.Button, null, "\u66F4\u591A"))));
    }
}
exports.MemberOverview = MemberOverview;
});
//# sourceMappingURL=member-overview.js.map
