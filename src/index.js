const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const Alert = require("electron-alert");
const Store = require('electron-store');
const { Collection: MongoCollection, MongoClient } = require("mongodb");
const { Collection, Fields } = require("quickmongo");
const {autoUpdater} = require('electron-updater');
const cepAPI = require('cep-promise');
const { isCpf } = require('iscpf')

autoUpdater.logger = require("electron-log");
autoUpdater.logger.transports.file.level = "info";

autoUpdater.on('update-downloaded', () => {
console.log('Atualização baixada');

  dialog.showMessageBox({
    type: 'info',
    title: 'Update encontrada',
    message: 'Atualizações encontradas, você quer atualização agora?',
    buttons: ['Sim', 'Não']
  }, (buttonIndex) => {
    if (buttonIndex === 0) {
      const isSilent = true;
      const isForceRunAfter = true; 
      autoUpdater.quitAndInstall(isSilent, isForceRunAfter); 
    } 
    else {
      updater.enabled = true
      updater = null
    }
  })
})

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

let configcheck
let normalWindow
let windowPrimeiraDose
let windowSegundaDose
let windowconsulta
let paciente
let cpfProcura

let mongo

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
  autoUpdater.checkForUpdatesAndNotify();
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
 configcheck.on('closed', () => {
  showMain(true);
});
 configcheck.setMenu(null);
 configcheck.loadFile(path.join(__dirname, 'config.html'))
}

function primeiraDoseWindow () {
  windowPrimeiraDose = new BrowserWindow({
  width: 1600,
  height: 900,
  icon: __dirname + '/logo.ico',
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: false,
    preload:path.join(__dirname, 'PrimeiraDose.js')
  }
 })
  windowPrimeiraDose.on('closed', () => {
  showMain(true);
  });
 //windowPrimeiraDose.webContents.openDevTools();
 windowPrimeiraDose.setMenu(null);
 windowPrimeiraDose.loadFile(path.join(__dirname, 'PrimeiraDose.html'))
}

function segundaDoseWindow () {
  windowSegundaDose = new BrowserWindow({
  width: 1600,
  height: 900,
  icon: __dirname + '/logo.ico',
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: false,
    preload:path.join(__dirname, 'SegundaDose.js')
  }
 })
  windowSegundaDose.on('closed', () => {
  showMain(true);
  });
 windowSegundaDose.setMenu(null);
 windowSegundaDose.loadFile(path.join(__dirname, 'SegundaDose.html'))
}

function consultaWindow () {
  windowconsulta = new BrowserWindow({
  width: 1600,
  height: 900,
  icon: __dirname + '/logo.ico',
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: false,
    preload:path.join(__dirname, 'consulta.js')
  }
 })
  windowconsulta.on('closed', () => {
  showMain(true);
  });
 windowconsulta.setMenu(null);
 //windowconsulta.webContents.openDevTools();
 windowconsulta.loadFile(path.join(__dirname, 'consulta.html'))
}

ipcMain.handle('salvarURI', (event, URI) => {
  try {
    //const mongo = new MongoClient(store.get('MongoURI'));
    const mongu = new MongoClient(URI);
    mongu.connect();
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

ipcMain.handle("showSegundaDose", (event, bool) => {
  if (bool === true) {
    segundaDoseWindow()
  } else {
    windowSegundaDose.close()
  }
})

ipcMain.handle("showPrimeiraDose", (event, bool) => {
  if (bool === true) {
    primeiraDoseWindow()
  } else {
    windowPrimeiraDose.close()
  }
})

ipcMain.handle("showConsulta", (event, bool) => {
  if (bool === true) {
    consultaWindow()
  } else {
    windowconsulta.close()
  }
})

function showPrimeiraDose(bool) {
  if (bool === true) {
    primeiraDoseWindow()
  } else {
    windowPrimeiraDose.close()
  }
}

function showSegundaDose(bool) {
  if (bool === true) {
    segundaDoseWindow()
  } else {
    windowSegundaDose.close()
  }
}

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

function showConsulta(bool) {
  if (bool === true) {
    consultaWindow()
  } else {
    windowconsulta.close()
  }
}

ipcMain.handle("monstrarErro", (event, message) => {
  let swalOptions = {
    position: "top-end",
    title: message,
    icon: "error",
    showConfirmButton: true,
    timer: 3000
  };
  Alert.fireToast(swalOptions);
})

ipcMain.handle("procurarPaciente", async (event, CPF, bool) => {
  if (bool === true) {
    let procura = procurarPaciente(CPF)
    if(await procura) {
      paciente = procura
      cpfProcura = CPF
      showConsulta(true)
      showMain(false)
    }else {
      let swalOptions = {
        position: "top-end",
        title: "O CPF inserido não existe na database",
        icon: "error",
        showConfirmButton: true,
        timer: 3000
      };
      Alert.fireToast(swalOptions);
      return false
    }
  } else {
    return paciente
  }
})

const schema = new Fields.ObjectField({
  nome: new Fields.StringField(),
  sexo: new Fields.StringField(),
  gestante: new Fields.BooleanField(),
  idade: new Fields.NumberField(),
  telefone: new Fields.NumberField(),
  cep: new Fields.NumberField(),
  sintomasCheck: new Fields.BooleanField(),
  sintomas: new Fields.ArrayField(new Fields.StringField()),
  casoSuspeito: new Fields.BooleanField(),
  isolamento: new Fields.BooleanField(),
  isolamentoDias: new Fields.NumberField(),
  servicoHospitalar: new Fields.BooleanField(),
  covidResidencia: new Fields.BooleanField(),
  sintomasSugestivos: new Fields.BooleanField(),
  dataSintomasSugestivos: new Fields.StringField(),
  testeCovid: new Fields.BooleanField(),
  tipoDeTeste: new Fields.StringField(),
  resultadoTeste: new Fields.StringField(),
  comorbidades: new Fields.ArrayField(new Fields.StringField()),
  temperatura1: new Fields.NumberField(),
  vacinaAplicada1: new Fields.StringField(),
  loteVacina1: new Fields.NumberField(),
  temperatura2 : new Fields.NumberField(),
  vacinaAplicada2: new Fields.StringField(),
  loteVacina2: new Fields.NumberField(),
  dataVacina1: new Fields.NumberField(),
  dataVacina2: new Fields.NumberField()
});

ipcMain.handle("setPaciente", (event, obj) => {
  try {
    const mongoos = new MongoClient(store.get("MongoURI"));
    mongoos.connect()
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
      showPrimeiraDose(false);
      } else if (result.dismiss === Alert.DismissReason.cancel) {
      // canceled
      loginWindow()
    }
  })
  }
  mongo = new MongoClient(store.get("MongoURI"));
  mongo.connect().then(() => {
    console.log("Connected to the database!");
    Mongodatabase(obj);
  });
  
  let swalOptions = {
    position: "top-end",
    title: "Salvo na database!",
    icon: "success",
    showConfirmButton: true,
    timer: 3000
  };
  
  Alert.fireToast(swalOptions);
})

ipcMain.handle("setSegundaDose", (event, obj) => {
  try {
    const mongoos = new MongoClient(store.get("MongoURI"));
    mongoos.connect()
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
      showPrimeiraDose(false);
      } else if (result.dismiss === Alert.DismissReason.cancel) {
      // canceled
      loginWindow()
    }
  })
  }
  mongo = new MongoClient(store.get("MongoURI"));
  mongo.connect().then(() => {
    console.log("Connected to the database!");
    Mongodatabase2(obj);
  });
  
  let swalOptions = {
    position: "top-end",
    title: "Salvo na database!",
    icon: "success",
    showConfirmButton: true,
    timer: 3000
  };
  
  Alert.fireToast(swalOptions);
})

function Mongodatabase (obj) {
  const mongoCollection = mongo.db().collection("JSON");

  const db = new Collection(mongoCollection, schema);
  db.set(Number(obj.cpf), {
    nome: obj.nome,
    sexo: obj.sexo,
    gestante: obj.gestante,
    idade: Number(obj.idade),
    telefone: Number(obj.telefone),
    cep: Number(obj.cep),
    sintomasCheck: obj.sintomasCheck,
    sintomas: obj.sintomas,
    casoSuspeito: obj.casoSuspeito,
    isolamento: obj.isolamento,
    isolamentoDias: Number(obj.isolamentoDias),
    servicoHospitalar: obj.servicoHospitalar,
    covidResidencia: obj.covidResidencia,
    sintomasSugestivos: obj.sintomasSugestivos,
    dataSintomasSugestivos: obj.dataSintomasSugestivos,
    testeCovid: obj.testeCovid,
    tipoDeTeste: obj.tipoDeTeste,
    resultadoTeste: obj.resultadoTeste,
    comorbidades: obj.comorbidades,
    temperatura1: Number(obj.temperatura1),
    vacinaAplicada1: obj.vacinaAplicada1,
    loteVacina1: Number(obj.loteVacina1),
    temperatura2 : Number(obj.temperatura2),
    vacinaAplicada2: obj.vacinaAplicada2,
    loteVacina2: Number(obj.loteVacina2),
    dataVacina1: obj.dataVacina1,
    dataVacina2: obj.dataVacina2
  })
}

function Mongodatabase2(obj) {
  const mongoCollection = mongo.db().collection("JSON");
  const db = new Collection(mongoCollection, schema);
  /*db.set(cpfProcura, {
    temperatura2 : obj.temperatura2,
    vacinaAplicada2: obj.vacinaAplicada2,
    loteVacina2: obj.loteVacina2,
    dataVacina2: obj.dataVacina2
  })*/
  db.set(cpfProcura, obj.temperatura2, "temperatura2")
  db.set(cpfProcura, obj.vacinaAplicada2, "vacinaAplicada2")
  db.set(cpfProcura, obj.loteVacina2, "loteVacina2")
  db.set(cpfProcura, obj.dataVacina2, "dataVacina2")
  db.set(cpfProcura, obj.dataVacina2, "dataVacina2")
}

async function procurarPaciente(CPF) {
  let __procura
  try {
  mongo = new MongoClient(store.get("MongoURI"));
  await mongo.connect().then(async () =>  {
  __procura = procurarNaDb(CPF)
  });
  return __procura
  } catch (error) {
    console.log(error)
  }
}

async function procurarNaDb(CPF){
  const mongoCollection = mongo.db().collection("JSON");
  const db = new Collection(mongoCollection, schema);
  __obg = db.get(CPF)
  return __obg
}


ipcMain.handle("procurarCep", async (event, CEP) => {
  endereco = cepAPI(CEP)
  return endereco
})

ipcMain.handle("cpfPaciente", async (event) => {
  return cpfProcura
})


ipcMain.handle("checkCEP", async (event, CEP) => {
 if(await checkCEP(CEP) === true) {
   return true
 } else {
   return false
 }
})

async function checkCEP(CEP){
  let __resultado = await cepAPI(CEP).then(() => {
    return true
  }).catch(error => {
    return false
  })
  return __resultado
}

ipcMain.handle("checkCPF", async (event, CPF) => {
  let check = await isCpf(CPF)
  return check
})