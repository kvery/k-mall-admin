<template>
  <q-form ref='form' greedy @submit.prevent='submit()'>
    <div class='form-item row'>
      <span class='item-label'>商品品牌</span>
      <q-select style='width: 220px;' dense outlined emit-value
                v-model='value.productAttributeCategoryId'
                :display-value='sProductAttrCate.display'
                :options='sProductAttrCate.options'
                :loading='sProductAttrCate.loading'
                @virtual-scroll='sProductAttrCate.getList'
                :rules='rules.productAttrCate'
                @update:model-value='handleProductAttrChange' />
    </div>
    <div class='form-item row'>
      <span class='item-label'>商品规格</span>
      <div class='col'>
        <q-card class='full-width bg-blue-1 q-pa-sm' style='min-height: 40px' bordered flat>
          <div class='q-gutter-y-sm' v-show='selectProductAttr.length>0'>
            <template v-for='(productAttr,idx) in selectProductAttr' :key='idx'>
              <q-card bordered class='q-pa-sm shadow-1' v-if='productAttr.handAddStatus===0'>
                <span>{{ productAttr.name }}</span>
                <q-option-group
                  inline type='checkbox'
                  :options='productAttr.inputList'
                  v-model='productAttr.values' />
              </q-card>
              <q-card bordered class='q-pa-sm shadow-1' v-else>
                <span>{{ productAttr.name }}</span>
                <q-option-group
                  inline type='checkbox'
                  :options='productAttr.options'
                  v-model='productAttr.values'>
                  <template v-slot:label='opt'>
                    <div class='row items-center'>
                      <span>{{ opt.label }}</span>
                      <q-btn class='q-ml-xs' round flat size='sm' icon='cancel'
                             @click.stop='handleRemoveProductAttrValue(productAttr,opt.value)' />
                    </div>
                  </template>
                </q-option-group>
                <q-input dense outlined clearable v-model.trim='addProductAttrValue'>
                  <template v-slot:after>
                    <q-btn unelevated color='primary' label='新增' @click='handleAddProductAttrValue(productAttr)' />
                  </template>
                </q-input>
              </q-card>
            </template>
          </div>
        </q-card>
        <q-card class='q-mt-sm' bordered flat>
          <q-table style='max-height: 400px' flat separator='cell' hide-pagination no-data-label='暂无数据'
                   :rows-per-page-options='[1000]'
                   :columns='productAttrColumns'
                   :rows='productAttrRows'>
            <template v-slot:no-data='{  message }'>
              <div class='full-width row flex-center' style='font-size: 16px;'>
                <span class='text-grey-8'>{{ message }}</span>
              </div>
            </template>
            <template v-slot:body-cell-price='props'>
              <q-td :props='props'>
                <q-input dense outlined type='number' v-model.number='props.row.price'
                         @blur='props.row.price=numberBlur(props.row.price)' />
              </q-td>
            </template>
            <template v-slot:body-cell-stock='props'>
              <q-td :props='props'>
                <q-input dense outlined type='number' v-model.number='props.row.stock'
                         @blur='props.row.stock=numberBlur(props.row.stock)' />
              </q-td>
            </template>
            <template v-slot:body-cell-lowStock='props'>
              <q-td :props='props'>
                <q-input dense outlined type='number' v-model.number='props.row.lowStock'
                         @blur='props.row.lowStock=numberBlur(props.row.lowStock)' />
              </q-td>
            </template>
            <template v-slot:body-cell-skuCode='props'>
              <q-td :props='props'>
                <q-input dense outlined type='number' v-model.number='props.row.skuCode'
                         @blur='props.row.skuCode=numberBlur(props.row.skuCode)' />
              </q-td>
            </template>
            <template v-slot:body-cell-operation='props'>
              <q-td :props='props' style='padding-left: 8px;padding-right: 8px'>
                <q-btn flat dense size='md' text-color='negative' label='删除'
                       @click='handleRemoveProductSku(props.pageIndex)' />
              </q-td>
            </template>
          </q-table>
          <q-separator />
          <q-btn-group>
            <q-btn color='primary' label='刷新列表' @click='handleRefreshProductSkuList()' />
            <q-btn label='同步价格' @click='handleSyncProductSkuPrice()' />
            <q-btn label='同步库存' @click='handleSyncProductSkuStock()' />
          </q-btn-group>
        </q-card>
      </div>
    </div>
    <div class='form-item row'>
      <span class='item-label'>商品参数</span>
      <q-card class='col bg-blue-1 q-pa-sm' style='min-height: 40px' bordered flat>
        <div class='q-gutter-y-sm' v-show='selectProductParam.length>0'>
          <div class='row' v-for='(productParam,idx) in selectProductParam' :key='idx'>
            <span class='q-mr-sm'
                  style='text-align: end;line-height: 40px;height: 40px;width: 80px;'>{{ productParam.name }}</span>
            <q-input v-if='productParam.inputType===0' dense outlined v-model='productParam.value' />
            <q-select v-else dense outlined emit-value v-model='productParam.value' :options='productParam.inputList' />
          </div>
        </div>
      </q-card>
    </div>
    <div class='form-item row'>
      <span class='item-label'>商品相册</span>
      <uploader v-model='value.albumPics' />
    </div>
    <div class='form-item row'>
      <span class='item-label'>规格参数</span>
      <q-card class='col'>
        <q-tabs
          v-model='activeHtmlType'
          dense
          class='text-grey'
          active-color='primary'
          indicator-color='primary'
          align='justify'
        >
          <q-tab name='pc' label='电脑端详情' />
          <q-tab name='mobile' label='移动端详情' />
        </q-tabs>
        <q-separator />
        <q-tab-panels keep-alive :keep-alive-include='["pc","mobile"]' v-model='activeHtmlType' class=''>
          <q-tab-panel name='pc' class='q-pa-none'>
            <tinymce class='col' v-model='value.detailHtml' />
          </q-tab-panel>
          <q-tab-panel name='mobile' class='q-pa-none'>
            <tinymce class='col' v-model='value.detailMobileHtml' />
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
    <q-btn-group class='q-mt-md' spread unelevated>
      <q-btn outline label='上一步 填写商品促销' @click='prev()' />
      <q-btn color='primary' type='submit' label='下一步 选择商品关联' />
    </q-btn-group>
  </q-form>
</template>

<script lang='ts'>
import { computed, defineComponent, ref } from 'vue';
import { date, QForm } from 'quasar';
import { fetchList as fetchProductAttrCateList } from 'src/api/productAttrCate';
import { fetchList as fetchProductAttrList } from 'src/api/productAttr';
import Tinymce from 'components/tinymce/Tinymce.vue';
import Uploader from 'components/upload/Uploader.vue';

export default defineComponent({
  name: 'ProductAttrDetail',
  components: { Uploader, Tinymce },
  props: {
    modelValue: Object
  },
  emits: ['next', 'prev'],
  setup(props, context) {
    const value = computed(() => props.modelValue);

    const form = ref<QForm>();
    const rules = {
      productAttrCate: [(val: number) => val ?? '请选择属性分类']
    };

    const numberBlur = (v: number) => {
      if (v < 0) {
        return 0;
      }
      return v;
    };

    const sProductAttrCate = (() => {
      const loading = ref(false);
      let totalPage = 1;
      let pageNum = 1;
      const pageSize = 50;
      const options = ref<Array<any>>([]);
      const display = computed(() => {
        return options.value.find(e => e.value == value.value?.productAttributeCategoryId)?.label || '';
      });
      const getList = () => {
        if (pageNum > totalPage) {
          return;
        }
        loading.value = true;
        fetchProductAttrCateList({
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
      return ref({ loading, options, display, getList });
    })();

    const selectProductAttr = ref<Array<any>>([]);
    const selectProductParam = ref<Array<any>>([]);
    const addProductAttrValue = ref('');

    const getProductAttrList = (type: number, cid: string) => {
      void fetchProductAttrList(cid, { type, pageSize: 100, pageNum: 1 }).then((value: any) => {
        if (type === 0) {
          let options = <any>[];
          let values = <any>[];
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          selectProductAttr.value = value.list.map((e: any) => {
            return {
              id: e.id,
              name: e.name,
              handAddStatus: e.handAddStatus,
              // eslint-disable-next-line @typescript-eslint/no-unsafe-call
              inputList: e.inputList.split(',').map((e: any) => {
                return { label: e, value: e };
              }),
              values,
              options
            };
          });
        } else {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          selectProductParam.value = value.list.map((e: any) => {
            return {
              id: e.id,
              name: e.name,
              inputType: e.inputType,
              // eslint-disable-next-line @typescript-eslint/no-unsafe-call
              inputList: e.inputList.split(',').map((e: any) => {
                return { label: e, value: e };
              }),
              value: null
            };
          });
        }
      });
    };

    const handleProductAttrChange = (value: string) => {
      getProductAttrList(0, value);
      getProductAttrList(1, value);
    };

    const handleRemoveProductAttrValue = (attr: any, value: string) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const index = attr.options.findIndex((e: any) => e.value === value);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      attr.options.splice(index, 1);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const findIndex = attr.values.findIndex((e: string) => e === value);
      if (findIndex !== -1) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        attr.values.splice(findIndex, 1);
      }
    };

    const handleAddProductAttrValue = (attr: any) => {
      const s = addProductAttrValue.value;
      if (!s) {
        return;
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      if (attr.options.findIndex((e: any) => e.value === s) === -1) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        attr.options.push({ label: s, value: s });
        addProductAttrValue.value = '';
      }
    };

    const defaultProductAttrColumns = [
      { name: 'price', align: 'center', label: '销售价格', field: 'price', style: 'min-width: 100px;' },
      { name: 'stock', align: 'center', label: '商品库存', field: 'stock', style: 'min-width: 100px;' },
      { name: 'lowStock', align: 'center', label: '库存预警值', field: 'lowStock', style: 'min-width: 100px;' },
      { name: 'skuCode', align: 'center', label: 'SKU编号', field: 'skuCode', style: 'min-width: 100px;' },
      { name: 'operation', align: 'center', label: '操作', field: 'operation', style: 'width: 60px;' }
    ];

    const productAttrColumns = computed(() => {
      const columns = selectProductAttr.value.map((e: any) => {
        return {
          name: e.name, align: 'center', label: e.name, field: e.name, style: 'min-width: 60px;'
        };
      });
      return [...columns, ...defaultProductAttrColumns];
    });

    const productAttrRows = ref<Array<any>>([]);

    const handleRemoveProductSku = (index: number) => {
      productAttrRows.value.splice(index, 1);
    };

    const handleRefreshProductSkuList = () => {
      const attrs = selectProductAttr.value;

      let lists = d(attrs, attrs.length, undefined);
      const rows = [];
      for (const list of lists) {
        let obj = {} as any;
        (list as Array<any>).forEach(item => {
          obj[item.key] = item.value;
        });
        rows.push(obj);
      }
      productAttrRows.value = rows;
    };

    const d = (attrs: Array<any>, num: number, map: Array<any> | undefined): Array<any> => {
      if (num === 0) {
        return [map as Array<any>];
      }
      if (!map) {
        map = [];
      }
      const maps: Array<any> = [];
      const attr = attrs[attrs.length - num];
      for (const value of attr.values) {
        console.log(`${num}`);
        console.log(map);
        const tMap = [...map];
        tMap.push({ key: attr.name, value: value });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        maps.push(...d(attrs, num - 1, tMap));
        console.log(`${num}:`);
        console.log(maps);
      }
      return maps;
    };

    const handleSyncProductSkuPrice = () => {
      const price = productAttrRows.value[0].price;
      productAttrRows.value.forEach(e => {
        e.price = price;
      });
    };

    const handleSyncProductSkuStock = () => {
      const stock = productAttrRows.value[0].stock;
      productAttrRows.value.forEach(e => {
        e.stock = stock;
      });
    };

    const activeHtmlType = ref('pc');

    sProductAttrCate.value.getList();
    handleProductAttrChange('2');

    const prev = () => {
      context.emit('prev');
    };

    const submit = () => {
      context.emit('next');
    };

    return {
      date,
      value,
      form,
      rules,
      submit,
      prev,
      numberBlur,
      sProductAttrCate,
      handleProductAttrChange,
      selectProductAttr,
      selectProductParam,
      addProductAttrValue,
      handleRemoveProductAttrValue,
      handleAddProductAttrValue,
      productAttrColumns,
      productAttrRows,
      handleRemoveProductSku,
      handleRefreshProductSkuList,
      handleSyncProductSkuPrice,
      handleSyncProductSkuStock,
      activeHtmlType
    };
  }
});
</script>

<style scoped lang='scss'>
.form-item {
  margin-bottom: 8px;
}

.item-label {
  width: 80px;
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
</style>
