import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import projetosService from '../../services/projetosService'

function ProjetoForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [pdfFile, setPdfFile] = useState(null)

  const [formData, setFormData] = useState({
    nome_projeto: '',
    descricao: '',
  })

  useEffect(() => {
    if (isEdit) {
      loadProjeto()
    }
  }, [id])

  const loadProjeto = async () => {
    try {
      setLoading(true)
      const data = await projetosService.getById(id)
      setFormData({
        nome_projeto: data.nome_projeto,
        descricao: data.descricao,
      })
    } catch (err) {
      setError('Erro ao carregar projeto: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file && file.type === 'application/pdf') {
      setPdfFile(file)
    } else {
      setError('Por favor, selecione um arquivo PDF válido')
      e.target.value = null
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!isEdit && !pdfFile) {
      setError('Por favor, selecione um arquivo PDF para o modelo')
      return
    }

    try {
      setLoading(true)
      const dataToSend = {
        ...formData,
        template_pdf: pdfFile
      }

      if (isEdit) {
        await projetosService.update(id, dataToSend)
        setSuccess('Projeto atualizado com sucesso!')
      } else {
        await projetosService.create(dataToSend)
        setSuccess('Projeto criado com sucesso!')
        setTimeout(() => navigate('/projetos'), 2000)
      }
    } catch (err) {
      setError('Erro ao salvar projeto: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading && isEdit && !formData.nome_projeto) {
    return <div className="loading">Carregando projeto...</div>
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">
          {isEdit ? 'Editar Projeto' : 'Novo Projeto'}
        </h1>
        <Link to="/projetos">
          <button className="btn btn-secondary">Voltar</button>
        </Link>
      </div>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Nome do Projeto *</label>
          <input
            type="text"
            name="nome_projeto"
            value={formData.nome_projeto}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Descrição *</label>
          <textarea
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            required
            rows="4"
          />
        </div>

        <div className="form-group">
          <label>Modelo PDF {!isEdit && '*'}</label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            required={!isEdit}
          />
          <small style={{ color: '#666', marginTop: '0.5rem', display: 'block' }}>
            {isEdit 
              ? 'Selecione um arquivo apenas se desejar atualizar o modelo existente'
              : 'O PDF será convertido para HTML e usado como template do contrato'}
          </small>
        </div>

        <div className="form-actions">
          <Link to="/projetos">
            <button type="button" className="btn btn-secondary">
              Cancelar
            </button>
          </Link>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar Projeto'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProjetoForm

