define("pages/device/device/_drive.js",function(require, exports, module) {
"use strict";
const React = require("react");
exports.React = React;
const components_1 = require("../../../components/global/components");
const index_1 = require("../../../components/antd/index");
;
;
/**
 * 设备驱动
 *
 * @class DeviceDrive
 * @extends {PureComponentGenerics<IDeviceDriveProps, IDeviceDriveState>}
 */
class DeviceDrive extends components_1.PureComponentGenerics {
    constructor() {
        super(...arguments);
        this.states = {
            deviceAddVisible: false,
            driveAddVisible: false
        };
    }
    /**
     * 新增设备弹窗显示
     *
     *
     * @memberOf DeviceDrive
     */
    deviceAddShow() {
        this.states.deviceAddVisible = true;
        this.setState(this.states);
    }
    /**
     * 新增设备弹窗隐藏
     *
     * @param {any} e
     *
     * @memberOf DeviceDrive
     */
    deviceAddHide(e) {
        this.states.deviceAddVisible = false;
        this.setState(this.states);
    }
    /**
     * 新增驱动显示
     *
     * @param {any} e
     *
     * @memberOf DeviceAdd
     */
    driveAddShow(e) {
        this.states.driveAddVisible = true;
        this.setState(this.states);
    }
    /**
     * 新增驱动隐藏
     *
     * @param {any} e
     *
     * @memberOf DeviceAdd
     */
    driveAddHide(e) {
        this.states.driveAddVisible = false;
        this.setState(this.states);
    }
    DriveAddRender() {
        return React.createElement("section", { className: 'device-add-menu' },
            React.createElement(index_1.Button, { className: 'ml20' }, "\u65B0\u589E\u9A71\u52A8"),
            React.createElement(index_1.Button, { className: 'ml20' }, "\u4FDD\u5B58"));
    }
    render() {
        let { states } = this;
        return (React.createElement("section", { className: 'device-add' },
            React.createElement("section", { className: 'device-add-title' },
                "OmronHostLink",
                React.createElement(index_1.Button, { className: 'ml20' }, "\u5220\u9664"),
                React.createElement(index_1.Button, { className: 'ml20', onClick: this.deviceAddShow.bind(this) }, "\u65B0\u589E\u8BBE\u5907")),
            React.createElement(index_1.Modal, { title: '新增设备', width: '630px', onCancel: this.deviceAddHide.bind(this), visible: states.deviceAddVisible },
                React.createElement(DeviceAdd, null)),
            React.createElement(index_1.Modal, { title: '新增驱动', width: '630px', visible: states.driveAddVisible },
                React.createElement(DriveAdd, null)),
            React.createElement(Device, null)));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DeviceDrive;
;
;
/**
 * 设备
 *
 * @class Device
 * @extends {PureComponentGenerics<IDeviceProps, IDeviceState>}
 */
class Device extends components_1.PureComponentGenerics {
    constructor() {
        super(...arguments);
        this.states = {
            dataBlockAddVisible: false
        };
    }
    /**
     * 新增数据块显示
     *
     *
     * @memberOf DeviceDrive
     */
    dataBlockAddShow() {
        this.states.dataBlockAddVisible = true;
        this.setState(this.states);
    }
    /**
     * 新增数据块隐藏
     *
     * @param {any} e
     *
     * @memberOf DeviceDrive
     */
    dataBlockAddHide(e) {
        this.states.dataBlockAddVisible = false;
        this.setState(this.states);
    }
    render() {
        let { states } = this;
        return (React.createElement("section", { className: 'device-add-content' },
            React.createElement("section", { className: 'device-add-box' },
                React.createElement("table", { className: 'table-from' },
                    React.createElement("tbody", null,
                        React.createElement("tr", null,
                            React.createElement("td", null, "\u8BBE\u5907")),
                        React.createElement("tr", null,
                            React.createElement("td", null,
                                React.createElement(index_1.Input, { placeholder: '请输入' }))))),
                React.createElement("p", { className: 'tr' },
                    React.createElement(index_1.Button, null, "\u5220\u9664"),
                    React.createElement(index_1.Button, { onClick: this.dataBlockAddShow.bind(this), className: 'ml20' }, "\u65B0\u589E\u6570\u636E\u5757"))),
            React.createElement(CommParam, null),
            React.createElement(DataBlock, null),
            React.createElement(index_1.Modal, { title: '新增数据块', onCancel: this.dataBlockAddHide.bind(this), visible: states.dataBlockAddVisible },
                React.createElement(DataBlockAdd, null))));
    }
}
;
;
/**
 * 通讯参数
 *
 * @class CommunicationParameters
 * @extends {PureComponentGenerics<ICommParamProps, ICommParamState>}
 */
class CommParam extends components_1.PureComponentGenerics {
    render() {
        return (React.createElement("section", { className: 'comm-param' },
            React.createElement("div", { className: 'comm-param-title' }, "\u901A\u8BAF\u53C2\u6570"),
            React.createElement(index_1.Switch, null),
            React.createElement("table", { className: 'table-from table-from-sm mr20' },
                React.createElement("tbody", null,
                    React.createElement("tr", null,
                        React.createElement("td", null, "\u63CF\u8FF0")),
                    React.createElement("tr", null,
                        React.createElement("td", null,
                            React.createElement(index_1.Input, { placeholder: '请输入' }))),
                    React.createElement("tr", null,
                        React.createElement("td", null, "\u901A\u8BAF\u53C2\u6570")),
                    React.createElement("tr", null,
                        React.createElement("td", null,
                            React.createElement(index_1.Input, { placeholder: '请输入' }))),
                    React.createElement("tr", null,
                        React.createElement("td", null, "\u901A\u8BAF\u7C7B\u578B")),
                    React.createElement("tr", null,
                        React.createElement("td", null,
                            React.createElement(index_1.Input, { placeholder: '请输入' }))))),
            React.createElement("table", { className: 'table-from table-from-sm' },
                React.createElement("tbody", null,
                    React.createElement("tr", null,
                        React.createElement("td", null, "\u7AD9\u53F7")),
                    React.createElement("tr", null,
                        React.createElement("td", null,
                            React.createElement(index_1.Input, { placeholder: '请输入' }))),
                    React.createElement("tr", null,
                        React.createElement("td", null, "\u8D85\u65F6\u91CD\u8BD5\uFF08ms\uFF09")),
                    React.createElement("tr", null,
                        React.createElement("td", null,
                            React.createElement(index_1.Input, { placeholder: '请输入' }))),
                    React.createElement("tr", null,
                        React.createElement("td", null, "\u91CD\u8BD5\u6B21\u6570")),
                    React.createElement("tr", null,
                        React.createElement("td", null,
                            React.createElement(index_1.Input, { placeholder: '请输入' })))))));
    }
}
;
;
/**
 * 数据块
 *
 * @class DataBlock
 * @extends {PureComponentGenerics<IDataBlockProps, IDataBlockState>}
 */
class DataBlock extends components_1.PureComponentGenerics {
    render() {
        return (React.createElement("section", { className: 'comm-param data-block' },
            React.createElement("div", { className: 'comm-param-title' },
                "\u6570\u636E\u5757",
                React.createElement(index_1.Button, { className: 'btn-del' }, "\u5220\u9664")),
            React.createElement(index_1.Switch, null),
            React.createElement("table", { className: 'table-from table-from-sm mr20' },
                React.createElement("tbody", null,
                    React.createElement("tr", null,
                        React.createElement("td", null, "\u540D\u79F0")),
                    React.createElement("tr", null,
                        React.createElement("td", null,
                            React.createElement(index_1.Input, { placeholder: '请输入' }))),
                    React.createElement("tr", null,
                        React.createElement("td", null, "\u63CF\u8FF0")),
                    React.createElement("tr", null,
                        React.createElement("td", null,
                            React.createElement(index_1.Input, { placeholder: '请输入' }))),
                    React.createElement("tr", null,
                        React.createElement("td", null, "\u5F00\u59CB\u5730\u5740")),
                    React.createElement("tr", null,
                        React.createElement("td", null,
                            React.createElement(index_1.Input, { placeholder: '请输入' }))),
                    React.createElement("tr", null,
                        React.createElement("td", null, "\u7ED3\u675F\u5730\u5740")),
                    React.createElement("tr", null,
                        React.createElement("td", null,
                            React.createElement(index_1.Input, { placeholder: '请输入' }))),
                    React.createElement("tr", null,
                        React.createElement("td", null, "\u5BC4\u5B58\u5668\u7C7B\u578B")),
                    React.createElement("tr", null,
                        React.createElement("td", null,
                            React.createElement(index_1.Input, { placeholder: '请输入' }))),
                    React.createElement("tr", null,
                        React.createElement("td", null, "\u626B\u63CF\u5468\u671F\uFF08ms\uFF09")),
                    React.createElement("tr", null,
                        React.createElement("td", null,
                            React.createElement(index_1.Input, { placeholder: '请输入' })))))));
    }
}
;
;
/**
 * 新增数据块
 *
 * @class DataBlockAdd
 * @extends {PureComponentGenerics<IDataBlockAddProps, IDataBlockAddState>}
 */
class DataBlockAdd extends components_1.PureComponentGenerics {
    render() {
        return (React.createElement("section", { className: 'data-block-add' },
            React.createElement("div", { className: 'data-block-add-title' }, "\u6570\u636E\u5757"),
            React.createElement("table", { className: 'table-from table-from-sm' },
                React.createElement("tr", null,
                    React.createElement("td", null, "\u540D\u79F0")),
                React.createElement("tr", null,
                    React.createElement("td", null,
                        React.createElement(index_1.Input, { placeholder: '请输入' }))),
                React.createElement("tr", null,
                    React.createElement("td", null, "\u63CF\u8FF0")),
                React.createElement("tr", null,
                    React.createElement("td", null,
                        React.createElement(index_1.Input, { placeholder: '请输入' }))),
                React.createElement("tr", null,
                    React.createElement("td", null, "\u5F00\u59CB\u5730\u5740")),
                React.createElement("tr", null,
                    React.createElement("td", null,
                        React.createElement(index_1.Input, { placeholder: '请输入' }))),
                React.createElement("tr", null,
                    React.createElement("td", null, "\u7ED3\u675F\u5730\u5740")),
                React.createElement("tr", null,
                    React.createElement("td", null,
                        React.createElement(index_1.Input, { placeholder: '请输入' }))),
                React.createElement("tr", null,
                    React.createElement("td", null, "\u5BC4\u5B58\u5668\u7C7B\u578B")),
                React.createElement("tr", null,
                    React.createElement("td", null,
                        React.createElement(index_1.Input, { placeholder: '请输入' }))),
                React.createElement("tr", null,
                    React.createElement("td", null, "\u626B\u63CF\u5468\u671F\uFF08ms\uFF09")),
                React.createElement("tr", null,
                    React.createElement("td", null,
                        React.createElement(index_1.Input, { placeholder: '请输入' }))))));
    }
}
;
;
/**
 * 新增设备
 *
 * @class DeviceAdd
 * @extends {PureComponentGenerics<IDeviceAddProps, IDeviceAddState>}
 */
class DeviceAdd extends components_1.PureComponentGenerics {
    render() {
        return (React.createElement("section", { className: 'device-modal' },
            React.createElement("table", { className: 'table-from table-from-sm' },
                React.createElement("tr", null,
                    React.createElement("td", null, "\u8BBE\u5907")),
                React.createElement("tr", null,
                    React.createElement("td", null,
                        React.createElement(index_1.Input, { placeholder: '请输入' })))),
            React.createElement("section", { className: 'device-modal-content' },
                React.createElement("div", { className: 'device-modal-title' }, "\u901A\u8BAF\u53C2\u6570"),
                React.createElement("table", { className: 'table-from table-from-sm' },
                    React.createElement("tbody", null,
                        React.createElement("tr", null,
                            React.createElement("td", null, "\u63CF\u8FF0")),
                        React.createElement("tr", null,
                            React.createElement("td", null,
                                React.createElement(index_1.Input, { placeholder: '请输入' }))),
                        React.createElement("tr", null,
                            React.createElement("td", null, "\u901A\u8BAF\u53C2\u6570")),
                        React.createElement("tr", null,
                            React.createElement("td", null,
                                React.createElement(index_1.Input, { placeholder: '请输入' }))),
                        React.createElement("tr", null,
                            React.createElement("td", null, "\u901A\u8BAF\u7C7B\u578B")),
                        React.createElement("tr", null,
                            React.createElement("td", null,
                                React.createElement(index_1.Input, { placeholder: '请输入' }))),
                        React.createElement("tr", null,
                            React.createElement("td", null, "\u7AD9\u53F7")),
                        React.createElement("tr", null,
                            React.createElement("td", null,
                                React.createElement(index_1.Input, { placeholder: '请输入' }))),
                        React.createElement("tr", null,
                            React.createElement("td", null, "\u8D85\u65F6\u91CD\u8BD5\uFF08ms\uFF09")),
                        React.createElement("tr", null,
                            React.createElement("td", null,
                                React.createElement(index_1.Input, { placeholder: '请输入' }))),
                        React.createElement("tr", null,
                            React.createElement("td", null, "\u91CD\u8BD5\u6B21\u6570")),
                        React.createElement("tr", null,
                            React.createElement("td", null,
                                React.createElement(index_1.Input, { placeholder: '请输入' }))))))));
    }
}
;
;
/**
 * 新增驱动
 *
 * @class DriveAdd
 * @extends {PureComponentGenerics<IDriveAddProps, IDriveAddState>}
 */
class DriveAdd extends components_1.PureComponentGenerics {
    render() {
        return (React.createElement("section", { className: 'drive-add' },
            React.createElement("table", { className: 'table-from table-from-sm' },
                React.createElement("tbody", null,
                    React.createElement("tr", null,
                        React.createElement("td", null, "\u9A71\u52A8")),
                    React.createElement("tr", null,
                        React.createElement("td", null,
                            React.createElement(index_1.Select, { style: { width: '100%' }, defaultValue: '1' },
                                React.createElement(index_1.Option, { value: '1' }, "\u5206\u7EC41"),
                                React.createElement(index_1.Option, { value: '2' }, "\u5206\u7EC42"),
                                React.createElement(index_1.Option, { value: '3' }, "\u5206\u7EC4"))))))));
    }
}
});
//# sourceMappingURL=_drive.js.map
