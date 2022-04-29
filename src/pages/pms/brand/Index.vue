<template>
  <q-page-x padding class='bg-grey-4'>
    <q-card>
      <q-card-section class='row items-center'>
        <q-icon name='article' size='sm' />
        <span style='font-size: 16px' class='q-ml-xs'>数据列表</span>
        <q-space />
        <q-btn-dropdown class='q-mr-sm' color='teal' unelevated label='批量操作' size='sm'>
          <q-list>
            <q-item clickable v-close-popup @click='handleBatchDelete()'>
              <q-item-section>
                <q-item-label>批量删除</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-btn color='primary' unelevated size='sm' @click='goAddBrand()' label='添加' />
      </q-card-section>
    </q-card>
    <q-table
      class='q-mt-md my-sticky-header-column-table'
      color='primary'
      :rows='list'
      :columns='columns'
      row-key='id'
      separator='cell'
      :loading='loading'
      :filter='keyword'
      selection='multiple'
      :selected-rows-label='getSelectedString'
      v-model:selected='selected'
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
      <template v-slot:top-right>
        <q-input outlined v-model.trim='keyword' dense debounce='300' placeholder='品牌名称/关键词'>
          <template v-slot:append>
            <q-icon name='search' />
          </template>
        </q-input>
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
      <template v-slot:body-cell-factoryStatus='props'>
        <q-td :props='props'>
          <q-toggle v-model='list[props.pageIndex].factoryStatus' :true-value='1' :false-value='0'
                    @update:model-value='handleFactoryStatusChange(props.row)' />
        </q-td>
      </template>
      <template v-slot:body-cell-showStatus='props'>
        <q-td :props='props'>
          <q-toggle v-model='list[props.pageIndex].showStatus' :true-value='1' :false-value='0'
                    @update:model-value='handleShowStatusChange(props.row)' />
        </q-td>
      </template>
      <template v-slot:body-cell-relevant='props'>
        <q-td :props='props'>
          <div class='column q-col-gutter-xs'>
            <div class='row'>
              <q-chip square class='q-ma-none col' color='primary' text-color='white'
                      icon='event'
                      :label='props.row.productCount || 0' />
            </div>
            <div class='row'>
              <q-chip square class='q-ma-none col' color='teal' text-color='white'
                      icon='bookmark'
                      :label='props.row.productCommentCount || 0' />
            </div>
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-operation='props'>
        <q-td :props='props'>
          <q-btn-group unelevated>
            <q-btn outline size='sm' @click='goUpdateAttr(props.key)' label='编辑' />
            <q-btn color='negative' size='sm' @click='handleDelete(props.key)' label='删除' />
          </q-btn-group>
        </q-td>
      </template>
    </q-table>
  </q-page-x>
</template>

<script lang='ts'>
import { defineComponent, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { deleteBrand, fetchList, updateFactoryStatus, updateShowStatus } from 'src/api/brand';

const columns = [
  { name: 'id', required: true, align: 'center', label: '编号', field: 'id', style: 'width: 72px;' },
  { name: 'name', align: 'center', label: '品牌名称', field: 'name' },
  { name: 'firstLetter', align: 'center', label: '品牌首字母', field: 'firstLetter', style: 'width: 100px;' },
  { name: 'sort', align: 'center', label: '排序', field: 'sort', style: 'width: 100px;' },
  { name: 'factoryStatus', align: 'center', label: '品牌制造商', field: 'factoryStatus', style: 'width: 100px;' },
  { name: 'showStatus', align: 'center', label: '是否显示', field: 'showStatus', style: 'width: 100px;' },
  { name: 'relevant', align: 'center', label: '相关', field: 'relevant', style: 'width: 140px;' },
  { name: 'operation', align: 'center', label: '操作', field: 'operation', style: 'width: 200px;' }
];

export default defineComponent({
  name: 'BrandList',
  setup() {
    const $q = useQuasar();
    const router = useRouter();
    const route = useRoute();

    const keyword = ref(null);

    const list = ref<Array<any>>([]);
    const selected = ref([]);
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

    const getSelectedString = () => {
      return selected.value.length === 0 ? '' : `已选中${selected.value.length}条记录`;
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
        keyword: keyword.value,
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

    const goAddBrand = () => {
      void router.push({ path: '/pms/brand/add' });
    };

    const goUpdateAttr = (key: string) => {
      void router.push({ path: '/pms/brand/update', query: { id: key } });
    };

    const handleBatchDelete = (ids: Array<string> = selected.value.map((e: any) => e.id)) => {
      if (ids.length < 1) {
        $q.notify({
          type: 'warning',
          message: '至少选中一条记录'
        });
        return;
      }
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
        void deleteBrand(ids).then(() => {
          $q.notify({
            type: 'positive',
            message: '删除成功'
          });
          getList();
        });
      });
    };

    const handleDelete = (key: string) => {
      handleBatchDelete([key]);
    };

    const handleFactoryStatusChange = (row: any) => {
      updateFactoryStatus({
        ids: [row.id],
        factoryStatus: row.factoryStatus
      }).then(() => {
        $q.notify({
          type: 'positive',
          message: '修改成功'
        });
      }).catch(() => {
        row.factoryStatus = (row.factoryStatus == 1 ? 0 : 1);
      });
    };

    const handleShowStatusChange = (row: any) => {
      updateShowStatus({
        ids: [row.id],
        showStatus: row.showStatus
      }).then(() => {
        $q.notify({
          type: 'positive',
          message: '修改成功'
        });
      }).catch(() => {
        row.factoryStatus = (row.factoryStatus == 1 ? 0 : 1);
      });
    };

    onMounted(() => {
      onRequest({ pagination: pagination.value });
    });

    return {
      columns,
      selected,
      keyword,
      list,
      loading,
      pagination,
      goAddBrand,
      goUpdateAttr,
      handleDelete,
      handleBatchDelete,
      handleFactoryStatusChange,
      handleShowStatusChange,
      getSelectedString,
      getPaginationLabel,
      onRequest,
      onBlur,
      pageChange
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
