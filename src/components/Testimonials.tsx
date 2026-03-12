import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote, ExternalLink } from 'lucide-react';
import { testimonials } from '@/lib/portfolio-data';

const Testimonials = () => {
  const [current, setCurrent] = useState(0);

  const prev = () => {
    setCurrent((current - 1 + testimonials.length) % testimonials.length);
  };
  const next = () => {
    setCurrent((current + 1) % testimonials.length);
  };

  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 50;
    if (info.offset.x > swipeThreshold) {
      prev();
    } else if (info.offset.x < -swipeThreshold) {
      next();
    }
  };

  return (
    <section className="py-24 px-4 sm:px-6 bg-secondary/20">
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

        {/* Testimonial slider */}
        <div className="overflow-hidden w-full relative">
          <motion.div
            initial={false}
            animate={{ x: `-${current * 100}%` }}
            transition={{ type: "spring", bounce: 0, duration: 0.6 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="flex cursor-grab active:cursor-grabbing"
          >
            {testimonials.map((t, idx) => (
              <div key={idx} className="w-full shrink-0 px-2 sm:px-4">
                <div className="card-base p-8 text-center h-full">
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

                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-full overflow-hidden border border-border bg-secondary/50 flex items-center justify-center">
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
          </motion.div>
        </div>

        {/* Navigation */}
        {testimonials.length > 1 && (
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={prev}
              className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Dots */}
            <div className="flex gap-1.5">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`rounded-full transition-all duration-200 ${i === current ? 'w-4 h-1.5 bg-primary' : 'w-1.5 h-1.5 bg-border hover:bg-muted-foreground'
                    }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200"
              aria-label="Next testimonial"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
