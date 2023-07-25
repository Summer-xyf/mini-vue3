import { track, trigger } from "./effect";
export function reactive(raw) {
    return new Proxy(raw, {
        get(target, key) {
            // target是当前对象，key是用户访问的key
            // {foo: 1}
            // foo
            const res = Reflect.get(target, key);
            // TODO依赖收集
            track(target, key);
            return res;
        },

        set(target, key, value) {
            const res = Reflect.set(target, key, value);
            // TODO触发依赖
            trigger(target, key);
            return res;
        },
    });
}
/*
    1.Reflect 是一个内置的对象，它提供拦截 JavaScript 操作的方法，是 ES6 为了操作对象而提供的新 API。
    2.Reflect不是一个函数对象，因此它是不可构造的。
    3.Reflect的所有属性和方法都是静态的。
    4.现阶段，某些方法同时在Object和Reflect对象上部署，未来的新方法将只部署在Reflect对象上。
    5.修改某些Object方法的返回结果，让其变得更规范化。如Object.defineProperty(obj, name, desc)在无法定义属性时，会抛出一个错误，而Reflect.defineProperty(obj, name, desc)则会返回false。
    6.让Object操作都变成函数行为。
    7.Reflect对象的方法与Proxy对象的方法一一对应，只要是Proxy对象的方法，就能在Reflect对象上找到对应的方法

                
*/
/**
 * Reflect 拥有13个静态方法
        // 对一个函数进行调用操作，同时可以传入一个数组作为调用参数。
        Reflect.apply(target, thisArg, args)	
        // 对构造函数进行 new 操作，相当于执行 new target(...args)。
        Reflect.construct(target, args)
        // 获取对象身上某个属性的值，类似于 target[name]。如果没有该属性，则返回undefined。
        Reflect.get(target, name, receiver)
        // 将值分配给属性的函数。返回一个Boolean，如果更新成功，则返回true。
        Reflect.set(target, name, value, receiver)
        // Reflect.defineProperty方法基本等同于Object.defineProperty，直接在一个对象上定义一个新属性，或者修改一个对象的现有属性，不同的是，Object.defineProperty返回此对象。而Reflect.defineProperty会返回布尔值.
        Reflect.defineProperty(target, name, desc)
        // 作为函数的delete操作符，相当于执行 delete target[name]。
        Reflect.deleteProperty(target, name)
        // 判断一个对象是否存在某个属性，和 in 运算符 的功能完全相同。
        Reflect.has(target, name)
        // 返回一个包含所有自身属性（不包含继承属性）的数组。(类似于 Object.keys(), 但不会受enumerable影响, Object.keys返回所有可枚举属性的字符串数组).
        Reflect.ownKeys(target)
        // 判断一个对象是否是可扩展的（是否可以在它上面添加新的属性）,类似于 Object.isExtensible()。返回表示给定对象是否可扩展的一个Boolean 。（Object.seal 或 Object.freeze 方法都可以标记一个对象为不可扩展。）
        Reflect.isExtensible(target)
        // 让一个对象变的不可扩展，也就是永远不能再添加新的属性。
        Reflect.preventExtensions(target)
        // 如果对象中存在该属性，如果指定的属性存在于对象上，则返回其属性描述符对象（property descriptor），否则返回 undefined。类似于 Object.getOwnPropertyDescriptor()。
        Reflect.getOwnPropertyDescriptor(target, name)
        // 返回指定对象的原型.类似于 Object.getOwnPropertyDescriptor()。
        Reflect.getPrototypeOf(target)
        // 设置对象原型的函数. 返回一个 Boolean， 如果更新成功，则返回true。如果 target 不是 Object ，或 prototype 既不是对象也不是 null，抛出一个 TypeError 异常。
        Reflect.setPrototypeOf(target, prototype)
*/
