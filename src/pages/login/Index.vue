<template>
  <q-layout>
    <q-page-container>
      <q-page class='overflow-hidden'>
        <q-img class='fixed' width='100vw' height='100vh' src='~assets/login_bg.png' />
        <q-form ref='form' @submit='submit()'>
          <q-card class='login-card q-pa-lg q-gutter-y-lg'>
            <div class='row items-center justify-center q-gutter-x-md'>
              <q-img
                width='54px'
                spinner-size='48px'
                src='https://vvbin.cn/next/assets/logo.63028018.png'
              />
              <span class='text-center' style='font-size: 32px;font-weight: 550;height: 60px;line-height: 60px'>KMall Admin</span>
            </div>
            <q-input outlined placeholder='账号' v-model='username' />
            <q-input outlined placeholder='密码' v-model='password' />
            <q-input outlined placeholder='验证码' v-model='code' />
            <q-btn class='full-width' unelevated color='primary' size='lg' label='登录' :loading='submitting'
                   @click='form.submit()'>
              <template v-slot:loading>
                <q-spinner-facebook />
              </template>
            </q-btn>
            <div class='row justify-around'>
              <q-btn v-for='n in 4' :key='n' class='' unelevated round color='primary' size='md' icon='qq'
                     @click='()=>{}'>
                <template v-slot:loading>
                  <q-spinner-facebook />
                </template>
              </q-btn>
            </div>
          </q-card>
        </q-form>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang='ts'>
import { defineComponent, ref } from 'vue';
import { QForm } from 'quasar';

export default defineComponent({
  name: 'Index',
  setup() {
    const form = ref<QForm>();
    const username = ref('');
    const password = ref('');
    const code = ref('');
    const submitting = ref(false);

    const submit = () => {

    };

    return {
      form,
      username,
      password,
      code,
      submitting,
      submit
    };
  }
});
</script>

<style scoped lang='scss'>
.login-card {
  width: 360px;
  margin: 96px auto 0;
  background: rgba(255, 255, 255, .66);
  backdrop-filter: blur(16px);
}
</style>
