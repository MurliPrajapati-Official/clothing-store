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
          <p className="text-xl text-muted font-light leading-relaxed mb-6">
            Uniform Trends is a premier specialized uniform manufacturer in India, dedicated to providing top-tier attire for schools, corporate businesses, hospitals, and heavy industrial sectors. We understand that a uniform represents more than just everyday clothing; it is a visual statement of your organization's core values, commitment to excellence, and unified team spirit.
          </p>
          <p className="text-base text-muted font-light leading-relaxed">
            With over a decade of hands-on expertise in textile sourcing, computerized embroidery, custom tailoring, and large-scale manufacturing, our mission is to deliver durable and comfortable clothing solutions that align with the rigorous requirements of modern academic, administrative, and clinical environments. We build partnerships with organizations across India, delivering custom fits that look sharp and feel exceptional.
          </p>
        </motion.div>

        {/* Brand Story Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-24 bg-surface-card p-8 md:p-12 rounded-3xl border border-hairline shadow-sm"
        >
          <h2 className="text-3xl font-bold text-ink mb-6 tracking-tight">Our Journey & Manufacturing Principles</h2>
          <div className="space-y-6 text-muted font-light leading-relaxed text-[15px]">
            <p>
              Uniform Trends was founded on the belief that high-quality, professional apparel should be accessible and tailored to the demanding Indian climate. Over the years, we have transitioned from a local production unit to a national uniform supplier, outfitting students, frontline workers, hospitality experts, and corporate teams.
            </p>
            <p>
              Our manufacturing plant utilizes advanced double-stitch reinforcing machinery, computerized patterning systems, and automatic fabric cutters to guarantee precision in every batch. We carefully evaluate fabrics for skin-friendliness, breathability, colorfastness, and resistance to standard laundering shrinkage. By controlling every stage of the production process—from fiber selection to final packaging—we ensure that every shirt, blazer, or set of medical scrubs that leaves our facility meets international quality benchmarks.
            </p>
          </div>
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
            <p className="text-muted font-light leading-relaxed text-[15px]">
              To engineer and supply high-quality, functional, and contemporary uniforms that enhance institutional identity. We prioritize ergonomic design, durable fabric, and ethical sourcing, ensuring our garments withstand the daily physical demands of classrooms, hospital wards, and commercial operations.
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
            <p className="text-muted font-light leading-relaxed text-[15px]">
              To be the gold standard in institutional uniform manufacturing across the globe. We aim to drive progress by introducing eco-friendly fabrics, implementing sustainable zero-waste manufacturing, and offering custom virtual fitting tools that simplify the ordering journey for our corporate and academic clients.
            </p>
          </motion.div>
        </div>

        {/* Our Custom Onboarding Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-24 bg-surface-card p-8 md:p-12 rounded-3xl border border-hairline shadow-sm text-center"
        >
          <h2 className="text-3xl font-bold text-ink mb-6 tracking-tight">The Institutional Procurement Process</h2>
          <p className="text-muted font-light leading-relaxed text-[15px] max-w-2xl mx-auto mb-6">
            We simplify procurement for large administrative buyers through a structured process. From initial fabric choice to doorstep delivery, our account managers supervise every detail to ensure seamless delivery of high-volume items.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left mt-10">
            <div className="bg-canvas p-6 rounded-2xl border border-hairline">
              <h4 className="font-bold text-ink mb-2">1. Consultation & Design</h4>
              <p className="text-xs text-muted leading-relaxed">We schedule virtual consultation sessions to review color choices, embroidery positions, fabric preferences, and branding requirements tailored to your brand identity.</p>
            </div>
            <div className="bg-canvas p-6 rounded-2xl border border-hairline">
              <h4 className="font-bold text-ink mb-2">2. Sample Dispatch</h4>
              <p className="text-xs text-muted leading-relaxed">Prior to manufacturing full runs, we compile tailored fabric swatches and fit samples for institutional buyers to inspect double-stitch durability and fabric quality.</p>
            </div>
            <div className="bg-canvas p-6 rounded-2xl border border-hairline">
              <h4 className="font-bold text-ink mb-2">3. Production & Handover</h4>
              <p className="text-xs text-muted leading-relaxed">Our advanced facility executes manufacturing runs efficiently. Final packages undergo multi-point inspections before secure logistics teams deliver orders.</p>
            </div>
          </div>
        </motion.div>

        {/* Local SEO Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-24"
        >
          <h2 className="text-3xl font-bold text-ink mb-8 text-center tracking-tight">Why Choose Uniform Trends?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8 text-[15px]">
            <div>
              <h4 className="font-bold text-ink mb-2">Local Manufacturing Excellence</h4>
              <p className="text-muted text-sm font-light leading-relaxed">Our advanced manufacturing facility ensures fast turnaround times, high-volume production control, and personalized on-premise fitting sessions for institutions nationwide.</p>
            </div>
            <div>
              <h4 className="font-bold text-ink mb-2">Premium Quality Standards</h4>
              <p className="text-muted text-sm font-light leading-relaxed">We use selected premium fabrics that last up to 2x longer than standard off-the-shelf uniforms. Our fabrics resist color fading and tearing from daily heavy usage.</p>
            </div>
            <div>
              <h4 className="font-bold text-ink mb-2">Custom Tailoring for All</h4>
              <p className="text-muted text-sm font-light leading-relaxed">From primary school blazers with custom embroidery to antimicrobial hospital scrubs, we configure fit criteria that prioritize individual comfort and ease of movement.</p>
            </div>
            <div>
              <h4 className="font-bold text-ink mb-2">Industrial Grade Durability</h4>
              <p className="text-muted text-sm font-light leading-relaxed">Our factory workwear and safety uniforms are engineered using reinforced seams, breathable materials, and heavy-duty buttons to withstand harsh environments.</p>
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
            While we operate from our primary manufacturing base, we supply premium school, hospital, and corporate uniforms to major commercial and educational hubs across India. Whether you require durable <strong>school uniforms in Mumbai</strong>, professional <strong>corporate shirts in Delhi</strong>, or hygienic <strong>hospital scrubs in Bangalore</strong>, our logistics network handles bulk shipments efficiently.
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
