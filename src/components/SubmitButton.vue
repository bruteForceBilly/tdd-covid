<template>
  <div>
    <AppButton content="submit" type="submit" v-on:submit="submitHandler" />
  </div>
</template>
<script>
import AppButton from "@/components/App/AppButton.vue";

// Idle / Working - Pending / Sucsess - Fulfilled / Rejected - Error
// Disabled
// Hover
// Focused
// Active / Pressed

export default {
  components: {
    AppButton,
  },
  data: () => ({
    isLoading: false,
    hasError: false,
    isSuccess: false,
  }),
  computed: {
    listeners() {
      return {
        ...this.$listeners,
        submit: this.handleSubmit,
      };
    },
  },
  methods: {
    async submitHandler() {
      try {
        this.isLoading = true;
        // eslint-disable-next-line
        await this.$listeners.click(e);
        this.resetDelayeatrd("isSuccess");
      } catch (error) {
        this.resetDelayed("hasError");
      } finally {
        this.isLoading = true;
      }
    },
  },
};
</script>
