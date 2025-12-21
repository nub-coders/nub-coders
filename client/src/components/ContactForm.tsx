import React from 'react';
import ScrollRevealText from './ScrollRevealText';

export default function ContactForm() {
  return (
    <section id="contact" className="py-16 max-w-4xl mx-auto">
      <h2 className="section-title">
        <ScrollRevealText text="Let's Work Together" />
      </h2>
      <p className="text-center text-lg text-[var(--light)]/70 max-w-2xl mx-auto mt-4 mb-12">
        Have a project in mind? Looking for a developer to join your team? 
        Let's discuss how I can help bring your ideas to life.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Info */}
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold mb-6">Get in Touch</h3>
          
          <a 
            href="mailto:dev@nubcoder.com"
            className="flex items-center gap-4 p-4 rounded-lg bg-[var(--dark)] hover:bg-[var(--dark)]/80 border border-[var(--primary)]/20 hover:border-[var(--primary)]/40 transition-all duration-300 group"
          >
            <div className="w-12 h-12 rounded-full bg-[var(--primary)]/10 flex items-center justify-center group-hover:bg-[var(--primary)]/20 transition-colors">
              <i className="fas fa-envelope text-[var(--primary)] text-xl"></i>
            </div>
            <div>
              <p className="text-sm text-[var(--light)]/60">Email</p>
              <p className="font-medium">dev@nubcoder.com</p>
            </div>
          </a>

          <a 
            href="https://t.me/nub_coder_s"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-4 p-4 rounded-lg bg-[var(--dark)] hover:bg-[var(--dark)]/80 border border-[var(--primary)]/20 hover:border-[var(--primary)]/40 transition-all duration-300 group"
          >
            <div className="w-12 h-12 rounded-full bg-[var(--primary)]/10 flex items-center justify-center group-hover:bg-[var(--primary)]/20 transition-colors">
              <i className="fab fa-telegram text-[var(--primary)] text-xl"></i>
            </div>
            <div>
              <p className="text-sm text-[var(--light)]/60">Telegram</p>
              <p className="font-medium">@nub_coder_s</p>
            </div>
          </a>

          <a 
            href="https://youtube.com/@nub-coder"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-4 p-4 rounded-lg bg-[var(--dark)] hover:bg-[var(--dark)]/80 border border-[var(--primary)]/20 hover:border-[var(--primary)]/40 transition-all duration-300 group"
          >
            <div className="w-12 h-12 rounded-full bg-[var(--primary)]/10 flex items-center justify-center group-hover:bg-[var(--primary)]/20 transition-colors">
              <i className="fab fa-youtube text-[var(--primary)] text-xl"></i>
            </div>
            <div>
              <p className="text-sm text-[var(--light)]/60">YouTube</p>
              <p className="font-medium">@nub-coder</p>
            </div>
          </a>
        </div>

        {/* Quick Info */}
        <div className="bg-[var(--dark)] rounded-xl p-8 border border-[var(--primary)]/20">
          <h3 className="text-xl font-semibold mb-6">Quick Info</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-[var(--light)]/60 mb-1">Location</p>
              <p className="font-medium">Remote / India</p>
            </div>
            <div>
              <p className="text-sm text-[var(--light)]/60 mb-1">Availability</p>
              <p className="font-medium">Open for freelance & contract work</p>
            </div>
            <div>
              <p className="text-sm text-[var(--light)]/60 mb-1">Response Time</p>
              <p className="font-medium">Usually within 24 hours</p>
            </div>
            <div className="pt-4 border-t border-[var(--primary)]/10">
              <p className="text-sm text-[var(--light)]/70 leading-relaxed">
                I'm always interested in hearing about new projects and opportunities. 
                Whether you have a question or just want to say hi, feel free to reach out!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}