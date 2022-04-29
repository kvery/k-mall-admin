import { api } from 'boot/axios';

const fetchList = () =>
  api.get<any, any>('/cms/subject/list-all');

export {
  fetchList
};

