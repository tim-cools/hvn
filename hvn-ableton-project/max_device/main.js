function startsWith(value, searchFor) {
	for (var i = 0; i < searchFor.length; i++) {
		if (value.length <= i || value[i] !== searchFor[i]) return false;
	}
	return true;
}


function trim(value, trimValue) {
	return value.slice(trimValue.length, 999);
}


function liveApiGetInfo(liveApiFactory) {

	var createLiveApi = liveApiFactory ? liveApiFactory : createRealLiveApi;
	var apis = {};

	function createRealLiveApi(path) {
		if (apis[path]) return apis[path];
		return apis[path] = new LiveAPI(path);
	}

	function getInfo(path) {

		function property(name) {
			var start = name + " "; //###
			if (startsWith(line, start)) {
				info[name] = trim(line, start);
				lastProperty = name;
				return true;
			}
			return false;
		}

		function collectionPropertyWithType(name, targetCollection) {
			var start = name + " ";     //###
			if (startsWith(line, start)) {
				var parts = trim(line, start).split(' ');
				targetCollection.push({name: parts[0], type: parts[1]});
				lastProperty = null;
				return true;
			}
			return false;
		}

		function collectionProperty(name, targetCollection) {
			var start = name + " ";
			if (startsWith(line, start)) {
				targetCollection.push(trim(line, start));
				lastProperty = null;
				return true;
			}
			return false;
		}

		var liveObject = createLiveApi(path);
		if (!liveObject) throw new Error("liveObject is null")
		if (liveObject.info == null || liveObject.info === '"No object"') return null;

		var lastProperty = '';
		var info = {
			children: [],
			collections: [],
			properties: [],
			functions: [],
			others: [],
		}

		var lines = liveObject.info.split('\n');

		for (var index = 0; index < lines.length; index++) {
			var line = lines[index];
			if (line == null) continue;

			var processed = property("id")
				|| property("type")
				|| property("description")
				|| collectionPropertyWithType("children", info.collections)
				|| collectionPropertyWithType("child", info.children)
				|| collectionPropertyWithType("property", info.properties)
				|| collectionProperty("function", info.functions)

			if (!processed) {
				if (lastProperty === "description") {
					info.description += "\n" + line;       //description can contain new lines (it probably shouldn't)
				} else if (line !== '' && line !== "done") {
					info.others.push(line)
				}
			}
		}

		return info;
	}

	return getInfo;
}


function liveApiGetChildren(getInfoMethod) {

	const root = "";
	const minCheckCollectionEntries = 5;     // initial entries are sometimes empty, so check at least first 5

	var getInfo = getInfoMethod ? getInfoMethod : liveApiGetInfo();

	function getChildren(path, maxLevel) {

		function getPath(currentPath, name) {
			return currentPath + (currentPath && currentPath.length > 0 ? ' ' : '') + name;
		}

		function addCollection(currentPath, name, currentLevel, always) {

			var path = getPath(currentPath, name);
			var collectionIndex = 0;
			var found = false;

			if (always || currentLevel == maxLevel) {
				if (!addNode(currentPath, name, currentLevel)) {
					tree.addNode(name + ":collection");
				}
				tree.openScope();
			} else {
				tree.optionalParentNodeScope(function () {
					if (!addNode(currentPath, name, currentLevel + 1)) {
						tree.addNode(name + ":collection");
					}
				});
			}

			if (currentLevel >= maxLevel) {
				tree.closeScope();
				return;
			}

			while (collectionIndex < minCheckCollectionEntries || found) {
				found = addNode(path, collectionIndex, currentLevel + 1);
				collectionIndex++;
			}

			tree.closeScope();
		}

		function addChildrenFromInfo(info, path, currentLevel) {
			for (var index = 0; index < info.children.length; index++) {
				var child = info.children[index];
				if (child.name === "canonical_parent") continue;
				addNode(path, child.name, currentLevel + 1);
			}
		}

		function addCollectionsFromInfo(info, path, currentLevel) {
			for (var index = 0; index < info.collections.length; index++) {
				var collection = info.collections[index];
				addCollection(path, collection.name, currentLevel + 1);
			}
		}

		function addNode(currentPath, name, currentLevel) {

			var path = getPath(currentPath, name);
			var info = getInfo(path);

			var indent = currentLevel > 0 ? Array(currentLevel * 2).join(" ") : "";
			if (!info) {
				logging.push(indent + ": " + path + " - no info")
				return false;
			}
			logging.push(indent + ": " + path)

			nodes.push(path + ":" + info.type);
			tree.addNode(name + ":" + info.type)

			if (currentLevel >= maxLevel) return true;

			tree.openScope()
			addChildrenFromInfo(info, path, currentLevel);
			addCollectionsFromInfo(info, path, currentLevel);
			tree.closeScope()

			return true;
		}

		function addRoot() {
			tree.addNode(":root")
			tree.openScope()
			addNode(root, "live_set", 0);
			addNode(root, "live_app", 0);
			addCollection(root, "control_surfaces", 0, true);
			addNode(root, "this_device", 0);
			tree.closeScope()
		}

		function addNodeByPath() {
			var lastIndex = path.lastIndexOf(" ");
			var parentPath = path.substr(0, lastIndex);
			var name = path.substr(lastIndex + 1);
			addNode(parentPath, name, -1);
		}

		var logging = [];
		var tree = treeSequenceBuilder();
		var nodes = [];

		if (path === "") {
			addRoot();
		} else {
			addNodeByPath();
		}

		return {
			nodes: nodes,
			logging: logging,
			sequence: tree.sequence()
		}
	}

	return getChildren;
}


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
			var parentNodeFactory = _currentLevel.addParentNode;
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


var isReady = false;
var started = new Date().getTime().toString();
var actions = {};
var apis = {};
var getChildren = liveApiGetChildren();


function get(action) {
	if (!isReady) return false;

	var json = Array.prototype.slice.call(arguments);
	json = json.slice(1);

	action = action.slice(1);
	var ret = actions[action](json);
}


function on() {
	isReady = true;
}


actions['heartbeat'] = function(obj) {
	outlet(0, '/_heartbeat_reply', "", started);
};


actions['get'] = function(obj) {
	var path = obj[0],
		property = obj[1],
		callback = obj[2];

	var api = getApi(path);
	outlet(0, '/_get_reply', callback, api.get(property));
};


actions['get_children'] = function(obj) {
	var path = obj[0],
		max_level = obj[1],
		callback = obj[2];

	var children = getChildren(path, max_level)
	outlet(0, '/_get_children_reply', callback, children.sequence);
};


actions['info'] = function(obj) {
	var path = obj[0],
		callback = obj[1];

	var api = getApi(path);
	outlet(0, '/_info_reply', callback, api.info);
};

actions['set'] = function(obj) {
	var path = obj[0],
		property = obj[1],
		value = obj[2];

	var api = getApi(path);
	api.set(property, value);
};


actions['call'] = function(obj) {
	var path = obj[0],
		method = obj[1];

	var api = getApi(path);
	api.call(method);
};


actions['observe'] = function(obj) {
	var path = obj[0],
		property = obj[1],
		callback = obj[2];

	var handler = handleCallbacks(callback);

	var api = new LiveAPI(handler, path);
	api.property = property;
};


actions['count'] = function(obj) {
	var path = obj[0],
		property = obj[1],
		callback = obj[2];

	var api = getApi(path);
	outlet(0, '/_get_reply', callback, api.getcount(property));
};


function getApi(path) {
	if (apis[path])
		return apis[path];

	apis[path] = new LiveAPI(path);
	return apis[path];
}


function handleCallbacks(callback) {
	return function(value) {
		outlet(0, '/_observer_reply', callback, value);
	}
}


function log() {
  for(var i=0,len=arguments.length; i<len; i++) {
    var message = arguments[i];
    if(message && message.toString) {
      var s = message.toString();
      if(s.indexOf("[object ") >= 0) {
        s = JSON.stringify(message);
      }
      post(s);
    }
    else if(message === null) {
      post("<null>");
    }
    else {
      post(message);
    }
  }
  post("\n");
}
