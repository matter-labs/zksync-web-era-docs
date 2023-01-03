const id = "mindmap";
const detector = (txt) => {
  return txt.match(/^\s*mindmap/) !== null;
};
const loadDiagram = async () => {
  const { diagram } = await import("./diagram-definition.3d6a41db.js");
  return { id, diagram };
};
export {
  detector,
  id,
  loadDiagram
};
//# sourceMappingURL=mermaid-mindmap-detector.core.mjs.map
