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
	return true;
  }
}

function trim(value, trimValue) {
  return value.slice(trimValue.length, 999);
}


var liveObject = new LiveAPI("live_set tracks 0 clip_slots 0 clip");

// log("path:", liveObject.path);
//log("id:", liveObject.id);
//log("children:", liveObject.children);

post(liveObject.info.length);

//post("\n");

var info = {
  children: [],
  properies: [],
  functions: [],
  others: [],
}

var lines = liveObject.info.split('\n');

for (var index = 0 ; index < lines.length ; index++) {
	var line = lines[index];
 	post(line); 
	post("\n");

	if (startsWith(line, "id ")) {
		info.id = trim(line, "id ");
	} else if (startsWith(line, "type ")) {
		info.type = trim(line, "type ");
	} else if (startsWith(line, "description ")) {
		info.description = trim(line, "description ");
	} else if (startsWith(line, "child ")) {
		info.children.push(trim(line, "child "));
	} else if (startsWith(line, "property ")) {
		info.properies.push(trim(line, "property "));
	} else if (startsWith(line, "function ")) {
		info.functions.push(trim(line, "function "));
    } else {
		info.others.push(line);
	}
}


  post(JSON.stringify(info, 0, 4));
  post("\n");


// ost(JSON.stringify(liveObject.info, 0, 4));

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