import { useState } from 'react'
import { clearAllData, exportData } from '../services/mockStorage'
import './DevTools.css'

function DevTools() {
  const [isOpen, setIsOpen] = useState(false)
  const [data, setData] = useState(null)

  const handleClearData = () => {
    if (window.confirm('Tem certeza que deseja limpar TODOS os dados do localStorage?')) {
      clearAllData()
      alert('Dados limpos! A página será recarregada.')
      window.location.reload()
    }
  }

  const handleExportData = () => {
    const exported = exportData()
    setData(JSON.stringify(exported, null, 2))
  }

  const handleCopyData = () => {
    navigator.clipboard.writeText(data)
    alert('Dados copiados para a área de transferência!')
  }

  if (!isOpen) {
    return (
      <button className="devtools-toggle" onClick={() => setIsOpen(true)}>
        🛠️ Dev Tools
      </button>
    )
  }

  return (
    <div className="devtools-panel">
      <div className="devtools-header">
        <h3>🛠️ Developer Tools (Mock Data)</h3>
        <button onClick={() => setIsOpen(false)}>✕</button>
      </div>
      
      <div className="devtools-content">
        <p className="devtools-info">
          ⚠️ Modo Mock Ativo - Os dados estão sendo salvos no localStorage do navegador
        </p>

        <div className="devtools-actions">
          <button onClick={handleExportData} className="btn btn-secondary">
            📊 Ver Dados
          </button>
          <button onClick={handleClearData} className="btn btn-danger">
            🗑️ Limpar Todos os Dados
          </button>
        </div>

        {data && (
          <div className="devtools-data">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <strong>Dados Armazenados:</strong>
              <button onClick={handleCopyData} className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}>
                📋 Copiar
              </button>
            </div>
            <pre>{data}</pre>
          </div>
        )}

        <div className="devtools-instructions">
          <strong>Instruções:</strong>
          <ul>
            <li>Os dados são salvos automaticamente no localStorage</li>
            <li>Use "Ver Dados" para visualizar o que está armazenado</li>
            <li>Use "Limpar Dados" para resetar tudo</li>
            <li>Quando a API estiver pronta, mude os imports de <code>.mock.js</code> para <code>.js</code></li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default DevTools

