<template>
  <category-detail :is-edit='false'></category-detail>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';
import CategoryDetail from './components/CategoryDetail.vue';

export default defineComponent({
  name: 'AddCategory',
  components: { CategoryDetail },
  setup() {
    return {};
  }
});
</script>

<style scoped lang='scss'>
</style>
