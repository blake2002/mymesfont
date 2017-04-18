import './style/index.css';

import Button from '../button/index';
import DatePickerType from 'antd/lib/date-picker/index';
let DatePicker: typeof DatePickerType = require('antd/lib/date-picker/index');

import DropdownType from 'antd/lib/dropdown/index';
let Dropdown: typeof DropdownType = require('antd/lib/dropdown/index');

import IconType from 'antd/lib/icon/index';
let Icon: typeof IconType = require('antd/lib/icon/index');


import InputType from 'antd/lib/input/Input';
let Input: typeof InputType = require('antd/lib/input/index');
let InputSearch = Input.Search;

import InputNumberType from 'antd/lib/input-number/index';
let InputNumber: typeof InputNumberType = require('antd/lib/input-number/index');
export default InputNumber;

import MenuType from 'antd/lib/menu/index';
let Menu: typeof MenuType = require('antd/lib/menu/index');

import Modal, { ModalSlip } from '../modal/index';

import NotificationType from 'antd/lib/notification/index';
let notification: typeof NotificationType = require('antd/lib/notification/index');

import PaginationType from 'antd/lib/pagination/index';
let Pagination: typeof PaginationType = require('antd/lib/pagination/index');

import PopoverType from 'antd/lib/popover/index';
let Popover: typeof PopoverType = require('antd/lib/popover/index');


import ProgressType from 'antd/lib/progress/index';
let Progress: typeof ProgressType = require('antd/lib/progress/index');

import SelectType from 'antd/lib/select/index';
let Select: typeof SelectType = require('antd/lib/select/index');
let Option = Select.Option;

import SpinType from 'antd/lib/spin/index';
let Spin: typeof SpinType = require('antd/lib/spin/index');

import PopconfirmType from 'antd/lib/popconfirm/index';
let Popconfirm: typeof PopconfirmType = require('antd/lib/popconfirm/index');


import SwitchType from 'antd/lib/switch/index';
let Switch: typeof SwitchType = require('antd/lib/switch/index');

import TableType from 'antd/lib/table/index';
let TableReq = require('antd/lib/table/index');
interface TableConstructor {
    new (): TableType<any>;
    new <T>(): TableType<T>;
}
let Table: TableConstructor;
Table = TableReq;


import TabsType from 'antd/lib/tabs/index';
let Tabs: typeof TabsType = require('antd/lib/tabs/index');
let TabPane = Tabs.TabPane;

import TreeType from 'antd/lib/tree/index';
let Tree: typeof TreeType = require('antd/lib/tree/index').default;
let TreeNode = Tree.TreeNode;

import MessageType from 'antd/lib/message/index';
let message: typeof MessageType = require('antd/lib/message/index');

import TreeSelectType from 'antd/lib/tree-select/index';
let TreeSelect: typeof TreeSelectType = require('antd/lib/tree-select/index');

import CheckboxType from 'antd/lib/checkbox/index';
let Checkbox: typeof CheckboxType = require('antd/lib/checkbox/index');
const CheckboxGroup = Checkbox.Group;

import RadioType from 'antd/lib/radio/index';
let Radio: typeof RadioType = require('antd/lib/radio/index');
const RadioGroup = Radio.Group;

import UploadType from 'antd/lib/upload/index';
let Upload: typeof UploadType = require('antd/lib/upload/index').default;

export {
    Button, DatePicker, Dropdown, Icon, Input, InputSearch,
    InputNumber, Menu, Modal, ModalSlip, notification, Pagination, Popover,
    Progress, Select, Option, Spin, Switch, Table, Tabs, TabPane, Tree, TreeNode, TreeSelect,
    message, Checkbox, CheckboxGroup, Radio, RadioGroup, Upload
};


