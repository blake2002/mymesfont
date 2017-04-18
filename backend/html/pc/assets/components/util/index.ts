// 通用方法
/**
 * 获取字符串长度 中文 = 2 英文 = 1
 * 
 * @export
 * @param {string} value
 * @returns {number}
 */
export function getLength(value: string): number {
    return value.replace(/[^\x00-\xff]/g, '01').length / 2;
};


/**
 * 返回随机值
 * 
 * @export
 * @param {number} [min=0]
 * @param {number} [max=2147483647]
 * @returns {number}
 */
export function rand(min: number = 0, max: number = 2147483647): number {
    let argc = arguments.length;
    return Math.floor(Math.random() * (max - min + 1)) + min;
};


/**
 *  前后去空格
 * 
 * @export
 * @param {String} str
 * @returns {string}
 */
export function trim(str: String): string {
    return str.replace(/(^\s*)|(\s*$)/g, '');
};


/**
 * 获取md5
 * 
 * @export
 * @param {String} str
 * @returns {string}
 */
export function uuid(): string {
    let s = [];
    let hexDigits = '0123456789abcdef';
    for (let i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = '4';  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = '-';

    let uuid = s.join('');
    return uuid;
};

