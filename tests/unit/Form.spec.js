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
  it("Is a Vvue instance", () => {
    expect(wrapper.isVueInstance).toBeTruthy();
  });

  it("Has a form element", () => {
    const form = wrapper.find("form");
    expect(form.exists()).toBe(true);
  });

  it("Has a fieldset named contact", () => {
    const contactFieldset = wrapper.find("fieldset[name='contact']");
    expect(contactFieldset.exists()).toBe(true);
  });

  it("Has contact field with first name input", () => {
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

    await wrapper.setData({ firstName: "x" });

    expect(wrapper.find(".firstNameError").text()).toContain(
      "Error: First name is too short"
    );

    await wrapper.setData({ firstName: "xxx" });

    expect(wrapper.find(".firstNameError").exists()).toBe(false);
  });

  it("Error displays if last name text length is < 2", async () => {
    config = {
      data() {
        return {
          lastName: "",
        };
      },
    };

    wrapper = wrapperFactory(Form, configFactory(config));

    await wrapper.setData({ lastName: "x" });

    expect(wrapper.find(".lastNameError").text()).toContain(
      "Error: Last name is too short"
    );

    await wrapper.setData({ lastName: "xxx" });

    expect(wrapper.find(".lastNameError").exists()).toBe(false);
  });

  it("Too short name errors does not show input error if user has not yet interacted", () => {
    const firstNameError = wrapper.find("firstNameError");
    expect(firstNameError.exists()).toBe(false);
    const lastNameError = wrapper.find("lastNameError");
    expect(lastNameError.exists()).toBe(false);
  });

  it("Does not allow special charachters in name inputs", () => {
    config = {
      data() {
        return {
          firstName: "xxx#",
          lastName: "xxx#",
        };
      },
    };

    wrapper = wrapperFactory(Form, configFactory(config));

    expect(wrapper.find(".firstNameHasSpecialCharacterError").text()).toContain(
      "Error: Special character not allowed in first name"
    );

    expect(wrapper.find(".lastNameHasSpecialCharacterError").text()).toContain(
      "Error: Special character not allowed in last name"
    );
  });
});
