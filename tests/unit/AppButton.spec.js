import { configFactory, wrapperFactory } from './utils.js';
import AppButton from "@/components/App/AppButton.vue";
let wrapper;

beforeEach(() => {
    const config = {
        propsData: {
            content: 'hello'
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

    it("displays content", () => {
        const button = wrapper.find('button')
        expect(button.text()).toBe('hello')
    });

    it("does not render if no content", () => {
        const config = {
            propsData: {
                content: ''
            }
        }
        wrapper = wrapperFactory(AppButton, configFactory(config));
        const button = wrapper.find('button')
        expect(button.exists()).toBe(false)
    });

    it("displays loading animation when clicked if type submit", () => {
        const config = {
            propsData: {
                content: 'hello',
                type: 'submit'
            }
        }
        wrapper = wrapperFactory(AppButton, configFactory(config));
        const button = wrapper.find('button');
        button.trigger("click");
        button.
    })

    // clicking submit displays loading icon 
    // sucess reponse from server hides loading animation



    // it("has loading message when submitting", () => {
    //     const config = {
    //         propsData: {
    //             content: 'hello',
    //             loading: true,
    //             loadingText: '…loading',
    //         } 
    //     }
    //     wrapper = wrapperFactory(AppButton, configFactory(config));
    //     const button = wrapper.find('button');
    //     expect(button.text()).toBe('…submitting')
    // });

    // it("emits isSelected event when clicked", async () => {
    //     const button = wrapper.find('button');
    //     button.trigger("click");
    //     expect(wrapper.emitted('isSelected')).toBeTruthy()
    // });

    // it("sets value attr from isSelected prop", async () => {
    //     const config = {
    //         propsData: {
    //             name: 'hello',
    //             isSelected: true
    //         } 
    //     }
    //     wrapper = wrapperFactory(AppButton, configFactory(config));
    //     const button = wrapper.find('button');
    //     console.log(button.attributes())
    //     expect(button.attributes('value')).toBe(true)
    // });


});
