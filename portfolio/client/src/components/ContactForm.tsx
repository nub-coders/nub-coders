import { useState } from "react";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error on change
    if (errors[name as keyof FormErrors]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }
    
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Simulate form submission
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: ""
        });
        
        // Reset success message after 5 seconds
        setTimeout(() => {
          setIsSuccess(false);
        }, 5000);
      }, 1500);
    }
  };

  return (
    <section id="contact" className="py-16 max-w-6xl mx-auto">
      <h2 className="section-title">Get In Touch</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 bg-[var(--dark)] rounded-xl p-6 border border-[var(--primary)]/20 shadow-lg shadow-black/10">
          <h3 className="text-2xl font-semibold mb-6">Contact Info</h3>
          
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-[var(--primary)]/10 flex items-center justify-center shrink-0">
              <i className="fas fa-envelope text-[var(--primary)]"></i>
            </div>
            <div>
              <h4 className="font-medium mb-1">Email</h4>
              <p className="text-[var(--light)]/70">support@nubcoder.com</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-[var(--primary)]/10 flex items-center justify-center shrink-0">
              <i className="fas fa-map-marker-alt text-[var(--primary)]"></i>
            </div>
            <div>
              <h4 className="font-medium mb-1">Location</h4>
              <p className="text-[var(--light)]/70">Remote - Worldwide</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[var(--primary)]/10 flex items-center justify-center shrink-0">
              <i className="fas fa-clock text-[var(--primary)]"></i>
            </div>
            <div>
              <h4 className="font-medium mb-1">Working Hours</h4>
              <p className="text-[var(--light)]/70">Mon - Fri: 9:00 AM - 6:00 PM</p>
            </div>
          </div>
          
          <div className="mt-8">
            <h4 className="font-medium mb-4">Connect With Me</h4>
            <div className="flex gap-3">
                {/* GitHub button removed */}
              <a 
                href="https://t.me/nub_coder_s" 
                target="_blank" 
                rel="noreferrer" 
                className="w-10 h-10 rounded-full bg-[var(--primary)]/10 flex items-center justify-center hover:bg-[var(--primary)]/20 transition-all duration-300"
              >
                <i className="fab fa-telegram"></i>
              </a>
              <a 
                href="https://youtube.com/@nub-coder" 
                target="_blank" 
                rel="noreferrer" 
                className="w-10 h-10 rounded-full bg-[var(--primary)]/10 flex items-center justify-center hover:bg-[var(--primary)]/20 transition-all duration-300"
              >
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2 bg-[var(--dark)] rounded-xl p-6 border border-[var(--primary)]/20 shadow-lg shadow-black/10">
          <h3 className="text-2xl font-semibold mb-6">Send a Message</h3>
          
          {isSuccess ? (
            <div className="bg-green-500/20 text-green-400 p-4 rounded-lg mb-6 flex items-center">
              <i className="fas fa-check-circle mr-3"></i>
              <span>Your message has been sent successfully!</span>
            </div>
          ) : null}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="form-group">
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-[var(--light)]/80">Your Name</label>
                <input 
                  type="text" 
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full bg-[var(--darker)] border ${errors.name ? 'border-red-500' : 'border-[var(--primary)]/20'} rounded-lg p-3 text-[var(--light)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all duration-300`}
                  placeholder="John Doe"
                />
                {errors.name && (
                  <div className="text-red-500 text-sm mt-1">{errors.name}</div>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-[var(--light)]/80">Your Email</label>
                <input 
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full bg-[var(--darker)] border ${errors.email ? 'border-red-500' : 'border-[var(--primary)]/20'} rounded-lg p-3 text-[var(--light)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all duration-300`}
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <div className="text-red-500 text-sm mt-1">{errors.email}</div>
                )}
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="subject" className="block mb-2 text-sm font-medium text-[var(--light)]/80">Subject</label>
              <input 
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className={`w-full bg-[var(--darker)] border ${errors.subject ? 'border-red-500' : 'border-[var(--primary)]/20'} rounded-lg p-3 text-[var(--light)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all duration-300`}
                placeholder="Project Inquiry"
              />
              {errors.subject && (
                <div className="text-red-500 text-sm mt-1">{errors.subject}</div>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="message" className="block mb-2 text-sm font-medium text-[var(--light)]/80">Message</label>
              <textarea 
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                className={`w-full bg-[var(--darker)] border ${errors.message ? 'border-red-500' : 'border-[var(--primary)]/20'} rounded-lg p-3 text-[var(--light)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none transition-all duration-300`}
                placeholder="Your message here..."
              ></textarea>
              {errors.message && (
                <div className="text-red-500 text-sm mt-1">{errors.message}</div>
              )}
            </div>
            
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-6 py-3 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white font-medium rounded-lg hover:shadow-lg hover:shadow-[var(--primary)]/20 transform hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i> Sending...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane mr-2"></i> Send Message
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
