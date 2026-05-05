import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Send } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import ContactSkeleton from '../components/layout/ContactSkeleton';

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  if (isLoading) {
    return <ContactSkeleton />;
  }

  return (
    <div className="pt-32 pb-24 min-h-screen bg-canvas text-body-text">
      <Helmet>
        <title>Contact Uniform Trends | Custom Bulk Uniform Orders India</title>
        <meta name="description" content="Get in touch with Uniform Trends for bulk orders of school, hospital, and corporate uniforms across India. High-quality custom tailoring By WEA." />
      </Helmet>

      <div className="container-custom max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-ink mb-6 tracking-tight">Get in Touch with Uniform Trends</h1>
          <p className="text-lg text-muted max-w-2xl mx-auto font-light">
            Ready to upgrade your institution's wardrobe? Contact us today to discuss bulk orders, custom designs, and fabric swatches. Our team is ready to assist you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-8"
          >
            <div className="bg-surface-card p-8 rounded-3xl border border-hairline shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-surface-elevated rounded-full flex items-center justify-center shrink-0 text-primary">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-ink mb-1">Phone</h3>
                  <p className="text-muted font-light mb-2">Mon-Fri from 9am to 6pm.</p>
                  <a href="tel:07004301436" className="text-primary font-medium hover:underline">07004301436</a>
                </div>
              </div>
            </div>

            <div className="bg-surface-card p-8 rounded-3xl border border-hairline shadow-[0_4px_20_rgba(0,0,0,0.02)]">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-surface-elevated rounded-full flex items-center justify-center shrink-0 text-primary">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-ink mb-1">Email</h3>
                  <p className="text-muted font-light mb-2">Our friendly team is here to help.</p>
                  <a href="mailto:contact@uniformtrendsbywea.com" className="text-primary font-medium hover:underline">contact@uniformtrendsbywea.com</a>
                </div>
              </div>
            </div>

            <div className="bg-surface-card p-8 rounded-3xl border border-hairline shadow-[0_4px_20_rgba(0,0,0,0.02)]">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-surface-elevated rounded-full flex items-center justify-center shrink-0 text-primary">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-ink mb-1">Office</h3>
                  <p className="text-muted font-light mb-2">Come say hello at our HQ.</p>
                  <address className="not-italic text-ink font-medium">
                    Uniform Trends (By WEA)<br />
                    India
                  </address>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3 bg-surface-card p-8 md:p-12 rounded-3xl border border-hairline shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
          >
            {isSubmitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                  <Send size={32} />
                </div>
                <h3 className="text-2xl font-bold text-ink">Inquiry Submitted!</h3>
                <p className="text-muted font-light">Thank you for Reaching out. Our team will get back to you within 24 hours.</p>
                <button onClick={() => setIsSubmitted(false)} className="btn-secondary mt-4">
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-ink">Full Name</label>
                    <input required type="text" className="w-full bg-canvas border border-hairline-strong rounded-xl px-4 py-3 focus:border-primary outline-none transition-colors" placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-ink">Email Address</label>
                    <input required type="email" className="w-full bg-canvas border border-hairline-strong rounded-xl px-4 py-3 focus:border-primary outline-none transition-colors" placeholder="john@company.com" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-ink">Phone Number</label>
                    <input required type="tel" className="w-full bg-canvas border border-hairline-strong rounded-xl px-4 py-3 focus:border-primary outline-none transition-colors" placeholder="+91xxxxxxxxxx" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-ink">Institution/Company Name</label>
                    <input required type="text" className="w-full bg-canvas border border-hairline-strong rounded-xl px-4 py-3 focus:border-primary outline-none transition-colors" placeholder="Enter" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-ink">Category of Interest</label>
                  <select required className="w-full bg-canvas border border-hairline-strong rounded-xl px-4 py-3 focus:border-primary outline-none transition-colors appearance-none">
                    <option value="" disabled selected>Select a category...</option>
                    <option value="school">School Uniforms</option>
                    <option value="college">College Wear</option>
                    <option value="corporate">Corporate Attire</option>
                    <option value="hospital">Hospital Staff Uniforms</option>
                    <option value="hotels">Hotels & Hospitality</option>
                    <option value="factory">Industrial & Factory</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-ink">Message / Bulk Order Details</label>
                  <textarea required rows={5} className="w-full bg-canvas border border-hairline-strong rounded-xl px-4 py-3 focus:border-primary outline-none transition-colors resize-none" placeholder="Tell us about your requirements, sizes, quantities..."></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary py-4 text-base shadow-[0_8px_30px_rgba(0,0,0,0.1)] flex items-center justify-center gap-2"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
