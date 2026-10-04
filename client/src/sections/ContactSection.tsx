import { useCallback, useRef, useState } from "react";
import Turnstile, { type TurnstileHandle } from "@/components/Turnstile";
import { appConfig } from "@/lib/appConfig";
import { contactLinks } from "@/data/contactLinks";
import "./contact.css";

type ContactFormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type FieldErrors = Partial<Record<"name" | "email" | "message", string>>;

const initialFormState: ContactFormState = { name: "", email: "", subject: "", message: "" };

export default function ContactSection() {
  const siteKey = appConfig.turnstileSiteKey;
  const [formData, setFormData] = useState<ContactFormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileHandle>(null);
  const verificationRef = useRef<HTMLDivElement>(null);

  const handleTurnstileToken = useCallback((token: string | null) => {
    setTurnstileToken(token);
    if (token) setVerificationError(null);
  }, []);

  const handleTurnstileError = useCallback(() => {
    setTurnstileToken(null);
    setVerificationError("Verification failed to load. Please refresh and try again.");
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
    setFieldError(null);
    setShowSuccess(false);
    if (name === "name" || name === "email" || name === "message") {
      setFieldErrors((previous) => ({ ...previous, [name]: undefined }));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    setSubmitError(null);
    setShowSuccess(false);

    const form = event.currentTarget;
    const focusField = (field: keyof ContactFormState) => {
      const input = form.elements.namedItem(field);
      if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) {
        input.focus();
      }
    };

    const name = formData.name.trim();
    const email = formData.email.trim();
    const subject = formData.subject.trim();
    const message = formData.message.trim();

    if (!name || !email || !message) {
      setFieldErrors({
        ...(!name && { name: "Enter your name." }),
        ...(!email && { email: "Enter your email address." }),
        ...(!message && { message: "Add a message to continue." }),
      });
      setFieldError("Please fill in your name, email, and a message.");
      focusField(!name ? "name" : !email ? "email" : "message");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setFieldErrors({ email: "Use the format you@example.com." });
      setFieldError("Please enter a valid email address.");
      focusField("email");
      return;
    }

    setFieldErrors({});
    setFieldError(null);

    if (siteKey && !turnstileToken) {
      setVerificationError("Please complete the verification challenge.");
      verificationRef.current?.focus();
      return;
    }

    setVerificationError(null);
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
      turnstileRef.current?.reset();
      setTurnstileToken(null);
      setIsSubmitting(false);
    }
  };

  return (
    <section className="contact-section" id="contact" aria-labelledby="contact-title">
      <div className="section-shell">
        <div className="contact-panel">
          <div className="contact-copy">
            <h2 className="contact-eyebrow" id="contact-title">Contact</h2>
            <p className="contact-headline">Have something <span>in mind?</span></p>
            <p className="contact-intro">
              A system to build, a tool to rethink, or an idea worth exploring.
              Let&apos;s find a good way forward.
            </p>
            <p className="contact-scope">
              Systems engineering, developer tools, and infrastructure consulting.
            </p>

            <div className="contact-direct">
              <p className="contact-direct-title">Prefer a direct line?</p>
              <nav className="contact-channels" aria-label="Direct channels">
                {contactLinks.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith("mailto:") ? undefined : "_blank"}
                    rel={item.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                    className="contact-channel"
                  >
                    <span className="contact-channel-title">
                      {item.label}<span aria-hidden="true">↗</span>
                    </span>
                    <span className="contact-channel-value">{item.value}</span>
                  </a>
                ))}
              </nav>
            </div>
          </div>

          <form className="contact-form" id="contact-form" onSubmit={handleSubmit} aria-busy={isSubmitting} noValidate>
            <div className="contact-form-header">
              <span className="contact-form-kicker">A new conversation</span>
              <h3 className="contact-form-title">Tell us about it.</h3>
              <p>Name, email, and message are required.</p>
            </div>

            <div className="contact-field-pair">
              <div className="contact-field">
                <label className="contact-label" htmlFor="cf-name">Name</label>
                <input
                  className="contact-input"
                  type="text"
                  id="cf-name"
                  name="name"
                  placeholder="Your name"
                  required
                  maxLength={100}
                  autoComplete="name"
                  disabled={isSubmitting}
                  aria-invalid={Boolean(fieldErrors.name)}
                  aria-describedby={fieldErrors.name ? "cf-name-error" : undefined}
                  value={formData.name}
                  onChange={handleChange}
                />
                {fieldErrors.name && <p className="contact-field-error" id="cf-name-error">{fieldErrors.name}</p>}
              </div>
              <div className="contact-field">
                <label className="contact-label" htmlFor="cf-email">Email</label>
                <input
                  className="contact-input"
                  type="email"
                  id="cf-email"
                  name="email"
                  placeholder="you@example.com"
                  required
                  maxLength={200}
                  autoComplete="email"
                  disabled={isSubmitting}
                  aria-invalid={Boolean(fieldErrors.email)}
                  aria-describedby={fieldErrors.email ? "cf-email-error" : undefined}
                  value={formData.email}
                  onChange={handleChange}
                />
                {fieldErrors.email && <p className="contact-field-error" id="cf-email-error">{fieldErrors.email}</p>}
              </div>
            </div>
            <div className="contact-field">
              <div className="contact-label-row">
                <label className="contact-label" htmlFor="cf-subject">Subject</label>
                <span className="contact-field-note" id="cf-subject-note">Optional</span>
              </div>
              <input
                className="contact-input"
                type="text"
                id="cf-subject"
                name="subject"
                placeholder="Project idea, collaboration..."
                maxLength={200}
                disabled={isSubmitting}
                aria-describedby="cf-subject-note"
                value={formData.subject}
                onChange={handleChange}
              />
            </div>
            <div className="contact-field">
              <label className="contact-label" htmlFor="cf-msg">Message</label>
              <textarea
                className="contact-input contact-textarea"
                id="cf-msg"
                name="message"
                placeholder="What are you working on? What would you like to build?"
                required
                maxLength={5000}
                rows={5}
                disabled={isSubmitting}
                aria-invalid={Boolean(fieldErrors.message)}
                aria-describedby={fieldErrors.message ? "cf-msg-note cf-msg-error" : "cf-msg-note"}
                value={formData.message}
                onChange={handleChange}
              />
              <p className="contact-field-note" id="cf-msg-note">A little context is a great place to start.</p>
              {fieldErrors.message && <p className="contact-field-error" id="cf-msg-error">{fieldErrors.message}</p>}
            </div>
            
            {siteKey && (
              <div
                className="contact-verification"
                ref={verificationRef}
                tabIndex={-1}
                role="group"
                aria-label="Verification challenge"
                aria-describedby={verificationError ? "cf-verification-error" : undefined}
              >
                <Turnstile
                  ref={turnstileRef}
                  siteKey={siteKey}
                  action="contact"
                  onToken={handleTurnstileToken}
                  onError={handleTurnstileError}
                />
              </div>
            )}

            {fieldError && (
              <div className="contact-feedback contact-feedback-error" role="alert">
                {fieldError}
              </div>
            )}

            {verificationError && (
              <div className="contact-feedback contact-feedback-error" id="cf-verification-error" role="alert">
                {verificationError}
              </div>
            )}

            <button
              type="submit"
              className="contact-submit"
              id="cf-btn"
              disabled={isSubmitting}
            >
              <span>{isSubmitting ? "Sending…" : "Send Message"}</span>
              <span aria-hidden="true">{isSubmitting ? "···" : "↗"}</span>
            </button>
            
            {showSuccess && (
              <div className="contact-feedback contact-feedback-success" role="status">
                <strong>Message sent.</strong> Thanks for getting in touch.
              </div>
            )}
            
            {submitError && (
              <div className="contact-feedback contact-feedback-error" role="alert">
                {submitError} — or email directly at{" "}
                <a href="mailto:dev@nubcoders.com">dev@nubcoders.com</a>.
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
