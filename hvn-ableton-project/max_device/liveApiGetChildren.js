import liveApiGetInfo from "./liveApiGetInfo.js";
import treeSequenceBuilder from "./treeSequenceBuilder.js";

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

export default liveApiGetChildren;