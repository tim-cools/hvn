
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
    properties: [],
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