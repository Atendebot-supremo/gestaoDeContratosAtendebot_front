import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import contratosService from '../../services/contratosService'
import clientesService from '../../services/clientesService'
import projetosService from '../../services/projetosService'

function ContratoForm() {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  
  const [clientes, setClientes] = useState([])
  const [projetos, setProjetos] = useState([])
  const [selectedCliente, setSelectedCliente] = useState(null)

  const [formData, setFormData] = useState({
    cliente_id: '',
    projeto_id: '',
    plano_nome: '',
    valor_mensalidade: '',
    valor_setup: '',
    observacoes_ia: '',
    assinante_nome: '',
    assinante_email: '',
  })

  useEffect(() => {
    loadInitialData()
  }, [])

  useEffect(() => {
    if (formData.cliente_id) {
      loadClienteData(formData.cliente_id)
    }
  }, [formData.cliente_id])

  const loadInitialData = async () => {
    try {
      const [clientesData, projetosData] = await Promise.all([
        clientesService.getAll(),
        projetosService.getAll()
      ])
      setClientes(clientesData)
      setProjetos(projetosData)
    } catch (err) {
      setError('Erro ao carregar dados: ' + err.message)
    }
  }

  const loadClienteData = async (clienteId) => {
    try {
      const cliente = await clientesService.getById(clienteId)
      setSelectedCliente(cliente)
      // Pré-preencher dados do assinante
      setFormData(prev => ({
        ...prev,
        assinante_nome: cliente.assinante_nome || '',
        assinante_email: cliente.assinante_email || '',
      }))
    } catch (err) {
      console.error('Erro ao carregar dados do cliente:', err)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    try {
      setLoading(true)
      await contratosService.create(formData)
      setSuccess('Contrato criado com sucesso! Status: Aguardando Geração')
      setTimeout(() => navigate('/contratos'), 2000)
    } catch (err) {
      setError('Erro ao criar contrato: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">Novo Contrato</h1>
        <Link to="/contratos">
          <button className="btn btn-secondary">Voltar</button>
        </Link>
      </div>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <form onSubmit={handleSubmit} className="form">
        <h3>Informações Básicas</h3>

        <div className="form-group">
          <label>Cliente *</label>
          <select
            name="cliente_id"
            value={formData.cliente_id}
            onChange={handleChange}
            required
          >
            <option value="">Selecione um cliente</option>
            {clientes.map((cliente) => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.razao_social} - {cliente.cnpj}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Projeto *</label>
          <select
            name="projeto_id"
            value={formData.projeto_id}
            onChange={handleChange}
            required
          >
            <option value="">Selecione um projeto</option>
            {projetos.map((projeto) => (
              <option key={projeto.id} value={projeto.id}>
                {projeto.nome_projeto}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Nome do Plano *</label>
          <input
            type="text"
            name="plano_nome"
            value={formData.plano_nome}
            onChange={handleChange}
            placeholder="Ex: Plano Básico, Plano Premium..."
            required
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Valor Mensalidade (R$) *</label>
            <input
              type="number"
              name="valor_mensalidade"
              value={formData.valor_mensalidade}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
            />
          </div>

          <div className="form-group" style={{ flex: 1 }}>
            <label>Valor Setup (R$)</label>
            <input
              type="number"
              name="valor_setup"
              value={formData.valor_setup}
              onChange={handleChange}
              step="0.01"
              min="0"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Observações para IA</label>
          <textarea
            name="observacoes_ia"
            value={formData.observacoes_ia}
            onChange={handleChange}
            placeholder="Instruções ou informações especiais que a IA deve considerar ao gerar o contrato..."
            rows="4"
          />
        </div>

        <h3 style={{ marginTop: '2rem' }}>Dados do Assinante</h3>

        <div className="form-group">
          <label>Nome do Assinante *</label>
          <input
            type="text"
            name="assinante_nome"
            value={formData.assinante_nome}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email do Assinante *</label>
          <input
            type="email"
            name="assinante_email"
            value={formData.assinante_email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-actions">
          <Link to="/contratos">
            <button type="button" className="btn btn-secondary">
              Cancelar
            </button>
          </Link>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Criando...' : 'Criar Contrato'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ContratoForm

