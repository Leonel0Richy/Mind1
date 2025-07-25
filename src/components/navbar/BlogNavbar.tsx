import { CircleFadingPlus, MenuIcon, User, LogOut } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import ApplicationModal from '../application/ApplicationModal'
import { useActiveSection } from '../../hooks/useActiveSection'

const navLinks = [
  { title: 'Home', link: '#accueil', isAnchor: true },
  { title: 'Categories', link: '#categories', isAnchor: true },
  { title: 'Articles', link: '#blog', isAnchor: true },
  { title: 'Projects', link: '#projects', isAnchor: true },
  { title: 'FAQ', link: '#faq', isAnchor: true },
]

const Navbar = () => {
  const [showNav, setShowNav] = useState(false)
  const [showApplicationModal, setShowApplicationModal] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()

  // Track active section for navigation highlighting
  const sectionIds = navLinks.filter(link => link.isAnchor).map(link => link.link)
  const activeSection = useActiveSection(sectionIds)

  const handleShowNav = () => {
    setShowNav(!showNav)
  }

  const handleApplyClick = () => {
    setShowApplicationModal(true)
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const handleNavClick = (link: string, isAnchor?: boolean) => {
    if (isAnchor) {
      // Smooth scroll to section with offset for navbar
      const element = document.querySelector(link) as HTMLElement
      if (element) {
        const navbarHeight = 80 // Approximate navbar height
        const elementPosition = element.offsetTop - navbarHeight

        window.scrollTo({
          top: elementPosition,
          behavior: 'smooth'
        })
      }
    }
    // Close mobile menu
    setShowNav(false)
  }

  return (
    <nav className="relative z-20 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between bg-white px-2 py-2 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 sm:gap-10">
          {/* hamburger menu */}
          <button onClick={handleShowNav} aria-label="Toggle Menu" className="md:hidden">
            <MenuIcon color="#7F3FFF" strokeWidth={3} size={25} />
          </button>
          {/* logo */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src="https://screendy-cdn.fra1.cdn.digitaloceanspaces.com/platfrom-v2/_files/file_1737026922989_geeks-logo.jpg"
              className="h-8"
              alt="Logo"
            />
            <span className="self-center whitespace-nowrap text-xl font-semibold text-primary md:text-2xl">
              MasterMinds
            </span>
          </Link>
          {/* nav links */}
          <div
            className={`absolute left-0 right-0 -z-10 flex w-full flex-col gap-3 bg-white p-3 shadow transition-all duration-300 ease-in-out md:relative md:left-0 md:right-auto md:top-auto md:z-auto md:flex-row md:shadow-none ${showNav ? 'top-[60px]' : 'top-[-165px]'}`}>
            {navLinks.map(({ title, link, isAnchor }, index) => {
              const isActive = isAnchor && activeSection === link

              return isAnchor ? (
                <button
                  key={index}
                  onClick={() => handleNavClick(link, isAnchor)}
                  className={`rounded-md px-3 py-2 transition-all duration-200 ease-linear text-left ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-secondary hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  {title}
                </button>
              ) : (
                <Link
                  key={index}
                  to={link}
                  className="rounded-md px-3 py-2 text-secondary transition-colors duration-100 ease-linear hover:bg-gray-700 hover:text-white"
                >
                  {title}
                </Link>
              )
            })}
          </div>
        </div>
        {/* User section or CTA button */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <User size={16} />
                <span>Welcome, {user?.firstName}</span>
              </div>
              <Link
                to="/dashboard"
                className="flex items-center gap-2 rounded-lg border border-indigo-300 bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 transition duration-300 ease-in-out hover:bg-indigo-100 active:scale-95"
              >
                <User size={16} />
                <span>Dashboard</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition duration-300 ease-in-out hover:bg-gray-50 active:scale-95"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleApplyClick}
              className="flex items-center gap-2 rounded-lg border bg-theme px-4 py-2 text-base font-semibold text-white transition duration-300 ease-in-out hover:bg-theme-hover active:scale-95 sm:px-5 sm:py-2.5"
            >
              <CircleFadingPlus size={18} />
              <span>Apply to Geeks Now</span>
            </button>
          )}
        </div>
      </div>

      {/* Application Modal */}
      <ApplicationModal
        isOpen={showApplicationModal}
        onClose={() => setShowApplicationModal(false)}
      />
    </nav>
  )
}

export default Navbar
