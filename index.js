require("dotenv").config();
const conn = require("./db/conn");

conn
.authenticate()
.then(() => {
    console.log("Conectado ao banco de dados com sucesso! XD");
}).catch(()=>{
    console.log("Ocorreu um erro: " + err)
});