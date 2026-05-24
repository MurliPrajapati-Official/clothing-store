import SEO from '../components/layout/SEO';
import { motion } from 'motion/react';
import { RefreshCcw, Info, CheckCircle2 } from 'lucide-react';

export default function ReturnPolicy() {
  return (
    <div className="pt-32 pb-24 bg-canvas min-h-screen text-body-text">
      <SEO
        title="Return & Replacement Policy | Uniform Trends India"
        description="Official return, refund, and replacement policy of Uniform Trends. Learn about eligibility rules for custom-tailored uniforms and standard size exchanges."
      />
      <div className="container-custom max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full mb-6 font-bold text-sm uppercase tracking-widest">
              <RefreshCcw size={16} />
              Customer Assurance
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-ink mb-6 tracking-tight">Return & Refund Policy</h1>
            <p className="text-muted font-light max-w-2xl mx-auto text-sm leading-relaxed">
              At Uniform Trends, we strive to deliver the highest quality apparel. Please read our guidelines regarding 
              standard returns, size exchanges, and custom-tailored garment exclusions.
            </p>
          </div>
          
          <div className="bg-surface-card rounded-3xl p-8 md:p-12 border border-hairline shadow-sm space-y-10 text-muted font-light leading-relaxed text-[15px]">
            <section className="border-b border-hairline-strong pb-6">
              <h2 className="text-xl font-bold text-ink mb-4 flex items-center gap-3">
                <Info className="text-primary" size={20} />
                1. Eligibility for Standard Size Returns
              </h2>
              <p className="mb-4">
                We accept returns and size exchanges for standard, non-customized garments (such as plain, blank polo shirts, 
                unembroidered scrubs, and generic school trousers) within 14 calendar days from the date of delivery.
              </p>
              <p className="mb-2">To qualify for a standard return, your item must meet the following strict conditions:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>The garment must be unused, unwashed, and in the exact same condition that you received it.</li>
                <li>It must have all original cardboard hangtags, size stickers, and institutional labels fully attached.</li>
                <li>It must be returned in the original transparent plastic protective sleeve or box packaging.</li>
                <li>The item must not show any signs of wear, makeup stains, soil marks, or laundry scent.</li>
              </ul>
            </section>

            <section className="border-b border-hairline-strong pb-6">
              <h2 className="text-xl font-bold text-ink mb-4">2. Custom-Tailored & Embroidered Uniform Exclusion</h2>
              <p className="mb-4">
                Please be aware that custom-tailored garments and uniforms customized with specific school logos, hospital names, 
                personal name embroidery, or company graphics are manufactured exclusively for your organization. Consequently, these 
                custom items are **not eligible for returns or refunds** under any circumstances unless they suffer from a significant 
                manufacturing defect or print/embroidery misalignment that departs from the signed-off proof.
              </p>
              <p>
                We highly recommend verifying sizes using our physical fit guides or sizing charts before approving bulk production runs 
                to eliminate sizing issues.
              </p>
            </section>

            <section className="border-b border-hairline-strong pb-6">
              <h2 className="text-xl font-bold text-ink mb-4">3. Defects and Shipping Damage Claims</h2>
              <p className="mb-4">
                In the rare event that you receive a defective garment (e.g., fabric tears, severe stitching errors, broken zippers, 
                or incorrect sizing beyond standard manufacturing tolerances), please report the issue to us within 48 hours of 
                delivery.
              </p>
              <p>
                You must email clear photographs of the defect along with your order number to 
                <a href="mailto:uniformtrends01@gmail.com" className="text-primary hover:underline ml-1">uniformtrends01@gmail.com</a>. 
                Once our quality control team inspects the photos and approves the claim, we will schedule a pickup at our expense and 
                expedite a replacement garment or offer a full refund for that item.
              </p>
            </section>

            <section className="border-b border-hairline-strong pb-6">
              <h2 className="text-xl font-bold text-ink mb-4">4. Refund and Inspection Process</h2>
              <p className="mb-4">
                Once your returned package is received at our logistics sorting facility, our quality control team will inspect the 
                items against our return condition checklist. This inspection process typically takes 3 to 5 business days from arrival.
              </p>
              <p>
                Following inspection, we will send you an email to notify you that we have received your returned item and whether the 
                refund has been approved or rejected. If approved, your refund will be processed, and a credit will automatically 
                be applied to your original method of payment (or bank account for bulk corporate payments) within 7 to 10 business days.
              </p>
            </section>

            <section className="border-b border-hairline-strong pb-6">
              <h2 className="text-xl font-bold text-ink mb-4">5. Return Shipping Fees</h2>
              <p className="mb-4">
                Except for verified manufacturing defects or wrong shipments sent by us, you will be responsible for paying your own 
                shipping costs for returning or exchanging items. Shipping costs are non-refundable.
              </p>
              <p>
                If you are shipping items valued over ₹1,000, we recommend using a trackable shipping service or purchasing shipping 
                insurance. We cannot guarantee that we will receive your returned item, and we are not liable for packages lost in 
                transit by third-party courier services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-ink mb-4 flex items-center gap-2">
                <CheckCircle2 className="text-primary" size={20} /> Bulk Institutional Exchanges
              </h2>
              <p className="mb-4">
                For schools and large corporate accounts that place bulk orders, we understand that occasional fitting adjustments are 
                needed. We work closely with administrative committees to coordinate size swaps during the onboarding phase.
              </p>
              <p>
                If a student or corporate staff member requires a size exchange within the first month of school opening or corporate rollout, 
                please compile all swap requests into a single list and contact your dedicated account coordinator. We will arrange a 
                bulk exchange shipment to minimize logistical delays.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
