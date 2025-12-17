import { useState, useEffect, useRef } from "react";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  rating: number;
  initials: string;
  initialsClass: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "Dev delivered an outstanding e-commerce platform that exceeded our expectations. The attention to detail and user experience design helped increase our conversion rates by 35%.",
    author: "John Doe",
    role: "CEO",
    company: "TechRetail",
    rating: 5,
    initials: "JD",
    initialsClass: "bg-[var(--primary)]/20 text-[var(--primary)]"
  },
  {
    quote: "Working with Dev was a game-changer for our startup. The mobile app they developed not only looked beautiful but performed flawlessly. Their technical expertise and communication made the process seamless.",
    author: "Jane Smith",
    role: "Founder",
    company: "FitTech",
    rating: 5,
    initials: "JS",
    initialsClass: "bg-[var(--secondary)]/20 text-[var(--secondary)]"
  },
  {
    quote: "The API service developed by Dev transformed our business operations. The documentation was comprehensive, and the implementation was smooth and secure. I highly recommend their services.",
    author: "Robert Johnson",
    role: "CTO",
    company: "FinSecure",
    rating: 4.5,
    initials: "RJ",
    initialsClass: "bg-blue-500/20 text-blue-400"
  },
  {
    quote: "Dev's expertise in creating our real estate platform was exceptional. The virtual tour feature they implemented became our competitive advantage. A true professional who delivers quality work.",
    author: "Maria Lopez",
    role: "Director",
    company: "HomeQuest",
    rating: 5,
    initials: "ML",
    initialsClass: "bg-[var(--primary)]/20 text-[var(--primary)]"
  }
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleSlides, setVisibleSlides] = useState(3);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const calculateVisibleSlides = () => {
      if (window.innerWidth >= 1024) return 3;
      if (window.innerWidth >= 768) return 2;
      return 1;
    };

    const handleResize = () => {
      const newVisibleSlides = calculateVisibleSlides();
      if (newVisibleSlides !== visibleSlides) {
        setVisibleSlides(newVisibleSlides);
        setCurrentIndex(0);
      }
    };

    setVisibleSlides(calculateVisibleSlides());
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [visibleSlides]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    if (containerRef.current) {
      const slideWidth = containerRef.current.children[0].clientWidth;
      containerRef.current.scrollTo({
        left: slideWidth * index,
        behavior: "smooth"
      });
    }
  };

  const nextSlide = () => {
    if (currentIndex < testimonials.length - visibleSlides) {
      goToSlide(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      goToSlide(currentIndex - 1);
    }
  };

  return (
    <section id="testimonials" className="py-16 max-w-6xl mx-auto">
      <h2 className="section-title">Client Testimonials</h2>
      
      <div className="relative">
        <div 
          ref={containerRef}
          className="testimonial-scroll overflow-x-auto flex snap-x snap-mandatory scroll-smooth hide-scrollbar"
        >
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial min-w-full md:min-w-[calc(100%/2)] lg:min-w-[calc(100%/3)] p-4">
              <div className="bg-[var(--dark)] rounded-xl p-6 border border-[var(--primary)]/20 shadow-lg shadow-black/10 h-full">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(Math.floor(testimonial.rating))].map((_, i) => (
                      <i key={i} className="fas fa-star"></i>
                    ))}
                    {testimonial.rating % 1 !== 0 && (
                      <i className="fas fa-star-half-alt"></i>
                    )}
                  </div>
                </div>
                <p className="text-[var(--light)]/80 mb-6">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${testimonial.initialsClass}`}>
                    <span className="font-bold">{testimonial.initials}</span>
                  </div>
                  <div className="ml-3">
                    <h4 className="font-semibold">{testimonial.author}</h4>
                    <p className="text-sm text-[var(--light)]/60">{testimonial.role}, {testimonial.company}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center mt-8 gap-2">
          <button 
            onClick={prevSlide}
            className="w-10 h-10 rounded-full bg-[var(--dark)] border border-[var(--primary)]/20 flex items-center justify-center hover:bg-[var(--primary)]/10 transition-all duration-300"
            disabled={currentIndex === 0}
          >
            <i className="fas fa-arrow-left"></i>
          </button>
          <div className="flex items-center gap-2">
            {Array.from({ length: testimonials.length - visibleSlides + 1 }).map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full ${index === currentIndex ? "bg-[var(--primary)]" : "bg-[var(--dark)] border border-[var(--primary)]/20"}`}
                onClick={() => goToSlide(index)}
              ></button>
            ))}
          </div>
          <button 
            onClick={nextSlide}
            className="w-10 h-10 rounded-full bg-[var(--dark)] border border-[var(--primary)]/20 flex items-center justify-center hover:bg-[var(--primary)]/10 transition-all duration-300"
            disabled={currentIndex >= testimonials.length - visibleSlides}
          >
            <i className="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </section>
  );
}
