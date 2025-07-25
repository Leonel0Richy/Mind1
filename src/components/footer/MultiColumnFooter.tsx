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
  title: 'Tailwind Resources',
  items: [
    { label: 'Admin & Dashboard', href: '' },
    { label: 'Templates & Kits', href: '' },
    { label: 'React & Tailwind', href: '' },
    { label: 'Framework Components', href: '' },
    { label: 'HTML & Tailwind', href: '' },
    { label: 'CSS Framework', href: '' },
    { label: 'Figma Design System', href: '' },
    { label: 'TW Cheatsheet', href: '' },
    { label: 'TW Gradient', href: '' },
    { label: 'Generator', href: '' },
    { label: 'TW Components', href: '' },
  ],
}

const developer = {
  title: 'Developer Resources',
  items: [
    { label: 'GaliChat AI Assistant', href: '' },
    { label: 'GPTs Collection', href: '' },
    { label: 'Bootstrap Cheat Sheet', href: '' },
    { label: 'ChatGPT Prompts', href: '' },
    { label: 'AI Code Mentor', href: '' },
    { label: 'Digital Ocean', href: '' },
    { label: 'Top Software', href: '' },
    { label: 'Communities', href: '' },
    { label: 'Software Engineering', href: '' },
    { label: 'Intelligence', href: '' },
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
                src="https://screendy-cdn.fra1.cdn.digitaloceanspaces.com/platfrom-v2/_files/file_1737026922989_geeks-logo.jpg"
                className="h-8"
                alt="Logo"
              />
              <h6 className="text-3xl font-semibold tracking-wider">MasterMinds</h6>
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
    </footer>
  )
}

export default Footer