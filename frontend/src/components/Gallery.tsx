export default function Gallery() {
  const images = [
    { src: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=1000&auto=format&fit=crop", alt: "Hotel Exterior", span: "col-span-1 row-span-2" },
    { src: "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1000&auto=format&fit=crop", alt: "Lobby Area", span: "col-span-1 row-span-1" },
    { src: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1000&auto=format&fit=crop", alt: "Swimming Pool", span: "col-span-1 row-span-1" },
    { src: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1000&auto=format&fit=crop", alt: "Luxury Room", span: "col-span-2 row-span-2" },
    { src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1000&auto=format&fit=crop", alt: "Dining", span: "col-span-1 row-span-1" },
    { src: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1000&auto=format&fit=crop", alt: "Spa Treatment", span: "col-span-1 row-span-1" },
  ];

  return (
    <section id="gallery" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-charcoal-900 mb-4">A Glimpse of Grandeur</h2>
          <div className="w-24 h-1 bg-gold-500 mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 grid-rows-3 gap-4 h-[800px]">
          {images.map((image, index) => (
            <div 
              key={index} 
              className={`relative overflow-hidden group cursor-pointer rounded-xl ${image.span}`}
            >
              <img 
                src={image.src} 
                alt={image.alt} 
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-charcoal-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white font-serif text-xl tracking-wider">{image.alt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
