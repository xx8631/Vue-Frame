/**需求分析
   *作为一个插件存在：实现VueRouter类和install方法
   *实现两个全局组件：router-view用于显示匹配组件内容，router-link用于跳转
   *监控url变化：监听hashchange和popstate事件
   *响应最新URL:创建一个响应式的属性current，当它改变时获取对应组件并显示
   **/
let Vue; //引用构造函数，Vuerouter中要用
//创建类
class VueRouter {
  //构造函数
  constructor(options) {
    this.$options = options;

    //处理routes
    this.routeMap = {}
    this.$options.routes.forEach(route => {
      this.routeMap[route.path] = route
    })

    //创建current保存当前url
    //为了让使用current的组件重新渲染
    //他应该是响应式的
    Vue.util.defineReactive(this, 'current', '/')

    //监听hashchange时间
    window.addEventListener('hashchange', this.onHashChange.bind(this));
  }
  onHashChange(){
    //修改当前url，hash的格式 #/xxx
    this.current=window.location.hash.slice(1);
    console.log(this.current);
  }
}


//插件：实现install方法，注册$router
VueRouter.install = function (_vue) {
  //引用构造函数，Vuerouter中要用
  Vue = _vue
  //任务1：挂载$router
  //为了能够拿到Vue根实例中的router实例
  //全局混入
  Vue.mixin({
    beforeCreate() {
      //只有根组件拥有router选项；
      if (this.$options.router) {
        Vue.prototype.$router = this.$options.router;
      }
    }
  });
  //任务2：实现两个全局组件router-link和router-view
  Vue.component('router-link', {
    props: {
      to: {
        type: String,
        default: ""
      }
    },
    render(h) {
      //参数1 tag类型，参数2 传入各种属性和事件，参数3
      return h('a', { attrs: { href: '#' + this.to } }, this.$slots.default)
      //也可以使用jsx
      //return <a href={'#' + this.to}>{this.$slots.default}</a>
    }
  });
  Vue.component('router-view', {
    render(h) {
      const { routeMap, current } = this.$router;
      const component = routeMap[current] ? routeMap[current].component : null;
      return h(component)
    }
  });
}
export default VueRouter;