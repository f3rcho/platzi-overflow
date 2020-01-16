'use strict'

// Requerir el modulo de hapi (Framework)
const Hapi = require('@hapi/hapi')
const handlerbars = require('handlebars') // para implementacion de plantillas
const inert = require('inert') // extiende los metodos disponible en el objeto h
const vision = require('@hapi/vision') //para implementar el uso de vistas. Hay que configurarlo por ser un plugin
const path = require('path') // nos permite definir una ubicación relativa para todos los routes de nuestro proyecto
const routes = require('./routes')

// Configurar el servidor de nuestra aplicación. En un contenedor (Docker) si marca error colocar 0.0.0.0 (todos)
const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: 'localhost',
    //definir desde donde va acceder a las rutas. relaviteTo (routes.files)
    routes: {
        files: {
            relativeTo: path.join(__dirname, 'public')
        }
    } 
})

// Definicion de función para inicializar el proyecto. Internamente hay tareas asincronas
async function init() {

  // Arrancar el servidor de HapiJS, se considera una tarea asincrona.
    try {
        // registrando inert
        await server.register(inert)
        //registrando vision
        await server.register(vision)
    //configurando el servidor para el envio de cookies con state para la autenticacion-cookies y estado
        server.state('user', { //nombre la cookie (user)
            ttl: 1000 * 60 * 60 * 24 * 7, //ttl de una semana
            isSecure: process.env.NODE_ENV === 'prod',
            encoding: 'base64json',
        })

        //configuracion de vision
        server.views({
            engines: {  //hapi puede usar diferentes engines
                hbs: handlerbars //asociamos el plugin al tipo de archivo
            },
            relativeTo: __dirname, //para que las vistas las busque fuera de /public
            path: 'views', //directorio done colocaremos las vistas dento de nuestro proyecto
            layout: true, //indica que usaremos layouts
            layoutPath: 'views' //ubicacion de layouts
        })
        server.route(routes)
        await server.start()
    } catch (error) {
        console.error(error)
    // Salir de nodeJS con un código de error (1), 0 es un código de exito
        process.exit(1)
    }

    console.log(`Servidor lanzado en: ${server.info.uri}`)
}
//manejo de errores no controlados
process.on('unhandledRejection', () => {
    console.error('unhandledRejection', error.message, error);
})
process.on('unhandledException', () => {
    console.error('unhandledException', error.message, error);
})

// Inicializar el proyecto
init();