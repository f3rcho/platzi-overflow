'use strict'
const questions = require('../models/index').questions

async function home (req, h) {
    //modificando el metodo para el servidor con cache
    const data = await req.server.methods.getLast(10)

    return h.view('index', {
        title: 'home',
        user: req.state.user,
        questions: data
    })
}
function register (req, h) {
    //redireccionando si el user esta registrado
    if (req.state.user) {
        return h.redirect('/')    
    }
    return h.view('register', {
        title: 'Registro',
        user: req.state.user
    })
}
function login (req, h) {
    //redireccionando si el user esta logeado
    if (req.state.user) {
        return h.redirect('/')    
    } 
    return h.view('login', {
        title: 'Ingrese',
        user: req.state.user
    })
}
//Visualizar una pregunta
async function viewQuestion (req, h) {
    let data
    try {
        // obteniendo parametros de la ruta
        data = await questions.getOne(req.params.id)
        if (!data) {
            return notFound(req, h)
        }
    } catch (error) {
        console.error(error);
    }
    return h.view('question', {
        title: 'Detalles de la pregunta',
        user: req.state.user,
        question: data,
        key: req.params.id //key es el id de la pregunta
    })
}

function notFound (req, h) { //funcion que se lanzara al haber un 404
    return h.view('404', {}, {layout: 'error-layout'}).code(404)
}
//se verifica si el response viene con error y si viene con 404
function fileNotFound (req, h) {
    const response = req.response
    if (response.isBoom && response.output.statusCode === 404) {
        return h.view('404', {}, {layout: 'error-layout'}).code(404)
    }
//si no se cumple la condicion se continua el lifecycle
    return h.continue
}
function ask (req, h) {
    if (!req.state.user) {
        return h.redirect('/login')
    }
    return h.view('ask', {
        title: 'Crear Pregunta',
        user: req.state.user
    })
}
module.exports = {
    ask: ask,
    home: home,
    login: login,
    fileNotFound: fileNotFound,
    notFound: notFound,
    register: register,
    viewQuestion,
}