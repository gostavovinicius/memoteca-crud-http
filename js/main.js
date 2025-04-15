import ui from "./ui.js"
import api from "./api.js"

function removerEspacos(string) {
    return string.replaceAll(/\s+/g, '')
}

const regexConteudo = /^[A-Za-z\s]{10,}$/
const regexAutoria = /^[A-ZA-Z]{3,15}$/

function validarConteudo(conteudo) {
    return regexConteudo.test(conteudo)
}

function validarAutoria(autoria) {
    return regexAutoria.test(autoria)
}

document.addEventListener("DOMContentLoaded", () => {
    ui.renderizarPensamentos()

    const formularioPensamento = document.getElementById('pensamento-form')
    const botaoCancelar = document.getElementById('botao-cancelar')
    const inputBusca = document.getElementById('campo-busca')

    formularioPensamento.addEventListener("submit", manipularSubmissaoFormulario)
    botaoCancelar.addEventListener("click", manipularCancelamento)
    inputBusca.addEventListener("input", manipularBusca)
})

async function manipularSubmissaoFormulario(event) {
    event.preventDefault()
    const id = document.getElementById("pensamento-id").value
    const conteudo = document.getElementById("pensamento-conteudo").value
    const autoria = document.getElementById("pensamento-autoria").value
    const data = document.getElementById("pensamento-data").value

    const conteudoSemEspacos = removerEspacos(conteudo)
    const autoriaSemEspacos = removerEspacos(autoria)

    if(!validarConteudo(conteudoSemEspacos)) {
        alert("É permitido a inclusão apenas de letras e espaços com minimo de 10 caracteres.")

        return
    }

    if(!validarAutoria(autoriaSemEspacos)) {
        alert("É permitido a inclusão apenas de letras com de 3 à 15 caracteres.")
    }

    if(!validarData(data)) {
        alert("Não é permitido o cadastro de datas futuras!")
    } else {
        try {
            if (id) {
                await api.editarPensamento({ id, conteudo, autoria, data })
            } else {
            await api.salvarPensamento({ conteudo, autoria, data })
            }
            ui.renderizarPensamentos()
        } catch {
        alert('Erro ao salvar o pensamento!') 
        }
    }
}

function manipularCancelamento() {
    ui.limparFormulario()
}

async function manipularBusca() {
    const termoBusca = document.getElementById('campo-busca').value
    try {
        const pensamentosFiltrados = await api.buscarPensamentoPorTermo(termoBusca)
        ui.renderizarPensamentos(pensamentosFiltrados)
    } catch (error) {
        alert('Erro ao realizar busca!')
    }
}

function validarData(data) {
    const dataAtual = new Date()
    const dataInserida = new Date(data)

    return dataInserida <= dataAtual
}