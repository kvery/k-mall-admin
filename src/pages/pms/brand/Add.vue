<template>
  <brand-detail :is-edit='false'></brand-detail>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';
import BrandDetail from './components/BrandDetail.vue';

export default defineComponent({
  name: 'AddBrand',
  components: { BrandDetail },
  setup() {
    return {};
  }
});
</script>

<style scoped lang='scss'>
</style>

