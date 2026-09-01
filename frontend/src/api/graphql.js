import axios from 'axios'

const API_URL = import.meta.env.VITE_GRAPHQL_ENDPOINT || 'http://localhost:5000/graphql'

export const graphqlClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const setAuthToken = (token) => {
  if (token) {
    graphqlClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete graphqlClient.defaults.headers.common['Authorization']
  }
}

export const executeQuery = async (query, variables = {}) => {
  try {
    const response = await graphqlClient.post('', {
      query,
      variables,
    })
    
    if (response.data.errors) {
      throw new Error(response.data.errors[0].message)
    }
    
    return response.data.data
  } catch (error) {
    throw error
  }
}
