if(process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const newName = process.argv[3]
const newNumber = process.argv[4]

const person = new Person({ 
  name: newName,
  number: newNumber
})

// if(process.argv.length > 3) {
//   person.save().then(result => {
//     console.log(`added ${newName} ${newNumber} to phonebook`)
//     mongoose.connection.close()
//   })
// }

// if(process.argv.length === 3) {
//  Person.find()
//   .then(person => {
//     console.log('Phonebook: ')
//     person.forEach(p => {
//       console.log(`${p.name} ${p.number}`)
//     })    
//     mongoose.connection.close()
//   })
// }