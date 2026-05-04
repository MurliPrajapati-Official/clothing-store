import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';

export default function CookiesPolicy() {
  return (
    <div className="pt-32 pb-24 bg-canvas min-h-screen text-body-text">
      <Helmet>
        <title>Cookies Policy | Uniform trends</title>
      </Helmet>
      <div className="container-custom max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-ink mb-12 tracking-tight">Cookies Policy</h1>
          
          <div className="prose prose-invert max-w-none space-y-8 text-lg font-light leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-ink mb-4">1. What Are Cookies</h2>
              <p>As is common practice with almost all professional websites this site uses cookies, which are tiny files that are downloaded to your computer, to improve your experience.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink mb-4">2. How We Use Cookies</h2>
              <p>We use cookies for a variety of reasons detailed below. Unfortunately in most cases there are no industry standard options for disabling cookies without completely disabling the functionality and features they add to this site.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink mb-4">3. Disabling Cookies</h2>
              <p>You can prevent the setting of cookies by adjusting the settings on your browser. Be aware that disabling cookies will affect the functionality of this and many other websites that you visit.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-ink mb-4">4. The Cookies We Set</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Account related cookies</li>
                <li>Login related cookies</li>
                <li>Orders processing related cookies</li>
                <li>Forms related cookies</li>
              </ul>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
