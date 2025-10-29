import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import contratosService from '../../services/contratosService.mock'
import projetosService from '../../services/projetosService.mock'
import './Contratos.css'

function Contratos() {
  const [contratos, setContratos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statusFilter, setStatusFilter] = useState('')
  const [projetoFilter, setProjetoFilter] = useState('')
  const [projetos, setProjetos] = useState([])

  useEffect(() => {
    loadContratos()
    loadProjetos()
  }, [statusFilter, projetoFilter])

  const loadContratos = async () => {
    try {
      setLoading(true)
      const filters = {}
      if (statusFilter) filters.status = statusFilter
      if (projetoFilter) filters.projeto_id = projetoFilter
      
      const data = await contratosService.getAll(filters)
      setContratos(data)
      setError(null)
    } catch (err) {
      setError('Erro ao carregar contratos: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const loadProjetos = async () => {
    try {
      const data = await projetosService.getAll()
      setProjetos(data)
    } catch (err) {
      console.error('Erro ao carregar projetos:', err)
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
    return <div className="loading">Carregando contratos...</div>
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">Contratos</h1>
        <Link to="/contratos/novo">
          <button className="btn btn-primary">+ Novo Contrato</button>
        </Link>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="filters">
        <div className="form-group">
          <label>Filtrar por Status:</label>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="Aguardando Geração">Aguardando Geração</option>
            <option value="Aguardando Revisão">Aguardando Revisão</option>
            <option value="Enviado">Enviado</option>
            <option value="Ativo">Ativo</option>
            <option value="Cancelado">Cancelado</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Filtrar por Projeto:</label>
          <select 
            value={projetoFilter} 
            onChange={(e) => setProjetoFilter(e.target.value)}
          >
            <option value="">Todos</option>
            {projetos.map((projeto) => (
              <option key={projeto.id} value={projeto.id}>
                {projeto.nome_projeto}
              </option>
            ))}
          </select>
        </div>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Projeto</th>
            <th>Plano</th>
            <th>Valor Mensalidade</th>
            <th>Status</th>
            <th>Status Pagamento</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {contratos.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center' }}>
                Nenhum contrato encontrado
              </td>
            </tr>
          ) : (
            contratos.map((contrato) => (
              <tr key={contrato.id}>
                <td>{contrato.cliente_nome || 'N/A'}</td>
                <td>{contrato.projeto_nome || 'N/A'}</td>
                <td>{contrato.plano_nome}</td>
                <td>R$ {parseFloat(contrato.valor_mensalidade).toFixed(2)}</td>
                <td>
                  <span className={getStatusBadgeClass(contrato.status)}>
                    {contrato.status}
                  </span>
                </td>
                <td>
                  {contrato.asaas_subscription_id ? (
                    <span className="status-badge status-active">Ativo</span>
                  ) : (
                    <span className="status-badge">Sem cobrança</span>
                  )}
                </td>
                <td>
                  <Link to={`/contratos/${contrato.id}`}>
                    <button className="btn btn-secondary">Gerenciar</button>
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Contratos

