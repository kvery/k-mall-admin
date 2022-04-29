import { api } from 'boot/axios';

const fetchList = (params: any) =>
  api.get<any, any>('/pms/product-attribute/category', { params });

const createProductAttrCate = (name: string) =>
  api.post<any>('/pms/product-attribute/category', { name });

const updateProductAttrCate = (id: string, name: string) =>
  api.put<any>(`/pms/product-attribute/category/${id}`, { name });

const deleteProductAttrCate = (id: string) =>
  api.delete<any>(`/pms/product-attribute/category/${id}`);

const fetchListWithAttr = (params?: any) =>
  api.get<any, any>('/pms/product-attribute/category/attr', { params });

export {
  fetchList,
  createProductAttrCate,
  updateProductAttrCate,
  deleteProductAttrCate,
  fetchListWithAttr
};

