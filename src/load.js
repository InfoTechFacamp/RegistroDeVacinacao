const { ipcRenderer } = require('electron')

let botaoConfig

window.onload = function() { 

    botaoConfig = document.getElementById("botaoconfig")
    botaoConfig.onclick = function() {
        ipcRenderer.invoke("showConfig", true)
        ipcRenderer.invoke("showMain", false)
    }

}