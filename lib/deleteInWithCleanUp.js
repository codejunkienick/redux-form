'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toPath2 = require('lodash/toPath');

var _toPath3 = _interopRequireDefault(_toPath2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createDeleteInWithCleanUp = function createDeleteInWithCleanUp(_ref) {
  var deepEqual = _ref.deepEqual,
      empty = _ref.empty,
      getIn = _ref.getIn,
      deleteIn = _ref.deleteIn,
      setIn = _ref.setIn;


  var deleteInWithCleanUp = function deleteInWithCleanUp(state, path) {
    var result = state;
    try {
      if (path[path.length - 1] === ']') {
        // array path
        var pathTokens = (0, _toPath3.default)(path);
        pathTokens.pop();
        var parent = getIn(state, pathTokens.join('.'));
        return parent ? setIn(state, path, undefined) : state;
      }
      result = deleteIn(state, path);
      var dotIndex = path.lastIndexOf('.');
      if (dotIndex > 0) {
        var parentPath = path.substring(0, dotIndex);
        if (parentPath[parentPath.length - 1] !== ']') {
          var _parent = getIn(result, parentPath);
          if (deepEqual(_parent, empty)) {
            return deleteInWithCleanUp(result, parentPath);
          }
        }
      }
    } catch (err) {
      console.log('[RF ERR]', err);
    }
    return result;
  };

  return deleteInWithCleanUp;
};

exports.default = createDeleteInWithCleanUp;