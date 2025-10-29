import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import clientesService from '../../services/clientesService.mock'

function Clientes() {
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadClientes()
  }, [])

  const loadClientes = async () => {
    try {
      setLoading(true)
      const data = await clientesService.getAll()
      setClientes(data)
      setError(null)
    } catch (err) {
      setError('Erro ao carregar clientes: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const filteredClientes = clientes.filter(cliente =>
    cliente.razao_social?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.cnpj?.includes(searchTerm) ||
    cliente.assinante_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.financeiro_email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return <div className="loading">Carregando clientes...</div>
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">Clientes</h1>
        <Link to="/clientes/novo">
          <button className="btn btn-primary">+ Novo Cliente</button>
        </Link>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="form-group">
        <input
          type="text"
          placeholder="Buscar por razão social, CNPJ ou email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Razão Social</th>
            <th>CNPJ</th>
            <th>Cidade/Estado</th>
            <th>Email Assinante</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredClientes.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>
                Nenhum cliente encontrado
              </td>
            </tr>
          ) : (
            filteredClientes.map((cliente) => (
              <tr key={cliente.id}>
                <td>{cliente.razao_social}</td>
                <td>{cliente.cnpj}</td>
                <td>{cliente.cidade_estado || '-'}</td>
                <td>{cliente.assinante_email || cliente.financeiro_email || '-'}</td>
                <td>
                  <Link to={`/clientes/${cliente.id}`}>
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

export default Clientes

