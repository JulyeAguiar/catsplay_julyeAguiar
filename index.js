require("dotenv").config();
const conn = require("./db/conn");

const Usuario = require("./models/Usuario");
const Jogo = require("./models/Jogo");

const handlebars = require ("express-handlebars")
const express = require("express");

const app = express();

app.engine("handlebars", handlebars.engine())
app.set("view engine", "handlebars")


conn
.sync()
.then(() => {
    console.log("Conectado e sincronizado ao banco de dados com sucesso! XD");
}).catch((err)=>{
    console.log("Ocorreu um erro: " + err)
});


app.use(
    express.urlencoded({
        extended: true,
    })
);
    app.use(express.json())


app.get("/usuarios/novo", (req, res) => {
    res.render(`formUsuario`)
})

app.get("/jogos/novo", (req, res) => {
    res.render(`formJogo`)
})

app.get("/", (req, res) => {
    res.render(`home`)
})

app.get("/usuarios", async(req, res) => {
    const usuarios = await Usuario.findAll({raw: true})
    res.render(`usuarios`, {usuarios})
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


app.post("/jogos/novo", async (req, res) =>{
    const titulo = req.body.titulo;
    const descricao = req.body.descricao;
    const precoBase = req.body.precoBase;

    const dadosJogo ={
        titulo,
        descricao,
        precoBase,
    };

    const jogo = await Jogo.create(dadosJogo)

    res.send("Jogo inserido sob id " + jogo.id)
});

app.get("/usuarios/:id/atualizar", async (req, res)=>{
    const id = req.params.id
    const usuario = await Usuario.findByPk(id, { raw: true})

    res.render("formUsuario", {usuario})
})

app.post("/usuarios/:id/atualizar", async (req, res)=>{
    const id = req.params.id

    const dadosUsuario = {
        nickname: req.body.nickname,
        nome: req.body.nome,
    }

    const registroAfetados = await Usuario.update(dadosUsuario, {where:{id: id}})

    if (registroAfetados > 0) {
        res.redirect("/usuarios")
    }
    else{
        res.send("Erro ao atualizar usuário!!!!!")
    }
    
})

app.post("/usuarios/excluir", async (req, res) =>{

    const id = req.body.id

    const registroAfetados = await Usuario.destroy({where:{id: id}})

    if (registroAfetados > 0) {
        res.redirect("/usuarios")
    }
    else{
        res.send("Erro excluir usuário!!!!!")
    }
})

app.listen(8000, () => {
    console.log("server rodando na porta 8000!")
})