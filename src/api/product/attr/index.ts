// 属性相关api
import request from '@/utils/request';

// 属性管理模块接口地址
enum API {
  // 一级分类接口地址
  C1_URL = '/admin/product/getCategory1',
  // 二级分类接口地址
  C2_URL = '/admin/product/getCategory2/',
  // 三级分类接口地址
  C3_URL = '/admin/product/getCategory3/',
  // 三级分类下已有的属性的接口地址
  ATTR_URL = '/admin/product/attrInfoList/',
  // 添加or修改已有属性的接口
  ADDORUPDATEATTR_URL = '/admin/product/saveAttrInfo',
  //删除属性的接口
  DELETEATTR_URL = '/admin/product/deleteAttr/',
}

// 获取一级分类的请求
export const reqC1 = () => {
  return request.get<any, any>(API.C1_URL);
};

// 获取二级分类的请求
export const reqC2 = (Category1Id: any) => {
  return request.get<any, any>(API.C2_URL + Category1Id);
};

// 获取三级分类的请求
export const reqC3 = (Category2Id: any) => {
  return request.get<any, any>(API.C3_URL + Category2Id);
};

// 获取已有属性的请求
export const reqHasAttr = (Category1Id: any, Category2Id: any, Category3Id: any) => {
  return request.get<any, any>(API.ATTR_URL + `${Category1Id}/${Category2Id}/${Category3Id}`);
};

// 删除已有属性的请求
export const reqDeleteAttr = (attrId: any) => {
  return request.delete<any, any>(API.DELETEATTR_URL + attrId);
};

// 添加or修改属性的请求
export const reqSaveAttr = (data: any) => {
  return request.post<any, any>(API.ADDORUPDATEATTR_URL, data);
};
