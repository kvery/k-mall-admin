<template>
  <q-layout view='lHh Lpr lff'>
    <q-ajax-bar
      position='top'
      color='primary'
      size='2px'
    />
    <q-header elevated>
      <q-toolbar class='q-px-none bg-white text-black'>
        <q-btn
          :class="miniState ? 'open' : 'close'"
          :ripple='false'
          flat
          stretch
          aria-label='Menu'
          icon='format_indent_decrease'
          @click='toggleMiniState'
        />
        <q-breadcrumbs class='q-px-sm' gutter='xs'>

          <template v-slot:separator>
            <!--<transition-->
            <!--  appear-->
            <!--  enter-active-class='animated fadeInRight'-->
            <!--  leave-active-class='animated fadeOutRight absolute-x'-->
            <!--&gt;-->
            <!--  &lt;!&ndash;<q-icon&ndash;&gt;-->
            <!--  &lt;!&ndash;  size='1.5em'&ndash;&gt;-->
            <!--  &lt;!&ndash;  color='primary'&ndash;&gt;-->
            <!--  &lt;!&ndash;  name='chevron_right'&ndash;&gt;-->
            <!--  &lt;!&ndash;/>&ndash;&gt;-->
            <!--</transition>-->
          </template>

          <transition>
            <q-breadcrumbs-el to='/'>
              <div class='row items-center' style='white-space:nowrap;flex-wrap: nowrap;'>
                <span style='white-space: nowrap;width: 0'>&emsp;</span>
                <q-icon
                  size='1.5em'
                  color='primary'
                  name='home'
                />
                <transition
                  appear
                  enter-active-class='animated fadeIn'
                  leave-active-class='animated fadeOut'
                >
                  <q-icon
                    v-show='breadcrumbsNum() > 0'
                    size='1.5em'
                    color='primary'
                    name='chevron_right'
                  />
                </transition>
              </div>
            </q-breadcrumbs-el>
          </transition>

          <transition-group
            appear
            name='breadcrumb'
          >
            <q-breadcrumbs-el
              v-for='(n,i) in breadcrumbsNum()'
              :key='breadcrumbsLabel(i)'
              :to='breadcrumbsNum()-1 !== i?breadcrumbsLink(i):false'
            >
              <div class='row items-center' style='white-space:nowrap;flex-wrap: nowrap;'>
                <span style='white-space:nowrap;'
                      :class='{"text-primary":breadcrumbsNum()-1 !== i}'>
                  {{ breadcrumbsLabel(i) }}
                </span>
                <q-icon
                  v-if='breadcrumbsNum()-1 !== i'
                  size='1.5em'
                  color='primary'
                  name='chevron_right'
                />
              </div>
            </q-breadcrumbs-el>
          </transition-group>

          <!--<q-breadcrumbs-el-->
          <!--  v-for='(n,i) in breadcrumbsNum()' :key='breadcrumbsLabel(i)'-->
          <!--  :label='breadcrumbsLabel(i)'-->
          <!--  :to='breadcrumbsLink(i)'-->
          <!--/>-->

        </q-breadcrumbs>
        <q-space />
        <q-btn flat stretch>
          <q-avatar>
            <img alt='avatar' src='https://cdn.quasar.dev/img/avatar.png' />
          </q-avatar>
        </q-btn>
        <q-btn size='md' flat stretch color='black' icon='settings' />
      </q-toolbar>
    </q-header>

    <!--<q-footer elevated>
      <q-toolbar>
        <q-toolbar-title>Footer</q-toolbar-title>
      </q-toolbar>
    </q-footer>-->

    <q-drawer
      v-model='drawer'
      :width='240'
      :mini='miniState'
      :mini-width='56'
      :breakpoint='0'
      elevated
      show-if-above
      dark
    >
      <q-item
        to='/'
        class='q-pa-sm flex flex-center drawer-header'
        active-class=''
        style='height: 50px'
      >
        <q-img
          height='100%'
          width='34px'
          spinner-size='32px'
          src='https://vvbin.cn/next/assets/logo.63028018.png'
        />
        <span
          class='q-ml-sm q-mini-drawer-hide'
          style='font-size: 34px; line-height: 34px'
        >
          Admin
        </span>
      </q-item>
      <q-scroll-area style='height: calc(100% - 50px)'>
        <q-list>
          <q-expansion-item
            group='group'
            v-for='(item,index) in essentialLinks'
            :key='index'
            :label='item.text'
            @mouseenter='showMiniState(index)'
            @mouseleave='hideMiniState(index)'
          >
            <template v-slot:header>
              <q-item-section avatar>
                <q-icon :name='item.icon || "mail"' />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ item.text }}</q-item-label>
              </q-item-section>
              <q-menu
                v-if='miniState'
                v-model='item.mini'
                :offset='[-60, -48]'
                transition-show='fade'
                transition-hide='fade'
                auto-close
              >
                <q-list style='min-width: 100px'
                        @mouseenter='showMiniState(index)'
                        @mouseleave='hideMiniState(index)'>
                  <template v-for='link in item.children'
                            :key='link.title'>
                    <q-item :to='link.link' exact clickable>
                      <q-item-section>{{ link.title }}</q-item-section>
                    </q-item>
                    <q-separator />
                  </template>
                </q-list>
              </q-menu>
            </template>
            <EssentialLink
              v-for='link in item.children'
              :key='link.title'
              style='padding-left: 72px'
              v-bind='link'
            />
          </q-expansion-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container class='bg-grey-4'>
      <router-view v-slot='{ Component }'>
        <transition
          appear
          enter-from-class='anim-fadeInUp-from'
          enter-active-class='anim-fadeInUp'
          enter-to-class='anim-fadeInUp-to'
        >
          <component :is='Component' />
        </transition>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script lang='ts'>
import EssentialLink from 'components/EssentialLink.vue';
import { computed, defineComponent, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

const linksList = ref([
  {
    text: '商品',
    icon: 'shopping_bag',
    mini: false,
    preMini: false,
    children: [{
      title: '商品列表',
      caption: '',
      icon: '',
      link: '/pms/product'
    }, {
      title: '商品分类',
      caption: '',
      icon: '',
      link: '/pms/category'
    }, {
      title: '品牌管理',
      caption: '',
      icon: '',
      link: '/pms/brand'
    }, {
      title: '参数管理',
      caption: '',
      icon: '',
      link: '/pms/attr-cate'
    }]
  }, {
    text: '订单',
    icon: '',
    mini: false,
    preMini: false,
    children: [{
      title: 'Docs',
      caption: '',
      icon: '',
      link: '/'
    }, {
      title: 'Demo',
      caption: '',
      icon: '',
      link: '/demo'
    }]
  }, {
    text: '权限',
    icon: '',
    mini: false,
    preMini: false,
    children: [{
      title: 'Docs',
      caption: '',
      icon: '',
      link: '/'
    }, {
      title: 'Demo',
      caption: '',
      icon: '',
      link: '/demo'
    }]
  }
]);

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  setup: function() {
    const router = useRouter();
    const route = useRoute();
    const $q = useQuasar();

    const drawer = ref(true);
    const miniState = ref(false);
    const flag = ref($q.screen.lt.md);

    flag.value = document.body.clientWidth < $q.screen.sizes.md;
    miniState.value = flag.value;

    window.onresize = () => {
      flag.value = document.body.clientWidth < $q.screen.sizes.md;
    };

    watch(flag, (n) => {
      miniState.value = n;
    });


    const paths = computed(() => {
      return route.path.split('/').filter(value => !!value);
    });

    const breadcrumbsNum = (): number => {
      if (paths.value.length >= 3) {
        return paths.value.length - 1;
      } else {
        return paths.value.length;
      }
    };
    const breadcrumbsLabel = (index: number): string => {
      const map: Map<string, string> = new Map([
        ['pms', '商品'],
        ['category', '分类'],
        ['product', '商品'],
        ['brand', '品牌'],
        ['attr-cate', '参数类型'],
        ['attr', '参数'],
        ['', '列表'],
        ['add', '添加'],
        ['update', '修改']
      ]);
      if (index == 0) {
        const key = paths.value[index];
        return map.get(key) || 'NOT';
      } else {
        const key = paths.value[index];
        const key2 = paths.value[index + 1] || '';

        return (map.get(key) || '') + (map.get(key2) || '');
      }
    };
    const breadcrumbsLink = (index: number): string => {
      let num = 0;
      for (let s of route.path) {
        if (s == '/') {
          if (index-- == -1) {
            break;
          }
        }
        num++;
      }
      return route.path.substring(0, num);
    };

    return {
      essentialLinks: linksList,
      drawer,
      miniState,
      toggleMiniState() {
        miniState.value = !miniState.value;
      },
      showMiniState(index: number) {
        linksList.value.filter(value => {
          value.mini = false;
          value.preMini = false;
        });
        linksList.value[index].mini = true;
        linksList.value[index].preMini = true;
      },
      hideMiniState(index: number) {
        linksList.value[index].preMini = false;
        setTimeout(() => {
          if (!linksList.value[index].preMini) {
            linksList.value[index].mini = false;
          }
        }, 80);
      },
      breadcrumbsNum,
      breadcrumbsLabel,
      breadcrumbsLink,
      route
    };
  }
});
</script>
<style lang='scss'>
.anim-fadeInUp-from {
  opacity: 0;
  transform: translate3d(0, 20px, 0)
}

.anim-fadeInUp-to {
  opacity: 1;
  transform: translate3d(0, 0, 0)
}

.anim-fadeInUp {
  transition: all 400ms ease-out;
}

.close {
  transition: all 100ms;
}

.open {
  transform: rotate(180deg);
  transition: all 100ms;
}

.drawer-header:first-child > *:first-child {
  display: none !important;
}

/*滚动条*/
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

/* 滚动条的滑轨背景颜色 */
::-webkit-scrollbar-thumb:vertical {
  height: 5px;
  background-color: #999999;
  border-radius: 6px;
}

::-webkit-scrollbar-thumb:horizontal {
  width: 5px;
  background-color: #CCCCCC;
  border-radius: 6px;
}

::-webkit-scrollbar-track {
  background-color: transparent;
}

::-webkit-scrollbar-track-piece {
  background-color: transparent;
}

body::-webkit-scrollbar-track-piece {
  background-color: transparent;
}

.absolute-x {
  position: absolute;
}

.q-breadcrumbs__separator {
  display: none;
}

.breadcrumb-enter-active,
.breadcrumb-leave-active {
  transition: all .2s;
}

.breadcrumb-enter-from,
.breadcrumb-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.breadcrumb-move {
  transition: all .2s;
}

.breadcrumb-leave-active {
  position: absolute;
}

.q-breadcrumbs > * {
  display: block !important;
}
</style>
