'use strict'

class Question {
    constructor (db) { //recibe la db
        this.db = db 
        this.ref = this.db.ref('/') //se crea una referencia
        this.collection = this.ref.child('questions') //referenciamos la raiz
    }
    async create (data, user) {
        data.owner = user //user esta en una cookie
        const question = this.collection.push() //guarda en la colection
        question.set(data) //se inserta

        return question.key //firebase retorna un key por eso delvemos asi
    }
}

module.exports = Question