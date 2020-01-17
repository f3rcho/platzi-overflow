'use strict'
const Boom =require('@hapi/boom')
const users = require('../models/index').users //users es la propiedad que se esta exportando

async function createUser (req, h) {
    let result
    try {
        result = await users.create(req.payload)
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
    return Boom.badRequest('Fallo la validacion', req.payload)
}
module.exports = {
    createUser: createUser,
    logout: logout,
    validateUser: validateUser,
    failValidation: failValidation,
}