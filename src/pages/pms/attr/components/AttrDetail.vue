<template>
  <q-page-x>
    <q-card class='cur-card'>
      <q-form ref='form' greedy @submit='onSubmit' @reset='onReset'>
        <q-card-section>
          <div class='form-item row'>
            <span class='item-label'>属性名称</span>
            <q-input dense outlined v-model.trim='attr.name'
                     lazy-rules
                     :rules='rules.name' />
          </div>
          <div class='form-item row'>
            <span class='item-label'>商品类型</span>
            <q-select dense outlined emit-value :label-slot='false'
                      :display-value='categoryDisplay()'
                      v-model='attr.productAttributeCategoryId'
                      :options='categoryOptions'
                      :loading='categoryLoading'
                      @virtual-scroll='onCategoryScroll' />
          </div>
          <div class='form-item row'>
            <span class='item-label'>分类筛选样式</span>
            <div class='q-gutter-sm'>
              <q-radio v-model='attr.filterType' :val='0' label='普通' />
              <q-radio v-model='attr.filterType' :val='1' label='颜色' />
            </div>
          </div>
          <div class='form-item row'>
            <span class='item-label'>分类检索类型</span>
            <div class='q-gutter-sm'>
              <q-radio v-model='attr.searchType' :val='0' label='不需要进行检索' />
              <q-radio v-model='attr.searchType' :val='1' label='关键字检索' />
              <q-radio v-model='attr.searchType' :val='2' label='范围检索' />
            </div>
          </div>
          <div class='form-item row'>
            <span class='item-label'>商品属性关联</span>
            <div class='q-gutter-sm'>
              <q-radio v-model='attr.relatedStatus' :val='1' label='是' />
              <q-radio v-model='attr.relatedStatus' :val='0' label='否' />
            </div>
          </div>
          <div class='form-item row'>
            <span class='item-label'>属性选择类型</span>
            <div class='q-gutter-sm'>
              <q-radio v-model='attr.selectType' :val='0' label='唯一' />
              <q-radio v-model='attr.selectType' :val='1' label='单选' />
              <q-radio v-model='attr.selectType' :val='2' label='复选' />
            </div>
          </div>
          <div class='form-item row'>
            <span class='item-label'>属性录入方式</span>
            <div class='q-gutter-sm'>
              <q-radio v-model='attr.inputType' :val='0' label='手工录入' />
              <q-radio v-model='attr.inputType' :val='1' label='从下方列表中选择' />
            </div>
          </div>
          <div class='form-item row'>
            <span class='item-label'>属性值可选值列表</span>
            <div class='column' style='flex: 1'>
              <q-input dense outlined model-value=''
                       @keyup.enter='pushToInputList' />
              <div style='flex: 1'>
                <q-chip square dense removable
                        v-for='(v,i) in inputListT'
                        :key='i'
                        @remove='deleteFromInputList(i);'
                        :label='v' />
              </div>
            </div>
          </div>
          <div class='form-item row'>
            <span class='item-label'>是否支持手动新增</span>
            <div class='q-gutter-sm'>
              <q-radio v-model='attr.handAddStatus' :val='1' label='是' />
              <q-radio v-model='attr.handAddStatus' :val='0' label='否' />
            </div>
          </div>
          <div class='form-item row'>
            <span class='item-label'>排序</span>
            <q-input dense outlined type='number' v-model.number='attr.sort' @blur='()=>{if(attr.sort<0)attr.sort=0}' />
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
import { fetchList } from 'src/api/productAttrCate';
import { createProductAttr, getProductAttr, updateProductAttr } from 'src/api/productAttr';

export default defineComponent({
  name: 'AttrDetail',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const $q = useQuasar();
    const router = useRouter();
    const route = useRoute();

    const { isEdit } = toRefs(props);

    const id = route.query.id as string;

    const form = ref<any>(null);
    const rules = {
      name: [(val: string) => !!val || '请输入属性名称']
    };

    const defaultAttr = {
      name: '',
      productAttributeCategoryId: parseInt(route.query.cid as string),
      filterType: 0,
      searchType: 0,
      selectType: 0,
      relatedStatus: 0,
      inputType: 0,
      inputList: '',
      handAddStatus: 0,
      sort: 0,
      type: route.query.type
    };

    const inputListT = ref<Array<string>>([]);

    const attr = ref({ ...defaultAttr });

    const categoryOptions = ref<Array<any>>([]);
    const categoryLoading = ref(false);
    let categoryPageNum = 1;
    let categoryTotalPage = 1;
    const categoryPageSize = 50;
    const categoryDisplay = () => {
      return categoryOptions.value.find((value: any) =>
        value.value === attr.value.productAttributeCategoryId)?.label || '';
    };

    const onCategoryScroll = () => {
      if (categoryPageNum > categoryTotalPage) {
        return;
      }
      categoryLoading.value = true;
      void fetchList({
        pageSize: categoryPageSize,
        pageNum: categoryPageNum
      }).then((value: { list: Array<any>, totalPage: number }) => {
        categoryTotalPage = value.totalPage;
        categoryPageNum++;
        categoryOptions.value.push(...value.list.map((v: any) => {
          return { label: v.name, value: v.id };
        }));
      }).finally(() => {
        categoryLoading.value = false;
      });
    };

    const pushToInputList = (event: Event) => {
      const target = event.target as HTMLInputElement;
      const val = target.value.trim();
      if (!!val && inputListT.value.indexOf(target.value) === -1) {
        inputListT.value.push(target.value);
      }
      target.value = '';
    };
    const deleteFromInputList = (i: number) => {
      inputListT.value.splice(i, 1);
    };

    const submitting = ref(false);

    const onSubmit = () => {
      submitting.value = true;
      attr.value.inputList = inputListT.value.join(',');
      if (isEdit.value) {
        updateProductAttr(id, attr.value).then(() => {
          $q.notify({
            type: 'positive',
            message: '修改成功'
          });
          router.back();
        }).finally(() => {
          submitting.value = false;
        });
      } else {
        createProductAttr(attr.value).then(() => {
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
      attr.value = { ...defaultAttr };
      inputListT.value = [];
    };

    onMounted(() => {
      if (isEdit.value) {
        void getProductAttr(id).then((value: any) => {
          attr.value = { ...value };
          inputListT.value = attr.value.inputList.split(',')
            .map(s => s.trim())
            .filter(s => !!s);
        });
      }
      onCategoryScroll();
    });

    return {
      attr,
      form,
      rules,
      inputListT,
      submitting,
      categoryOptions,
      categoryLoading,
      categoryDisplay,
      onCategoryScroll,
      pushToInputList,
      deleteFromInputList,
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
