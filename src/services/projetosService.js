import api from './api'

export const projetosService = {
  // Listar todos os projetos
  getAll: async () => {
    const response = await api.get('/projetos')
    return response.data
  },

  // Buscar projeto por ID
  getById: async (id) => {
    const response = await api.get(`/projetos/${id}`)
    return response.data
  },

  // Criar novo projeto (com upload de PDF)
  create: async (projetoData) => {
    const formData = new FormData()
    formData.append('nome_projeto', projetoData.nome_projeto)
    formData.append('descricao', projetoData.descricao)
    if (projetoData.template_pdf) {
      formData.append('template_pdf', projetoData.template_pdf)
    }

    const response = await api.post('/projetos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  // Atualizar projeto
  update: async (id, projetoData) => {
    const formData = new FormData()
    formData.append('nome_projeto', projetoData.nome_projeto)
    formData.append('descricao', projetoData.descricao)
    if (projetoData.template_pdf) {
      formData.append('template_pdf', projetoData.template_pdf)
    }

    const response = await api.patch(`/projetos/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  // Deletar projeto
  delete: async (id) => {
    const response = await api.delete(`/projetos/${id}`)
    return response.data
  },
}

export default projetosService

