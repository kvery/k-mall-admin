<template>
  <q-field
    class='uploader'
    borderless
    accept='.jpg,.png'
    hint='只能上传jpg/png文件，且不超过10MB'
    :model-value='modelValue'
    :rules='rules'>
    <template v-slot:control>
      <q-uploader
        ref='uploader'
        color='teal'
        flat
        bordered
        field-name='file'
        :url='url'
        max-file-size='10485760'
        max-total-size='10485760'
        max-files='1'
        hide-upload-btn
        auto-upload
        @uploaded='uploaded'
        @finish='uploader.reset()'
      >
        <template v-slot:list='scope'>
          <q-img v-if='!!modelValue' height='200px' class='rounded-borders'
                 :src='scope.files[0]?.__img.src || modelValue' />
        </template>
      </q-uploader>
    </template>
  </q-field>
</template>

<script setup lang='ts'>
import { ref, toRefs, watch } from 'vue';
import { QField, QUploader } from 'quasar';

const props = defineProps<{
  modelValue: string,
  rules?: Array<any>
}>();

const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>();

const url = `${process.env.API_BASE_URL ?? ''}/storage/minio/upload`;
const { modelValue } = toRefs(props);
const uploader = ref<QUploader>();
const uploaded = (info: any) => {
  const response = JSON.parse(info.xhr.response);
  emit('update:modelValue', response.data.url);
};
watch(modelValue, (v) => {
  if (!v) {
    uploader.value?.reset();
  }
});
</script>

<style scoped lang='scss'>
.uploader::v-deep {
  .q-field__native {
    padding: 0 !important;
  }
}
</style>
