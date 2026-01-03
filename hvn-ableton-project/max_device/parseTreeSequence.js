function parseTreeSequence(sequence) {

  var parts = sequence.split("|");
  var objectStack = [];
  var currentObject = {};
  var lastObject = {};

  for (var index = 0; index < parts.length; index ++) {
    var part = parts[index];
    var nodeParts = part.split(":");
    var name = nodeParts[0];
    if (name === "+") {
      objectStack.push(currentObject);
      currentObject = lastObject;
    } else if (name === "-") {
      currentObject = objectStack.pop();
      lastObject = currentObject;
    } else {
      lastObject = {};
      currentObject[name] = lastObject;
    }
  }

  return currentObject;
}

export default parseTreeSequence;