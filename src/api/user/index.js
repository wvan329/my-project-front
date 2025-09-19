import request from "@/utils/request"

export const login = (data = null, params = null) => request.post("/login", data, { params })
export const logout = (params = null) => request.get("/logout", { params })
export const getCaptcha = (params = null) => request.get("/getCaptcha", { params })
