<template>
  <q-page-x>
    <q-card class='cur-card'>
      <q-form ref='form' greedy @submit='onSubmit' @reset='onReset'>
        <q-card-section>
          <div class='form-item row'>
            <span class='item-label'>品牌名称</span>
            <q-input dense outlined v-model.trim='brand.name'
                     lazy-rules
                     :rules='rules.name' />
          </div>
          <div class='form-item row'>
            <span class='item-label'>品牌首字母</span>
            <q-input dense outlined v-model.trim='brand.firstLetter' />
          </div>
          <div class='form-item row'>
            <span class='item-label'>品牌故事</span>
            <q-input dense outlined autogrow v-model.trim='brand.brandStory' />
          </div>
          <div class='form-item row'>
            <span class='item-label'>品牌LOGO</span>
            <uploader :rules='rules.logo' v-model='brand.logo' />
          </div>
          <div class='form-item row'>
            <span class='item-label'>品牌专区大图</span>
            <uploader v-model='brand.bigPic' />
          </div>
          <div class='form-item row'>
            <span class='item-label'>是否显示</span>
            <div class='q-gutter-sm'>
              <q-radio v-model='brand.showStatus' :val='1' label='是' />
              <q-radio v-model='brand.showStatus' :val='0' label='否' />
            </div>
          </div>
          <div class='form-item row'>
            <span class='item-label'>品牌制造商</span>
            <div class='q-gutter-sm'>
              <q-radio v-model='brand.factoryStatus' :val='1' label='是' />
              <q-radio v-model='brand.factoryStatus' :val='0' label='否' />
            </div>
          </div>
          <div class='form-item row'>
            <span class='item-label'>排序</span>
            <q-input dense outlined type='number' v-model.number='brand.sort'
                     @blur='()=>{if(brand.sort<0)brand.sort=0}' />
          </div>
        </q-card-section>
        <q-card-actions>
          <q-btn-group spread unelevated>
            <q-btn color='primary' label='提交' icon='send' :loading='submitting' @click='form.submit()'>
              <template v-slot:loading>
                <q-spinner-facebook />
              </template>
            </q-btn>
            <q-btn v-if='!isEdit' outline label='重置' type='reset' icon='delete' />
          </q-btn-group>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-page-x>
</template>

<script lang='ts'>
import { defineComponent, onMounted, ref, toRefs } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import Uploader from 'components/upload/Uploader.vue';
import { createBrand, getBrand, updateBrand } from 'src/api/brand';

export default defineComponent({
  name: 'BrandDetail',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  components: { Uploader },
  setup(props) {
    const $q = useQuasar();
    const router = useRouter();
    const route = useRoute();

    const { isEdit } = toRefs(props);

    const id = route.query.id as string;

    const form = ref<any>(null);
    const rules = {
      name: [(val: string) => !!val || '请输入品牌名称'],
      logo: [(val: string) => !!val || '请上传品牌LOGO']
    };

    const defaultBrand = {
      name: '',
      firstLetter: '',
      logo: '',
      bigPic: '',
      showStatus: 0,
      brandStory: '',
      factoryStatus: 0,
      sort: 0
    };

    const brand = ref({ ...defaultBrand });

    const submitting = ref(false);

    const onSubmit = () => {
      submitting.value = true;
      if (isEdit.value) {
        updateBrand(id, brand.value).then(() => {
          $q.notify({
            type: 'positive',
            message: '修改成功'
          });
          router.back();
        }).finally(() => {
          submitting.value = false;
        });
      } else {
        createBrand(brand.value).then(() => {
          $q.notify({
            type: 'positive',
            message: '提交成功'
          });
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          form.value.reset();
        }).finally(() => {
          submitting.value = false;
        });
      }
    };

    const onReset = () => {
      brand.value = { ...defaultBrand };
    };

    onMounted(() => {
      if (isEdit.value) {
        void getBrand(id).then((value: any) => {
          brand.value = { ...value };
        });
      }
    });

    return {
      brand,
      form,
      rules,
      submitting,
      onSubmit,
      onReset
    };
  }
});
</script>

<style scoped lang='scss'>
.cur-card {
  max-width: 800px;
  min-width: 600px;
  margin: auto;

  .q-card__section {
    padding: 36px 36px 16px;
  }

  .q-card__actions {
    padding: 0 36px 36px 36px;
  }

  .form-item {
    margin-bottom: 8px;
  }

  .item-label {
    width: 136px;
    height: 40px;
    line-height: 40px;
    text-align: end;
    margin-right: 12px;
  }

  .q-input, .q-textarea {
    flex: 1;
  }

  .q-select, .q-file {
    width: 240px;
  }

  .q-btn-group {
    width: 100%;
  }
}
</style>
