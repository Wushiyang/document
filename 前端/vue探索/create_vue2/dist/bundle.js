/*
 * @Author: your name
 * @Date: 2021-07-10 15:02:22
 * @LastEditTime: 2021-07-10 17:14:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /create_vue2/src/util/util.js
 */
const _toString = Object.prototype.toString;
// 判断obj是否是简单对象
function isPlainObject(obj) {
  return _toString.call(obj) === '[object Object]'
}
// 合并_from属性到to
function extend(to, _from) {
  for (const key in _from) {
    to[key] = _from[key];
  }
  return to
}
const hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key)
}

/*
 * @Author: your name
 * @Date: 2021-07-10 14:53:36
 * @LastEditTime: 2021-07-10 15:28:12
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /create_vue2/src/util/options.js
 */
// 选项合并策略
const strats = config.optionMergeStrategies;
// 默认选项合并策略
const defaultStrat = function (parentVal, childVal) {
  return childVal === undefined ? parentVal : childVal
};
function mergeOptions(parent, child, vm) {
  normalizeProps(child, vm);
  normalizeInject(child, vm);
  normalizeDirectives(child);

  // Apply extends and mixins on the child options,
  // but only if it is a raw options object that isn't
  // the result of another mergeOptions call.
  // Only merged options has the _base property.
  if (!child._base) {
    if (child.extends) {
      parent = mergeOptions(parent, child.extends, vm);
    }
    if (child.mixins) {
      for (let i = 0, l = child.mixins.length; i < l; i++) {
        parent = mergeOptions(parent, child.mixins[i], vm);
      }
    }
  }

  const options = {};
  let key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField(key) {
    const strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options
}
// 规范化props属性 { type }
function normalizeProps(options, vm) {
  const props = options.props;
  if (!props) return
  const res = {};
  let i, val;
  if (Array.isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === 'string') {
        res[val] = { type: null };
      }
    }
  } else if (isPlainObject(props)) {
    for (const key in props) {
      val = props[key];
      res[key] = isPlainObject(val) ? val : { type: val };
    }
  } else {
    return console.error('util - options.js - normalizeProps 出错了', vm)
  }
  return res
}
// 规范化inject属性 { from }
function normalizeInject(options, vm) {
  const inject = options.inject;
  if (!inject) return
  const normalized = (options.inject = {});
  if (Array.isArray(inject)) {
    for (let i = 0; i < inject.length; i++) {
      normalized[inject[i]] = { from: inject[i] };
    }
  } else if (isPlainObject(inject)) {
    for (const key in inject) {
      const val = inject[key];
      normalized[key] = isPlainObject(val)
        ? extend({ from: key }, val)
        : { from: val };
    }
  } else {
    return console.error('util - options.js - normalizeInject 出错了', vm)
  }
}
// 规范化directives属性 { bind, update }
function normalizeDirectives(options) {
  const dirs = options.directives;
  if (dirs) {
    for (const key in dirs) {
      const def = dirs[key];
      if (typeof def === 'function') {
        dirs[key] = { bind: def, update: def };
      }
    }
  }
}

/*
 * @Author: your name
 * @Date: 2021-07-10 15:44:32
 * @LastEditTime: 2021-07-10 15:49:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /create_vue2/src/lifecycle.js
 */
function initLifecycle(vm) {
  const options = vm.$options;

  // locate first non-abstract parent
  let parent = options.parent;
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];
  vm.$refs = {};

  vm._watcher = null;
  vm._inactive = null;
  vm._directInactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}

/*
 * @Author: your name
 * @Date: 2021-07-10 14:45:56
 * @LastEditTime: 2021-07-10 15:49:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /create_vue2/src/init.js
 */
let uid = 0;
// 初始化混合
function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this;
    vm._isVue = true;
    vm._uid = uid++;
    if (options && options._isComponent) {
      // 内部组件处理
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(vm.constructor.options, options || {}, vm);
    }
    // 原本用作代理实例方法属性控制错误输出
    vm._renderProxy = vm;
    vm._self = vm;
    initLifecycle(vm);
  };
}
function initInternalComponent(vm, options) {
  const opts = (vm.$options = Object.create(vm.constructor.options));
  // doing this because it's faster than dynamic enumeration.
  const parentVnode = options._parentVnode;
  opts.parent = options.parent;
  opts._parentVnode = parentVnode;

  const vnodeComponentOptions = parentVnode.componentOptions;
  opts.propsData = vnodeComponentOptions.propsData;
  opts._parentListeners = vnodeComponentOptions.listeners;
  opts._renderChildren = vnodeComponentOptions.children;
  opts._componentTag = vnodeComponentOptions.tag;

  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}

/*
 * @Author: your name
 * @Date: 2021-07-10 11:28:35
 * @LastEditTime: 2021-07-10 15:48:58
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /create_vue2/src/index.js
 */
class Vue {
  constructor(options) {
    this._init(options);
  }
}

initMixin(Vue);

/*
 * @Author: your name
 * @Date: 2021-07-10 15:48:13
 * @LastEditTime: 2021-07-10 15:48:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /create_vue2/src/index.js
 */
window.Vue = Vue;
