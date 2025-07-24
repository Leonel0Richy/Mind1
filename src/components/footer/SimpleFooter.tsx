import {
  AtSignIcon,
  EarthIcon,
  FacebookIcon,
  HeadsetIcon,
  LinkedinIcon,
  TwitterIcon,
} from 'lucide-react'

const socialLinks = [
  {
    name: 'LinkedIn',
    link: '/',
    icon: <LinkedinIcon />,
  },
  {
    name: 'X',
    link: '/',
    icon: <TwitterIcon />,
  },
  {
    name: 'Facebook',
    link: '/',
    icon: <FacebookIcon />,
  },
  {
    name: 'Website',
    link: '/',
    icon: <EarthIcon />,
  },
]

const description =
  'SkillSpot offers a range of free and paid online and offline courses in UAE, including topics like App Making, Data Skills, Photography, Money Management, and more. Improve your skills now!'

const Footer = () => {
  return (
    <footer className="relative z-50 bg-dark">
      <div className="flex flex-col items-center px-4 py-12">
        {/* app logo */}
        <div>
          <a href="/" className="mb-8 flex items-center justify-center gap-5 text-white">
            <img
              src="https://res.cloudinary.com/dyvkdwzcj/image/upload/v1709055594/logo-1_vo1dni.png"
              className="h-8"
              alt="Logo"
            />
            <span className="text-3xl font-semibold tracking-wider">MasterMinds</span>
          </a>
          <p className="max-w-xl text-center text-lg font-medium text-white">{description}</p>
        </div>

        {/* social links */}
        <div className="mt-8">
          <span className="mb-6 block text-center text-lg font-medium text-[#767E94]">
            Follow Us
          </span>
          <ul className="flex items-center gap-6">
            {socialLinks.map(({ name, icon, link }) => (
              <li key={name}>
                <a
                  href={link}
                  title={name}
                  className="text-white hover:text-[#767e94]"
                  target="_blank">
                  {icon}
                </a>
                <span className="sr-only">{name} account</span>
              </li>
            ))}
          </ul>
        </div>

        {/* email */}
        <div className="mb-2 mt-6 flex items-center gap-2 text-white">
          <AtSignIcon size={16} />
          <span className="text-lg font-medium">info@email.com</span>
        </div>

        {/* call to action */}
        <div className="mt-8">
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg bg-gray-800 px-5 py-2.5 text-base font-semibold text-sky-100 transition duration-300 ease-in-out hover:bg-gray-100 hover:text-sky-600">
            <HeadsetIcon size={20} />
            <span>Book A Demo</span>
          </button>
        </div>
      </div>

      {/* about author or app/copyrights */}
      <div className="bg-mid">
        <div className="px-3 py-3 text-center">
          <span className="text-[#767E94]">
            Coded with 💙 by{' '}
            <a
              href="https://www.linkedin.com/in/abdulbasitprofile/"
              target="_blank"
              className="text-white">
              Abdul Basit{' '}
            </a>
            in Karachi
          </span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
