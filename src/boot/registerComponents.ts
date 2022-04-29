import { boot } from 'quasar/wrappers';

import QPageX from 'components/QPageX.vue';

export default boot(({ app }) => {
  app.component('q-page-x', QPageX);
});
