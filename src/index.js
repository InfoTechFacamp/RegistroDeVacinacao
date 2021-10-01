const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const Alert = require("electron-alert");
const Store = require('electron-store');
const { Collection: MongoCollection, MongoClient } = require("mongodb");
const { Collection, Fields } = require("quickmongo");

require('update-electron-app')({
  repo: 'https://github.com/InfoTechFacamp/RegistroDeVacinacao',
  logger: require('electron-log')
})

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

let configcheck
let normalWindow

const createWindow = () => {
  // Create the browser window.
  normalWindow = new BrowserWindow({
    width: 1600,
    height: 900,
    icon: __dirname + '/logo.ico',   
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload:path.join(__dirname, 'load.js'),
    }
  });

  // and load the index.html of the app.
  normalWindow.setMenu(null);
  normalWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  //normalWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

const store = new Store();
let alert = new Alert();

//const mongo = new MongoClient(store.get('MongoURI'), "mongodb://localhost");
app.on("ready", () => {
  //store.set('MongoURI', "Uma Url Aq");
  //store.delete('MongoURI');
  try {
    const mongo = new MongoClient(store.get("MongoURI"));
    mongo.connect();
    let swalOptions = {
      position: "top-end",
      title: "Conectado com a database!",
      icon: "success",
      showConfirmButton: true,
      timer: 3000
    };
    
    Alert.fireToast(swalOptions);
  } catch (error) {
    let swalOptions = {
      title: "Erro na configuração",
      text: "A sua mongo URI não está configurada ou é inválida!",
      icon: "warning",
      showCancelButton: false
    };
            
    let promise = alert.fireWithFrame(swalOptions, "Erro na configuração", null, true);
    promise.then((result) => {
      if (result.value) {
      loginWindow()
      showMain(false);
      } else if (result.dismiss === Alert.DismissReason.cancel) {
      // canceled
      loginWindow()
    }
  })
  }
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

function loginWindow () {
  configcheck = new BrowserWindow({
  width: 1600,
  height: 900,
  icon: __dirname + '/logo.ico',
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: false,
    preload:path.join(__dirname, 'config.js')
  }
 })
 //configcheck.setMenu(null);
 configcheck.loadFile(path.join(__dirname, 'config.html'))
}

ipcMain.handle('salvarURI', (event, URI) => {
  try {
    //const mongo = new MongoClient(store.get('MongoURI'));
    const mongo = new MongoClient(URI);
    mongo.connect();
    let swalOptions = {
      position: "top-end",
      title: "URI salva com sucesso",
      icon: "success",
      showConfirmButton: true,
      timer: 3000
    };
    Alert.fireToast(swalOptions);
    store.set("MongoURI", URI)
  } catch (error) {
    let swalOptions = {
      position: "top-end",
      title: "A URI inserida é inválida",
      icon: "error",
      showConfirmButton: true,
      timer: 3000
    };
    Alert.fireToast(swalOptions);
  }
});

ipcMain.handle("showMain", (event, bool) => {
  if (bool === true) {
    normalWindow.show()
  } else {
    normalWindow.hide()
  }
})

ipcMain.handle("showConfig", (event, bool) => {
  if (bool === true) {
    loginWindow()
  } else {
    configcheck.close()
  }
})

function showMain(bool) {
  if (bool === true) {
    normalWindow.show()
  } else {
    normalWindow.hide()
  }
}
function showConfig(bool) {
  if (bool === true) {
    loginWindow()
  } else {
    configcheck.close()
  }
}

//mongodb+srv://Admin:RccDOjyUKo1bRnfb@cluster0.ncbnu.mongodb.net/Vacina
