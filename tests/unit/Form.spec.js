import { configFactory, wrapperFactory } from "./utils.js";
import Form from "@/components/Form.vue";
let wrapper, config;

beforeEach(() => {
  config = {
    propsData: {},
  };
  wrapper = wrapperFactory(Form, configFactory(config));
});

afterEach(() => {
  wrapper.destroy();
});

describe("Form.vue", () => {
  it("is a Vvue instance", () => {
    expect(wrapper.isVueInstance).toBeTruthy();
  });

  it("has a form element", () => {
    const form = wrapper.find("form");
    expect(form.exists()).toBe(true);
  });

  it("has a fieldset named contact", () => {
    const contactFieldset = wrapper.find("fieldset[name='contact']");
    expect(contactFieldset.exists()).toBe(true);
  });

  it("has contact field with first name input", () => {
    const firstNameInput = wrapper.find(
      "fieldset[name='contact'] #first-name[type='text']"
    );
    expect(firstNameInput.exists()).toBe(true);
  });

  it("Error displays if first name text length is < 2", async () => {
    config = {
      data() {
        return {
          firstName: "",
        };
      },
    };

    wrapper = wrapperFactory(Form, configFactory(config));

    const firstNameInput = wrapper.find(
      "fieldset[name='contact'] #first-name[type='text']"
    );

    await wrapper.setData({ firstName: "x" });

    expect(wrapper.find(".message").text()).toContain(
      "Error: First Name is too short"
    );

    await wrapper.setData({ firstName: "xxx" });

    expect(wrapper.find(".message").exists()).toBe(false);
  });
});
