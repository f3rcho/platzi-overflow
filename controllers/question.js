'use strict'
const { writeFile } = require('fs') //requiriendo fs pero destructurado para solo requerir writeFile
const { promisify } = require('util') //porque estamos usando asyc/await
const { join } = require('path')
const questions = require('../models/index').questions
const uuid = require('uuid/v1')//entidad para crear nuentros propios nombres de los archivos

//promisificar la parte de writeFile
const write = promisify(writeFile)

async function createQuestion (req, h) {
    if (!req.state.user) {
        return h.redirect('/login') 
    }
    let result, filename
    try {
        //si me llego un buffer un archivo
        if (Buffer.isBuffer(req.payload.image)) {
            //creamos nuevo nombre
            filename = `${uuid()}.png`
            await write(join(__dirname,'..', 'public', 'uploads', filename), req.payload.image)

        }
        result = await questions.create(req.payload, req.state.user, filename)
        console.log(`Pregunta creada con el ID ${result}`)
    } catch (error) {
        console.error(`Ocurrio un error: ${error}`);
        
        return h.view('ask', {
            title: 'Crear Pregunta',
            error: 'Problemas creando la pregunta'
        }).code(500).takeover()
        }
    // return h.response(`Pregunta creada con el ID ${result}`)
    // console.log(req.payload)
    return h.redirect(`/question/${result}`)
}
//respondiendo una pregunta
async function answerQuestion (req, h) {
    if (!req.state.user) {
        return h.redirect('/login') 
    }
    let result
    try {
        result = await questions.answer(req.payload, req.state.user)
        console.log(`Respuesta creada: ${result}`)
    } catch (error) {
        console.error(error);
    }
    return h.redirect(`/question/${req.payload.id}`) //redireccionando a la pregunta que se esta respondiendo
}

async function setAnswerRight (req, h) {
    if (!req.state.user) {
        return h.redirect('/login') 
    }
    let result
    try {
        result = await req.server.methods.setAnswerRight(req.params.questionId, req.params.answerId, req.state.user)
        console.log(result)
    } catch (error) {
        console.error(error);
    }
    return h.redirect(`/question/${req.params.questionId}`) 
}
module.exports = {
    createQuestion: createQuestion,
    answerQuestion,
    setAnswerRight:setAnswerRight
}
