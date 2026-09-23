export default function Hero() {
  return (
    <section id="home" className="relative h-[85vh] min-h-[600px] flex items-center justify-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=2835&auto=format&fit=crop")' }}
      >
        <div className="absolute inset-0 bg-charcoal-900/40 mix-blend-multiply"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
        <h2 className="text-sm md:text-base uppercase tracking-[0.3em] text-gold-400 mb-4 font-semibold">
          Welcome to
        </h2>
        <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 leading-tight drop-shadow-md">
          Simplotel Grand Hotel
        </h1>
        <p className="text-lg md:text-xl text-beige-50 font-light mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow">
          An elegant stay designed around comfort, hospitality, and unforgettable experiences.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a 
            href="#availability" 
            className="bg-gold-500 text-white px-8 py-4 rounded hover:bg-gold-400 transition-colors uppercase tracking-widest text-sm w-full sm:w-auto text-center shadow-lg"
          >
            Check Availability
          </a>
          <a 
            href="#rooms" 
            className="bg-white/10 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded hover:bg-white/20 transition-all uppercase tracking-widest text-sm w-full sm:w-auto text-center"
          >
            Explore Rooms
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
        <a href="#availability" className="text-white/70 hover:text-white transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </a>
      </div>
    </section>
  );
}
