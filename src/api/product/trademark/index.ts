// 品牌管理模块的接口
import request from '@/utils/request';
import { TradeMark, TradeMarkResponseData } from './type';
// 品牌管理模块接口地址
enum API {
  // 获取已有品牌接口
  TRADEMARK_URL = '/admin/product/baseTrademark/',
  // 添加品牌的接口
  ADDTRADEMARK_URL = '/admin/product/baseTrademark/save',
  // 修改品牌的接口
  UPDATETRADEMARK_URL = '/admin/product/baseTrademark/update',
  //删除已有品牌
  DELETE_URL = '/admin/product/baseTrademark/remove/',
}
// 获取已有品牌的接口方法
// page:获取第几页 ---默认第一页
// limit:获取几个已有品牌的数据
export const reqHasTrademark = (page: number, limit: number) =>
  request.get<any, TradeMarkResponseData>(API.TRADEMARK_URL + `${page}/${limit}`);

// 添加or修改品牌的接口
export const AddOrUpdateTradeMark = (data: TradeMark) => {
  // 不存在id属性，即添加
  if (!data.id) {
    return request.post<any, any>(API.ADDTRADEMARK_URL, data);
  } else {
    // 存在id属性，即修改
    return request.put<any, any>(API.UPDATETRADEMARK_URL, data);
  }
};

// 删除品牌的接口
export const reqRemoveTm = (id: number) => {
  return request.delete<any, any>(API.DELETE_URL + id);
};
