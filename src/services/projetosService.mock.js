import { mockStorage, KEYS } from './mockStorage'

// Simula delay de rede
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms))

export const projetosService = {
  // Listar todos os projetos
  getAll: async () => {
    await delay()
    return mockStorage.getAll(KEYS.PROJETOS)
  },

  // Buscar projeto por ID
  getById: async (id) => {
    await delay()
    const projeto = mockStorage.getById(KEYS.PROJETOS, id)
    if (!projeto) throw new Error('Projeto não encontrado')
    return projeto
  },

  // Criar novo projeto (com upload de PDF simulado)
  create: async (projetoData) => {
    await delay(500) // Delay maior para simular upload
    
    // Simular processamento do arquivo
    let template_pdf_path = null
    let template_html = null
    
    if (projetoData.template_pdf) {
      // Simular URL do arquivo
      template_pdf_path = `mock://storage/projetos/${Date.now()}_${projetoData.template_pdf.name}`
      // Simular conversão para HTML
      template_html = `<html><body><h1>Contrato - ${projetoData.nome_projeto}</h1><p>${projetoData.descricao}</p><p>[Conteúdo do PDF convertido...]</p></body></html>`
    }

    const data = {
      nome_projeto: projetoData.nome_projeto,
      descricao: projetoData.descricao,
      template_pdf_path,
      template_html
    }

    return mockStorage.create(KEYS.PROJETOS, 'projetos', data)
  },

  // Atualizar projeto
  update: async (id, projetoData) => {
    await delay(500)
    
    const currentProjeto = mockStorage.getById(KEYS.PROJETOS, id)
    
    let template_pdf_path = currentProjeto.template_pdf_path
    let template_html = currentProjeto.template_html
    
    // Se tem novo arquivo, atualizar
    if (projetoData.template_pdf) {
      template_pdf_path = `mock://storage/projetos/${Date.now()}_${projetoData.template_pdf.name}`
      template_html = `<html><body><h1>Contrato - ${projetoData.nome_projeto}</h1><p>${projetoData.descricao}</p><p>[Conteúdo do PDF convertido...]</p></body></html>`
    }

    const data = {
      nome_projeto: projetoData.nome_projeto,
      descricao: projetoData.descricao,
      template_pdf_path,
      template_html
    }

    return mockStorage.update(KEYS.PROJETOS, id, data)
  },

  // Deletar projeto
  delete: async (id) => {
    await delay()
    return mockStorage.delete(KEYS.PROJETOS, id)
  },
}

export default projetosService

