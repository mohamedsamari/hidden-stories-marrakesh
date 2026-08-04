import { useKindeAuth } from '@kinde-oss/kinde-auth-react'
import type { PropsWithChildren } from 'react'
import { NavLink } from 'react-router-dom'

export function Layout({ children }: PropsWithChildren) {
  const { user, logout } = useKindeAuth()

  return (
    <div>
      <header className="app-header">
        <h1>Hidden Stories of Marrakesh</h1>
        <div className="user-info">
          <span>{user?.email}</span>
          <button onClick={() => logout()}>Se déconnecter</button>
        </div>
      </header>
      <nav className="app-nav">
        <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
          Histoires
        </NavLink>
        <NavLink to="/locations" className={({ isActive }) => (isActive ? 'active' : '')}>
          Lieux
        </NavLink>
        <NavLink to="/categories" className={({ isActive }) => (isActive ? 'active' : '')}>
          Catégories
        </NavLink>
        <NavLink to="/dynasties" className={({ isActive }) => (isActive ? 'active' : '')}>
          Dynasties
        </NavLink>
        <NavLink to="/historical-periods" className={({ isActive }) => (isActive ? 'active' : '')}>
          Périodes historiques
        </NavLink>
      </nav>
      <main>{children}</main>
    </div>
  )
}
