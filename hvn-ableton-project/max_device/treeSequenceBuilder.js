function treeSequenceBuilder() {

  var _sequence = "";
  var _currentLevel = {childrenAdded: true};
  var _levels = [];

  function startScopeIfNeeded() {
    if (!_currentLevel.childrenAdded) {
      _currentLevel.childrenAdded = true;
      _sequence += "|+";
    }
  }

  function addSeparatorIfNeeded() {
    if (_sequence.length > 0) {
      _sequence += "|";
    }
  }

  function addNode(name) {
    startScopeIfNeeded();
    addSeparatorIfNeeded();
    _sequence += name;
  }

  function openScope() {
    _levels.push(_currentLevel);
    _currentLevel = {childrenAdded: false}
  }

  function closeScope() {
    if (_currentLevel.childrenAdded) {
      _sequence += "|-";
    }
    _currentLevel = _levels.pop();
  }

  function sequence() {
    return _sequence;
  }

  return {
    addNode: addNode,
    openScope: openScope,
    closeScope: closeScope,
    sequence: sequence
  }
}

export default treeSequenceBuilder;