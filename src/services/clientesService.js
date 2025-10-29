import api from './api'

export const clientesService = {
  // Listar todos os clientes
  getAll: async () => {
    const response = await api.get('/clientes')
    return response.data
  },

  // Buscar cliente por ID
  getById: async (id) => {
    const response = await api.get(`/clientes/${id}`)
    return response.data
  },

  // Criar novo cliente
  create: async (clienteData) => {
    const response = await api.post('/clientes', clienteData)
    return response.data
  },

  // Atualizar cliente
  update: async (id, clienteData) => {
    const response = await api.patch(`/clientes/${id}`, clienteData)
    return response.data
  },

  // Deletar cliente
  delete: async (id) => {
    const response = await api.delete(`/clientes/${id}`)
    return response.data
  },

  // Buscar contratos de um cliente
  getContratos: async (id) => {
    const response = await api.get(`/clientes/${id}/contratos`)
    return response.data
  },
}

export default clientesService

