import liveApiGetChildren from "../liveApiGetChildren.js"
import parseTreeSequence from "../parseTreeSequence.js";
import expect from "expect"

function liveObject(id, prefix, addChildren, addCollections) {

  const children = !!addChildren ? [
    {name: prefix + "_child1", type: prefix + "Child1"},
    {name: prefix + "_child2", type: prefix + "Child2"},
    {name: prefix + "_child3", type: prefix + "Child3"}
  ] : [];

  const collections = !!addCollections ? [
    {name: prefix + "_tracks1", type: prefix + "Tracks1"},
    {name: prefix + "_tracks2", type: prefix + "Tracks2"},
  ] : [];

  return {
    id: id,
    type: "type" + id,
    children: children,
    collections: collections
  }
}

const infoStubs = {
  "live_set": liveObject(1, "ls", true, false),
  "live_set ls_child1": liveObject(11, "ls1", true, false),
  "live_set ls_child1 ls1_child1": liveObject(111, "ls11", false, false),
  "live_set ls_child1 ls1_child2": liveObject(112, "ls12", false, false),
  "live_set ls_child1 ls1_child3": liveObject(113, "ls13", false, false),
  "live_set ls_child2": liveObject(12, "ls2", true, false),
  "live_set ls_child2 ls2_child1": liveObject(121, "ls21", false, false),
  "live_set ls_child2 ls2_child2": liveObject(122, "ls22", false, false),
  "live_set ls_child2 ls2_child3": liveObject(123, "ls23", false, false),
  "live_set ls_child3": liveObject(13, "ls3", true, false),
  "live_set ls_child3 ls3_child1": liveObject(131, "ls31", false, false),
  "live_set ls_child3 ls3_child2": liveObject(132, "ls32", false, false),
  "live_set ls_child3 ls3_child3": liveObject(132, "ls33", false, false),
  "live_app": liveObject(2, "la", true, false),
  "live_app la_child1": liveObject(21, "la1", true, false),
  "live_app la_child1 la1_child1": liveObject(211, "la21", false, false),
  "live_app la_child1 la1_child2": liveObject(212, "la22", false, false),
  "live_app la_child1 la1_child3": liveObject(213, "la23", false, false),
  "live_app la_child2": liveObject(22, "la2", true, false),
  "live_app la_child2 la2_child1": liveObject(121, "la21", false, false),
  "live_app la_child2 la2_child2": liveObject(122, "la22", false, false),
  "live_app la_child2 la2_child3": liveObject(123, "la23", false, false),
  "live_app la_child3": liveObject(23, "la3", true, false),
  "live_app la_child3 la3_child1": liveObject(131, "ls31", false, false),
  "live_app la_child3 la3_child2": liveObject(132, "ls32", false, false),
  "live_app la_child3 la3_child3": liveObject(132, "ls33", false, false),
  "control_surfaces": liveObject(3, "cs", false, false),
  "control_surfaces 0": liveObject(31, "cs0", false, false),
  "control_surfaces 1": liveObject(32, "cs1", false, false),
  "control_surfaces 2": liveObject(33, "cs2", false, false),
  "this_device": liveObject(4, "td", false, false),
}

function getInfoMock(path) {
  return infoStubs[path];
}

const infoStubsCollections = {
  "live_set": liveObject(1, "ls", true, false),
  "live_set ls_child1": liveObject(11, "ls1", false, true),
  "live_set ls_child1 ls1_tracks1 0": liveObject(111, "ls11", true, false),
  "live_set ls_child1 ls1_tracks1 0 ls11_child1": liveObject(1111, "ls111", false, false),
  "live_set ls_child1 ls1_tracks1 0 ls11_child2": liveObject(1112, "ls112", false, false),
  "live_set ls_child1 ls1_tracks1 0 ls11_child3": liveObject(1113, "ls113", false, false),
  "live_set ls_child1 ls1_tracks1 1": liveObject(112, "ls12", false, false),
  "live_set ls_child1 ls1_tracks1 2": liveObject(113, "ls13", false, false),
  "live_set ls_child1 ls1_tracks2 3": liveObject(123, "ls21", false, false),
  "live_set ls_child1 ls1_tracks2 4": liveObject(124, "ls22", false, false),
  "live_set ls_child1 ls1_tracks2 5": liveObject(125, "ls23", false, false),
}

function getInfoMockCollections(path) {
  return infoStubsCollections[path];
}

describe('liveApiGetChildren from root', () => {
  it('no level should return no children', () => {

    var getChildren = liveApiGetChildren(getInfoMock);
    var result = getChildren("", 0);

    console.log(result);

    expect(result.sequence).toBe(":root|" +
      "+|live_set:type1|live_app:type2|control_surfaces:type3|this_device:type4|-")
  });

  it('one levels should return children', () => {

    var getChildren = liveApiGetChildren(getInfoMock);
    var result = getChildren("", 1);

    console.log(result);

    expect(result.sequence).toBe(':root|+|' +
      'live_set:type1|' +
        '+|ls_child1:type11|ls_child2:type12|ls_child3:type13|-|' +
      'live_app:type2|' +
        '+|la_child1:type21|la_child2:type22|la_child3:type23|-|' +
      'control_surfaces:type3|' +
        '+|0:type31|1:type32|2:type33|-|' +
      'this_device:type4|-')
  });

  it('two levels should return children', () => {

    var getChildren = liveApiGetChildren(getInfoMock);
    var result = getChildren("", 2);

    console.log(result);

    expect(result.sequence).toBe(':root|+|' +
      'live_set:type1|' +
        '+|ls_child1:type11|' +
          '+|ls1_child1:type111|ls1_child2:type112|ls1_child3:type113|-' +
         '|ls_child2:type12|' +
          '+|ls2_child1:type121|ls2_child2:type122|ls2_child3:type123|-' +
         '|ls_child3:type13|' +
          '+|ls3_child1:type131|ls3_child2:type132|ls3_child3:type132|-|-' +
      '|live_app:type2|' +
        '+|la_child1:type21|' +
          '+|la1_child1:type211|la1_child2:type212|la1_child3:type213|-' +
        '|la_child2:type22|' +
          '+|la2_child1:type121|la2_child2:type122|la2_child3:type123|-' +
        '|la_child3:type23|' +
          '+|la3_child1:type131|la3_child2:type132|la3_child3:type132|-|-' +
      '|control_surfaces:type3|' +
        '+|0:type31|1:type32|2:type33|-' +
      '|this_device:type4|-');

    var tree = parseTreeSequence(result.sequence);
    expect(tree).not.toBeUndefined();
    expect(tree[""]["live_set"]).not.toBeUndefined();
    expect(tree[""]["live_set"]["ls_child1"]).not.toBeUndefined();
    expect(tree[""]["live_set"]["ls_child1"]["ls1_child1"]).not.toBeUndefined();
    expect(tree[""]["live_set"]["ls_child1"]["ls1_child2"]).not.toBeUndefined();
    expect(tree[""]["live_set"]["ls_child1"]["ls1_child3"]).not.toBeUndefined();
    expect(tree[""]["live_set"]["ls_child2"]).not.toBeUndefined();
    expect(tree[""]["live_set"]["ls_child2"]["ls2_child1"]).not.toBeUndefined();
    expect(tree[""]["live_set"]["ls_child2"]["ls2_child2"]).not.toBeUndefined();
    expect(tree[""]["live_set"]["ls_child2"]["ls2_child3"]).not.toBeUndefined();
    expect(tree[""]["live_set"]["ls_child3"]).not.toBeUndefined();
    expect(tree[""]["live_set"]["ls_child3"]["ls3_child1"]).not.toBeUndefined();
    expect(tree[""]["live_set"]["ls_child3"]["ls3_child2"]).not.toBeUndefined();
    expect(tree[""]["live_set"]["ls_child3"]["ls3_child3"]).not.toBeUndefined();
    expect(tree[""]["live_app"]).not.toBeUndefined();
    expect(tree[""]["live_app"]["la_child1"]).not.toBeUndefined();
    expect(tree[""]["live_app"]["la_child1"]["la1_child1"]).not.toBeUndefined();
    expect(tree[""]["live_app"]["la_child1"]["la1_child2"]).not.toBeUndefined();
    expect(tree[""]["live_app"]["la_child1"]["la1_child3"]).not.toBeUndefined();
    expect(tree[""]["live_app"]["la_child2"]).not.toBeUndefined();
    expect(tree[""]["live_app"]["la_child2"]["la2_child1"]).not.toBeUndefined();
    expect(tree[""]["live_app"]["la_child2"]["la2_child2"]).not.toBeUndefined();
    expect(tree[""]["live_app"]["la_child2"]["la2_child3"]).not.toBeUndefined();
    expect(tree[""]["live_app"]["la_child3"]).not.toBeUndefined();
    expect(tree[""]["live_app"]["la_child3"]["la3_child1"]).not.toBeUndefined();
    expect(tree[""]["live_app"]["la_child3"]["la3_child2"]).not.toBeUndefined();
    expect(tree[""]["live_app"]["la_child3"]["la3_child3"]).not.toBeUndefined();
    expect(tree[""]["control_surfaces"]).not.toBeUndefined();
    expect(tree[""]["control_surfaces"]["0"]).not.toBeUndefined();
    expect(tree[""]["control_surfaces"]["1"]).not.toBeUndefined();
    expect(tree[""]["control_surfaces"]["2"]).not.toBeUndefined();
    expect(tree[""]["this_device"]).not.toBeUndefined();
  });
});

describe('liveApiGetChildren from child', () => {
  it('no level should return no children', () => {

    var getChildren = liveApiGetChildren(getInfoMock);
    var result = getChildren("live_app", 0);

    console.log(result);

    expect(result.sequence).toBe("live_app:type2|+|la_child1:type21|la_child2:type22|la_child3:type23|-")
  });

  it('one levels should return children', () => {

    var getChildren = liveApiGetChildren(getInfoMock);
    var result = getChildren("live_app", 1);

    console.log(result);

    expect(result.sequence).toBe('live_app:type2|+|' +
      'la_child1:type21|' +
        '+|la1_child1:type211|la1_child2:type212|la1_child3:type213|-' +
      '|la_child2:type22|' +
        '+|la2_child1:type121|la2_child2:type122|la2_child3:type123|-' +
      '|la_child3:type23|' +
        '+|la3_child1:type131|la3_child2:type132|la3_child3:type132|-|-');
  });

  it('two levels should return children', () => {

    var getChildren = liveApiGetChildren(getInfoMock);
    var result = getChildren("live_app", 2);

    console.log(result);

    expect(result.sequence).toBe('live_app:type2|' +
      '+|la_child1:type21|' +
        '+|la1_child1:type211|la1_child2:type212|la1_child3:type213|-' +
      '|la_child2:type22|' +
        '+|la2_child1:type121|la2_child2:type122|la2_child3:type123|-' +
      '|la_child3:type23|' +
        '+|la3_child1:type131|la3_child2:type132|la3_child3:type132|-|-');

    var tree = parseTreeSequence(result.sequence);
    expect(tree).not.toBeUndefined();
    expect(tree["live_app"]["la_child1"]).not.toBeUndefined();
    expect(tree["live_app"]["la_child1"]["la1_child1"]).not.toBeUndefined();
    expect(tree["live_app"]["la_child1"]["la1_child2"]).not.toBeUndefined();
    expect(tree["live_app"]["la_child1"]["la1_child3"]).not.toBeUndefined();
    expect(tree["live_app"]["la_child2"]).not.toBeUndefined();
    expect(tree["live_app"]["la_child2"]["la2_child1"]).not.toBeUndefined();
    expect(tree["live_app"]["la_child2"]["la2_child2"]).not.toBeUndefined();
    expect(tree["live_app"]["la_child2"]["la2_child3"]).not.toBeUndefined();
    expect(tree["live_app"]["la_child3"]).not.toBeUndefined();
    expect(tree["live_app"]["la_child3"]["la3_child1"]).not.toBeUndefined();
    expect(tree["live_app"]["la_child3"]["la3_child2"]).not.toBeUndefined();
    expect(tree["live_app"]["la_child3"]["la3_child3"]).not.toBeUndefined();
  });
});

describe('liveApiGetChildren with collections', () => {
  it('two level should return no collection children', () => {

    var getChildren = liveApiGetChildren(getInfoMockCollections);
    var result = getChildren("", 2);

    console.log(result);

    expect(result.sequence).toBe(":root|" +
      "+|live_set:type1|" +
        "+|ls_child1:type11|" +
          "+|ls1_tracks1:collection|ls1_tracks2:collection|-|-" +
      "|control_surfaces:collection|-");
  });

  it('three level should return collection', () => {

    var getChildren = liveApiGetChildren(getInfoMockCollections);
    var result = getChildren("", 3);

    console.log(result);

    expect(result.sequence).toBe(":root|" +
      "+|live_set:type1|" +
        "+|ls_child1:type11|" +
          "+|ls1_tracks1:collection|" +
            "+|0:type111|1:type112|2:type113|-" +
          "|ls1_tracks2:collection|" +
            "+|3:type123|4:type124|5:type125|-|-|-" +
      "|control_surfaces:collection|-");
  });

  it('four level should return collection and children', () => {

    var getChildren = liveApiGetChildren(getInfoMockCollections);
    var result = getChildren("", 4);

    console.log(result);

    expect(result.sequence).toBe(":root|" +
      "+|live_set:type1|" +
        "+|ls_child1:type11|" +
          "+|ls1_tracks1:collection|" +
            "+|0:type111|" +
              "+|ls11_child1:type1111|ls11_child2:type1112|ls11_child3:type1113|-" +
            "|1:type112|2:type113|-" +
          "|ls1_tracks2:collection|" +
            "+|3:type123|4:type124|5:type125|-|-|-" +
      "|control_surfaces:collection|-");
  });

  it('one levels should not return collection', () => {

    var getChildren = liveApiGetChildren(getInfoMockCollections);
    var result = getChildren("live_set", 1);

    console.log(result);

    expect(result.sequence).toBe('live_set:type1|' +
      "+|ls_child1:type11|" +
        "+|ls1_tracks1:collection|ls1_tracks2:collection|-|-");
  });

  it('two levels should return collection', () => {

    var getChildren = liveApiGetChildren(getInfoMockCollections);
    var result = getChildren("live_set", 2);

    console.log(result);

    expect(result.sequence).toBe('live_set:type1|' +
      "+|ls_child1:type11|" +
        "+|ls1_tracks1:collection|" +
          "+|0:type111|1:type112|2:type113|-" +
        "|ls1_tracks2:collection|" +
          "+|3:type123|4:type124|5:type125|-|-|-");

    var tree = parseTreeSequence(result.sequence);
    expect(tree).not.toBeUndefined();
    expect(tree["live_set"]["ls_child1"]).not.toBeUndefined();
    expect(tree["live_set"]["ls_child1"]["ls1_tracks1"]).not.toBeUndefined();
    expect(tree["live_set"]["ls_child1"]["ls1_tracks1"]["0"]).not.toBeUndefined();
    expect(tree["live_set"]["ls_child1"]["ls1_tracks1"]["1"]).not.toBeUndefined();
    expect(tree["live_set"]["ls_child1"]["ls1_tracks1"]["2"]).not.toBeUndefined();
    expect(tree["live_set"]["ls_child1"]["ls1_tracks2"]).not.toBeUndefined();
    expect(tree["live_set"]["ls_child1"]["ls1_tracks2"]["3"]).not.toBeUndefined();
    expect(tree["live_set"]["ls_child1"]["ls1_tracks2"]["4"]).not.toBeUndefined();
    expect(tree["live_set"]["ls_child1"]["ls1_tracks2"]["5"]).not.toBeUndefined();
  });
});