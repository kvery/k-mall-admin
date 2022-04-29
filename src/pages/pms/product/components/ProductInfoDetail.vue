<template>
  <q-form ref='form' greedy @submit.prevent='submit()'>
    <div class='form-item row'>
      <span class='item-label'>商品名称</span>
      <q-input dense outlined v-model.trim='value.name'
               lazy-rules
               :rules='rules.name' />
    </div>
    <div class='form-item row'>
      <span class='item-label'>副标题</span>
      <q-input dense outlined v-model.trim='value.subTitle'
               lazy-rules
               :rules='rules.subTitle' />
    </div>
    <div class='form-item row'>
      <span class='item-label'>商品分类</span>
      <k-cascade style='width: 220px;' :loading='sProductCategory.loading'
                 v-model='value.productCategoryId'
                 :options='sProductCategory.options'
                 :rules='rules.productCategory' />
    </div>
    <div class='form-item row'>
      <span class='item-label'>商品品牌</span>
      <q-select style='width: 220px;' dense outlined emit-value
                v-model='value.brandId'
                :display-value='sBrand.display'
                :options='sBrand.options'
                :loading='sBrand.loading'
                @virtual-scroll='sBrand.getList'
                :rules='rules.brand' />
    </div>
    <div class='form-item row'>
      <span class='item-label'>商品介绍</span>
      <q-input dense outlined autogrow v-model.trim='value.description' />
    </div>
    <div class='form-item row'>
      <span class='item-label'>商品货号</span>
      <q-input dense outlined v-model.trim='value.productSn' />
    </div>
    <div class='form-item row'>
      <span class='item-label'>商品售价</span>
      <q-input dense outlined type='number' v-model.number='value.price'
               @blur='value.price=numberBlur(value.price)' />
    </div>
    <div class='form-item row'>
      <span class='item-label'>市场价</span>
      <q-input dense outlined type='number' v-model.number='value.originalPrice'
               @blur='value.originalPrice=numberBlur(value.originalPrice)' />
    </div>
    <div class='form-item row'>
      <span class='item-label'>商品库存</span>
      <q-input dense outlined type='number' v-model.number='value.stock'
               @blur='value.stock=numberBlur(value.stock)' />
    </div>
    <div class='form-item row'>
      <span class='item-label'>计量单位</span>
      <q-input dense outlined v-model.trim='value.unit' />
    </div>
    <div class='form-item row'>
      <span class='item-label'>商品重量</span>
      <q-input dense outlined type='number' v-model.number='value.weight' suffix='克'
               @blur='value.weight=numberBlur(value.weight)' />
    </div>
    <div class='form-item row'>
      <span class='item-label'>排序</span>
      <q-input dense outlined type='number' v-model.number='value.sort'
               @blur='value.sort=numberBlur(value.sort)' />
    </div>
    <q-btn class='full-width q-mt-md' unelevated color='primary' type='submit' label='下一步 填写商品促销' />
  </q-form>
</template>

<script lang='ts'>
import { computed, defineComponent, onMounted, ref } from 'vue';
import { QForm } from 'quasar';
import KCascade from 'components/cascade/KCascade.vue';
import { fetchList as fetchBrandList } from 'src/api/brand';
import { fetchListWithChildren } from 'src/api/category';

export default defineComponent({
  name: 'ProductInfoDetail',
  components: { KCascade },
  props: {
    modelValue: Object
  },
  emits: ['next'],
  setup(props, context) {
    const value = computed(() => props.modelValue);

    const form = ref<QForm>();
    const rules = {
      name: [(val: string) => !!val || '请输入商品名称'],
      subTitle: [(val: string) => !!val || '请输入商品副标题'],
      productCategory: [(val: number) => val ?? '请选择商品类型'],
      brand: [(val: number) => val ?? '请选择商品品牌']
    };

    const sBrand = (() => {
      const loading = ref(false);
      let totalPage = 1;
      let pageNum = 1;
      const pageSize = 50;
      const options = ref<Array<any>>([]);
      const display = computed(() => {
        return options.value.find(e => e.value == value.value?.brandId)?.label || '';
      });
      const getList = () => {
        if (pageNum > totalPage) {
          return;
        }
        loading.value = true;
        fetchBrandList({
          pageSize,
          pageNum
        }).then((value: { list: Array<any>, totalPage: number }) => {
          totalPage = value.totalPage;
          pageNum++;
          options.value.push(...value.list.map((v: any) => {
            return { label: v.name, value: v.id };
          }));
        }).finally(() => {
          loading.value = false;
        });
      };
      return { loading, options, display, getList };
    })();

    const sProductCategory = (() => {
      const loading = ref(false);
      const options = ref<Array<any>>([]);
      const getList = () => {
        loading.value = true;
        fetchListWithChildren().then((value: Array<any>) => {
          options.value = value.map((v: any) => {
            return {
              label: v.name, value: v.id,
              // eslint-disable-next-line @typescript-eslint/no-unsafe-call
              children: v.children.map((v1: { name: any; id: any; }) => {
                return { label: v1.name, value: v1.id };
              })
            };
          });
        }).finally(() => {
          loading.value = false;
        });
      };
      return { loading, options, getList };
    })();

    const numberBlur = (v: number) => {
      if (v < 0) {
        return 0;
      }
      return v;
    };

    const submit = () => {
      context.emit('next');
    };

    onMounted(() => {
      sProductCategory.getList();
      sBrand.getList();
    });

    return {
      value,
      form,
      rules,
      submit,
      numberBlur,
      sProductCategory: ref(sProductCategory),
      sBrand: ref(sBrand)
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
