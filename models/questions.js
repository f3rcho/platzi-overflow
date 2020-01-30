'use strict'

class Questions {
    constructor (db) { //recibe la db
        this.db = db 
        this.ref = this.db.ref('/') //se crea una referencia
        this.collection = this.ref.child('questions') //referenciamos la raiz
    }
    async create (info, user, filename) {
// introduciendo info en data para poder conservar data y modificando para recibir imagenes
        const data = {
            description: info.description,
            title: info.title,
            owner: user    
        }
//si llega filename lo guarda y queda referenciada en la db
        if (filename) {
            data.filename = filename
        }

        const question = this.collection.push() //guarda en la colection
        question.set(data) //se inserta

        return question.key //firebase retorna un key por eso devolvemos asi
    }
    async getLast (amount) {
        const query = await this.collection.limitToLast(amount).once('value')
        const data = query.val()
        return data
    }
// recuperar una pregunta por id
    async getOne (id) {
        const query = await this.collection.child(id).once('value')
        const data = query.val() 
        return data
    }
// respondiendo, insertando una pregunta
    async answer (data, user) { //data objeto del payload
        const answers = await this.collection.child(data.id).child('answers').push()
        answers.set({text: data.answer, user: user}) //dandole valores a answer
        return answers
    }
// Creacion de l metodo estandar para el servidor
    async setAnswerRight (questionId, answerId, user) {
    //query al firebase
        const query = await this.collection.child(questionId).once('value')
        const question = query.val()
        const answers = question.answers
    //verificamos que el usuario es el dueno de la pregunta
        if (!user.email === question.owner.email) {
            return false            
        }
    //proceso para responder
        for (let key in answers) {
            answers[key].correct = (key === answerId)
        }
//actualizamos la pregunta
        const update = await this.collection.child(questionId).child('answers').update(answers)
        return update
    }
}

module.exports = Questions