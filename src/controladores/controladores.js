const { contas } = require("../bancodedados")
let { numeroConta } = require("../bancodedados")

const validarSenha = (req, res, next) => {
    const { senha_banco } = req.query

    if (senha_banco) {
        if (senha_banco === "cubos123") {
            res.status(200)
            next()
        }
        else if (senha_banco != "cubos123") {
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
        numeroConta: numeroConta++, nome, cpf, data_nascimento, telefone, email, senha
    }

    contas.push(conta)
    res.status(201).json()
}

const atualizarConta = (req, res) => {
    const { numeroConta } = req.params

    if (isNaN(numeroConta)) {
        return res.status(404).json("O numero da conta não é válido")
    }
    if (contas.length == 0) {
        return res.status(400).json("Ainda nao existem contas cadastradas")
    }

    const contaExiste = contas.find((conta) => numeroConta == conta.numeroConta)

    if (!contaExiste) {
        return res.status(400).json("O numero da conta nao existe")
    }

    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body

    if (!nome) { return res.status(400).json("O nome precisa ser informado") } {
        if (!cpf) { return res.status(400).json("O CPF precisa ser informado") }
        if (!data_nascimento) { return res.status(400).json("A data de nascimento precisa ser informada") }
        if (!telefone) { return res.status(400).json("O telefone precisa ser informado") }
        if (!email) { return res.status(400).json("O email precisa ser informado") }
        if (!senha) { return res.status(400).json("A senha precisa ser informada") }
    }

    const contaParaAtualizar = contas.find((conta) => conta.numeroConta === Number(numeroConta))
    const contaAtualizada = { numeroConta: contaParaAtualizar.numeroConta, nome, cpf, data_nascimento, telefone, email, senha }

    for (let conta of contas) {
        if (conta !== contaParaAtualizar && conta.cpf === cpf) {
            return res.status(400).json("O CPF informado já existe cadastrado!")
        }
        if (conta !== contaParaAtualizar && conta.email === email) {
            return res.status(400).json("O e-mail informado já existe cadastrado!")
        }
    }

    const posicaoContaAntiga = contas.findIndex((conta) => conta.numeroConta === Number(numeroConta))
    contas.splice(posicaoContaAntiga, 1, contaAtualizada)

    res.status(201).json()
}

module.exports = { validarSenha, listarContas, criarConta, atualizarConta }