'use strict'

function home (req, h) {
    return h.view('index', {
        title: 'home',
        user: req.state.user
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

module.exports = {
    home: home,
    login: login,
    register: register,
}