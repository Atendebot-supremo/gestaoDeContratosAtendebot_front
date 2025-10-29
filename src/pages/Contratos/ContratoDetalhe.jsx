import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import contratosService from '../../services/contratosService'
import clientesService from '../../services/clientesService'
import projetosService from '../../services/projetosService'
import './Contratos.css'

function ContratoDetalhe() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [contrato, setContrato] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)

  const [clientes, setClientes] = useState([])
  const [projetos, setProjetos] = useState([])
  const [isEditing, setIsEditing] = useState(false)

  const [formData, setFormData] = useState({})

  useEffect(() => {
    loadContrato()
    loadSelectData()
  }, [id])

  const loadContrato = async () => {
    try {
      setLoading(true)
      const data = await contratosService.getById(id)
      setContrato(data)
      setFormData(data)
    } catch (err) {
      setError('Erro ao carregar contrato: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const loadSelectData = async () => {
    try {
      const [clientesData, projetosData] = await Promise.all([
        clientesService.getAll(),
        projetosService.getAll()
      ])
      setClientes(clientesData)
      setProjetos(projetosData)
    } catch (err) {
      console.error('Erro ao carregar dados:', err)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    try {
      setActionLoading(true)
      await contratosService.update(id, formData)
      setSuccess('Contrato atualizado com sucesso!')
      setIsEditing(false)
      await loadContrato()
    } catch (err) {
      setError('Erro ao atualizar contrato: ' + err.message)
    } finally {
      setActionLoading(false)
    }
  }

  const handleAction = async (action, actionName) => {
    if (!window.confirm(`Confirma a ação: ${actionName}?`)) {
      return
    }

    setError(null)
    setSuccess(null)
    setActionLoading(true)

    try {
      await action(id)
      setSuccess(`${actionName} executado com sucesso!`)
      await loadContrato()
    } catch (err) {
      setError(`Erro ao executar ${actionName}: ${err.message}`)
    } finally {
      setActionLoading(false)
    }
  }

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      'Aguardando Geração': 'status-badge status-pending',
      'Aguardando Revisão': 'status-badge status-review',
      'Enviado': 'status-badge status-sent',
      'Ativo': 'status-badge status-active',
      'Cancelado': 'status-badge status-cancelled',
    }
    return statusMap[status] || 'status-badge'
  }

  if (loading) {
    return <div className="loading">Carregando contrato...</div>
  }

  if (!contrato) {
    return <div className="error">Contrato não encontrado</div>
  }

  const canEdit = contrato.status === 'Aguardando Geração'
  const showGerarButton = contrato.status === 'Aguardando Geração'
  const showRevisaoButtons = contrato.status === 'Aguardando Revisão'
  const showActiveButtons = ['Enviado', 'Ativo'].includes(contrato.status)

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">Detalhes do Contrato</h1>
        <Link to="/contratos">
          <button className="btn btn-secondary">Voltar</button>
        </Link>
      </div>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <div className="contrato-details">
        {/* Status e Ações */}
        <div className="contrato-section">
          <h2>Status e Ações</h2>
          <div className="contrato-info">
            <div className="info-item">
              <label>Status do Contrato:</label>
              <div className="value">
                <span className={getStatusBadgeClass(contrato.status)}>
                  {contrato.status}
                </span>
              </div>
            </div>
            {contrato.asaas_subscription_id && (
              <div className="info-item">
                <label>Status de Pagamento:</label>
                <div className="value">
                  <span className="status-badge status-active">
                    Cobrança Ativa
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="action-buttons" style={{ marginTop: '1rem' }}>
            {showGerarButton && (
              <button
                className="btn btn-primary"
                onClick={() => handleAction(contratosService.gerarContrato, 'Gerar Contrato')}
                disabled={actionLoading}
              >
                📄 Gerar Contrato
              </button>
            )}

            {showRevisaoButtons && (
              <>
                <button
                  className="btn btn-primary"
                  onClick={() => handleAction(contratosService.enviarAssinatura, 'Enviar para Assinatura')}
                  disabled={actionLoading}
                >
                  ✉️ Enviar para Assinatura
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => handleAction(contratosService.gerarContrato, 'Regerar Contrato')}
                  disabled={actionLoading}
                >
                  🔄 Regerar Contrato
                </button>
              </>
            )}

            {showActiveButtons && (
              <>
                <button
                  className="btn btn-primary"
                  onClick={() => handleAction(contratosService.enviarCobranca, 'Enviar Cobrança')}
                  disabled={actionLoading}
                >
                  💰 Enviar Cobrança
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleAction(contratosService.cancelarContrato, 'Cancelar Contrato')}
                  disabled={actionLoading}
                >
                  ❌ Cancelar Contrato
                </button>
              </>
            )}
          </div>
        </div>

        {/* Documentos */}
        {contrato.url_contrato_gerado && (
          <div className="contrato-section">
            <h2>Documentos</h2>
            <a
              href={contrato.url_contrato_gerado}
              target="_blank"
              rel="noopener noreferrer"
              className="document-link"
            >
              📄 Ver Contrato Gerado
            </a>
            {contrato.clicksign_document_key && (
              <div style={{ marginTop: '0.5rem' }}>
                <small style={{ color: '#666' }}>
                  Documento ClickSign: {contrato.clicksign_document_key}
                </small>
              </div>
            )}
          </div>
        )}

        {/* Dados do Contrato */}
        <div className="contrato-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Dados do Contrato</h2>
            {canEdit && !isEditing && (
              <button
                className="btn btn-secondary"
                onClick={() => setIsEditing(true)}
              >
                ✏️ Editar
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label>Cliente *</label>
                <select
                  name="cliente_id"
                  value={formData.cliente_id}
                  onChange={handleChange}
                  required
                >
                  {clientes.map((cliente) => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.razao_social}
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
                    required
                  />
                </div>

                <div className="form-group" style={{ flex: 1 }}>
                  <label>Valor Setup (R$)</label>
                  <input
                    type="number"
                    name="valor_setup"
                    value={formData.valor_setup || ''}
                    onChange={handleChange}
                    step="0.01"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Observações para IA</label>
                <textarea
                  name="observacoes_ia"
                  value={formData.observacoes_ia || ''}
                  onChange={handleChange}
                  rows="4"
                />
              </div>

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
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setIsEditing(false)
                    setFormData(contrato)
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          ) : (
            <div className="contrato-info">
              <div className="info-item">
                <label>Cliente:</label>
                <div className="value">{contrato.cliente_nome || 'N/A'}</div>
              </div>

              <div className="info-item">
                <label>Projeto:</label>
                <div className="value">{contrato.projeto_nome || 'N/A'}</div>
              </div>

              <div className="info-item">
                <label>Plano:</label>
                <div className="value">{contrato.plano_nome}</div>
              </div>

              <div className="info-item">
                <label>Valor Mensalidade:</label>
                <div className="value">R$ {parseFloat(contrato.valor_mensalidade).toFixed(2)}</div>
              </div>

              {contrato.valor_setup && (
                <div className="info-item">
                  <label>Valor Setup:</label>
                  <div className="value">R$ {parseFloat(contrato.valor_setup).toFixed(2)}</div>
                </div>
              )}

              <div className="info-item">
                <label>Assinante:</label>
                <div className="value">{contrato.assinante_nome}</div>
              </div>

              <div className="info-item">
                <label>Email Assinante:</label>
                <div className="value">{contrato.assinante_email}</div>
              </div>

              {contrato.observacoes_ia && (
                <div className="info-item" style={{ gridColumn: '1 / -1' }}>
                  <label>Observações para IA:</label>
                  <div className="value">{contrato.observacoes_ia}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ContratoDetalhe

