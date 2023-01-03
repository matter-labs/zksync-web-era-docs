const id = "mindmap";
const detector = (txt) => {
  return txt.match(/^\s*mindmap/) !== null;
};
const loadDiagram = async () => {
  const { diagram } = await import("./diagram-definition.4f9deca5.js");
  return { id, diagram };
};
export {
  detector,
  id,
  loadDiagram
};
//# sourceMappingURL=mermaid-mindmap-detector.esm.mjs.map
