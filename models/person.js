const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
//el nombre de la db figura aca
// en local el backend utiliza el archivo .env
// en produccion (fly.io) se paso la uri mediante el comando fly secrets
const uri = process.env.MONGODB_URI
console.log('Connecting to', uri)
let intervalId

if(!intervalId) {
  intervalId = setInterval(() => {
    console.log('.')
  }, 1000)
}

mongoose.connect(uri)
  .then(() => {
    clearInterval(intervalId)
    intervalId = null
    console.log('Succesfully connected to MongoDB ! ! !')
  })
  .catch(error => {
    clearInterval(intervalId)
    intervalId = null
    console.log('error conecting to MongoDB', error.message)
  })

//se crea el esquema
const personSchema = new mongoose.Schema({
  id: Number,
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    validate: {
      validator: function(number) {
        return /^\d{2}-?\d{6,}$|^\d{3}-?\d{5,}$/.test(number)
      },
      message: props => `${props.value} is not a valid phone number`
    },
    required: [true, 'Phone number required']
  }
})


// se tranforma el id a string, se saca el _id de la respuesta json
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports= mongoose.model('Person', personSchema)
