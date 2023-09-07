const express = require("express")
const { listarContas, validarSenha, criarConta, atualizarConta, deletarConta, depositar, sacar, transferir, saldo } = require("./controladores/controladores")
const rotas = express()

rotas.post("/contas", criarConta)
rotas.put("/contas/:numeroConta/usuario", atualizarConta)
rotas.delete("/contas/:numeroConta", deletarConta)
rotas.post("/transacoes/depositar", depositar)
rotas.post("/transacoes/sacar", sacar)
rotas.post("/transacoes/transferir", transferir)
rotas.get("/contas/saldo", saldo)
rotas.use(validarSenha)
rotas.get("/contas", listarContas)

module.exports = rotas

