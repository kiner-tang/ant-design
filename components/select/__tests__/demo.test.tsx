import React from 'react';
import demoTest, { rootPropsTest } from '../../../tests/shared/demoTest';

demoTest('select', {
  skip: ['render-panel.tsx'],
  testRootProps: false,
});

rootPropsTest('select', (Select, props) => <Select {...props} />, {
  findRootElements: () => document.querySelectorAll('.ant-select, .ant-select-dropdown'),
  expectCount: 2,
});
