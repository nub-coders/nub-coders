import React, { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('idle');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto p-6 bg-gradient-to-br from-[var(--dark)] via-[var(--darker)] to-black rounded-xl shadow-lg border border-[var(--primary)]/20">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" required className="p-3 rounded-lg bg-[var(--darker)] text-[var(--light)] border border-[var(--primary)]/20 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all duration-300" />
        <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" required className="p-3 rounded-lg bg-[var(--darker)] text-[var(--light)] border border-[var(--primary)]/20 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all duration-300" />
        <input name="subject" value={formData.subject} onChange={handleChange} placeholder="Subject" required className="p-3 rounded-lg bg-[var(--darker)] text-[var(--light)] border border-[var(--primary)]/20 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all duration-300 md:col-span-2" />
        <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Message" required rows={4} className="p-3 rounded-lg bg-[var(--darker)] text-[var(--light)] border border-[var(--primary)]/20 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all duration-300 md:col-span-2" />
        <button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white font-medium rounded-lg px-6 py-3 md:col-span-2 hover:shadow-lg hover:shadow-[var(--primary)]/20 transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none">Send</button>
        {submitStatus === 'success' && <p className="text-green-400 bg-green-500/10 p-2 rounded-lg md:col-span-2 mt-2">Message sent!</p>}
        {submitStatus === 'error' && <p className="text-red-400 bg-red-500/10 p-2 rounded-lg md:col-span-2 mt-2">Error sending message.</p>}
      </form>
    </div>
  );
}
