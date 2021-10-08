function disableGest() {
    document.getElementById("formCheck-22").disabled = true
    document.getElementById("gestando").style.display = "none";
}

function enableGest() {
    document.getElementById("formCheck-22").disabled = false
    document.getElementById("gestando").style.display = "block";
}

function enableSintomas() {
    if(document.getElementById("formCheck-1").checked === true){
        document.getElementById("quaissintomas").style.display = "block"
    } else {
        document.getElementById("quaissintomas").style.display = "none"
    }
}

function realizouisolamento(){
    if(document.getElementById("formCheck-10").checked === true){
        document.getElementById("diasdisplay").style.display = "none"
        document.getElementById("realisouisolamentosocial").style.display = "block"
        document.getElementById("formCheck-23").required = true;
        document.getElementById("formCheck-24").required = true;
    } else {
        document.getElementById("diasdisplay").style.display = "block"
        document.getElementById("realisouisolamentosocial").style.display = "none"
        document.getElementById("formCheck-23").required = false;
        document.getElementById("formCheck-24").required = false;
    }
}

function quantosdias(){
    if(document.getElementById("formCheck-23").checked === true){
        document.getElementById("diasdisplay").style.display = "block"
        document.getElementById("quantos-dias").required = true;
    } else {
        document.getElementById("diasdisplay").style.display = "none"
        document.getElementById("quantos-dias").required = false;
    }
}

function diadeinicio(){
    if(document.getElementById("formCheck-13").checked === true){
        document.getElementById("data").style.display = "block"
        document.getElementById("data").required = true;
    } else {
        document.getElementById("data").style.display = "none"
        document.getElementById("data").required = false;
    }
}

function enableTesterapido(){
    if(document.getElementById("formCheck-14").checked === true){
        document.getElementById("testerapidodisplay").style.display = "block"
        document.getElementById("teste-rapido").required = true;
        document.getElementById("resultado-exame").required = true;
    } else {
        document.getElementById("testerapidodisplay").style.display = "none"
        document.getElementById("teste-rapido").required = false;
        document.getElementById("resultado-exame").required = false;
    }
}