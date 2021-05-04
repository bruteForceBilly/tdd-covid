<template>
  <div>
    <SubmitButton @click.prevent="formSubmitHandler"/>
  </div>
</template>
<script>
import SubmitButton from "@/components/SubmitButton.vue";

export default {
  components: {
    SubmitButton,
  },
  methods: {
    formSubmitHandler() {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() >= 0.5) {
            resolve();
          } else {
            reject(new Error("Oops"));
          }
        }, 1500);
      });
    },
  }
};
</script>

