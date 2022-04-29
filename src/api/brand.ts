import { api } from 'boot/axios';

const getBrand = (id: string) =>
  api.get<any>(`/pms/brand/${id}`);

const fetchList = (params: any) =>
  api.get<any, any>('/pms/brand', { params });

const createBrand = (data: any) =>
  api.post<any>('/pms/brand', data);

const updateBrand = (id: string, data: any) =>
  api.put<any>(`/pms/brand/${id}`, data);

const deleteBrand = (ids: Array<string>) =>
  api.delete<any>('/pms/brand', { data: { ids } });

const updateShowStatus = (data: any) =>
  api.put<any>('/pms/brand/show-status', data);

const updateFactoryStatus = (data: any) =>
  api.put<any>('/pms/brand/factory-status', data);

export {
  getBrand,
  fetchList,
  createBrand,
  updateBrand,
  deleteBrand,
  updateShowStatus,
  updateFactoryStatus
};

