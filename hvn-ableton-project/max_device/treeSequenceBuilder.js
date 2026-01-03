function treeSequenceBuilder() {

  var _sequence = "";
  var _currentLevel = {childrenAdded: true};
  var _levels = [];

  function renderOpenScopeIfNeeded() {
    if (!_currentLevel.childrenAdded) {
      _currentLevel.childrenAdded = true;
      _sequence += "|+";
    }
  }

  function renderSeparatorIfNeeded() {
    if (_sequence.length > 0) {
      _sequence += "|";
    }
  }

  function addNode(name) {
    if (_currentLevel.addParentNode) {
      let parentNodeFactory = _currentLevel.addParentNode;
      _currentLevel.addParentNode = null;
      parentNodeFactory();
      openScope();
    }
    renderOpenScopeIfNeeded();
    renderSeparatorIfNeeded();
    _sequence += name;
  }

  function optionalParentNodeScope(addParentNode) {
    _currentLevel.addParentNode = addParentNode;
  }

  function openScope() {
    _levels.push(_currentLevel);
    _currentLevel = {childrenAdded: false}
  }

  function closeScope() {
    if (_currentLevel.addParentNode) {
      _currentLevel.addParentNode = null;
      return;
    }
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
    sequence: sequence,
    optionalParentNodeScope: optionalParentNodeScope
  }
}

export default treeSequenceBuilder;