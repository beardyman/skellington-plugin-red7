/**
 * Created by jnornhold on 11/16/16.
 */
"use strict";

module.exports.parseUsername = function parseUsername(username) {
  return  username.replace('<', '').replace('@', '').replace('>', '');
};