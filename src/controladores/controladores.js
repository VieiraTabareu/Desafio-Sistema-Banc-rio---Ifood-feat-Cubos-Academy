const { query } = require("express")
const { contas } = require("../bancodedados")
let { numeroConta } = require("../bancodedados")

const validarSenha = (req, res, next) => {
    const { senha_banco } = req.query

    if (senha_banco) {
        if (senha_banco === "cubos123Bank") {
            res.status(200)
            next()
        }
        else if (senha_banco !== "cubos123Bank") {
            res.status(401).json("A senha do banco informada é inválida!")
        }
    }
    else {
        res.status(403).json("O usuário nao está logado")
    }
}

const listarContas = (req, res) => {
    res.status(200).json(contas)
}

const criarConta = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body

    if (!nome) { return res.status(400).json("O nome precisa ser informado") }
    if (!cpf) { return res.status(400).json("O CPF precisa ser informado") }
    if (!data_nascimento) { return res.status(400).json("A data de nascimento precisa ser informada") }
    if (!telefone) { return res.status(400).json("O telefone precisa ser informado") }
    if (!email) { return res.status(400).json("O email precisa ser informado") }
    if (!senha) { return res.status(400).json("A senha precisa ser informada") }

    for (let conta of contas) {
        if (conta.cpf === cpf || conta.email === email) {
            return res.status(400).json("Já existe uma conta com o cpf ou e-mail informado!")
        }
    }

    const conta = {
        numeroConta: numeroConta++, nome, cpf, data_nascimento, telefone, email, senha, saldo: 0
    }

    contas.push(conta)
    res.status(201).json()
}

const atualizarConta = (req, res) => {
    const { numeroConta } = req.params
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body
    const contaOrigem = contas.find((conta) => conta.numeroConta === Number(numeroConta))

    if (isNaN(numeroConta)) {
        return res.status(404).json("O numero da conta não é válido")
    }
    if (contas.length == 0) {
        return res.status(400).json("Ainda nao existem contas cadastradas")
    }
    if (!contaOrigem) {
        return res.status(400).json("O numero da conta nao existe")
    }

    if (!nome) { return res.status(400).json("O nome precisa ser informado") }
    else { contaOrigem.nome = nome }
    if (!cpf) { return res.status(400).json("O CPF precisa ser informado") }
    else { contaOrigem.cpf = cpf }
    if (!data_nascimento) { return res.status(400).json("A data de nascimento precisa ser informada") }
    else { contaOrigem.data_nascimento = data_nascimento }
    if (!telefone) { return res.status(400).json("O telefone precisa ser informado") }
    else { contaOrigem.telefone = telefone }
    if (!email) { return res.status(400).json("O email precisa ser informado") }
    else { contaOrigem.email = email }
    if (!senha) { return res.status(400).json("A senha precisa ser informada") }
    else { contaOrigem.senha = senha }

    for (let conta of contas) {
        if (conta !== contaOrigem && conta.cpf === cpf) {
            return res.status(400).json("O CPF informado já existe cadastrado!")
        }
        if (conta !== contaOrigem && conta.email === email) {
            return res.status(400).json("O e-mail informado já existe cadastrado!")
        }
    }

    res.status(201).json()
}

const deletarConta = (req, res) => {
    const { numeroConta } = req.params
    const contaOrigem = contas.find((conta) => conta.numeroConta === Number(numeroConta))
    const posicaoConta = contas.findIndex((conta) => conta.numeroConta === Number(numeroConta))

    if (isNaN(numeroConta)) {
        return res.status(404).json("O numero da conta não é válido")
    }
    if (!contaOrigem) {
        return res.status(400).json("O numero da conta nao existe")
    }
    if (contas.length == 0) {
        return res.status(400).json("Ainda nao existem contas cadastradas")
    }
    if (contas[posicaoConta].saldo > 0) {
        return res.status(403).json("A conta só pode ser removida se o saldo for zero!")
    }

    contas.splice(posicaoConta, 1)
    res.status(204).json()

}

const depositar = (req, res) => {
    const { numero_conta, valor } = req.body
    const contaOrigem = contas.find((conta) => conta.numeroConta === Number(numero_conta))
    const posicaoConta = contas.findIndex((conta) => conta.numeroConta === Number(numero_conta))

    if (!numero_conta) {
        res.status(400).json("O numero da conta precisa ser informado")
    }
    if (isNaN(numero_conta)) {
        res.status(400).json("O numero da conta informado nao é valido")
    }
    if (!contaOrigem) {
        res.status(404).json("A conta nao foi encontrada ou não existe")
    }
    if (!valor) {
        res.status(400).json("O valor precisa ser informado")
    }
    if (valor <= 0 || isNaN(valor)) {
        res.status(400).json("O valor informado nao é valido")
    }

    const saldo = contaOrigem.saldo + Number(valor)
    contas[posicaoConta].saldo = saldo

    res.status(204).json()
}

const sacar = (req, res) => {
    const { numero_conta, valor, senha } = req.body

    const contaOrigem = contas.find((conta) => conta.numeroConta === Number(numero_conta))
    const posicaoContaOrigem = contas.findIndex((conta) => conta.numeroConta === Number(numero_conta))

    if (!numero_conta) {
        return res.status(400).json("O numero da conta precisa ser informado")
    }
    if (!valor) {
        return res.status(400).json("O valor precisa ser informado")
    }
    if (!senha) {
        return res.status(400).json("A senha precisa ser informada")
    }
    if (isNaN(numero_conta)) {
        return res.status(400).json("O numero da conta informado nao é valido")
    }
    if (valor <= 0 || isNaN(valor)) {
        return res.status(400).json("O valor informado nao é valido")
    }
    if (!contaOrigem) {
        return res.status(404).json("A conta não foi encontrada ou não existe")
    }
    if (contaOrigem.senha !== senha) {
        return res.status(403).json("A senha está incorreta")
    }
    if (contaOrigem.saldo < valor) {
        return res.status(400).json("Saldo insuficiente")
    }

    const saldoAposSaque = contaOrigem.saldo - Number(valor)
    contas[posicaoContaOrigem].saldo = saldoAposSaque

    res.status(201).json()
}

const transferir = (req, res) => {
    const { origem, destino, senha, valor } = req.body

    const contaOrigem = contas.find((conta) => conta.numeroConta === Number(origem))
    const posicaoContaOrigem = contas.findIndex((conta) => conta.numeroConta === Number(origem))

    const posicaoContaDestino = contas.findIndex((conta) => conta.numeroConta === Number(destino))
    const contaDestino = contas.find((conta) => conta.numeroConta === Number(destino))

    const saldoOrigem = contaOrigem.saldo
    const saldoDestino = contaDestino.saldo

    const senhaValida = contaOrigem.senha

    if (!origem) { return res.status(400).json("A conta origem não foi informada") }
    if (isNaN(origem)) { return res.status(400).json("A conta origem não é válida") }
    if (!destino) { return res.status(400).json("A conta destino não foi informada") }
    if (isNaN(destino)) { return res.status(400).json("A conta destino não é válida") }
    if (!senha) { return res.status(400).json("A senha não foi informada") }
    if (!valor) { return res.status(400).json("Informe um valor") }
    if (isNaN(valor) || valor <= 0) { return res.status(400).json("O valor informado não é valido") }

    if (senhaValida !== senha) {
        return res.status(403).json("A conta informada é invalida")
    }
    if (saldoOrigem <= 0) {
        return res.status(401).json("O saldo é insuficiente")
    }

    const saldoAposTransferir = saldoOrigem - Number(valor)
    const saldoAposReceber = saldoDestino + Number(valor)

    contas[posicaoContaOrigem].saldo = saldoAposTransferir
    contas[posicaoContaDestino].saldo = saldoAposReceber

    res.status(201).json()
}

const saldo = (req, res) => {
    const { numero_conta, senha } = req.query

    const contaOrigem = contas.find((conta) => Number(numero_conta) === conta.numeroConta)
    const senhaValida = contaOrigem.senha

    if (!numero_conta) {
        return res.status(400).json("O numero da conta nao foi informado")
    }
    if (!contaOrigem) {
        return res.status(404).json("Conta bancária não encontrada!")
    }
    if (!senha) {
        return res.status(400).json("A senha não foi informada")
    }
    if (senha !== senhaValida) {
        return res.status(403).json("A senha esta incorreta")
    }

    res.status(200).json(`Saldo: ${contaOrigem.saldo}`)
}

module.exports = { validarSenha, listarContas, criarConta, atualizarConta, deletarConta, depositar, sacar, transferir, saldo }