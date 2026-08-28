import { useCallback, useRef, useState } from "react";
import Turnstile, { type TurnstileHandle } from "@/components/Turnstile";
import { appConfig } from "@/lib/appConfig";

type ContactFormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const initialFormState: ContactFormState = { name: "", email: "", subject: "", message: "" };

export default function ContactSection() {
  const siteKey = appConfig.turnstileSiteKey;
  const [formData, setFormData] = useState<ContactFormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileHandle>(null);

  // Stable identity: a new function each render would remount the widget.
  const handleTurnstileToken = useCallback((token: string | null) => {
    setTurnstileToken(token);
    if (token) setFieldError(null);
  }, []);

  const handleTurnstileError = useCallback(() => {
    setFieldError("Verification failed to load. Please refresh and try again.");
  }, []);

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

    if (!name || !email || !message) {
      setFieldError("Please fill in your name, email, and a message.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setFieldError("Please enter a valid email address.");
      return;
    }

    if (siteKey && !turnstileToken) {
      setFieldError("Please complete the verification challenge.");
      return;
    }

    setFieldError(null);
    setIsSubmitting(true);
    setShowSuccess(false);
    setSubmitError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message, turnstileToken }),
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
      // Turnstile tokens are single-use — always re-arm, success or failure.
      turnstileRef.current?.reset();
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" aria-labelledby="contact-title">
      <div className="section-head reveal"><h2 className="section-title" id="contact-title">Contact</h2></div>
      <div className="contact-new">
        <div className="reveal">
          <p className="contact-headline">Let&apos;s build<br />something<br /><em>real.</em></p>
          <p className="contact-sub">Open to freelance projects, collaborations, and interesting problems. Fill the form or reach out directly — I reply fast.</p>
        </div>
        <div className="reveal">
          <form id="contact-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group"><label className="form-label" htmlFor="cf-name">Name</label><input className="form-input" type="text" id="cf-name" name="name" placeholder="Your name" required maxLength={100} autoComplete="name" value={formData.name} onChange={handleChange} /></div>
            <div className="form-group"><label className="form-label" htmlFor="cf-email">Email</label><input className="form-input" type="email" id="cf-email" name="email" placeholder="you@example.com" required maxLength={200} autoComplete="email" value={formData.email} onChange={handleChange} /></div>
            <div className="form-group"><label className="form-label" htmlFor="cf-subject">Subject</label><input className="form-input" type="text" id="cf-subject" name="subject" placeholder="Project idea, collab, anything..." maxLength={200} value={formData.subject} onChange={handleChange} /></div>
            <div className="form-group"><label className="form-label" htmlFor="cf-msg">Message</label><textarea className="form-textarea" id="cf-msg" name="message" placeholder="Tell me what you're working on..." required maxLength={5000} value={formData.message} onChange={handleChange} /></div>
            {siteKey && (
              <div className="form-group">
                <Turnstile
                  ref={turnstileRef}
                  siteKey={siteKey}
                  action="contact"
                  onToken={handleTurnstileToken}
                  onError={handleTurnstileError}
                />
              </div>
            )}
            <button type="submit" className={`form-btn ${isSubmitting ? "sending" : ""}`} id="cf-btn" disabled={isSubmitting}>{isSubmitting ? "Sending…" : "Send Message →"}</button>
            {showSuccess && <div className="form-success" role="status">✓ Message sent — I&apos;ll get back to you soon.</div>}
            {fieldError && <div className="form-error" role="alert">{fieldError}</div>}
            {submitError && (
              <div className="form-error" role="alert">
                {submitError} — or email me directly at{" "}
                <a href="mailto:dev@nubcoders.com">dev@nubcoders.com</a>.
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
