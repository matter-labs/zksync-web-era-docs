const id = "mindmap";
const detector = (txt) => {
  return txt.match(/^\s*mindmap/) !== null;
};
const loader = async () => {
  const { diagram } = await import("./diagram-definition.0faef4c2.js");
  return { id, diagram };
};
const plugin = {
  id,
  detector,
  loader
};
export {
  plugin as default
};
//# sourceMappingURL=mermaid-mindmap.esm.mjs.map
