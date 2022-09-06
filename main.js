// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, shell } = require("electron");
const path = require("path");
var fs = require("fs");
var os = require("os");
const DEFAULT_OUTDIR = `${os.homedir()}/Desktop/charl-e/samples`;
const MODEL_DIR = `${os.homedir()}/Desktop/charl-e/models/model.ckpt`;
const CONFIG_DIR = `${os.homedir()}/Desktop/charl-e/configs/v1-inference.yaml`;
let PID = null;
process.env.PYTORCH_ENABLE_MPS_FALLBACK = 1;

function getLatestImage(filepath) {
  const dirents = fs.readdirSync(filepath, { withFileTypes: true });

  const filesNames = dirents
    .filter((dirent) => dirent.isFile())
    .map(function (fileName) {
      console.log(fileName);
      return {
        name: fileName.name,
        time: fs.statSync(filepath + "/" + fileName.name).mtime.getTime(),
      };
    })
    .sort(function (a, b) {
      return a.time - b.time;
    })
    .map((file) => file.name);

  console.log(filesNames.at(-1));
  return `${DEFAULT_OUTDIR}/${filesNames.at(-1)}`;
}

function getPaths(filepath) {
  // We're in prod
  if (fs.existsSync(filepath)) {
    return {
      config: process.resourcesPath + "/app/configs/v1-inference.yaml",
      executable: process.resourcesPath + "/app/dist/txt2img",
      weights: process.resourcesPath + "/app/models/model.ckpt",
    };
    // we're in dev
  } else {
    return {
      config: CONFIG_DIR,
      executable: "./dist/txt2img",
      weights: MODEL_DIR,
    };
  }
}

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // create a new `splash`-Window
  splash = new BrowserWindow({
    width: 810,
    height: 610,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
  });

  splash.loadURL(`file://${__dirname}/splash.html`);
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  mainWindow.webContents.on("did-finish-load", () => {
    // If we want to load recent images on load
    // mainWindow.webContents.send("image-load", getLatestImage(DEFAULT_OUTDIR));
    mainWindow.webContents.send("default-outdir", DEFAULT_OUTDIR);
  });

  ipcMain.on("open-file", (event, file) => {
    shell.showItemInFolder(file.replace("file://", ""));
  });

  ipcMain.on("cancel-run", (event, value) => {
    process.kill(PID);
  });

  ipcMain.on("run-prompt", (event, { prompt, args }) => {
    console.log("PROMPT: ", prompt);
    console.log("ARGS: ", args);

    mainWindow.webContents.send("initializing", true);

    var child = require("child_process");

    const { config, executable, weights } = getPaths(
      process.resourcesPath + "/app/dist/txt2img"
    );

    const execArgs = [
      "--prompt",
      prompt,
      ...args,
      "--config",
      config,
      "--ckpt",
      weights,
    ];

    console.log(execArgs);
    const debussy = child.spawn(executable, execArgs, {
      stdio: ["pipe", "pipe", "pipe", "ipc"],
    });

    PID = debussy.pid;

    debussy.stderr.on("data", (data) => {
      if (data.toString().includes("Sampler: ")) {
        const pct = data.toString().split(":")[1].split("%")[0].trim();
        mainWindow.webContents.send("initializing", false);
        mainWindow.webContents.send("loading-update", pct);
      }

      mainWindow.webContents.send("stdout-message", data.toString());
    });

    debussy.on("close", () => {
      let outpath =
        "--outdir" in execArgs ? execArgs["--outdir"] : DEFAULT_OUTDIR;
      mainWindow.webContents.send("image-load", getLatestImage(outpath)); // Send the data to the render thread
    });
  });

  // and load the index.html of the app.
  mainWindow.loadFile("index.html");

  //   if main window is ready to show, then destroy the splash window and show up the main window
  mainWindow.once("ready-to-show", () => {
    splash.destroy();
    mainWindow.show();
  });

  // Open the DevTools.
  //   mainWindow.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
