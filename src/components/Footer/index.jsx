import { Facebook, Linkedin, Twitter, Instagram } from 'lucide-react';
import LOGO from "../../assets/footer-logo-kode.png"

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Contact Us',
      links: [
        { name: 'About Us', href: '/about-us' },
        { name: 'Our Team', href: '/our-team' },
        { name: 'Careers', href: '/careers' },

        
      ],
    },
    {
      title: 'Products',
      links: [
        { name: 'Problems', href: '/problems' },
        { name: 'Interview Experiences', href: '/interview-experiences' },
        { name: 'Arena', href: '/problems' },
      ],
    },
    {
      title: 'Solutions',
      links: [
        { name: 'Interview Pro', href: 'https://interview.kodecompiler.com/' },
        { name: 'Arena', href: '/problems' },
       { name: 'Online Code Editor', href: '/guest-editor' },
       { name: 'Free Trial', href: '/free-trial' },
      ],
    },
    {
      title: 'Our Policies',
      links: [
        { name: 'Privacy Policy', href: '/privacy-policy' },
        { name: 'Terms of Service', href: '/terms-of-service' },
        { name: 'Refund Policy', href: '/refund-policy' },
        { name: 'Disclaimer', href: '/disclaimer' },
      ],
    },
  ];

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  ];

  return (
    <footer className="bg-gray-950 text-gray-400 border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Footer Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
           <div >
              <h3 className="text-white font-semibold text-base mb-4">
                About Kode Compiler
              </h3>
              <p>Practice coding problems, prepare for interviews, and improve your programming skills.</p>
            </div>
          
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-white font-semibold text-base mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          {/* Logo and Copyright */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <img className="w-10" src={LOGO} alt='Kode Compiler'  />
            </div>
            <p className="text-sm text-gray-500">
              © KodeCompiler {currentYear} All Rights Reserved.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-6">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <social.icon className="h-5 w-5" />
              </a>
            ))}
          </div>

          
        
        </div>
      </div>
    </footer>
  );
};

export default Footer;