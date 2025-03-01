var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* eslint react/no-multi-comp:0 */
import React, { Component } from 'react';
import { createSpy } from 'expect';
import { Provider } from 'react-redux';
import { combineReducers as plainCombineReducers, createStore } from 'redux';
import { combineReducers as immutableCombineReducers } from 'redux-immutablejs';
import TestUtils from 'react-addons-test-utils';
import createReduxForm from '../reduxForm';
import createReducer from '../reducer';
import createField from '../Field';
import createFields from '../Fields';
import createFieldArray from '../FieldArray';
import FormSection from '../FormSection';
import plain from '../structure/plain';
import plainExpectations from '../structure/plain/expectations';
import immutable from '../structure/immutable';
import immutableExpectations from '../structure/immutable/expectations';
import addExpectations from './addExpectations';

var describeFormSection = function describeFormSection(name, structure, combineReducers, expect) {
  var reduxForm = createReduxForm(structure);
  var Field = createField(structure);
  var Fields = createFields(structure);
  var FieldArray = createFieldArray(structure);
  var reducer = createReducer(structure);
  var fromJS = structure.fromJS;

  var makeStore = function makeStore(initial) {
    return createStore(combineReducers({ form: reducer }), fromJS({ form: initial }));
  };

  describe(name, function () {
    it('should throw an error if not in ReduxForm', function () {
      expect(function () {
        TestUtils.renderIntoDocument(React.createElement(
          'div',
          null,
          React.createElement(FormSection, { name: 'foo' })
        ));
      }).toThrow(/must be inside a component decorated with reduxForm/);
    });

    it('should not wrap in unnecessary div', function () {
      var store = makeStore({
        testForm: {
          values: {
            foo: {
              bar: '42'
            }
          }
        }
      });

      var Form = function (_Component) {
        _inherits(Form, _Component);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            return React.createElement(
              FormSection,
              { name: 'foo' },
              React.createElement(Field, { name: 'bar', component: 'input' })
            );
          }
        }]);

        return Form;
      }(Component);

      var TestForm = reduxForm({ form: 'testForm' })(Form);
      var dom = TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(TestForm, null)
      ));

      var divTags = TestUtils.scryRenderedDOMComponentsWithTag(dom, 'div');

      expect(divTags.length).toEqual(0);
    });

    it('should update Field values at the right depth', function () {
      var store = makeStore({
        testForm: {
          values: {
            foo: {
              bar: '42'
            }
          }
        }
      });
      var input = createSpy(function (props) {
        return React.createElement('input', props.input);
      }).andCallThrough();

      var Form = function (_Component2) {
        _inherits(Form, _Component2);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            return React.createElement(
              FormSection,
              { name: 'foo' },
              React.createElement(Field, { name: 'bar', component: input })
            );
          }
        }]);

        return Form;
      }(Component);

      var TestForm = reduxForm({ form: 'testForm' })(Form);
      TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(TestForm, null)
      ));

      // input displaying string value
      expect(input.calls.length).toBe(1);
      expect(input.calls[0].arguments[0].input.value).toBe('42');

      // update value
      input.calls[0].arguments[0].input.onChange('15');

      // input displaying updated string value
      expect(input.calls.length).toBe(2);
      expect(input.calls[1].arguments[0].input.value).toBe('15');

      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            values: {
              foo: {
                bar: '15'
              }
            },
            registeredFields: [{ name: 'foo.bar', type: 'Field' }]
          }
        }
      });
    });

    it('should update Fields values at the right depth', function () {
      var store = makeStore({
        testForm: {
          values: {
            foo: {
              bar: '42',
              baz: '100'
            }
          }
        }
      });
      var input = createSpy(function (props) {
        return React.createElement('input', props.bar.input);
      }).andCallThrough();

      var Form = function (_Component3) {
        _inherits(Form, _Component3);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            return React.createElement(
              FormSection,
              { name: 'foo' },
              React.createElement(Fields, { names: ['bar', 'baz'], component: input })
            );
          }
        }]);

        return Form;
      }(Component);

      var TestForm = reduxForm({ form: 'testForm' })(Form);
      TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(TestForm, null)
      ));

      // input displaying string value
      expect(input.calls.length).toBe(1);
      expect(input.calls[0].arguments[0].bar.input.value).toBe('42');
      expect(input.calls[0].arguments[0].baz.input.value).toBe('100');

      // update value
      input.calls[0].arguments[0].bar.input.onChange('15');

      // input displaying updated string value
      expect(input.calls.length).toBe(2);
      expect(input.calls[1].arguments[0].bar.input.value).toBe('15');

      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            values: {
              foo: {
                bar: '15',
                baz: '100'
              }
            },
            registeredFields: [{ name: 'foo.bar', type: 'Field' }, { name: 'foo.baz', type: 'Field' }]
          }
        }
      });
    });

    it('should update FieldArray values at the right depth', function () {
      var store = makeStore({
        testForm: {
          values: {
            foo: {
              bar: ['dog', 'cat']
            }
          }
        }
      });

      var renderField = createSpy(function (props) {
        return React.createElement('input', props.input);
      }).andCallThrough();
      var renderFieldArray = createSpy(function (_ref) {
        var fields = _ref.fields;
        return React.createElement(
          'div',
          null,
          fields.map(function (field) {
            return React.createElement(Field, { name: field, component: renderField, key: field });
          }),
          React.createElement(
            'button',
            { className: 'add', onClick: function onClick() {
                return fields.push('fish');
              } },
            'Add Dog'
          ),
          React.createElement(
            'button',
            { className: 'remove', onClick: function onClick() {
                return fields.pop();
              } },
            'Remove Dog'
          )
        );
      }).andCallThrough();

      var Form = function (_Component4) {
        _inherits(Form, _Component4);

        function Form() {
          _classCallCheck(this, Form);

          return _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).apply(this, arguments));
        }

        _createClass(Form, [{
          key: 'render',
          value: function render() {
            return React.createElement(
              FormSection,
              { name: 'foo' },
              React.createElement(FieldArray, { name: 'bar', component: renderFieldArray })
            );
          }
        }]);

        return Form;
      }(Component);

      var TestForm = reduxForm({ form: 'testForm' })(Form);
      var dom = TestUtils.renderIntoDocument(React.createElement(
        Provider,
        { store: store },
        React.createElement(TestForm, null)
      ));

      var addButton = TestUtils.findRenderedDOMComponentWithClass(dom, 'add');
      var removeButton = TestUtils.findRenderedDOMComponentWithClass(dom, 'remove');
      TestUtils.Simulate.click(addButton);

      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            values: {
              foo: {
                bar: ['dog', 'cat', 'fish']
              }
            },
            registeredFields: [{ name: 'foo.bar', type: 'FieldArray' }, { name: 'foo.bar[0]', type: 'Field' }, { name: 'foo.bar[1]', type: 'Field' }, { name: 'foo.bar[2]', type: 'Field' }]
          }
        }
      });

      TestUtils.Simulate.click(removeButton);

      expect(store.getState()).toEqualMap({
        form: {
          testForm: {
            values: {
              foo: {
                bar: ['dog', 'cat']
              }
            },
            registeredFields: [{ name: 'foo.bar', type: 'FieldArray' }, { name: 'foo.bar[0]', type: 'Field' }, { name: 'foo.bar[1]', type: 'Field' }]
          }
        }
      });
    });
  });
};

describeFormSection('FormSection.plain', plain, plainCombineReducers, addExpectations(plainExpectations));
describeFormSection('FormSection.immutable', immutable, immutableCombineReducers, addExpectations(immutableExpectations));