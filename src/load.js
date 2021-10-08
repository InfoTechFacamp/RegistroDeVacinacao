const { ipcRenderer } = require('electron')

let botaoConfig
let botaoPrimeiraDose
let botaoSegundaDose

window.onload = function() { 

    botaoConfig = document.getElementById("botaoconfig")
    botaoConfig.onclick = function() {
        ipcRenderer.invoke("showConfig", true)
        ipcRenderer.invoke("showMain", false)
    }

    botaoSegundaDose = document.getElementById("segundadose")
    botaoSegundaDose.onclick = function() {
        ipcRenderer.invoke("showSegundaDose", true)
        ipcRenderer.invoke("showMain", false)
    }

    botaoPrimeiraDose = document.getElementById("primeiradose")
    botaoPrimeiraDose.onclick = function() {
        ipcRenderer.invoke("showPrimeiraDose", true)
        ipcRenderer.invoke("showMain", false)
    }

}