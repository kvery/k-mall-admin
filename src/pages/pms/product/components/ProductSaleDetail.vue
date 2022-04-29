<template>
  <q-form ref='form' greedy @submit.prevent='submit()'>
    <div class='form-item row'>
      <span class='item-label'>赠送积分</span>
      <q-input dense outlined type='number' v-model.number='value.giftPoint'
               @blur='value.giftPoint=numberBlur(value.giftPoint)' />
    </div>
    <div class='form-item row'>
      <span class='item-label'>赠送成长值</span>
      <q-input dense outlined type='number' v-model.number='value.giftGrowth'
               @blur='value.giftGrowth=numberBlur(value.giftGrowth)' />
    </div>
    <div class='form-item row'>
      <span class='item-label'>积分购买限制</span>
      <q-input dense outlined type='number' v-model.number='value.usePointLimit'
               @blur='value.usePointLimit=numberBlur(value.usePointLimit)' />
    </div>
    <div class='form-item row'>
      <span class='item-label'>预告商品</span>
      <q-toggle v-model='value.previewStatus' :false-value='0' :true-value='1' />
    </div>
    <div class='form-item row'>
      <span class='item-label'>商品上架</span>
      <q-toggle v-model='value.publishStatus' :false-value='0' :true-value='1' />
    </div>
    <div class='form-item row'>
      <span class='item-label'>商品推荐</span>
      <q-toggle label='新品' left-label v-model='value.newStatus' :false-value='0' :true-value='1' />
      <q-toggle label='推荐' left-label v-model='value.recommendStatus' :false-value='0' :true-value='1' />
    </div>
    <div class='form-item row'>
      <span class='item-label'>服务保证</span>
      <q-option-group type='checkbox' inline v-model='selectServiceList' :options='serviceOptions' />
    </div>
    <div class='form-item row'>
      <span class='item-label'>详细页标题</span>
      <q-input dense outlined v-model.trim='value.detailTitle' />
    </div>
    <div class='form-item row'>
      <span class='item-label'>详细页描述</span>
      <q-input dense outlined v-model.trim='value.detailDesc' />
    </div>
    <div class='form-item row'>
      <span class='item-label'>商品关键字</span>
      <q-input dense outlined v-model.trim='value.keyword' />
    </div>
    <div class='form-item row'>
      <span class='item-label'>商品备注</span>
      <q-input dense outlined autogrow v-model.trim='value.note' />
    </div>
    <div class='form-item row'>
      <span class='item-label'>优惠方式</span>
      <div class='column q-gutter-y-md'>
        <q-btn-toggle style='border: 1px solid #027be3' no-caps unelevated toggle-color='primary'
                      v-model='value.promotionType'
                      :options='promotionOptions' />
        <div class='column no-wrap' v-if='value.promotionType===1'>
          <div class='form-item row'>
            <span class='q-mr-sm item-label' style='width: auto'>开始时间</span>
            <q-field class='col' outlined dense lazy-rules v-model='value.promotionStartTime'
                     :rules='[(val) => !!val || "请选择开始时间"]'>
              <template v-slot:append>
                <q-icon name='event' />
              </template>
              <template v-slot:control>
                <div class='self-center full-width no-outline' tabindex='0'>{{ value.promotionStartTime }}</div>
              </template>
              <q-popup-proxy transition-show='scale' transition-hide='scale'>
                <k-date-time v-model='value.promotionStartTime' />
              </q-popup-proxy>
            </q-field>
          </div>
          <div class='form-item row'>
            <span class='q-mr-sm item-label' style='width: auto'>结束时间</span>
            <q-field class='col' outlined dense lazy-rules v-model='value.promotionEndTime'
                     :rules='[(val) => !!val || "请选择结束时间"]'>
              <template v-slot:append>
                <q-icon name='event' />
              </template>
              <template v-slot:control>
                <div class='self-center full-width no-outline' tabindex='0'>{{ value.promotionEndTime }}</div>
              </template>
              <q-popup-proxy transition-show='scale' transition-hide='scale'>
                <k-date-time v-model='value.promotionEndTime' />
              </q-popup-proxy>
            </q-field>
          </div>
          <div class='form-item row'>
            <span class='q-mr-sm item-label' style='width: auto'>促销价格</span>
            <q-input dense outlined type='number' v-model.number='value.promotionPrice'
                     lazy-rules :rules='[(val) => !!val || "请输入促销价格"]'
                     @blur='value.promotionPrice=numberBlur(value.promotionPrice)' />
          </div>
        </div>
        <div class='column no-wrap' v-else-if='value.promotionType===2&&value.memberPriceList.length>0'>
          <div class='form-item row' v-for='(item,i) in value.memberPriceList' :key='i'>
            <span class='q-mr-sm item-label' style='width: auto'>{{ item.memberLevelName }}</span>
            <q-input dense outlined autogrow type='number' v-model.number='item.memberPrice'
                     lazy-rules :rules='[(val) => !!val || "请输入价格"]'
                     @blur='item.memberPrice=numberBlur(item.memberPrice)' />
          </div>
        </div>
        <div class='column no-wrap' v-else-if='value.promotionType===3'>
          <q-table flat bordered
                   separator='cell'
                   hide-pagination
                   :columns='productLadderColumns'
                   :rows='value.productLadderList'>
            <template v-slot:body-cell-count='props'>
              <q-td :props='props'>
                <q-input dense outlined type='number' v-model.number='props.row.count'
                         @blur='props.row.count=numberBlur(props.row.count)' />
              </q-td>
            </template>
            <template v-slot:body-cell-discount='props'>
              <q-td :props='props'>
                <q-input dense outlined type='number' v-model.number='props.row.discount'
                         @blur='props.row.discount=numberBlur(props.row.discount)' />
              </q-td>
            </template>
            <template v-slot:body-cell-operation='props'>
              <q-td :props='props'>
                <q-btn-group unelevated>
                  <q-btn outline size='sm' label='新增'
                         @click='value.productLadderList.length>=3  || value.productLadderList.push({ count: 0, discount: 0, price: 0 })' />
                  <q-btn color='negative' size='sm' label='删除'
                         @click='handleRemoveProductLadder(props.pageIndex)' />
                </q-btn-group>
              </q-td>
            </template>
          </q-table>
        </div>
        <div class='column no-wrap' v-else-if='value.promotionType===4'>
          <q-table flat bordered
                   separator='cell'
                   hide-pagination
                   :columns='productFullReductionColumns'
                   :rows='value.productFullReductionList'>
            <template v-slot:body-cell-fullPrice='props'>
              <q-td :props='props'>
                <q-input dense outlined type='number' v-model.number='props.row.fullPrice'
                         @blur='props.row.fullPrice=numberBlur(props.row.fullPrice)' />
              </q-td>
            </template>
            <template v-slot:body-cell-reducePrice='props'>
              <q-td :props='props'>
                <q-input dense outlined type='number' v-model.number='props.row.reducePrice'
                         @blur='props.row.reducePrice=numberBlur(props.row.reducePrice)' />
              </q-td>
            </template>
            <template v-slot:body-cell-operation='props'>
              <q-td :props='props'>
                <q-btn-group unelevated>
                  <q-btn outline size='sm' label='新增'
                         @click='value.productFullReductionList.length>=3  || value.productFullReductionList.push({ fullPrice: 0, reducePrice: 0 })' />
                  <q-btn color='negative' size='sm' label='删除'
                         @click='handleRemoveProductFullReduction(props.pageIndex)' />
                </q-btn-group>
              </q-td>
            </template>
          </q-table>
        </div>
      </div>
    </div>
    <q-btn-group class='q-mt-md' spread unelevated>
      <q-btn outline label='上一步 填写商品信息' @click='prev()' />
      <q-btn color='primary' type='submit' label='下一步 填写商品属性' />
    </q-btn-group>
  </q-form>
</template>

<script lang='ts'>
import { computed, defineComponent, ref } from 'vue';
import { date, QForm } from 'quasar';
import KDateTime from 'components/datetime/KDateTime.vue';

export default defineComponent({
  name: 'ProductSaleDetail',
  components: { KDateTime },
  props: {
    modelValue: Object
  },
  emits: ['next', 'prev'],
  setup(props, context) {
    const value = computed(() => props.modelValue);

    const form = ref<QForm>();
    const rules = {};

    const numberBlur = (v: number) => {
      if (v < 0) {
        return 0;
      }
      return v;
    };

    const selectServiceList = computed({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      get: () => (value.value as any).serviceIds.split(',').filter((v: any) => !!v).map((v: string) => parseInt(v)),
      set: (v: Array<number>) => {
        (value.value as any).serviceIds = v.join(',');
      }
    });

    const serviceOptions = [
      {
        label: '无忧退货',
        value: 1
      },
      {
        label: '快速退款',
        value: 2
      },
      {
        label: '免费包邮',
        value: 3
      }];

    const promotionOptions = [
      {
        label: '无优惠',
        value: 0
      },
      {
        label: '特惠促销',
        value: 1
      },
      {
        label: '会员价格',
        value: 2
      },
      {
        label: '阶梯价格',
        value: 3
      },
      {
        label: '满减价格',
        value: 4
      }
    ];

    const productLadderColumns = [
      { name: 'count', align: 'center', label: '数量', field: 'count', style: 'width: 140px;' },
      { name: 'discount', align: 'center', label: '折扣', field: 'discount', style: 'width: 140px;' },
      { name: 'operation', align: 'center', label: '操作', field: 'operation', style: 'width: 140px;' }
    ];

    const productFullReductionColumns = [
      { name: 'fullPrice', align: 'center', label: '满', field: 'fullPrice', style: 'width: 140px;' },
      { name: 'reducePrice', align: 'center', label: '立减', field: 'reducePrice', style: 'width: 140px;' },
      { name: 'operation', align: 'center', label: '操作', field: 'operation', style: 'width: 140px;' }
    ];

    const handleRemoveProductLadder = (index: any) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const list = (value.value as any).productLadderList as Array<any>;
      list.splice(index, 1);
      if (list.length == 0) {
        list.push({ count: 0, discount: 0, price: 0 });
      }
    };

    const handleRemoveProductFullReduction = (index: any) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const list = (value.value as any).productFullReductionList as Array<any>;
      list.splice(index, 1);
      if (list.length == 0) {
        list.push({ fullPrice: 0, reducePrice: 0 });
      }
    };

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
      selectServiceList,
      serviceOptions,
      promotionOptions,
      productLadderColumns,
      productFullReductionColumns,
      handleRemoveProductLadder,
      handleRemoveProductFullReduction
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
}
</style>
