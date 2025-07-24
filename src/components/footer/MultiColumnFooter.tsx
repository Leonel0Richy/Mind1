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
  title: 'Support',
  items: [
    { label: 'Contact', href: '' },
    { label: 'FAQs', href: '' },
    { label: 'Pricing Plans', href: '' },
    { label: 'Sitemap', href: '' },
  ],
}

const quickLinks = {
  title: 'Quick Links',
  items: [
    { label: 'Jobs', href: '' },
    { label: 'Courses', href: '' },
    { label: 'Paid Training', href: '' },
    { label: 'Blog', href: '' },
  ],
}

const category = {
  title: 'Category',
  items: [
    { label: 'Graphics', href: '' },
    { label: 'Programming', href: '' },
    { label: 'eCommerce', href: '' },
    { label: 'Freelancing', href: '' },
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
    </footer>
  )
}

export default Footer
