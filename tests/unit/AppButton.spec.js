import { configFactory, wrapperFactory } from './utils.js';
import AppButton from "@/AppButton.vue";
let wrapper;

beforeEach(() => {
    const config = {
        propsData: {
            text: 'hello'
        }
    }
    wrapper = wrapperFactory(AppButton, configFactory(config));
});

afterEach(() => {
    wrapper.destroy();
});

describe("AppButton.vue", () => {
    it('is a Vue instance', () => {
        expect(wrapper.isVueInstance).toBeTruthy();
    });

    it("displays button label from prop text", () => {
        const button = wrapper.find('button')
        expect(button.text()).toBe('hello')
    });

    it("does not render if prop text is empty", () => {
        const config = {
            propsData: {
                text: ''
            }
        }
        wrapper = wrapperFactory(AppButton, configFactory(config));
        const button = wrapper.find('button')
        expect(button.exists()).toBe(false)
    });

    it("displays loading message when loading", () => {
        const config = {
            propsData: {
                text: 'hello',
                loading: true,
                loadingText: '…loading',
            } 
        }
        wrapper = wrapperFactory(AppButton, configFactory(config));
        const button = wrapper.find('button');
        expect(button.text()).toBe('…loading')
    });

    it("is selected when clicked", async () => {
        wrapper.vm.isSelected = false;
        const button = wrapper.find('button');
        button.trigger("click");
        expect(wrapper.vm.isSelected).toBe(true)
    });

    it("is deselected when it is selected and clicked", async () => {
        wrapper.vm.isSelected = true;
        const button = wrapper.find('button');
        button.trigger("click");
        expect(wrapper.vm.isSelected).toBe(false)
    });

});
