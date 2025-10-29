import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import clientesService from '../../services/clientesService.mock'
import { formatCNPJ, cleanCNPJ } from '../../utils/masks'

function ClienteForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [contratos, setContratos] = useState([])
  const [activeTab, setActiveTab] = useState('dados')

  const [formData, setFormData] = useState({
    razao_social: '',
    cnpj: '',
    endereco_completo: '',
    cidade_estado: '',
    asaas_customer_id: '',
    // Contato Assinante
    assinante_nome: '',
    assinante_email: '',
    // Contato Financeiro
    financeiro_nome: '',
    financeiro_email: '',
    financeiro_telefone: '',
  })

  useEffect(() => {
    if (isEdit) {
      loadCliente()
      loadContratos()
    }
  }, [id])

  const loadCliente = async () => {
    try {
      setLoading(true)
      const data = await clientesService.getById(id)
      setFormData(data)
    } catch (err) {
      setError('Erro ao carregar cliente: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const loadContratos = async () => {
    try {
      const data = await clientesService.getContratos(id)
      setContratos(data)
    } catch (err) {
      console.error('Erro ao carregar contratos:', err)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    
    if (name === 'cnpj') {
      // Aplicar máscara de CNPJ
      const formattedValue = formatCNPJ(value)
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    try {
      setLoading(true)
      
      // Limpar CNPJ antes de enviar
      const dataToSend = {
        ...formData,
        cnpj: cleanCNPJ(formData.cnpj)
      }
      
      if (isEdit) {
        await clientesService.update(id, dataToSend)
        setSuccess('Cliente atualizado com sucesso!')
      } else {
        await clientesService.create(dataToSend)
        setSuccess('Cliente criado com sucesso!')
        setTimeout(() => navigate('/clientes'), 2000)
      }
    } catch (err) {
      setError('Erro ao salvar cliente: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading && isEdit && !formData.razao_social) {
    return <div className="loading">Carregando cliente...</div>
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">
          {isEdit ? 'Editar Cliente' : 'Novo Cliente'}
        </h1>
        <Link to="/clientes">
          <button className="btn btn-secondary">Voltar</button>
        </Link>
      </div>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      {isEdit && (
        <div className="tabs" style={{ marginBottom: '1rem' }}>
          <button
            className={`btn ${activeTab === 'dados' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('dados')}
          >
            Dados do Cliente
          </button>
          <button
            className={`btn ${activeTab === 'contratos' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('contratos')}
            style={{ marginLeft: '0.5rem' }}
          >
            Contratos ({contratos.length})
          </button>
        </div>
      )}

      {activeTab === 'dados' ? (
        <form onSubmit={handleSubmit} className="form">
          <h3>Dados da Empresa</h3>
          
          <div className="form-group">
            <label>Razão Social *</label>
            <input
              type="text"
              name="razao_social"
              value={formData.razao_social}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>CNPJ *</label>
            <input
              type="text"
              name="cnpj"
              value={formData.cnpj}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Endereço Completo</label>
            <input
              type="text"
              name="endereco_completo"
              value={formData.endereco_completo}
              onChange={handleChange}
              placeholder="Rua, número, complemento, bairro"
            />
          </div>

          <div className="form-group">
            <label>Cidade/Estado</label>
            <input
              type="text"
              name="cidade_estado"
              value={formData.cidade_estado}
              onChange={handleChange}
              placeholder="Ex: São Paulo - SP"
            />
          </div>

          <div className="form-group">
            <label>ID Cliente Asaas</label>
            <input
              type="text"
              name="asaas_customer_id"
              value={formData.asaas_customer_id}
              onChange={handleChange}
              placeholder="Gerado automaticamente pelo sistema"
              disabled
            />
            <small style={{ color: '#666', marginTop: '0.5rem', display: 'block' }}>
              Este campo é preenchido automaticamente ao criar cobrança no Asaas
            </small>
          </div>

          <h3 style={{ marginTop: '2rem' }}>Contato - Assinante</h3>

          <div className="form-group">
            <label>Nome do Assinante</label>
            <input
              type="text"
              name="assinante_nome"
              value={formData.assinante_nome}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Email do Assinante</label>
            <input
              type="email"
              name="assinante_email"
              value={formData.assinante_email}
              onChange={handleChange}
            />
          </div>

          <h3 style={{ marginTop: '2rem' }}>Contato - Financeiro</h3>

          <div className="form-group">
            <label>Nome (Financeiro)</label>
            <input
              type="text"
              name="financeiro_nome"
              value={formData.financeiro_nome}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Email (Financeiro)</label>
            <input
              type="email"
              name="financeiro_email"
              value={formData.financeiro_email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Telefone (Financeiro)</label>
            <input
              type="tel"
              name="financeiro_telefone"
              value={formData.financeiro_telefone}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <Link to="/clientes">
              <button type="button" className="btn btn-secondary">
                Cancelar
              </button>
            </Link>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar Cliente'}
            </button>
          </div>
        </form>
      ) : (
        <div className="contratos-list">
          <h3>Contratos do Cliente</h3>
          {contratos.length === 0 ? (
            <p>Nenhum contrato encontrado para este cliente.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Projeto</th>
                  <th>Plano</th>
                  <th>Valor</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {contratos.map((contrato) => (
                  <tr key={contrato.id}>
                    <td>{contrato.projeto_nome}</td>
                    <td>{contrato.plano_nome}</td>
                    <td>R$ {contrato.valor_mensalidade}</td>
                    <td>{contrato.status}</td>
                    <td>
                      <Link to={`/contratos/${contrato.id}`}>
                        <button className="btn btn-secondary">Ver</button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}

export default ClienteForm

