const { ipcRenderer } = require('electron')

let botaoSalvar

window.onload = async function() { 
    let paciente = await ipcRenderer.invoke("procurarPaciente", "", false);
    document.getElementById("nome").value = paciente.nome
    document.getElementById("sexo").value = paciente.sexo
    if (paciente.gestante === true){
        document.getElementById("pacientegestando").style.display = "block";
        document.getElementById("pacientegestando").innerHTML = document.getElementById("pacientegestando").innerHTML + " <b>Sim.</b>"
    }  
    document.getElementById("datadenascimento").value = `${paciente.dataDeNascimento.slice(8,10)}/${paciente.dataDeNascimento.slice(5,7)}/${paciente.dataDeNascimento.slice(0,4)}`
    document.getElementById("telefone").value = paciente.telefone
    document.getElementById("cpf").value = await ipcRenderer.invoke("cpfPaciente");
    document.getElementById("cep").value = paciente.cep
    let endereco = await ipcRenderer.invoke("procurarCep", paciente.cep);
    endereco = `${endereco.street}, ${endereco.city}, ${endereco.state}`
    document.getElementById("endereco").innerHTML = document.getElementById("endereco").innerHTML + ` <b>${endereco}.</b>`
    let sintomas = ""
    if(paciente.sintomasCheck === true) {
        for (let index = 0; index < paciente.sintomas.length; index++) {
            if(paciente.sintomas.length - 1 === index) {
                sintomas = sintomas + `${paciente.sintomas[index]}.`
            } else {
                sintomas = sintomas + `${paciente.sintomas[index]}, `
            }
        }
        document.getElementById("sintomas").innerHTML = document.getElementById("sintomas").innerHTML + ` <b>Sim, ${sintomas}</b>`
    }else{
        document.getElementById("sintomas").innerHTML = document.getElementById("sintomas").innerHTML + ` <b>Não.</b>`
    }
    if(paciente.casoSuspeito === true) {
        document.getElementById("suspeita").innerHTML = document.getElementById("suspeita").innerHTML + ` <b>Sim.</b>`
    }else{
        document.getElementById("suspeita").innerHTML = document.getElementById("suspeita").innerHTML + ` <b>Não.</b>`
    }
    if(paciente.servicoHospitalar === true) {
        document.getElementById("areaderisco").innerHTML = document.getElementById("areaderisco").innerHTML + ` <b>Sim.</b>`
    }else{
        document.getElementById("areaderisco").innerHTML = document.getElementById("areaderisco").innerHTML + ` <b>Não.</b>`
    }
    if(paciente.covidResidencia === true) {
        if(paciente.isolamento === true) {
            document.getElementById("contato").innerHTML = document.getElementById("contato").innerHTML + ` <b>Sim e a pessoa realizou isolamento de ${paciente.isolamentoDias} dias.</b>`
        }else{
            document.getElementById("contato").innerHTML = document.getElementById("contato").innerHTML + ` <b>Sim, mas, a pessoa não realizou isolamento social.</b>`
        }
    }else{
        document.getElementById("contato").innerHTML = document.getElementById("contato").innerHTML + ` <b>Não.</b>`
    }
    if(paciente.sintomasSugestivos === true){
        document.getElementById("sintomas-sugestivos").innerHTML = document.getElementById("sintomas-sugestivos").innerHTML + ` <b>Sim, com início no dia ${paciente.dataSintomasSugestivos.slice(8,10)}/${paciente.dataSintomasSugestivos.slice(5,7)}/${paciente.dataSintomasSugestivos.slice(0,4)}.</b>`
    }else{
        document.getElementById("sintomas-sugestivos").innerHTML = document.getElementById("sintomas-sugestivos").innerHTML + ` <b>Não.</b>`
    }
    if(paciente.testeCovid === true){
        document.getElementById("teste").innerHTML = document.getElementById("teste").innerHTML + ` <b>Sim, ${paciente.tipoDeTeste} com reultado ${paciente.resultadoTeste}.</b>`
    }else{
        document.getElementById("teste").innerHTML = document.getElementById("teste").innerHTML + ` <b>Não.</b>`
    }
    if(paciente.comorbidades.length > 0){
        let comorbidades = ""
        for (let index = 0; index < paciente.comorbidades.length; index++) {
            if(paciente.comorbidades.length - 1 === index) {
                comorbidades = comorbidades + `${paciente.comorbidades[index]}.`
            } else {
                comorbidades = comorbidades + `${paciente.comorbidades[index]}, `
            }
        }
        document.getElementById("comorbidades").innerHTML = document.getElementById("comorbidades").innerHTML + ` <b>Sim, ${comorbidades}</b>`
    }else{
        document.getElementById("comorbidades").innerHTML = document.getElementById("comorbidades").innerHTML + ` <b>Não.</b>`
    }
    document.getElementById("temperatura1").value = paciente.temperatura1
    document.getElementById("vacina-primeiradose").value = `${paciente.vacinaAplicada1} Lote: ${paciente.loteVacina1}`

    

    botaoSalvar = document.getElementById("enviar")
    botaoSalvar.onclick = async function() {
        if(checkValid() === false) return
        let obj = {
            temperatura2 : parseInt(document.getElementById("temperatura2").value),
            vacinaAplicada2: document.getElementById("vacina-aplicada").value,
            loteVacina2: parseInt(document.getElementById("lote-vacina").value),
            dataVacina2: Date.now()
        }
        ipcRenderer.invoke("setSegundaDose", obj)
    }

}

function checkValid() {
    if(document.getElementById("temperatura2").value == "") {
        ipcRenderer.invoke("monstrarErro", "Digite uma temepratura válida!")
        return false;
    }
    if(isNaN(parseInt(document.getElementById("temperatura2").value))) {
        ipcRenderer.invoke("monstrarErro", "Digite uma temepratura válida!")
        return false;
    }
    if(document.getElementById("lote-vacina").value == "") {
        ipcRenderer.invoke("monstrarErro", "Digite um lote da vacina válido!")
        return false;
    }
    if(isNaN(parseInt(document.getElementById("lote-vacina").value))) {
        ipcRenderer.invoke("monstrarErro", "Digite um lote da vacina válido!")
        return false;
    }
    return true;
}