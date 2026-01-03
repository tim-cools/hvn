function treeSequenceBuilder() {

  var _sequence = "";

  function addSeparatorIfNeeded() {
    if (_sequence.length > 0) {
      _sequence += "|";
    }
  }

  function addNode(name) {
    addSeparatorIfNeeded();
    _sequence += name;
  }

  function openScope() {
    _sequence += "|+";
  }

  function closeScope() {
    _sequence += "|-";
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