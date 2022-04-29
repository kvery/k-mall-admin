<template>
  <q-date minimal mask='YYYY-MM-DD' navigation-min-year-month='2022/04'
          :locale='locale'
          :options='options'
          v-model='tDate'>
    <div class='row q-gutter-sm'>
      <q-field class='col' outlined dense>
        <template v-slot:control>
          {{ tDate }}
        </template>
      </q-field>
      <q-field class='col' outlined dense>
        <template v-slot:control>
          {{ tTime }}
          <q-popup-proxy transition-show='scale' transition-hide='scale' @before-show='init()'>
            <q-card>
              <q-card-section>
                <div class='column' style='width: 180px;'>
                  <div class='time-body col row'>
                    <div :ref='hour.el' class='time-list col hide-scrollbar'
                         @scroll='hour.onScroll'>
                      <div class='time-item cursor-pointer' :class='{select:hour.data.value===i}'
                           v-for='(n,i) in hourList'
                           :key='i' @click=hour.to({i:i})>
                        {{ n }}
                      </div>
                    </div>
                    <div :ref='min.el' class='time-list col hide-scrollbar'
                         @scroll='min.onScroll'>
                      <div class='time-item cursor-pointer' :class='{select:min.data.value===i}'
                           v-for='(n,i) in minList'
                           :key='i' @click=min.to({i:i})>{{ n }}
                      </div>
                    </div>
                    <div :ref='sec.el' class='time-list col hide-scrollbar'
                         @scroll='sec.onScroll'>
                      <div class='time-item cursor-pointer' :class='{select:sec.data.value===i}'
                           v-for='(n,i) in secList'
                           :key='i' @click=sec.to({i:i})>{{ n }}
                      </div>
                    </div>
                  </div>
                  <div class='row items-center justify-end q-gutter-sm q-mt-sm'>
                    <q-btn flat label='取消' v-close-popup />
                    <q-btn unelevated label='确定' color='primary' @click='enterTime' v-close-popup />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </q-popup-proxy>
        </template>
      </q-field>
    </div>
    <div class='row items-center justify-end q-gutter-sm q-mt-sm'>
      <q-btn flat label='此刻' color='primary'
             @click='now()' />
      <q-btn unelevated label='确定' color='primary' @click='enter' v-close-popup />
    </div>
  </q-date>
</template>

<script setup lang='ts'>
import { nextTick, ref } from 'vue';
import { date, debounce, scroll } from 'quasar';

const itemHeight = 32;

const props = defineProps<{ modelValue: string }>();
const emits = defineEmits<{ (e: 'update:modelValue', value: string): void }>();

const tDate = ref(props.modelValue.split(' ')[0] || '');

const tTime = ref(props.modelValue.split(' ')[1] || '');

const now = () => {
  const dateNow = Date.now();
  tDate.value = date.formatDate(dateNow, 'YYYY-MM-DD');
  tTime.value = date.formatDate(dateNow, 'HH:mm:ss');
};

if (!date.isValid(props.modelValue)) {
  now();
}

const enter = () => {
  emits('update:modelValue', `${tDate.value} ${tTime.value}`);
};

const locale = {
  days: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
  daysShort: ['日', '一', '二', '三', '四', '五', '六'],
  months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
  monthsShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
};

const options = (v: any) => {
  return v >= date.formatDate(Date.now(), 'YYYY/MM/DD');
};

// 时间
const hourList = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
const minList = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59'];
const secList = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59'];

const time = (initData: number) => {
  const el = ref<HTMLDivElement>();
  const data = ref<number>(initData);
  const to = ({ i = data.value, duration = 200 }) => {
    if (el.value) {
      scroll.setVerticalScrollPosition(el.value, i * itemHeight, duration);
    }
  };
  const fix = debounce((v) => {
    to({ i: Math.round(v / itemHeight), duration: 100 });
  }, 200);
  const onScroll = (e: Event) => {
    const target = e.target as HTMLDivElement;
    const top = target.scrollTop;
    const current = Math.round(top / itemHeight);
    if (data.value === current) return;
    data.value = current;
    fix(top);
  };

  return {
    el,
    top,
    data,
    to,
    fix,
    onScroll
  };
};

const hour = time(parseInt(tTime.value.substring(0, 2)));
const min = time(parseInt(tTime.value.substring(3, 5)));
const sec = time(parseInt(tTime.value.substring(6, 8)));

const init = () => {
  void nextTick(() => {
    hour.to({ duration: 0 });
    min.to({ duration: 0 });
    sec.to({ duration: 0 });
  });
};

const enterTime = () => {
  tTime.value = `${hourList[hour.data.value]}:${minList[min.data.value]}:${secList[sec.data.value]}`;
};
</script>

<style scoped lang='scss'>
.time-body {
  position: relative;

  &::before {
    content: "";
    position: absolute;
    display: block;
    top: 50%;
    margin-top: -16px;
    height: 32px;
    width: 100%;
    box-sizing: border-box;
    border: 0 solid #e0e0e0;
    border-top-width: 1px;
    border-bottom-width: 1px;
  }
}

.time-list {
  height: 160px;
  overflow: auto;

  &::before {
    content: "";
    display: block;
    height: 64px;
  }

  &::after {
    content: "";
    display: block;
    height: 64px;
  }

}

.time-item {
  height: 32px;
  line-height: 32px;
  text-align: center;
  border-radius: 4px;

  &.select {
    color: $primary;
    font-weight: 550;
    transition: all .2s linear;
  }

  &:hover {
    color: white;
    background: rgba(#1976D2, .7);
    transition: all .12s linear .08s;
  }
}
</style>
