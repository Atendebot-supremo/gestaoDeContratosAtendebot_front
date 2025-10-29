import api from './api'

export const contratosService = {
  // Listar todos os contratos (com filtros opcionais)
  getAll: async (filters = {}) => {
    const params = new URLSearchParams()
    if (filters.status) params.append('status', filters.status)
    if (filters.cliente_id) params.append('cliente_id', filters.cliente_id)
    if (filters.projeto_id) params.append('projeto_id', filters.projeto_id)

    const response = await api.get(`/contratos?${params.toString()}`)
    return response.data
  },

  // Buscar contrato por ID
  getById: async (id) => {
    const response = await api.get(`/contratos/${id}`)
    return response.data
  },

  // Criar novo contrato
  create: async (contratoData) => {
    const response = await api.post('/contratos', contratoData)
    return response.data
  },

  // Atualizar contrato
  update: async (id, contratoData) => {
    const response = await api.patch(`/contratos/${id}`, contratoData)
    return response.data
  },

  // Deletar contrato
  delete: async (id) => {
    const response = await api.delete(`/contratos/${id}`)
    return response.data
  },

  // Ações do N8N
  gerarContrato: async (id) => {
    const response = await api.post(`/contratos/${id}/gerar`)
    return response.data
  },

  enviarAssinatura: async (id) => {
    const response = await api.post(`/contratos/${id}/enviar-assinatura`)
    return response.data
  },

  enviarCobranca: async (id) => {
    const response = await api.post(`/contratos/${id}/enviar-cobranca`)
    return response.data
  },

  cancelarContrato: async (id) => {
    const response = await api.post(`/contratos/${id}/cancelar`)
    return response.data
  },
}

export default contratosService

