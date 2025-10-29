// Utilitário para gerenciar dados no localStorage
// Simula um banco de dados até a API estar pronta

const STORAGE_KEYS = {
  CLIENTES: 'labfy_clientes',
  PROJETOS: 'labfy_projetos',
  CONTRATOS: 'labfy_contratos',
  NEXT_ID: 'labfy_next_id'
}

// Inicializar dados de exemplo se não existirem
const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.CLIENTES)) {
    localStorage.setItem(STORAGE_KEYS.CLIENTES, JSON.stringify([]))
  }
  if (!localStorage.getItem(STORAGE_KEYS.PROJETOS)) {
    localStorage.setItem(STORAGE_KEYS.PROJETOS, JSON.stringify([]))
  }
  if (!localStorage.getItem(STORAGE_KEYS.CONTRATOS)) {
    localStorage.setItem(STORAGE_KEYS.CONTRATOS, JSON.stringify([]))
  }
  if (!localStorage.getItem(STORAGE_KEYS.NEXT_ID)) {
    localStorage.setItem(STORAGE_KEYS.NEXT_ID, JSON.stringify({
      clientes: 1,
      projetos: 1,
      contratos: 1
    }))
  }
}

// Obter próximo ID
const getNextId = (entity) => {
  const ids = JSON.parse(localStorage.getItem(STORAGE_KEYS.NEXT_ID))
  const nextId = ids[entity]
  ids[entity] = nextId + 1
  localStorage.setItem(STORAGE_KEYS.NEXT_ID, JSON.stringify(ids))
  return nextId
}

// Operações CRUD genéricas
export const mockStorage = {
  // Listar todos
  getAll: (key) => {
    initializeStorage()
    return JSON.parse(localStorage.getItem(key) || '[]')
  },

  // Buscar por ID
  getById: (key, id) => {
    initializeStorage()
    const items = JSON.parse(localStorage.getItem(key) || '[]')
    return items.find(item => item.id === parseInt(id))
  },

  // Criar
  create: (key, entity, data) => {
    initializeStorage()
    const items = JSON.parse(localStorage.getItem(key) || '[]')
    const newItem = {
      id: getNextId(entity),
      created_at: new Date().toISOString(),
      ...data
    }
    items.push(newItem)
    localStorage.setItem(key, JSON.stringify(items))
    return newItem
  },

  // Atualizar
  update: (key, id, data) => {
    initializeStorage()
    const items = JSON.parse(localStorage.getItem(key) || '[]')
    const index = items.findIndex(item => item.id === parseInt(id))
    if (index === -1) throw new Error('Item não encontrado')
    
    items[index] = {
      ...items[index],
      ...data,
      id: items[index].id, // Manter o ID original
      created_at: items[index].created_at // Manter data de criação
    }
    localStorage.setItem(key, JSON.stringify(items))
    return items[index]
  },

  // Deletar
  delete: (key, id) => {
    initializeStorage()
    const items = JSON.parse(localStorage.getItem(key) || '[]')
    const filtered = items.filter(item => item.id !== parseInt(id))
    localStorage.setItem(key, JSON.stringify(filtered))
    return { success: true }
  },

  // Filtrar
  filter: (key, filterFn) => {
    initializeStorage()
    const items = JSON.parse(localStorage.getItem(key) || '[]')
    return items.filter(filterFn)
  }
}

export const KEYS = STORAGE_KEYS

// Função para limpar todos os dados (útil para debug)
export const clearAllData = () => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key)
  })
  initializeStorage()
}

// Função para exportar dados (útil para debug)
export const exportData = () => {
  return {
    clientes: mockStorage.getAll(STORAGE_KEYS.CLIENTES),
    projetos: mockStorage.getAll(STORAGE_KEYS.PROJETOS),
    contratos: mockStorage.getAll(STORAGE_KEYS.CONTRATOS)
  }
}

// Inicializar ao importar
initializeStorage()

