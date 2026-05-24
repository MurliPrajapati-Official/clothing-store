import SEO from '../components/layout/SEO';
import { motion } from 'motion/react';
import { ShieldCheck, Heart, Award } from 'lucide-react';
import { useState, useEffect } from 'react';
import AboutSkeleton from '../components/layout/AboutSkeleton';

export default function About() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <AboutSkeleton />;
  }

  return (
    <div className="pt-32 pb-24 min-h-screen bg-canvas text-body-text">
      <SEO
        title="About Uniform Trends | Premium Uniforms in India"
        description="Uniform Trends is a leading manufacturer and supplier of specialized school, hospital, and corporate uniforms across India."
      />

      <div className="container mx-auto px-4">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center mb-20"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-ink mb-6 tracking-tight">About Uniform Trends</h1>
          <p className="text-xl text-muted font-light leading-relaxed">
            Uniform Trends is a specialized uniform manufacturer in India, providing high-quality attire for various sectors. We understand that a uniform is more than just clothing; it is a representation of your institution's identity and values. With years of expertise in garment manufacturing and tailoring, we provide top-tier uniform solutions.
          </p>
        </motion.div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-surface-card p-10 rounded-3xl border border-hairline shadow-[0_4px_20px_rgba(0,0,0,0.02)]"
          >
            <div className="w-16 h-16 bg-surface-elevated rounded-full flex items-center justify-center mb-6 text-primary">
              <Heart size={28} />
            </div>
            <h3 className="text-2xl font-bold text-ink mb-4">Our Mission</h3>
            <p className="text-muted font-light leading-relaxed">
              To deliver high-quality, functional, and stylish uniforms that meet the rigorous demands of daily academic, medical, and administrative environments.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-surface-card p-10 rounded-3xl border border-hairline shadow-[0_4px_20px_rgba(0,0,0,0.02)]"
          >
            <div className="w-16 h-16 bg-surface-elevated rounded-full flex items-center justify-center mb-6 text-primary">
              <ShieldCheck size={28} />
            </div>
            <h3 className="text-2xl font-bold text-ink mb-4">Our Vision</h3>
            <p className="text-muted font-light leading-relaxed">
              To be the leading global uniform provider recognized for uncompromising quality, exceptional customer service, and innovative fabric solutions.
            </p>
          </motion.div>
        </div>

        {/* Local SEO Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-24"
        >
          <h2 className="text-3xl font-bold text-ink mb-8 text-center tracking-tight">Why Choose Uniform Trends?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8">
            <div>
              <h4 className="font-bold text-ink mb-2">Local Manufacturing Excellence</h4>
              <p className="text-muted text-sm font-light leading-relaxed">Our advanced manufacturing facility ensures fast turnaround times and personalized service for all institutions across the nation.</p>
            </div>
            <div>
              <h4 className="font-bold text-ink mb-2">Premium Quality Standards</h4>
              <p className="text-muted text-sm font-light leading-relaxed">We use premium fabrics that last 2x longer than standard uniforms, ensuring peak performance and comfort.</p>
            </div>
            <div>
              <h4 className="font-bold text-ink mb-2">Custom Tailoring for All</h4>
              <p className="text-muted text-sm font-light leading-relaxed">From primary school blazers to specialized medical scrubs, we offer custom fitting sessions at your premises.</p>
            </div>
            <div>
              <h4 className="font-bold text-ink mb-2">Industrial Grade Durability</h4>
              <p className="text-muted text-sm font-light leading-relaxed">Our uniforms are designed to withstand the daily rigors of factory floors and active school environments.</p>
            </div>
          </div>
        </motion.div>

        {/* Serving Nationwide Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-24 text-center"
        >
          <h2 className="text-3xl font-bold text-ink mb-6 tracking-tight">Serving Nationwide</h2>
          <p className="text-lg text-muted font-light leading-relaxed mb-10">
            While we are headquartered centrally, we supply premium school and corporate uniforms to major cities across India. Whether you are looking for <strong>school uniforms in Mumbai</strong>, <strong>corporate shirts in Delhi</strong>, or <strong>hospital scrubs in Bangalore</strong>, our logistics network ensures timely delivery of bulk orders.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Kolkata', 'Chennai', 'Hyderabad'].map(city => (
              <span key={city} className="px-6 py-2 rounded-full bg-surface-card border border-hairline text-ink text-sm font-medium">
                Uniforms in {city}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl overflow-hidden aspect-video md:aspect-[21/9] relative shadow-xl"
        >
          <img
            src="https://picsum.photos/seed/about/1920/800"
            alt="Premium Uniform Manufacturing Facility India"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>
      </div>
    </div>
  );
}
