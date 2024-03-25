require("dotenv").config();
const conn = require("./db/conn");

const Usuario = require("./models/Usuario");

conn
.sync()
.then(() => {
    console.log("Conectado e sincronizado ao banco de dados com sucesso! XD");
}).catch((err)=>{
    console.log("Ocorreu um erro: " + err)
});




