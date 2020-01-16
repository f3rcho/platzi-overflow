'use strict'
const joi = require('joi')
const site = require('./controllers/site')
const user = require('./controllers/user')
// Definición de rutas (indicar el método HTTP, URL y controlador de ruta)
module.exports = [

    {
        method: 'GET',
        path: '/',
        handler: site.home
    },
    {
        method: 'GET',
        path: '/register',
        handler: site.register
    },
    {
        path: '/create-user',
        method: 'POST',
        options: {
            validate: {
                payload: {
                    name: joi.string().required().min(3),
                    email: joi.string().email().required(),
                    password: joi.string().required().min(6),
                },
                failAction: user.failValidation,
            }
        },
        handler: user.createUser
    },
    {
        method: 'GET',
        path: '/login',
        handler: site.login
    },
    {
        method: 'GET',
        path: '/logout',
        handler: user.logout
    },
    {
        path: '/validate-user',
        method: 'POST',
        options: {
            validate: {
                payload: {
                    email: joi.string().email().required(),
                    password: joi.string().required().min(6),
                },
                //manejando error. cuando la validacion falla
                failAction: user.failValidation,
            }
        },
        handler: user.validateUser
    },
    {
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: '.',
                index: ['index.html']
            }
        }
    }
]
