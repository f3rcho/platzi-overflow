'use strict'

const bcrypt = require('bcrypt')

//ORL para la creacion de usuarios. Usando Class
class Users { 
    constructor (db) { 
        this.db = db 
        this.ref = this.db.ref('/') //referenciado donde trabajara el modelo
        this.collection = this.ref.child('users') //creando la coleccion, un hijo en la raiz.
    }

    async create (data) { //metodo de la clase
        console.log(data)
        // Destructuro el objeto con el payload enviado. Ya que hapi lo decora con un prototipo null que no es compatible con Firebase
        const user = {
            ...data
        }

        user.password = await this.constructor.encrypt(user.password)
        const newUser = this.collection.push(user) //con push creamos la nueva referencia
        

        return newUser.key //almacenada en la propiedad key
    }

   static async encrypt (password) {
        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        return hashedPassword
    }
}

module.exports = Users