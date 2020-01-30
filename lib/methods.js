'use strict'
//requerimos el modelo creado del metodo estandar
const questions = require('../models/index').questions
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
//creando el cache para el servidor
async function getLast (amount) {
    let data 
    try {
        data = await questions.getLast(10)
    } catch (error) {
        console.error(error);
    } 
    console.log('Se ejecuto el metodo')
    return data
}

module.exports = {
    setAnswerRight,
    getLast
}