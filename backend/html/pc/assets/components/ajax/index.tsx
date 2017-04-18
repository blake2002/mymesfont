import * as superagent from 'superagent';
import { notification } from '../antd/index';
let errorMsg = notification.error;
import { ajax as config } from '../global/config';
import * as util from '../util/index';
import * as React from 'react';
import globalVale from '../global/value';


declare let EventSource: any;


/**
 * ajax 参数
 * 
 * @interface AjaxArguments
 */
interface AjaxArguments {
    url: string,
    data?: AjaxRequest,
    type?: number,
    ajaxType?: string,
    callback?: (ajaxData: { [key: string]: any } | string) => void
}

/**
 * ajax 记录类型
 * 
 * @interface AjaxRecord
 */
interface AjaxRecord {
    /**
     * 请求连接
     * 
     * @type {string}
     * @memberOf AjaxRecord
     */
    url: string,

    /**
     * 请求的时间
     * 
     * @type {Date}
     * @memberOf AjaxRecord
     */
    time: Date,

    /**
     * 请求的类型 get post...
     * 
     * @type {number}
     * @memberOf AjaxRecord
     */
    type: number,

    /**
     * 请求数据
     * 
     * @type {{ [key: string]: any }}
     * @memberOf AjaxRecord
     */
    data: { [key: string]: any },

    /**
     * 请求发送类型
     * 
     * @type {string}
     * @memberOf AjaxRecord
     */
    ajaxType: string,


    /**
     * 请求延时触发存储
     * 
     * @type {*}
     * @memberOf AjaxRecord
     */
    setTimeout?: any,

    /**
     * 返回值json数组
     * 
     * @type {AjaxData}
     * @memberOf AjaxRecord
     */
    responseDate?: AjaxData,

    /**
     * 返回的superagent.Response
     * 
     * @type {superagent.SuperAgentRequest}
     * @memberOf AjaxRecord
     */
    response?: superagent.Response,
    ajaxRequest?: superagent.SuperAgentRequest,
    /**
     * 成功回调函数
     * 
     * 
     * @memberOf AjaxRecord
     */
    callback?: (ajaxData: { [key: string]: any } | string) => void,

    /**
     * 注销
     * 
     * @type {boolean}
     * @memberOf AjaxRecord
     */
    cancel?: boolean


    /**
     * Sse监视方法
     * 
     * @type {Function}
     * @memberOf AjaxRecord
     */
    SseFunction?: Function
}

/**
 * ajax请求返回值
 * 
 * @interface AjaxData
 */
export interface AjaxData {
    /**
     * code
     * 
     * @type {number}
     * @memberOf AjaxData
     */
    code: number | string,
    /**
     * 返回值
     * 
     * @type {(string | { [key: string]: string })}
     * @memberOf AjaxData
     */
    data: any,
    /**
     * code描述
     * 
     * @type {string}
     * @memberOf AjaxData
     */
    comment: string,

}

/**
 * ajax 函数 类型
 * 
 * @interface AjaxFunction
 */
interface AjaxFunction {
    (ajaxArguments: AjaxArguments, isUnshift?: boolean): Promise<AjaxData | never>
}

/**
 * ajax 发送类型
 * 
 * @interface AjaxFunction
 */
export interface AjaxRequest {
    token?: string,
    userId?: string,
    [key: string]: any
};

/**
 * ajax 函数 类型
 * 
 * @interface TypeFunction
 */
interface TypeFunction {
    (ajaxRecord: AjaxRecord): Promise<AjaxData | never>
}


/**
 * ajax 记录
 */
let ajaxRecordArray: Array<AjaxRecord> = []
export { ajaxRecordArray }

/**
 * ajaxType 函数集合
 */
let typeFunctionArray: Array<TypeFunction> = [
    // 0:同url同参数同类型 上一个完成时过 400ms 才能请求下一个
    (ajaxRecord) => {
        let { url, data } = ajaxRecord;
        let ajaxRecordGet = ajaxRecordArray.find(value => {
            return value !== ajaxRecord &&
                value.url === url &&
                objectEqual(value.data, data) &&
                ajaxRecord.time.getTime() - value.time.getTime() < 400
        });

        if (ajaxRecordGet) {
            ajaxRecordArray = ajaxRecordArray.filter(value => value !== ajaxRecord);
            // 不返回
            return new Promise<AjaxData>(() => { return ''; });
        }
    },
    // 1:缓存请求返回值
    (ajaxRecord) => {
        return new Promise<AjaxData>((reslove, reject) => {
            let { url, data, ajaxType } = ajaxRecord;
            let ajaxRecordGet = ajaxRecordArray.find(value => {
                return value !== ajaxRecord &&
                    value.url === url &&
                    objectEqual(value.data, data) &&
                    value.ajaxType === ajaxType
            });
            if (ajaxRecordGet) {
                ajaxRecordArray = ajaxRecordArray.filter(value => value !== ajaxRecord);
                if (ajaxRecordGet.responseDate) {
                    return reslove(ajaxRecordGet.responseDate);
                } else {
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
        return new Promise<AjaxData>((reslove, reject) => {
            let { url, data, ajaxType } = ajaxRecord;
            let ajaxRecordGet = ajaxRecordArray.find(value => {
                return value !== ajaxRecord &&
                    value.url === url &&
                    value.ajaxType === ajaxType &&
                    ajaxRecord.time.getTime() - value.time.getTime() < 400
            });
            if (ajaxRecordGet) {
                clearTimeout(ajaxRecordGet.setTimeout);
            }

            ajaxRecord.setTimeout = setTimeout(() => reslove(), config.timeDelay);
        });
    },
    // 3:监听连接 有别人请求触发返回
    (ajaxRecord) => {
        return new Promise<AjaxData>((reslove, reject) => {
            // ajaxRecordArray.unshift(ajaxRecord);
        });
    },
    // 4:监听服务器反推
    (ajaxRecord) => {
        return new Promise<AjaxData>((reslove, reject) => {
            let { url, data, type, ajaxType } = ajaxRecord;
            let ajaxRecordGet = ajaxRecordArray.find(value => {
                return value !== ajaxRecord &&
                    value.url === url &&
                    value.type === type &&
                    objectEqual(value.data, data) &&
                    value.ajaxType === ajaxType &&
                    value.cancel === false
            });
            if (!ajaxRecordGet) {
                reslove();
            }
        });
    }
]

/**
 * ajax函数
 * 
 * @export
 * @param {Object} obj
 * @returns
 */
export let ajax: AjaxFunction = async (obj: AjaxArguments) => {
    let ajaxRecord: AjaxRecord = getAjaxRecord(obj);
    let superAgentRequest = getAjaxRequest(ajaxRecord);
    let { type, callback, response } = ajaxRecord;

    ajaxRecordArray.unshift(ajaxRecord);
    // 添加请求记录 反向添加
    if (type !== -1) {
        // 根据ajaxType添加流程
        let typeFunctionValue = await typeFunctionArray[type](ajaxRecord);
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
    })
}


/**
 * 纯ajax发送
 * 
 * @param {AjaxRecord} ajaxRecord
 * @returns
 */
function ajaxSend(ajaxRecord: AjaxRecord) {
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
function getAjaxRecord(obj: AjaxArguments) {
    let { url, data, type, callback, ajaxType } = obj;
    type = type || 0;
    ajaxType = ajaxType || 'get';

    // 连接url 修改
    url = formatUrl(url);
    // 添加token
    if (data) {
        data.token = localStorage.getItem('token');
        data.userId = localStorage.getItem('userId');
    } else {
        data = {
            token: localStorage.getItem('token'),
            userId: localStorage.getItem('userId')
        };
    }

    let ajaxRecord: AjaxRecord = {
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
function getAjaxRequest(ajaxRecord: AjaxRecord): superagent.SuperAgentRequest {
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
    } else {
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
export function objectEqual(obj: Object, obj2: Object) {
    if (typeof (obj) !== 'object' || typeof (obj2) !== 'object') {
        if (obj !== obj2) {
            return false;
        } else {
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

let sseSource: any;
/**
 * Sse 
 * 
 * @param {AjaxRecord} ajaxRecord
 * @param {(ajaxData: AjaxData) => void} callback
 */
function addSseEvent(ajaxRecord: AjaxRecord, callback: (ajaxData: AjaxData) => void) {
    sseInit();

    if (!sseSource) {
        return false;
    }

    ajaxRecord.SseFunction = function (event) {
        let data = JSON.parse(event.data);
        if (data.url === ajaxRecord.url && objectEqual(data.requestData || {}, ajaxRecord.data)) {
            callback(data.data);
        }
    }
    sseSource.addEventListener('message', ajaxRecord.SseFunction, false);


    return true;
}
function sseInit() {
    if (EventSource && !sseSource) {
        sseSource = new EventSource(config.requestUrl + 'sse');
    }
}


/**
 * 格式化url
 * 
 * @param {string} url
 * @returns
 */
function formatUrl(url: string) {
    // 连接url 修改
    if (url.indexOf('static:') === 0) {
        url = url.replace('static:', '');
    } else if (url.indexOf('http') !== 0) {
        url = config.requestUrl + url;
    }
    return url;
}


/**
 * 注销记录
 * 
 * @export
 * @param {AjaxRecord} ajaxRecord
 */
export function cancelAjaxRecord(ajaxArguments: AjaxArguments) {
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


/**
 * 成功时的处理
 * 
 * @param {any} ajaxRecord
 */
async function onSuccess(ajaxRecord: AjaxRecord) {
    let ajaxRecordList = ajaxRecordArray.filter(value => {
        return value !== ajaxRecord &&
            value.type === 3 &&
            value.url === ajaxRecord.url &&
            objectEqual(value.data, ajaxRecord.data) &&
            value.ajaxType === ajaxRecord.ajaxType &&
            !value.cancel
    });

    ajaxRecordList.forEach(value => {
        value.callback(ajaxRecord.responseDate);
    });

    let res = ajaxRecord.response;
    try {
        ajaxRecord.responseDate = JSON.parse(res.text);
    } catch (error) {
        return ajaxRecord.responseDate;
    }

    if (ajaxRecord.responseDate.code === 0) {
        if (ajaxRecord.type === 4 && !EventSource) {
            ajaxRecord.setTimeout = setTimeout(() => {
                ajaxSend(ajaxRecord)
            }, config.pollingTime);
        }

        if (ajaxRecord.callback) {
            ajaxRecord.callback(ajaxRecord.responseDate);
        }
        return ajaxRecord.responseDate;
    } else {
        switch (ajaxRecord.responseDate.code) {
            case 'ax105':
                globalVale.jump('/login/index');
                break;
            case 'ax106':
                let { data } = await get('/my_token');
                localStorage.setItem('token', data['token']);

                ajaxRecord.type = -1;
                let ajaxData = await ajax(ajaxRecord);
                if (ajaxRecord.callback) {
                    ajaxRecord.callback(ajaxData);
                }
                return ajaxData.data;
        }

        if (ajaxRecord.responseDate.code) {
            errorMsg({
                message: `请求错误!`,
                description: <div>
                    <p>错误码:{ajaxRecord.responseDate.code}</p>
                    <p>错误信息:{ajaxRecord.responseDate.comment}</p>
                </div>
            });
        } else {
            errorMsg({
                message: `未知错误!`,
                description: ''
            });
        }
    }

}

/**
 * 出错时的处理
 * 
 * @param {AjaxRecord} ajaxRecord
 * @returns
 */
function onError(ajaxRecord: AjaxRecord) {

    if (ajaxRecord.response) {
        errorMsg({
            message: `请求错误!`,
            description: `错误码:${ajaxRecord.response.status}`
        });
    } else {
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
function getAjaxPromise(ajaxRequest: superagent.SuperAgentRequest, ajaxRecord: AjaxRecord) {
    return new Promise<AjaxRecord>((reslove, reject) => {
        // 发送请求
        ajaxRequest.end((error, res) => {
            ajaxRecord.response = res;
            if (error) {
                reject(ajaxRecord);
            } else {
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
function argumentsAssemble(): AjaxArguments {
    let obj;
    switch (arguments.length) {
        case 1:
            if (typeof (arguments[0]) === 'object') {
                obj = arguments[0];
            } else {
                obj = {
                    url: arguments[0]
                };
            };
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
 * 多参数
 * 
 * @interface ExportAjaxFunction
 */
interface ExportAjaxFunction {
    (url: string): Promise<AjaxData>
    (arg: AjaxArguments): Promise<AjaxData>
    (url: string, data: AjaxRequest): Promise<AjaxData>
    (url: string, data: AjaxRequest, callback: (ajaxData: AjaxData) => void): Promise<AjaxData>
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
let get: ExportAjaxFunction = function () {
    let obj: AjaxArguments = argumentsAssemble.apply(this, arguments);
    let { url, data, type, callback } = obj;
    data = data || {};
    data['__cache'] = util.uuid();
    obj.ajaxType = 'get';
    return ajax(obj);
}


/**
 * post 请求
 * 
 * @export
 * @param {string} url
 * @param {{ [key: string]: any }} [data]
 * @param {number} [type]
 * @returns
 */

let post: ExportAjaxFunction = function () {
    let obj: AjaxArguments = argumentsAssemble.apply(this, arguments);
    obj.data = obj.data || {};
    obj.ajaxType = 'post';
    return ajax(obj);
}

/**
 * put 请求
 * 
 * @export
 * @param {string} url
 * @param {{ [key: string]: any }} [data]
 * @param {number} [type]
 * @returns
 */
let put: ExportAjaxFunction = function () {
    let obj: AjaxArguments = argumentsAssemble.apply(this, arguments);
    obj.data = obj.data || {};
    obj.ajaxType = 'put';
    return ajax(obj);
}

/**
 * del 请求
 * 
 * @export
 * @param {string} url
 * @param {{ [key: string]: any }} [data]
 * @param {number} [type]
 * @returns
 */
let del: ExportAjaxFunction = function () {
    let obj: AjaxArguments = argumentsAssemble.apply(this, arguments);
    obj.data = obj.data || {};
    obj.ajaxType = 'del';
    return ajax(obj);
}


export { get, post, put, del }
