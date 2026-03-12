import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote, ExternalLink } from 'lucide-react';
import { testimonials } from '@/lib/portfolio-data';

const Testimonials = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { clientWidth } = scrollContainerRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth : clientWidth;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 px-4 sm:px-6 bg-secondary/20 relative z-10">
      <div className="max-w-5xl mx-auto">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <p className="section-label mx-auto w-fit">Testimonials</p>
          <h2 className="section-title">
            What People <span className="text-gradient">Say</span>
          </h2>
          <div className="section-divider mx-auto" />
        </motion.div>

        {/* Testimonial slider using native snap scrolling */}
        <div className="relative group">
          <div 
            ref={scrollContainerRef}
            onScroll={checkScroll}
            className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-6 pb-8 pt-4 px-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {testimonials.map((t, idx) => (
              <div key={idx} className="w-full sm:w-[80%] md:w-[60%] shrink-0 snap-center">
                <div className="card-base p-8 text-center h-full flex flex-col justify-between transition-all duration-300 hover:shadow-card-hover">
                  <div>
                    <Quote className="mx-auto text-primary/20 mb-6" size={36} />
                    <p className="text-muted-foreground text-sm leading-relaxed mb-6 italic max-w-xl mx-auto">
                      "{t.quote}"
                    </p>
                    {/* Stars */}
                    <div className="flex justify-center gap-1 mb-6">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} size={14} className="fill-primary text-primary" />
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-3 mt-auto">
                    <div className="w-16 h-16 rounded-full overflow-hidden border border-border bg-secondary/50 flex items-center justify-center shadow-sm">
                      {t.photo ? (
                        <img src={t.photo} alt={t.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-muted-foreground font-mono-code text-xl">{t.name.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <div className="font-display font-semibold text-foreground text-sm">{t.name}</div>
                      <div className="font-mono-code text-xs text-muted-foreground mt-0.5">{t.role}</div>
                      {t.portfolio && (
                        <a
                          href={t.portfolio}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-primary/10 text-primary text-xs font-semibold rounded-full hover:bg-primary hover:text-primary-foreground shadow-sm hover:shadow-primary/20 transition-all duration-300"
                        >
                          View Portfolio <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons for Desktop/Easy access */}
          {testimonials.length > 1 && (
            <div className="flex items-center justify-center gap-4 mt-2">
              <button
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={18} />
              </button>

              <button
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
                aria-label="Next testimonial"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Hide scrollbar styles for webkit */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </section>
  );
};

export default Testimonials;

