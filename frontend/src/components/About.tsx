export default function About() {
  return (
    <section id="about" className="py-24 bg-beige-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-16">
          
          <div className="w-full lg:w-1/2 relative">
            <img 
              src="https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=2835&auto=format&fit=crop" 
              alt="Hotel exterior" 
              className="w-full h-[600px] rounded-xl shadow-2xl object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute -bottom-10 -right-10 bg-charcoal-900 text-gold-500 p-8 rounded-xl shadow-xl hidden md:block">
              <p className="font-serif text-4xl mb-2">123</p>
              <p className="uppercase tracking-widest text-xs">MG Road<br/>Bangalore</p>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 space-y-8">
            <h2 className="text-3xl md:text-5xl font-serif text-charcoal-900 leading-tight">
              Designed for a <span className="text-gold-600 italic">Better Stay</span>
            </h2>
            <p className="text-charcoal-800 text-lg font-light leading-relaxed">
              At Simplotel Grand Hotel, we believe that true luxury lies in the details. From the moment you arrive, our dedicated staff is committed to providing an environment where every need is anticipated and every expectation exceeded.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-12">
              <div className="border-l-2 border-gold-500 pl-4">
                <h4 className="font-serif text-xl text-charcoal-900 mb-2">Unmatched Comfort</h4>
                <p className="text-sm text-charcoal-800 font-light">Spacious rooms designed as peaceful sanctuaries for rest and relaxation.</p>
              </div>
              <div className="border-l-2 border-gold-500 pl-4">
                <h4 className="font-serif text-xl text-charcoal-900 mb-2">Warm Hospitality</h4>
                <p className="text-sm text-charcoal-800 font-light">Our dedicated team is always ready to assist you with a genuine smile.</p>
              </div>
              <div className="border-l-2 border-gold-500 pl-4">
                <h4 className="font-serif text-xl text-charcoal-900 mb-2">Ultimate Convenience</h4>
                <p className="text-sm text-charcoal-800 font-light">Prime location and comprehensive amenities make your stay effortless.</p>
              </div>
              <div className="border-l-2 border-gold-500 pl-4">
                <h4 className="font-serif text-xl text-charcoal-900 mb-2">Pure Relaxation</h4>
                <p className="text-sm text-charcoal-800 font-light">From our spa to the poolside, find your perfect spot to unwind.</p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
