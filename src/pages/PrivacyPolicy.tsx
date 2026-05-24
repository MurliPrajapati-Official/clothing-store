import SEO from '../components/layout/SEO';
import { motion } from 'motion/react';
import { ShieldAlert, Info } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="pt-32 pb-24 bg-canvas min-h-screen text-body-text">
      <SEO
        title="Privacy Policy | Uniform Trends India"
        description="Comprehensive privacy policy for Uniform Trends. Read about how we collect, store, and protect institutional and customer personal data."
      />
      <div className="container-custom max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full mb-6 font-bold text-sm uppercase tracking-widest">
              <ShieldAlert size={16} />
              Data Protection
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-ink mb-6 tracking-tight">Privacy Policy</h1>
            <p className="text-muted font-light max-w-2xl mx-auto text-sm leading-relaxed">
              We are committed to safeguarding your personal privacy. This document outlines our data acquisition processes, 
              storage protocols, and your statutory rights regarding data collection.
            </p>
          </div>
          
          <div className="bg-surface-card rounded-3xl p-8 md:p-12 border border-hairline shadow-sm space-y-10 text-muted font-light leading-relaxed text-[15px]">
            <section className="border-b border-hairline-strong pb-6">
              <h2 className="text-xl font-bold text-ink mb-4 flex items-center gap-3">
                <Info className="text-primary" size={20} />
                1. Overview & Data Controller
              </h2>
              <p className="mb-4">
                At Uniform Trends, accessible from https://uniformtrends.in, one of our main priorities is the privacy of our visitors. 
                This Privacy Policy document contains types of information that is collected and recorded by Uniform Trends and how we 
                use it. This policy applies to personal data collected during website visits, B2B sample inquiry submissions, online shop checkout, 
                and communication via our support channels.
              </p>
              <p>
                By using our website, you hereby consent to our Privacy Policy and agree to its terms. If you have additional questions 
                or require more information about our Privacy Policy, do not hesitate to contact our data protection representative.
              </p>
            </section>

            <section className="border-b border-hairline-strong pb-6">
              <h2 className="text-xl font-bold text-ink mb-4">2. The Information We Collect</h2>
              <p className="mb-4">
                We collect personal information that you voluntarily provide to us when you register on the website, express an 
                interest in obtaining information about us or our products, or when you place an order.
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>
                  <strong>Identifiable Personal Data:</strong> Full name, organizational email address, physical shipping addresses, billing address, 
                  and contact phone numbers.
                </li>
                <li>
                  <strong>B2B Institutional Details:</strong> School name, hospital facility name, corporate brand details, and Goods and 
                  Services Tax Identification Number (GSTIN) for tax invoice processing.
                </li>
                <li>
                  <strong>Transactional and Payment Data:</strong> Credit card or online banking payment details. Please note that all payments 
                  are processed securely via third-party PCI-DSS compliant payment gateways (such as Razorpay). We do not store or keep 
                  raw credit card numbers on our servers.
                </li>
                <li>
                  <strong>Technological Metadata:</strong> IP addresses, browser specifications, operating system versions, referral URLs, 
                  access timestamps, and clickstream navigation paths.
                </li>
              </ul>
            </section>

            <section className="border-b border-hairline-strong pb-6">
              <h2 className="text-xl font-bold text-ink mb-4">3. Purposes of Data Processing</h2>
              <p className="mb-4">
                We use the information we collect in various ways, relying on legitimate business interests, contractual execution, 
                and explicit compliance with statutory guidelines:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>To manage and process customer orders, design configurations, and dispatch uniform packages.</li>
                <li>To contact and send shipping tracking notifications, sample book dispatch alerts, and B2B invoice updates.</li>
                <li>To respond directly to inquiries submitted through our Web3Forms-powered contact interface.</li>
                <li>To detect, prevent, and address fraudulent activities or security breaches on our site.</li>
                <li>To review user navigation behavior and optimize page layouts, speed, and catalog offerings.</li>
                <li>To comply with regulatory tax filing requirements under the Indian Goods and Services Tax framework.</li>
              </ul>
            </section>

            <section className="border-b border-hairline-strong pb-6">
              <h2 className="text-xl font-bold text-ink mb-4">4. Security Protocols and Storage</h2>
              <p className="mb-4">
                We implement robust technical and organizational security measures designed to protect the safety of any personal 
                information we process. Our database is built upon secure Supabase architecture, employing row-level security policies 
                to isolate client records. Transmission of data is encrypted using standard Secure Socket Layer (SSL) protocols.
              </p>
              <p>
                However, please remember that no transmission over the internet or database storage technology can be guaranteed 
                to be 100% secure. Although we do our best to protect your personal information, transmission of personal data to and 
                from our website is at your own risk. You should only access the services within a secure network environment.
              </p>
            </section>

            <section className="border-b border-hairline-strong pb-6">
              <h2 className="text-xl font-bold text-ink mb-4">5. Third-Party Integrations</h2>
              <p className="mb-4">
                Our platform integrates specific third-party APIs to support online ordering and client communications. These services 
                include Supabase (database hosting), Web3Forms (secure contact form routing), and Cloudflare (content delivery networks 
                and analytical metadata).
              </p>
              <p>
                Each of these third parties operates under its own respective privacy policy. We recommend that you consult the privacy 
                policies of these third-party servers for detailed descriptions of their tracking procedures and opt-out instructions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-ink mb-4">6. Data Subject Rights (Access, Correction & Deletion)</h2>
              <p className="mb-4">
                We believe in providing transparency to our users. Depending on your location and statutory requirements, you possess 
                the following privacy rights:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li><strong>The Right to Access:</strong> You have the right to request copies of your personal data stored in our system.</li>
                <li><strong>The Right to Rectification:</strong> You can request that we correct any information you believe is inaccurate.</li>
                <li><strong>The Right to Erasure:</strong> You have the right to request that we erase your personal data under certain conditions.</li>
                <li><strong>The Right to Portability:</strong> You can request that we transfer collected data to another organization.</li>
              </ul>
              <p>
                To exercise any of these rights, please email our compliance team at 
                <a href="mailto:uniformtrends01@gmail.com" className="text-primary hover:underline ml-1">uniformtrends01@gmail.com</a>. 
                We will reply to your request within 30 business days.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
