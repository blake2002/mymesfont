export type StateType = 'delete' | 'update' | 'add' | 'fail'
export interface NSDevices {
    ParameterName: string
    ParameterValue: any
    _stateType?: StateType
}


/**
 * 模型
 * 
 * @export
 * @interface DevicesTemplate
 */
export interface DevicesTemplate {
    DataType: 'int' | 'dateTime' | 'bool'
    Description: string
    Visible: 'false' | 'true'
    Form: {
        Type: 'DateTimePicker' | 'ComboBox' | 'Hidden' | 'Switch' | 'MapPicker'
        | 'RelatedRole' | 'OrgPicker' | 'AreaPicker' | 'SystemDataNodePicker' | 'CustomDataNodePicker'
        Options: {
            Value: string,
            Key: string
        }[]
        Properties: {
            FontSize: number
            Height: number
            Width: number
        }
    }
    IsPrimaryKey: boolean
    Name: string
    Nullable: boolean
    DefaultValue: string
}
