<template>
  <q-page-x padding class='bg-grey-4'>
    <q-card>
      <q-card-section class='row items-center'>
        <q-icon name='article' size='sm' />
        <span style='font-size: 16px' class='q-ml-xs'>数据列表</span>
        <q-space />
        <q-btn color='primary' unelevated size='sm' @click='openAddDialog()' label='添加' />
      </q-card-section>
    </q-card>
    <q-table
      class='q-mt-md my-sticky-header-column-table'
      :rows='list'
      :columns='columns'
      color='primary'
      row-key='id'
      separator='cell'
      :loading='loading'
      rows-per-page-label='每页记录数'
      :rows-per-page-options='[5,10,15,20]'
      v-model:pagination='pagination'
      @request='onRequest'
      no-data-label='暂时没有数据ಥ_ಥ'
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
      <template v-slot:body-cell-setting='props'>
        <q-td :props='props'>
          <q-btn-group unelevated>
            <q-btn outline size='sm' @click='getAttrList(props.row)' label='属性列表' />
            <q-btn outline size='sm' @click='getParamList(props.row)' label='参数列表' />
          </q-btn-group>
        </q-td>
      </template>
      <template v-slot:body-cell-operation='props'>
        <q-td :props='props'>
          <q-btn-group unelevated>
            <q-btn outline size='sm' @click='openUpdateDialog(props.row)' label='编辑' />
            <q-btn color='negative' size='sm' @click='handleDelete(props.key)' label='删除' />
          </q-btn-group>
        </q-td>
      </template>
    </q-table>
    <q-dialog v-model='dialogVisible' @hide='clearInput()'>
      <q-card style='min-width: 360px;margin-top: 16vh;margin-bottom: auto;'>
        <q-card-section>
          <div class='text-h6'>{{ `${dialogType === 0 ? '添加' : '编辑'}类型` }}</div>
        </q-card-section>
        <q-form @submit.prevent='confirmDialog()'>
          <q-card-section class='q-pt-none'>
            <q-input outlined autofocus label='类型名称' v-model.trim='productAttrCate.name'
                     lazy-rules
                     :rules='[(val) => !!val || "请输入类型名称"]' />
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
import { defineComponent, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import {
  createProductAttrCate,
  deleteProductAttrCate,
  fetchList,
  updateProductAttrCate
} from 'src/api/productAttrCate';

const columns = [
  { name: 'id', required: true, align: 'center', label: '编号', field: 'id', style: 'width: 72px;' },
  { name: 'name', align: 'center', label: '类型名称', field: 'name' },
  { name: 'attributeCount', align: 'center', label: '属性数量', field: 'attributeCount', style: 'width: 200px;' },
  { name: 'paramCount', align: 'center', label: '参数数量', field: 'paramCount', style: 'width: 200px;' },
  { name: 'setting', align: 'center', label: '设置', field: 'setting', style: 'width: 200px;' },
  { name: 'operation', align: 'center', label: '操作', field: 'operation', style: 'width: 200px;' }
];

export default defineComponent({
  name: 'AttrCategoryList',
  setup() {
    const $q = useQuasar();
    const router = useRouter();

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

    const dialogVisible = ref(false);
    const dialogType = ref(0);
    const productAttrCate = ref({
      id: '',
      name: ''
    });

    const openAddDialog = () => {
      dialogVisible.value = true;
      dialogType.value = 0;
    };
    const openUpdateDialog = (rows: any) => {
      dialogVisible.value = true;
      dialogType.value = 1;
      productAttrCate.value.id = rows.id;
      productAttrCate.value.name = rows.name;
    };
    const confirmDialog = () => {
      if (dialogType.value === 0) {
        void createProductAttrCate(productAttrCate.value.name).then(() => {
          dialogVisible.value = false;
          $q.notify({
            type: 'positive',
            message: '添加成功'
          });
          getList();
        });
      } else {
        void updateProductAttrCate(productAttrCate.value.id, productAttrCate.value.name).then(() => {
          dialogVisible.value = false;
          $q.notify({
            type: 'positive',
            message: '修改成功'
          });
          getList();
        });
      }
    };
    const clearInput = () => {
      productAttrCate.value.name = '';
    };

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

    const handleDelete = (key: string) => {
      $q.dialog({
        title: '提示',
        message: '是否要删除该商品类型?',
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
        void deleteProductAttrCate(key).then(() => {
          $q.notify({
            type: 'positive',
            message: '删除成功'
          });
          getList();
        });
      });
      return '';
    };

    const getAttrList = (row: any) => {
      void router.push({ path: '/pms/attr', query: { cid: row.id, cname: row.name, type: 0 } });
    };
    const getParamList = (row: any) => {
      void router.push({ path: '/pms/attr', query: { cid: row.id, cname: row.name, type: 1 } });
    };

    onMounted(() => {
      onRequest({ pagination: pagination.value });
    });

    return {
      columns,
      dialogVisible,
      list,
      loading,
      pagination,
      productAttrCate,
      dialogType,
      getPaginationLabel,
      openAddDialog,
      openUpdateDialog,
      confirmDialog,
      handleDelete,
      onRequest,
      onBlur,
      clearInput,
      pageChange,
      getAttrList,
      getParamList
    };
  }
});
</script>

<style scoped lang='scss'>
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
