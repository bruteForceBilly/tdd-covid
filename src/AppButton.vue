<template>
    <div>
        <button> {{ text }} </button>
    </div>
</template>

<script>
export default {
    name: "AppButton",
    props: {
        text: {
            type: String
        },
    },
}
</script>