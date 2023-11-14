import axios from 'axios'

const baseURL = 'api/persons'

export const getAll = () => {
  const request = axios.get(baseURL);
  return request.then(response => response.data)
};

export const create = newObject => {
  const request = axios.post(baseURL, newObject);
  return request.then(response => response.data);
}

export const deleteEntry = id => {
  const request = axios.delete(`${baseURL}/${id}`)
  return request
    .then(response => response)   
}

export const updateEntry = (id, newObject) => {
  const request = axios.put(`${baseURL}/${id}`, newObject)
  return request
    .then(response => response.data)
}

