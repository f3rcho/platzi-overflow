'use strict'
const joi = require('joi')
const site = require('./controllers/site')
const user = require('./controllers/user')
const question = require('./controllers/question')
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
        method: 'GET',
        path: '/ask',
        handler: site.ask
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
        path: '/create-question',
        method: 'POST',
        options: {
            validate: {
                payload: {
                    title: joi.string().required(),
                    description: joi.string().required(),
                },
                //manejando error. cuando la validacion falla
                failAction: user.failValidation,
            }
        },
        handler: question.createQuestion
    },
    {
        method: 'GET',
        path: '/assets/{param*}',
        handler: {
            directory: {
                path: '.',
                index: ['index.html']
            }
        }
    },
    {
        method: ['GET', 'POST'], // estos metodos aplican para esta ruta. Validacion de errores
        path: '/{any*}',
        handler: site.notFound,
    }
]
