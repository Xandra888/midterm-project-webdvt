import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Home', icon: 'home', end: true },
  { to: '/', label: 'Expenses', icon: 'wallet' },
  { to: '/add', label: 'Trips', icon: 'plane' },
  { to: '/summary', label: 'Approvals', icon: 'check' },
  { to: '/summary', label: 'Settings', icon: 'sliders' },
]

function Icon({ name }) {
  const paths = {
    home: <><path d="m3 10 9-7 9 7" /><path d="M5 9v11h14V9M9 20v-6h6v6" /></>,
    wallet: <><path d="M4 6h16v13H4z" /><path d="M4 8h14a2 2 0 0 1 2 2v2h-5a2 2 0 0 0 0 4h5v3" /><path d="M15 14h.01" /></>,
    plane: <><path d="m3 11 18-7-7 18-2-8-9-3Z" /><path d="m12 14 4-4" /></>,
    check: <><path d="m5 12 4 4L19 6" /><path d="M4 4h16v16H4z" /></>,
    sliders: <><path d="M4 6h16M4 12h16M4 18h16" /><path d="M8 4v4M16 10v4M11 16v4" /></>,
    support: <><path d="M4 13a8 8 0 0 1 16 0" /><path d="M4 13v4h4v-4M20 13v4h-4v-4M12 21h3" /></>,
  }

  return <svg className="nav-icon" viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>
}

export function Sidebar() {
  return (
    <aside className="sidebar" aria-label="Primary navigation">
      <div className="sidebar__brand"><span className="sidebar__mark">↗</span><span>expensio</span></div>
      <nav className="sidebar__nav">
        {links.map((link) => (
          <NavLink key={link.label} to={link.to} end={link.end} className={({ isActive }) => 'sidebar__link' + (isActive ? ' is-active' : '')}>
            <Icon name={link.icon} />{link.label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar__spacer" />
      <div className="sidebar__rule" />
      <NavLink to="/summary" className="sidebar__link"><Icon name="support" />Support</NavLink>
      <p className="sidebar__foot">PERSONAL BUDGET TRACKER</p>
    </aside>
  )
}
