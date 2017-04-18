define("components/ajax/index.js",function(require, exports, module) {
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const superagent = require("superagent");
const index_1 = require("../antd/index");
let errorMsg = index_1.notification.error;
const config_1 = require("../global/config");
const util = require("../util/index");
const React = require("react");
const value_1 = require("../global/value");
;
/**
 * ajax 记录
 */
let ajaxRecordArray = [];
exports.ajaxRecordArray = ajaxRecordArray;
/**
 * ajaxType 函数集合
 */
let typeFunctionArray = [
    // 0:同url同参数同类型 上一个完成时过 400ms 才能请求下一个
    (ajaxRecord) => {
        let { url, data } = ajaxRecord;
        let ajaxRecordGet = ajaxRecordArray.find(value => {
            return value !== ajaxRecord &&
                value.url === url &&
                objectEqual(value.data, data) &&
                ajaxRecord.time.getTime() - value.time.getTime() < 400;
        });
        if (ajaxRecordGet) {
            exports.ajaxRecordArray = ajaxRecordArray = ajaxRecordArray.filter(value => value !== ajaxRecord);
            // 不返回
            return new Promise(() => { return ''; });
        }
    },
    // 1:缓存请求返回值
    (ajaxRecord) => {
        return new Promise((reslove, reject) => {
            let { url, data, ajaxType } = ajaxRecord;
            let ajaxRecordGet = ajaxRecordArray.find(value => {
                return value !== ajaxRecord &&
                    value.url === url &&
                    objectEqual(value.data, data) &&
                    value.ajaxType === ajaxType;
            });
            if (ajaxRecordGet) {
                exports.ajaxRecordArray = ajaxRecordArray = ajaxRecordArray.filter(value => value !== ajaxRecord);
                if (ajaxRecordGet.responseDate) {
                    return reslove(ajaxRecordGet.responseDate);
                }
                else {
                    ajaxRecordGet.response.on('end', () => {
                        reslove(ajaxRecordGet.responseDate);
                    });
                }
            }
            reslove();
        });
    },
    // 2:延迟提交 400ms 同一时间400ms内的相同请求 只会请求最后一个请求
    (ajaxRecord) => {
        return new Promise((reslove, reject) => {
            let { url, data, ajaxType } = ajaxRecord;
            let ajaxRecordGet = ajaxRecordArray.find(value => {
                return value !== ajaxRecord &&
                    value.url === url &&
                    value.ajaxType === ajaxType &&
                    ajaxRecord.time.getTime() - value.time.getTime() < 400;
            });
            if (ajaxRecordGet) {
                clearTimeout(ajaxRecordGet.setTimeout);
            }
            ajaxRecord.setTimeout = setTimeout(() => reslove(), config_1.ajax.timeDelay);
        });
    },
    // 3:监听连接 有别人请求触发返回
    (ajaxRecord) => {
        return new Promise((reslove, reject) => {
            // ajaxRecordArray.unshift(ajaxRecord);
        });
    },
    // 4:监听服务器反推
    (ajaxRecord) => {
        return new Promise((reslove, reject) => {
            let { url, data, type, ajaxType } = ajaxRecord;
            let ajaxRecordGet = ajaxRecordArray.find(value => {
                return value !== ajaxRecord &&
                    value.url === url &&
                    value.type === type &&
                    objectEqual(value.data, data) &&
                    value.ajaxType === ajaxType &&
                    value.cancel === false;
            });
            if (!ajaxRecordGet) {
                reslove();
            }
        });
    }
];
/**
 * ajax函数
 *
 * @export
 * @param {Object} obj
 * @returns
 */
exports.ajax = (obj) => __awaiter(this, void 0, void 0, function* () {
    let ajaxRecord = getAjaxRecord(obj);
    let superAgentRequest = getAjaxRequest(ajaxRecord);
    let { type, callback, response } = ajaxRecord;
    ajaxRecordArray.unshift(ajaxRecord);
    // 添加请求记录 反向添加
    if (type !== -1) {
        // 根据ajaxType添加流程
        let typeFunctionValue = yield typeFunctionArray[type](ajaxRecord);
        if (typeFunctionValue) {
            return typeFunctionValue;
        }
    }
    let isSse;
    if (type === 4) {
        isSse = addSseEvent(ajaxRecord, (ajaxData) => {
            if (callback) {
                callback(ajaxData);
            }
        });
    }
    // 发送请求
    return new Promise((reslove) => {
        getAjaxPromise(superAgentRequest, ajaxRecord)
            .then(onSuccess, onError).then((value) => {
            if (value) {
                reslove(value);
            }
        });
    });
});
/**
 * 纯ajax发送
 *
 * @param {AjaxRecord} ajaxRecord
 * @returns
 */
function ajaxSend(ajaxRecord) {
    let response = getAjaxRequest(ajaxRecord);
    let ajaxPromise = getAjaxPromise(response, ajaxRecord);
    ajaxPromise.then(onSuccess, onError);
    return ajaxPromise;
}
/**
 * 获取AjaxRecord
 *
 * @param {AjaxRecord} ajaxRecord
 * @returns
 */
function getAjaxRecord(obj) {
    let { url, data, type, callback, ajaxType } = obj;
    type = type || 0;
    ajaxType = ajaxType || 'get';
    // 连接url 修改
    url = formatUrl(url);
    // 添加token
    if (data) {
        data.token = localStorage.getItem('token');
        data.userId = localStorage.getItem('userId');
    }
    else {
        data = {
            token: localStorage.getItem('token'),
            userId: localStorage.getItem('userId')
        };
    }
    let ajaxRecord = {
        url,
        time: new Date(),
        data,
        type,
        ajaxType,
        callback
    };
    return ajaxRecord;
}
/**
 * 获取ajaxRequest
 *
 * @param {AjaxRecord} ajaxRecord
 * @returns
 */
function getAjaxRequest(ajaxRecord) {
    let ajaxRequest;
    let { ajaxType, url, data } = ajaxRecord;
    // 创建请求
    switch (ajaxType) {
        case 'delete':
            ajaxRequest = superagent.delete(url);
            break;
        case 'put':
            ajaxRequest = superagent.put(url);
            break;
        case 'get':
            ajaxRequest = superagent.get(url);
            break;
        case 'post':
            ajaxRequest = superagent.post(url);
            break;
    }
    ajaxRecord.ajaxRequest = ajaxRequest;
    if (ajaxType === 'get' || ajaxType === 'del') {
        ajaxRequest = ajaxRequest.query(data);
    }
    else {
        // ajaxRequest.set('Content-Type', 'application/x-www-form-urlencoded');
        ajaxRequest = ajaxRequest.send(data);
    }
    return ajaxRequest;
}
/**
 * 判断对象的值是否相等
 *
 * @export
 * @param {Object} obj
 * @param {Object} obj2
 * @returns
 */
function objectEqual(obj, obj2) {
    if (typeof (obj) !== 'object' || typeof (obj2) !== 'object') {
        if (obj !== obj2) {
            return false;
        }
        else {
            return true;
        }
    }
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (key !== 'token' && key !== 'userId' && key !== '__cache') {
                if (!objectEqual(obj[key], obj2[key])) {
                    return false;
                }
            }
        }
    }
    return true;
}
exports.objectEqual = objectEqual;
let sseSource;
/**
 * Sse
 *
 * @param {AjaxRecord} ajaxRecord
 * @param {(ajaxData: AjaxData) => void} callback
 */
function addSseEvent(ajaxRecord, callback) {
    sseInit();
    if (!sseSource) {
        return false;
    }
    ajaxRecord.SseFunction = function (event) {
        let data = JSON.parse(event.data);
        if (data.url === ajaxRecord.url && objectEqual(data.requestData || {}, ajaxRecord.data)) {
            callback(data.data);
        }
    };
    sseSource.addEventListener('message', ajaxRecord.SseFunction, false);
    return true;
}
function sseInit() {
    if (EventSource && !sseSource) {
        sseSource = new EventSource(config_1.ajax.requestUrl + 'sse');
    }
}
/**
 * 格式化url
 *
 * @param {string} url
 * @returns
 */
function formatUrl(url) {
    // 连接url 修改
    if (url.indexOf('static:') === 0) {
        url = url.replace('static:', '');
    }
    else if (url.indexOf('http') !== 0) {
        url = config_1.ajax.requestUrl + url;
    }
    return url;
}
/**
 * 注销记录
 *
 * @export
 * @param {AjaxRecord} ajaxRecord
 */
function cancelAjaxRecord(ajaxArguments) {
    ajaxArguments.data = ajaxArguments.data || {};
    ajaxArguments.url = formatUrl(ajaxArguments.url);
    ajaxRecordArray.forEach(value => {
        if (value.url === ajaxArguments.url &&
            objectEqual(value.data, ajaxArguments.data) &&
            value.type === ajaxArguments.type &&
            !value.cancel) {
            value.cancel = true;
            clearTimeout(value.setTimeout);
            sseSource.removeEventListener('message', value.SseFunction);
            let ajaxRecord = Object.assign(value);
            ajaxRecord.data = {
                cancel: true
            };
            ajaxSend(ajaxRecord);
        }
    });
}
exports.cancelAjaxRecord = cancelAjaxRecord;
/**
 * 成功时的处理
 *
 * @param {any} ajaxRecord
 */
function onSuccess(ajaxRecord) {
    return __awaiter(this, void 0, void 0, function* () {
        let ajaxRecordList = ajaxRecordArray.filter(value => {
            return value !== ajaxRecord &&
                value.type === 3 &&
                value.url === ajaxRecord.url &&
                objectEqual(value.data, ajaxRecord.data) &&
                value.ajaxType === ajaxRecord.ajaxType &&
                !value.cancel;
        });
        ajaxRecordList.forEach(value => {
            value.callback(ajaxRecord.responseDate);
        });
        let res = ajaxRecord.response;
        try {
            ajaxRecord.responseDate = JSON.parse(res.text);
        }
        catch (error) {
            return ajaxRecord.responseDate;
        }
        if (ajaxRecord.responseDate.code === 0) {
            if (ajaxRecord.type === 4 && !EventSource) {
                ajaxRecord.setTimeout = setTimeout(() => {
                    ajaxSend(ajaxRecord);
                }, config_1.ajax.pollingTime);
            }
            if (ajaxRecord.callback) {
                ajaxRecord.callback(ajaxRecord.responseDate);
            }
            return ajaxRecord.responseDate;
        }
        else {
            switch (ajaxRecord.responseDate.code) {
                case 'ax105':
                    value_1.default.jump('/login/index');
                    break;
                case 'ax106':
                    let { data } = yield get('/my_token');
                    localStorage.setItem('token', data['token']);
                    ajaxRecord.type = -1;
                    let ajaxData = yield exports.ajax(ajaxRecord);
                    if (ajaxRecord.callback) {
                        ajaxRecord.callback(ajaxData);
                    }
                    return ajaxData.data;
            }
            if (ajaxRecord.responseDate.code) {
                errorMsg({
                    message: `请求错误!`,
                    description: React.createElement("div", null,
                        React.createElement("p", null,
                            "\u9519\u8BEF\u7801:",
                            ajaxRecord.responseDate.code),
                        React.createElement("p", null,
                            "\u9519\u8BEF\u4FE1\u606F:",
                            ajaxRecord.responseDate.comment))
                });
            }
            else {
                errorMsg({
                    message: `未知错误!`,
                    description: ''
                });
            }
        }
    });
}
/**
 * 出错时的处理
 *
 * @param {AjaxRecord} ajaxRecord
 * @returns
 */
function onError(ajaxRecord) {
    if (ajaxRecord.response) {
        errorMsg({
            message: `请求错误!`,
            description: `错误码:${ajaxRecord.response.status}`
        });
    }
    else {
        errorMsg({
            message: `请求错误!`,
            description: `未知错误`
        });
    }
    // return ajaxRecord.responseDate;
}
/**
 * 发送请求 Promise
 *
 * @param {superagent.SuperAgentRequest} ajaxRequest
 * @param {AjaxRecord} ajaxRecord
 * @returns
 */
function getAjaxPromise(ajaxRequest, ajaxRecord) {
    return new Promise((reslove, reject) => {
        // 发送请求
        ajaxRequest.end((error, res) => {
            ajaxRecord.response = res;
            if (error) {
                reject(ajaxRecord);
            }
            else {
                reslove(ajaxRecord);
            }
        });
    });
}
/**
 * 组装参数
 *
 * @returns {AjaxArguments}
 */
function argumentsAssemble() {
    let obj;
    switch (arguments.length) {
        case 1:
            if (typeof (arguments[0]) === 'object') {
                obj = arguments[0];
            }
            else {
                obj = {
                    url: arguments[0]
                };
            }
            ;
            break;
        case 2:
            obj = {
                url: arguments[0],
                data: arguments[1]
            };
            break;
        case 3:
            obj = {
                url: arguments[0],
                data: arguments[1],
                callback: arguments[2]
            };
            break;
    }
    return obj;
}
/**
 * get 请求
 *
 * @export
 * @param {string} url
 * @param {{ [key: string]: any }} [data]
 * @param {number} [type]
 * @returns
 */
let get = function () {
    let obj = argumentsAssemble.apply(this, arguments);
    let { url, data, type, callback } = obj;
    data = data || {};
    data['__cache'] = util.uuid();
    obj.ajaxType = 'get';
    return exports.ajax(obj);
};
exports.get = get;
/**
 * post 请求
 *
 * @export
 * @param {string} url
 * @param {{ [key: string]: any }} [data]
 * @param {number} [type]
 * @returns
 */
let post = function () {
    let obj = argumentsAssemble.apply(this, arguments);
    obj.data = obj.data || {};
    obj.ajaxType = 'post';
    return exports.ajax(obj);
};
exports.post = post;
/**
 * put 请求
 *
 * @export
 * @param {string} url
 * @param {{ [key: string]: any }} [data]
 * @param {number} [type]
 * @returns
 */
let put = function () {
    let obj = argumentsAssemble.apply(this, arguments);
    obj.data = obj.data || {};
    obj.ajaxType = 'put';
    return exports.ajax(obj);
};
exports.put = put;
/**
 * del 请求
 *
 * @export
 * @param {string} url
 * @param {{ [key: string]: any }} [data]
 * @param {number} [type]
 * @returns
 */
let del = function () {
    let obj = argumentsAssemble.apply(this, arguments);
    obj.data = obj.data || {};
    obj.ajaxType = 'del';
    return exports.ajax(obj);
};
exports.del = del;
});
//# sourceMappingURL=index.js.map
