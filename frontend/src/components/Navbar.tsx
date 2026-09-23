import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    const sections = ['home', 'rooms', 'amenities', 'dining', 'gallery'];
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        // When a section comes into view, set it as the active tab
        if (entry.isIntersecting) {
          setActiveTab(entry.target.id);
        }
      });
    }, {
      // Trigger when the section crosses the middle of the screen
      rootMargin: '-50% 0px -50% 0px' 
    });

    // Setup observers
    sections.forEach((section) => {
      const element = document.getElementById(section);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  const getDesktopTabClass = (tabId: string) => {
    return `text-sm uppercase tracking-widest transition-colors ${
      activeTab === tabId ? 'text-gold-500 font-bold' : 'hover:text-gold-500'
    }`;
  };

  const getMobileTabClass = (tabId: string) => {
    return `block px-3 py-2 text-base font-medium uppercase tracking-wide ${
      activeTab === tabId ? 'bg-beige-50 text-gold-500' : 'text-charcoal-900 hover:bg-beige-50 hover:text-gold-500'
    }`;
  };

  return (
    <nav className="fixed w-full z-50 transition-all duration-300 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => {
            document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' });
          }}>
            <h1 className="font-serif text-2xl font-semibold tracking-wider uppercase text-charcoal-900">
              Simplotel <span className="text-gold-500">Grand</span>
            </h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className={getDesktopTabClass('home')}>Home</a>
            <a href="#rooms" className={getDesktopTabClass('rooms')}>Rooms & Suites</a>
            <a href="#amenities" className={getDesktopTabClass('amenities')}>Amenities</a>
            <a href="#dining" className={getDesktopTabClass('dining')}>Dining</a>
            <a href="#gallery" className={getDesktopTabClass('gallery')}>Gallery</a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-charcoal-900 hover:text-gold-500 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 shadow-lg">
            <a href="#home" onClick={() => setIsMobileMenuOpen(false)} className={getMobileTabClass('home')}>Home</a>
            <a href="#rooms" onClick={() => setIsMobileMenuOpen(false)} className={getMobileTabClass('rooms')}>Rooms & Suites</a>
            <a href="#amenities" onClick={() => setIsMobileMenuOpen(false)} className={getMobileTabClass('amenities')}>Amenities</a>
            <a href="#dining" onClick={() => setIsMobileMenuOpen(false)} className={getMobileTabClass('dining')}>Dining</a>
            <a href="#gallery" onClick={() => setIsMobileMenuOpen(false)} className={getMobileTabClass('gallery')}>Gallery</a>
          </div>
        </div>
      )}
    </nav>
  );
}
