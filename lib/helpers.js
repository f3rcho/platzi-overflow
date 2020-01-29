'use strict'

const handlebars = require('handlebars')

function registerHelpers() {
    //numero de respuestas por preguntas
    handlebars.registerHelper('answerNumber', (answers) => {
    const keys = Object.keys(answers)
    return keys.length
})
//para validar el usuario como dueno o contribuidor
    handlebars.registerHelper('ifEquals', (a, b, options) => { //dos usuarios a y b. option por definicion
    if (a === b) {
        return options.fn(this) //fn funcion con el contexto actual
    }
    return options.inverse(this)//this. lo que esta dentro del bloque
})
    return handlebars
}

module.exports = registerHelpers()