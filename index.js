require("dotenv").config();
const conn = require("./db/conn");

const Usuario = require("./models/Usuario");
const Jogo = require("./models/Jogo");
const Cartao = require("./models/Cartao");
const Conquista = require("./models/Conquista");

const handlebars = require("express-handlebars")
const express = require("express");


const app = express();

app.engine("handlebars", handlebars.engine())
app.set("view engine", "handlebars")

conn
    .sync()
    .then(() => {
        console.log("Conectado e sincronizado ao banco de dados com sucesso! XD");
    }).catch((err) => {
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

app.get("/", (req, res) => {
    res.render(`home`)
})

app.get("/usuarios", async (req, res) => {
    const usuarios = await Usuario.findAll({ raw: true })// raw: true é para voltar dados simples, um JSON simples

    res.render(`usuarios`, { usuarios })
})

app.post("/usuarios/novo", async (req, res) => {
    const nickname = req.body.nickname;
    const nome = req.body.nome;

    const dadosUsuario = {
        nickname,
        nome,
    };

    const usuario = await Usuario.create(dadosUsuario)

    res.send("Usuário inserido sob id " + usuario.id)
});

app.get("/usuarios/:id/atualizar", async (req, res) => {
    const id = req.params.id
    const usuario = await Usuario.findByPk(id, { raw: true })

    res.render("formUsuario", { usuario })
})

app.post("/usuarios/:id/atualizar", async (req, res) => {
    const id = req.params.id

    const dadosUsuario = {
        nickname: req.body.nickname,
        nome: req.body.nome,
    }

    const registroAfetados = await Usuario.update(dadosUsuario, { where: { id: id } })

    if (registroAfetados > 0) {
        res.redirect("/usuarios")
    }
    else {
        res.send("Erro ao atualizar usuário!!!!!")
    }
})

app.post("/usuarios/excluir", async (req, res) => {
    const id = req.body.id
    const registroAfetados = await Usuario.destroy({ where: { id: id } })

    if (registroAfetados > 0) {
        res.redirect("/usuarios")
    }
    else {
        res.send("Erro excluir usuário!!!!!")
    }
})

//Criação da página Jogos

app.get("/jogos/novo", (req, res) => {
    res.render(`formJogo`)
})

app.get("/jogos", async (req, res) => {
    const jogos = await Jogo.findAll({ raw: true })// raw: true é para voltar dados simples, um JSON simples

    res.render(`jogos`, { jogos })
})

app.post("/jogos/novo", async (req, res) => {
    const titulo = req.body.titulo;
    const descricao = req.body.descricao;
    const precoBase = req.body.precoBase;

    const dadosJogo = {
        titulo,
        descricao,
        precoBase,
    };

    const jogo = await Jogo.create(dadosJogo)
    res.send("Jogo inserido sob id " + jogo.id )
});

app.post("/jogos/excluir", async (req, res) => {

    const id = req.body.id

    const registroAfetados = await Jogo.destroy({ where: { id: id } })

    if (registroAfetados > 0) {
        res.redirect("/jogos")
    }
    else {
        res.send("Erro excluir jogo!!!!!")
    }
})


// Rotas para cartões

//Ver cartões do usuário
app.get("/usuarios/:id/cartoes", async (req, res) => {
    const id = parseInt(req.params.id);
    const usuario = await Usuario.findByPk(id, { raw: true });

    const cartoes = await Cartao.findAll({
        raw: true,
        where: { UsuarioId: id },
    });

    res.render("cartoes.handlebars", { usuario, cartoes });
});

//Formulário de cadastro de cartão
app.get("/usuarios/:id/novoCartao", async (req, res) => {
    const id = parseInt(req.params.id);
    const usuario = await Usuario.findByPk(id, { raw: true });

    res.render("formCartao", { usuario });
});

//Cadastro de cartão
app.post("/usuarios/:id/novoCartao", async (req, res) => {
    const id = parseInt(req.params.id);

    const dadosCartao = {
        numero: req.body.numero,
        nome: req.body.nome,
        cvv: req.body.cvv,
        UsuarioId: id,
    };

    await Cartao.create(dadosCartao);

    res.redirect(`/usuarios/${id}/cartoes`);
});

// Rotas para Conquistas

//Ver conquistas do jogo
app.get("/jogos/:id/conquistas", async (req, res) => {
    const id = parseInt(req.params.id);
    const jogo = await Jogo.findByPk(id, { raw: true });

    const conquistas = await Conquista.findAll({
        raw: true,
        where: { JogoId: id },
    });

    res.render("conquistas.handlebars", { jogo, conquistas });
});

//Formulário de cadastro de conquistas
app.get("/jogos/:id/novoConquista", async (req, res) => {
    const id = parseInt(req.params.id);
    const jogo = await Jogo.findByPk(id, { raw: true });

    res.render("formConquista", { jogo });
});

//Cadastro de conquista
app.post("/jogos/:id/novoConquista", async (req, res) => {
    const id = parseInt(req.params.id);

    const dadosConquista = {
        titulo: req.body.titulo,
        descricao: req.body.descricao,
        JogoId: id,
    };

    await Conquista.create(dadosConquista);

    res.redirect(`/jogos/${id}/conquistas`);
});

app.listen(8000, () => {
    console.log("server rodando na porta 8000!")
})