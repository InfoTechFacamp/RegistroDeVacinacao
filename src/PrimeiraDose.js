const { ipcRenderer } = require('electron')

let nomePac
let sexoPac
let gestPac
let idadePac
let telefonePac
let cpfPac
let cepPac
let sintomasCheck
let sintomasLista = [];
let casoSuspeito
let isolamento
let isolamentoDias
let servicoHospitalar
let covidResidencia
let sintomasSugestivos
let dataSintomasSugestivos
let testeCovid
let tipoDeTeste
let resultadoTeste
let comorbidades = [];
let temperatura
let vacinaAplicada
let loteVacina

let botaoEnviar
let botaoVoltar

window.onload = function() { 

    botaoEnviar = document.getElementById("enviar")
    botaoVoltar = document.getElementById("voltar")

    botaoVoltar.onclick = function() {
        ipcRenderer.invoke("showPrimeiraDose", false)
        ipcRenderer.invoke("showMain", true)
    }

    botaoEnviar.onclick = async function() {
        if(checkValid() === false) return
        if(await checarCPF(document.getElementById("cpf-p").value) === false) return
        if(await checarCEP(document.getElementById("cep").value) === false) return
        nomePac = document.getElementById("nome-paciente").value
        sexoPac = document.getElementById('sexMasc').checked ? "Masculino" : "Feminino"
        if (document.getElementById('sexFem').checked === true && document.getElementById('formCheck-22').checked === true){
            gestPac = true
        }
        idadePac = document.getElementById("idade").value
        telefonePac = document.getElementById("telefone").value
        cpfPac = document.getElementById("cpf-p").value
        cepPac = document.getElementById("cep").value
        if (document.getElementById("formCheck-1").checked === true) {
            sintomasCheck = true
        }
        for (let index = 2; index != 10; index++) {
            if(document.getElementById(`formCheck-${index}`).checked === true) {
                sintomasLista.push(document.getElementById(`formCheck-${index}`).value)
            }
        }
        if (document.getElementById("formCheck-10").checked === true){
            if (document.getElementById("formCheck-23").checked === true){
                isolamento = true 
                isolamentoDias = document.getElementById("quantos-dias").value
            } else {
                isolamento = false
            }
            casoSuspeito = true
        }
        if (document.getElementById("formCheck-11").checked === true){
            servicoHospitalar = true
        }
        if (document.getElementById("formCheck-12").checked === true){
            covidResidencia = true
        }
        if (document.getElementById("formCheck-13").checked === true){
            sintomasSugestivos = true
            dataSintomasSugestivos = document.getElementById("data").value
        }
        if (document.getElementById("formCheck-14").checked === true){
            testeCovid = true
            tipoDeTeste = document.getElementById("teste-rapido").value
            resultadoTeste = document.getElementById("resultado-exame").value
        }
        for (let index = 15; index != 22; index++) {
            if (document.getElementById(`formCheck-${index}`).checked === true){
                comorbidades.push(document.getElementById(`formCheck-${index}`).value)
            }
        }
        let _outra = document.getElementById("outra-comorbidade").value
        if (_outra != "" && _outra != null) {
            comorbidades.push(_outra)
        }
        temperatura = document.getElementById("temperatura").value
        vacinaAplicada = document.getElementById("vacina-aplicada").value
        loteVacina = document.getElementById("lote-vacina").value
        let obj = {
            nome: nomePac,
            sexo: sexoPac,
            gestante: gestPac || false,
            idade: idadePac,
            telefone: telefonePac,
            cpf: cpfPac,
            cep: cepPac,
            sintomasCheck: sintomasCheck || false,
            sintomas: sintomasLista,
            casoSuspeito: casoSuspeito || false,
            isolamento: isolamento || false,
            isolamentoDias: isolamentoDias || "",
            servicoHospitalar: servicoHospitalar || false,
            covidResidencia: covidResidencia || false,
            sintomasSugestivos: sintomasSugestivos || false,
            dataSintomasSugestivos: dataSintomasSugestivos || "",
            testeCovid: testeCovid || false,
            tipoDeTeste: tipoDeTeste || "",
            resultadoTeste: resultadoTeste || "",
            comorbidades: comorbidades,
            temperatura1: temperatura,
            vacinaAplicada1: vacinaAplicada,
            loteVacina1: loteVacina,
            temperatura2 : 0,
            vacinaAplicada2: "",
            loteVacina2: 0,
            dataVacina1: Date.now(),
            dataVacina2: 0
        }
        ipcRenderer.invoke("setPaciente", obj)
    }
}

function checkValid() {
    if(document.getElementById("nome-paciente").value == "") {
        ipcRenderer.invoke("monstrarErro", "Digite um nome válido!")
        return false;
    }
    if(document.getElementById('sexFem').checked === false && document.getElementById('sexMasc').checked === false) {
        ipcRenderer.invoke("monstrarErro", "Marque o sexo do paciente!")
        return false;
    }
    if(document.getElementById("idade").value == "") {
        ipcRenderer.invoke("monstrarErro", "Digite uma idade válida!")
        return false;
    }
    if(isNaN(parseInt(document.getElementById("idade").value))) {
        ipcRenderer.invoke("monstrarErro", "Digite uma idade válida!")
        return false;
    }
    if(document.getElementById("telefone").value == "") {
        ipcRenderer.invoke("monstrarErro", "Digite um telefone válido!")
        return false;
    }
    if(isNaN(parseInt(document.getElementById("telefone").value))) {
        ipcRenderer.invoke("monstrarErro", "Digite um telefone válido!")
        return false;
    }
    if(document.getElementById("cpf-p").value == "") {
        ipcRenderer.invoke("monstrarErro", "Digite um CPF válido!")
        return false;
    }
    if(isNaN(parseInt(document.getElementById("cpf-p").value))) {
        ipcRenderer.invoke("monstrarErro", "Digite um CPF válido!")
        return false;
    }
    if(document.getElementById("cep").value == "") {
        ipcRenderer.invoke("monstrarErro", "Digite um CEP válido!")
        return false;
    }
    if(isNaN(parseInt(document.getElementById("cep").value))) {
        ipcRenderer.invoke("monstrarErro", "Digite um CEP válido!")
        return false;
    }
    if(document.getElementById("formCheck-1").checked === true) {
    if(
        document.getElementById("formCheck-2").checked === false && 
        document.getElementById("formCheck-3").checked === false &&
        document.getElementById("formCheck-4").checked === false &&
        document.getElementById("formCheck-5").checked === false &&
        document.getElementById("formCheck-6").checked === false &&
        document.getElementById("formCheck-7").checked === false &&
        document.getElementById("formCheck-8").checked === false &&
        document.getElementById("formCheck-9").checked === false
    ) {
        ipcRenderer.invoke("monstrarErro", "Marque o(s) sintoma(s) que o paciente teve!")
        return false;
    }
    }
    if (document.getElementById("formCheck-23").checked === true) {
        if(document.getElementById("quantos-dias").value == "" || isNaN(parseInt(document.getElementById("quantos-dias").value))) {
            ipcRenderer.invoke("monstrarErro", "Digite um numero de dias válido!")
            return false;
        }
    }
    if (document.getElementById("formCheck-13").checked === true) {
        if(document.getElementById("data").value == "") {
            ipcRenderer.invoke("monstrarErro", "Digite uma data válida!")
            return false;
        }
    }
    if(document.getElementById("temperatura").value == "") {
        ipcRenderer.invoke("monstrarErro", "Digite uma temepratura válida!")
        return false;
    }
    if(isNaN(parseInt(document.getElementById("temperatura").value))) {
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
    return true
}

async function checarCEP(CEP) {
    let check = await ipcRenderer.invoke("checkCEP", parseInt(CEP))
    console.log(check)
    if(check === false) {
        ipcRenderer.invoke("monstrarErro", "O CEP digitado não pode ser encontrado pela API")
        return false
    } else {
        return true
    }
}

async function checarCPF(CPF) {
    let check = await ipcRenderer.invoke("checkCPF", parseInt(CPF))
    console.log(check)
    if(check === false) {
        ipcRenderer.invoke("monstrarErro", "O CPF digitado não pode ser encontrado pela API")
    }
    return check
}