/**
 * Created by jnornhold on 11/30/16.
 */
"use strict";

const _ = require('lodash');

let modules = {};

module.exports = (module) => {
  _.forEach(modules, (mod, name)=>{
    if (typeof mod === 'string') {
      module[name] = require(mod);
    } else {
      // { lib: path }
      let lib = _.keys(mod)[0];
      module[name] = _.get(require(lib), mod[lib]);
    }
  });
};


module.exports.bootstrap = (moduleMap) => {
  modules = moduleMap;
};