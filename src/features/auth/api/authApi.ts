import { REFRESH_TOKEN } from "@/common/constants"
import { instance } from "@/common/instance"
import type { LoginInputs } from "@/features/auth/lib/schemas"
import type { LoginResponse, MeResponse } from "./authApi.types"

export const authApi = {
  login(payload: LoginInputs) {
    return instance.post<LoginResponse>("/auth/simple/login", {
      ...payload,
      accessTokenTTL: payload.rememberMe ? "3d" : "30m",
    })
  },
  logout() {
    return instance.post("/auth/simple/logout", {
      refreshToken: localStorage.getItem(REFRESH_TOKEN),
    })
  },
  me() {
    return instance.get<MeResponse>("/auth/me")
  },
}
