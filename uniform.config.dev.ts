import { uniformConfig } from '@uniformdev/cli/config';

module.exports = uniformConfig({
  preset: 'none',
  config: {
    serialization: {
      directory: './uniform-data',
      entitiesConfig: {
        dataType: {},
        component: {},
        contentType: {},
      },
    },
  },
});