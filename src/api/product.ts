import { api } from 'boot/axios';

const getProduct = (id: string) =>
  api.get<any>(`/pms/product/${id}`);

const fetchList = (params: any) =>
  api.get<any, any>('/pms/product', { params });

const createProduct = (data: any) =>
  api.post<any>('/pms/product', data);

const updateProduct = (id: string, data: any) =>
  api.put<any>(`/pms/product/${id}`, data);

const deleteProduct = (ids: Array<string>) =>
  api.delete<any>('/pms/product', { data: { ids } });

const updatePublishStatus = (data: any) =>
  api.put<any>('/pms/product/publish-status', data);

const updateNewStatus = (data: any) =>
  api.put<any>('/pms/product/new-status', data);

const updateRecommendStatus = (data: any) =>
  api.put<any>('/pms/product/recommend-status', data);

export {
  getProduct,
  fetchList,
  createProduct,
  updateProduct,
  deleteProduct,
  updatePublishStatus,
  updateNewStatus,
  updateRecommendStatus
};

