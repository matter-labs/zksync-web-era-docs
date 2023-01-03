const id = "mindmap";
const detector = (txt) => {
  return txt.match(/^\s*mindmap/) !== null;
};
const loader = async () => {
  const { diagram } = await import("./diagram-definition.ae1f7a29.js");
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
//# sourceMappingURL=mermaid-mindmap.core.mjs.map
