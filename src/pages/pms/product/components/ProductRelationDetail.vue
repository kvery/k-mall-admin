<template>
  <div>
    <div class='form-item row'>
      <span class='item-label'>关联专题</span>
      <div class='row col q-gutter-x-md'>
        <q-card class='col'>
          <q-card-section class='q-pa-sm'>
            <q-item class='rounded-borders bg-blue-4 text-white' style='padding: 10px 12px 2px;margin: -8px -8px 0;'
                    tag='label'
                    v-ripple>
              <q-item-section avatar>
                <q-checkbox :model-value='subjectL.select.length!==0&&subjectL.select.length===subjectL.data.length'
                            @update:model-value='subjectL.all()' />
              </q-item-section>
              <q-item-section>
                <q-item-label>待选择</q-item-label>
              </q-item-section>
              <q-item-section side>
                {{ `${subjectL.select.length}/${subjectL.data.length}` }}
              </q-item-section>
            </q-item>
            <q-list dense>
              <q-item class='rounded-borders' style='padding: 2px 4px' tag='label' v-ripple
                      v-for='(item,i) in subjectL.showList' :key='i'>
                <q-item-section side top>
                  <q-checkbox :model-value='subjectL.select.indexOf(i)!==-1'
                              @update:model-value='subjectL.update(i)' />
                </q-item-section>
                <q-item-section>
                  <q-item-label class='ellipsis'>{{ item.title }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
        <div class='column flex-center q-gutter-y-md'>
          <q-btn round color='primary' icon='arrow_forward_ios' :disable='subjectL.select.length===0'
                 @click='subjectToRight' />
          <q-btn round color='primary' icon='arrow_back_ios_new' :disable='subjectR.select.length===0'
                 @click='subjectToLeft' />
        </div>
        <q-card class='col'>
          <q-card-section class='q-pa-sm'>
            <q-item class='rounded-borders bg-blue-4 text-white' style='padding: 10px 12px 2px;margin: -8px -8px 0;'
                    tag='label'
                    v-ripple>
              <q-item-section avatar>
                <q-checkbox :model-value='subjectR.select.length!==0&&subjectR.select.length===subjectR.data.length'
                            @update:model-value='subjectR.all()' />
              </q-item-section>
              <q-item-section>
                <q-item-label>已选择</q-item-label>
              </q-item-section>
              <q-item-section side>
                {{ `${subjectR.select.length}/${subjectR.data.length}` }}
              </q-item-section>
            </q-item>
            <q-list dense>
              <q-item class='rounded-borders' style='padding: 2px 4px' tag='label' v-ripple
                      v-for='(item,i) in subjectR.showList' :key='i'>
                <q-item-section side top>
                  <q-checkbox :model-value='subjectR.select.indexOf(i)!==-1'
                              @update:model-value='subjectR.update(i)' />
                </q-item-section>
                <q-item-section>
                  <q-item-label class='ellipsis'>{{ item.title }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div class='form-item row'>
      <span class='item-label'>关联优选</span>
      <div class='row col q-gutter-x-md'>
        <q-card class='col'>
          <q-card-section class='q-pa-sm'>
            <q-item class='rounded-borders bg-blue-4 text-white' style='padding: 10px 12px 2px;margin: -8px -8px 0;'
                    tag='label'
                    v-ripple>
              <q-item-section avatar>
                <q-checkbox
                  :model-value='preferenceAreaL.select.length!==0&&preferenceAreaL.select.length===preferenceAreaL.data.length'
                  @update:model-value='preferenceAreaL.all()' />
              </q-item-section>
              <q-item-section>
                <q-item-label>待选择</q-item-label>
              </q-item-section>
              <q-item-section side>
                {{ `${preferenceAreaL.select.length}/${preferenceAreaL.data.length}` }}
              </q-item-section>
            </q-item>
            <q-list dense>
              <q-item class='rounded-borders' style='padding: 2px 4px' tag='label' v-ripple
                      v-for='(item,i) in preferenceAreaL.showList' :key='i'>
                <q-item-section side top>
                  <q-checkbox :model-value='preferenceAreaL.select.indexOf(i)!==-1'
                              @update:model-value='preferenceAreaL.update(i)' />
                </q-item-section>
                <q-item-section>
                  <q-item-label class='ellipsis'>{{ item.name }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
        <div class='column flex-center q-gutter-y-md'>
          <q-btn round color='primary' icon='arrow_forward_ios' :disable='preferenceAreaL.select.length===0'
                 @click='preferenceAreaToRight' />
          <q-btn round color='primary' icon='arrow_back_ios_new' :disable='preferenceAreaR.select.length===0'
                 @click='preferenceAreaToLeft' />
        </div>
        <q-card class='col'>
          <q-card-section class='q-pa-sm'>
            <q-item class='rounded-borders bg-blue-4 text-white' style='padding: 10px 12px 2px;margin: -8px -8px 0;'
                    tag='label'
                    v-ripple>
              <q-item-section avatar>
                <q-checkbox
                  :model-value='preferenceAreaR.select.length!==0&&preferenceAreaR.select.length===preferenceAreaR.data.length'
                  @update:model-value='preferenceAreaR.all()' />
              </q-item-section>
              <q-item-section>
                <q-item-label>已选择</q-item-label>
              </q-item-section>
              <q-item-section side>
                {{ `${preferenceAreaR.select.length}/${preferenceAreaR.data.length}` }}
              </q-item-section>
            </q-item>
            <q-list dense>
              <q-item class='rounded-borders' style='padding: 2px 4px' tag='label' v-ripple
                      v-for='(item,i) in preferenceAreaR.showList' :key='i'>
                <q-item-section side top>
                  <q-checkbox :model-value='preferenceAreaR.select.indexOf(i)!==-1'
                              @update:model-value='preferenceAreaR.update(i)' />
                </q-item-section>
                <q-item-section>
                  <q-item-label class='ellipsis'>{{ item.name }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <q-btn-group class='q-mt-md' spread unelevated>
      <q-btn outline label='上一步 填写商品属性' @click='prev()' />
      <q-btn color='primary' label='完成 提交商品' @click='submit()' />
    </q-btn-group>
  </div>
</template>

<script lang='ts'>
import { computed, defineComponent, ref } from 'vue';
import { date } from 'quasar';
import { fetchList as fetchPreferenceList } from 'src/api/preferenceArea';
import { fetchList as fetchSubjectList } from 'src/api/subject';

export default defineComponent({
  name: 'ProductRelationDetail',
  props: {
    modelValue: Object
  },
  emits: ['next', 'prev'],
  setup(props, context) {
    const value = computed(() => props.modelValue);

    const prev = () => {
      context.emit('prev');
    };

    const submit = () => {
      context.emit('next');
    };

    const subjectData = ref<Array<any>>([]);
    const preferenceAreaData = ref<Array<any>>([]);

    const list = (d: any) => {
      const data = ref<Array<any>>([]);
      const select = ref<Array<any>>([]);
      const showList = computed(() => {
        const list = [];
        for (const i of data.value) {
          list.push(d.value[i]);
        }
        return list;
      });
      const update = (index: number) => {
        const number = select.value.indexOf(index);
        if (number == -1) {
          select.value.push(index);
        } else {
          select.value.splice(number, 1);
        }
      };
      const all = () => {
        if (select.value.length === data.value.length) {
          select.value = [];
        } else {
          select.value = [];
          for (let i = 0; i < data.value.length; i++) {
            select.value.push(i);
          }
        }
      };

      return ref({
        showList,
        data,
        select,
        update,
        all
      });
    };

    const subjectL = list(subjectData);
    const subjectR = list(subjectData);
    const preferenceAreaL = list(preferenceAreaData);
    const preferenceAreaR = list(preferenceAreaData);

    const getSubjectList = () => {
      void fetchSubjectList().then((value) => {
        subjectData.value = value;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        subjectL.value.data = value.map((e: any, i: any) => i);
      });
    };

    const getPreferenceAreaList = () => {
      void fetchPreferenceList().then((value) => {
        preferenceAreaData.value = value;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        preferenceAreaL.value.data = value.map((e: any, i: any) => i);
      });
    };

    const subjectToRight = () => {
      let select = subjectL.value.select;
      let data = subjectL.value.data;
      let array = select.sort((v1, v2) => v2 - v1);
      const list = [];
      for (const i of array) {
        list.push(data.splice(i, 1));
      }
      subjectL.value.select = [];
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      subjectR.value.data.push(...list);
      subjectR.value.data = subjectR.value.data.sort((v1: number, v2: number) => v1 - v2);

      updateSubject();
    };
    const subjectToLeft = () => {
      let select = subjectR.value.select;
      let data = subjectR.value.data;
      let array = select.sort((v1, v2) => v2 - v1);
      const list = [];
      for (const i of array) {
        list.push(data.splice(i, 1));
      }
      subjectR.value.select = [];
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      subjectL.value.data.push(...list);
      subjectL.value.data = subjectL.value.data.sort((v1: number, v2: number) => v1 - v2);

      updateSubject();
    };

    const preferenceAreaToRight = () => {
      let select = preferenceAreaL.value.select;
      let data = preferenceAreaL.value.data;
      let array = select.sort((v1, v2) => v2 - v1);
      const list = [];
      for (const i of array) {
        list.push(data.splice(i, 1));
      }
      preferenceAreaL.value.select = [];
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      preferenceAreaR.value.data.push(...list);
      preferenceAreaR.value.data = preferenceAreaR.value.data.sort((v1: number, v2: number) => v1 - v2);

      updatePreferenceArea();
    };

    const preferenceAreaToLeft = () => {
      let select = preferenceAreaR.value.select;
      let data = preferenceAreaR.value.data;
      let array = select.sort((v1, v2) => v2 - v1);
      const list = [];
      for (const i of array) {
        list.push(data.splice(i, 1));
      }

      preferenceAreaR.value.select = [];
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      preferenceAreaL.value.data.push(...list);
      preferenceAreaL.value.data = preferenceAreaL.value.data.sort((v1: number, v2: number) => v1 - v2);
    };

    const updateSubject = () => {
      const result = [];
      for (const data of subjectR.value.data) {
        result.push(subjectData.value[data].id);
      }
      (value.value as any).subjectProductRelationList = result;
    };

    const updatePreferenceArea = () => {
      const result = [];
      for (const data of preferenceAreaR.value.data) {
        result.push(preferenceAreaData.value[data].id);
      }
      (value.value as any).preferenceAreaProductRelationList = result;
    };

    getSubjectList();
    getPreferenceAreaList();

    return {
      date,
      value,
      submit,
      prev,
      subjectToRight,
      subjectToLeft,
      preferenceAreaToRight,
      preferenceAreaToLeft,
      subjectL,
      subjectR,
      preferenceAreaL,
      preferenceAreaR
    };
  }
});
</script>

<style scoped lang='scss'>
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
</style>
