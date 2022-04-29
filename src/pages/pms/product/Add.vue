<template>
  <product-detail :is-edit='false'></product-detail>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';
import ProductDetail from './components/ProductDetail.vue';

export default defineComponent({
  name: 'AddProduct',
  components: { ProductDetail },
  setup() {
    return {};
  }
});
</script>

<style scoped lang='scss'>
</style>



