import SEO from '../components/layout/SEO';
import { ShieldCheck, Sparkles, Award, HeartHandshake, Leaf, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { STORE_NAME, STORE_TAGLINE } from '../constants';

export default function About() {
  return (
    <div className="pt-28 pb-24 bg-canvas min-h-screen">
      <SEO
        title={`About Our Story & Craftsmanship | ${STORE_NAME}`}
        description={`Learn about ${STORE_NAME}'s commitment to organic textiles, architectural tailoring, and timeless modern essentials.`}
      />

      {/* Hero */}
      <section className="py-16 border-b border-hairline bg-white">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl text-center space-y-6">
          <span className="text-xs uppercase font-bold tracking-widest text-muted block">Our Philosophy</span>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-ink">
            Crafting Garments That Stand the Test of Time.
          </h1>
          <p className="text-base text-muted font-normal leading-relaxed max-w-2xl mx-auto">
            {STORE_NAME} was founded on a simple principle: modern clothing should be intentional, uncompromising in material density, and cut to empower effortless daily life.
          </p>
        </div>
      </section>

      {/* Image & Story Split */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 aspect-[4/5] bg-surface-soft border border-hairline overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1000&auto=format&fit=crop&q=80"
                alt="Craftsmanship & Materials"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs uppercase font-bold tracking-widest text-muted">Textile Engineering</span>
              <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-ink leading-tight">
                Heavyweight Cotton. Virgin Wools. Zero Shortcuts.
              </h2>
              <p className="text-sm text-body-text leading-relaxed">
                In an era dominated by fast fashion and disposable polyester blends, we choose the slow, meticulous route. We source heavyweight 280 GSM ring-spun cottons, high-grade European flax linens, and virgin wool blends that hold sculptural form and grow softer with every wash cycle.
              </p>
              <p className="text-sm text-body-text leading-relaxed">
                Every collar is reinforced with high-density spandex ribbing to prevent bacon-necking. Every stress point is bar-tacked or double-needle stitched for decades of resilient wear.
              </p>
              <div className="pt-4">
                <Link to="/shop" className="btn-primary py-4 px-8 text-xs inline-flex items-center gap-2">
                  <span>Explore The Wardrobe</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Pillars */}
      <section className="py-20 bg-white border-y border-hairline">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-black uppercase tracking-tight text-ink">
              Our Core Pillars
            </h2>
            <p className="text-xs text-muted">The foundational commitments behind every piece we produce.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-surface-card border border-hairline space-y-4">
              <Leaf className="text-ink" size={28} />
              <h3 className="text-lg font-black uppercase tracking-tight text-ink">Sustainable Sourcing</h3>
              <p className="text-xs text-muted leading-relaxed">
                We partner with certified mills employing closed-loop water treatment and OEKO-TEX certified natural dye baths.
              </p>
            </div>

            <div className="p-8 bg-surface-card border border-hairline space-y-4">
              <Award className="text-ink" size={28} />
              <h3 className="text-lg font-black uppercase tracking-tight text-ink">Architectural Fit</h3>
              <p className="text-xs text-muted leading-relaxed">
                Pattern drafted with drop shoulders, clean boxy cuts, and tailored breaks that flatter a wide spectrum of body proportions.
              </p>
            </div>

            <div className="p-8 bg-surface-card border border-hairline space-y-4">
              <HeartHandshake className="text-ink" size={28} />
              <h3 className="text-lg font-black uppercase tracking-tight text-ink">Fair Atelier Craft</h3>
              <p className="text-xs text-muted leading-relaxed">
                Manufactured in safe, well-lit facilities where tailors and master pattern cutters receive living wages and complete health benefits.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
