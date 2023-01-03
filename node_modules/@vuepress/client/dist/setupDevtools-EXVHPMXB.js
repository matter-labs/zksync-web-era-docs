// src/setupDevtools.ts
import { setupDevtoolsPlugin } from "@vue/devtools-api";
import { watch } from "vue";
var PLUGIN_ID = "org.vuejs.vuepress";
var PLUGIN_LABEL = "VuePress";
var PLUGIN_COMPONENT_STATE_TYPE = PLUGIN_LABEL;
var INSPECTOR_ID = PLUGIN_ID;
var INSPECTOR_LABEL = PLUGIN_LABEL;
var INSPECTOR_GLOBAL_COMPUTED_ID = "global-computed";
var INSPECTOR_GLOBAL_COMPUTED_LABEL = "Global Computed";
var setupDevtools = (app, globalComputed) => {
  setupDevtoolsPlugin(
    {
      app,
      id: PLUGIN_ID,
      label: PLUGIN_LABEL,
      packageName: "@vuepress/client",
      homepage: "https://v2.vuepress.vuejs.org",
      logo: "https://v2.vuepress.vuejs.org/images/hero.png",
      componentStateTypes: [PLUGIN_COMPONENT_STATE_TYPE]
    },
    (api) => {
      const globalComputedEntries = Object.entries(globalComputed);
      const globalComputedKeys = Object.keys(globalComputed);
      const globalComputedValues = Object.values(globalComputed);
      api.on.inspectComponent((payload) => {
        payload.instanceData.state.push(
          ...globalComputedEntries.map(([name, item]) => ({
            type: PLUGIN_COMPONENT_STATE_TYPE,
            editable: false,
            key: name,
            value: item.value
          }))
        );
      });
      api.addInspector({
        id: INSPECTOR_ID,
        label: INSPECTOR_LABEL,
        icon: "article"
      });
      api.on.getInspectorTree((payload) => {
        if (payload.inspectorId !== INSPECTOR_ID)
          return;
        payload.rootNodes = [
          {
            id: INSPECTOR_GLOBAL_COMPUTED_ID,
            label: INSPECTOR_GLOBAL_COMPUTED_LABEL,
            children: globalComputedKeys.map((name) => ({
              id: name,
              label: name
            }))
          }
        ];
      });
      api.on.getInspectorState((payload) => {
        if (payload.inspectorId !== INSPECTOR_ID)
          return;
        if (payload.nodeId === INSPECTOR_GLOBAL_COMPUTED_ID) {
          payload.state = {
            [INSPECTOR_GLOBAL_COMPUTED_LABEL]: globalComputedEntries.map(
              ([name, item]) => ({
                key: name,
                value: item.value
              })
            )
          };
        }
        if (globalComputedKeys.includes(payload.nodeId)) {
          payload.state = {
            [INSPECTOR_GLOBAL_COMPUTED_LABEL]: [
              {
                key: payload.nodeId,
                value: globalComputed[payload.nodeId].value
              }
            ]
          };
        }
      });
      watch(globalComputedValues, () => {
        api.notifyComponentUpdate();
        api.sendInspectorState(INSPECTOR_ID);
      });
    }
  );
};
export {
  setupDevtools
};
