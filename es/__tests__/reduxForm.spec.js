import _noop from 'lodash-es/noop';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* eslint react/no-multi-comp:0 */
import React, { Component } from 'react';
import TestUtils from 'react-addons-test-utils';
import { createSpy } from 'expect';
import { combineReducers as plainCombineReducers, createStore } from 'redux';
import { combineReducers as immutableCombineReducers } from 'redux-immutablejs';
import { Provider } from 'react-redux';

import createReducer from '../reducer';
import createReduxForm from '../reduxForm';
import createField from '../Field';
import createFieldArray from '../FieldArray';
import FormSection from '../FormSection';
import { change, clearSubmit, initialize, setSubmitSucceeded, startSubmit, submit, touch } from '../actions';
import plain from '../structure/plain';
import plainExpectations from '../structure/plain/expectations';
import immutable from '../structure/immutable';
import immutableExpectations from '../structure/immutable/expectations';
import addExpectations from './addExpectations';
import SubmissionError from '../SubmissionError';

var propsAtNthRender = function propsAtNthRender(componentSpy, callNumber) {
  return componentSpy.calls[callNumber].arguments[0];
};

var describeReduxForm = function describeReduxForm(name, structure, combineReducers, expect) {
  var fromJS = structure.fromJS,
      getIn = structure.getIn;

  var reduxForm = createReduxForm(structure);
  var Field = createField(structure);
  var FieldArray = createFieldArray(structure);
  var reducer = createReducer(structure);

  describe(name, function () {
    var makeStore = function makeStore() {
      var initial = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var logger = arguments[1];

      var reducers = { form: reducer };
      if (logger) {
        reducers.logger = logger;
      }
      return createStore(combineReducers(reducers), fromJS({ form: initial }));
    };

    var makeForm = function makeForm() {
      var renderSpy = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _noop;

      return function (_Component) {
        _inherits(Form, _Component);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            renderSpy(this.props);
            return React.createElement(
              'div',
              null,
              React.createElement(Field, { name: 'foo', component: 'input' })
            );
          }
        }]);

        return Form;
      }(Component);
    };

    var renderForm = function renderForm(Form, formState) {
      var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      var store = makeStore({ testForm: formState });
      var Decorated = reduxForm(_extends({ form: 'testForm' }, config))(Form);
      return TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(Decorated, null)
      ));
    };

    var propChecker = function propChecker(formState) {
      var renderSpy = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _noop;
      var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      var Form = makeForm(renderSpy);
      var dom = renderForm(Form, formState, config);
      return TestUtils.findRenderedComponentWithType(dom, Form).props;
    };

    it('should return a decorator function', function () {
      expect(reduxForm).toBeA('function');
    });

    it('should render without error', function () {
      var store = makeStore();

      var Form = function (_Component2) {
        _inherits(Form, _Component2);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            return React.createElement('div', null);
          }
        }]);

        return Form;
      }(Component);

      expect(function () {
        var Decorated = reduxForm({ form: 'testForm' })(Form);
        TestUtils.renderIntoDocument(React.createElement(
          Provider,
          { store: store },
          React.createElement(Decorated, null)
        ));
      }).toNotThrow();
    });

    it('should provide the correct props', function () {
      var props = propChecker({});
      expect(Object.keys(props).sort()).toEqual(['anyTouched', 'array', 'asyncValidate', 'asyncValidating', 'autofill', 'blur', 'change', 'clearAsyncError', 'clearSubmit', 'destroy', 'dirty', 'dispatch', 'error', 'form', 'handleSubmit', 'initialValues', 'initialize', 'initialized', 'invalid', 'pristine', 'pure', 'reset', 'submit', 'submitFailed', 'submitSucceeded', 'submitting', 'touch', 'triggerSubmit', 'untouch', 'valid', 'warning']);
      expect(props.anyTouched).toBeA('boolean');
      expect(props.array).toExist().toBeA('object');
      expect(Object.keys(props.array).sort()).toEqual(['insert', 'move', 'pop', 'push', 'remove', 'removeAll', 'shift', 'splice', 'swap', 'unshift']);
      expect(props.array.insert).toExist().toBeA('function');
      expect(props.array.move).toExist().toBeA('function');
      expect(props.array.pop).toExist().toBeA('function');
      expect(props.array.push).toExist().toBeA('function');
      expect(props.array.remove).toExist().toBeA('function');
      expect(props.array.removeAll).toExist().toBeA('function');
      expect(props.array.shift).toExist().toBeA('function');
      expect(props.array.splice).toExist().toBeA('function');
      expect(props.array.swap).toExist().toBeA('function');
      expect(props.array.unshift).toExist().toBeA('function');
      expect(props.asyncValidate).toExist().toBeA('function');
      expect(props.asyncValidating).toBeA('boolean');
      expect(props.autofill).toExist().toBeA('function');
      expect(props.blur).toExist().toBeA('function');
      expect(props.change).toExist().toBeA('function');
      expect(props.destroy).toExist().toBeA('function');
      expect(props.dirty).toBeA('boolean');
      expect(props.form).toExist().toBeA('string');
      expect(props.handleSubmit).toExist().toBeA('function');
      expect(props.initialize).toExist().toBeA('function');
      expect(props.initialized).toBeA('boolean');
      expect(props.pristine).toBeA('boolean');
      expect(props.reset).toExist().toBeA('function');
      expect(props.submitFailed).toBeA('boolean');
      expect(props.submitSucceeded).toBeA('boolean');
      expect(props.touch).toExist().toBeA('function');
      expect(props.untouch).toExist().toBeA('function');
      expect(props.valid).toBeA('boolean');
    });

    describe('dirty prop', function () {
      it('should default `false`', function () {
        expect(propChecker({}).dirty).toBe(false);
      });
      it('should be `true` when `state.values` exists but `state.initial` does not exist', function () {
        expect(propChecker({
          // no initial values
          values: {
            foo: 'bar'
          }
        }).dirty).toBe(true);
      });
      it('should be `false` when `state.initial` equals `state.values`', function () {
        expect(propChecker({
          initial: {
            foo: 'bar'
          },
          values: {
            foo: 'bar'
          }
        }).dirty).toBe(false);
      });
      it('should be `true` when `state.initial` does not equal `state.values`', function () {
        expect(propChecker({
          initial: {
            foo: 'bar'
          },
          values: {
            foo: 'baz'
          }
        }).dirty).toBe(true);
      });
    });

    describe('pristine prop', function () {
      it('should default to `true`', function () {
        expect(propChecker({}).pristine).toBe(true);
      });
      it('should be `false` when `state.values` exists but `state.initial` does not exist', function () {
        expect(propChecker({
          // no initial values
          values: {
            foo: 'bar'
          }
        }).pristine).toBe(false);
      });
      it('should be `true` when `state.initial` equals `state.values`', function () {
        expect(propChecker({
          initial: {
            foo: 'bar'
          },
          values: {
            foo: 'bar'
          }
        }).pristine).toBe(true);
      });
      it('should be `false` when the `state.values` does not equal `state.initial`', function () {
        expect(propChecker({
          initial: {
            foo: 'bar'
          },
          values: {
            foo: 'baz'
          }
        }).pristine).toBe(false);
      });
    });

    describe('valid prop', function () {
      var checkValidPropGivenErrors = function checkValidPropGivenErrors(errors, expectation) {
        // Check Sync Errors
        expect(propChecker({}, undefined, {
          validate: function validate() {
            return errors;
          }
        }).valid).toBe(expectation);

        // Check Async Errors
        expect(propChecker({
          asyncErrors: errors
        }).valid).toBe(expectation);
      };

      it('should default to `true`', function () {
        checkValidPropGivenErrors({}, true);
      });

      it('should be `false` when `errors` has a `string` property', function () {
        checkValidPropGivenErrors({ foo: 'bar' }, false);
      });

      it('should be `false` when `errors` has a `number` property', function () {
        checkValidPropGivenErrors({ foo: 42 }, false);
      });

      it('should be `true` when `errors` has an `undefined` property', function () {
        checkValidPropGivenErrors({ foo: undefined }, true);
      });

      it('should be `true` when `errors` has a `null` property', function () {
        checkValidPropGivenErrors({ foo: null }, true);
      });

      it('should be `true` when `errors` has an empty array', function () {
        checkValidPropGivenErrors({
          myArrayField: []
        }, true);
      });

      it('should be `true` when `errors` has an array with only `undefined` values', function () {
        checkValidPropGivenErrors({
          myArrayField: [undefined, undefined]
        }, true);
      });

      it('should be `true` when `errors` has an array containing strings', function () {
        // Note: I didn't write the isValid, but my intuition tells me this seems incorrect. – ncphillips
        checkValidPropGivenErrors({
          myArrayField: ['baz']
        }, true);
      });
    });

    describe('invalid prop', function () {

      var checkInvalidPropGivenErrors = function checkInvalidPropGivenErrors(errors, expectation) {
        // Check Sync Errors
        expect(propChecker({}, undefined, {
          validate: function validate() {
            return errors;
          }
        }).invalid).toBe(expectation);

        // Check Async Errors
        expect(propChecker({
          asyncErrors: errors
        }).invalid).toBe(expectation);
      };

      it('should default to `false`', function () {
        checkInvalidPropGivenErrors({}, false);
      });

      it('should be `true` when errors has a `string` propertry', function () {
        checkInvalidPropGivenErrors({ foo: 'sync error' }, true);
      });

      it('should be `true` when errors has a `number` property', function () {
        checkInvalidPropGivenErrors({ foo: 12 }, true);
      });

      it('should be `false` when errors has only an `undefined` property', function () {
        checkInvalidPropGivenErrors({ foo: undefined }, false);
      });

      it('should be `false` when errors has only a `null` property', function () {
        checkInvalidPropGivenErrors({ foo: null }, false);
      });

      it('should be `false` when errors has only an empty array', function () {
        checkInvalidPropGivenErrors({ myArrayField: [] }, false);
      });
    });

    it('should provide submitting prop', function () {
      expect(propChecker({}).submitting).toBe(false);
      expect(propChecker({ submitting: true }).submitting).toBe(true);
      expect(propChecker({ submitting: false }).submitting).toBe(false);
    });

    it('should put props under prop namespace if specified', function () {
      var props = propChecker({}, _noop, {
        propNamespace: 'fooProps',
        someOtherProp: 'whatever'
      });
      expect(props.fooProps).toExist().toBeA('object');
      expect(props.dispatch).toNotExist();
      expect(props.dirty).toNotExist();
      expect(props.pristine).toNotExist();
      expect(props.submitting).toNotExist();
      expect(props.someOtherProp).toExist();
      expect(props.fooProps.dispatch).toBeA('function');
      expect(props.fooProps.dirty).toBeA('boolean');
      expect(props.fooProps.pristine).toBeA('boolean');
      expect(props.fooProps.submitting).toBeA('boolean');
      expect(props.fooProps.someOtherProp).toNotExist();
    });

    it('should provide bound array action creators', function () {
      var arrayProp = propChecker({}).array;
      expect(arrayProp).toExist();
      expect(arrayProp.insert).toExist().toBeA('function');
      expect(arrayProp.pop).toExist().toBeA('function');
      expect(arrayProp.push).toExist().toBeA('function');
      expect(arrayProp.remove).toExist().toBeA('function');
      expect(arrayProp.shift).toExist().toBeA('function');
      expect(arrayProp.splice).toExist().toBeA('function');
      expect(arrayProp.swap).toExist().toBeA('function');
      expect(arrayProp.unshift).toExist().toBeA('function');
    });

    it('should not rerender unless form-wide props (except value!) change', function () {
      var spy = createSpy();

      var _propChecker = propChecker({}, spy, {
        validate: function validate(values) {
          var foo = getIn(values, 'foo');
          return foo && foo.length > 5 ? { foo: 'Too long' } : {};
        }
      }),
          dispatch = _propChecker.dispatch; // render 0


      expect(spy.calls.length).toBe(1);

      // simulate typing the word "giraffe"
      dispatch(change('testForm', 'foo', 'g')); // render 1 (now dirty)
      expect(spy.calls.length).toBe(2);

      dispatch(change('testForm', 'foo', 'gi')); // no render
      dispatch(change('testForm', 'foo', 'gir')); // no render
      dispatch(change('testForm', 'foo', 'gira')); // no render
      dispatch(change('testForm', 'foo', 'giraf')); // no render
      dispatch(change('testForm', 'foo', 'giraff')); // render 2 (invalid)
      expect(spy.calls.length).toBe(3);
      dispatch(change('testForm', 'foo', 'giraffe')); // no render

      dispatch(change('testForm', 'foo', '')); // render 3 (clean/valid)
      expect(spy.calls.length).toBe(5); // two renders, one to change value, and other to revalidate

      expect(propsAtNthRender(spy, 0).dirty).toBe(false);
      expect(propsAtNthRender(spy, 0).invalid).toBe(false);
      expect(propsAtNthRender(spy, 0).pristine).toBe(true);
      expect(propsAtNthRender(spy, 0).valid).toBe(true);

      expect(propsAtNthRender(spy, 1).dirty).toBe(true);
      expect(propsAtNthRender(spy, 1).invalid).toBe(false);
      expect(propsAtNthRender(spy, 1).pristine).toBe(false);
      expect(propsAtNthRender(spy, 1).valid).toBe(true);

      expect(propsAtNthRender(spy, 2).dirty).toBe(true);
      expect(propsAtNthRender(spy, 2).invalid).toBe(true);
      expect(propsAtNthRender(spy, 2).pristine).toBe(false);
      expect(propsAtNthRender(spy, 2).valid).toBe(false);

      expect(propsAtNthRender(spy, 4).dirty).toBe(false);
      expect(propsAtNthRender(spy, 4).invalid).toBe(false);
      expect(propsAtNthRender(spy, 4).pristine).toBe(true);
      expect(propsAtNthRender(spy, 4).valid).toBe(true);
    });

    it('should rerender on every change if pure is false', function () {
      var spy = createSpy();

      var _propChecker2 = propChecker({}, spy, {
        pure: false
      }),
          dispatch = _propChecker2.dispatch;

      expect(spy.calls.length).toBe(2); // twice, second one is for after field registration

      // simulate typing the word "giraffe"
      dispatch(change('testForm', 'foo', 'g'));
      expect(spy.calls.length).toBe(3);
      dispatch(change('testForm', 'foo', 'gi'));
      expect(spy.calls.length).toBe(4);
      dispatch(change('testForm', 'foo', 'gir'));
      expect(spy.calls.length).toBe(5);
      dispatch(change('testForm', 'foo', 'gira'));
      expect(spy.calls.length).toBe(6);
      dispatch(change('testForm', 'foo', 'giraf'));
      expect(spy.calls.length).toBe(7);
      dispatch(change('testForm', 'foo', 'giraff'));
      expect(spy.calls.length).toBe(8);
      dispatch(change('testForm', 'foo', 'giraffe'));
      expect(spy.calls.length).toBe(9);
    });

    it('should initialize values with initialValues on first render', function () {
      var store = makeStore({});
      var inputRender = createSpy(function (props) {
        return React.createElement('input', props.input);
      }).andCallThrough();
      var formRender = createSpy();
      var initialValues = {
        deep: {
          foo: 'bar'
        }
      };

      var Form = function (_Component3) {
        _inherits(Form, _Component3);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            formRender(this.props);
            return React.createElement(
              'form',
              null,
              React.createElement(Field, { name: 'deep.foo', component: inputRender, type: 'text' })
            );
          }
        }]);

        return Form;
      }(Component);

      var Decorated = reduxForm({ form: 'testForm' })(Form);
      TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(Decorated, { initialValues: initialValues })
      ));
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            initial: initialValues,
            values: initialValues,
            registeredFields: [{ name: 'deep.foo', type: 'Field' }]
          }
        }
      });
      expect(formRender).toHaveBeenCalled();
      expect(formRender.calls.length).toBe(1);
      var checkProps = function checkProps(props) {
        expect(props.pristine).toBe(true);
        expect(props.dirty).toBe(false);
        expect(props.initialized).toBe(false); // will be true on second render
        expect(props.initialValues).toEqualMap(initialValues);
      };
      checkProps(formRender.calls[0].arguments[0]);

      expect(inputRender).toHaveBeenCalled();
      expect(inputRender.calls.length).toBe(1);
      expect(propsAtNthRender(inputRender, 0).meta.pristine).toBe(true);
      expect(propsAtNthRender(inputRender, 0).meta.dirty).toBe(false);
      expect(propsAtNthRender(inputRender, 0).input.value).toBe('bar');
    });

    it('should initialize with initialValues on later render if not already initialized', function () {
      var store = makeStore({});
      var inputRender = createSpy(function (props) {
        return React.createElement('input', props.input);
      }).andCallThrough();
      var formRender = createSpy();
      var initialValues = {
        deep: {
          foo: 'bar'
        }
      };

      var Form = function (_Component4) {
        _inherits(Form, _Component4);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            formRender(this.props);
            return React.createElement(
              'form',
              null,
              React.createElement(Field, { name: 'deep.foo', component: inputRender, type: 'text' })
            );
          }
        }]);

        return Form;
      }(Component);

      var Decorated = reduxForm({ form: 'testForm' })(Form);

      var Container = function (_Component5) {
        _inherits(Container, _Component5);

        function Container(props) {
          _classCallCheck(this, Container);

          var _this5 = _possibleConstructorReturn(this, (Container.__proto__ || Object.getPrototypeOf(Container)).call(this, props));

          _this5.state = {};
          return _this5;
        }

        _createClass(Container, [{
          key: 'render',
          value: function render() {
            var _this6 = this;

            return React.createElement(
              'div',
              null,
              React.createElement(
                Provider,
                { store: store },
                React.createElement(Decorated, this.state)
              ),
              React.createElement(
                'button',
                { onClick: function onClick() {
                    return _this6.setState({ initialValues: initialValues });
                  } },
                'Init'
              )
            );
          }
        }]);

        return Container;
      }(Component);

      var dom = TestUtils.renderIntoDocument(React.createElement(Container, null));
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: [{ name: 'deep.foo', type: 'Field' }]
          }
        }
      });
      expect(formRender).toHaveBeenCalled();
      expect(formRender.calls.length).toBe(1);

      expect(inputRender).toHaveBeenCalled();
      expect(inputRender.calls.length).toBe(1);
      var checkInputProps = function checkInputProps(props, value) {
        expect(props.meta.pristine).toBe(true);
        expect(props.meta.dirty).toBe(false);
        expect(props.input.value).toBe(value);
      };
      checkInputProps(inputRender.calls[0].arguments[0], '');

      // initialize
      var initButton = TestUtils.findRenderedDOMComponentWithTag(dom, 'button');
      TestUtils.Simulate.click(initButton);

      // check initialized state
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: [{
              name: 'deep.foo',
              type: 'Field'
            }],
            initial: initialValues,
            values: initialValues
          }
        }
      });

      // no need to rerender form on initialize
      expect(formRender.calls.length).toBe(1);

      // check rerendered input
      expect(inputRender.calls.length).toBe(2);
      checkInputProps(inputRender.calls[1].arguments[0], 'bar');
    });

    it('should NOT reinitialize with initialValues', function () {
      var store = makeStore({});
      var inputRender = createSpy(function (props) {
        return React.createElement('input', props.input);
      }).andCallThrough();
      var formRender = createSpy();
      var initialValues1 = {
        deep: {
          foo: 'bar'
        }
      };
      var initialValues2 = {
        deep: {
          foo: 'baz'
        }
      };

      var Form = function (_Component6) {
        _inherits(Form, _Component6);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            formRender(this.props);
            return React.createElement(
              'form',
              null,
              React.createElement(Field, { name: 'deep.foo', component: inputRender, type: 'text' })
            );
          }
        }]);

        return Form;
      }(Component);

      var Decorated = reduxForm({ form: 'testForm' })(Form);

      var Container = function (_Component7) {
        _inherits(Container, _Component7);

        function Container(props) {
          _classCallCheck(this, Container);

          var _this8 = _possibleConstructorReturn(this, (Container.__proto__ || Object.getPrototypeOf(Container)).call(this, props));

          _this8.state = { initialValues: initialValues1 };
          return _this8;
        }

        _createClass(Container, [{
          key: 'render',
          value: function render() {
            var _this9 = this;

            return React.createElement(
              'div',
              null,
              React.createElement(
                Provider,
                { store: store },
                React.createElement(Decorated, this.state)
              ),
              React.createElement(
                'button',
                { onClick: function onClick() {
                    return _this9.setState({ initialValues: initialValues2 });
                  } },
                'Init'
              )
            );
          }
        }]);

        return Container;
      }(Component);

      var dom = TestUtils.renderIntoDocument(React.createElement(Container, null));
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: [{ name: 'deep.foo', type: 'Field' }],
            initial: initialValues1,
            values: initialValues1
          }
        }
      });
      expect(formRender).toHaveBeenCalled();
      expect(formRender.calls.length).toBe(1);

      expect(inputRender).toHaveBeenCalled();
      expect(inputRender.calls.length).toBe(1);
      var checkInputProps = function checkInputProps(props, value) {
        expect(props.meta.pristine).toBe(true);
        expect(props.meta.dirty).toBe(false);
        expect(props.input.value).toBe(value);
      };
      checkInputProps(inputRender.calls[0].arguments[0], 'bar');

      // initialize
      var initButton = TestUtils.findRenderedDOMComponentWithTag(dom, 'button');
      TestUtils.Simulate.click(initButton);

      // check initialized state
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: [{
              name: 'deep.foo',
              type: 'Field'
            }],
            initial: initialValues1,
            values: initialValues1
          }
        }
      });

      // rerender just because prop changed
      expect(formRender.calls.length).toBe(2);

      // no need to rerender input since nothing changed
      expect(inputRender.calls.length).toBe(1);
    });

    it('should reinitialize with initialValues if enableReinitialize', function () {
      var store = makeStore({});
      var inputRender = createSpy(function (props) {
        return React.createElement('input', props.input);
      }).andCallThrough();
      var formRender = createSpy();
      var initialValues1 = {
        deep: {
          foo: 'bar'
        }
      };
      var initialValues2 = {
        deep: {
          foo: 'baz'
        }
      };

      var Form = function (_Component8) {
        _inherits(Form, _Component8);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            formRender(this.props);
            return React.createElement(
              'form',
              null,
              React.createElement(Field, { name: 'deep.foo', component: inputRender, type: 'text' })
            );
          }
        }]);

        return Form;
      }(Component);

      var Decorated = reduxForm({
        form: 'testForm',
        enableReinitialize: true
      })(Form);

      var Container = function (_Component9) {
        _inherits(Container, _Component9);

        function Container(props) {
          _classCallCheck(this, Container);

          var _this11 = _possibleConstructorReturn(this, (Container.__proto__ || Object.getPrototypeOf(Container)).call(this, props));

          _this11.state = { initialValues: initialValues1 };
          return _this11;
        }

        _createClass(Container, [{
          key: 'render',
          value: function render() {
            var _this12 = this;

            return React.createElement(
              'div',
              null,
              React.createElement(
                Provider,
                { store: store },
                React.createElement(Decorated, this.state)
              ),
              React.createElement(
                'button',
                { onClick: function onClick() {
                    return _this12.setState({ initialValues: initialValues2 });
                  } },
                'Init'
              )
            );
          }
        }]);

        return Container;
      }(Component);

      var dom = TestUtils.renderIntoDocument(React.createElement(Container, null));

      var checkInputProps = function checkInputProps(props, value) {
        var pristine = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
        var dirty = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

        expect(props.meta.pristine).toBe(pristine);
        expect(props.meta.dirty).toBe(dirty);
        expect(props.input.value).toBe(value);
      };

      // Check initial state
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: [{ name: 'deep.foo', type: 'Field' }],
            initial: initialValues1,
            values: initialValues1
          }
        }
      });

      // Expect renders due to initialization.
      expect(formRender).toHaveBeenCalled();
      expect(formRender.calls.length).toBe(1);

      expect(inputRender).toHaveBeenCalled();
      expect(inputRender.calls.length).toBe(1);

      // Expect that input value has been initialized
      checkInputProps(inputRender.calls[0].arguments[0], 'bar');

      // Change input value and check if it is dirty and not pristine
      var onChange = inputRender.calls[0].arguments[0].input.onChange;
      onChange('dirtyvalue');

      // Expect rerenders due to the change.
      expect(formRender).toHaveBeenCalled();
      expect(formRender.calls.length).toBe(2);

      expect(inputRender).toHaveBeenCalled();
      expect(inputRender.calls.length).toBe(2);

      // Expect that input value has been changed and is dirty now
      checkInputProps(inputRender.calls[1].arguments[0], 'dirtyvalue', false, true);

      // Re-initialize form and check if it is pristine and not dirty
      var initButton = TestUtils.findRenderedDOMComponentWithTag(dom, 'button');
      TestUtils.Simulate.click(initButton);

      // Check re-initialized state
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: [{
              name: 'deep.foo',
              type: 'Field'
            }],
            initial: initialValues2,
            values: initialValues2
          }
        }
      });

      // Expect rerenders due to the re-initialization.
      expect(formRender).toHaveBeenCalled();
      expect(formRender.calls.length).toBe(3);

      expect(inputRender).toHaveBeenCalled();
      expect(inputRender.calls.length).toBe(3);

      // Expect that input value has been re-initialized and is not dirty anymore
      checkInputProps(inputRender.calls[2].arguments[0], 'baz');
    });

    it('should retain dirty fields if keepDirtyOnReinitialize is set', function () {
      var store = makeStore({});
      var inputRender = createSpy(function (props) {
        return React.createElement('input', props.input);
      }).andCallThrough();
      var formRender = createSpy();
      var initialValues1 = {
        deep: {
          foo: 'bar'
        }
      };
      var initialValues2 = {
        deep: {
          foo: 'baz'
        }
      };

      var Form = function (_Component10) {
        _inherits(Form, _Component10);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            formRender(this.props);
            return React.createElement(
              'form',
              null,
              React.createElement(Field, { name: 'deep.foo', component: inputRender, type: 'text' })
            );
          }
        }]);

        return Form;
      }(Component);

      var Decorated = reduxForm({
        form: 'testForm',
        enableReinitialize: true,
        keepDirtyOnReinitialize: true
      })(Form);

      var Container = function (_Component11) {
        _inherits(Container, _Component11);

        function Container(props) {
          _classCallCheck(this, Container);

          var _this14 = _possibleConstructorReturn(this, (Container.__proto__ || Object.getPrototypeOf(Container)).call(this, props));

          _this14.state = { initialValues: initialValues1 };
          return _this14;
        }

        _createClass(Container, [{
          key: 'render',
          value: function render() {
            var _this15 = this;

            return React.createElement(
              'div',
              null,
              React.createElement(
                Provider,
                { store: store },
                React.createElement(Decorated, this.state)
              ),
              React.createElement(
                'button',
                { onClick: function onClick() {
                    return _this15.setState({ initialValues: initialValues2 });
                  } },
                'Init'
              )
            );
          }
        }]);

        return Container;
      }(Component);

      var dom = TestUtils.renderIntoDocument(React.createElement(Container, null));
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: [{ name: 'deep.foo', type: 'Field' }],
            initial: initialValues1,
            values: initialValues1
          }
        }
      });
      expect(formRender).toHaveBeenCalled();
      expect(formRender.calls.length).toBe(1);

      expect(inputRender).toHaveBeenCalled();
      expect(inputRender.calls.length).toBe(1);
      var checkInputProps = function checkInputProps(props, value, dirty) {
        expect(props.meta.pristine).toBe(!dirty);
        expect(props.meta.dirty).toBe(dirty);
        expect(props.input.value).toBe(value);
      };
      checkInputProps(inputRender.calls[0].arguments[0], 'bar', false);

      // Change the input value.
      var onChange = inputRender.calls[0].arguments[0].input.onChange;
      onChange('dirtyvalue');

      // Expect rerenders due to the change.
      expect(formRender.calls.length).toBe(2);
      expect(inputRender.calls.length).toBe(2);

      // Reinitialize the form
      var initButton = TestUtils.findRenderedDOMComponentWithTag(dom, 'button');
      TestUtils.Simulate.click(initButton);

      // check initialized state
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: [{
              name: 'deep.foo',
              type: 'Field'
            }],
            initial: initialValues2,
            values: {
              deep: {
                foo: 'dirtyvalue'
              }
            }
          }
        }
      });

      // Expect the form not to rerender, since the value did not change.
      expect(formRender.calls.length).toBe(2);

      // should rerender input with the dirty value.
      expect(inputRender.calls.length).toBe(2);
      checkInputProps(inputRender.calls[1].arguments[0], 'dirtyvalue', true);
    });

    it('should not retain dirty fields if keepDirtyOnReinitialize is not set', function () {
      var store = makeStore({});
      var inputRender = createSpy(function (props) {
        return React.createElement('input', props.input);
      }).andCallThrough();
      var formRender = createSpy();
      var initialValues1 = {
        deep: {
          foo: 'bar'
        }
      };
      var initialValues2 = {
        deep: {
          foo: 'baz'
        }
      };

      var Form = function (_Component12) {
        _inherits(Form, _Component12);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            formRender(this.props);
            return React.createElement(
              'form',
              null,
              React.createElement(Field, { name: 'deep.foo', component: inputRender, type: 'text' })
            );
          }
        }]);

        return Form;
      }(Component);

      var Decorated = reduxForm({
        form: 'testForm',
        enableReinitialize: true
      })(Form);

      var Container = function (_Component13) {
        _inherits(Container, _Component13);

        function Container(props) {
          _classCallCheck(this, Container);

          var _this17 = _possibleConstructorReturn(this, (Container.__proto__ || Object.getPrototypeOf(Container)).call(this, props));

          _this17.state = { initialValues: initialValues1 };
          return _this17;
        }

        _createClass(Container, [{
          key: 'render',
          value: function render() {
            var _this18 = this;

            return React.createElement(
              'div',
              null,
              React.createElement(
                Provider,
                { store: store },
                React.createElement(Decorated, this.state)
              ),
              React.createElement(
                'button',
                { onClick: function onClick() {
                    return _this18.setState({ initialValues: initialValues2 });
                  } },
                'Init'
              )
            );
          }
        }]);

        return Container;
      }(Component);

      var dom = TestUtils.renderIntoDocument(React.createElement(Container, null));
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: [{ name: 'deep.foo', type: 'Field' }],
            initial: initialValues1,
            values: initialValues1
          }
        }
      });
      expect(formRender).toHaveBeenCalled();
      expect(formRender.calls.length).toBe(1);

      expect(inputRender).toHaveBeenCalled();
      expect(inputRender.calls.length).toBe(1);
      var checkInputProps = function checkInputProps(props, value, dirty) {
        expect(props.meta.pristine).toBe(!dirty);
        expect(props.meta.dirty).toBe(dirty);
        expect(props.input.value).toBe(value);
      };
      checkInputProps(inputRender.calls[0].arguments[0], 'bar', false);

      // Change the input value.
      var onChange = inputRender.calls[0].arguments[0].input.onChange;
      onChange('dirtyvalue');

      // Expect rerenders due to the change.
      expect(formRender.calls.length).toBe(2);
      expect(inputRender.calls.length).toBe(2);

      // Reinitialize the form
      var initButton = TestUtils.findRenderedDOMComponentWithTag(dom, 'button');
      TestUtils.Simulate.click(initButton);

      // check initialized state
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: [{
              name: 'deep.foo',
              type: 'Field'
            }],
            initial: initialValues2,
            values: initialValues2
          }
        }
      });

      // Expect the form to rerender, since the value was replaced.
      expect(formRender.calls.length).toBe(3);

      // should rerender input with the pristine value.
      expect(inputRender.calls.length).toBe(3);
      checkInputProps(inputRender.calls[2].arguments[0], 'baz', false);
    });

    it('should be pristine after initialize() if enableReinitialize', function () {
      var store = makeStore({});
      var inputRender = createSpy(function (props) {
        return React.createElement('input', props.input);
      }).andCallThrough();
      var formRender = createSpy();
      var propsOnLastRender = function propsOnLastRender(componentSpy) {
        return componentSpy.calls[componentSpy.calls.length - 1].arguments[0];
      };
      var initialValues1 = {
        deep: {
          foo: 'bar'
        }
      };

      var Form = function (_Component14) {
        _inherits(Form, _Component14);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            formRender(this.props);
            return React.createElement(
              'form',
              null,
              React.createElement(Field, { name: 'deep.foo', component: inputRender, type: 'text' })
            );
          }
        }]);

        return Form;
      }(Component);

      var Decorated = reduxForm({
        form: 'testForm',
        enableReinitialize: true
      })(Form);

      var Container = function (_Component15) {
        _inherits(Container, _Component15);

        function Container(props) {
          _classCallCheck(this, Container);

          var _this20 = _possibleConstructorReturn(this, (Container.__proto__ || Object.getPrototypeOf(Container)).call(this, props));

          _this20.state = { initialValues: initialValues1 };
          return _this20;
        }

        _createClass(Container, [{
          key: 'render',
          value: function render() {
            return React.createElement(
              'div',
              null,
              React.createElement(
                Provider,
                { store: store },
                React.createElement(Decorated, this.state)
              )
            );
          }
        }]);

        return Container;
      }(Component);

      TestUtils.renderIntoDocument(React.createElement(Container, null));

      propsOnLastRender(inputRender).input.onChange('newBar');

      expect(propsOnLastRender(inputRender).input.value).toBe('newBar');
      expect(propsOnLastRender(inputRender).meta.pristine).toBe(false, 'Input should not have been pristine');
      expect(propsOnLastRender(formRender).pristine).toBe(false, 'Form should not have been pristine');

      store.dispatch(initialize('testForm', {
        deep: {
          foo: 'baz'
        }
      }));

      expect(propsOnLastRender(inputRender).input.value).toBe('baz');
      expect(propsOnLastRender(inputRender).meta.pristine).toBe(true, 'Input should have been pristine after initialize');
      expect(propsOnLastRender(formRender).pristine).toBe(true, 'Form should have been pristine after initialize');
    });

    it('should make pristine any dirty field that has the new initial value, when keepDirtyOnReinitialize', function () {
      var store = makeStore({});
      var inputRender = createSpy(function (props) {
        return React.createElement('input', props.input);
      }).andCallThrough();
      var formRender = createSpy();
      var initialValues1 = {
        deep: {
          foo: 'bar'
        }
      };
      var initialValues2 = {
        deep: {
          foo: 'futurevalue'
        }
      };

      var Form = function (_Component16) {
        _inherits(Form, _Component16);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            formRender(this.props);
            return React.createElement(
              'form',
              null,
              React.createElement(Field, { name: 'deep.foo', component: inputRender, type: 'text' })
            );
          }
        }]);

        return Form;
      }(Component);

      var Decorated = reduxForm({
        form: 'testForm',
        enableReinitialize: true,
        keepDirtyOnReinitialize: true
      })(Form);

      var Container = function (_Component17) {
        _inherits(Container, _Component17);

        function Container(props) {
          _classCallCheck(this, Container);

          var _this22 = _possibleConstructorReturn(this, (Container.__proto__ || Object.getPrototypeOf(Container)).call(this, props));

          _this22.state = { initialValues: initialValues1 };
          return _this22;
        }

        _createClass(Container, [{
          key: 'render',
          value: function render() {
            var _this23 = this;

            return React.createElement(
              'div',
              null,
              React.createElement(
                Provider,
                { store: store },
                React.createElement(Decorated, this.state)
              ),
              React.createElement(
                'button',
                { onClick: function onClick() {
                    return _this23.setState({ initialValues: initialValues2 });
                  } },
                'Init'
              )
            );
          }
        }]);

        return Container;
      }(Component);

      var dom = TestUtils.renderIntoDocument(React.createElement(Container, null));
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: [{ name: 'deep.foo', type: 'Field' }],
            initial: initialValues1,
            values: initialValues1
          }
        }
      });
      expect(formRender).toHaveBeenCalled();
      expect(formRender.calls.length).toBe(1);

      expect(inputRender).toHaveBeenCalled();
      expect(inputRender.calls.length).toBe(1);
      var checkInputProps = function checkInputProps(props, value, dirty) {
        expect(props.meta.pristine).toBe(!dirty);
        expect(props.meta.dirty).toBe(dirty);
        expect(props.input.value).toBe(value);
      };
      checkInputProps(inputRender.calls[0].arguments[0], 'bar', false);

      // Change the input value.
      var onChange = inputRender.calls[0].arguments[0].input.onChange;
      onChange('futurevalue');

      // Expect rerenders due to the change.
      expect(formRender.calls.length).toBe(2);
      expect(inputRender.calls.length).toBe(2);

      // Reinitialize the form
      var initButton = TestUtils.findRenderedDOMComponentWithTag(dom, 'button');
      TestUtils.Simulate.click(initButton);

      // check initialized state
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: [{
              name: 'deep.foo',
              type: 'Field'
            }],
            initial: initialValues2,
            values: initialValues2
          }
        }
      });

      // Expect the form to rerender only once more because the value did
      // not change.
      expect(formRender.calls.length).toBe(3);

      // should rerender input with the new value that is now pristine.
      expect(inputRender.calls.length).toBe(3);
      checkInputProps(inputRender.calls[2].arguments[0], 'futurevalue', false);
    });

    // Test related to #1436
    /*
     it('should allow initialization via action to set pristine', () => {
     const store = makeStore({})
     const inputRender = createSpy(props => <input {...props.input}/>).andCallThrough()
     const formRender = createSpy()
     const initialValues1 = {
     deep: {
     foo: 'bar'
     }
     }
     const initialValues2 = {
     deep: {
     foo: 'baz'
     }
     }
      class Form extends Component {
     render() {
     formRender(this.props)
     return (
     <form>
     <Field name="deep.foo" component={inputRender} type="text"/>
     </form>
     )
     }
     }
     const Decorated = reduxForm({
     form: 'testForm',
     initialValues: initialValues1
     })(Form)
      TestUtils.renderIntoDocument(
     <Provider store={store}>
     <Decorated/>
     </Provider>
     )
     expect(store.getState()).toEqualMap({
     form: {
     testForm: {
     registeredFields: [ { name: 'deep.foo', type: 'Field' } ],
     initial: initialValues1,
     values: initialValues1
     }
     }
     })
     expect(formRender).toHaveBeenCalled()
     expect(formRender.calls.length).toBe(1)
     expect(propsAtNthRender(formRender, 0).pristine).toBe(true)
      expect(inputRender).toHaveBeenCalled()
     expect(inputRender.calls.length).toBe(1)
     expect(propsAtNthRender(inputRender, 0).meta.pristine).toBe(true)
     expect(propsAtNthRender(inputRender, 0).input.value).toBe('bar')
      // check initialized state
     expect(store.getState()).toEqualMap({
     form: {
     testForm: {
     registeredFields: [
     {
     name: 'deep.foo',
     type: 'Field'
     }
     ],
     initial: initialValues1,
     values: initialValues1
     }
     }
     })
      // initialize with action
     store.dispatch(initialize('testForm', initialValues2))
      // check initialized state
     expect(store.getState()).toEqualMap({
     form: {
     testForm: {
     registeredFields: [
     {
     name: 'deep.foo',
     type: 'Field'
     }
     ],
     initial: initialValues2,
     values: initialValues2
     }
     }
     })
      // rerendered
     expect(formRender.calls.length).toBe(2)
     expect(propsAtNthRender(formRender, 1).pristine).toBe(true)
      expect(inputRender).toHaveBeenCalled()
     expect(inputRender.calls.length).toBe(2)
     expect(propsAtNthRender(inputRender, 1).meta.pristine).toBe(true)
     expect(propsAtNthRender(inputRender, 1).input.value).toBe('baz')
     })
     */

    it('should destroy on unmount by default', function () {
      var store = makeStore({});
      var inputRender = createSpy(function (props) {
        return React.createElement('input', props.input);
      }).andCallThrough();
      var formRender = createSpy();

      var Form = function (_Component18) {
        _inherits(Form, _Component18);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            formRender(this.props);
            return React.createElement(
              'form',
              null,
              React.createElement(Field, { name: 'deep.foo', component: inputRender, type: 'text' })
            );
          }
        }]);

        return Form;
      }(Component);

      var Decorated = reduxForm({
        form: 'testForm'
      })(Form);

      var Container = function (_Component19) {
        _inherits(Container, _Component19);

        function Container(props) {
          _classCallCheck(this, Container);

          var _this25 = _possibleConstructorReturn(this, (Container.__proto__ || Object.getPrototypeOf(Container)).call(this, props));

          _this25.state = { showForm: true };
          return _this25;
        }

        _createClass(Container, [{
          key: 'render',
          value: function render() {
            var _this26 = this;

            var showForm = this.state.showForm;

            return React.createElement(
              'div',
              null,
              React.createElement(
                Provider,
                { store: store },
                React.createElement(
                  'div',
                  null,
                  showForm && React.createElement(Decorated, this.state)
                )
              ),
              React.createElement(
                'button',
                { onClick: function onClick() {
                    return _this26.setState({ showForm: !showForm });
                  } },
                'Toggle'
              )
            );
          }
        }]);

        return Container;
      }(Component);

      var dom = TestUtils.renderIntoDocument(React.createElement(Container, null));
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: [{ name: 'deep.foo', type: 'Field' }]
          }
        }
      }, 'Form data in Redux did not get destroyed');
      expect(formRender).toHaveBeenCalled();
      expect(formRender.calls.length).toBe(1);

      expect(inputRender).toHaveBeenCalled();
      expect(inputRender.calls.length).toBe(1);
      expect(propsAtNthRender(inputRender, 0).input.value).toBe('');

      // change field
      inputRender.calls[0].arguments[0].input.onChange('bob');

      // form rerenders because now dirty
      expect(formRender.calls.length).toBe(2);

      // input now has value
      expect(inputRender.calls.length).toBe(2);
      expect(propsAtNthRender(inputRender, 1).input.value).toBe('bob');

      // check state
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            values: {
              deep: {
                foo: 'bob'
              }
            },
            registeredFields: [{ name: 'deep.foo', type: 'Field' }]
          }
        }
      });

      // unmount form
      var toggle = TestUtils.findRenderedDOMComponentWithTag(dom, 'button');
      TestUtils.Simulate.click(toggle);

      // check clean state
      expect(store.getState()).toEqualMap({
        form: {}
      });

      // form still not rendered again
      expect(formRender.calls.length).toBe(2);

      // toggle form back into existence
      TestUtils.Simulate.click(toggle);

      // form is back
      expect(formRender.calls.length).toBe(3);

      // input is back, but without value
      expect(inputRender.calls.length).toBe(3);
      expect(propsAtNthRender(inputRender, 2).input.value).toBe('');
    });

    it('should not destroy on unmount if told not to', function () {
      var store = makeStore({});
      var inputRender = createSpy(function (props) {
        return React.createElement('input', props.input);
      }).andCallThrough();
      var formRender = createSpy();

      var Form = function (_Component20) {
        _inherits(Form, _Component20);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            formRender(this.props);
            return React.createElement(
              'form',
              null,
              React.createElement(Field, { name: 'deep.foo', component: inputRender, type: 'text' })
            );
          }
        }]);

        return Form;
      }(Component);

      var Decorated = reduxForm({
        form: 'testForm',
        destroyOnUnmount: false
      })(Form);

      var Container = function (_Component21) {
        _inherits(Container, _Component21);

        function Container(props) {
          _classCallCheck(this, Container);

          var _this28 = _possibleConstructorReturn(this, (Container.__proto__ || Object.getPrototypeOf(Container)).call(this, props));

          _this28.state = { showForm: true };
          return _this28;
        }

        _createClass(Container, [{
          key: 'render',
          value: function render() {
            var _this29 = this;

            var showForm = this.state.showForm;

            return React.createElement(
              'div',
              null,
              React.createElement(
                Provider,
                { store: store },
                React.createElement(
                  'div',
                  null,
                  showForm && React.createElement(Decorated, this.state)
                )
              ),
              React.createElement(
                'button',
                { onClick: function onClick() {
                    return _this29.setState({ showForm: !showForm });
                  } },
                'Toggle'
              )
            );
          }
        }]);

        return Container;
      }(Component);

      var dom = TestUtils.renderIntoDocument(React.createElement(Container, null));
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: [{ name: 'deep.foo', type: 'Field' }]
          }
        }
      }, 'Form data in Redux did not get destroyed');
      expect(formRender).toHaveBeenCalled();
      expect(formRender.calls.length).toBe(1);

      expect(inputRender).toHaveBeenCalled();
      expect(inputRender.calls.length).toBe(1);
      expect(propsAtNthRender(inputRender, 0).input.value).toBe('');

      // change field
      inputRender.calls[0].arguments[0].input.onChange('bob');

      // form rerenders because now dirty
      expect(formRender.calls.length).toBe(2);

      // input now has value
      expect(inputRender.calls.length).toBe(2);
      expect(propsAtNthRender(inputRender, 1).input.value).toBe('bob');

      // check state
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            values: {
              deep: {
                foo: 'bob'
              }
            },
            registeredFields: [{ name: 'deep.foo', type: 'Field' }]
          }
        }
      });

      // unmount form
      var toggle = TestUtils.findRenderedDOMComponentWithTag(dom, 'button');
      TestUtils.Simulate.click(toggle);

      // check state not destroyed
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            values: {
              deep: {
                foo: 'bob'
              }
            },
            registeredFields: [{ name: 'deep.foo', type: 'Field' }]
          }
        }
      });

      // form still not rendered again
      expect(formRender.calls.length).toBe(2);

      // toggle form back into existence
      TestUtils.Simulate.click(toggle);

      // form is back
      expect(formRender.calls.length).toBe(3);

      // input is back, with its old value
      expect(inputRender.calls.length).toBe(3);
      expect(propsAtNthRender(inputRender, 2).input.value).toBe('bob');
    });

    it('should keep a list of registered fields', function () {
      var store = makeStore({});
      var noopRender = function noopRender() {
        return React.createElement('div', null);
      };

      var Form = function (_Component22) {
        _inherits(Form, _Component22);

        function Form() {
          _classCallCheck(this, Form);

          var _this30 = _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).call(this));

          _this30.state = { showBar: false };
          return _this30;
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            var _this31 = this;

            var showBar = this.state.showBar;

            return React.createElement(
              'form',
              null,
              !showBar && React.createElement(Field, { name: 'foo', component: 'input', type: 'text' }),
              !showBar && React.createElement(FieldArray, { name: 'fooArray', component: noopRender, type: 'text' }),
              showBar && React.createElement(Field, { name: 'bar', component: 'input', type: 'text' }),
              showBar && React.createElement(FieldArray, { name: 'barArray', component: noopRender, type: 'text' }),
              React.createElement(
                'button',
                { onClick: function onClick() {
                    return _this31.setState({ showBar: true });
                  } },
                'Show Bar'
              )
            );
          }
        }]);

        return Form;
      }(Component);

      var Decorated = reduxForm({ form: 'testForm' })(Form);

      var dom = TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(Decorated, null)
      ));

      var stub = TestUtils.findRenderedComponentWithType(dom, Decorated);
      expect(stub.fieldList).toEqual(fromJS(['foo', 'fooArray']));

      // switch fields
      var button = TestUtils.findRenderedDOMComponentWithTag(dom, 'button');
      TestUtils.Simulate.click(button);

      expect(stub.fieldList).toEqual(fromJS(['bar', 'barArray']));
    });

    it('should keep a list of registered fields inside a FormSection', function () {
      var store = makeStore({});
      var noopRender = function noopRender() {
        return React.createElement('div', null);
      };

      var Form = function (_Component23) {
        _inherits(Form, _Component23);

        function Form() {
          _classCallCheck(this, Form);

          var _this32 = _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).call(this));

          _this32.state = { showBar: false };
          return _this32;
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            var _this33 = this;

            var showBar = this.state.showBar;

            return React.createElement(
              'form',
              null,
              React.createElement(
                FormSection,
                { name: 'sec' },
                !showBar && React.createElement(Field, { name: 'foo', component: 'input', type: 'text' }),
                !showBar && React.createElement(FieldArray, { name: 'fooArray', component: noopRender, type: 'text' }),
                showBar && React.createElement(Field, { name: 'bar', component: 'input', type: 'text' }),
                showBar && React.createElement(FieldArray, { name: 'barArray', component: noopRender, type: 'text' }),
                React.createElement(
                  'button',
                  { onClick: function onClick() {
                      return _this33.setState({ showBar: true });
                    } },
                  'Show Bar'
                )
              )
            );
          }
        }]);

        return Form;
      }(Component);

      var Decorated = reduxForm({ form: 'testForm' })(Form);

      var dom = TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(Decorated, null)
      ));

      var stub = TestUtils.findRenderedComponentWithType(dom, Decorated);
      expect(stub.fieldList).toEqual(fromJS(['sec.foo', 'sec.fooArray']));

      // switch fields
      var button = TestUtils.findRenderedDOMComponentWithTag(dom, 'button');
      TestUtils.Simulate.click(button);

      expect(stub.fieldList).toEqual(fromJS(['sec.bar', 'sec.barArray']));
    });

    it('should provide valid/invalid/values/dirty/pristine getters', function () {
      var store = makeStore({});
      var input = createSpy(function (props) {
        return React.createElement('input', props.input);
      }).andCallThrough();

      var Form = function Form() {
        return React.createElement(
          'form',
          null,
          React.createElement(Field, { name: 'bar', component: input, type: 'text' })
        );
      };

      var Decorated = reduxForm({
        form: 'testForm',
        validate: function validate(values) {
          return getIn(values, 'bar') ? {} : { bar: 'Required' };
        }
      })(Form);

      var dom = TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(Decorated, null)
      ));

      var stub = TestUtils.findRenderedComponentWithType(dom, Decorated);

      // invalid because no value for 'bar' field
      expect(stub.dirty).toBe(false);
      expect(stub.pristine).toBe(true);
      expect(stub.valid).toBe(false);
      expect(stub.invalid).toBe(true);
      expect(stub.values).toEqualMap({});

      // set value for 'bar' field
      input.calls[0].arguments[0].input.onChange('foo');

      // valid because we have a value for 'bar' field
      expect(stub.dirty).toBe(true);
      expect(stub.pristine).toBe(false);
      expect(stub.valid).toBe(true);
      expect(stub.invalid).toBe(false);
      expect(stub.values).toEqualMap({ bar: 'foo' });
    });

    it('should mark all fields as touched on submit', function () {
      var store = makeStore({
        testForm: {}
      });
      var username = createSpy(function (props) {
        return React.createElement('input', _extends({}, props.input, { type: 'text' }));
      }).andCallThrough();
      var password = createSpy(function (props) {
        return React.createElement('input', _extends({}, props.input, {
          type: 'password' }));
      }).andCallThrough();

      var Form = function Form() {
        return React.createElement(
          'form',
          null,
          React.createElement(Field, { name: 'username', component: username, type: 'text' }),
          React.createElement(Field, { name: 'password', component: password, type: 'text' })
        );
      };

      var Decorated = reduxForm({
        form: 'testForm',
        onSubmit: function onSubmit() {
          return { _error: 'Login Failed' };
        }
      })(Form);

      var dom = TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(Decorated, null)
      ));

      var stub = TestUtils.findRenderedComponentWithType(dom, Decorated);

      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: [{ name: 'username', type: 'Field' }, { name: 'password', type: 'Field' }]
          }
        }
      });

      expect(username).toHaveBeenCalled();
      expect(propsAtNthRender(username, 0).meta.touched).toBe(false);

      expect(password).toHaveBeenCalled();
      expect(propsAtNthRender(password, 0).meta.touched).toBe(false);

      expect(stub.submit).toBeA('function');
      stub.submit();

      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: [{ name: 'username', type: 'Field' }, { name: 'password', type: 'Field' }],
            anyTouched: true,
            fields: {
              username: {
                touched: true
              },
              password: {
                touched: true
              }
            },
            submitSucceeded: true
          }
        }
      });

      expect(username.calls.length).toBe(2);
      expect(propsAtNthRender(username, 1).meta.touched).toBe(true);

      expect(password.calls.length).toBe(2);
      expect(propsAtNthRender(password, 1).meta.touched).toBe(true);
    });

    it('should call onSubmitFail with errors if sync submit fails by throwing SubmissionError', function () {
      var store = makeStore({
        testForm: {}
      });
      var errors = { username: 'Required' };
      var onSubmitFail = createSpy();

      var Form = function Form() {
        return React.createElement(
          'form',
          null,
          React.createElement(Field, { name: 'username', component: 'input', type: 'text' }),
          React.createElement(Field, { name: 'password', component: 'input', type: 'text' })
        );
      };

      var Decorated = reduxForm({
        form: 'testForm',
        onSubmit: function onSubmit() {
          throw new SubmissionError(errors);
        },
        onSubmitFail: onSubmitFail
      })(Form);

      var dom = TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(Decorated, null)
      ));

      var stub = TestUtils.findRenderedComponentWithType(dom, Decorated);

      expect(stub.submit).toBeA('function');

      expect(onSubmitFail).toNotHaveBeenCalled();

      var caught = stub.submit();

      expect(onSubmitFail).toHaveBeenCalled();
      expect(onSubmitFail.calls[0].arguments[0]).toEqual(errors);
      expect(onSubmitFail.calls[0].arguments[1]).toEqual(store.dispatch);
      expect(onSubmitFail.calls[0].arguments[2]).toBeA(SubmissionError);
      expect(caught).toBe(errors);
    });

    it('should call onSubmitFail with undefined if sync submit fails by throwing other error', function () {
      var store = makeStore({
        testForm: {}
      });
      var onSubmitFail = createSpy();

      var Form = function Form() {
        return React.createElement(
          'form',
          null,
          React.createElement(Field, { name: 'username', component: 'input', type: 'text' }),
          React.createElement(Field, { name: 'password', component: 'input', type: 'text' })
        );
      };

      var Decorated = reduxForm({
        form: 'testForm',
        onSubmit: function onSubmit() {
          throw new Error('Some other error');
        },
        onSubmitFail: onSubmitFail
      })(Form);

      var dom = TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(Decorated, null)
      ));

      var stub = TestUtils.findRenderedComponentWithType(dom, Decorated);

      expect(stub.submit).toBeA('function');

      expect(onSubmitFail).toNotHaveBeenCalled();

      var caught = stub.submit();

      expect(onSubmitFail).toHaveBeenCalled();
      expect(onSubmitFail.calls[0].arguments[0]).toEqual(undefined);
      expect(onSubmitFail.calls[0].arguments[1]).toEqual(store.dispatch);
      expect(onSubmitFail.calls[0].arguments[2]).toBeA(Error);
      expect(caught).toNotExist();
    });

    it('should call onSubmitFail if async submit fails', function () {
      var store = makeStore({
        testForm: {}
      });
      var errors = { username: 'Required' };
      var onSubmitFail = createSpy();

      var Form = function Form() {
        return React.createElement(
          'form',
          null,
          React.createElement(Field, { name: 'username', component: 'input', type: 'text' }),
          React.createElement(Field, { name: 'password', component: 'input', type: 'text' })
        );
      };

      var Decorated = reduxForm({
        form: 'testForm',
        onSubmit: function onSubmit() {
          return Promise.reject(new SubmissionError(errors));
        },
        onSubmitFail: onSubmitFail
      })(Form);

      var dom = TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(Decorated, null)
      ));

      var stub = TestUtils.findRenderedComponentWithType(dom, Decorated);

      expect(stub.submit).toBeA('function');

      expect(onSubmitFail).toNotHaveBeenCalled();

      return stub.submit().then(function (caught) {
        expect(onSubmitFail).toHaveBeenCalled();
        expect(onSubmitFail.calls[0].arguments[0]).toEqual(errors);
        expect(onSubmitFail.calls[0].arguments[1]).toEqual(store.dispatch);
        expect(onSubmitFail.calls[0].arguments[2]).toBeA(SubmissionError);
        expect(caught).toBe(errors);
      });
    });

    it('should call onSubmitFail if sync validation prevents submit', function () {
      var store = makeStore({
        testForm: {}
      });
      var errors = { username: 'Required' };
      var onSubmit = createSpy();
      var onSubmitFail = createSpy();

      var Form = function Form() {
        return React.createElement(
          'form',
          null,
          React.createElement(Field, { name: 'username', component: 'input', type: 'text' }),
          React.createElement(Field, { name: 'password', component: 'input', type: 'text' })
        );
      };

      var Decorated = reduxForm({
        form: 'testForm',
        onSubmit: onSubmit,
        onSubmitFail: onSubmitFail,
        validate: function validate() {
          return errors;
        }
      })(Form);

      var dom = TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(Decorated, null)
      ));

      var stub = TestUtils.findRenderedComponentWithType(dom, Decorated);

      expect(stub.submit).toBeA('function');

      expect(onSubmitFail).toNotHaveBeenCalled();
      expect(onSubmit).toNotHaveBeenCalled();

      var result = stub.submit();
      expect(onSubmit).toNotHaveBeenCalled();
      expect(onSubmitFail).toHaveBeenCalled();
      expect(onSubmitFail.calls[0].arguments[0]).toEqual(errors);
      expect(onSubmitFail.calls[0].arguments[1]).toEqual(store.dispatch);
      expect(onSubmitFail.calls[0].arguments[2]).toBe(null);
      expect(result).toEqual(errors);
    });

    it('should call onSubmitFail if async validation prevents submit', function () {
      var store = makeStore({
        testForm: {}
      });
      var errors = { username: 'Required' };
      var onSubmit = createSpy();
      var onSubmitFail = createSpy();

      var Form = function Form() {
        return React.createElement(
          'form',
          null,
          React.createElement(Field, { name: 'username', component: 'input', type: 'text' }),
          React.createElement(Field, { name: 'password', component: 'input', type: 'text' })
        );
      };

      var Decorated = reduxForm({
        form: 'testForm',
        asyncValidate: function asyncValidate() {
          return Promise.reject(errors);
        },
        onSubmit: onSubmit,
        onSubmitFail: onSubmitFail
      })(Form);

      var dom = TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(Decorated, null)
      ));

      var stub = TestUtils.findRenderedComponentWithType(dom, Decorated);

      expect(stub.submit).toBeA('function');

      expect(onSubmit).toNotHaveBeenCalled();
      expect(onSubmitFail).toNotHaveBeenCalled();

      return stub.submit().catch(function (error) {
        expect(onSubmit).toNotHaveBeenCalled();
        expect(onSubmitFail).toHaveBeenCalled();
        expect(onSubmitFail.calls[0].arguments[0]).toEqual(errors);
        expect(onSubmitFail.calls[0].arguments[1]).toEqual(store.dispatch);
        expect(onSubmitFail.calls[0].arguments[2]).toBe(null);
        expect(error).toBe(errors);
      });
    });

    it('should call onSubmitSuccess if sync submit succeeds', function () {
      var store = makeStore({
        testForm: {}
      });
      var result = { message: 'Good job!' };
      var onSubmitSuccess = createSpy();

      var Form = function Form() {
        return React.createElement(
          'form',
          null,
          React.createElement(Field, { name: 'username', component: 'input', type: 'text' }),
          React.createElement(Field, { name: 'password', component: 'input', type: 'text' })
        );
      };

      var Decorated = reduxForm({
        form: 'testForm',
        onSubmit: function onSubmit() {
          return result;
        },
        onSubmitSuccess: onSubmitSuccess
      })(Form);

      var dom = TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(Decorated, null)
      ));

      var stub = TestUtils.findRenderedComponentWithType(dom, Decorated);

      expect(stub.submit).toBeA('function');

      expect(onSubmitSuccess).toNotHaveBeenCalled();

      var returned = stub.submit();

      expect(onSubmitSuccess).toHaveBeenCalled().toHaveBeenCalledWith(result, store.dispatch);
      expect(returned).toBe(result);
    });

    it('should call onSubmitSuccess if async submit succeeds', function () {
      var store = makeStore({
        testForm: {}
      });
      var result = { message: 'Good job!' };
      var onSubmitSuccess = createSpy();

      var Form = function Form() {
        return React.createElement(
          'form',
          null,
          React.createElement(Field, { name: 'username', component: 'input', type: 'text' }),
          React.createElement(Field, { name: 'password', component: 'input', type: 'text' })
        );
      };

      var Decorated = reduxForm({
        form: 'testForm',
        onSubmit: function onSubmit() {
          return Promise.resolve(result);
        },
        onSubmitSuccess: onSubmitSuccess
      })(Form);

      var dom = TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(Decorated, null)
      ));

      var stub = TestUtils.findRenderedComponentWithType(dom, Decorated);

      expect(stub.submit).toBeA('function');

      expect(onSubmitSuccess).toNotHaveBeenCalled();

      return stub.submit().then(function (returned) {
        expect(onSubmitSuccess).toHaveBeenCalled().toHaveBeenCalledWith(result, store.dispatch);
        expect(returned).toBe(result);
      });
    });

    it('should return error thrown by sync onSubmit', function () {
      var store = makeStore({
        testForm: {}
      });
      var errors = { username: 'Required' };

      var Form = function Form() {
        return React.createElement(
          'form',
          null,
          React.createElement(Field, { name: 'username', component: 'input', type: 'text' }),
          React.createElement(Field, { name: 'password', component: 'input', type: 'text' })
        );
      };

      var Decorated = reduxForm({
        form: 'testForm',
        onSubmit: function onSubmit() {
          throw new SubmissionError(errors);
        }
      })(Form);

      var dom = TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(Decorated, null)
      ));

      var stub = TestUtils.findRenderedComponentWithType(dom, Decorated);

      expect(stub.submit).toBeA('function');

      var caught = stub.submit();

      expect(caught).toBe(errors);
    });

    it('should submit when submit() called and onSubmit provided as config param', function () {
      var store = makeStore({
        testForm: {
          values: {
            bar: 'foo'
          }
        }
      });
      var input = createSpy(function (props) {
        return React.createElement('input', props.input);
      }).andCallThrough();

      var Form = function Form() {
        return React.createElement(
          'form',
          null,
          React.createElement(Field, { name: 'bar', component: input, type: 'text' })
        );
      };

      var Decorated = reduxForm({
        form: 'testForm',
        onSubmit: function onSubmit(values) {
          expect(values).toEqualMap({ bar: 'foo' });
        }
      })(Form);

      var dom = TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(Decorated, null)
      ));

      var stub = TestUtils.findRenderedComponentWithType(dom, Decorated);

      expect(input).toHaveBeenCalled();
      expect(propsAtNthRender(input, 0).input.value).toBe('foo');

      expect(stub.submit).toBeA('function');
      stub.submit();
    });

    it('should submit when "submit" button is clicked and handleSubmit provided function', function () {
      var store = makeStore({
        testForm: {
          values: {
            bar: 'foo'
          }
        }
      });
      var submit = createSpy();

      var Form = function Form(_ref) {
        var handleSubmit = _ref.handleSubmit;
        return React.createElement(
          'form',
          { onSubmit: handleSubmit(submit) },
          React.createElement(Field, { name: 'bar', component: 'textarea' }),
          React.createElement('input', { type: 'submit', value: 'Submit' })
        );
      };

      var Decorated = reduxForm({
        form: 'testForm'
      })(Form);

      var dom = TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(Decorated, null)
      ));

      var form = TestUtils.findRenderedDOMComponentWithTag(dom, 'form');

      expect(submit).toNotHaveBeenCalled();

      TestUtils.Simulate.submit(form);

      expect(submit).toHaveBeenCalled();
    });

    it('should be fine if form is not yet in Redux store', function () {
      var store = makeStore({
        anotherForm: {
          values: {
            bar: 'foo'
          }
        }
      });
      var input = createSpy(function (props) {
        return React.createElement('input', props.input);
      }).andCallThrough();

      var Form = function Form() {
        return React.createElement(
          'form',
          null,
          React.createElement(Field, { name: 'foo', component: input, type: 'text' })
        );
      };

      var Decorated = reduxForm({
        form: 'testForm'
      })(Form);

      TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(Decorated, null)
      ));

      expect(input).toHaveBeenCalled();
      expect(propsAtNthRender(input, 0).input.value).toBe('');
    });

    it('should be fine if getFormState returns nothing', function () {
      var store = makeStore({});
      var input = createSpy(function (props) {
        return React.createElement('input', props.input);
      }).andCallThrough();

      var Form = function Form() {
        return React.createElement(
          'form',
          null,
          React.createElement(Field, { name: 'foo', component: input, type: 'text' })
        );
      };

      var Decorated = reduxForm({
        form: 'testForm',
        getFormState: function getFormState() {
          return undefined;
        }
      })(Form);

      TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(Decorated, null)
      ));

      expect(input).toHaveBeenCalled();
      expect(propsAtNthRender(input, 0).input.value).toBe('');
    });

    it('should throw an error when no onSubmit is specified', function () {
      var store = makeStore({
        testForm: {
          values: {
            bar: 'foo'
          }
        }
      });

      var Form = function Form() {
        return React.createElement(
          'form',
          null,
          React.createElement(Field, { name: 'bar', component: 'input', type: 'text' })
        );
      };

      var Decorated = reduxForm({
        form: 'testForm'
      })(Form);

      var dom = TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(Decorated, null)
      ));

      var stub = TestUtils.findRenderedComponentWithType(dom, Decorated);
      expect(function () {
        return stub.submit();
      }).toThrow(/onSubmit function or pass onSubmit as a prop/);
    });

    it('should submit (with async validation) when submit() called', function () {
      var store = makeStore({
        testForm: {
          values: {
            bar: 'foo'
          }
        }
      });
      var input = createSpy(function (props) {
        return React.createElement('input', props.input);
      }).andCallThrough();
      var asyncValidate = createSpy(function () {
        return Promise.resolve();
      }).andCallThrough();

      var Form = function Form() {
        return React.createElement(
          'form',
          null,
          React.createElement(Field, { name: 'bar', component: input, type: 'text' })
        );
      };

      var Decorated = reduxForm({
        form: 'testForm',
        asyncValidate: asyncValidate,
        onSubmit: function onSubmit(values) {
          expect(values).toEqualMap({ bar: 'foo' });
        }
      })(Form);

      var dom = TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(Decorated, null)
      ));

      var stub = TestUtils.findRenderedComponentWithType(dom, Decorated);

      expect(input).toHaveBeenCalled();
      expect(propsAtNthRender(input, 0).input.value).toBe('foo');

      expect(asyncValidate).toNotHaveBeenCalled();

      expect(stub.submit).toBeA('function');
      stub.submit();

      expect(asyncValidate).toHaveBeenCalled();
      expect(propsAtNthRender(asyncValidate, 0)).toEqualMap({ bar: 'foo' });
    });

    it('should not call async validation more than once if submit is clicked fast when handleSubmit receives an event', function () {
      var store = makeStore({
        testForm: {
          values: {
            bar: 'foo'
          }
        }
      });
      var input = createSpy(function (props) {
        return React.createElement('input', props.input);
      }).andCallThrough();
      var asyncValidate = createSpy(function () {
        return new Promise(function (resolve) {
          return setTimeout(resolve, 100);
        });
      }).andCallThrough();
      var onSubmit = function onSubmit(values) {
        expect(values).toEqualMap({ bar: 'foo' });
      };

      var Form = function Form(_ref2) {
        var handleSubmit = _ref2.handleSubmit;
        return React.createElement(
          'form',
          { onSubmit: handleSubmit },
          React.createElement(Field, { name: 'bar', component: input, type: 'text' })
        );
      };

      var Decorated = reduxForm({
        form: 'testForm',
        asyncValidate: asyncValidate,
        onSubmit: onSubmit
      })(Form);

      var dom = TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(Decorated, null)
      ));

      var form = TestUtils.findRenderedDOMComponentWithTag(dom, 'form');

      expect(input).toHaveBeenCalled();
      expect(propsAtNthRender(input, 0).input.value).toBe('foo');

      expect(asyncValidate).toNotHaveBeenCalled();

      TestUtils.Simulate.submit(form);
      TestUtils.Simulate.submit(form);
      TestUtils.Simulate.submit(form);
      TestUtils.Simulate.submit(form);
      TestUtils.Simulate.submit(form);

      expect(asyncValidate).toHaveBeenCalled();
      expect(asyncValidate.calls.length).toBe(1);
      expect(propsAtNthRender(asyncValidate, 0)).toEqualMap({ bar: 'foo' });
    });

    it('should return rejected promise when submit is rejected', function () {
      var store = makeStore({
        testForm: {
          values: {
            bar: 'foo'
          }
        }
      });

      var Form = function Form() {
        return React.createElement(
          'form',
          null,
          React.createElement(Field, { name: 'bar', component: 'input', type: 'text' })
        );
      };

      var Decorated = reduxForm({
        form: 'testForm',
        onSubmit: function onSubmit() {
          return Promise.reject(new SubmissionError('Rejection'));
        }
      })(Form);

      var dom = TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(Decorated, null)
      ));

      var stub = TestUtils.findRenderedComponentWithType(dom, Decorated);
      return stub.submit().then(function (err) {
        expect(err).toBe('Rejection');
      });
    });

    it('should not call async validation more than once if submit is clicked fast when handleSubmit receives a function', function () {
      var store = makeStore({
        testForm: {
          values: {
            bar: 'foo'
          }
        }
      });
      var input = createSpy(function (props) {
        return React.createElement('input', props.input);
      }).andCallThrough();
      var asyncValidate = createSpy(function () {
        return new Promise(function (resolve) {
          return setTimeout(resolve, 100);
        });
      }).andCallThrough();
      var onSubmit = function onSubmit(values) {
        expect(values).toEqualMap({ bar: 'foo' });
      };

      var Form = function Form(_ref3) {
        var handleSubmit = _ref3.handleSubmit;
        return React.createElement(
          'form',
          { onSubmit: handleSubmit(onSubmit) },
          React.createElement(Field, { name: 'bar', component: input, type: 'text' })
        );
      };

      var Decorated = reduxForm({
        form: 'testForm',
        asyncValidate: asyncValidate
      })(Form);

      var dom = TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(Decorated, null)
      ));

      var form = TestUtils.findRenderedDOMComponentWithTag(dom, 'form');

      expect(input).toHaveBeenCalled();
      expect(propsAtNthRender(input, 0).input.value).toBe('foo');

      expect(asyncValidate).toNotHaveBeenCalled();

      TestUtils.Simulate.submit(form);
      TestUtils.Simulate.submit(form);
      TestUtils.Simulate.submit(form);
      TestUtils.Simulate.submit(form);
      TestUtils.Simulate.submit(form);

      expect(asyncValidate).toHaveBeenCalled();
      expect(asyncValidate.calls.length).toBe(1);
      expect(propsAtNthRender(asyncValidate, 0)).toEqualMap({ bar: 'foo' });
    });

    it('should reset when reset() called', function () {
      var store = makeStore({});
      var input = createSpy(function (props) {
        return React.createElement('input', props.input);
      }).andCallThrough();

      var Form = function Form() {
        return React.createElement(
          'form',
          null,
          React.createElement(Field, { name: 'bar', component: input, type: 'text' })
        );
      };

      var Decorated = reduxForm({
        form: 'testForm',
        initialValues: { bar: 'initialBar' }
      })(Form);

      var dom = TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(Decorated, null)
      ));

      var stub = TestUtils.findRenderedComponentWithType(dom, Decorated);

      expect(input).toHaveBeenCalled();

      expect(propsAtNthRender(input, 0).input.value).toBe('initialBar');

      input.calls[0].arguments[0].input.onChange('newBar');

      expect(propsAtNthRender(input, 1).input.value).toBe('newBar');

      expect(stub.reset).toBeA('function');
      stub.reset();

      expect(propsAtNthRender(input, 2).input.value).toBe('initialBar');
    });

    it('should rerender form, but not fields, when non-redux-form props change', function () {
      var store = makeStore({});
      var inputRender = createSpy(function (props) {
        return React.createElement('input', props.input);
      }).andCallThrough();
      var formRender = createSpy();

      var Form = function (_Component24) {
        _inherits(Form, _Component24);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            formRender(this.props);
            return React.createElement(
              'form',
              null,
              React.createElement(Field, { name: 'deep.foo', component: inputRender, type: 'text' })
            );
          }
        }]);

        return Form;
      }(Component);

      var Decorated = reduxForm({ form: 'testForm' })(Form);

      var Container = function (_Component25) {
        _inherits(Container, _Component25);

        function Container(props) {
          _classCallCheck(this, Container);

          var _this35 = _possibleConstructorReturn(this, (Container.__proto__ || Object.getPrototypeOf(Container)).call(this, props));

          _this35.state = {};
          return _this35;
        }

        _createClass(Container, [{
          key: 'render',
          value: function render() {
            var _this36 = this;

            return React.createElement(
              'div',
              null,
              React.createElement(
                Provider,
                { store: store },
                React.createElement(Decorated, this.state)
              ),
              React.createElement(
                'button',
                { onClick: function onClick() {
                    return _this36.setState({ someOtherProp: 42 });
                  } },
                'Init'
              )
            );
          }
        }]);

        return Container;
      }(Component);

      var dom = TestUtils.renderIntoDocument(React.createElement(Container, null));
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: [{ name: 'deep.foo', type: 'Field' }]
          }
        }
      });
      expect(formRender).toHaveBeenCalled();
      expect(formRender.calls.length).toBe(1);
      expect(propsAtNthRender(formRender, 0).someOtherProp).toNotExist();

      expect(inputRender).toHaveBeenCalled();
      expect(inputRender.calls.length).toBe(1);

      // initialize
      var initButton = TestUtils.findRenderedDOMComponentWithTag(dom, 'button');
      TestUtils.Simulate.click(initButton);

      // rerender form on prop change
      expect(formRender.calls.length).toBe(2);
      expect(propsAtNthRender(formRender, 1).someOtherProp).toExist().toBe(42);

      // no need to rerender input
      expect(inputRender.calls.length).toBe(1);
    });

    it('should provide error prop from sync validation', function () {
      var store = makeStore({});
      var formRender = createSpy();

      var Form = function (_Component26) {
        _inherits(Form, _Component26);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            formRender(this.props);
            return React.createElement(
              'form',
              null,
              React.createElement(Field, { name: 'foo', component: 'input', type: 'text' })
            );
          }
        }]);

        return Form;
      }(Component);

      var Decorated = reduxForm({
        form: 'testForm',
        validate: function validate() {
          return { _error: 'form wide sync error' };
        }
      })(Form);

      TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(Decorated, null)
      ));

      expect(formRender).toHaveBeenCalled();
      expect(formRender.calls.length).toBe(2);
      expect(propsAtNthRender(formRender, 1).error).toBe('form wide sync error');
    });

    it('values passed to sync validation function should be defined', function () {
      var store = makeStore({});
      var formRender = createSpy();

      var Form = function (_Component27) {
        _inherits(Form, _Component27);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            formRender(this.props);
            return React.createElement(
              'form',
              null,
              React.createElement(Field, { name: 'foo', component: 'input', type: 'text' })
            );
          }
        }]);

        return Form;
      }(Component);

      var Decorated = reduxForm({
        form: 'testForm',
        enableReinitialize: true,
        initialValues: { foo: 'bar' },
        validate: function validate(values) {
          expect(values).toExist();
          return {};
        }
      })(Form);

      TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(Decorated, null)
      ));

      expect(formRender).toHaveBeenCalled();
      expect(formRender.calls.length).toBe(1);
    });

    it('should properly remove error prop from sync validation', function () {
      var store = makeStore({});
      var input = createSpy(function (props) {
        return React.createElement('input', props.input);
      }).andCallThrough();
      var formRender = createSpy();

      var Form = function (_Component28) {
        _inherits(Form, _Component28);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            formRender(this.props);
            return React.createElement(
              'form',
              null,
              React.createElement(Field, { name: 'foo', component: input, type: 'text' })
            );
          }
        }]);

        return Form;
      }(Component);

      var Decorated = reduxForm({
        form: 'testForm',
        validate: function validate(values) {
          return getIn(values, 'foo') ? {} : { _error: 'form wide sync error' };
        }
      })(Form);

      TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(Decorated, null)
      ));

      expect(formRender).toHaveBeenCalled();
      expect(formRender.calls.length).toBe(2);
      expect(propsAtNthRender(formRender, 1).error).toBe('form wide sync error');
      expect(propsAtNthRender(formRender, 1).valid).toBe(false);
      expect(propsAtNthRender(formRender, 1).invalid).toBe(true);

      input.calls[0].arguments[0].input.onChange('bar');

      expect(formRender.calls.length).toBe(4);
      expect(propsAtNthRender(formRender, 3).error).toNotExist();
      expect(propsAtNthRender(formRender, 3).valid).toBe(true);
      expect(propsAtNthRender(formRender, 3).invalid).toBe(false);
    });

    it('should allow for sync errors to be objects', function () {
      var store = makeStore({});
      var formRender = createSpy();
      var renderInput = createSpy(function (props) {
        return React.createElement('input', props.input);
      }).andCallThrough();
      var error = {
        complex: 'object',
        manyKeys: true
      };

      var Form = function (_Component29) {
        _inherits(Form, _Component29);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            formRender(this.props);
            return React.createElement(
              'form',
              null,
              React.createElement(Field, { name: 'foo', component: renderInput, type: 'text' })
            );
          }
        }]);

        return Form;
      }(Component);

      var Decorated = reduxForm({
        form: 'testForm',
        validate: function validate() {
          return { foo: error };
        }
      })(Form);

      TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(Decorated, null)
      ));

      expect(formRender).toHaveBeenCalled();
      expect(formRender.calls.length).toBe(2);
      expect(propsAtNthRender(formRender, 1).valid).toBe(false);
      expect(propsAtNthRender(formRender, 1).invalid).toBe(true);

      expect(renderInput).toHaveBeenCalled();
      expect(renderInput.calls.length).toBe(1);
      expect(propsAtNthRender(renderInput, 0).meta.error).toEqual(error);
    });

    it('should provide warning prop from sync warning', function () {
      var store = makeStore({});
      var formRender = createSpy();

      var Form = function (_Component30) {
        _inherits(Form, _Component30);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            formRender(this.props);
            return React.createElement(
              'form',
              null,
              React.createElement(Field, { name: 'foo', component: 'input', type: 'text' })
            );
          }
        }]);

        return Form;
      }(Component);

      var Decorated = reduxForm({
        form: 'testForm',
        warn: function warn() {
          return { _warning: 'form wide sync warning' };
        }
      })(Form);

      TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(Decorated, null)
      ));

      expect(formRender).toHaveBeenCalled();
      expect(formRender.calls.length).toBe(2);
      expect(propsAtNthRender(formRender, 1).warning).toBe('form wide sync warning');
    });

    it('should properly remove warning prop from sync warning', function () {
      var store = makeStore({});
      var input = createSpy(function (props) {
        return React.createElement('input', props.input);
      }).andCallThrough();
      var formRender = createSpy();

      var Form = function (_Component31) {
        _inherits(Form, _Component31);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            formRender(this.props);
            return React.createElement(
              'form',
              null,
              React.createElement(Field, { name: 'foo', component: input, type: 'text' })
            );
          }
        }]);

        return Form;
      }(Component);

      var Decorated = reduxForm({
        form: 'testForm',
        warn: function warn(values) {
          return getIn(values, 'foo') ? {} : { _warning: 'form wide sync warning' };
        }
      })(Form);

      TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(Decorated, null)
      ));

      expect(formRender).toHaveBeenCalled();
      expect(formRender.calls.length).toBe(2);
      expect(propsAtNthRender(formRender, 1).warning).toBe('form wide sync warning');

      input.calls[0].arguments[0].input.onChange('bar');

      // expect(formRender.calls.length).toBe(4) // TODO: this gets called an extra time (4 instead of 3). why?
      expect(propsAtNthRender(formRender, 3).warning).toNotExist();
    });

    it('should allow for sync warnings to be objects', function () {
      var store = makeStore({});
      var formRender = createSpy();
      var renderInput = createSpy(function (props) {
        return React.createElement('input', props.input);
      }).andCallThrough();
      var warning = {
        complex: 'object',
        manyKeys: true
      };

      var Form = function (_Component32) {
        _inherits(Form, _Component32);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            formRender(this.props);
            return React.createElement(
              'form',
              null,
              React.createElement(Field, { name: 'foo', component: renderInput, type: 'text' })
            );
          }
        }]);

        return Form;
      }(Component);

      var Decorated = reduxForm({
        form: 'testForm',
        warn: function warn() {
          return { foo: warning };
        }
      })(Form);

      TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(Decorated, null)
      ));

      expect(formRender).toHaveBeenCalled();
      // expect(formRender.calls.length).toBe(2) // TODO: This gets called only once. Why?

      expect(renderInput).toHaveBeenCalled();
      expect(renderInput.calls.length).toBe(1);
      expect(propsAtNthRender(renderInput, 0).meta.warning).toEqual(warning);
    });

    it('should call async on blur of async blur field', function () {
      var store = makeStore({});
      var inputRender = createSpy(function (props) {
        return React.createElement('input', props.input);
      }).andCallThrough();
      var formRender = createSpy();
      var asyncErrors = {
        deep: {
          foo: 'async error'
        }
      };
      var asyncValidate = createSpy().andReturn(Promise.reject(asyncErrors));

      var Form = function (_Component33) {
        _inherits(Form, _Component33);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            formRender(this.props);
            return React.createElement(
              'form',
              null,
              React.createElement(Field, { name: 'deep.foo', component: inputRender, type: 'text' })
            );
          }
        }]);

        return Form;
      }(Component);

      var Decorated = reduxForm({
        form: 'testForm',
        asyncValidate: asyncValidate,
        asyncBlurFields: ['deep.foo']
      })(Form);

      var dom = TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(Decorated, null)
      ));
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: [{ name: 'deep.foo', type: 'Field' }]
          }
        }
      });
      expect(formRender).toHaveBeenCalled();
      expect(formRender.calls.length).toBe(1);

      expect(asyncValidate).toNotHaveBeenCalled();

      expect(inputRender).toHaveBeenCalled();
      expect(inputRender.calls.length).toBe(1);
      expect(propsAtNthRender(inputRender, 0).meta.pristine).toBe(true);
      expect(propsAtNthRender(inputRender, 0).input.value).toBe('');
      expect(propsAtNthRender(inputRender, 0).meta.valid).toBe(true);
      expect(propsAtNthRender(inputRender, 0).meta.error).toBe(undefined);

      var inputElement = TestUtils.findRenderedDOMComponentWithTag(dom, 'input');
      TestUtils.Simulate.change(inputElement, { target: { value: 'bar' } });

      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            values: {
              deep: {
                foo: 'bar'
              }
            },
            registeredFields: [{ name: 'deep.foo', type: 'Field' }]
          }
        }
      });
      expect(formRender.calls.length).toBe(2); // rerendered because pristine -> dirty

      expect(asyncValidate).toNotHaveBeenCalled(); // not yet

      expect(inputRender.calls.length).toBe(2); // input rerendered
      expect(propsAtNthRender(inputRender, 1).meta.pristine).toBe(false);
      expect(propsAtNthRender(inputRender, 1).input.value).toBe('bar');
      expect(propsAtNthRender(inputRender, 1).meta.valid).toBe(true);
      expect(propsAtNthRender(inputRender, 1).meta.error).toBe(undefined);

      TestUtils.Simulate.blur(inputElement, { target: { value: 'bar' } });

      setTimeout(function () {
        expect(store.getState()).toEqualMap({
          form: {
            testForm: {
              anyTouched: true,
              values: {
                deep: {
                  foo: 'bar'
                }
              },
              fields: {
                deep: {
                  foo: {
                    touched: true
                  }
                }
              },
              registeredFields: [{ name: 'deep.foo', type: 'Field' }],
              asyncErrors: asyncErrors
            }
          }
        });
        // rerender form twice because of async validation start and again for valid -> invalid
        expect(formRender.calls.length).toBe(4);

        expect(asyncValidate).toHaveBeenCalled();
        expect(propsAtNthRender(asyncValidate, 0)).toEqualMap({ deep: { foo: 'bar' } });

        // input rerendered twice, at start and end of async validation
        expect(inputRender.calls.length).toBe(4);
        expect(propsAtNthRender(inputRender, 3).meta.pristine).toBe(false);
        expect(propsAtNthRender(inputRender, 3).input.value).toBe('bar');
        expect(propsAtNthRender(inputRender, 3).meta.valid).toBe(false);
        expect(propsAtNthRender(inputRender, 3).meta.error).toBe('async error');
      });
    });

    describe('validateIfNeeded', function () {

      it('should not call validate if shouldValidate returns false', function () {
        var validate = createSpy().andReturn({});
        var shouldValidate = createSpy().andReturn(false);

        var Form = makeForm();
        var dom = renderForm(Form, {}, { validate: validate, shouldValidate: shouldValidate });

        // initial render
        expect(shouldValidate).toHaveBeenCalled();
        expect(shouldValidate.calls[0].arguments[0].initialRender).toBe(true);
        expect(validate).toNotHaveBeenCalled();

        shouldValidate.reset();

        // on change
        var inputElement = TestUtils.findRenderedDOMComponentWithTag(dom, 'input');
        TestUtils.Simulate.change(inputElement, { target: { value: 'bar' } });

        expect(shouldValidate).toHaveBeenCalled();
        expect(shouldValidate.calls[0].arguments[0].initialRender).toBe(false);
        expect(validate).toNotHaveBeenCalled();
      });

      it('should call validate if shouldValidate returns true', function () {
        var validate = createSpy().andReturn({});
        var shouldValidate = createSpy().andReturn(true);

        var Form = makeForm();
        var dom = renderForm(Form, {}, { validate: validate, shouldValidate: shouldValidate });

        // initial render
        expect(shouldValidate).toHaveBeenCalled();
        expect(shouldValidate.calls[0].arguments[0].initialRender).toBe(true);
        expect(validate).toHaveBeenCalled();

        shouldValidate.reset();

        // on change
        var inputElement = TestUtils.findRenderedDOMComponentWithTag(dom, 'input');
        TestUtils.Simulate.change(inputElement, { target: { value: 'bar' } });

        expect(shouldValidate).toHaveBeenCalled();
        expect(shouldValidate.calls[0].arguments[0].initialRender).toBe(false);
        expect(validate).toHaveBeenCalled();
      });
    });

    it('should not call async validate if shouldAsyncValidate returns false', function () {
      var store = makeStore({});
      var inputRender = createSpy(function (props) {
        return React.createElement('input', props.input);
      }).andCallThrough();
      var asyncValidate = createSpy().andReturn(Promise.reject({ foo: 'bad user!' }));
      var shouldAsyncValidate = createSpy().andReturn(false);

      var Form = function Form() {
        return React.createElement(
          'form',
          null,
          React.createElement(Field, { name: 'foo', component: inputRender, type: 'text' })
        );
      };

      var Decorated = reduxForm({
        form: 'testForm',
        asyncValidate: asyncValidate,
        asyncBlurFields: ['foo'],
        shouldAsyncValidate: shouldAsyncValidate
      })(Form);

      var dom = TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(Decorated, null)
      ));
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: [{ name: 'foo', type: 'Field' }]
          }
        }
      });

      expect(asyncValidate).toNotHaveBeenCalled();

      var inputElement = TestUtils.findRenderedDOMComponentWithTag(dom, 'input');
      TestUtils.Simulate.change(inputElement, { target: { value: 'bar' } });

      expect(shouldAsyncValidate).toNotHaveBeenCalled();

      TestUtils.Simulate.blur(inputElement, { target: { value: 'bar' } });

      expect(shouldAsyncValidate).toHaveBeenCalled();

      expect(asyncValidate).toNotHaveBeenCalled();
    });

    it('should expose wrapped instance', function () {
      var store = makeStore({});

      var Form = function (_Component34) {
        _inherits(Form, _Component34);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            return React.createElement(
              'form',
              null,
              React.createElement(Field, { name: 'foo', component: 'input', type: 'text' })
            );
          }
        }]);

        return Form;
      }(Component);

      var Decorated = reduxForm({
        form: 'testForm'
      })(Form);

      var dom = TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(Decorated, null)
      ));

      var wrapped = TestUtils.findRenderedComponentWithType(dom, Form);
      var decorated = TestUtils.findRenderedComponentWithType(dom, Decorated);

      expect(decorated.wrappedInstance.props).toEqual(wrapped.props);
    });

    it('should return an empty list if there are no registered fields', function () {
      var store = makeStore({});

      var Form = function (_Component35) {
        _inherits(Form, _Component35);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            return React.createElement('form', null);
          }
        }]);

        return Form;
      }(Component);

      var Decorated = reduxForm({
        form: 'testForm'
      })(Form);

      var dom = TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(Decorated, null)
      ));

      var decorated = TestUtils.findRenderedComponentWithType(dom, Decorated);

      expect(decorated.refs.wrapped.getWrappedInstance().getFieldList()).toEqual([]);
    });

    it('should set autofilled and unset it on change', function () {
      var store = makeStore({});

      var renderInput = createSpy(function (props) {
        return React.createElement('input', props.input);
      }).andCallThrough();
      var renderForm = createSpy();
      var onSubmit = createSpy();

      var Form = function (_Component36) {
        _inherits(Form, _Component36);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            renderForm(this.props);
            return React.createElement(
              'form',
              { onSubmit: this.props.handleSubmit },
              React.createElement(Field, { name: 'myField', component: renderInput })
            );
          }
        }]);

        return Form;
      }(Component);

      var Decorated = reduxForm({
        form: 'testForm'
      })(Form);

      var dom = TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(Decorated, { onSubmit: onSubmit })
      ));

      expect(renderForm).toHaveBeenCalled();
      expect(renderForm.calls.length).toBe(1);
      expect(renderForm.calls[0].arguments[0].autofill).toBeA('function');

      // check field
      expect(renderInput).toHaveBeenCalled();
      expect(renderInput.calls.length).toBe(1);
      expect(renderInput.calls[0].arguments[0].input.value).toBe('');
      expect(renderInput.calls[0].arguments[0].meta.autofilled).toBe(false);

      var form = TestUtils.findRenderedDOMComponentWithTag(dom, 'form');

      // test submit
      expect(onSubmit).toNotHaveBeenCalled();
      TestUtils.Simulate.submit(form);
      expect(onSubmit).toHaveBeenCalled();
      expect(onSubmit.calls.length).toBe(1);
      expect(onSubmit.calls[0].arguments[0]).toEqualMap({});
      expect(renderInput.calls.length).toBe(2); // touched by submit

      // autofill field
      renderForm.calls[0].arguments[0].autofill('myField', 'autofilled value');

      // check field
      expect(renderInput).toHaveBeenCalled();
      expect(renderInput.calls.length).toBe(3);
      expect(renderInput.calls[2].arguments[0].input.value).toBe('autofilled value');
      expect(renderInput.calls[2].arguments[0].meta.autofilled).toBe(true);

      // test submitting autofilled value
      TestUtils.Simulate.submit(form);
      expect(onSubmit.calls.length).toBe(2);
      expect(onSubmit.calls[1].arguments[0]).toEqualMap({ myField: 'autofilled value' });

      // user edits field
      renderInput.calls[1].arguments[0].input.onChange('user value');

      // check field
      expect(renderInput).toHaveBeenCalled();
      expect(renderInput.calls.length).toBe(4);
      expect(renderInput.calls[3].arguments[0].input.value).toBe('user value');
      expect(renderInput.calls[3].arguments[0].meta.autofilled).toBe(false);

      // why not test submitting again?
      TestUtils.Simulate.submit(form);
      expect(onSubmit.calls.length).toBe(3);
      expect(onSubmit.calls[2].arguments[0]).toEqualMap({ myField: 'user value' });
    });

    it('should not reinitialize values on remount if destroyOnMount is false', function () {
      var store = makeStore({});
      var inputRender = createSpy(function (props) {
        return React.createElement('input', props.input);
      }).andCallThrough();
      var initialValues = {
        foo: 'fooInitial'
      };

      var Form = function (_Component37) {
        _inherits(Form, _Component37);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            return React.createElement(
              'form',
              null,
              React.createElement(Field, { name: 'foo', component: inputRender, type: 'text' })
            );
          }
        }]);

        return Form;
      }(Component);

      var Decorated = reduxForm({
        form: 'testForm',
        destroyOnUnmount: false
      })(Form);

      var Container = function (_Component38) {
        _inherits(Container, _Component38);

        function Container() {
          _classCallCheck(this, Container);

          var _this49 = _possibleConstructorReturn(this, (Container.__proto__ || Object.getPrototypeOf(Container)).call(this));

          _this49.state = { showForm: true };
          return _this49;
        }

        _createClass(Container, [{
          key: 'render',
          value: function render() {
            var _this50 = this;

            var showForm = this.state.showForm;

            return React.createElement(
              'div',
              null,
              showForm && React.createElement(Decorated, { initialValues: initialValues }),
              React.createElement(
                'button',
                { onClick: function onClick() {
                    return _this50.setState({ showForm: !showForm });
                  } },
                'Toggle Form'
              )
            );
          }
        }]);

        return Container;
      }(Component);

      var dom = TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(Container, null)
      ));

      // initialized form state
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            initial: { foo: 'fooInitial' },
            values: { foo: 'fooInitial' },
            registeredFields: [{ name: 'foo', type: 'Field' }]
          }
        }
      });

      // rendered with initial value
      expect(inputRender).toHaveBeenCalled();
      expect(inputRender.calls.length).toBe(1);
      expect(propsAtNthRender(inputRender, 0).input.value).toBe('fooInitial');

      // change value
      inputRender.calls[0].arguments[0].input.onChange('fooChanged');

      // updated form state
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            initial: { foo: 'fooInitial' },
            values: { foo: 'fooChanged' },
            registeredFields: [{ name: 'foo', type: 'Field' }]
          }
        }
      });

      // rendered with changed value
      expect(inputRender.calls.length).toBe(2);
      expect(propsAtNthRender(inputRender, 1).input.value).toBe('fooChanged');

      // unmount form
      var toggle = TestUtils.findRenderedDOMComponentWithTag(dom, 'button');
      TestUtils.Simulate.click(toggle);

      // form state not destroyed (just fields unregistered)
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            initial: { foo: 'fooInitial' },
            values: { foo: 'fooChanged' },
            registeredFields: [{ name: 'foo', type: 'Field' }]
          }
        }
      });

      // mount form
      TestUtils.Simulate.click(toggle);

      // form state not overwritten (fields re-registered)
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            initial: { foo: 'fooInitial' },
            values: { foo: 'fooChanged' },
            registeredFields: [{ name: 'foo', type: 'Field' }]
          }
        }
      });

      // input rendered with changed value
      expect(inputRender.calls.length).toBe(3);
      expect(propsAtNthRender(inputRender, 2).input.value).toBe('fooChanged');
    });

    it('should provide dispatch-bound blur() that modifies values', function () {
      var store = makeStore({});
      var formRender = createSpy();

      var Form = function (_Component39) {
        _inherits(Form, _Component39);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            formRender(this.props);
            return React.createElement(
              'form',
              null,
              React.createElement(Field, { name: 'foo', component: 'input', type: 'text' })
            );
          }
        }]);

        return Form;
      }(Component);

      var Decorated = reduxForm({ form: 'testForm' })(Form);

      TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(Decorated, null)
      ));

      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: [{ name: 'foo', type: 'Field' }]
          }
        }
      });
      expect(formRender).toHaveBeenCalled();
      expect(formRender.calls.length).toBe(1);

      expect(formRender.calls[0].arguments[0].blur).toBeA('function');
      formRender.calls[0].arguments[0].blur('foo', 'newValue');

      // check modified state
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: [{ name: 'foo', type: 'Field' }],
            values: { foo: 'newValue' },
            fields: { foo: { touched: true } },
            anyTouched: true
          }
        }
      });

      // rerendered again because now dirty
      expect(formRender.calls.length).toBe(2);
    });

    it('should provide dispatch-bound change() that modifies values', function () {
      var store = makeStore({});
      var formRender = createSpy();

      var Form = function (_Component40) {
        _inherits(Form, _Component40);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            formRender(this.props);
            return React.createElement(
              'form',
              null,
              React.createElement(Field, { name: 'foo', component: 'input', type: 'text' })
            );
          }
        }]);

        return Form;
      }(Component);

      var Decorated = reduxForm({ form: 'testForm' })(Form);

      TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(Decorated, null)
      ));

      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: [{ name: 'foo', type: 'Field' }]
          }
        }
      });
      expect(formRender).toHaveBeenCalled();
      expect(formRender.calls.length).toBe(1);

      expect(formRender.calls[0].arguments[0].change).toBeA('function');
      formRender.calls[0].arguments[0].change('foo', 'newValue');

      // check modified state
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            registeredFields: [{ name: 'foo', type: 'Field' }],
            values: { foo: 'newValue' }
          }
        }
      });

      // rerendered again because now dirty
      expect(formRender.calls.length).toBe(2);
    });

    it('startSubmit in onSubmit promise', function () {
      var store = makeStore({});

      var Form = function (_Component41) {
        _inherits(Form, _Component41);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            var handleSubmit = this.props.handleSubmit;

            return React.createElement(
              'form',
              { onSubmit: handleSubmit },
              React.createElement(Field, { name: 'foo', component: 'input', type: 'text' })
            );
          }
        }]);

        return Form;
      }(Component);

      var resolvedProm = Promise.resolve();
      var Decorated = reduxForm({
        form: 'testForm',
        destroyOnUnmount: false,
        onSubmit: function onSubmit(data, dispatch) {
          dispatch(startSubmit('testForm'));

          return resolvedProm;
        }
      })(Form);

      var dom = TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(Decorated, null)
      ));

      // unmount form
      var stub = TestUtils.findRenderedComponentWithType(dom, Decorated);
      stub.submit();

      return resolvedProm.then(function () {
        // form state not destroyed (just fields unregistered)
        expect(store.getState()).toEqualMap({
          form: {
            testForm: {
              anyTouched: true,
              fields: {
                foo: {
                  touched: true
                }
              },
              registeredFields: [{
                name: 'foo',
                type: 'Field'
              }],
              submitSucceeded: true
            }
          }
        });
      });
    });

    it('startSubmit in onSubmit sync', function () {
      var store = makeStore({});

      var Form = function (_Component42) {
        _inherits(Form, _Component42);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            var handleSubmit = this.props.handleSubmit;

            return React.createElement(
              'form',
              { onSubmit: handleSubmit },
              React.createElement(Field, { name: 'foo', component: 'input', type: 'text' })
            );
          }
        }]);

        return Form;
      }(Component);

      var Decorated = reduxForm({
        form: 'testForm',
        destroyOnUnmount: false,
        onSubmit: function onSubmit(data, dispatch) {
          dispatch(startSubmit('testForm'));
        }
      })(Form);

      var dom = TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(Decorated, null)
      ));

      // submit form
      var stub = TestUtils.findRenderedComponentWithType(dom, Decorated);
      stub.submit();

      // form state not destroyed (just fields unregistered)
      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            anyTouched: true,
            fields: {
              foo: {
                touched: true
              }
            },
            registeredFields: [{
              name: 'foo',
              type: 'Field'
            }],
            submitting: true,
            submitSucceeded: true
          }
        }
      });
    });

    it('submits even if submit errors exist', function () {
      var store = makeStore({});
      var count = 0;
      var onSubmit = createSpy(function () {
        return new Promise(function (resolve) {
          count++;
          if (count === 1) {
            // first time throw exception
            throw new SubmissionError({ _error: 'Bad human!' });
          }
          resolve();
        });
      }).andCallThrough();
      var renderSpy = createSpy(function () {});

      var Form = function (_Component43) {
        _inherits(Form, _Component43);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            var _props = this.props,
                handleSubmit = _props.handleSubmit,
                error = _props.error,
                valid = _props.valid;

            renderSpy(valid, error);
            return React.createElement(
              'form',
              { onSubmit: handleSubmit },
              React.createElement(Field, { name: 'foo', component: 'input', type: 'text' })
            );
          }
        }]);

        return Form;
      }(Component);

      var Decorated = reduxForm({
        form: 'testForm',
        onSubmit: onSubmit
      })(Form);

      var dom = TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(Decorated, null)
      ));

      expect(renderSpy).toHaveBeenCalled();
      expect(renderSpy.calls.length).toBe(1);
      expect(renderSpy.calls[0].arguments[0]).toBe(true);
      expect(renderSpy.calls[0].arguments[1]).toBe(undefined);
      expect(onSubmit).toNotHaveBeenCalled();

      // submit form
      var stub = TestUtils.findRenderedComponentWithType(dom, Decorated);
      return stub.submit().then(function () {
        expect(onSubmit).toHaveBeenCalled();
        expect(onSubmit.calls.length).toBe(1);

        expect(renderSpy.calls.length).toBe(4);
        expect(renderSpy.calls[3].arguments[0]).toBe(false);
        expect(renderSpy.calls[3].arguments[1]).toBe('Bad human!');
      }).then(function () {
        return stub.submit();
      }) // call submit again!
      .then(function () {
        expect(onSubmit.calls.length).toBe(2);

        expect(renderSpy.calls.length).toBe(6);
        expect(renderSpy.calls[5].arguments[0]).toBe(true);
        expect(renderSpy.calls[5].arguments[1]).toBe(undefined);
      });
    });

    it('submits when the SUBMIT action is dispatched', function () {
      var logger = createSpy(function () {
        var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        return state;
      }).andCallThrough();
      var store = makeStore({}, logger);
      var inputRender = createSpy(function (props) {
        return React.createElement('input', props.input);
      }).andCallThrough();
      var onSubmit = createSpy();

      var Form = function (_Component44) {
        _inherits(Form, _Component44);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            var handleSubmit = this.props.handleSubmit;

            return React.createElement(
              'form',
              { onSubmit: handleSubmit },
              React.createElement(Field, { name: 'foo', component: inputRender })
            );
          }
        }]);

        return Form;
      }(Component);

      var Decorated = reduxForm({
        form: 'testForm',
        onSubmit: onSubmit
      })(Form);

      TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(Decorated, null)
      ));

      var callIndex = logger.calls.length;

      // update input
      inputRender.calls[0].arguments[0].input.onChange('hello');

      // check that change action was dispatched
      expect(logger.calls[callIndex++].arguments[1]).toEqual(change('testForm', 'foo', 'hello', false, false));

      // dispatch submit action
      store.dispatch(submit('testForm'));

      // check that submit action was dispatched
      expect(logger.calls[callIndex++].arguments[1]).toEqual(submit('testForm'));

      // check that clear submit action was dispatched
      expect(logger.calls[callIndex++].arguments[1]).toEqual(clearSubmit('testForm'));

      // check that touch action was dispatched
      expect(logger.calls[callIndex++].arguments[1]).toEqual(touch('testForm', 'foo'));

      // check that submit succeeded action was dispatched
      expect(logger.calls[callIndex++].arguments[1]).toEqual(setSubmitSucceeded('testForm'));

      // check no additional actions dispatched
      expect(logger.calls.length).toBe(callIndex);

      expect(onSubmit).toHaveBeenCalled();
      expect(onSubmit.calls.length).toBe(1);
      expect(onSubmit.calls[0].arguments[0]).toEqualMap({ foo: 'hello' });
    });
  });
};

describeReduxForm('reduxForm.plain', plain, plainCombineReducers, addExpectations(plainExpectations));
describeReduxForm('reduxForm.immutable', immutable, immutableCombineReducers, addExpectations(immutableExpectations));