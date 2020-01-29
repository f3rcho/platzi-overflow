'use strict'
//requerimos el modelo creado del metodo estandar
const questions = require('../models/index')
//asociando metodo propio trasladando los argumentos del metodo origial (estandar)
async function setAnswerRight (questionId, answerId, user) {
    let result
    try {
        result = await questions.setAnswerRight(questionId, answerId, user)
    } catch (error) {
        console.error(error);
        return false
    }
    return result
}

module.exports = {
    setAnswerRight
}