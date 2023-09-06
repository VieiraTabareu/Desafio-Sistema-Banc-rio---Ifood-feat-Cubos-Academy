const express = require("express")
const { listarContas, validarSenha, criarConta, atualizarConta } = require("./controladores/controladores")
const rotas = express()

rotas.post("/contas", criarConta)
rotas.put("/contas/:numeroConta/usuario", atualizarConta)
rotas.use(validarSenha)
rotas.get("/contas", listarContas)

module.exports = rotas

