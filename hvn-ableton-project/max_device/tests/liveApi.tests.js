import liveApi from "../test"
import expect from "expect"

function getInfoMock() {

}


var api = liveApi(getInfoMock);
var treeSequence = api.getChildren(3);

expect(treeSequence).not.toBeNull();

