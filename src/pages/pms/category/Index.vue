<template>
  <q-page-x padding class='bg-grey-4'>
    <q-card>
      <q-card-section class='row items-center'>
        <q-icon name='article' size='sm' />
        <span style='font-size: 16px' class='q-ml-xs'>数据列表</span>
        <q-space />
        <q-btn color='primary' unelevated size='sm' @click='goAddCategory()' label='添加' />
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
      <template v-slot:body-cell-level='props'>
        <q-td :props='props'>
          {{ levelStr(props.value) }}
        </q-td>
      </template>
      <template v-slot:body-cell-navStatus='props'>
        <q-td :props='props'>
          <q-toggle v-model='list[props.pageIndex].navStatus' :true-value='1' :false-value='0'
                    @update:model-value='handleNavStatusChange(props.row)' />
        </q-td>
      </template>
      <template v-slot:body-cell-showStatus='props'>
        <q-td :props='props'>
          <q-toggle v-model='list[props.pageIndex].showStatus' :true-value='1' :false-value='0'
                    @update:model-value='handleShowStatusChange(props.row)' />
        </q-td>
      </template>
      <template v-slot:body-cell-setting='props'>
        <q-td :props='props'>
          <q-btn-group flat>
            <q-btn outline size='sm' :disable='list[props.pageIndex].level!==0' label='查看下级'
                   @click='handleShowNextLevel(props.key)' />
            <q-btn outline size='sm' label='转移商品' />
          </q-btn-group>
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
import { defineComponent, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { deleteCategory, fetchList, updateNavStatus, updateShowStatus } from 'src/api/category';

const columns = [
  { name: 'id', required: true, align: 'center', label: '编号', field: 'id', style: 'width: 72px;' },
  { name: 'name', align: 'center', label: '分类名称', field: 'name' },
  { name: 'level', align: 'center', label: '级别', field: 'level', style: 'width: 100px;' },
  { name: 'productCount', align: 'center', label: '商品数量', field: 'productCount', style: 'width: 100px;' },
  { name: 'productUnit', align: 'center', label: '数量单位', field: 'productUnit', style: 'width: 100px;' },
  { name: 'navStatus', align: 'center', label: '导航栏', field: 'navStatus', style: 'width: 100px;' },
  { name: 'showStatus', align: 'center', label: '是否显示', field: 'showStatus', style: 'width: 100px;' },
  { name: 'sort', align: 'center', label: '排序', field: 'sort', style: 'width: 100px;' },
  { name: 'setting', align: 'center', label: '设置', field: 'setting', style: 'width: 200px;' },
  { name: 'operation', align: 'center', label: '操作', field: 'operation', style: 'width: 200px;' }
];

export default defineComponent({
  name: 'CategoryList',
  setup() {
    const $q = useQuasar();
    const router = useRouter();
    const route = useRoute();

    const keyword = ref(null);

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

    const parentId = ref(0);

    watch(route, () => {
      resetParentId();
      getList();
    });

    const resetParentId = () => {
      pagination.value.page = 1;
      if (route.query.parentId != null) {
        parentId.value = parseInt(route.query.parentId as string);
      } else {
        parentId.value = 0;
      }
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
      void fetchList(parentId.value, {
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

    const levelStr = (level: number): string => {
      if (level == 0) {
        return '一级分类';
      } else if (level == 1) {
        return '二级分类';
      } else {
        return '';
      }
    };

    const goAddCategory = () => {
      void router.push({ path: '/pms/category/add' });
    };

    const goUpdateAttr = (key: string) => {
      void router.push({ path: '/pms/category/update', query: { id: key } });
    };

    const handleBatchDelete = (ids: Array<string>) => {
      if (ids.length < 1) {
        $q.notify({
          type: 'warning',
          message: '至少选中一条记录'
        });
        return;
      }
      $q.dialog({
        title: '提示',
        message: '是否要删除该商品属性?',
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
        void deleteCategory(ids).then(() => {
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

    const handleNavStatusChange = (row: any) => {
      updateNavStatus({
        ids: [row.id],
        navStatus: row.navStatus
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

    const handleShowNextLevel = (key: number) => {
      void router.push({ path: '/pms/category', query: { parentId: key } });
    };

    onMounted(() => {
      onRequest({ pagination: pagination.value });
    });

    return {
      columns,
      keyword,
      list,
      loading,
      pagination,
      levelStr,
      goAddCategory,
      goUpdateAttr,
      handleDelete,
      handleBatchDelete,
      handleNavStatusChange,
      handleShowStatusChange,
      handleShowNextLevel,
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
