'use strict'

const Hapi = require('@hapi/hapi')
const crumb = require('@hapi/crumb')
const handlerbars = require('./lib/helpers') 
const inert = require('inert') 
const good = require('@hapi/good')
const methods = require('./lib/methods')
const path = require('path') 
const routes = require('./routes')
const site = require('./controllers/site')
const vision = require('@hapi/vision')

const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: 'localhost',
   
    routes: {
        files: {
            relativeTo: path.join(__dirname, 'public')
        }
    } 
})

async function init() {

    try {
        await server.register(inert)
        await server.register(vision)
    //Registrando la entidad Good y Good-console    
        await server.register({
            plugin: good,
            options: {
                reporters: {
                    console: [
                        {
                            module: '@hapi/good-console'
                        },
                        'stdout'
                    ]
                }
            }
        })
//Registrando crumb
        await server.register({
            plugin: crumb,
            options: {
                cookieOptions: {
                    isSecure: process.env.NODE_ENV === 'prod'
                }
            }
        })
    //Registrando el API 
        await server.register({
            plugin: require('./lib/api'),
            options: {
                prefix: 'api'
            }
        })

        server.method('setAnswerRight', methods.setAnswerRight)
        server.method('getLast', methods.getLast, {
            cache: {
                expiresIn: 1000 * 60,
                generateTimeout: 2000 
            }
        })
        server.state('user', { 
            ttl: 1000 * 60 * 60 * 24 * 7, 
            isSecure: process.env.NODE_ENV === 'prod',
            encoding: 'base64json',
        })

        server.views({
            engines: {  
                hbs: handlerbars 
            },
            relativeTo: __dirname, 
            path: 'views', 
            layout: true, 
            layoutPath: 'views' 
        })
        server.ext('onPreResponse', site.fileNotFound)
        server.route(routes)
        await server.start()
    } catch (error) {
        server.log('error', error)
        process.exit(1)
    }
//aplicando el servidor de good en los logs
    server.log('info', `Servidor lanzado en: ${server.info.uri}`)
}

process.on('unhandledRejection', error => {
    server.log('unhandledRejection', error);
})
process.on('unhandledException', error => {
    server.log('unhandledException', error);
})

init();