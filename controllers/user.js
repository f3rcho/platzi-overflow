'use strict'
const Boom =require('@hapi/boom')
const users = require('../models/index').users //users es la propiedad que se esta exportando

async function createUser (req, h) {
    let result
    try {
        result = await users.create(req.payload)
    } catch (error) {
        console.error(error)
        return h.response('Problemas creando el usuario').code(500)   
    }
    return h.response(`Usuario creado ID: ${result}`)
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
            return h.response('Email y/o contraseña incorrecta').code(401)
        }
    } catch (error) {
        console.error(error);
        return h.response('Problemas validando el usuario').code(500)
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