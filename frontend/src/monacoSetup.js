// Makes @monaco-editor/react use the locally installed monaco-editor package.
// Its default is to fetch monaco from a CDN, which would give us a SECOND
// monaco instance, separate from the one y-monaco imports and binds against.
import * as monaco from "monaco-editor";
import { loader } from "@monaco-editor/react";

// Subpaths go through monaco's exports map, which prepends esm/vs itself.
import editorWorker from "monaco-editor/editor/editor.worker.js?worker";
import jsonWorker from "monaco-editor/language/json/json.worker.js?worker";
import cssWorker from "monaco-editor/language/css/css.worker.js?worker";
import htmlWorker from "monaco-editor/language/html/html.worker.js?worker";
import tsWorker from "monaco-editor/language/typescript/ts.worker.js?worker";

self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === "json") return new jsonWorker();
    if (label === "css" || label === "scss" || label === "less")
      return new cssWorker();
    if (label === "html" || label === "handlebars" || label === "razor")
      return new htmlWorker();
    if (label === "typescript" || label === "javascript") return new tsWorker();
    return new editorWorker();
  },
};

loader.config({ monaco });
