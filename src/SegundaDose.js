const { ipcRenderer } = require('electron')

let botaoVoltar
let botaoConsultar
let procurar

window.onload = function() { 
    botaoVoltar = document.getElementById("voltar")
    botaoConsultar = document.getElementById("consultar")
    botaoConsultar.onclick = function() {
        procurar = document.getElementById("cpf").value
        if(checkValid() === false) {
            return
        }
        procurar = Number(procurar)
        ipcRenderer.invoke("procurarPaciente", procurar, true)
    }
    botaoVoltar.onclick = function() {
        ipcRenderer.invoke("showSegundaDose", false)
        ipcRenderer.invoke("showMain", true)
    }
}

function checkValid() {
    if(procurar == "" || isNaN(parseInt(procurar))){
        ipcRenderer.invoke("monstrarErro", "Digite um CPF válido!")
        return false;
    }
    return true
}