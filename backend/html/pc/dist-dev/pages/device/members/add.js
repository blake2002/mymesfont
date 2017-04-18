define("pages/device/members/add.js",function(require, exports, module) {
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const React = require("react");
const add_1 = require("../device/add");
const index_1 = require("../../../components/ajax/index");
const index_2 = require("../../../components/antd/index");
class Com extends add_1.default {
    ajaxSave() {
        return __awaiter(this, void 0, void 0, function* () {
            let newData = this.refs['AddInformation'].getData();
            let { data } = yield index_1.post({
                url: '/new_user',
                data: {
                    departmentId: this.props.query.regionId || 125,
                    props: { NSUsers: newData }
                }
            });
            index_2.message.success('新增成功！');
            this.props.jump(this.props.url, this.props.query);
        });
    }
    AddInformationRender() {
        return React.createElement(MembersAddInformation, { ref: 'AddInformation' });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Com;
class MembersAddInformation extends add_1.AddInformation {
    constructor() {
        super(...arguments);
        this.templateUrl = '/user_template';
        this.key = 'NSUsersTemplate';
    }
}
});
//# sourceMappingURL=add.js.map
