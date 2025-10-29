import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import projetosService from '../../services/projetosService.mock'
import './Projetos.css'

function Projetos() {
  const [projetos, setProjetos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadProjetos()
  }, [])

  const loadProjetos = async () => {
    try {
      setLoading(true)
      const data = await projetosService.getAll()
      setProjetos(data)
      setError(null)
    } catch (err) {
      setError('Erro ao carregar projetos: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">Carregando projetos...</div>
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">Projetos</h1>
        <Link to="/projetos/novo">
          <button className="btn btn-primary">+ Novo Projeto</button>
        </Link>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="projetos-grid">
        {projetos.length === 0 ? (
          <p>Nenhum projeto cadastrado ainda.</p>
        ) : (
          projetos.map((projeto) => (
            <div key={projeto.id} className="projeto-card">
              <div className="projeto-card-header">
                <h3>{projeto.nome_projeto}</h3>
              </div>
              <div className="projeto-card-body">
                <p>{projeto.descricao}</p>
                {projeto.template_pdf_path && (
                  <div className="projeto-file">
                    📄 Modelo PDF anexado
                  </div>
                )}
              </div>
              <div className="projeto-card-footer">
                {projeto.template_pdf_path && (
                  <a
                    href={projeto.template_pdf_path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                    style={{ marginRight: '0.5rem' }}
                  >
                    📄 Ver PDF
                  </a>
                )}
                <Link to={`/projetos/${projeto.id}`}>
                  <button className="btn btn-primary">Editar</button>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Projetos

