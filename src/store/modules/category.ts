// 创建三级分类仓库
import { defineStore } from 'pinia';

// 引入接口
import { reqC1, reqC2, reqC3, reqHasAttr } from '@/api/product/attr';

// 定义使用仓库方法
const useCategoryState = defineStore('Category', {
  // 存放数据
  state: () => {
    return {
      // 存储一级分类的数据
      c1Arr: [],
      // 存储一级分类的ID
      c1Id: '',

      // 二级分类的数据
      c2Arr: [],
      c2Id: '',

      // 三级分类的数据
      c3Arr: [],
      c3Id: '',
    };
  },
  // 异步逻辑
  actions: {
    // 发请求,获取一级分类,存入仓库
    async getC1() {
      const result: any = await reqC1();
      if (result.code == 200) {
        this.c1Arr = result.data;
      }
    },
    // 发请求,获取二级分类,存入仓库
    async getC2() {
      // 传入一级分类的id
      const result: any = await reqC2(this.c1Id);
      if (result.code == 200) {
        this.c2Arr = result.data;
      }
    },
    // 发请求,获取三级分类,存入仓库
    async getC3() {
      // 传入二级分类的id
      const result: any = await reqC3(this.c2Id);
      if (result.code == 200) {
        this.c3Arr = result.data;
      }
    },
  },
  // 计算属性
  getters: {},
});

// 对外暴露三级分类仓库
export default useCategoryState;
