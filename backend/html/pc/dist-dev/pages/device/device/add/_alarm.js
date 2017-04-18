define("pages/device/device/add/_alarm.js",function(require, exports, module) {
"use strict";
const _variable_1 = require("./_variable");
/**
 * 设备报警
 *
 * @class DeviceDrive
 * @extends {PureComponentGenerics<IDeviceDriveProps, IDeviceDriveState>}
 */
class DeviceDrive extends _variable_1.TableText {
    constructor() {
        super(...arguments);
        this.columns = [{
                title: '编号',
                dataIndex: 'AlarmID'
            }, {
                title: '描述',
                dataIndex: 'AlarmDescription'
            }, {
                title: '条件',
                dataIndex: 'AlarmCondition'
            }];
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DeviceDrive;
});
//# sourceMappingURL=_alarm.js.map
