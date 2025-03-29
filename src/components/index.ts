// 引入项目中全部的全局组件
import SvgIcon from './SvgIcon/index.vue';
import Pagination from './Pagination/index.vue';
import Category from './Category/index.vue';
// 引入 element-plus 提供全部图标组件
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

// 全局对象
const allGlobalComponent: any = { SvgIcon, Pagination, Category };

// 对外暴露插件对象
export default {
  // 务必取名 install 方法
  install(app: any) {
    // 注册项目全部的全局组件
    Object.keys(allGlobalComponent).forEach((key) => {
      // console.log(key)
      // 注册项目全部的全局组件
      app.component(key, allGlobalComponent[key]);
    });
    // 注册element-plus所有图片的全局组件
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component);
    }
  },
};
