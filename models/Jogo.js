const sequelize = require("../db/conn");
const {DataTypes} = require("sequelize");

const Jogo = sequelize.define("Jogo", {
    titulo:{
        type: DataTypes.STRING,
        required: true,
    },
    descricao: {
        type: DataTypes.STRING,
        required: true,
    },
    precoBase: {
        type: DataTypes.DOUBLE,
        required: true,
    },
});

module.exports = Jogo;


