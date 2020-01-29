'use strict'

class Questions {
    constructor (db) { //recibe la db
        this.db = db 
        this.ref = this.db.ref('/') //se crea una referencia
        this.collection = this.ref.child('questions') //referenciamos la raiz
    }
    async create (data, user) {
        data.owner = user //user esta en una cookie
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
}

module.exports = Questions