<template>
  <q-page padding class='page bg-grey-4' :style-fn='tweak'>
    <slot />
  </q-page>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'QPageX',
  setup() {
    return {
      tweak(offset: number) {
        return { height: offset ? `calc(100vh - ${offset}px)` : '100vh' };
      }
    };
  }
});
</script>

<style scoped>
.page {
  overflow: auto;
}
</style>
