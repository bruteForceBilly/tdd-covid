import { configFactory, wrapperFactory } from './utils.js';
import AppButton from "@/AppButton.vue";
let wrapper;

beforeEach(() => {
    wrapper = wrapperFactory(AppButton, configFactory());
});

afterEach(() => {
    wrapper.destroy();
});

describe("AppButton.vue", () => {
    it('is a Vue instance', () => {
        expect(wrapper.isVueInstance).toBeTruthy();
    });

    it("renders button label from prop text", () => {
        const config = {
            propsData: {
                text: 'hello'
            }
        }
        wrapper = wrapperFactory(AppButton, configFactory(config));
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


    // it("renders loading message when loading", () => {
    //     const wrapper = wrapperFactory({
    //         propsData: {
    //             text: 'hello',
    //             loading: true,
    //             loadingText: '…loading',
    //         } 
    //     });
    //     const button = wrapper.find('button');
    //     expect(button.text()).toBe('…loading')
    // });

    // it("is selected when clicked", async () => {
    //     const wrapper = wrapperFactory({
    //         propsData: {
    //             text: 'hello',
    //         } 
    //     });
        
    //     await wrapper.vm
        
    //     //await wrapper.setData({ isSelected: false });
    //     const button = wrapper.find('button');
    //     button.trigger("click");
    //     expect(wrapper.vm.isSelected).toBe(true)
    // });

});
