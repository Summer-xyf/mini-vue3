import { reactive } from "../reactive";
import { effect } from "../effect";
describe("effects", () => {

    it.skip("happy path", () => {// skip 拆分，分步走测试
        // 创建响应式对象
        const user = reactive({
            age: 10
        })

        let nextAge; 
        effect(() => {
            nextAge = user.age + 1;
        })

        expect(nextAge).toBe(11);

        // update 未收集触发依赖操作 无法通过
        user.age++;
        expect(nextAge).toBe(12);
    })
})