'use strict';

const _ = require('lodash');

/**
 * Utility to use to mock entire objects
 */
class Stubber {
  constructor(sinon) {
    this._sinon = sinon || require('sinon');
    this.proxyquire = {};
  }


  /**
   * Helper function for adding a stub to the proxyquire porperty.
   *
   * @param obj
   * @param [pathToObject]
   * @param [requirePath]
   * @private
   */
  _addToProxyquire(obj, pathToObject, requirePath) {
    let pathedObject;

    if (pathToObject) {
      pathedObject = _.set({}, pathToObject, obj);

      // need to default the path to an object here for the _.merge below to work
      if (_.isEmpty(this.proxyquire[requirePath])) {
        this.proxyquire[requirePath] = {};
      }

      // Put it on the proxyquire config.  Need to merge here because of two objects off the same proxyquire path
      _.merge(this.proxyquire[requirePath], pathedObject);
    } else {
      this.proxyquire[requirePath] = obj;
    }
  }

  /**
   * Gets a list of functions for the object passed in
   *
   * @param object
   * @param checkPrototype
   * @private
   */
  _getFunctions(object, checkPrototype) {
    let functions
      , retList = [];

    if (checkPrototype) {
      // gets functions from the prototype
      functions = _.attempt(() => Object.getOwnPropertyNames(Object.getPrototypeOf(object))); // gets function names for ES6 classes
      if (!_.isError(functions)) {
        retList = functions;
      }
    }

    return _.union(_.functionsIn(object), retList);
  }

  /**
   * Gets a full list of functions for an object and assesses if it should be instantiables
   *
   * @param obj {object} - object to be mocked / stubbed
   * @param tryInstantiable {boolean} - for pre-instantiated objects to force making their mock instantiable
   * @returns {{instantiable: boolean, functions: ['string']}}
   * @private
   */
  _parseObject(obj, tryInstantiable) {
    let tmpObj
      , ret = {
      instantiable: false
    };

    // do special things for instantiable classes
    if (_.isFunction(obj)) {
      // try to create a new instance ... if it doesn't work carry on
      tmpObj = _.attempt(() => new obj); //eslint-disable-line new-cap
      if (!_.isError(tmpObj)) {
        obj = tmpObj;
        ret.instantiable = true;
      }
    }

    // for objects that were passed in already instantiated
    if (!_.isPlainObject(obj) && tryInstantiable) {
      ret.instantiable = true;
    }

    ret.functions = this._getFunctions(obj, ret.instantiable);

    return ret;
  }


  /**
   * Creates the actual mock with stubbed methods or a constructor to generate stubs on instantiation
   *
   * @param objectProperties {object} - {instantiable: boolean, functions: []}
   * @returns {object}
   * @private
   */
  _createMock(objectProperties) {
    let obj = function() {}; // needs to be a function for class based imports
    // create stubs
    if (objectProperties.instantiable) {
      let stub = this._sinon.stub;
      obj = function() { //
        _.forEach(objectProperties.functions, (func) => {
          this[func] = stub();
        });
      }
    } else {
      _.forEach(objectProperties.functions, (func) => {
        obj[func] = this._sinon.stub();
      });
    }

    return obj;
  }

  /**
   * Stubs all functions on a given object
   *
   * @param module {string} - object or path to the object to be stubbed - if its a node_modules path a requirePath is not required.
   * @param [requirePath] {string} - path that is required in the SUT - Only required if the filePath is relative or an object is passed in.
   * @param [pathToObject] {string} - Where is the object in relation to the node module.  Path syntax for _.get()
   * @returns {Object}
   */
  stub(module, requirePath, pathToObject) {
    let needRequire = typeof module === 'string'
      , incObject = needRequire ? require(module) : module
      , proxyquirePath = requirePath || module
      , objectProperties
      , obj;

    // need to mock the right thing if an object path is provided
    if (needRequire && pathToObject) {
      incObject = _.get(incObject, pathToObject);
    }

    objectProperties = this._parseObject(incObject, !needRequire);

    obj = this._createMock(objectProperties);

    this._addToProxyquire(obj, pathToObject, proxyquirePath);

    return obj;
  }

}

module.exports = Stubber;
