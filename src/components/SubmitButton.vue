<template>
  <div>
    <AppButton :content="content" type="submit">
      <AppIcon v-if="isLoading">
        <AppIconLoading :isAnimating="isLoading" />
      </AppIcon>
    </AppButton>
  </div>
</template>
<script>
import AppButton from "@/components/App/AppButton.vue";
import AppIcon from "@/components/App/AppIcon.vue";
import AppIconLoading from "@/components/App/AppIconLoading.vue";

export default {
  inheritAttrs: false,
  components: {
    AppButton,
    AppIcon,
    AppIconLoading,
  },
  props: {
    content: {
      type: String,
      default: "Submit",
    },
    time: {
      type: Number,
      default: 2000,
    },
    loading: {
      type: Boolean,
      default: false,
    },
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
        click: this.handleClick,
      };
    },
    computedClasses() {
      return {
        "is-danger": this.hasError,
        "is-success": this.isSuccess,
        "is-loading": this.loadingState,
      };
    },
    loadingState() {
      return this.loading || this.isLoading;
    },
  },
  methods: {
    async handleClick() {
      try {
        this.isLoading = true;
        // eslint-disable-next-line
        await this.$listeners.click(e);
        this.resetDelayed("isSuccess");
      } catch (error) {
        this.resetDelayed("hasError");
      } finally {
        this.isLoading = true;
      }
    },
    resetDelayed(property) {
      // eslint-disable-next-line
      if (this.$options.propsData.hasOwnProperty("loading")) {
        return;
      }
      this[property] = true;
      setTimeout(() => {
        this[property] = false;
      }, this.time);
    },
  },
  mounted() {
    console.log("listeners", this.listeners);
  },
};
</script>
