import { mockStorage, KEYS } from './mockStorage'

// Simula delay de rede
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms))

export const contratosService = {
  // Listar todos os contratos (com filtros opcionais)
  getAll: async (filters = {}) => {
    await delay()
    let contratos = mockStorage.getAll(KEYS.CONTRATOS)
    
    // Aplicar filtros
    if (filters.status) {
      contratos = contratos.filter(c => c.status === filters.status)
    }
    if (filters.cliente_id) {
      contratos = contratos.filter(c => Number(c.cliente_id) === Number(filters.cliente_id))
    }
    if (filters.projeto_id) {
      contratos = contratos.filter(c => Number(c.projeto_id) === Number(filters.projeto_id))
    }

    // Enriquecer com dados de cliente e projeto
    const clientes = mockStorage.getAll(KEYS.CLIENTES)
    const projetos = mockStorage.getAll(KEYS.PROJETOS)

    return contratos.map(contrato => ({
      ...contrato,
      cliente_nome: clientes.find(c => Number(c.id) === Number(contrato.cliente_id))?.razao_social || 'N/A',
      projeto_nome: projetos.find(p => Number(p.id) === Number(contrato.projeto_id))?.nome_projeto || 'N/A'
    }))
  },

  // Buscar contrato por ID
  getById: async (id) => {
    await delay()
    const contrato = mockStorage.getById(KEYS.CONTRATOS, id)
    if (!contrato) throw new Error('Contrato não encontrado')

    // Enriquecer com dados de cliente e projeto
    const clientes = mockStorage.getAll(KEYS.CLIENTES)
    const projetos = mockStorage.getAll(KEYS.PROJETOS)

    return {
      ...contrato,
      cliente_nome: clientes.find(c => Number(c.id) === Number(contrato.cliente_id))?.razao_social || 'N/A',
      projeto_nome: projetos.find(p => Number(p.id) === Number(contrato.projeto_id))?.nome_projeto || 'N/A'
    }
  },

  // Criar novo contrato
  create: async (contratoData) => {
    await delay()
    const data = {
      ...contratoData,
      cliente_id: parseInt(contratoData.cliente_id),
      projeto_id: parseInt(contratoData.projeto_id),
      status: 'Aguardando Geração',
      url_contrato_gerado: null,
      clicksign_document_key: null,
      asaas_subscription_id: null,
      asaas_setup_payment_id: null
    }
    return mockStorage.create(KEYS.CONTRATOS, 'contratos', data)
  },

  // Atualizar contrato
  update: async (id, contratoData) => {
    await delay()
    const data = {
      ...contratoData,
      // Garantir que IDs sejam números se forem fornecidos
      ...(contratoData.cliente_id && { cliente_id: parseInt(contratoData.cliente_id) }),
      ...(contratoData.projeto_id && { projeto_id: parseInt(contratoData.projeto_id) })
    }
    return mockStorage.update(KEYS.CONTRATOS, id, data)
  },

  // Deletar contrato
  delete: async (id) => {
    await delay()
    return mockStorage.delete(KEYS.CONTRATOS, id)
  },

  // Ações do N8N (simuladas)
  gerarContrato: async (id) => {
    await delay(1000) // Simula processamento
    const mockUrl = `mock://storage/contratos/contrato_${id}_${Date.now()}.pdf`
    return mockStorage.update(KEYS.CONTRATOS, id, {
      status: 'Aguardando Revisão',
      url_contrato_gerado: mockUrl
    })
  },

  enviarAssinatura: async (id) => {
    await delay(1000)
    const mockClickSignKey = `MOCK_CLICKSIGN_${Date.now()}`
    return mockStorage.update(KEYS.CONTRATOS, id, {
      status: 'Enviado',
      clicksign_document_key: mockClickSignKey
    })
  },

  enviarCobranca: async (id) => {
    await delay(1000)
    const mockSubscriptionId = `MOCK_ASAAS_SUB_${Date.now()}`
    const mockSetupId = `MOCK_ASAAS_SETUP_${Date.now()}`
    return mockStorage.update(KEYS.CONTRATOS, id, {
      status: 'Ativo',
      asaas_subscription_id: mockSubscriptionId,
      asaas_setup_payment_id: mockSetupId
    })
  },

  cancelarContrato: async (id) => {
    await delay(800)
    return mockStorage.update(KEYS.CONTRATOS, id, {
      status: 'Cancelado'
    })
  },
}

export default contratosService

