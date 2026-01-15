import parseTreeSequence from "../src/parseTreeSequence.js"
import treeSequenceBuilder from "../src/treeSequenceBuilder.js"
import expect from "expect"

describe('treeSequenceBuilder', () => {
  it('should sequence 2 level nodes', () => {
    var builder = treeSequenceBuilder();
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
    var builder = treeSequenceBuilder();
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
    var builder = treeSequenceBuilder();
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

  it('should not render optional parent nodes', () => {
    var builder = treeSequenceBuilder();
    builder.addNode("root1");
    builder.openScope();
      builder.addNode("child11");
      builder.addNode("child12");
      builder.optionalParentNodeScope(() => builder.addNode("optionalNode0"))
      builder.closeScope();
    builder.closeScope();
    builder.optionalParentNodeScope(() => builder.addNode("optionalNode1"))
      builder.addNode("child21");
      builder.addNode("child22");
      builder.optionalParentNodeScope(() => builder.addNode("optionalNode11"))
        builder.addNode("child211");
        builder.addNode("child221");
      builder.closeScope();
    builder.closeScope();
    builder.optionalParentNodeScope(() => builder.addNode("optionalNode2"))
    builder.closeScope();

    var sequence = builder.sequence();
    expect(sequence).toBe("root1|+|child11|child12|-|optionalNode1|+|child21|child22|optionalNode11|+|child211|child221|-|-");

    var tree = parseTreeSequence(sequence);
    expect(tree).not.toBeUndefined();
    expect(tree["root1"]).not.toBeUndefined();
    expect(tree["root1"]["child11"]).not.toBeUndefined();
    expect(tree["root1"]["child12"]).not.toBeUndefined();
    expect(tree["optionalNode1"]).not.toBeUndefined();
    expect(tree["optionalNode1"]["child21"]).not.toBeUndefined();
    expect(tree["optionalNode1"]["child22"]).not.toBeUndefined();
    expect(tree["optionalNode1"]["optionalNode11"]).not.toBeUndefined();
    expect(tree["optionalNode1"]["optionalNode11"]["child211"]).not.toBeUndefined();
    expect(tree["optionalNode1"]["optionalNode11"]["child221"]).not.toBeUndefined();
  });
});