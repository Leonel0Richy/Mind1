import { EarthIcon, FacebookIcon, LinkedinIcon, TwitterIcon } from 'lucide-react'

const socialLinks = [
  {
    name: 'LinkedIn',
    link: '/',
    icon: <LinkedinIcon className="size-6" />,
  },
  {
    name: 'X',
    link: '/',
    icon: <TwitterIcon className="size-6" />,
  },
  {
    name: 'Facebook',
    link: '/',
    icon: <FacebookIcon className="size-6" />,
  },
  {
    name: 'Website',
    link: '/',
    icon: <EarthIcon className="size-6" />,
  },
]

const support = {
  title: 'company',
  items: [
    { label: 'About us', href: '' },
    { label: 'Git hub', href: '' },
    { label: 'Freebies', href: '' },
    { label: 'Premium', href: '' },
    { label: 'Blog', href: '' },
    { label: 'Affiliate Program', href: '' },
    { label: 'Creative Tim Club', href: '' },
  ],
}

const quickLinks = {
  title: 'Help and Support',
  items: [
    { label: 'Knowledge Center', href: '' },
    { label: 'Contact Us', href: '' },
    { label: 'Premium Support', href: '' },
    { label: 'Custom Development', href: '' },
    { label: 'Teams & Conditions', href: '' },
    { label: 'Privacy Policy', href: '' },
    { label: 'Licences', href: '' },
    { label: 'Illustration', href: '' },

  ],
}

const category = {
  title: 'Tailwind Ressources',
  items: [
    { label: 'Admin & Dashboard', href: '' },
    { label: 'Templates & Kits', href: '' },
    { label: 'React & Tailwind', href: '' },
    { label: 'Freamework', href: '' },
    { label: 'HTML & Tailwind', href: '' },
    { label: 'Freamework', href: '' },
    { label: 'Figma Design System', href: '' },
    { label: 'TW Cheatsheet', href: '' },
    { label: 'TW Gradient', href: '' },
    { label: 'Generator', href: '' },
    { label: 'TW Components', href: '' },
  ],
}

const developer = {
  title: 'DEveloper Ressources',
  items: [
    { label: 'GaliChat AI Assistant', href: '' },
    { label: 'GPTs Collection', href: '' },
    { label: 'Bootstrap Cheat', href: '' },
    { label: 'Sheet', href: '' },
    { label: 'ChatGPT Prompts', href: '' },
    { label: 'AI Code Mentor', href: '' },
    { label: 'Digital Ocean ', href: '' },
    { label: 'Top Software', href: '' },
    { label: 'Communies', href: '' },
    { label: 'Software Engineering', href: '' },
    { label: 'Inteligence', href: '' },
  ],
}
const contact = {
  address: '4517 Washington Ave. Manchester, Kentucky 39495',
  phone: 'Phone: (405) 555-0128',
  email: 'info@learningonline.com',
}

const Footer = () => {
  return (
    <footer className="bg-dark">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-6 py-16 sm:grid-cols-[40fr_30fr_30fr] md:grid-cols-[40fr_30fr_30fr_30fr]">
          <div className="">
            <a href="/" className="mb-8 flex items-center gap-5 text-white">
              <img
                src="https://res.cloudinary.com/dyvkdwzcj/image/upload/v1709055594/logo-1_vo1dni.png"
                className="h-8"
                alt="Logo"
              />
              <h6 className="text-3xl font-semibold tracking-wider">Flexy UI</h6>
            </a>
            <address className="mt-3 text-base font-normal text-[#767E94]">
              <p className="mt-3 max-w-64">{contact.address}</p>
              <p className="mt-3">{contact.phone}</p>
              <p className="mt-3">Mail: {contact.email}</p>
            </address>
          </div>
          <div>
            <h6 className="mb-7 text-xl text-white">{support.title}</h6>
            <ul>
              {support.items.map(({ label, href }) => (
                <li
                  key={label}
                  className="mt-3 text-base font-normal text-[#767E94] hover:text-white">
                  <a href={href}>{label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h6 className="mb-7 text-xl text-white">{quickLinks.title}</h6>
            <ul>
              {quickLinks.items.map(({ label, href }) => (
                <li
                  key={label}
                  className="mt-3 text-base font-normal text-[#767E94] hover:text-white">
                  <a href={href}>{label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h6 className="mb-7 text-xl text-white">{category.title}</h6>
            <ul>
              {category.items.map(({ label, href }) => (
                <li
                  key={label}
                  className="mt-3 text-base font-normal text-[#767E94] hover:text-white">
                  <a href={href}>{label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="bg-mid">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 py-5 md:flex-row md:justify-between">
          <p className="text-center text-[#767E94]">
            Learning Online © 2023. Developed by <span className="text-white">Abdul Basit</span>
          </p>
          <ul className="flex items-center gap-6">
            {socialLinks.map(({ name, icon, link }) => (
              <li key={name}>
                <a
                  href={link}
                  title={name}
                  className="text-[#767E94] hover:text-white"
                  target="_blank"
                  rel="noopener noreferrer">
                  {icon}
                </a>
                <span className="sr-only">{name} account</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}

export default Footer