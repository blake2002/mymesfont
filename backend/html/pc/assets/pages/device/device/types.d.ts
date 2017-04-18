import { NSDevices, DevicesTemplate, StateType } from '../../../components/template-input/types';
export { NSDevices, DevicesTemplate, StateType }

/**
 * 设备数据结构
 * 
 * @export
 * @interface DeviceData
 */
export interface DeviceData {
    NSDevices: NSDevices[],
    NSDevicesTemplate: {
        Props: DevicesTemplate[]
    }
}

/**
 * 设备驱动
 * 
 * @export
 * @interface DriverData
 */
export interface DriverData {
    /**
     * 驱动类型ID
     * 
     * @type {string}
     * @memberOf DriverData
     */
    DriverID: string,
    /**
     * 驱动唯一标识ID
    //  * 
     * @type {string}
     * @memberOf DriverData
     */
    _ID?: string,

    _uuid?: string
    /**
     * 逻辑设备列表
     * 
     * @type {{}[]}
     * @memberOf DriverData
     */
    NSDriverLogicDevice: NSDriverLogicDevice[]

    /**
     * 数据状态
     * 
     * @type {StateType}
     * @memberOf DriverData
     */
    _stateType?: StateType
}

/**
 * 设备
 * 
 * @export
 * @interface NSDriverLogicDevice
 */
export interface NSDriverLogicDevice {
    /**
     * 逻辑设备
     * 
     * @type {string}
     */
    _ID?: string,
    /**
     * 逻辑设备id
     * 
     * @type {string}
     */
    DriverDeviceID?: string,
    /**
     * 唯一标识
     * 
     * @type {string}
     * @memberOf NSDevicesCommunicateParameter
     */
    _uuid?: string

    /**
     * 数据状态
     * 
     * @type {StateType}
     * @memberOf NSDriverLogicDevice
     */
    _stateType?: StateType

    /**
     * 数据块
     * 
     * @type {NSDevicesCommunicateDataBlock[]}
     * @memberOf NSDriverLogicDevice
     */
    NSDevicesCommunicateDataBlock: NSDevicesCommunicateDataBlock[]


    /**
     * 通讯设备参数列表
     * 
     * @type {NSDevicesCommunicateParameter[]}
     * @memberOf NSDriverLogicDevice
     */
    NSDevicesCommunicateParameter: NSDevicesCommunicateParameter[]
}



/**
 * 通讯设备字段
 * 
 * @export
 * @interface NSDevicesCommunicateParameter
 */
export interface NSDevicesCommunicateParameter {
    /**
     * 字段名称
     * 
     * @type {string}
     * @memberOf NSDevicesCommunicateParameter
     */
    ParameterName: string,

    /**
     * 字段值
     * 
     * @type {string}
     * @memberOf NSDevicesCommunicateParameter
     */
    ParameterValue: string

    /**
     * 字段值唯一标识ID
     * 
     * @type {string}
     * @memberOf NSDevicesCommunicateParameter
     */
    _ID?: string


    /**
     * 唯一标识
     * 
     * @type {string}
     * @memberOf NSDevicesCommunicateParameter
     */
    _uuid?: string

    /**
     * 状态类型
     * 
     * @type {StateType}
     * @memberOf NSDevicesCommunicateParameter
     */
    _stateType?: StateType
}

/**
 * 数据块
 * 
 * @export
 * @interface NSDevicesCommunicateDataBlock
 */
export interface NSDevicesCommunicateDataBlock {
    /**
     * 数据块唯一标识ID
     * 
     * @type {string}
     */
    _ID?: string,

    /**
    * 唯一标识
    * 
    * @type {string}
    * @memberOf NSDevicesCommunicateDataBlock
    */
    _uuid?: string
    /**
     * 数据块ID
     * 
     * @type {string}
     */
    DataBlockID: string

    /**
     * 状态类型
     * 
     * @type {StateType}
     * @memberOf NSDevicesCommunicateDataBlock
     */
    _stateType?: StateType

    NSDevicesCommunicateDataBlockParameter: NSDevicesCommunicateParameter[]
}

/**
 * 变量
 * 
 * @export
 * @interface VariableData
 */
export interface VariableData {

    /**
     * 变量名称
     * 
     * @type {string}
     * @memberOf VariableData
     */
    VarName: string
    /**
     * 描述
     * 
     * @type {string}
     * @memberOf VariableData
     */
    Description: string
    /**
     * 英文描述
     * 
     * @type {string}
     * @memberOf VariableData
     */
    en_US: string
    /**
     * 格式
     * 
     * @type {string}
     * @memberOf VariableData
     */
    Format: string
    /**
     * 单位
     * 
     * @type {string}
     * @memberOf VariableData
     */
    Unit: string
    /**
     * 变量类型
     * 
     * @type {string}
     * @memberOf VariableData
     */
    VarType: string
    /**
     * 数据类型
     * 
     * @type {string}
     * @memberOf VariableData
     */
    DataType: string
    /**
     * 精度
     * 
     * @type {string}
     * @memberOf VariableData
     */
    Decimal: string
    /**
     * 地址或表达式
     * 
     * @type {string}
     * @memberOf VariableData
     */
    AddressExp: string
    /**
     * 原始数据类型
     * 
     * @type {string}
     * @memberOf VariableData
     */
    OriginalDataType: string
    /**
     * 工程转换
     * 
     * @type {string}
     * @memberOf VariableData
     */
    Converter: string

    /**
     * 实时归档
     * 
     * @type {string}
     * @memberOf VariableData
     */
    Archive: string
    /**
     * 归档时间区间（分）
     * 
     * @type {string}
     * @memberOf VariableData
     */
    ArchiveTimeSpan: string
    /**
     * 写入保护
     * 
     * @type {string}
     * @memberOf VariableData
     */
    WriteProtect: string


    /**
     * 历史归档
     * 
     * @type {string}
     * @memberOf VariableData
     */
    HisArchive: string
    /**
     * 排序字段
     * 
     * @type {string}
     * @memberOf VariableData
     */
    OrderbyIndex: string

    _ID?: string
}

/**
 * 变量
 * 
 * @export
 * @interface AlarmData
 */
export interface AlarmData {
    _ID?: string,
    /**
     * 编号
     * 
     * @type {string}
     * @memberOf AlarmData
     */
    AlarmID: string
    /**
     * 描述
     * 
     * @type {string}
     * @memberOf AlarmData
     */
    AlarmDescription: string
    /**
     * 条件
     * 
     * @type {string}
     * @memberOf AlarmData
     */
    AlarmCondition: string
    /**
     * 缓存条数
     * 
     * @type {string}
     * @memberOf AlarmData
     */
    ArchiveCount: string
    /**
     * 历史归档
     * 
     * @type {string}
     * @memberOf AlarmData
     */
    HisArchive: string
    /**
     * 实时归档
     * 
     * @type {string}
     * @memberOf AlarmData
     */
    Archive: string
    /**
     * 排序
     * 
     * @type {string}
     * @memberOf AlarmData
     */
    OrderbyIndex: string
}


/**
 * ajax模版
 * 
 * @export
 * @interface DriverConfig
 */
export interface DriverTemplate {
    /**
     * 通讯参数
     * 
     * @type {ParameterConfig[]}
     * @memberOf DriverTemplate
     */
    NSDevicesCommunicateParameter: ParameterConfig[]
    NSDevicesCommunicateDataBlockParameter: ParameterConfig[]
}

/**
 * 模版参数
 * 
 * @export
 * @interface ParameterConfig
 */
export interface ParameterConfig {
    Column: string
    ColumnHeader: string
    ControlType: ControlType
    DefaultValue?: string
    Val2Disp?: { [key: string]: string }
}


export type ControlType = 'TextBox' | 'CheckBox' | "ComboBox"