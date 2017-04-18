define("components/util/index.js",function(require, exports, module) {
"use strict";
// 通用方法
/**
 * 获取字符串长度 中文 = 2 英文 = 1
 *
 * @export
 * @param {string} value
 * @returns {number}
 */
function getLength(value) {
    return value.replace(/[^\x00-\xff]/g, '01').length / 2;
}
exports.getLength = getLength;
;
/**
 * 返回随机值
 *
 * @export
 * @param {number} [min=0]
 * @param {number} [max=2147483647]
 * @returns {number}
 */
function rand(min = 0, max = 2147483647) {
    let argc = arguments.length;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
exports.rand = rand;
;
/**
 *  前后去空格
 *
 * @export
 * @param {String} str
 * @returns {string}
 */
function trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, '');
}
exports.trim = trim;
;
/**
 * 获取md5
 *
 * @export
 * @param {String} str
 * @returns {string}
 */
function uuid() {
    let s = [];
    let hexDigits = '0123456789abcdef';
    for (let i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = '-';
    let uuid = s.join('');
    return uuid;
}
exports.uuid = uuid;
;
});
//# sourceMappingURL=index.js.map
