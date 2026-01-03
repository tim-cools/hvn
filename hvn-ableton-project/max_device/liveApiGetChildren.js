import liveApiGetInfo from "./liveApiGetInfo.js";
import treeSequenceBuilder from "./treeSequenceBuilder.js";

const root = "";

function liveApiGetChildren(getInfoMethod) {

  const minCheckCollectionEntries = 5;     // initial entries are sometimes empty, so check at least first 5

  var getInfo = !!getInfoMethod ? getInfoMethod : realGetInfo;

  function realGetInfo(path) {
    var getInfoObject = liveApiGetInfo(path);
    return getInfoObject(path);
  }

  function getChildren(path, maxLevel) {

    function addCollection(currentPath, name, currentLevel, always) {

      let path = `${currentPath}${currentPath.length > 0 ? ' ' : ''}${name}`;
      let collectionIndex = 0;
      let found = false;

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
      for (let index = 0; index < info.children.length; index++) {
        let child = info.children[index];
        if (child.name === "canonical_parent") continue;
        addNode(path, child.name, currentLevel + 1);
      }
    }

    function addCollectionsFromInfo(info, path, currentLevel) {
      for (let index = 0; index < info.collections.length; index++) {
        let collection = info.collections[index];
        addCollection(path, collection.name, currentLevel + 1);
      }
    }

    function addNode(currentPath, name, currentLevel) {

      let path = `${currentPath}${currentPath.length > 0 ? ' ' : ''}${name}`;
      let info = getInfo(path);

      if (!info) {
        logging.push(' '.repeat(currentLevel * 2) + ": " + path + " - no info")
        return false;
      }
      logging.push(' '.repeat(currentLevel * 2) + ": " + path)

      nodes.push(path + ":" + info.type);
      tree.addNode(name + ":" + info.type)

      if (currentLevel >= maxLevel) return true;

      tree.openScope()
      addChildrenFromInfo(info, path, currentLevel);
      addCollectionsFromInfo(info, path, currentLevel);
      tree.closeScope()

      return true;
    }

    function addChildren(path) {

      let info = getInfo(path);

      if (!info) {
        logging.push(": " + path + " - no info")
        return false;
      }
      logging.push(": " + path)

      addChildrenFromInfo(info, path, -1);
      addCollectionsFromInfo(info, path, -1);

      return true;
    }

    let logging = [];
    let tree = treeSequenceBuilder();
    let nodes = [];
    if (path === "") {
      addNode(root, "live_set", 0);
      addNode(root, "live_app", 0);
      addCollection(root, "control_surfaces", 0, true);
      addNode(root, "this_device", 0);
    } else {
      addChildren(path);
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