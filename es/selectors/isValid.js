import createHasError from '../hasError';

var createIsValid = function createIsValid(structure) {
  var getIn = structure.getIn;

  var hasError = createHasError(structure);
  return function (form, getFormState, ignoreSubmitErrors) {
    return function (state) {
      var formState = getFormState(state);
      var syncError = getIn(formState, form + '.syncError');
      if (syncError) {
        return false;
      }
      if (!ignoreSubmitErrors) {
        var error = getIn(formState, form + '.error');
        if (error) {
          return false;
        }
      }
      var syncErrors = getIn(formState, form + '.syncErrors');
      var asyncErrors = getIn(formState, form + '.asyncErrors');
      var submitErrors = ignoreSubmitErrors ? undefined : getIn(formState, form + '.submitErrors');
      if (!syncErrors && !asyncErrors && !submitErrors) {
        return true;
      }

      var registeredFields = getIn(formState, form + '.registeredFields') || [];
      return !registeredFields.some(function (field) {
        return hasError(field, syncErrors, asyncErrors, submitErrors);
      });
    };
  };
};

export default createIsValid;