<template>
  <div v-if="content">
    <button :type="type" :name="name" :value="value">
      {{ content }}
      <slot></slot>
    </button>
  </div>
</template>

<script>
export default {
  name: "AppButton",
  props: {
    content: {
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
        return ["submit", "reset", "button"].indexOf(value) !== -1;
      },
    },
  },
};
</script>
