//实现一个插件：声明Store类，挂载$store;
//插件通常来为Vue添加全局功能，如 Vue.func;Vue.prototype.$xxx;
/**
 *创建响应式的state，保存mutations，action，和getters；
 *实现commit根据用户传入type执行对应mutation
 *实现dispatch根据用户传入type执行对应action，同时传递上下文
 *实现getters，按照getters定义对state做派生
 */

let Vue;

//Store类声明
class Store {
  //options不传默认为{}对象
  constructor(options = {}) {
    this._vm = new Vue({
      //data中的值会做响应化处理
      data: {
        $$state: options.state
      }
    })
    //保存mutations
    this._mutations = options.mutations;

    this._actions = options.actions;



    //锁死commit，dispatch 函数this指向；
    const store = this;
    const { commit, dispatch } = store;
    this.commit = function boundCommit(type, payload) {
      commit.call(store, type, payload);
    }
    this.dispatch = function boundDispatch(type, payload) {
      dispatch.call(store, type, payload);
    }
    //实现getters
    this.getters = {};
    //遍历getters
    Object.keys(options.getters).forEach(key => {
      //把所有的getters都变成响应式的
      //Object.defineProperty 在一个对象上定义一个新属性，或者修改现有属性，并返回此对象
      Object.defineProperty(this.getters, key, {
        get: () => options.getters[key](options.state),
        enumerable: true
      })
    })
  }
  //存取器使之成为只读
  get state() {
    return this._vm._data.$$state
  }
  set state(v) {
    console.error('please use replaceState to reset state');
  }
  //commit 修改状态
  commit(type, payload) {
    //1.获取mutation
    const entry = this._mutations[type];

    if (!entry) {
      console.error('大兄弟，没有这个mutation');
      return;
    }
    entry(this.state, payload)
  }

  //dispatch,执行异步任务或复杂逻辑
  dispatch(type, payload) {
    //1.获取action
    const entry = this._actions[type]

    if (!entry) {
      console.error('大兄弟，没有这个action');
      return;
    }
    entry(this, payload);
  }

}

//install 实现  插件必须暴漏install 方法  参数1是Vue构造器，参数2是可选的选项对象；
function install(_Vue) {
  Vue = _Vue;
  //混入
  Vue.mixin({
    beforeCreate() {
      //options 用于当前Vue实例的初始化选项。需要在选项中包含自定义property时会有用处
      if (this.$options.store) {
        Vue.prototype.$store = this.$options.store;
      }
    }
  })
}

export default { Store, install };