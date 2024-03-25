const sequelize = require("../db/conn");
const {DataTypes} = require("sequelize");

const Usuario = sequelize.define("Usuario", {
    nickname:{
        type: DataTypes.STRING,
        require: false,
    },
    nome: {
        type: DataTypes.STRING,
        require: true,
    },
});

module.exports = Usuario;
