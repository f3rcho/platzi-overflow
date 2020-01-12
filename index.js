'use strict'

// Requerir el modulo de hapi (Framework)
const Hapi = require('@hapi/hapi')
const inert = require('inert') // extiende los metodos disponible en el objeto h
const path = require('path') // nos permite definir una ubicación relativa para todos los routes de nuestro proyecto

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
      // Definición de rutas (indicar el método HTTP, URL y controlador de ruta)
    server.route({
       method: 'GET',
       path: '/home',
       handler: (req, h) => {
           // El objeto h es un conjunto de utilidades para la respuesta.
           return h.response('Hola Mundo...!!!').code(200)
       } 
    })

    server.route({
        method: 'GET',
        path: '/redirect',
        handler: (req, h) => {
            // El objeto h es un conjunto de utilidades para la respuesta.
            return h.redirect('http://platzi.com')
        } 
     })
  // Arrancar el servidor de HapiJS, se considera una tarea asincrona.
    try {
        await server.start()
    } catch (error) {
        console.error(error)
    // Salir de nodeJS con un código de error (1), 0 es un código de exito
        process.exit(1)
    }

    console.log(`Servidor lanzado en: ${server.info.uri}`)
}

// Inicializar el proyecto
init();