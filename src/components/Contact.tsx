import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Github, Linkedin, Mail } from 'lucide-react';
import { personalInfo } from '@/lib/portfolio-data';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast({ title: "Missing fields", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }
    toast({ title: "Message sent!", description: "Thanks for reaching out. I'll get back to you soon." });
    setForm({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Get In<span className="text-gradient"> Touch</span>
          </h2>
          <div className="w-16 h-1 bg-primary rounded-full mb-8" />
        </motion.div>

        <div className="flex gap-4 mb-8">
          <a href={personalInfo.github} target="_blank" rel="noopener noreferrer"
            className="w-12 h-12 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary transition-colors">
            <Github size={20} />
          </a>
          <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer"
            className="w-12 h-12 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary transition-colors">
            <Linkedin size={20} />
          </a>
          <a href={`mailto:${personalInfo.email}`}
            className="w-12 h-12 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary transition-colors">
            <Mail size={20} />
          </a>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Name *"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow text-sm"
              maxLength={100}
            />
            <input
              type="email"
              placeholder="Email *"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow text-sm"
              maxLength={255}
            />
          </div>
          <input
            type="tel"
            placeholder="Phone (optional)"
            value={form.phone}
            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow text-sm"
            maxLength={20}
          />
          <textarea
            placeholder="Message *"
            rows={5}
            value={form.message}
            onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow text-sm resize-none"
            maxLength={1000}
          />
          <button
            type="submit"
            className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity flex items-center gap-2 glow-sm"
          >
            <Send size={16} /> Send Message
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
