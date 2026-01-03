function parseTreeSequence(sequence) {

  var parts = sequence.split("|");
  var objectStack = [];
  var currentObject = {};
  var lastObject = {};

  for (var index = 0; index < parts.length; index ++) {
    var part = parts[index];
    if (part === "+") {
      objectStack.push(currentObject);
      currentObject = lastObject;
    } else if (part === "-") {
      currentObject = objectStack.pop();
      lastObject = currentObject;
    } else {
      lastObject = {};
      currentObject[part] = lastObject;
    }
  }

  return currentObject;
}

export default parseTreeSequence;