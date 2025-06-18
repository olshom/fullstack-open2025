import { useState, useEffect } from 'react'
import Filter from './components/Filter.jsx';
import PersonForm from './components/PersonForm.jsx';
import Persons from './components/Persons.jsx';
import Notification from './components/Notification.jsx';

import contactServices from './services/contacts.js'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [notification, setNotification] = useState(null)
  const [notificationColor, setNotificationColor] = useState(null)

  useEffect(() => {
    contactServices
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
    })
  }, []);

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleNewFilter = (event) => {
    setNewFilter(event.target.value)
  }

  const addNewName = (event) => {
    event.preventDefault()
    const existingContact = persons.find(person=>person.name===newName)

    if (existingContact === undefined) {
      const nameObject = {
        name: newName,
        number:newNumber
      }

      contactServices
        .create(nameObject)
        .then(createdObj => {
          setPersons(persons.concat(createdObj))
          setNotification(`${createdObj.name} was added`)
          setNotificationColor('green')
          setNewName('')
          setNewNumber('')
          setTimeout(()=>{
            setNotification(null)
            setNotificationColor(null)
          },5000)
        })
    } else {
      if (window.confirm(`${newName} is already added to phonebook,
      replace the old number with a new one?`)) {
        const updatedNumber = {...existingContact, number:newNumber}
        contactServices
          .updateNumber(existingContact.id, updatedNumber)
          .then(updatedContact=> {
            setPersons(
              persons.map(p => p.id === updatedContact.id ? updatedContact : p));
            setNotification((`${updatedContact.name} was changed`))
            setNotificationColor('green')
            setTimeout(() => {
              setNotification(null)
              setNotificationColor(null)
            }, 5000)
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            setNotification(`the contact ${existingContact.name} was already deleted from server`)
            setNotificationColor('red')
            setTimeout(() => {
              setNotification(null)
              setNotificationColor(null)
            }, 5000)
            setPersons(persons.filter(person => person.id !== existingContact.id))
          })

      }
    }
  }

  const deletePerson = (deleteObj) => {
    if (window.confirm(`Delete ${deleteObj.name}?`)) {
          contactServices
          .deletePerson(deleteObj.id)
          .then(()=> setPersons(persons.filter(person=>person.id!==deleteObj.id)))
    }
  }

  const filteredPersons = newFilter === '' ?
      persons :
      persons.filter(p => p.name.toLowerCase().startsWith(newFilter.toLowerCase()))

  return (
      <div>
        <h2>Phonebook</h2>
        <Notification notification={notification} notificationColor={notificationColor}/>
        <Filter newFilter={newFilter} handleNewFilter={handleNewFilter}/>

        <h3>Add a new</h3>
        <PersonForm
            newName={newName} handleNameChange={handleNameChange}
            newNumber={newNumber} handleNumberChange={handleNumberChange}
            addNewName={addNewName}
        />
        <h3>Numbers</h3>
        <Persons filteredPersons={filteredPersons} deletePerson={deletePerson}/>
      </div>
  )
}

export default App