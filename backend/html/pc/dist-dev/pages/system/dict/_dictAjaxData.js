define("pages/system/dict/_dictAjaxData.js",function(require, exports, module) {
"use strict";
const React = require("react");
exports.React = React;
const index_1 = require("../../../components/ajax/index");
/**
 *  接口说明 http://www.netscada.com:10002/documents/59
 */
class DictAjax {
    constructor() {
        this.dict_list = [];
        this.dict_columns = [];
        this.pageCount = 1;
        this.dict_template = [];
    }
    /**字典列表 */
    get_list(pageIndex, pageSize) {
        let p = index_1.get('/sys/dict_list', {
            pageIndex: pageIndex, pageSize: pageSize
        });
        p.then((reponse) => {
            if (reponse.code == 0) {
                this.dict_list = reponse.data.pageList;
                this.pageCount = reponse.data.pageCount;
            }
            else {
                console.error(reponse);
            }
        });
        return p;
    }
    /**字典模板 */
    get_template() {
        let p = index_1.get('/sys/dict_template', {});
        p.then((reponse) => {
            if (reponse.code == 0) {
                this.dict_template = reponse.data.DictTemplate.Props;
            }
            else {
                console.error(reponse);
            }
        });
        return p;
    }
    /**新增字典 */
    post_new(props) {
        let p = index_1.get('/sys/dict_list', {
            props
        });
        p.then((reponse) => {
            if (reponse.code == 0) {
            }
            else {
                console.error(reponse);
            }
        });
        return p;
    }
    /**编辑字典 */
    post_modify(key, type, props) {
        let p = index_1.get('/sys/modified_dict', {});
        p.then((reponse) => {
            if (reponse.code == 0) {
            }
            else {
                console.error(reponse);
            }
        });
        return p;
    }
    /**删除字典
     * @param dicts Key Type
    */
    post_delete(dicts) {
        let p = index_1.get('/sys/delete_dict', {
            dicts
        });
        p.then((reponse) => {
            if (reponse.code == 0) {
            }
            else {
                console.error(reponse);
            }
        });
        return p;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new DictAjax();
});
//# sourceMappingURL=_dictAjaxData.js.map
