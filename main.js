"use strict";

// Import parts of electron to use
const { app, BrowserWindow } = require("electron");
const path = require("path");
const url = require("url");

app.disableHardwareAcceleration();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;


// Temporary fix broken high-dpi scale factor on Windows (125% scaling)
// info: https://github.com/electron/electron/issues/9691
if (process.platform === "win32") {
  app.commandLine.appendSwitch("high-dpi-support", "true");
  app.commandLine.appendSwitch("force-device-scale-factor", "1");
}


let dev = process.argv.indexOf("--devServer") !== -1;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    minWidth: 480,
    width: 480,
    height: 800,
    minHeight: 800,
    resizable: true,
    title: "HotWave",
    icon: __dirname + "/assets/icons/icon.png",
    webPreferences: {
      webSecurity: false
    },
    frame: false,
    backgroundColor: '#1D1D1D',
    show: false
  });

  // and load the index.html of the app.
  let indexPath;

  if (dev) {
    console.log("serving from localhost");
    indexPath = url.format({
      protocol: "http:",
      host: "localhost:8080",
      pathname: "index.html",
      slashes: true
    });
  } else {
    console.log("serving from path");
    indexPath = url.format({
      protocol: "file:",
      pathname: path.join(__dirname, "build", "index.html"),
      slashes: true
    });
    mainWindow.setFullScreen(true);
  }

  mainWindow.loadURL(indexPath);

  // Don't show until we are ready and loaded
  mainWindow.once("ready-to-show", () => {
    if(!dev) mainWindow.maximize();
    mainWindow.show();
  });

  // Emitted when the window is closed.
  mainWindow.on("closed", function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
