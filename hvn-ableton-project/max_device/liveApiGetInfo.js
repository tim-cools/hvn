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

  var createLiveApi = !!liveApiFactory ? liveApiFactory : createRealLiveApi;

  function createRealLiveApi(path) {
    return new LiveAPI(path);
  }

  function getInfo(path) {

    function property(name) {
      let start = `${name} `;
      if (startsWith(line, start)) {
        info[name] = trim(line, start);
        lastProperty = name;
        return true;
      }
      return false;
    }

    function collectionPropertyWithType(name, targetCollection) {
      let start = `${name} `;
      if (startsWith(line, start)) {
        let parts = trim(line, start).split(' ');
        targetCollection.push({name: parts[0], type: parts[1]});
        lastProperty = null;
        return true;
      }
      return false;
    }

    function collectionProperty(name, targetCollection) {
      let start = `${name} `;
      if (startsWith(line, start)) {
        targetCollection.push(trim(line, start));
        lastProperty = null;
        return true;
      }
      return false;
    }

    var liveObject = createLiveApi(path);
    if (!liveObject) throw new Error("liveObject is null")
    if (liveObject.info == null || liveObject.info == '"No object"') return null;

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

export default liveApiGetInfo;