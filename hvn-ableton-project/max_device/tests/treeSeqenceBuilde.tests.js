import parseTreeSequence from "../parseTreeSequence.js"
import treeSequenceBuilder from "../treeSequenceBuilder.js"
import expect from "expect"

describe('treeSequenceBuilder', () => {
  it('should sequence 2 level nodes', () => {
    var builder = new treeSequenceBuilder();
    builder.addNode("root1");
    builder.openScope();
    builder.addNode("child11");
    builder.addNode("child12");
    builder.closeScope();
    builder.addNode("root2");
    builder.openScope();
    builder.addNode("child21");
    builder.addNode("child22");
    builder.closeScope();

    var sequence = builder.sequence();
    expect(sequence).toBe("root1|+|child11|child12|-|root2|+|child21|child22|-");

    var tree = parseTreeSequence(sequence);
    expect(tree).not.toBeUndefined();
    expect(tree["root1"]).not.toBeUndefined();
    expect(tree["root1"]["child11"]).not.toBeUndefined();
    expect(tree["root1"]["child12"]).not.toBeUndefined();
    expect(tree["root2"]).not.toBeUndefined();
    expect(tree["root2"]["child21"]).not.toBeUndefined();
    expect(tree["root2"]["child22"]).not.toBeUndefined();
  });

  it('should sequence 4 level nodes', () => {
    var builder = new treeSequenceBuilder();
    builder.addNode("root1");
    builder.openScope();
    builder.addNode("child11");
    builder.addNode("child12");
    builder.openScope();
    builder.addNode("child121");
    builder.addNode("child122");
    builder.openScope();
    builder.addNode("child1221");
    builder.addNode("child1222");
    builder.closeScope();
    builder.closeScope();
    builder.closeScope();
    builder.addNode("root2");
    builder.openScope();
    builder.addNode("child21");
    builder.addNode("child22");
    builder.closeScope();

    var sequence = builder.sequence();
    expect(sequence).toBe("root1|+|child11|child12|+|child121|child122|+|child1221|child1222|-|-|-|root2|+|child21|child22|-");

    var tree = parseTreeSequence(sequence);
    expect(tree).not.toBeUndefined();
    expect(tree["root1"]).not.toBeUndefined();
    expect(tree["root1"]["child11"]).not.toBeUndefined();
    expect(tree["root1"]["child12"]).not.toBeUndefined();
    expect(tree["root1"]["child12"]["child121"]).not.toBeUndefined();
    expect(tree["root1"]["child12"]["child122"]).not.toBeUndefined();
    expect(tree["root1"]["child12"]["child122"]["child1221"]).not.toBeUndefined();
    expect(tree["root1"]["child12"]["child122"]["child1222"]).not.toBeUndefined();
    expect(tree["root2"]).not.toBeUndefined();
    expect(tree["root2"]["child21"]).not.toBeUndefined();
    expect(tree["root2"]["child22"]).not.toBeUndefined();
  });

  it('should not sequence empty scopes', () => {
    var builder = new treeSequenceBuilder();
    builder.addNode("root1");
    builder.openScope();
    builder.closeScope();
    builder.openScope();
    builder.addNode("child11");
    builder.addNode("child12");
    builder.openScope();
    builder.closeScope();
    builder.closeScope();
    builder.addNode("root2");
    builder.openScope();
    builder.addNode("child21");
    builder.addNode("child22");
    builder.closeScope();

    var sequence = builder.sequence();
    expect(sequence).toBe("root1|+|child11|child12|-|root2|+|child21|child22|-");

    var tree = parseTreeSequence(sequence);
    expect(tree).not.toBeUndefined();
    expect(tree["root1"]).not.toBeUndefined();
    expect(tree["root1"]["child11"]).not.toBeUndefined();
    expect(tree["root1"]["child12"]).not.toBeUndefined();
    expect(tree["root2"]).not.toBeUndefined();
    expect(tree["root2"]["child21"]).not.toBeUndefined();
    expect(tree["root2"]["child22"]).not.toBeUndefined();
  });
});