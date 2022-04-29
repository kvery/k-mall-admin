<template>
  <q-page-x padding class='bg-grey-4'>
    <q-card>
      <q-card-section class='row items-center'>
        <q-icon name='article' size='sm' />
        <span style='font-size: 16px' class='q-ml-xs'>数据列表</span>
        <q-space />
        <q-btn-dropdown class='q-mr-sm' color='teal' unelevated label='批量操作' size='sm'>
          <q-list>
            <q-item clickable v-close-popup v-for='(item,i) in batchOperate.list' :key='i' @click='item.handle()'>
              <q-item-section>
                <q-item-label>{{ item.label }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-btn color='primary' unelevated size='sm' @click='goAddProduct()' label='添加' />
      </q-card-section>
    </q-card>
    <!-- 筛选搜索 -->
    <q-expansion-item
      class='q-mt-md shadow-2 overflow-hidden rounded-borders'
      icon='search'
      label='筛选搜索'
      :duration='200'
      header-class='bg-primary text-white search-card-header'
      expand-icon-class='text-white'
    >
      <q-card class='overflow-hidden'>
        <q-card-section class='row q-pb-none' @keyup.enter='handleSearchList()'>
          <div class='column'>
            <div class='row q-gutter-md'>
              <div class='row items-center q-gutter-x-md'>
                <span>输入搜索</span>
                <q-input style='width: 220px;' dense outlined v-model.trim='query.keyword' />
              </div>
              <div class='row items-center q-gutter-x-md'>
                <span>商品货号</span>
                <q-input style='width: 220px;' dense outlined v-model.trim='query.productSn' />
              </div>
              <div class='row items-center q-gutter-x-md'>
                <span>商品分类</span>
                <k-cascade style='width: 220px;' :loading='sProductCategory.loading'
                           v-model='query.productCategoryId'
                           :options='sProductCategory.options' />
              </div>
            </div>
            <div class='row q-mt-none q-gutter-md q-mb-md'>
              <div class='row items-center q-gutter-x-md'>
                <span>商品品牌</span>
                <q-select style='width: 220px;' dense outlined emit-value clearable
                          v-model='query.brandId'
                          :display-value='sBrand.display'
                          :options='sBrand.options'
                          :loading='sBrand.loading'
                          @virtual-scroll='sBrand.getList' />
              </div>
              <div class='row items-center q-gutter-x-md'>
                <span>上架状态</span>
                <q-select style='width: 220px;' dense outlined emit-value clearable
                          v-model='query.publishStatus'
                          :display-value='sPublishStatus.display'
                          :options='sPublishStatus.options' />
              </div>
              <div class='row items-center q-gutter-x-md'>
                <span>审核状态</span>
                <q-select style='width: 220px;' dense outlined emit-value clearable
                          v-model='query.verifyStatus'
                          :display-value='sVerifyStatus.display'
                          :options='sVerifyStatus.options' />
              </div>
            </div>
          </div>
          <q-space />
          <div class='q-mb-md'>
            <q-btn class='q-mr-sm' outline @click='resetQuery()' label='重置' />
            <q-btn color='primary' unelevated @click='handleSearchList()' label='查询' />
          </div>
        </q-card-section>
      </q-card>
    </q-expansion-item>
    <q-table
      class='q-mt-md my-sticky-header-column-table'
      color='primary'
      :rows='list'
      :columns='columns'
      row-key='id'
      separator='cell'
      :loading='loading'
      selection='multiple'
      :selected-rows-label='batchOperate.selectedString'
      v-model:selected='batchOperate.selected'
      rows-per-page-label='每页记录数'
      :rows-per-page-options='[5,10,15,20]'
      v-model:pagination='pagination'
      @request='onRequest'
      no-data-label='暂时没有数据ಥ_ಥ'
      no-results-label='暂时没有相关数据ಥ_ಥ'
    >
      <template v-slot:loading>
        <q-inner-loading showing label='加载中~~>_<~~' label-class='text-grey-8' color='primary' />
      </template>
      <template v-slot:no-data='{  message }'>
        <div class='full-width row flex-center' style='height: 281px;font-size: 16px;'>
          <span class='text-grey-8' v-if='!loading'>
            {{ message }}
          </span>
        </div>
      </template>
      <template v-slot:pagination='scope'>
        <span class='q-table__bottom-item'>{{ getPaginationLabel() }}</span>
        <q-pagination
          color='grey-8'
          unelevated
          direction-links
          :model-value='pagination.page'
          :boundary-links='scope.pagesNumber > 2'
          max-pages='7'
          :max='scope.pagesNumber'
          @update:model-value='pageChange'
        />
        <span class='q-table__bottom-item' style='margin-left: 8px;margin-right: 8px'>前往</span>
        <q-input class='input-page' dense outlined type='number' v-model.number='pagination.prePage' @blur='onBlur' />
        <span class='q-table__bottom-item' style='margin-left: 8px;margin-right: 0'>页</span>
      </template>
      <template v-slot:body-cell-pic='props'>
        <q-td :props='props'>
          <q-img :src='props.value' />
        </q-td>
      </template>
      <template v-slot:body-cell-price='props'>
        <q-td :props='props'>
          {{ `￥${props.value}` }}
        </q-td>
      </template>
      <template v-slot:body-cell-tags='props'>
        <q-td :props='props'>
          <div class='column'>
            <q-toggle class='text-no-wrap' left-label label='发布' v-model='list[props.pageIndex].publishStatus'
                      :true-value='1'
                      :false-value='0'
                      @update:model-value='handlePublishStatusChange(props.row)' />
            <q-toggle class='text-no-wrap' left-label label='新品' v-model='list[props.pageIndex].newStatus'
                      :true-value='1'
                      :false-value='0'
                      @update:model-value='handleNewStatusChange(props.row)' />
            <q-toggle class='text-no-wrap' left-label label='推荐' v-model='list[props.pageIndex].recommendStatus'
                      :true-value='1' :false-value='0'
                      @update:model-value='handleRecommendStatusChange(props.row)' />
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-skuStock='props'>
        <q-td :props='props'>
          <q-btn unelevated round color='primary' icon='edit' @click='skuEdit.showDialog()' />
        </q-td>
      </template>
      <template v-slot:body-cell-verifyStatus='props'>
        <q-td :props='props'>
          <div class='column'>
            <span>{{ props.value === 0 ? '未审核' : '审核' }}</span>
            <q-btn flat size='sm' color='primary' label='审核详情' />
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-operation='props'>
        <q-td :props='props'>
          <div class='q-gutter-y-sm'>
            <div class='row no-wrap q-gutter-x-sm'>
              <q-btn class='col' outline size='sm' @click='goUpdateProduct(props.key)' label='查看' />
              <q-btn class='col' outline size='sm' @click='handleDelete(props.key)' label='编辑' />
            </div>
            <div class='row no-wrap q-gutter-x-sm'>
              <q-btn class='col' outline size='sm' @click='goUpdateProduct(props.key)' label='日志' />
              <q-btn class='col' color='negative' unelevated size='sm' @click='handleDelete(props.key)' label='删除' />
            </div>
          </div>
        </q-td>
      </template>
    </q-table>
    <q-dialog v-model='skuEdit.visible' @hide='skuEdit.clear'>
      <q-card style='width: 720px;margin-top: 16vh;margin-bottom: auto;'>
        <q-card-section>
          <div class='text-h6'>编辑货品信息</div>
        </q-card-section>
        <q-form>
          <q-card-section class='q-pt-none'>
            <q-table flat bordered
                     separator='cell'
                     :columns='skuEdit.columns'>
            </q-table>
          </q-card-section>
          <q-card-actions align='right'>
            <q-btn flat label='取消' v-close-popup />
            <q-btn class='text-primary' flat type='submit' label='确定' />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page-x>
</template>

<script lang='ts'>
import { computed, defineComponent, onMounted, Ref, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import KCascade from 'components/cascade/KCascade.vue';
import { deleteBrand, fetchList as fetchBrandList } from 'src/api/brand';
import { fetchList, updateNewStatus, updatePublishStatus, updateRecommendStatus } from 'src/api/product';
import { fetchListWithChildren } from 'src/api/category';

const columns = [
  { name: 'id', required: true, align: 'center', label: '编号', field: 'id', style: 'width: 72px;' },
  { name: 'pic', align: 'center', label: '商品图片', field: 'pic', style: 'min-width: 140px;' },
  {
    name: 'name',
    align: 'center',
    label: '商品名称',
    field: 'name',
    style: 'max-width: 320px;min-width: 200px;white-space:normal'
  },
  { name: 'brandName', align: 'center', label: '品牌名称', field: 'brandName', style: 'width: 100px;' },
  { name: 'price', align: 'center', label: '价格', field: 'price', style: 'width: 100px;' },
  { name: 'productSn', align: 'center', label: '货号', field: 'productSn', style: 'width: 100px;' },
  { name: 'tags', align: 'center', label: '标签', field: 'tags', style: 'width: 100px;' },
  { name: 'sort', align: 'center', label: '排序', field: 'sort', style: 'width: 100px;' },
  { name: 'skuStock', align: 'center', label: 'SKU库存', field: 'skuStock', style: 'width: 100px;' },
  { name: 'sale', align: 'center', label: '销量', field: 'sale', style: 'width: 100px;' },
  { name: 'verifyStatus', align: 'center', label: '审核状态', field: 'verifyStatus', style: 'width: 100px;' },
  { name: 'operation', align: 'center', label: '操作', field: 'operation', style: 'width: 200px;' }
];

export default defineComponent({
  name: 'ProductList',
  components: { KCascade },
  setup() {
    const $q = useQuasar();
    const router = useRouter();
    const route = useRoute();

    const tQuery = query();

    const list = ref<Array<any>>([]);
    const loading = ref(true);
    const pagination = ref({
      sortBy: 'desc',
      descending: false,
      page: 1,
      prePage: 1,
      rowsPerPage: 5,
      rowsNumber: 0,
      totalPage: 0
    });

    const getPaginationLabel = () => {
      return `共${pagination.value.totalPage}页`;
    };
    const onBlur = () => {
      if (pagination.value.prePage > pagination.value.totalPage) {
        pagination.value.prePage = pagination.value.totalPage;
      } else if (pagination.value.prePage < 1) {
        pagination.value.prePage = 1;
      }
      pagination.value.page = pagination.value.prePage;
      getList();
    };
    const pageChange = (value: number) => {
      getList(value);
    };
    const getList = (pageNum: number = pagination.value.page,
                     pageSize: number = pagination.value.rowsPerPage) => {
      loading.value = true;
      void fetchList({
        ...tQuery.query.value,
        pageNum,
        pageSize
      }).then(value => {
        pagination.value.rowsNumber = value.total;
        pagination.value.page = value.pageNum;
        pagination.value.prePage = value.pageNum;
        pagination.value.rowsPerPage = value.pageSize;
        pagination.value.totalPage = value.totalPage;

        list.value = value.list as Array<any>;
      }).finally(() => {
        loading.value = false;
      });
    };
    const onRequest = (props: { pagination: { page: any; rowsPerPage: any; }; }) => {
      const { page, rowsPerPage } = props.pagination;
      getList(page, rowsPerPage);
    };
    const handleSearchList = () => {
      pagination.value.page = 1;
      getList();
    };

    const goAddProduct = () => {
      void router.push({ path: '/pms/product/add' });
    };

    const goUpdateProduct = (key: string) => {
      void router.push({ path: '/pms/product/update', query: { id: key } });
    };

    const handleDelete = (key: string) => {
      $q.dialog({
        title: '提示',
        message: '是否要删除该品牌?',
        ok: {
          label: '确定',
          color: 'negative',
          flat: true
        },
        cancel: {
          label: '取消',
          color: 'black',
          flat: true
        },
        focus: 'none'
      }).onOk(() => {
        void deleteBrand([key]).then(() => {
          $q.notify({
            type: 'positive',
            message: '删除成功'
          });
          getList();
        });
      });
    };

    const tBatchOperate = batchOperate(getList);

    const handlePublishStatusChange = (row: any) => {
      tBatchOperate.value.updatePublish(row.publishStatus, [row.id]).catch(() => {
        row.publishStatus = (row.publishStatus == 1 ? 0 : 1);
      });
    };

    const handleNewStatusChange = (row: any) => {
      tBatchOperate.value.updateNew(row.newStatus, [row.id]).catch(() => {
        row.newStatus = (row.newStatus == 1 ? 0 : 1);
      });
    };

    const handleRecommendStatusChange = (row: any) => {
      tBatchOperate.value.updateRecommend(row.recommendStatus, [row.id]).catch(() => {
        row.recommendStatus = (row.recommendStatus == 1 ? 0 : 1);
      });
    };

    onMounted(() => {
      onRequest({ pagination: pagination.value });
      tQuery.sProductCategory.value.getList();
      tQuery.sBrand.value.getList();
    });

    return {
      columns,
      list,
      loading,
      pagination,
      goAddProduct,
      goUpdateProduct,
      handleDelete,
      handlePublishStatusChange,
      handleNewStatusChange,
      handleRecommendStatusChange,
      getPaginationLabel,
      onRequest,
      handleSearchList,
      onBlur,
      pageChange,
      ...tQuery,
      skuEdit: skuEdit(),
      batchOperate: tBatchOperate
    };
  }
});

const query = () => {
  const keyword = ref(null);
  const productSn = ref(null);
  const productCategoryId = ref<number>();
  const brandId = ref<number>();
  const publishStatus = ref<number>();
  const verifyStatus = ref<number>();

  const sBrand = (data: Ref) => {
    const loading = ref(false);
    let totalPage = 1;
    let pageNum = 1;
    const pageSize = 50;
    const options = ref<Array<any>>([]);
    const display = computed(() => {
      return options.value.find(e => e.value == data.value)?.label || '';
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
  };

  const sProductCategory = () => {
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
  };

  const sPublishStatus = (data: Ref) => {
    const options = [{
      label: '下架',
      value: 0
    }, {
      label: '上架',
      value: 1
    }];
    const display = computed(() => {
      return options.find(e => e.value == data.value)?.label || '全部';
    });
    return { options, display };
  };

  const sVerifyStatus = (data: Ref) => {
    const options = [{
      label: '未审核',
      value: 0
    }, {
      label: '审核通过',
      value: 1
    }];
    const display = computed(() => {
      return options.find(e => e.value == data.value)?.label || '全部';
    });
    return { options, display };
  };

  const resetQuery = () => {
    keyword.value = null;
    productSn.value = null;
    productCategoryId.value = undefined;
    brandId.value = undefined;
    publishStatus.value = undefined;
    verifyStatus.value = undefined;
  };

  return {
    query: ref({
      keyword,
      productSn,
      productCategoryId,
      brandId,
      publishStatus,
      verifyStatus
    }),
    resetQuery,
    sBrand: ref(sBrand(brandId)),
    sProductCategory: ref(sProductCategory()),
    sPublishStatus: ref(sPublishStatus(publishStatus)),
    sVerifyStatus: ref(sVerifyStatus(verifyStatus))
  };
};

const skuEdit = () => {
  const columns = [
    { name: 'skuCode', align: 'center', label: 'SKU编号', field: 'skuCode', style: 'width: 72px;' },
    { name: 'price', align: 'center', label: '销售价格', field: 'price', style: 'width: 72px;' },
    { name: 'stock', align: 'center', label: '商品库存', field: 'stock', style: 'width: 72px;' },
    { name: 'lowStock', align: 'center', label: '库存预警值', field: 'lowStock', style: 'width: 72px;' }
  ];

  const visible = ref(false);
  const skuList = ref([]);

  const showDialog = () => {
    visible.value = true;
  };
  const clear = () => {

  };
  return ref({ columns, visible, skuList, showDialog, clear });
};

const batchOperate = (after: () => void) => {
  const $q = useQuasar();
  const selected = ref([]);
  const selectedString = () => {
    return selected.value.length === 0 ? '' : `已选中${selected.value.length}条记录`;
  };

  const before = () => {
    return new Promise<Array<string>>((resolve, reject) => {
      if (selected.value.length < 1) {
        $q.notify({
          type: 'warning',
          message: '至少选中一条记录'
        });
        return reject(null);
      } else {
        const ids = selected.value.map((e: any) => e.id);
        $q.dialog({
          title: '提示',
          message: '是否要进行该批量操作?',
          ok: {
            label: '确定',
            color: 'negative',
            flat: true
          },
          cancel: {
            label: '取消',
            color: 'black',
            flat: true
          },
          focus: 'none'
        }).onOk(() => {
          resolve(ids);
        });
      }
    });
  };

  const remove = async (ids: Array<string>) => {
    if (!ids) {
      ids = await before();
    }
    await deleteBrand(ids);
    $q.notify({ type: 'positive', message: '删除成功' });
    after();
  };
  const updatePublish = async (publishStatus: number, ids?: Array<string>) => {
    const l = ids?.length || 0;
    if (!ids) {
      ids = await before();
    }
    await updatePublishStatus({ ids, publishStatus });
    $q.notify({ type: 'positive', message: '修改成功' });
    if (l !== 1) {
      after();
    }
  };
  const updateNew = async (newStatus: number, ids?: Array<string>) => {
    const l = ids?.length || 0;
    if (!ids) {
      ids = await before();
    }
    await updateNewStatus({ ids, newStatus });
    $q.notify({ type: 'positive', message: '修改成功' });
    if (l !== 1) {
      after();
    }
  };
  const updateRecommend = async (recommendStatus: number, ids?: Array<string>) => {
    const l = ids?.length || 0;
    if (!ids) {
      ids = await before();
    }
    await updateRecommendStatus({ ids, recommendStatus });
    $q.notify({ type: 'positive', message: '修改成功' });
    if (l !== 1) {
      after();
    }
  };

  const updatePublishOn = () => updatePublish(1);
  const updatePublishOff = () => updatePublish(0);
  const updateNewOn = () => updateNew(1);
  const updateNewOff = () => updateNew(0);
  const updateRecommendOn = () => updateRecommend(1);
  const updateRecommendOff = () => updateRecommend(0);

  const list = [
    { label: '批量删除', handle: remove },
    { label: '商品上架', handle: updatePublishOn },
    { label: '商品下架', handle: updatePublishOff },
    { label: '设为新品', handle: updateNewOn },
    { label: '取消新品', handle: updateNewOff },
    { label: '设为推荐', handle: updateRecommendOn },
    { label: '取消推荐', handle: updateRecommendOff }
  ];

  return ref({
    selected,
    list,
    selectedString,
    updatePublish,
    updateNew,
    updateRecommend
  });
};

</script>

<style scoped lang='scss'>
*::v-deep {
  .search-card-header {
    height: 54px;

    .q-item__section--avatar {
      min-width: 0;
      padding-right: 4px;
    }

    .q-item__label {
      font-size: 16px;
    }
  }
}

.my-sticky-header-column-table::v-deep {
  max-height: 648px;

  .q-inner-loading {
    z-index: 9;
  }

  .q-table__bottom-item {
    line-height: 16px;
  }

  .input-page {
    max-width: 72px;
    height: 32px;

    .q-field__control {
      height: 32px !important;
    }
  }

  td:first-child {
    background-color: #fff !important;
  }

  tr th {
    position: sticky;
    z-index: 2;
    background: #fff
  }

  thead tr:last-child th {
    top: 48px;
    z-index: 3;
  }

  thead tr:first-child th {
    top: 0;
    z-index: 1;
  }

  thead tr:first-child th:first-child {
    z-index: 3;
  }

  td:first-child {
    z-index: 1;
  }

  td:first-child, th:first-child {
    position: sticky;
    left: 0;
  }

  td:last-child {
    background-color: #fff !important;
  }

  td:last-child, th:last-child {
    position: sticky;
    right: 0;
  }

  &.q-table--cell-separator {
    td:first-child, th:first-child {
      border-right-width: 1px;
    }

    th:nth-child(2),
    td:nth-child(2) {
      border-left-width: 0;
    }
  }
}
</style>
