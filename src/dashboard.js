const { ipcRenderer } = require('electron')
require('WebDataRocks');
const mongodb = require("mongodb").MongoClient;

const { Parser } = require('json2csv');
async function getUsuarios() {
  let usuarios = []
  let db = await ipcRenderer.invoke("getDB")
  if(db === undefined) return
  db.forEach(element => {
    usuarios.push({
      "+CPF": element.ID,
      "+nome": element.data.nome,
      "+sexo": element.data.sexo,
      "+gestante": element.data.gestante == false ? "Não" : "Sim",
      "+data de nascimento": element.data.dataDeNascimento,
      "+telefone": element.data.telefone,
      "+CEP": element.data.cep,
      "+sintomas": element.data.sintomasCheck == false ? "Não apresenta sintomas" : element.data.sintomas,
      "+contato com pessoa com caso suspeito": element.data.casoSuspeito == false ? "Não" : "Sim",
      "+pessoa suspeita fez isolamento": element.data.isolamento == false ? "Não" : "Sim",
      "-dias de isolamento": element.data.isolamentoDias == 0 ? "Não fez isolamento" : element.data.isolamentoDias,
      "+Serviço hospitalar": element.data.servicoHospitalar == false ? "Não" : "Sim",
      "+Contato com covid na residencia": element.data.covidResidencia == false ? "Não" : "Sim",
      "+Sintomas sugestivos": element.data.sintomasSugestivos == false ? "Não" : "Sim",
      "ds+data sintomas sugestivos": element.data.dataSintomasSugestivos == '' ? "Não apresentou sintomas sugestivos" : element.data.dataSintomasSugestivos,
      "+teste para covid": element.data.testeCovid == false ? "Não" : "Sim",
      "+tipo de teste feito": element.data.tipoDeTeste == '' ? "Não fez teste" : element.data.tipoTeste,
      "+resultado do teste feito": element.data.resultadoTeste == '' ? "Não fez teste" : element.data.resultadoTeste,
      "+comorbidades": element.data.comorbidades.length == 0 ? "Não tem comorbidades" : element.data.comorbidades,
      "+temepratura na primeira dose": element.data.temperatura1,
      "+Vacina aplicada na primeira dose": element.data.vacinaAplicada1,
      "+lote da primeira dose": element.data.loteVacina1,
      "+temperatura na segunda dose": element.data.temperatura2 == 0 ? "Não aplicou segunda dose" : element.data.temperatura2,
      "+vacina aplicada na segunda dose": element.data.vacinaAplicada2 == '' ? "Não aplicou segunda dose" : element.data.vacinaAplicada2,
      "+lote da segunda dose": element.data.loteVacina2 == 0 ? "Não aplicou segunda dose" : element.data.loteVacina2,
      "ds+data da primeira dose": `${new Date(element.data.dataVacina1).getDay()}/${new Date(element.data.dataVacina1).getMonth()}/${new Date(element.data.dataVacina1).getUTCFullYear()}`,
      "ds+data segunda dose": element.dataVacina2 == 0 ? "Não aplicou segunda dose" : `${new Date(element.data.dataVacina2).getDay()}/${new Date(element.data.dataVacina2).getMonth()}/${new Date(element.data.dataVacina2).getUTCFullYear()}`,
    })
  });
  return usuarios
}
getUsuarios().then(usuarios => {
  const json2csvParser = new Parser({ header: true });
  const csv = json2csvParser.parse(usuarios);
  const fs = require('fs');
  fs.writeFile('./src/usuarios.csv', csv, function (err) {
    if (err) throw err;
    console.log('file saved');
  });
  let pivot = new WebDataRocks({
    container: "#wdr-component",
    toolbar: true,
    height: 850,
    report: {
      dataSource: {
        filename: `${__dirname}\\usuarios.csv`,
      },
      "slice": {
        "rows": [{
          "uniqueName": "nome",
          "filter": {
            "members": [
              "nome.CPF"
            ]
          }
        }],
        "columns": [{
          "uniqueName": "CPF",
        }],
        "measures": [{
          "uniqueName": "nome",
          "aggregation": "sum",
          "active": true
        },
        ]
    },
    
      "localization": "https://cdn.webdatarocks.com/loc/pr.json"
    }
  })
})
