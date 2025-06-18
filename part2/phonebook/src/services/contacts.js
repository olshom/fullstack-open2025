import axios from 'axios';

const baseUrl = 'http://localhost:3001/api/persons'

const getAll = () => {
  return axios.get(baseUrl).then(res=>res.data)
}

const create = (personObj) => {
  return axios.post(baseUrl, personObj).then(res=>res.data)
}

const deletePerson = (id) => {
  return axios.delete(`${baseUrl}/${id}`).then(res=>res.data)
}

const updateNumber = (id, newObj) => {
  return axios.put(`${baseUrl}/${id}`, newObj).then(res=>res.data)
}
export default {getAll, create, deletePerson, updateNumber}