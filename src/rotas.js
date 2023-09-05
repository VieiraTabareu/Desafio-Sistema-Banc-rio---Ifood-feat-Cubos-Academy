const express = require("express")
const { listarContas, validarSenha, criarConta } = require("./controladores/controladores")
const rotas = express()

rotas.post("/contas", criarConta)
rotas.use(validarSenha)
rotas.get("/contas", listarContas)

module.exports = rotas

