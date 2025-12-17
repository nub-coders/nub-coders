import React from 'react';
import ContactForm from '../components/ContactForm.jsx';

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-16">
      <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
      <div className="w-full max-w-xl">
        <ContactForm />
      </div>
    </div>
  );
}
