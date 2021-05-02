import { shallowMount } from "@vue/test-utils";
import App from "@/App.vue";

describe("App.vue", () => {
  it("renders", () => {
    const wrapper = shallowMount(App);
    const app = wrapper.find('#app');
    expect(app.exists()).toBe(true)
  });
});
