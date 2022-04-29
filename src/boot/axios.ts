import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';
import { Notify } from 'quasar';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({
  baseURL: process.env.API_BASE_URL,
  timeout: 15000
});

interface Result {
  readonly code: number;
  readonly msg: string;
  data: any;
}

api.interceptors.request.use(request => {
  return request;
}, error => {
  console.log(`err:${JSON.stringify(error)}`);
  return Promise.reject(error);
});

api.interceptors.response.use(response => {
  const res = response.data as Result;
  if (res.code !== 20000) {
    Notify.create({
      type: 'negative',
      message: res.msg
    });
    return Promise.reject(res);
  } else {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return res.data;
  }
}, error => {
  console.log(`err:${JSON.stringify(error)}`);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  if ((error.message.includes('timeout'))) {
    Notify.create({
      type: 'negative',
      message: '请求超时'
    });
  }
  return Promise.reject(error);
});

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { api };
