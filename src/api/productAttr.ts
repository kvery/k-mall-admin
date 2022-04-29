import { api } from 'boot/axios';

const getProductAttr = (id: string) =>
  api.get<any>(`/pms/product-attribute/${id}`);

const fetchList = (cid: string, params: any) =>
  api.get<any, any>(`/pms/product-attribute/list/${cid}`, { params });

const createProductAttr = (data: any) =>
  api.post<any>('/pms/product-attribute', data);

const updateProductAttr = (id: string, data: any) =>
  api.put<any>(`/pms/product-attribute/${id}`, data);

const deleteProductAttr = (ids: Array<string>) =>
  api.delete<any>('/pms/product-attribute', { data: { ids } });

const getProductAttrInfo = (productCategoryId: string) =>
  api.get<any>(`/pms/product-attribute/attr-info/${productCategoryId}`);

export {
  getProductAttr,
  fetchList,
  createProductAttr,
  updateProductAttr,
  deleteProductAttr,
  getProductAttrInfo
};

