import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { ShieldCheck, Heart, Award } from 'lucide-react';

export default function About() {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-canvas text-body-text">
      <Helmet>
        <title>About Us | Ovi Global Uniform</title>
        <meta name="description" content="About Ovi Global Uniform - A trusted manufacturer and supplier of specialized uniforms across various sectors." />
      </Helmet>

      <div className="container mx-auto px-4">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center mb-20"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-ink mb-6 tracking-tight">About Ovi Global Uniform</h1>
          <p className="text-xl text-muted font-light leading-relaxed">
            Ovi Global Uniform is a trusted manufacturer and supplier of specialized uniforms. We understand that a uniform is more than just clothing; it is a representation of your institution's identity and values. With years of expertise in garment manufacturing and tailoring, we have expanded our vision to provide top-tier uniform solutions across various sectors.
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
