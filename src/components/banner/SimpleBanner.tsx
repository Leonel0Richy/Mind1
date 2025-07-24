import { useEffect, useState } from 'react'

interface BannerProps {
  title: string
  description?: string
}

const Banner: React.FC<BannerProps> = ({ title, description }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-300 to-purple-300 rounded-full opacity-20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-300 to-orange-300 rounded-full opacity-20 blur-3xl animate-pulse animation-delay-2000" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="relative mx-auto max-w-4xl px-4 py-16 text-center md:py-24">
        <h1 className={`
          text-3xl md:text-5xl lg:text-6xl font-bold leading-tight
          text-gray-900 drop-shadow
          transform transition-all duration-1000 ease-out
          ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
        `}>
          {title}
        </h1>
        
        {description && (
          <h2 className={`
            mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto
            transform transition-all duration-1000 ease-out
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
          `}
          style={{ transitionDelay: '200ms' }}>
            {description}
          </h2>
        )}

        {/* CTA Button */}
        <div className={`
          mt-8 transform transition-all duration-1000 ease-out
          ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'}
        `}
        style={{ transitionDelay: '400ms' }}>
          <button className="
            px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 
            text-white font-semibold rounded-full
            hover:from-indigo-700 hover:to-purple-700
            transform transition-all duration-300 hover:scale-105 hover:shadow-lg
            focus:outline-none focus:ring-4 focus:ring-indigo-300
          ">
            Explore Articles
          </button>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-10 left-10 text-indigo-200 opacity-50 animate-float">
          <svg width="24" height="24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
        <div className="absolute bottom-10 right-10 text-purple-200 opacity-50 animate-float animation-delay-1000">
          <svg width="24" height="24" fill="currentColor">
            <circle cx="12" cy="12" r="10"/>
          </svg>
        </div>
      </div>
    </div>
  )
}

export default Banner