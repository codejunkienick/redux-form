import { createSpy } from 'expect';
import createFieldProps from '../createFieldProps';
import plain from '../structure/plain';
import plainExpectations from '../structure/plain/expectations';
import immutable from '../structure/immutable';
import immutableExpectations from '../structure/immutable/expectations';
import addExpectations from './addExpectations';

var describeCreateFieldProps = function describeCreateFieldProps(name, structure, expect) {
  var empty = structure.empty,
      getIn = structure.getIn,
      fromJS = structure.fromJS;


  describe(name, function () {
    it('should pass value through', function () {
      expect(createFieldProps(getIn, 'foo', { value: 'hello' }).input.value).toBe('hello');
    });

    it('should pass dirty/pristine through', function () {
      expect(createFieldProps(getIn, 'foo', { dirty: false, pristine: true }).meta.dirty).toBe(false);
      expect(createFieldProps(getIn, 'foo', { dirty: false, pristine: true }).meta.pristine).toBe(true);
      expect(createFieldProps(getIn, 'foo', { dirty: true, pristine: false }).meta.dirty).toBe(true);
      expect(createFieldProps(getIn, 'foo', { dirty: true, pristine: false }).meta.pristine).toBe(false);
    });

    it('should provide onBlur', function () {
      var blur = createSpy();
      var dispatch = createSpy();
      var normalize = createSpy(function (name, value) {
        return value;
      }).andCallThrough();
      expect(blur).toNotHaveBeenCalled();
      var result = createFieldProps(getIn, 'foo', { value: 'bar', blur: blur, dispatch: dispatch, normalize: normalize });
      expect(result.input.onBlur).toBeA('function');
      expect(blur).toNotHaveBeenCalled();
      expect(dispatch).toNotHaveBeenCalled();
      result.input.onBlur('rabbit');
      expect(normalize).toHaveBeenCalled();
      expect(blur).toHaveBeenCalled().toHaveBeenCalledWith('foo', 'rabbit');
      expect(dispatch).toHaveBeenCalled();
    });

    it('should provide onChange', function () {
      var change = createSpy();
      var dispatch = createSpy();
      var normalize = createSpy(function (name, value) {
        return value;
      }).andCallThrough();
      expect(change).toNotHaveBeenCalled();
      var result = createFieldProps(getIn, 'foo', { value: 'bar', change: change, dispatch: dispatch, normalize: normalize });
      expect(result.input.onChange).toBeA('function');
      expect(change).toNotHaveBeenCalled();
      expect(dispatch).toNotHaveBeenCalled();
      result.input.onChange('rabbit');
      expect(normalize).toHaveBeenCalled();
      expect(change).toHaveBeenCalled().toHaveBeenCalledWith('foo', 'rabbit');
      expect(dispatch).toHaveBeenCalled();
    });

    it('should provide onFocus', function () {
      var focus = createSpy();
      var dispatch = createSpy();
      expect(focus).toNotHaveBeenCalled();
      var result = createFieldProps(getIn, 'foo', { value: 'bar', dispatch: dispatch, focus: focus });
      expect(result.input.onFocus).toBeA('function');
      expect(focus).toNotHaveBeenCalled();
      expect(dispatch).toNotHaveBeenCalled();
      result.input.onFocus('rabbit');
      expect(focus).toHaveBeenCalled().toHaveBeenCalledWith('foo');
      expect(dispatch).toHaveBeenCalled();
    });

    it('should provide onDragStart', function () {
      var result = createFieldProps(getIn, 'foo', { value: 'bar' });
      expect(result.input.onDragStart).toBeA('function');
    });

    it('should provide onDrop', function () {
      var result = createFieldProps(getIn, 'foo', { value: 'bar' });
      expect(result.input.onDrop).toBeA('function');
    });

    it('should read active from state', function () {
      var inactiveResult = createFieldProps(getIn, 'foo', {
        value: 'bar',
        state: empty
      });
      expect(inactiveResult.meta.active).toBe(false);
      var activeResult = createFieldProps(getIn, 'foo', {
        value: 'bar',
        state: fromJS({
          active: true
        })
      });
      expect(activeResult.meta.active).toBe(true);
    });

    it('should pass along submitting flag', function () {
      var notSubmittingResult = createFieldProps(getIn, 'foo', {
        value: 'bar'
      });
      expect(notSubmittingResult.meta.submitting).toBe(false);
      var submittingResult = createFieldProps(getIn, 'foo', {
        value: 'bar',
        submitting: true
      });
      expect(submittingResult.meta.submitting).toBe(true);
    });

    it('should pass along all custom state props', function () {
      var pristineResult = createFieldProps(getIn, 'foo', {
        value: 'bar'
      });
      expect(pristineResult.meta.customProp).toBe(undefined);
      var customResult = createFieldProps(getIn, 'foo', {
        value: 'bar',
        state: {
          customProp: 'my-custom-prop'
        }
      });
      expect(customResult.meta.customProp).toBe('my-custom-prop');
    });

    it('should not override canonical props with custom props', function () {
      var pristineResult = createFieldProps(getIn, 'foo', {
        value: 'bar'
      });
      expect(pristineResult.meta.customProp).toBe(undefined);
      var customResult = createFieldProps(getIn, 'foo', {
        value: 'bar',
        submitting: true,
        state: {
          submitting: false
        }
      });
      expect(customResult.meta.submitting).toBe(true);
    });

    it('should read touched from state', function () {
      var untouchedResult = createFieldProps(getIn, 'foo', {
        value: 'bar',
        state: empty
      });
      expect(untouchedResult.meta.touched).toBe(false);
      var touchedResult = createFieldProps(getIn, 'foo', {
        value: 'bar',
        state: fromJS({
          touched: true
        })
      });
      expect(touchedResult.meta.touched).toBe(true);
    });

    it('should read visited from state', function () {
      var notVisitedResult = createFieldProps(getIn, 'foo', {
        value: 'bar',
        state: empty
      });
      expect(notVisitedResult.meta.visited).toBe(false);
      var visitedResult = createFieldProps(getIn, 'foo', {
        value: 'bar',
        state: fromJS({
          visited: true
        })
      });
      expect(visitedResult.meta.visited).toBe(true);
    });

    it('should read sync errors from prop', function () {
      var noErrorResult = createFieldProps(getIn, 'foo', {
        value: 'bar',
        state: empty
      });
      expect(noErrorResult.meta.error).toNotExist();
      expect(noErrorResult.meta.valid).toBe(true);
      expect(noErrorResult.meta.invalid).toBe(false);
      var errorResult = createFieldProps(getIn, 'foo', {
        value: 'bar',
        state: empty,
        syncError: 'This is an error'
      });
      expect(errorResult.meta.error).toBe('This is an error');
      expect(errorResult.meta.valid).toBe(false);
      expect(errorResult.meta.invalid).toBe(true);
    });

    it('should read sync warnings from prop', function () {
      var noWarningResult = createFieldProps(getIn, 'foo', {
        value: 'bar',
        state: empty
      });
      expect(noWarningResult.meta.warning).toNotExist();
      var warningResult = createFieldProps(getIn, 'foo', {
        value: 'bar',
        state: empty,
        syncWarning: 'This is an warning'
      });
      expect(warningResult.meta.warning).toBe('This is an warning');
    });

    it('should read async errors from state', function () {
      var noErrorResult = createFieldProps(getIn, 'foo', {
        value: 'bar',
        state: empty
      });
      expect(noErrorResult.meta.error).toNotExist();
      expect(noErrorResult.meta.valid).toBe(true);
      expect(noErrorResult.meta.invalid).toBe(false);
      var errorResult = createFieldProps(getIn, 'foo', {
        value: 'bar',
        state: empty,
        syncError: 'This is an error'
      });
      expect(errorResult.meta.error).toBe('This is an error');
      expect(errorResult.meta.valid).toBe(false);
      expect(errorResult.meta.invalid).toBe(true);
    });

    it('should read submit errors from state', function () {
      var noErrorResult = createFieldProps(getIn, 'foo', {
        value: 'bar',
        state: empty
      });
      expect(noErrorResult.meta.error).toNotExist();
      expect(noErrorResult.meta.valid).toBe(true);
      expect(noErrorResult.meta.invalid).toBe(false);
      var errorResult = createFieldProps(getIn, 'foo', {
        value: 'bar',
        state: empty,
        submitError: 'This is an error'
      });
      expect(errorResult.meta.error).toBe('This is an error');
      expect(errorResult.meta.valid).toBe(false);
      expect(errorResult.meta.invalid).toBe(true);
    });

    it('should prioritize sync errors over async or submit errors', function () {
      var noErrorResult = createFieldProps(getIn, 'foo', {
        value: 'bar',
        state: empty
      });
      expect(noErrorResult.meta.error).toNotExist();
      expect(noErrorResult.meta.valid).toBe(true);
      expect(noErrorResult.meta.invalid).toBe(false);
      var errorResult = createFieldProps(getIn, 'foo', {
        value: 'bar',
        asyncError: 'async error',
        submitError: 'submit error',
        syncError: 'sync error'
      });
      expect(errorResult.meta.error).toBe('sync error');
      expect(errorResult.meta.valid).toBe(false);
      expect(errorResult.meta.invalid).toBe(true);
    });

    it('should pass through other props', function () {
      var result = createFieldProps(getIn, 'foo', {
        value: 'bar',
        state: empty,
        someOtherProp: 'dog',
        className: 'my-class'
      });
      expect(result.initial).toNotExist();
      expect(result.state).toNotExist();
      expect(result.custom.someOtherProp).toBe('dog');
      expect(result.custom.className).toBe('my-class');
    });

    it('should pass through other props using props prop', function () {
      var result = createFieldProps(getIn, 'foo', {
        value: 'bar',
        state: empty,
        props: {
          someOtherProp: 'dog',
          className: 'my-class'
        }
      });
      expect(result.initial).toNotExist();
      expect(result.state).toNotExist();
      expect(result.custom.someOtherProp).toBe('dog');
      expect(result.custom.className).toBe('my-class');
    });

    it('should set checked for checkboxes', function () {
      expect(createFieldProps(getIn, 'foo', {
        state: empty,
        type: 'checkbox'
      }).input.checked).toBe(false);
      expect(createFieldProps(getIn, 'foo', {
        value: true,
        state: empty,
        type: 'checkbox'
      }).input.checked).toBe(true);
      expect(createFieldProps(getIn, 'foo', {
        value: false,
        state: empty,
        type: 'checkbox'
      }).input.checked).toBe(false);
    });

    it('should set checked for radio buttons', function () {
      expect(createFieldProps(getIn, 'foo', {
        state: empty,
        type: 'radio',
        _value: 'bar'
      }).input.checked).toBe(false);
      expect(createFieldProps(getIn, 'foo', {
        value: 'bar',
        state: empty,
        type: 'radio',
        _value: 'bar'
      }).input.checked).toBe(true);
      expect(createFieldProps(getIn, 'foo', {
        value: 'baz',
        state: empty,
        type: 'radio',
        _value: 'bar'
      }).input.checked).toBe(false);
    });

    it('should default value to [] for multi-selects', function () {
      expect(createFieldProps(getIn, 'foo', {
        state: empty,
        type: 'select-multiple'
      }).input.value).toBeA('array').toEqual([]);
    });

    it('should default value to undefined for file inputs', function () {
      expect(createFieldProps(getIn, 'foo', {
        state: empty,
        type: 'file'
      }).input.value).toEqual(undefined);
    });

    it('should replace undefined value with empty string', function () {
      var result = createFieldProps(getIn, 'foo', {
        state: empty
      });
      expect(result.input.value).toBe('');
    });

    it('should not format value when format prop is null', function () {
      var result = createFieldProps(getIn, 'foo', {
        state: empty,
        value: null,
        format: null
      });
      expect(result.input.value).toBe(null);
    });
  });
};

describeCreateFieldProps('createFieldProps.plain', plain, addExpectations(plainExpectations));
describeCreateFieldProps('createFieldProps.immutable', immutable, addExpectations(immutableExpectations));