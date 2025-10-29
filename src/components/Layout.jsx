import { Outlet, NavLink } from 'react-router-dom'
import DevTools from './DevTools'
import './Layout.css'

function Layout() {
  return (
    <div className="layout">
      <nav className="sidebar">
        <div className="logo">
          <h2>Gestão de Contratos</h2>
          <p>Atendebot</p>
        </div>
        <ul className="nav-menu">
          <li>
            <NavLink to="/contratos" className={({ isActive }) => isActive ? 'active' : ''}>
              📄 Contratos
            </NavLink>
          </li>
          <li>
            <NavLink to="/clientes" className={({ isActive }) => isActive ? 'active' : ''}>
              👥 Clientes
            </NavLink>
          </li>
          <li>
            <NavLink to="/projetos" className={({ isActive }) => isActive ? 'active' : ''}>
              📋 Projetos
            </NavLink>
          </li>
        </ul>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
      <DevTools />
    </div>
  )
}

export default Layout

