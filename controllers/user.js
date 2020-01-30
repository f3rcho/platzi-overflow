'use strict'
const Boom =require('@hapi/boom')
const users = require('../models/index').users //users es la propiedad que se esta exportando

async function createUser (req, h) {
    let result
    try {
        result = await users.create(req.payload)
        console.log(`Usuario registrado ${result}`)
    } catch (error) {
        console.error(error)
        return h.view('register', {
            title: 'Registro',
            error: 'Error creando el usuario'
        })
    }
    return h.view('register', {
        title: 'Registro',
        success: 'Usuario creado exitosamente'
    })
}
//funcion para hacer el logout
function logout (req, h) {
    return h.redirect('/login').unstate('user')
}

async function validateUser (req, h) {
    let result 
    try {
        result = await users.validateUser(req.payload)
// En aplicaciones Web, las cookies se usan a menudo para mentener el estado de un usuario entre solicitudes http
        if (!result) {
            return h.view('login', {
                title: 'Login',
                error: 'Email y/o contraseña incorrecta'
            })
        }
    } catch (error) {
        console.error(error);
        return h.view('login', {
            title: 'Login',
            error: 'Problemas validando el usuario'
        })
    }
 // Se redirecciona al usuario y se le envía la cookie llamada user configurara previamente en la aplicacion (nombreCookie, data)
    return h.redirect('/').state('user', {
        name: result.name,
        email: result.email,
    }) //state me permite que va a llevar la cookie
}

function failValidation (req, h, error) {
//detectando de donde viene el error, con el obj templates    
    const templates = {
        '/create-user': 'register', //accion que se ejecuta en el registro
        '/validate-user': 'login', // en el login
        '/create-question': 'ask'
    }
    //retornamos la vista. req.path, accedo a la ruta de la que se esta mandando el error
    return h.view(templates[req.path], {
        title: 'Error de validación',
        error: 'Favor complete los campos requeridos'
    }).code(400).takeover()//finaliza el ciclo y responde de una vez 
}
module.exports = {
    createUser: createUser,
    logout: logout,
    validateUser: validateUser,
    failValidation: failValidation,
}