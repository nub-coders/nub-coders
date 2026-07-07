import { useState } from "react";
import { contactLinks } from "@/data/contactLinks";

type ContactFormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const initialFormState: ContactFormState = { name: "", email: "", subject: "", message: "" };

export default function ContactSection() {
  const [formData, setFormData] = useState<ContactFormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = formData.name.trim();
    const email = formData.email.trim();
    const subject = formData.subject.trim();
    const message = formData.message.trim();

    if (!name || !email || !message) return;

    setIsSubmitting(true);
    setShowSuccess(false);
    setSubmitError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });

      const result = await response.json().catch(() => ({} as { success?: boolean; error?: string }));

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Request failed");
      }

      setFormData(initialFormState);
      setShowSuccess(true);
    } catch (error) {
      const messageText = error instanceof Error ? error.message : "Failed to send message.";
      setSubmitError(messageText);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact">
      <div className="section-head reveal"><span className="section-num">06</span><div className="section-line" /><h2 className="section-title">Contact</h2></div>
      <div className="contact-new">
        <div className="reveal">
          <p className="contact-headline">Let&apos;s build<br />something<br /><em>real.</em></p>
          <p className="contact-sub" style={{ marginBottom: "2rem" }}>Open to freelance projects, collaborations, and interesting problems. Fill the form or reach out directly — I reply fast.</p>
          <div className="links-list">
            {contactLinks.map((link) => (
              <a key={link.label} href={link.href} target={link.href.startsWith("mailto:") ? undefined : "_blank"} rel={link.href.startsWith("mailto:") ? undefined : "noopener noreferrer"} className="contact-link">
                <div className="contact-link-left"><span className="contact-link-label">{link.label}</span><span className="contact-link-value">{link.value}</span></div>
                <span className="contact-link-arrow" aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        </div>
        <div className="reveal">
          <form id="contact-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group"><label className="form-label" htmlFor="cf-name">Name</label><input className="form-input" type="text" id="cf-name" name="name" placeholder="Your name" required autoComplete="name" value={formData.name} onChange={handleChange} /></div>
            <div className="form-group"><label className="form-label" htmlFor="cf-email">Email</label><input className="form-input" type="email" id="cf-email" name="email" placeholder="you@example.com" required autoComplete="email" value={formData.email} onChange={handleChange} /></div>
            <div className="form-group"><label className="form-label" htmlFor="cf-subject">Subject</label><input className="form-input" type="text" id="cf-subject" name="subject" placeholder="Project idea, collab, anything..." value={formData.subject} onChange={handleChange} /></div>
            <div className="form-group"><label className="form-label" htmlFor="cf-msg">Message</label><textarea className="form-textarea" id="cf-msg" name="message" placeholder="Tell me what you're working on..." required value={formData.message} onChange={handleChange} /></div>
            <button type="submit" className={`form-btn ${isSubmitting ? "sending" : ""}`} id="cf-btn" disabled={isSubmitting}>{isSubmitting ? "Sending…" : "Send Message →"}</button>
            {showSuccess && <div className="form-success" role="status">✓ Message sent — I&apos;ll get back to you soon.</div>}
            {submitError && <div className="form-error" role="alert">{submitError}</div>}
          </form>
        </div>
      </div>
    </section>
  );
}
