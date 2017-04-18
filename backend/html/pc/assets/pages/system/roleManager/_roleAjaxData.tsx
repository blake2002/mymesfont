import * as React from 'react'
export { React }

import { get, post } from '../../../components/ajax/index'

/** 
 *  接口说明 http://www.netscada.com:10002/documents/59
 */
class RoleAjax {
    role_template = [] //模板
    role_list_template = []
    role_columns = [] //模板转换出来的列数据
    role_key = 'key'//唯一标识
    role_list = [] //列表
    role_detail = {}  //详细
    role_auth_for_menu = [] //授权
    pageCount = 1
    /**角色列表 */
    get_role_list(pageIndex, pageSize) {
        let p = get('/sys/role_list', {
            pageIndex: pageIndex, pageSize: pageSize
        })
        p.then((reponse) => {
            if (reponse.code == 0) {
                this.role_list = reponse.data.roleList
                this.pageCount = reponse.data.pageCount
            } else {
                console.error(reponse)
            }
        })
        return p
    }

    /**角色详细 */
    get_role_detail(roleId) {
        // if (Object.keys(this.role_detail).indexOf(roleId) != -1) {
        //     var promise = new Promise(function (resolve, reject) {
        //         resolve('val')
        //     });
        //     return promise;
        // }   return promise;
        let p = get('/sys/role_detail', {
            roleId
        })
        p.then((reponse) => {
            if (reponse.code == 0) {
                this.role_detail[roleId] = reponse.data.Role
                // this.role_detail[roleId]['oldArea'] = Object(reponse.data.Role.Area)
                // this.role_detail[roleId]['oldOrganization'] = Object(reponse.data.Role.Organization)
            } else {
                console.error(reponse)
            }
        })
        return p
    }

    /** 角色列表模板  */
    get_role_list_template() {
        // if (this.role_list_template.length == 0) {
            let p = get('/sys/role_list_template', {})
            p.then((reponse) => {
                if (reponse.code == 0) {
                    this.role_list_template = reponse.data.RoleTemplate.Props
                    this.role_template_data_exchange(this.role_list_template)
                } else {
                    console.error(reponse)
                }
            })
            return p
        // }
        // var promise = new Promise(function (resolve, reject) {
        //     resolve('val')
        // });
        // return promise;
    }

    /** 角色模板  */
    get_role_template() {
        if (this.role_template.length == 0) {
            let p = get('/sys/role_template', {})
            p.then((reponse) => {
                if (reponse.code == 0) {
                    this.role_template = reponse.data.RoleTemplate.Props
                    this.role_template_data_exchange(this.role_template)
                } else {
                    console.error(reponse)
                }
            })
            return p
        }
        var promise = new Promise(function (resolve, reject) {
            resolve('val')
        });
        return promise;
    }

    /**模板转换列 */
    role_template_data_exchange(templates) {
        let columns = []

        let width = 100 / templates.length * 2
        console.log(width)
        for (let template of templates) {
            let col = {
                title: template.Description,
                dataIndex: template.Name,
                key: template.Name,
                width: width,//template.Form.Properties.Width,
                // render: (text, record, index) => text
            }
            if (template.IsPrimaryKey === 'true') this.role_key = template.Name
            columns.push(col)
        }
        this.role_columns = columns
    }

    /**
     * 新增角色
     * roles []
     */
    post_add_role(roles) {
        let p = post('/sys/add_role', {
            props: {
                'Roles': roles
            }
        })
        p.then((reponse) => {
        })
        return p
    }

    /**修改角色 rles[]*/
    post_modified_role(roleId, roles) {
        let p = post('/sys/modified_role', {
            roleId: roleId,
            props: {
                'Roles': roles
            }
        })
        p.then((reponse) => {
        })
        return p
    }

    /**删除角色 roleIds[] */
    post_delete_role(roleIds) {
        let p = post('/sys/delete_role', {
            roleIds
        })
        p.then((reponse) => {
        })
        return p
    }

    /**查询角色已有菜单授权  */
    get_role_auth_for_menu(roleId) {
        let p = get('/sys/role_auth_for_menu', { roleId })
        p.then((reponse) => {
            if (reponse.code == 0) {
                this.role_auth_for_menu = reponse.data.MenuList
            }
        })
        return p
    }

    /**修改角色菜单授权 
     * roleId：'xxx' //角色id
    addMenuIds: ['xxx', 'xxx'] // 添加菜单ids，没有给空[]
    removeMenuIds: ['xxx', 'xxx'] // 移除菜单ids，没有给空[]
     */
    post_role_auth_for_menu(roleId, addMenuIds, removeMenuIds) {
        let p = post('/sys/role_auth_for_menu', { roleId, addMenuIds, removeMenuIds })
        p.then((reponse) => {
            if (reponse.code == 0) {
            }
        })
        return p
    }
}

export default new RoleAjax()