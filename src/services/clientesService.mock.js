import { mockStorage, KEYS } from './mockStorage'

// Simula delay de rede
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms))

export const clientesService = {
  // Listar todos os clientes
  getAll: async () => {
    await delay()
    return mockStorage.getAll(KEYS.CLIENTES)
  },

  // Buscar cliente por ID
  getById: async (id) => {
    await delay()
    const cliente = mockStorage.getById(KEYS.CLIENTES, id)
    if (!cliente) throw new Error('Cliente não encontrado')
    return cliente
  },

  // Criar novo cliente
  create: async (clienteData) => {
    await delay()
    return mockStorage.create(KEYS.CLIENTES, 'clientes', clienteData)
  },

  // Atualizar cliente
  update: async (id, clienteData) => {
    await delay()
    return mockStorage.update(KEYS.CLIENTES, id, clienteData)
  },

  // Deletar cliente
  delete: async (id) => {
    await delay()
    return mockStorage.delete(KEYS.CLIENTES, id)
  },

  // Buscar contratos de um cliente
  getContratos: async (id) => {
    await delay()
    const contratos = mockStorage.filter(KEYS.CONTRATOS, c => Number(c.cliente_id) === Number(id))
    const projetos = mockStorage.getAll(KEYS.PROJETOS)
    
    // Enriquecer com nome do projeto
    return contratos.map(contrato => ({
      ...contrato,
      projeto_nome: projetos.find(p => Number(p.id) === Number(contrato.projeto_id))?.nome_projeto || 'N/A'
    }))
  },
}

export default clientesService

