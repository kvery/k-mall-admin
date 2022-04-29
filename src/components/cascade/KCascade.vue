<template>
  <q-select dense outlined clearable emit-value
            :display-value='displayValue'
            :options='filterOptions'
            :loading='loading'
            v-model='value'>
    <template v-slot:option='{ opt }'>
      <q-item clickable>
        <q-item-section>
          <q-item-label v-text='opt.label' />
        </q-item-section>
        <q-item-section side>
          <q-icon name='keyboard_arrow_right' />
        </q-item-section>
        <q-menu anchor='top end' self='top start' auto-close>
          <q-list>
            <q-item
              clickable
              v-for='(n,i) in opt.children'
              :key='i'
              @click='value = n.value'
            >
              <q-item-section>
                <q-item-label v-text='n.label' />
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-item>
    </template>
  </q-select>
</template>

<script setup lang='ts'>
import { computed, toRefs } from 'vue';

export declare interface KCascadeOptions {
  label: string,
  value: any,
  children?: KCascadeOptions[];
}

export declare interface KCascadeProps {
  modelValue: number | string | any[] | null | undefined,
  options: KCascadeOptions[],
  loading: boolean,
  filter: any[]
}

const props = defineProps<KCascadeProps>();

const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>();

const { modelValue, options, loading, filter } = toRefs(props);

const value = computed({
  get: () => modelValue.value,
  set: (val: any) => {
    emit('update:modelValue', val as string);
  }
});

const filterOptions = computed(() => {
  if (!!filter.value) {
    options.value.map((child) => {
      child.children = child.children?.filter((v) =>
        v.value !== modelValue.value
      );
    });
  }
  return options.value;
});

const displayValue = computed(() => {
  for (let e of filterOptions.value) {
    let find = e.children?.find((v: any) => v.value === props.modelValue);
    if (!!find) {
      return `${e.label} / ${find.label}`;
    }
  }
  return '';
});
</script>

<style scoped lang='scss'>

</style>
