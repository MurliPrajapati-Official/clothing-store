import SEO from '../components/layout/SEO';
import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Send } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import ContactSkeleton from '../components/layout/ContactSkeleton';
import { CATEGORIES } from '../constants';

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.append("access_key", "8190947b-d4f0-4b2b-9e41-e8a594d8b734");
    formData.append("from_name", "Uniform Trends");
    formData.append("subject", `New Bulk Order Inquiry from ${formData.get("name")}`);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Accept": "application/json"
        },
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setIsSubmitted(true);
        setError(null);
      } else {
        setError(data.message || "Form submission failed. Please check your Web3Forms configuration.");
      }
    } catch (err) {
      setError("Failed to submit form. Please check your internet connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <ContactSkeleton />;
  }

  return (
    <div className="pt-32 pb-24 min-h-screen bg-canvas text-body-text">
      <SEO
        title="Contact Uniform Trends | Custom Bulk Uniform Orders India"
        description="Get in touch with Uniform Trends for bulk orders of school, hospital, and corporate uniforms across India. High-quality custom tailoring."
      />

      <div className="container-custom">
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
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-8"
          >
            <div className="bg-surface-card p-8 rounded-none border border-hairline shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-surface-elevated rounded-none border border-hairline flex items-center justify-center shrink-0 text-ink">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-ink mb-1">Phone</h3>
                  <p className="text-muted font-light mb-2">Mon-Fri from 9am to 6pm.</p>
                  <a href="tel:07004301436" className="text-ink font-semibold hover:underline">07004301436</a>
                </div>
              </div>
            </div>

            <div className="bg-surface-card p-8 rounded-none border border-hairline shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-surface-elevated rounded-none border border-hairline flex items-center justify-center shrink-0 text-ink">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-ink mb-1">Email</h3>
                  <p className="text-muted font-light mb-2">Our friendly team is here to help.</p>
                  <a href="mailto:uniformtrends01@gmail.com" className="text-ink font-semibold hover:underline">uniformtrends01@gmail.com</a>
                </div>
              </div>
            </div>

            <div className="bg-surface-card p-8 rounded-none border border-hairline shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-surface-elevated rounded-none border border-hairline flex items-center justify-center shrink-0 text-ink">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-ink mb-1">Office</h3>
                  <p className="text-muted font-light mb-2">Come say hello at our HQ.</p>
                  <address className="not-italic text-ink font-medium">
                    Uniform Trends<br />
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
            className="lg:col-span-3 bg-surface-card p-8 md:p-12 rounded-none border border-hairline shadow-xl"
          >
            {isSubmitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-20 h-20 bg-emerald-500/10 text-success rounded-none border border-emerald-500/20 flex items-center justify-center">
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
                    <input name="name" required type="text" className="w-full bg-canvas border border-hairline-strong rounded-none px-4 py-3 focus:border-ink outline-none transition-colors" placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-ink">Email Address</label>
                    <input name="email" required type="email" className="w-full bg-canvas border border-hairline-strong rounded-none px-4 py-3 focus:border-ink outline-none transition-colors" placeholder="john@company.com" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-ink">Phone Number</label>
                    <input name="phone" required type="tel" className="w-full bg-canvas border border-hairline-strong rounded-none px-4 py-3 focus:border-ink outline-none transition-colors" placeholder="+91xxxxxxxxxx" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-ink">Institution/Company Name</label>
                    <input name="company" required type="text" className="w-full bg-canvas border border-hairline-strong rounded-none px-4 py-3 focus:border-ink outline-none transition-colors" placeholder="Enter" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-ink">Category of Interest</label>
                  <select name="category" required className="w-full bg-canvas border border-hairline-strong rounded-none px-4 py-3 focus:border-ink outline-none transition-colors appearance-none">
                    <option value="" disabled selected>Select a category...</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat.toLowerCase()}>{cat} Uniforms</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-ink">Message / Bulk Order Details</label>
                  <textarea name="message" required rows={5} className="w-full bg-canvas border border-hairline-strong rounded-none px-4 py-3 focus:border-ink outline-none transition-colors resize-none" placeholder="Tell us about your requirements, sizes, quantities..."></textarea>
                </div>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-4 bg-red-500/10 border border-red-500/20 text-m-red rounded-none text-sm font-medium"
                  >
                    {error}
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary py-4 text-base shadow-md flex items-center justify-center gap-2"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
                </button>
              </form>
            )}
          </motion.div>
        </div>

        {/* Detailed FAQ / Guidelines Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 max-w-5xl mx-auto border-t border-hairline pt-16"
        >
          <h2 className="text-3xl font-bold text-ink mb-10 text-center tracking-tight">Bulk Ordering & Corporate Procurement</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-muted font-light leading-relaxed text-sm">
            <div>
              <h4 className="font-bold text-ink mb-2 text-base">Customization & Computerized Embroidery</h4>
              <p className="mb-4">
                Uniform Trends offers advanced computerized embroidery and high-definition screen printing solutions. You can upload or email your vector logos (.SVG, .AI, or .EPS), and our digital layout artists will configure thread colors (utilizing Pantone matching systems) to guarantee perfect brand alignment.
              </p>
              <p>
                We provide physical and digital embroidery proofs for admin signatures before outfitting. This custom branding is available for blazers, shirts, aprons, lab coats, and safety vests.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-ink mb-2 text-base">Fabric Sample Dispatch & Fitting Sessions</h4>
              <p className="mb-4">
                To help schools and clinical committees make informed decisions, we dispatch free sample folders containing premium fabric swatches (varying by weight, cotton-polyester ratio, and colors).
              </p>
              <p>
                Additionally, for bulk purchases exceeding 200 units, we organize on-premise fitting sessions at your administrative site in major cities (Mumbai, Delhi, Bangalore, etc.) to ensure that every employee or student obtains a comfortable size fit.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-ink mb-2 text-base">B2B Institutional Volume Discount & Credit Terms</h4>
              <p className="mb-4">
                As a primary manufacturer, we provide direct pricing to institutional buyers. Bulk orders of 100+ sets qualify for standard volume discounts. For approved corporate entities, school trusts, and hospital chains, we offer flexible B2B Net 30 payment schedules.
              </p>
              <p>
                Please include your GST details in your query or email to ensure that commercial tax invoices are generated correctly for compliance.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-ink mb-2 text-base">Manufacturing Lead Times & Urgent Handover</h4>
              <p className="mb-4">
                Standard lead times for customized bulk uniforms range from 3 to 4 weeks, depending on the complexity and volume of customization. This includes custom fabric dyeing, stitching, quality inspection, and packaging.
              </p>
              <p>
                For urgent requirements (such as sports tournaments or corporate annual handovers), please contact our emergency service line directly. We will evaluate our factory capacity to prioritize your production.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
