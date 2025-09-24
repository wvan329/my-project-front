<template>
  <div>
    <!-- 上 -->
    <el-card class="h-[60px]">
      <el-form @submit.prevent class="flex w-full items-center justify-between">
        <el-form-item label="角色名">
          <el-input style="width: 180px" v-model="rolename" clearable clear-icon="close" @keyup.enter="doSearch" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="doSearch">搜索</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 下 -->
    <el-card class="mt-[10px]">
      <div class="flex">
        <el-button
          type="primary"
          @click="
            () => {
              drawer = !drawer
              formRef.resetFields()
              roleInfo = {}
              drawerTitle = '添加角色'
            }
          "
          >添加角色
        </el-button>

        <el-popconfirm title="确认删除?" @confirm="deleteRoles" placement="bottom">
          <template #reference>
            <el-button type="danger">批量删除</el-button>
          </template>
        </el-popconfirm>
      </div>
      <el-table ref="tableRef" class="mt-[10px]" :data="roleList">
        <el-table-column type="selection"></el-table-column>
        <el-table-column label="序号" align="center" width="80px" type="index"></el-table-column>
        <el-table-column label="角色名" align="center" prop="role" show-overflow-tooltip></el-table-column>
        <el-table-column label="权限" align="center" prop="permissions" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" align="center" width="190px">
          <template #default="{ row }">
            <div class="flex justify-center">
              <el-button type="primary" @click="setPermission(row)">分配权限</el-button>
              <el-button
                type="primary"
                @click="
                  () => {
                    drawer = !drawer
                    Object.assign(roleInfo, row)
                    drawerTitle = '修改角色'
                  }
                "
                >编辑
              </el-button>
              <el-popconfirm title="确认删除?" @confirm="deleteRole(row)" placement="bottom">
                <template #reference>
                  <el-button type="danger">删除</el-button>
                </template>
              </el-popconfirm>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="mt-[10px]"
        v-model:current-page="pageNo"
        v-model:page-size="pageSize"
        :page-sizes="[7, 8, 9]"
        :background="true"
        layout="prev, pager, next, jumper,-> , sizes,total"
        :total="total"
        @size-change="getRoleList"
        @current-change="getRoleList"
      />
    </el-card>
    <!-- 抽屉1 -->
    <el-drawer class="dark:bg-black" v-model="drawer" direction="rtl" :title="drawerTitle" size="30%">
      <el-form @submit.prevent ref="formRef" label-position="left" label-width="auto" :model="roleInfo" :rules="rules">
        <el-form-item label="角色名" prop="role">
          <el-input placeholder="请输入角色名" v-model.trim="roleInfo.role"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="drawer = !drawer">取消</el-button>
          <el-button type="primary" @click="addOrUpdateRole">确定</el-button>
        </div>
      </template>
    </el-drawer>
    <!-- 抽屉2 -->
    <el-drawer class="dark:bg-black" v-model="drawer1" direction="rtl" title="分配权限" size="30%">
      <el-form ref="formRef" label-position="left" label-width="auto">
        <el-form-item label="角色名">
          <el-input v-model.trim="roleInfo.role" disabled></el-input>
        </el-form-item>
        <el-form-item label="权限列表">
          <el-tree ref="treeRef" :props="defaultProps" default-expand-all empty-text="" style="max-width: 600px" :data="data" show-checkbox node-key="name" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="drawer1 = !drawer1">取消</el-button>
          <el-button type="primary" @click="updatePermission">确定</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, nextTick } from "vue"
import { ElNotification } from "element-plus"
import useUserStore from "@/stores/user"
import request from "@/utils/request"
import router from "@/router"
const userStore = useUserStore()

// 上
let rolename = ref("")
let search = ""
const doSearch = async () => {
  search = rolename.value
  await getRoleList()
}
// 下
let drawer = ref(false)
const formRef = ref()
let roleInfo = ref({})
let drawerTitle = ref("添加角色")
const deleteRoles = async () => {
  let ids = tableRef.value.getSelectionRows().map((item) => item.id)
  if (ids.length === 0) {
    ElNotification({ title: "请选择要删除的行", type: "warning", duration: 700 })
    return
  }
  await request.delete("/roles/deleteRole", {
    params: {
      ids
    }
  })
  await getRoleList()
  ElNotification({ title: "删除成功", type: "success", duration: 700 })
}
let tableRef = ref()
let roleList = ref([])
let treeRef = ref()

const setPermission = (row) => {
  drawer1.value = !drawer1.value
  Object.assign(roleInfo.value, row)
  nextTick(() => {
    treeRef.value.setCheckedKeys(roleInfo.value.permissions ? roleInfo.value.permissions : [])
  })
}
const deleteRole = async (row) => {
  await request.delete("/roles/deleteRole", {
    params: {
      ids: row.id
    }
  })
  await getRoleList()
  ElNotification({ title: "删除成功", type: "success", duration: 700 })
}
let pageNo = ref(1)
let pageSize = ref(7)
let total = ref(0)
const getRoleList = async () => {
  const data = await request.get("/roles/getRoleList", {
    params: {
      search,
      pageNo: pageNo.value,
      pageSize: pageSize.value
    }
  })
  roleList.value = data.data
  total.value = data.total
}
getRoleList()
// 抽屉1
// const validatorRolename = (rule, value, callBack) => {
//   if (value?.length >= 6) {
//     callBack()
//   } else {
//     callBack(new Error("长度至少6位"))
//   }
// }
// const validatorPassword = (rule, value, callBack) => {
//   if (value?.length >= 6) {
//     callBack()
//   } else {
//     callBack(new Error("长度至少6位"))
//   }
// }
// const validatorCheckPassword = (rule, value, callBack) => {
//   if (value === roleInfo.value.password) {
//     callBack()
//   } else {
//     callBack(new Error("两次输入的密码不一致"))
//   }
// }
const rules = {
  role: [
    { required: true, trigger: "change", message: "请输入角色名" },
    { min: 4, max: 20, message: "长度至少4位" }
  ]
}
const addOrUpdateRole = async () => {
  await formRef.value.validate()
  await request.post("/roles/addOrUpdateRole", roleInfo.value)
  await getRoleList()
  drawer.value = !drawer.value
  ElNotification({ title: drawerTitle.value.substring(0, 2) + "成功", type: "success", duration: 700 })
}
// 抽屉2
let drawer1 = ref(false)
const updatePermission = async () => {
  roleInfo.value.permissions = treeRef.value.getCheckedKeys().filter((item) => item)
  await request.post("/roles/addOrUpdateRole", roleInfo.value)
  await getRoleList()
  drawer1.value = !drawer1.value
  ElNotification({ title: drawerTitle.value.substring(0, 2) + "成功", type: "success", duration: 700 })
}
const defaultProps = {
  children: "permissions", // 指定子节点字段
  label: "label" // 指定显示的 label 字段为 name
}
const filter = (data) => {
  data.label = data.meta?.title
  data.permissions = data.children
  if (!data.permissions) {
    if (data.buttons) {
      data.permissions = data.buttons.map(filter)
    }
    return data
  }
  data.permissions = data.permissions.filter((item) => !item.meta?.hidden)
  if (data.permissions.length === 1) {
    return filter(data.permissions[0])
  }
  data.permissions = data.permissions.map(filter)
  return data
}
const data = [filter({ meta: { title: "全部数据" }, children: router.options.routes })]
</script>

<style>
@import "@/styles/index.css";
</style>
