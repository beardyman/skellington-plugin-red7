/**
 * Created by jnornhold on 11/30/16.
 */

const testTools = {
  expect: {
    chai: 'expect'
  },
  sinon: 'sinon',
  proxyquire: 'proxyquire'
};

require('test/testUtils/suiteBootstrap').bootstrap(testTools);