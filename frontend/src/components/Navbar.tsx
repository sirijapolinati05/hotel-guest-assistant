import { useState } from 'react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 transition-all duration-300 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer">
            <h1 className="font-serif text-2xl font-semibold tracking-wider uppercase text-charcoal-900">
              Simplotel <span className="text-gold-500">Grand</span>
            </h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-sm uppercase tracking-widest hover:text-gold-500 transition-colors">Home</a>
            <a href="#rooms" className="text-sm uppercase tracking-widest hover:text-gold-500 transition-colors">Rooms & Suites</a>
            <a href="#amenities" className="text-sm uppercase tracking-widest hover:text-gold-500 transition-colors">Amenities</a>
            <a href="#dining" className="text-sm uppercase tracking-widest hover:text-gold-500 transition-colors">Dining</a>
            <a href="#gallery" className="text-sm uppercase tracking-widest hover:text-gold-500 transition-colors">Gallery</a>
            

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
            <a href="#home" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-charcoal-900 hover:bg-beige-50 hover:text-gold-500 uppercase tracking-wide">Home</a>
            <a href="#rooms" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-charcoal-900 hover:bg-beige-50 hover:text-gold-500 uppercase tracking-wide">Rooms & Suites</a>
            <a href="#amenities" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-charcoal-900 hover:bg-beige-50 hover:text-gold-500 uppercase tracking-wide">Amenities</a>
            <a href="#dining" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-charcoal-900 hover:bg-beige-50 hover:text-gold-500 uppercase tracking-wide">Dining</a>
            <a href="#gallery" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-charcoal-900 hover:bg-beige-50 hover:text-gold-500 uppercase tracking-wide">Gallery</a>

          </div>
        </div>
      )}
    </nav>
  );
}
