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
        method: 'POST',
        options: {
            validate: {
                payload: {
                    name: joi.string().required().min(3),
                    email: joi.string().email().required(),
                    password: joi.string().required().min(6),
                }
            }
        },
        path: '/create-user',
        handler: user.createUser
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
