import { api } from 'boot/axios';

const fetchList = () =>
  api.get<any, any>('/cms/preference-area/list-all');

export {
  fetchList
};

