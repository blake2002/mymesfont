define("pages/device/members/member-vars.js",function(require, exports, module) {
"use strict";
// 用户管理（s_UsrMan）
let g_membersResponse = {
    "Name": "s_UsrMan",
    "DataSourceType": "NOSQL",
    "Description": "用户信息",
    "DataNode": {
        "Name": "NSUsers",
        "Description": "用户",
        "IsEmbeded": "true",
        "IsUserDefine": "false",
        "Index": [
            {
                "Name": "UserID",
                "Unique": "true",
                "Properties": [
                    "UserID"
                ]
            }
        ],
        "Properties": [
            {
                "Name": "UserID",
                "Description": "用户ID",
                "DataType": "string",
                "IsPrimaryKey": "true",
                "Nullable": "true"
            },
            {
                "Name": "Name",
                "Description": "用户名",
                "DataType": "string",
                "IsPrimaryKey": "false",
                "Nullable": "true"
            },
            {
                "Name": "PassWord",
                "Description": "密码",
                "DataType": "string",
                "IsPrimaryKey": "false",
                "Nullable": "true",
                "DefaultValue": "123"
            },
            {
                "Name": "Enable",
                "Description": "使能",
                "DataType": "bool",
                "IsPrimaryKey": "false",
                "Nullable": "true"
            },
            {
                "Name": "Tel",
                "Description": "电话",
                "DataType": "string",
                "IsPrimaryKey": "false",
                "Nullable": "true"
            },
            {
                "Name": "Email",
                "Description": "邮箱",
                "DataType": "string",
                "IsPrimaryKey": "false",
                "Nullable": "true"
            },
            {
                "Name": "Longitude",
                "Description": "位置经度",
                "DataType": "float",
                "IsPrimaryKey": "false",
                "Nullable": "true"
            },
            {
                "Name": "Latitude",
                "Description": "位置纬度",
                "DataType": "float",
                "IsPrimaryKey": "false",
                "Nullable": "true"
            },
            {
                "Name": "Radius",
                "Description": "位置精度半径",
                "DataType": "float",
                "IsPrimaryKey": "false",
                "Nullable": "true"
            },
            {
                "Name": "LocationDescription",
                "Description": "位置描述",
                "DataType": "string",
                "IsPrimaryKey": "false",
                "Nullable": "true"
            },
            {
                "Name": "GpsTimeStamp",
                "Description": "最近登录时间",
                "DataType": "string",
                "IsPrimaryKey": "false",
                "Nullable": "true"
            },
            {
                "Name": "WeixinID",
                "Description": "微信号",
                "DataType": "string",
                "IsPrimaryKey": "false",
                "Nullable": "true"
            },
            {
                "Name": "NO",
                "Description": "工号",
                "DataType": "string",
                "IsPrimaryKey": "false",
                "Nullable": "true"
            },
            {
                "Name": "Remark",
                "Description": "备注",
                "DataType": "string",
                "IsPrimaryKey": "false",
                "Nullable": "true"
            },
            {
                "Name": "EnableMessage",
                "Description": "开启短信通知",
                "DataType": "bool",
                "IsPrimaryKey": "false",
                "Nullable": "true"
            },
            {
                "Name": "EnableEmail",
                "Description": "开启邮件通知",
                "DataType": "bool",
                "IsPrimaryKey": "false",
                "Nullable": "true"
            },
            {
                "Name": "EnableWeixin",
                "Description": "开启微信通知",
                "DataType": "bool",
                "IsPrimaryKey": "false",
                "Nullable": "true"
            }
        ]
    }
};
exports.g_membersResponse = g_membersResponse;
let members_model = g_membersResponse['DataNode']['Properties'];
exports.members_model = members_model;
let members_data = [{
        "GpsTimeStamp": "",
        "Remark": "空调",
        "Enable": "true",
        "Tel": "",
        "Name": "张建国",
        "NO": "90047",
        "LocationDescription": "",
        "UserID": "1234",
        "Longitude": "",
        "Radius": "",
        "Latitude": "",
        "PassWord": "123456",
        "PictureID": "",
        "Email": "",
        "OndutyTime": "",
        "WeixinID": ""
    }, {
        "GpsTimeStamp": "",
        "Remark": "",
        "Enable": "true",
        "Tel": "13639968301",
        "Name": "丁伟刚",
        "NO": "",
        "LocationDescription": "",
        "UserID": "dingweigang",
        "Longitude": "",
        "Radius": "",
        "Latitude": "",
        "PassWord": "dingweigang",
        "PictureID": "",
        "Email": "13639968301@163.com",
        "OndutyTime": "",
        "WeixinID": ""
    }
];
exports.members_data = members_data;
//设备信息
let g_deviceInfo = {
    "@OrderbyIndex": "",
    "@Longitude": "145.12918",
    "@DeviceID": "Australia_latrobe_RXRC1015",
    "@DeviceType": "SRXZ(180/160)-60(12/6)(29-5/35)H2M2 MMI2A",
    "@CompanyName": "latrobe university",
    "@RTDBID": "RTDB004",
    "@StationName": "维多利亚",
    "@Radius": "",
    "@CountryName": "澳大利亚",
    "@_ID": "c78c9c2b-b75f-4f6e-8cb8-d9f9008574a0",
    "@Group": "AirCondition",
    "@SetupPlace": "latrobe university",
    "@CityName": "墨尔本",
    "@RelatedFlowChartID": "1",
    "@Latitude": "-37.907211",
    "@Version": "V1.6",
    "@DeviceName": "Chiller No.1",
    "@Enable": "true",
    "@SetupTime": "2016/7/13 10:30:22",
};
exports.g_deviceInfo = g_deviceInfo;
});
//# sourceMappingURL=member-vars.js.map
