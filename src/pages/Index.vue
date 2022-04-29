<template>
  <q-page-x padding class='bg-grey-4'>
    <q-card class='q-layout-padding'>
      <div class='row q-col-gutter-xs'>
        <div class='col-6'>
          <q-img
            src='https://www.dmoe.cc/random.php'
            spinner-color='white'
            img-class='my-custom-image'
            class='rounded-borders'
          />
        </div>
        <div class='col-6'>
          <q-img
            src='https://www.dmoe.cc/random.php'
            spinner-color='white'
            img-class='my-custom-image'
            class='rounded-borders'
          />
        </div>
        <div class='col-6'>
          <q-img
            src='https://www.dmoe.cc/random.php'
            spinner-color='white'
            img-class='my-custom-image'
            class='rounded-borders'
          />
        </div>
        <div class='col-6'>
          <q-img
            src='https://www.dmoe.cc/random.php'
            spinner-color='white'
            img-class='my-custom-image'
            class='rounded-borders'
          />
        </div>
      </div>
    </q-card>
  </q-page-x>
</template>

<script lang='ts'>
import { Meta, Todo } from 'components/models';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'PageIndex',
  setup() {
    const todos = ref<Todo[]>([
      {
        id: 1,
        content: 'ct1'
      },
      {
        id: 2,
        content: 'ct2'
      },
      {
        id: 3,
        content: 'ct3'
      },
      {
        id: 4,
        content: 'ct4'
      },
      {
        id: 5,
        content: 'ct5'
      }
    ]);
    const meta = ref<Meta>({
      totalCount: 1200
    });
    return { todos, meta };
  }
});
</script>
<style>
.q-page-x * {
  transition: all 200ms;
}
</style>
