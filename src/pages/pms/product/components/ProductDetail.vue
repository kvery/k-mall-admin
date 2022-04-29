<template>
  <q-page-x>
    <q-card class='cur-card'>
      <q-stepper
        alternative-labels
        v-model='step'
        ref='stepper'
        color='primary'
        animated>
        <q-step
          :name='1'
          title='填写商品信息'
          icon='settings'
          :done='step > 1'
        >
          <product-info-detail v-model='product' @next='next' />
        </q-step>
        <q-step
          :name='2'
          title='填写商品促销'
          icon='create_new_folder'
          :done='step > 2'
        >
          <product-sale-detail v-model='product' @next='next' @prev='prev' />
        </q-step>
        <q-step
          :name='3'
          title='填写商品属性'
          icon='assignment'
          :done='step > 3'
        >
          <product-attr-detail v-model='product' @next='next' @prev='prev' />
        </q-step>
        <q-step
          :name='4'
          title='选择商品关联'
          icon='add_comment'
          :done='step > 4'
        >
          <product-relation-detail v-model='product' @next='()=>{}' @prev='prev' />
        </q-step>
      </q-stepper>
    </q-card>
  </q-page-x>
</template>

<script lang='ts'>
import { defineComponent, ref } from 'vue';
import ProductInfoDetail from 'pages/pms/product/components/ProductInfoDetail.vue';
import ProductSaleDetail from 'pages/pms/product/components/ProductSaleDetail.vue';
import ProductAttrDetail from 'pages/pms/product/components/ProductAttrDetail.vue';
import ProductRelationDetail from 'pages/pms/product/components/ProductRelationDetail.vue';

export default defineComponent({
  name: 'ProductDetail',
  components: { ProductRelationDetail, ProductAttrDetail, ProductSaleDetail, ProductInfoDetail },
  props: {
    isEdit: Boolean
  },
  setup() {
    const defaultProduct = {
      name: '',
      subTitle: '',
      productCategoryId: null,
      brandId: null,
      description: '',
      productSn: '',
      price: 0,
      originalPrice: 0,
      stock: 0,
      unit: '',
      weight: 0,
      sort: 0,
      giftPoint: 0,
      giftGrowth: 0,
      usePointLimit: 0,
      previewStatus: 0,
      publishStatus: 0,
      newStatus: 0,
      recommendStatus: 0,
      serviceIds: '',
      detailTitle: '',
      detailDesc: '',
      keywords: '',
      note: '',
      promotionType: 0,
      promotionStartTime: '',
      promotionEndTime: '',
      promotionPrice: null,
      memberPriceList: [],
      productLadderList: [{ count: 0, discount: 0, price: 0 }],
      productFullReductionList: [{ fullPrice: 0, reducePrice: 0 }],
      productAttributeCategoryId: null,
      albumPics: [],
      detailHtml: '',
      detailMobileHtml: '',
      //商品相关专题
      subjectProductRelationList: [],
      //商品相关优选
      preferenceAreaProductRelationList: []
    };
    const step = ref(3);
    const product = ref({ ...defaultProduct });

    const next = () => {
      step.value++;
    };

    const prev = () => {
      step.value--;
    };

    return {
      step,
      next,
      prev,
      product
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
