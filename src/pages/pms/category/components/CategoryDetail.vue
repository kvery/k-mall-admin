<template>
  <q-page-x>
    <q-card class='cur-card'>
      <q-form ref='form' greedy @submit='onSubmit' @reset='onReset'>
        <q-card-section>
          <div class='form-item row'>
            <span class='item-label'>分类名称</span>
            <q-input dense outlined v-model.trim='category.name'
                     lazy-rules
                     :rules='rules.name' />
          </div>
          <div class='form-item row'>
            <span class='item-label'>上级分类</span>
            <q-select dense outlined emit-value :label-slot='false'
                      :display-value='categoryDisplay()'
                      v-model='category.parentId'
                      :options='categoryOptions'
                      :loading='categoryLoading'
                      @virtual-scroll='onCategoryScroll' />
          </div>
          <div class='form-item row'>
            <span class='item-label'>数量单位</span>
            <q-input dense outlined v-model.trim='category.productUnit' />
          </div>
          <div class='form-item row'>
            <span class='item-label'>是否显示</span>
            <div class='q-gutter-sm'>
              <q-radio v-model='category.showStatus' :val='1' label='是' />
              <q-radio v-model='category.showStatus' :val='0' label='否' />
            </div>
          </div>
          <div class='form-item row'>
            <span class='item-label'>是否显示在导航栏</span>
            <div class='q-gutter-sm'>
              <q-radio v-model='category.navStatus' :val='1' label='是' />
              <q-radio v-model='category.navStatus' :val='0' label='否' />
            </div>
          </div>
          <div class='form-item row'>
            <span class='item-label'>分类图标</span>
            <uploader :rules='rules.logo' v-model='category.icon' />
          </div>
          <div class='form-item row'>
            <span class='item-label'>筛选属性</span>
            <div class='column q-gutter-y-xs'>
              <div class='row q-gutter-x-xs' v-for='(item,i) in filterAttributeList' :key='i'>
                <q-select dense outlined clearable emit-value :label-slot='false'
                          :display-value='filterAttrDisplay(i)'
                          v-model='filterAttributeList[i]'
                          :options='filterAttrOptions'
                          :loading='filterLoading'>
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
                            v-for='n in (opt.children.filter(v=>filterAttributeList.indexOf(v.value)===-1))'
                            :key='n'
                            @click='filterAttributeList[i] = n.value'
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
                <q-btn v-show='filterAttributeList.length>1' outline label='删除' @click='removeFilterAttr(i)' />
              </div>
              <q-btn v-show='()=>filterAttributeList.length<3' color='primary' unelevated label='新增'
                     @click='addFilterAttr()' />
            </div>
          </div>
          <div class='form-item row'>
            <span class='item-label'>关键字</span>
            <q-input dense outlined v-model.trim='category.keywords' />
          </div>
          <div class='form-item row'>
            <span class='item-label'>分类描述</span>
            <q-input dense outlined autogrow v-model.trim='category.description' />
          </div>
          <div class='form-item row'>
            <span class='item-label'>排序</span>
            <q-input dense outlined type='number' v-model.number='category.sort'
                     @blur='()=>{if(category.sort<0)category.sort=0}' />
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
import { QForm, useQuasar } from 'quasar';
import Uploader from 'components/upload/Uploader.vue';
import { fetchListWithAttr } from 'src/api/productAttrCate';
import { getProductAttrInfo } from 'src/api/productAttr';
import { createCategory, fetchList, getCategory, updateCategory } from 'src/api/category';

export default defineComponent({
  name: 'CategoryDetail.vue',
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

    const form = ref<QForm>();
    const rules = {
      name: [(val: string) => !!val || '请输入分类名称'],
      icon: [(val: string) => !!val || '请上传分类图标']
    };

    const defaultCategory = {
      name: '',
      parentId: 0,
      description: '',
      icon: '',
      keywords: '',
      navStatus: 0,
      productUnit: '',
      showStatus: 0,
      sort: 0,
      productAttributeIdList: Array<string>()
    };

    const category = ref({ ...defaultCategory });

    const categoryOptions = ref<Array<any>>([]);
    const categoryLoading = ref(false);
    let categoryPageNum = 1;
    let categoryTotalPage = 1;
    const categoryPageSize = 50;
    const categoryDisplay = () => {
      return categoryOptions.value.find((value: any) =>
        value.value === category.value.parentId)?.label || '';
    };
    const onCategoryScroll = () => {
      if (categoryPageNum > categoryTotalPage) {
        return;
      }
      categoryLoading.value = true;
      void fetchList(0, {
        pageSize: categoryPageSize,
        pageNum: categoryPageNum
      }).then((value: { list: Array<any>, totalPage: number }) => {
        if (categoryOptions.value.length == 0) {
          categoryOptions.value.push({ label: '无上级分类', value: 0 });
        }
        categoryTotalPage = value.totalPage;
        categoryPageNum++;
        categoryOptions.value.push(...value.list.map((v: any) => {
          return { label: v.name, value: v.id };
        }));
      }).finally(() => {
        categoryLoading.value = false;
      });
    };

    const filterAttrOptions = ref<Array<{ label: string, value: number, children: Array<{ label: string, value: number }> }>>([]);
    const filterAttributeList = ref<Array<any>>([null]);
    const filterLoading = ref(false);

    const filterAttrDisplay = (index: number) => {
      for (let valueElement of filterAttrOptions.value) {
        let find = valueElement.children.find((value: any) =>
          value.value === filterAttributeList.value[index]);
        if (!!find) {
          return `${valueElement.label} / ${find.label}`;
        }
      }
      return '请选择';
    };

    const getProductAttrCateList = () => {
      filterLoading.value = true;
      void fetchListWithAttr().then((value: Array<any>) => {
        filterAttrOptions.value = value.map((v: any) => {
          return {
            label: v.name, value: v.id,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            children: v.productAttributeList.map((v1: { name: any; id: any; }) => {
              return {
                label: v1.name, value: v1.id
              };
            })
          };
        });
      }).finally(() => {
        filterLoading.value = false;
      });
    };

    const removeFilterAttr = (index: number) => {
      if (filterAttributeList.value.length <= 1) {
        return;
      }
      filterAttributeList.value.splice(index, 1);
    };

    const addFilterAttr = () => {
      filterAttributeList.value.push(null);
    };

    const submitting = ref(false);

    const onSubmit = () => {
      submitting.value = true;
      category.value.productAttributeIdList = filterAttributeList.value.filter(v => !!v);
      if (isEdit.value) {
        updateCategory(id, category.value).then(() => {
          $q.notify({
            type: 'positive',
            message: '修改成功'
          });
          router.back();
        }).finally(() => {
          submitting.value = false;
        });
      } else {
        createCategory(category.value).then(() => {
          $q.notify({
            type: 'positive',
            message: '提交成功'
          });
          form.value?.reset();
        }).finally(() => {
          submitting.value = false;
        });
      }
    };

    const onReset = () => {
      category.value = { ...defaultCategory };
      filterAttributeList.value = [null];
    };

    onMounted(() => {
      if (isEdit.value) {
        void getCategory(id).then((value: any) => {
          category.value = { ...value };
        });
        void getProductAttrInfo(id).then((value: any) => {
          filterAttributeList.value = (value as Array<any>).map((e: any) => e.attributeId);
        });
      }
      onCategoryScroll();
      getProductAttrCateList();
    });

    return {
      category,
      form,
      rules,
      submitting,
      categoryOptions,
      categoryLoading,
      filterAttrOptions,
      filterAttributeList,
      filterLoading,
      onSubmit,
      onReset,
      categoryDisplay,
      filterAttrDisplay,
      removeFilterAttr,
      addFilterAttr,
      onCategoryScroll
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
