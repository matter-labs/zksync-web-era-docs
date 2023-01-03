const a = "mindmap", n = (t) => t.match(/^\s*mindmap/) !== null, r = async () => {
  const { diagram: t } = await import("./diagram-definition.4f9deca5.js");
  return { id: a, diagram: t };
};
export {
  n as detector,
  a as id,
  r as loadDiagram
};
//# sourceMappingURL=mermaid-mindmap-detector.esm.min.mjs.map
