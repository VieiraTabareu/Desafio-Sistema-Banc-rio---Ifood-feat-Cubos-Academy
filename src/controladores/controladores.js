const { contas } = require("../bancodedados")
let { numeroDaConta } = require("../bancodedados")

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
        numeroDaConta: numeroDaConta++, nome, cpf, data_nascimento, telefone, email, senha
    }

    contas.push(conta)
    res.status(201).json()
}

module.exports = { validarSenha, listarContas, criarConta }