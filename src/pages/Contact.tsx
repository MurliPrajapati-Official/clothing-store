import React, { useState } from 'react';
import SEO from '../components/layout/SEO';
import { Mail, Phone, MapPin, Send, CheckCircle2, Clock, MessageSquare, ChevronDown } from 'lucide-react';
import { STORE_NAME } from '../constants';
import { cn } from '../lib/utils';

const FAQS = [
  {
    q: 'What are your delivery timelines?',
    a: 'We dispatch all orders within 24 to 48 hours. Standard domestic delivery arrives within 3 to 5 business days across all major Indian metro and tier-1/2 cities.'
  },
  {
    q: 'How does your 30-day return policy work?',
    a: 'If any garment does not fit as expected or you wish to exchange for a different size, navigate to My Account > Orders and initiate an exchange or return pickup. Our courier partner will collect the parcel from your doorstep.'
  },
  {
    q: 'How do I choose the correct size for oversized tees and hoodies?',
    a: 'Our oversized tees and hoodies are intentionally cut with a relaxed drop-shoulder silhouette. Choose your regular standard size for the intended modern boxy fit, or size down if you prefer a slim-tailored look.'
  },
  {
    q: 'Do you offer bulk or bespoke styling orders?',
    a: 'Yes, for studio orders, corporate teams, or bulk boutique wholesale, please reach out via our contact form with order volume details.'
  }
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 6000);
  };

  return (
    <div className="pt-28 pb-24 bg-canvas min-h-screen">
      <SEO
        title={`Contact & Customer Support | ${STORE_NAME}`}
        description={`Get in touch with ${STORE_NAME} for sizing consultations, order tracking support, or showroom visits.`}
      />

      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-xs uppercase font-bold tracking-widest text-muted block">Support & Inquiries</span>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-ink">
            We're Here to Help.
          </h1>
          <p className="text-sm text-muted leading-relaxed">
            Have questions about a fit, custom tailoring request, or need help tracking an order? Reach out to our concierge team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          {/* Contact Details & Showrooms (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-hairline p-8 space-y-6">
              <h2 className="text-sm font-black uppercase tracking-widest text-ink pb-4 border-b border-hairline">
                Concierge Channels
              </h2>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-surface-soft border border-hairline shrink-0">
                    <Mail size={18} className="text-ink" />
                  </div>
                  <div>
                    <span className="font-bold uppercase text-ink block mb-0.5">Email Inquiries</span>
                    <p className="text-muted">care@clothingstore.com</p>
                    <p className="text-muted text-[10px]">Average reply time: under 3 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-surface-soft border border-hairline shrink-0">
                    <Phone size={18} className="text-ink" />
                  </div>
                  <div>
                    <span className="font-bold uppercase text-ink block mb-0.5">Client Line & WhatsApp</span>
                    <p className="text-muted">+91 98765 43210</p>
                    <p className="text-muted text-[10px]">Mon – Sat: 9:00 AM – 7:00 PM IST</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-surface-soft border border-hairline shrink-0">
                    <MapPin size={18} className="text-ink" />
                  </div>
                  <div>
                    <span className="font-bold uppercase text-ink block mb-0.5">Flagship Studio Showroom</span>
                    <p className="text-muted">402 Atelier Design Quarter, Bandra West, Mumbai, MH - 400050</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-hairline p-8">
            <h2 className="text-sm font-black uppercase tracking-widest text-ink pb-4 border-b border-hairline mb-6">
              Send a Direct Message
            </h2>

            {submitted ? (
              <div className="p-6 bg-surface-card border border-ink text-center space-y-3">
                <CheckCircle2 size={32} className="mx-auto text-ink" />
                <h3 className="text-base font-bold text-ink uppercase">Message Received</h3>
                <p className="text-xs text-muted">
                  Thank you for contacting us. A client support specialist will respond to your registered email shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-muted mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Alex Morgan"
                      className="w-full bg-canvas border border-hairline px-4 py-3 text-xs text-ink outline-none focus:border-ink"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-muted mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="alex@example.com"
                      className="w-full bg-canvas border border-hairline px-4 py-3 text-xs text-ink outline-none focus:border-ink"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-muted mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Sizing advice, Order inquiry, or Custom styling"
                    className="w-full bg-canvas border border-hairline px-4 py-3 text-xs text-ink outline-none focus:border-ink"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-muted mb-1">Message *</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How can we assist your wardrobe today?"
                    className="w-full bg-canvas border border-hairline px-4 py-3 text-xs text-ink outline-none focus:border-ink resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary py-4 px-8 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <Send size={14} />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* FAQs */}
        <div className="border-t border-hairline pt-16">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-ink">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-muted">Quick answers to common questions about our clothing and orders.</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="border border-hairline bg-white">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left text-xs font-bold uppercase tracking-wider text-ink hover:bg-surface-elevated transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown size={16} className={cn("transition-transform duration-200", openFaq === idx && "rotate-180")} />
                </button>
                {openFaq === idx && (
                  <div className="p-5 pt-0 text-xs text-muted leading-relaxed border-t border-hairline bg-canvas">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
