import React from 'react';
import { 
  Linkedin, 
  Twitter, 
  Instagram, 
  Github, 
  ArrowUpRight, 
  Mail, 
  MapPin, 
  Command 
} from 'lucide-react';
import LOGO from "../../assets/footer-logo-kode.png"; // Ensure this path is correct

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Platform',
      links: [
        { name: 'Arena', href: '/problems' },
        { name: 'Contests', href: '/weekly-challenges' },
 //       { name: 'Commnunity', href: '/community' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about-us' },
//        { name: 'Our Team', href: '/our-team' },
        { name: 'Careers', href: '/careers', badge: 'Hiring' },
        // { name: 'Partners', href: '/partners' },
      ],
    },
    {
      title: 'Resources',
      links: [
    //    { name: 'Blog', href: '/blog' },
        { name: 'Interview Pro', href: 'https://interview.kodecompiler.com/' },
        { name: 'Guest Editor', href: '/guest-editor' },
  //      { name: 'Roadmap', href: '/roadmap' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', href: '/privacy-policy' },
        { name: 'Terms of Service', href: '/terms-of-service' },
        { name: 'Refund Policy', href: '/refund-policy' },
        { name: 'Disclaimer', href: '/disclaimer' },
      ],
    },
  ];

  const socialLinks = [
    { icon: Linkedin, href: 'https://linkedin.com/company/kodecompiler', label: 'LinkedIn' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Instagram, href: '#', label: 'Instagram' },
  ];

  return (
    <footer className="relative bg-[#050505] text-slate-300 overflow-hidden font-sans border-t border-white/5">
      
      {/* --- BACKGROUND FX --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
         {/* Subtle Grid */}
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
         {/* Glows */}
         <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]"></div>
         <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-12">
        
        {/* --- TOP SECTION: BRAND & NEWSLETTER --- */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 mb-20">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-900/20">
                {/* Use Image if available, else fallback to icon */}
                <img src={LOGO} alt="Kode" className="w-6 h-6 object-contain brightness-0 invert" onError={(e) => e.target.style.display='none'} />
                <Command className="w-5 h-5 text-white" style={{ display: 'none' }} /> 
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">KodeCompiler</span>
            </div>
            <p className="text-slate-500 leading-relaxed max-w-md">
              The world's leading platform for developer assessment, interview preparation, and algorithmic mastery. Built for the obsessive.
            </p>
            <div className="flex gap-4 pt-2">
               <div className="flex items-center gap-2 text-sm text-slate-500 border border-white/10 px-3 py-1.5 rounded-lg bg-white/5">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  San Francisco, CA
               </div>
               <div className="flex items-center gap-2 text-sm text-slate-500 border border-white/10 px-3 py-1.5 rounded-lg bg-white/5">
                  <Mail className="w-4 h-4 text-purple-500" />
                  hello@kodecompiler.com
               </div>
            </div>
          </div>

          <div className="lg:pl-10">
            <h3 className="text-white font-bold text-lg mb-4">Stay ahead of the curve</h3>
            <p className="text-slate-500 text-sm mb-6">Get the latest coding challenges and system design tips delivered to your inbox.</p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
              />
              <button className="bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* --- LINKS GRID --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24 border-t border-white/5 pt-16">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-6">
                {section.title}
              </h3>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="group flex items-center text-sm text-slate-400 hover:text-white transition-colors duration-200"
                    >
                      <span className="relative">
                        {link.name}
                        <span className="absolute -bottom-1 left-0 w-0 h-px bg-blue-500 transition-all group-hover:w-full"></span>
                      </span>
                      {link.badge && (
                        <span className="ml-2 px-1.5 py-0.5 text-[10px] font-bold bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20">
                          {link.badge}
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* --- THE BIG ASS TEXT --- */}
        <div className="relative w-full flex justify-center items-center py-10 opacity-20 select-none pointer-events-none">
           <h1 className="text-[12vw] md:text-[13vw] font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-transparent leading-[0.8] tracking-tighter text-center whitespace-nowrap">
              KODECOMPILER
           </h1>
        </div>

        {/* --- BOTTOM BAR --- */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/10">
          <p className="text-xs text-slate-600 mb-4 md:mb-0">
            © {currentYear} KodeCompiler Inc. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-white hover:scale-110 transition-all duration-300"
                aria-label={social.label}
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