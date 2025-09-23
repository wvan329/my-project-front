<template>
  <div>
    <!-- 上 -->
    <el-card class="h-[60px]">
      <el-form @submit.prevent class="flex w-full items-center justify-between">
        <el-form-item label="用户名">
          <el-input style="width: 180px" v-model="username" clearable clear-icon="close" @keyup.enter="doSearch" placeholder="请输入"></el-input>
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
              userInfo = {}
              drawerTitle = '添加用户'
            }
          "
          >添加用户
        </el-button>

        <el-popconfirm title="确认删除?" @confirm="deleteUsers" placement="bottom">
          <template #reference>
            <el-button type="danger">批量删除</el-button>
          </template>
        </el-popconfirm>
      </div>
      <el-table ref="tableRef" class="mt-[10px]" :data="userList">
        <el-table-column type="selection" :selectable="selectable"></el-table-column>
        <el-table-column label="序号" align="center" width="80px" type="index"></el-table-column>
        <el-table-column label="用户名" align="center" prop="username" show-overflow-tooltip></el-table-column>
        <el-table-column label="角色" align="center" prop="roles" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" align="center" width="190px">
          <template #default="{ row }">
            <div class="flex justify-center">
              <el-button type="primary" @click="setRole(row)">分配角色</el-button>
              <el-button
                type="primary"
                @click="
                  () => {
                    drawer = !drawer
                    Object.assign(userInfo, row)
                    drawerTitle = '修改用户'
                  }
                "
                >编辑
              </el-button>
              <el-popconfirm title="确认删除?" @confirm="deleteUser(row)" placement="bottom">
                <template #reference>
                  <el-button type="danger" :disabled="!selectable(row)">删除</el-button>
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
        @size-change="getUserList"
        @current-change="getUserList"
      />
    </el-card>
    <!-- 抽屉1 -->
    <el-drawer class="dark:bg-black" v-model="drawer" direction="rtl" :title="drawerTitle" size="30%">
      <el-form ref="formRef" label-position="left" label-width="auto" :model="userInfo" :rules="rules">
        <el-form-item label="用户名" prop="username">
          <el-input placeholder="请输入用户名" v-model.trim="userInfo.username"></el-input>
        </el-form-item>
        <div v-if="drawerTitle === '添加用户'">
          <el-form-item label="密码" prop="password">
            <el-input type="password" placeholder="请输入密码" v-model="userInfo.password" show-password></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPassword">
            <el-input placeholder="再次输入密码" show-password v-model="userInfo.checkPassword"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="drawer = !drawer">取消</el-button>
          <el-button type="primary" @click="addOrUpdateUser">确定</el-button>
        </div>
      </template>
    </el-drawer>
    <!-- 抽屉2 -->
    <el-drawer class="dark:bg-black" v-model="drawer1" direction="rtl" title="分配角色" size="30%">
      <el-form ref="formRef" label-position="left" label-width="auto">
        <el-form-item label="用户名">
          <el-input v-model.trim="userInfo.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色列表">
          <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
          <el-checkbox-group v-model="userInfo.roles" @change="handleCheckedItemsChange">
            <el-checkbox v-for="role in allRoles" :key="role" :label="role" :value="role">
              {{ role }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="drawer1 = !drawer1">取消</el-button>
          <el-button type="primary" @click="updateRole">确定</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup>
import { getUserListApi, addOrUpdateUserApi } from "@/api/acl/user"
import { ref } from "vue"
import { ElNotification } from "element-plus"
import useUserStore from "@/stores/user"
import request from "@/utils/request"
const userStore = useUserStore()

let drawer1 = ref(false)
let checkAll = ref(false)

let allRoles = ref([])
let isIndeterminate = ref(false)

const getAllRoles = async () => {
  allRoles.value = await request.get("/roles/getAll")
}
getAllRoles()

const handleCheckAllChange = () => {
  isIndeterminate.value = false
  userInfo.value.roles = checkAll.value ? allRoles.value : []
}
const handleCheckedItemsChange = () => {
  isIndeterminate.value = userInfo.value.roles.length > 0 && userInfo.value.roles.length < allRoles.value.length
  checkAll.value = userInfo.value.roles.length === allRoles.value.length
}
const setRole = (row) => {
  drawer1.value = !drawer1.value
  Object.assign(userInfo.value, row)
  checkAll.value = row.roles.length === allRoles.value.length
  isIndeterminate.value = userInfo.value.roles.length > 0 && userInfo.value.roles.length < allRoles.value.length
}
const updateRole = async () => {
  await request.post("/roles/updateRole", userInfo.value)
  ElNotification({ title: "修改成功", type: "success", duration: 700 })
  drawer1.value = !drawer1.value
  getUserList()
}

const deleteUser = async (row) => {
  await request.delete("/deleteUser", {
    params: {
      ids: row.id
    }
  })
  await getUserList()
  ElNotification({ title: "删除成功", type: "success", duration: 700 })
}

let tableRef = ref()

const selectable = (row) => userStore.user.id !== row.id

const deleteUsers = async () => {
  let ids = tableRef.value.getSelectionRows().map((item) => item.id)
  if (ids.length === 0) {
    ElNotification({ title: "请选择要删除的行", type: "warning", duration: 700 })
    return
  }
  await request.delete("/deleteUser", {
    params: {
      ids
    }
  })
  await getUserList()
  ElNotification({ title: "删除成功", type: "success", duration: 700 })
}

let drawer = ref(false)
let drawerTitle = ref("添加用户")

let userInfo = ref({})
const validatorUsername = (rule, value, callBack) => {
  if (value?.length >= 6) {
    callBack()
  } else {
    callBack(new Error("长度至少6位"))
  }
}
const validatorPassword = (rule, value, callBack) => {
  if (value?.length >= 6) {
    callBack()
  } else {
    callBack(new Error("长度至少6位"))
  }
}
const validatorCheckPassword = (rule, value, callBack) => {
  if (value === userInfo.value.password) {
    callBack()
  } else {
    callBack(new Error("两次输入的密码不一致"))
  }
}
const rules = {
  username: [{ required: true, trigger: "change", validator: validatorUsername }],
  password: [{ required: true, trigger: "change", validator: validatorPassword }],
  checkPassword: [{ required: true, trigger: "change", validator: validatorCheckPassword }]
}
const formRef = ref()
const addOrUpdateUser = async () => {
  await formRef.value.validate()
  await addOrUpdateUserApi(userInfo.value)
  await getUserList()
  drawer.value = !drawer.value
  ElNotification({ title: drawerTitle.value.substring(0, 2) + "成功", type: "success", duration: 700 })
  if (userInfo.value.id === userStore.user.id) {
    await userStore.userLogout()
  }
}

let pageNo = ref(1)
let pageSize = ref(7)
let total = ref(0)
let userList = ref([])
let username = ref("")
let search = ""
const getUserList = async () => {
  const data = await getUserListApi(search, pageNo.value, pageSize.value)
  userList.value = data.data
  total.value = data.total
}
getUserList()
const doSearch = async () => {
  search = username.value
  await getUserList()
}
</script>

<style>
@import "@/styles/index.css";
.el-button {
  @apply m-0 rounded-lg border-none px-[10px] py-[4px];
}
.el-button + .el-button {
  margin-left: 2px; /* 左边距，根据需要调整 */
}
button.el-button--primary {
  @apply bg-sky-600;
}
button.el-button--danger {
  @apply bg-red-700;
}
li.is-active.number {
  background-color: var(--color-sky-600) !important;
}
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  @apply border-none bg-gray-700;
}
.el-form-item label {
  @apply dark:text-white;
}
.el-card,
.el-table__cell,
.el-table__header-wrapper > table .el-table__cell {
  @apply dark:border-gray-700 dark:bg-black dark:text-white;
}
.el-table__inner-wrapper {
  @apply border-none;
}

.dark .el-table__row:hover .el-table__cell {
  background-color: var(--color-gray-700) !important;
}

.dark .el-table__cell {
  border: none !important;
}

.el-table__inner-wrapper::before {
  @apply hidden;
}

div.el-table__inner-wrapper > div.el-table__header-wrapper > table > thead > tr th {
  @apply dark:border-gray-700;
}
.el-table__empty-block {
  @apply dark:bg-black;
}
.el-table__empty-text {
  @apply dark:text-white;
}
.el-pagination__jump,
.el-pagination__total {
  @apply dark:text-white;
}
</style>
