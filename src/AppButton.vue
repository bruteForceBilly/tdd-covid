<template>
    <div>
        <button v-if="text" @click="isSelected = !isSelected"> {{ label }} </button>
    </div>
</template>

<script>
export default {
    name: "AppButton",
    props: {
        text: {
            type: String,
        },
        loading: {
            type: Boolean,
        },
        loadingText: {
            type: String,
        }
    },
    data() {
        return {
            isSelected: false
        }
    },
    computed: {
        label() {
            return this.loading ? this.loadingText : this.text; 
        }
    },
}
</script>