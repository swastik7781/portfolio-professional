import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote, ExternalLink } from 'lucide-react';
import { testimonials } from '@/lib/portfolio-data';

const Testimonials = () => {
  const [current, setCurrent] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const prev = () => {
    setCurrent((current - 1 + testimonials.length) % testimonials.length);
  };
  const next = () => {
    setCurrent((current + 1) % testimonials.length);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    
    // swipe left (next)
    if (diff > 50) next();
    // swipe right (prev)
    if (diff < -50) prev();
    
    setTouchStart(null);
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 bg-secondary/20 relative z-10">
      <div className="max-w-6xl mx-auto">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mb-8 md:mb-12 text-center"
        >
          <p className="section-label mx-auto w-fit">Testimonials</p>
          <h2 className="section-title">
            What People <span className="text-gradient">Say</span>
          </h2>
          <div className="section-divider mx-auto" />
        </motion.div>

        {/* Clean Single-Card Fade Carousel */}
        <div 
          className="relative min-h-[320px] md:min-h-[350px] flex items-center justify-center p-2"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);
                if (swipe < -swipeConfidenceThreshold) {
                  next();
                } else if (swipe > swipeConfidenceThreshold) {
                  prev();
                }
              }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="w-full sm:w-[90%] md:w-[85%] lg:w-[75%] xl:w-[70%] cursor-grab active:cursor-grabbing"
            >
              <div className="card-base p-8 sm:p-12 text-center shadow-card-hover border-primary/10 bg-card">
                <Quote className="mx-auto text-primary/20 mb-6" size={36} />
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-8 italic max-w-2xl mx-auto">
                  "{testimonials[current].quote}"
                </p>
                {/* Stars */}
                <div className="flex justify-center gap-1 mb-8">
                  {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                    <Star key={i} size={16} className="fill-primary text-primary" />
                  ))}
                </div>

                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20 bg-secondary/50 flex items-center justify-center shadow-sm">
                    {testimonials[current].photo ? (
                      <img src={testimonials[current].photo} alt={testimonials[current].name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-muted-foreground font-mono-code text-xl">{testimonials[current].name.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <div className="font-display font-semibold text-foreground text-sm sm:text-base">{testimonials[current].name}</div>
                    <div className="font-mono-code text-xs text-muted-foreground mt-0.5">{testimonials[current].role}</div>
                    {testimonials[current].portfolio && (
                      <a
                        href={testimonials[current].portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center gap-1.5 px-4 py-1.5 bg-primary/10 text-primary text-xs font-semibold rounded-full hover:bg-primary hover:text-primary-foreground shadow-sm hover:shadow-primary/20 transition-all duration-300"
                      >
                        View Portfolio <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        {testimonials.length > 1 && (
          <div className="flex items-center justify-center gap-6 mt-6 md:mt-10 relative z-20">
            <button
              onClick={prev}
              className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200 shadow-sm"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={20} />
            </button>
            
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`rounded-full transition-all duration-300 ${i === current ? 'w-6 h-1.5 bg-primary' : 'w-1.5 h-1.5 bg-border hover:bg-muted-foreground'}`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200 shadow-sm"
              aria-label="Next testimonial"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;

