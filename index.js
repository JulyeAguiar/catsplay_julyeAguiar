require("dotenv").config();
const conn = require("./db/conn");

const Usuario = require("./models/Usuario");
const express = require("express");
const app = express();

// conn
// .sync()
// .then(() => {
//     console.log("Conectado e sincronizado ao banco de dados com sucesso! XD");
// }).catch((err)=>{
//     console.log("Ocorreu um erro: " + err)
// });


app.use(
    express.urlencoded({
        extended: true,
    })
);
    app.use(express.json())


app.get("/usuarios/novo", (req, res) => {
    res.sendFile(`${__dirname}/views/formUsuario.html`)
})

app.post("/usuarios/novo", async (req, res) =>{
    const nickname = req.body.nickname;
    const nome = req.body.nome;

    const dadosUsuario ={
        nickname,
        nome,
    };

    const usuario = await Usuario.create(dadosUsuario)

    res.send("Usuário inserido sob id " + usuario.id)
});

app.listen(8000, () => {
    console.log("server rodando na porta 8000!")
})