import { api } from 'boot/axios';

const getCategory = (id: string) =>
  api.get<any>(`/pms/product-category/${id}`);

const fetchList = (parentId: number, params: any) =>
  api.get<any, any>(`/pms/product-category/list/${parentId}`, { params });

const createCategory = (data: any) =>
  api.post<any>('/pms/product-category', data);

const updateCategory = (id: string, data: any) =>
  api.put<any>(`/pms/product-category/${id}`, data);

const deleteCategory = (ids: Array<string>) =>
  api.delete<any>('/pms/product-category', { data: { ids } });

const updateShowStatus = (data: any) =>
  api.put<any>('/pms/product-category/show-status', data);

const updateNavStatus = (data: any) =>
  api.put<any>('/pms/product-category/nav-status', data);

const fetchListWithChildren = () =>
  api.get<any, any>('/pms/product-category/list/with-children');

export {
  getCategory,
  fetchList,
  createCategory,
  updateCategory,
  deleteCategory,
  updateShowStatus,
  updateNavStatus,
  fetchListWithChildren
};

