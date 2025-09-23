import request from "@/utils/request"

export const getUserListApi = (search, pageNo, pageSize) =>
  request.get("/getUserList" + `/${pageNo}/${pageSize}`, {
    params: {
      search
    }
  })
export const addOrUpdateUserApi = (data = null, params = null) => request.post("/addOrUpdateUser", data, { params })
