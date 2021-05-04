<template>
    <div v-if="content">
        <button :type="type" :name="name" :value="value" @click="emitTypeHandler">
            {{ content }}
             <AppIcon v-if="isLoading">
                <AppIconLoading :isAnimating="isLoading"/>
            </AppIcon>
        </button>
    </div>
</template>

<script>
import AppIcon from '@/components/App/AppIcon.vue';
import AppIconLoading from '@/components/App/AppIconLoading.vue'

// Idle / Working / Success / Error 
// Disabled
// Hover
// Focused
// Active / Pressed

export default {
    inheritAttrs: false,
    name: "AppButton",
    components: {
        AppIcon,
        AppIconLoading
    },
    props: {
        content: {
            type: String,
        },
        isLoading: {
            type: String,
        },
        name: {
            type: String,
        },
        value: {
            type: String,
        },
        type: {
            type: String,
            validator: function (value) {
                return ['submit', 'reset', 'button'].indexOf(value) !== -1
            }
        }
    },
    methods: {
        emitTypeHandler() {
            return this.$emit(this.type)
        }
    },
}
</script>