<template>
  <attr-detail :is-edit='false'></attr-detail>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';
import AttrDetail from './components/AttrDetail.vue';

export default defineComponent({
  name: 'AddAttr',
  components: { AttrDetail },
  setup() {
    return {};
  }
});
</script>

<style scoped lang='scss'>
</style>
