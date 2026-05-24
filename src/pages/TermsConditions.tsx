import SEO from '../components/layout/SEO';
import { motion } from 'motion/react';
import { Shield, FileText } from 'lucide-react';

export default function TermsConditions() {
  return (
    <div className="pt-32 pb-24 bg-canvas min-h-screen text-body-text">
      <SEO
        title="Terms & Conditions | Uniform Trends India"
        description="Official terms of service and legal agreement for Uniform Trends. Read about order terms, custom tailoring disclaimers, intellectual property, and governing law."
      />
      <div className="container-custom max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full mb-6 font-bold text-sm uppercase tracking-widest">
              <FileText size={16} />
              Legal Framework
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-ink mb-6 tracking-tight">Terms & Conditions</h1>
            <p className="text-muted font-light max-w-2xl mx-auto text-sm leading-relaxed">
              Please read these terms of service carefully before using the Uniform Trends web platform. 
              By engaging in transactions or browsing this site, you agree to comply with and be bound by the following clauses.
            </p>
          </div>
          
          <div className="bg-surface-card rounded-3xl p-8 md:p-12 border border-hairline shadow-sm space-y-10 text-muted font-light leading-relaxed text-[15px]">
            <section className="border-b border-hairline-strong pb-6">
              <h2 className="text-xl font-bold text-ink mb-4 flex items-center gap-3">
                <Shield className="text-primary" size={20} />
                1. Acceptance of the Agreement
              </h2>
              <p className="mb-4">
                These Terms and Conditions constitute a legally binding agreement made between you, whether personally or on behalf 
                of an educational or corporate entity ("you"), and Uniform Trends ("Company", "we", "us", or "our"), concerning 
                your access to and use of the website as well as any other media form, media channel, mobile website, or mobile application 
                related, linked, or otherwise connected thereto.
              </p>
              <p>
                By accessing this website, you acknowledge that you have read, understood, and agreed to be bound by all of these 
                Terms and Conditions. If you do not agree with all of these terms, you are expressly prohibited from using the site 
                and must discontinue use immediately.
              </p>
            </section>
            
            <section className="border-b border-hairline-strong pb-6">
              <h2 className="text-xl font-bold text-ink mb-4">2. B2B & Institutional Accounts</h2>
              <p className="mb-4">
                To purchase uniforms on behalf of a school, hospital, or corporate business, you may be required to register a 
                corporate account. You are responsible for maintaining the confidentiality of your account login information, 
                including password, and for all activities that occur under your account.
              </p>
              <p>
                We reserve the right to refuse service, terminate accounts, or edit content in our sole discretion if we suspect 
                unauthorized, fraudulent, or illegal activity is occurring. You warrant that all information provided during 
                registration is accurate and updated.
              </p>
            </section>

            <section className="border-b border-hairline-strong pb-6">
              <h2 className="text-xl font-bold text-ink mb-4">3. Intellectual Property Rights</h2>
              <p className="mb-4">
                Unless otherwise indicated, the website is our proprietary property and all source code, databases, functionality, 
                software, website designs, audio, video, text, photographs, and graphics on the site (collectively, the "Content") 
                and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or 
                licensed to us, and are protected by copyright and trademark laws.
              </p>
              <p>
                No part of the site and no Content or Marks may be copied, reproduced, aggregated, republished, uploaded, posted, 
                publicly displayed, encoded, translated, transmitted, distributed, sold, licensed, or otherwise exploited for 
                any commercial purpose whatsoever, without our express prior written permission.
              </p>
            </section>

            <section className="border-b border-hairline-strong pb-6">
              <h2 className="text-xl font-bold text-ink mb-4">4. Ordering, Tailoring & Production Variance</h2>
              <p className="mb-4">
                All bulk orders placed through our sales representatives or digital order system are subject to manufacturing capacity 
                and fabric availability. Because our uniforms are custom-stitched to institutional specifications, minor variances 
                in measurements (within a standard industry tolerance of +/- 0.5 inches) and slight fabric dye lot differences 
                across production batches may occur.
              </p>
              <p>
                These minor variances do not constitute defects. Once a digital proof or physical sample has been signed off by the 
                customer’s authorized representative, production begins, and no further layout changes can be accommodated without 
                additional fees.
              </p>
            </section>

            <section className="border-b border-hairline-strong pb-6">
              <h2 className="text-xl font-bold text-ink mb-4">5. Pricing, GST & Billing schedules</h2>
              <p className="mb-4">
                Prices displayed on our digital shop are subject to change. Bulk inquiry prices provided in formal quotes remain valid 
                for 30 calendar days from the date of issuance unless stated otherwise. All corporate invoices will include standard Goods 
                and Services Tax (GST) as applicable under Indian laws.
              </p>
              <p>
                For B2B orders, payment terms are strictly as agreed in the formal quotation (typically requiring a mobilization deposit 
                upon design sign-off, with the balance due prior to dispatch or upon delivery, subject to credit checks). Late payments 
                may attract interest charges as specified in individual contract agreements.
              </p>
            </section>

            <section className="border-b border-hairline-strong pb-6">
              <h2 className="text-xl font-bold text-ink mb-4">6. Delivery & Shipping Risk</h2>
              <p className="mb-4">
                We distribute orders across India using reputed third-party logistics companies. While we make every effort to meet 
                estimated delivery times (normally 3 to 4 weeks for custom orders), we are not liable for delayed handovers caused 
                by logistical constraints, severe weather, strikes, or transport disruptions.
              </p>
              <p>
                Title to and risk of loss for the products pass to you upon our delivery of the items to the designated common carrier. 
                Inspect all shipments immediately upon receipt for quantity shortages or transit damage before signing cargo receipts.
              </p>
            </section>

            <section className="border-b border-hairline-strong pb-6">
              <h2 className="text-xl font-bold text-ink mb-4">7. Disclaimer of Warranties & Liability Limits</h2>
              <p className="mb-4">
                The website is provided on an as-is and as-available basis. You agree that your use of the site services will be at 
                your sole risk. To the fullest extent permitted by law, we disclaim all warranties, express or implied, in connection 
                with the site and your use thereof, including, without limitation, the implied warranties of merchantability, 
                fitness for a particular purpose, and non-infringement.
              </p>
              <p>
                In no event will we or our directors, employees, or agents be liable to you or any third party for any direct, 
                indirect, consequential, exemplary, incidental, special, or punitive damages, including lost profit, lost revenue, 
                loss of data, or other damages arising from your use of the site, even if we have been advised of the possibility 
                of such damages.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-ink mb-4">8. Governing Law & Dispute Resolution</h2>
              <p className="mb-4">
                These terms and conditions shall be governed by and defined in accordance with the laws of India. Any legal dispute, 
                claim, or litigation arising out of or related to these Terms and Conditions shall be referred exclusively to the 
                competent courts located in the region of our corporate registry.
              </p>
              <p>
                For questions, clarifications, or to report violation of these terms, please contact our legal compliance team at 
                <a href="mailto:uniformtrends01@gmail.com" className="text-primary hover:underline ml-1">uniformtrends01@gmail.com</a>.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
