const { ipcRenderer } = require('electron')

let botaoSalvar
let botaoVoltar

window.onload = function() { 

    const Store = require('electron-store');

    const store = new Store();
    document.getElementById("mongo-uri").value = store.get("MongoURI", "")

    botaoSalvar = document.getElementById("salvar")
    botaoVoltar = document.getElementById("voltar")
    botaoSalvar.onclick = function() {
        const URI = document.getElementById("mongo-uri").value
        ipcRenderer.invoke("salvarURI", URI)
    }
    botaoVoltar.onclick = function() {
        ipcRenderer.invoke("showConfig", false)
        ipcRenderer.invoke("showMain", true)
    }

}
