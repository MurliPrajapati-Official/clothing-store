import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { ShieldCheck, Heart, Award } from 'lucide-react';

export default function About() {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-canvas text-body-text">
      <Helmet>
        <title>About Ovi Global | Premium Uniforms in Ranchi</title>
        <meta name="description" content="Ovi Global by WALRIE is a leading manufacturer and supplier of specialized school, hospital, and corporate uniforms in Ranchi." />
      </Helmet>

      <div className="container mx-auto px-4">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center mb-20"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-ink mb-6 tracking-tight">About Ovi Global</h1>
          <p className="text-xl text-muted font-light leading-relaxed">
            Ovi Global is a specialized uniform manufacturer in Ranchi (by WALRIE), providing high-quality attire for various sectors. We understand that a uniform is more than just clothing; it is a representation of your institution's identity and values. With years of expertise in garment manufacturing and tailoring, we provide top-tier uniform solutions.
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
          <h2 className="text-3xl font-bold text-ink mb-8 text-center tracking-tight">Why Choose Ovi Global in Ranchi?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8">
            <div>
              <h4 className="font-bold text-ink mb-2">Local Manufacturing Excellence</h4>
              <p className="text-muted text-sm font-light leading-relaxed">Our Ranchi-based facility ensures fast turnaround times and personalized service for all institutions in Jharkhand.</p>
            </div>
            <div>
              <h4 className="font-bold text-ink mb-2">WALRIE Quality Standards</h4>
              <p className="text-muted text-sm font-light leading-relaxed">Leveraging the legacy of WALRIE Gown Store, we use premium fabrics that last 2x longer than standard uniforms.</p>
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

        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl overflow-hidden aspect-video md:aspect-[21/9] relative shadow-xl"
        >
          <img
            src="https://picsum.photos/seed/about/1920/800"
            alt="Manufacturing Facility"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>
      </div>
    </div>
  );
}
