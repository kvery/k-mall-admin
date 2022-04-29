<template>
  <q-item
    :to="link"
    clickable
    exact
    tag="a"
    class="children-item"
    active-class="children-item-active"
  >
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" />
    </q-item-section>
    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'EssentialLink',
  props: {
    title: {
      type: String,
      required: true,
    },

    caption: {
      type: String,
      default: '',
    },

    link: {
      type: String,
      default: '#',
    },

    icon: {
      type: String,
      default: '',
    },
  },
});
</script>
<style lang="scss">
.children-item {
  background-color: #3c3c3c;
}
.children-item-active {
  color: white;
  background-color: var(--q-primary) !important;
}
</style>
