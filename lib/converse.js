var _ = require('underscore')._;

function converse (tree) {
  var converse = {};
  _.each(tree, function (targets, source) {
    return _.each(targets, function (t) {
      if (!converse[t]) {
        return converse[t] = [source];
      } else {
        return converse[t].unshift(source);
      }
    });
  });
  return converse;
};

if (typeof exports == 'object' && exports === this) {
  module.exports = converse;
}
