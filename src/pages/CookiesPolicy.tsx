import SEO from '../components/layout/SEO';
import { motion } from 'motion/react';
import { Eye, Info, Check } from 'lucide-react';

export default function CookiesPolicy() {
  return (
    <div className="pt-32 pb-24 bg-canvas min-h-screen text-body-text">
      <SEO
        title="Cookies Policy | Uniform Trends India"
        description="Official cookies policy for Uniform Trends. Understand the essential, analytical, and preference cookies we utilize to support your ordering journey."
      />
      <div className="container-custom max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full mb-6 font-bold text-sm uppercase tracking-widest">
              <Eye size={16} />
              Tracking Preferences
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-ink mb-6 tracking-tight">Cookies Policy</h1>
            <p className="text-muted font-light max-w-2xl mx-auto text-sm leading-relaxed">
              This document clarifies how we utilize cookies and local browser storage to provide functional cart features, 
              secure account logging, and performance analysis.
            </p>
          </div>
          
          <div className="bg-surface-card rounded-3xl p-8 md:p-12 border border-hairline shadow-sm space-y-10 text-muted font-light leading-relaxed text-[15px]">
            <section className="border-b border-hairline-strong pb-6">
              <h2 className="text-xl font-bold text-ink mb-4 flex items-center gap-3">
                <Info className="text-primary" size={20} />
                1. What Are Cookies?
              </h2>
              <p className="mb-4">
                As is common practice with almost all professional e-commerce websites, this site uses cookies, which are tiny files 
                that are downloaded to your computer or mobile device, to improve your browsing experience. Cookies allow the website to 
                remember your preferences, secure your login state, and verify item configurations in your shopping bag.
              </p>
              <p>
                We also use "local storage" and "session storage" in your browser. These are modern HTML5 standards similar to cookies 
                that allow us to store small amounts of textual data locally on your computer to improve speed and functionality.
              </p>
            </section>

            <section className="border-b border-hairline-strong pb-6">
              <h2 className="text-xl font-bold text-ink mb-4">2. How We Use Cookies</h2>
              <p className="mb-4">
                We use cookies for a variety of reasons detailed below. Unfortunately, in most cases, there are no industry standard 
                options for disabling cookies without completely disabling the functionality and features they add to this site (such 
                as keeping items in your cart as you navigate between shop pages).
              </p>
              <p>
                It is strongly recommended that you leave on all cookies if you are unsure whether you need them or not, in case they 
                are used to provide a service that you actively interact with.
              </p>
            </section>

            <section className="border-b border-hairline-strong pb-6">
              <h2 className="text-xl font-bold text-ink mb-4">3. The Categories of Cookies We Set</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-ink text-base flex items-center gap-2 mb-1">
                    <Check className="text-primary" size={16} /> Essential E-Commerce Cookies
                  </h3>
                  <p className="text-muted text-sm font-light">
                    These cookies are necessary for the website to function correctly. Specifically, they keep track of items added to your 
                    shopping cart (`cart-storage` in local storage) and ensure your checkout session details are maintained. Without these, 
                    you would not be able to purchase products on our site.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-ink text-base flex items-center gap-2 mb-1">
                    <Check className="text-primary" size={16} /> Account & Login Cookies
                  </h3>
                  <p className="text-muted text-sm font-light">
                    If you create an account with us, we will use cookies for the management of the signup process and general administration. 
                    These cookies are usually deleted when you log out; however, in some cases, they may remain afterwards to remember 
                    your profile preferences when logged out.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-ink text-base flex items-center gap-2 mb-1">
                    <Check className="text-primary" size={16} /> Site Preferences & Banners
                  </h3>
                  <p className="text-muted text-sm font-light">
                    In order to provide you with a great experience on this site, we provide the functionality to set your preferences 
                    for how this site runs when you use it. To remember your choices, we need to set cookies so that this information 
                    can be called whenever you interact with a page (for example, remembering that you accepted the cookie consent banner).
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-ink text-base flex items-center gap-2 mb-1">
                    <Check className="text-primary" size={16} /> Third-Party Analytical Cookies
                  </h3>
                  <p className="text-muted text-sm font-light">
                    In some special cases, we also use cookies provided by trusted third parties. This site utilizes Cloudflare Analytics 
                    to help us understand how you use the site and ways that we can improve your experience. These cookies may track things 
                    such as how long you spend on the site and the pages that you visit so we can continue to produce engaging content.
                  </p>
                </div>
              </div>
            </section>

            <section className="border-b border-hairline-strong pb-6">
              <h2 className="text-xl font-bold text-ink mb-4">4. Disabling Cookies in Your Browser</h2>
              <p className="mb-4">
                You can prevent the setting of cookies by adjusting the settings on your browser. Be aware that disabling cookies 
                will affect the functionality of this and many other websites that you visit. Disabling cookies will usually result 
                in also disabling certain functionality and features of this site. Therefore, it is recommended that you do not 
                disable cookies.
              </p>
              <p className="mb-2">If you still wish to disable cookies, follow the steps for your specific browser:</p>
              <ul className="list-disc pl-6 space-y-2 text-sm">
                <li><strong>Google Chrome:</strong> Settings &gt; Privacy and Security &gt; Third-party Cookies &gt; Block third-party cookies.</li>
                <li><strong>Mozilla Firefox:</strong> Settings &gt; Privacy & Security &gt; Enhanced Tracking Protection &gt; Custom.</li>
                <li><strong>Apple Safari:</strong> Preferences &gt; Privacy &gt; Block all cookies.</li>
                <li><strong>Microsoft Edge:</strong> Settings &gt; Cookies and site permissions &gt; Manage and delete cookies and site data.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-ink mb-4">5. Security & Inquiries</h2>
              <p className="mb-4">
                We take privacy seriously. The cookies set directly by Uniform Trends do not contain any unencrypted personal sensitive details, 
                such as account passwords or credit card numbers. All cookie-based values are stored as randomized strings that hold no value 
                to external eavesdroppers.
              </p>
              <p>
                Hopefully, this has clarified things for you. If there is something that you are not sure whether you need or not, it's 
                usually safer to leave cookies enabled in case it does interact with one of the features you use on our site. For further 
                questions, reach out to us at 
                <a href="mailto:uniformtrends01@gmail.com" className="text-primary hover:underline ml-1">uniformtrends01@gmail.com</a>.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
