import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Clientes from './pages/Clientes'
import ClienteForm from './pages/Clientes/ClienteForm'
import Projetos from './pages/Projetos'
import ProjetoForm from './pages/Projetos/ProjetoForm'
import Contratos from './pages/Contratos'
import ContratoForm from './pages/Contratos/ContratoForm'
import ContratoDetalhe from './pages/Contratos/ContratoDetalhe'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/contratos" replace />} />
          
          {/* Rotas de Clientes */}
          <Route path="clientes" element={<Clientes />} />
          <Route path="clientes/novo" element={<ClienteForm />} />
          <Route path="clientes/:id" element={<ClienteForm />} />
          
          {/* Rotas de Projetos */}
          <Route path="projetos" element={<Projetos />} />
          <Route path="projetos/novo" element={<ProjetoForm />} />
          <Route path="projetos/:id" element={<ProjetoForm />} />
          
          {/* Rotas de Contratos */}
          <Route path="contratos" element={<Contratos />} />
          <Route path="contratos/novo" element={<ContratoForm />} />
          <Route path="contratos/:id" element={<ContratoDetalhe />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App

