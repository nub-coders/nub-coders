import { FormEvent, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import ScrollRevealText from "./ScrollRevealText";

type ContactFormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const initialFormData: ContactFormData = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export default function ContactForm() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ContactFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to send message. Please try again.");
      }

      toast({
        title: "Success",
        description: result.message || "Your message has been sent successfully.",
        variant: "default",
      });
      setFormData(initialFormData);
    } catch (error) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred.";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-16 max-w-4xl mx-auto">
      <h2 className="section-title">
        <ScrollRevealText text="Let's Work Together" />
      </h2>
      <p className="text-center text-lg text-[var(--text-secondary)]/70 max-w-2xl mx-auto mt-4 mb-12">
        Have a project in mind? Looking for a developer to join your team?
        Let&apos;s discuss how I can help bring your ideas to life.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold mb-6">Get in Touch</h3>

          <a
            href="mailto:dev@nubcoder.com"
            className="flex items-center gap-4 p-4 rounded-2xl border border-[var(--glass-border)] bg-[var(--bg-card)] hover:border-[var(--primary)]/20 transition-all duration-300 group"
          >
            <div className="w-12 h-12 rounded-full bg-[var(--primary)]/12 flex items-center justify-center group-hover:bg-[var(--primary)]/18 transition-colors">
              <i className="fas fa-envelope text-[var(--secondary)] text-xl"></i>
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Email</p>
              <p className="font-medium">dev@nubcoder.com</p>
            </div>
          </a>

          <a
            href="https://t.me/nub_coder_s"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-4 p-4 rounded-2xl border border-[var(--glass-border)] bg-[var(--bg-card)] hover:border-[var(--primary)]/20 transition-all duration-300 group"
          >
            <div className="w-12 h-12 rounded-full bg-[var(--primary)]/12 flex items-center justify-center group-hover:bg-[var(--primary)]/18 transition-colors">
              <i className="fab fa-telegram text-[var(--secondary)] text-xl"></i>
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Telegram</p>
              <p className="font-medium">@nub_coder_s</p>
            </div>
          </a>

          <a
            href="https://youtube.com/@nub-coder"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-4 p-4 rounded-2xl border border-[var(--glass-border)] bg-[var(--bg-card)] hover:border-[var(--primary)]/20 transition-all duration-300 group"
          >
            <div className="w-12 h-12 rounded-full bg-[var(--primary)]/12 flex items-center justify-center group-hover:bg-[var(--primary)]/18 transition-colors">
              <i className="fab fa-youtube text-[var(--secondary)] text-xl"></i>
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)]">YouTube</p>
              <p className="font-medium">@nub-coder</p>
            </div>
          </a>
        </div>

        <div className="rounded-[28px] p-8 border border-[var(--glass-border)] bg-[var(--bg-card)] shadow-[0_18px_48px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,255,255,0.08),0_0_24px_rgba(245,246,247,0.04)]">
          <h3 className="text-xl font-semibold mb-6">Send a Message</h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm text-[var(--text-secondary)] mb-2">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-[var(--glass-border)] bg-[var(--bg-secondary)] px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--secondary)] transition-colors"
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm text-[var(--text-secondary)] mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-[var(--glass-border)] bg-[var(--bg-secondary)] px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--secondary)] transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm text-[var(--text-secondary)] mb-2">
                Subject
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-[var(--glass-border)] bg-[var(--bg-secondary)] px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--secondary)] transition-colors"
                placeholder="Project inquiry"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm text-[var(--text-secondary)] mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-[var(--glass-border)] bg-[var(--bg-secondary)] px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--secondary)] transition-colors resize-none"
                placeholder="Tell me about your project..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl border border-[var(--glass-border)] bg-[var(--primary)] px-4 py-3 text-[var(--accent)] font-semibold transition-all hover:bg-[var(--secondary)] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
