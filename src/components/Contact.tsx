import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Github, Linkedin, Mail, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { personalInfo } from '@/lib/portfolio-data';

interface ContactProps {
  visitorName: string;
}

type FormStatus = 'idle' | 'sending' | 'success' | 'error';

const RATE_LIMIT_KEY = 'contact_submissions';
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW = 10 * 60 * 1000; // 10 minutes

function checkRateLimit(): boolean {
  try {
    const raw = localStorage.getItem(RATE_LIMIT_KEY);
    const data: number[] = raw ? JSON.parse(raw) : [];
    const now = Date.now();
    const recent = data.filter(t => now - t < RATE_LIMIT_WINDOW);
    if (recent.length >= RATE_LIMIT_MAX) return false;
    recent.push(now);
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(recent));
    return true;
  } catch {
    return true;
  }
}

const Contact = ({ visitorName }: ContactProps) => {
  const [form, setForm] = useState({ name: '', email: '', message: '', honeypot: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<FormStatus>('idle');
  const formRef = useRef<HTMLFormElement>(null);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required.';
    if (!form.email.trim()) e.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email.';
    if (!form.message.trim()) e.message = 'Message is required.';
    else if (form.message.trim().length < 10) e.message = 'Message must be at least 10 characters.';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot check
    if (form.honeypot) return;

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Rate limit
    if (!checkRateLimit()) {
      setErrors({ general: 'Too many submissions. Please wait a few minutes.' });
      return;
    }

    setStatus('sending');
    setErrors({});

    try {
      // EmailJS integration via CDN — graceful fallback to mailto
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (serviceId && templateId && publicKey) {
        // @ts-ignore — emailjs loaded via CDN in index.html
        if (typeof window !== 'undefined' && (window as any).emailjs) {
          await (window as any).emailjs.send(serviceId, templateId, {
            from_name: form.name,
            from_email: form.email,
            message: form.message,
          }, publicKey);
        } else {
          throw new Error('EmailJS not loaded');
        }
      } else {
        // Fallback: open mailto
        const subject = encodeURIComponent(`Portfolio Contact from ${form.name}`);
        const body = encodeURIComponent(`From: ${form.name}\nEmail: ${form.email}\n\n${form.message}`);
        window.open(`mailto:${personalInfo.email}?subject=${subject}&body=${body}`, '_blank');
        await new Promise(resolve => setTimeout(resolve, 600));
      }

      setStatus('success');
      setForm({ name: '', email: '', message: '', honeypot: '' });
    } catch (err) {
      console.error('Email send error:', err);
      // Still show success and open mailto as fallback
      const subject = encodeURIComponent(`Portfolio Contact from ${form.name}`);
      const body = encodeURIComponent(`From: ${form.name}\nEmail: ${form.email}\n\n${form.message}`);
      window.open(`mailto:${personalInfo.email}?subject=${subject}&body=${body}`, '_blank');
      setStatus('success');
      setForm({ name: '', email: '', message: '', honeypot: '' });
    }
  };

  const successName = visitorName || form.name || 'there';

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 bg-background relative z-20">
      <div className="max-w-6xl mx-auto">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="section-label">Contact</p>
          <h2 className="section-title">
            Get In <span className="text-gradient">Touch</span>
          </h2>
          <div className="section-divider" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left — info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <p className="text-muted-foreground text-sm leading-relaxed">
              I'm currently open to new opportunities — whether it's a full-time role, freelance project, or just a conversation about technology. My inbox is always open.
            </p>

            <div className="space-y-3">
              <a
                href={`mailto:${personalInfo.email}`}
                className="flex items-center gap-3 p-3.5 card-base card-hover group"
              >
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <Mail size={14} className="text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                    {personalInfo.email}
                  </p>
                </div>
              </a>

              <a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3.5 card-base card-hover group"
              >
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <Github size={14} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">GitHub</p>
                  <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    github.com/swastik7781
                  </p>
                </div>
              </a>

              <a
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3.5 card-base card-hover group"
              >
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <Linkedin size={14} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">LinkedIn</p>
                  <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    linkedin.com/in/swastikbhardwaj
                  </p>
                </div>
              </a>
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="card-base p-8 text-center space-y-4"
                >
                  <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
                    <CheckCircle size={24} className="text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                      Message sent!
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Thank you {successName}. I'll respond soon.
                    </p>
                  </div>
                  <button
                    onClick={() => setStatus('idle')}
                    className="btn-secondary text-xs"
                  >
                    Send another
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  ref={formRef}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                  noValidate
                >
                  {/* Honeypot — hidden from real users */}
                  <input
                    type="text"
                    name="honeypot"
                    value={form.honeypot}
                    onChange={e => setForm(f => ({ ...f, honeypot: e.target.value }))}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                  />

                  {/* General error */}
                  {errors.general && (
                    <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-sm text-destructive">
                      <AlertCircle size={14} />
                      {errors.general}
                    </div>
                  )}

                  {status === 'error' && (
                    <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-sm text-destructive">
                      <AlertCircle size={14} />
                      Something went wrong. Please try emailing directly.
                    </div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        name="from_name"
                        placeholder="Name *"
                        value={form.name}
                        onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setErrors(er => ({ ...er, name: '' })); }}
                        className={`w-full px-4 py-3 rounded-xl bg-card border text-foreground placeholder:text-muted-foreground text-sm
                                   focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-200 ${errors.name ? 'border-destructive' : 'border-border'
                          }`}
                        maxLength={100}
                      />
                      {errors.name && <p className="text-xs text-destructive mt-1 font-mono-code">{errors.name}</p>}
                    </div>
                    <div>
                      <input
                        type="email"
                        name="from_email"
                        placeholder="Email *"
                        value={form.email}
                        onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setErrors(er => ({ ...er, email: '' })); }}
                        className={`w-full px-4 py-3 rounded-xl bg-card border text-foreground placeholder:text-muted-foreground text-sm
                                   focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-200 ${errors.email ? 'border-destructive' : 'border-border'
                          }`}
                        maxLength={255}
                      />
                      {errors.email && <p className="text-xs text-destructive mt-1 font-mono-code">{errors.email}</p>}
                    </div>
                  </div>

                  <div>
                    <textarea
                      name="message"
                      placeholder="Message *"
                      rows={5}
                      value={form.message}
                      onChange={e => { setForm(f => ({ ...f, message: e.target.value })); setErrors(er => ({ ...er, message: '' })); }}
                      className={`w-full px-4 py-3 rounded-xl bg-card border text-foreground placeholder:text-muted-foreground text-sm
                                 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-200 resize-none ${errors.message ? 'border-destructive' : 'border-border'
                        }`}
                      maxLength={1000}
                    />
                    {errors.message && <p className="text-xs text-destructive mt-1 font-mono-code">{errors.message}</p>}
                    <p className="text-[11px] text-muted-foreground mt-1 text-right font-mono-code">
                      {form.message.length}/1000
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full sm:w-auto btn-primary flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {status === 'sending' ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={14} />
                        Send Message
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
