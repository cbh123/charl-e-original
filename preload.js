// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const type of ["chrome", "node", "electron"]) {
    replaceText(`${type}-version`, process.versions[type]);
  }
});

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  runPrompt: (prompt) => ipcRenderer.send("run-prompt", prompt),
  cancelRun: () => ipcRenderer.send("cancel-run", {}),
  openFile: (file) => ipcRenderer.send("open-file", file),
  onImageLoad: (callback) => ipcRenderer.on("image-load", callback),
  defaultOutdir: (callback) => ipcRenderer.on("default-outdir", callback),
  onStdout: (callback) => ipcRenderer.on("stdout-message", callback),
  onLoading: (callback) => ipcRenderer.on("loading-update", callback),
});
