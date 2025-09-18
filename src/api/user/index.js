import request from "@/utils/request"

const API = {
  login: "/login",
  logout: "/logout",
  getCaptcha: "/getCaptcha",
  hello1: "/hello1",
  get_user_info_by_id: "/api/get_user_info_by_id",
  get_user_info_by_name: "/api/get_user_info_by_name",
  get_user_info_by_phone: "/api/get_user_info_by_phone",
  get_user_info_by_email: "/api/get_user_info_by_email"
}

export const hello = (params) => request.get(API.hello, { params })
export const hello1 = (data, params) => request.post(API.hello1, data, { params })
export const login = (data = null, params = null) => request.post(API.login, data, { params })
export const logout = (params = null) => request.get(API.logout, { params })
export const getCaptcha = (params = null) => request.get(API.getCaptcha, { params })
