import axios from "axios";
import API_BASE_URL from "../utils/api-controller";
import getHeaders from "../utils/get-headers";

const voipAxios = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
});

voipAxios.interceptors.request.use((config) => {
  const headers = getHeaders();
  if (!headers) {
    return Promise.reject(new Error("Missing authentication headers. Please sign in again."));
  }
  config.headers = { ...(config.headers || {}), ...headers };
  return config;
});

const unwrap = (response) => response?.data;

export const voipApi = {
  requestCall: (callee) =>
    voipAxios.post("/voip/call", { callee }).then(unwrap),
  hangup: (callId) =>
    voipAxios.post(`/voip/calls/${encodeURIComponent(callId)}/hangup`).then(unwrap),
  getStatus: () => voipAxios.get("/voip/status").then(unwrap),
};
