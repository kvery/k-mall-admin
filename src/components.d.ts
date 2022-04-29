import QPageX from 'components/QPageX.vue';

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    QPageX: typeof QPageX;
  }
}

export {};
