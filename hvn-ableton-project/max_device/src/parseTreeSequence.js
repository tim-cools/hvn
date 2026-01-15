function parseTreeSequence(sequence) {

  var parts = sequence.split("|");
  var objectStack = [];
  var currentObject = {};
  var lastObject = currentObject;

  for (var index = 0; index < parts.length; index ++) {
    var part = parts[index];
    var nodeParts = part.split(":");
    var name = nodeParts[0];
    if (name === "+") {
      objectStack.push(currentObject);
      currentObject = lastObject;
    } else if (name === "-") {
      if (objectStack.length === 0) {
        throw new Error("Invalid token '-', sequence is incomplete: " + sequence);
      }
      currentObject = objectStack.pop();
      lastObject = currentObject;
    } else {
      lastObject = {};
      currentObject[name] = lastObject;
    }
  }

  if (objectStack.length === 1) {
    throw new Error("Invalid sequence, not closed: " + sequence);
  }

  return currentObject;
}

export default parseTreeSequence;