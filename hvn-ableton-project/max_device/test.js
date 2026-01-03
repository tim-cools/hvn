
function log() {
  for(var i=0; i < arguments.length; i++) {
    var s = String(arguments[i]);
    post(s.indexOf("[object ") >= 0 ? JSON.stringify(arguments[i], 0, 4) : s);
  }
  post("\n");
}

function startsWith(value, searchFor) {
  for(var i = 0; i < searchFor.length; i++) {
  	if (value.length <= i || value[i] != searchFor[i]) return false;
  }
  return true;
}

function trim(value, trimValue) {
  return value.slice(trimValue.length, 999);
}

function withType(value, trimValue) {
  var parts = trim(value, trimValue).split(' ');
  return {name: parts[0], type: parts[1]};
}

function parseInfo(path) {

  var liveObject = new LiveAPI(path);
  if (liveObject.info == null || liveObject.info == '"No object"') {
    // log("info: '" + path + "' > no object");
    return null;
  }

  //log("path:", liveObject.path);
  //log("id:", liveObject.id);
  //log("children:", liveObject.children);
  //post("\n");

  var info = {
    children: [],
    collections: [],
    properies: [],
    functions: [],
    others: [],
  }

  var lines = liveObject.info.split('\n');

  for (var index = 0 ; index < lines.length ; index++) {
  	var line = lines[index];
    if (line == null) continue;
/*   	post(line); 
  	post("\n");
*/
  	if (startsWith(line, "id ")) {
  		info.id = trim(line, "id ");
  	} else if (startsWith(line, "type ")) {
  		info.type = trim(line, "type ");
  	} else if (startsWith(line, "description ")) {
  		info.description = trim(line, "description ");
  	} else if (startsWith(line, "children ")) {  
      info.collections.push(withType(line, "children "));
    } else if (startsWith(line, "child ")) {
  		info.children.push(withType(line, "child "));
    } else if (startsWith(line, "property ")) {
  		info.properies.push(withType(line, "property "));
  	} else if (startsWith(line, "function ")) {
  		info.functions.push(trim(line, "function "));
      } else {
  		info.others.push(line);
  	}
  }

// post(JSON.stringify(info, 0, 4) + "\n");

  return info;
}

//parseInfo("live_set tracks 0 clip_slots 0 cslip");
//log(get_tree());

//log(parseInfo("control_surfaces"));
//log(getChildren(""))
var liveObject = new LiveAPI("live_set tracks 0");
post("info", "\"" + liveObject.info.replace(/\n/g, "\\\\") + "\\n" );

function getChildren(path) {
  var maxLevel = 1;
  var result = [];
  if (path == "") {
    addNode("", "live_set", result, 0, maxLevel);
    addNode("", "live_app", result, 0, maxLevel);
    //addNodes("", "control_surfaces", result, 0, maxLevel);
    addNode("", "this_device", result, 0, maxLevel);
  } else {
    addNode(path, result, 0, maxLevel);
  }
  return result.join("\n");
}


function addNodes(path, name, result, currentLevel, maxLevel) {

  var info = parseInfo(path);
  if (info == null) return false;

  result.push(path + "-" + info.type);

  //log("path: " + path);
  // log("children " + info.children.length);
  // log("collections " + info.collections.length);

  if (currentLevel == maxLevel) return false;

  var collection = 0;  
  var found = false;
  var indent = false;
  while (collection < 5 || found) {
    if (!indent) {
      result.push("+");
      indent = true;
    }
    found = addNode(path, collection, result, currentLevel + 1, maxLevel);
    collection ++;
  }
  if (indent) {
    result.push("-");
  }

  return true;
}

function addNode(path, name, result, currentLevel, maxLevel) {

  var currentPath = path + " " + name;
  var info = parseInfo(currentPath);
  if (info == null) return false;

  result.push(currentPath + "-" + info.type);
  // result.push(name + "-" + info.type);

  log("path: " + currentPath);
  // log("children " + info.children.length);
  // log("collections " + info.collections.length);

  if (currentLevel == maxLevel) return false;

  var indent = false;
  for (var i = 0; i < info.children.length; i++) {
    var child = info.children[i];
    if (child.name == "canonical_parent") continue;

    if (!indent) {
      result.push("+");
      indent = true;
    }

    addNode(currentPath, child.name, result, currentLevel + 1, maxLevel);
  }
  if (indent) {
    result.push("-");
  }

  indent = false;
  for (var i = 0; i < info.collections.length; i++) {
    var child = info.collections[i];  

    //addNode(path + " " + child.name, result, currentLevel + 1, maxLevel);
   
    var collection = 0;  
    var found = false;
    var indentSub = false;
    while (collection < 5 || found) {
      if (!indentSub) {
        result.push("+");
        if (!addNode(currentPath + " " + child.name, "" + collection, result, currentLevel + 1, maxLevel)) {
          result.push(child.name);
        }
        result.push("+");
        indent = true;
      }
      found = addNode(currentPath + " " + child.name, "" + collection, result, currentLevel + 1, maxLevel);
      if (found) indentSub = true;
      collection ++;
    }
    if (indentSub) {
      result.push("-");
    }
  }
  if (indent) {
    result.push("-");
  }

  return true;
}

function get_tree() {
  var result = [];
  addNode("live_set", result);
  return result.join("\n");
}

function logBuffer(action, buffer) {
  post("\n" + action + ":\n>>>");
  //console.log(buffer.constructor.toString());
  //console.log(JSON.stringify(buffer));
  //console.log(Object.keys(buffer));
  //var object = JSON.parse(buffer);
  //console.log(object);
  for (var index = 0 ; index < buffer.length ; index++) {
    var value = String.charCodeAt(buffer, index);
    if (value < 32) {
      post("(x" + value + ")");
      if (value == 0) {
        post("\n");
      }
    } else {
      //post(value);
      post(String.fromCharCode(value));
    }
  }
  post("<<<\n");
}