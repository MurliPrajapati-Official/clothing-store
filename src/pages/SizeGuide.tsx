import SEO from '../components/layout/SEO';
import { motion } from 'motion/react';
import { Ruler, Sparkles, CheckCircle, RefreshCw } from 'lucide-react';

export default function SizeGuide() {
  return (
    <div className="pt-32 pb-24 bg-canvas min-h-screen text-body-text animate-fade-in">
      <SEO
        title="Comprehensive Size & Fit Guide | Uniform Trends India"
        description="Detailed sizing and fit guides for school, corporate, and healthcare uniforms. Learn how to measure chest, waist, hips, and inseam to ensure comfort and durability."
      />
      
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-surface-elevated border border-hairline-strong text-ink rounded-none mb-6 font-bold text-sm uppercase tracking-widest shadow-sm">
            <Ruler size={16} />
            Fit & Measurement Resource
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-ink tracking-tight">Standard Sizing & Fit Guide</h1>
          <p className="text-lg text-muted max-w-3xl mx-auto font-light leading-relaxed">
            Finding the correct fit is essential for ensuring comfort, durability, and a professional appearance. 
            At Uniform Trends, we design garments that allow active movement while keeping clean lines. Use this comprehensive 
            sizing guide to determine the most accurate size for students, clinical staff, and administrative teams.
          </p>
        </motion.div>

        {/* Detailed Measuring Instructions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-surface-card rounded-none p-8 md:p-10 shadow-sm border border-hairline">
              <h2 className="text-2xl font-bold mb-6 text-ink flex items-center gap-3">
                <Sparkles className="text-ink" size={24} />
                How to Measure Your Body Correctly
              </h2>
              <p className="text-muted font-light leading-relaxed mb-6 text-sm">
                For the most accurate measurements, we recommend wearing light clothing (like a t-shirt or camisole) 
                and using a flexible vinyl tailor's tape. Hold the tape firm but not tight against your body. Keep the tape 
                parallel to the floor for horizontal measurements. Having another person assist you will ensure greater accuracy.
              </p>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-ink text-base mb-1">1. Chest / Bust Measurement</h3>
                  <p className="text-muted text-sm font-light leading-relaxed">
                    Wrap the measuring tape under your armpits and around the fullest part of your chest or bust. Ensure the 
                    tape remains flat across your back and is not pulled too tight. Take a deep breath out to allow a natural 
                    expansion clearance; this guarantees comfort during desk work or physical activity.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-bold text-ink text-base mb-1">2. Waist Measurement</h3>
                  <p className="text-muted text-sm font-light leading-relaxed">
                    Wrap the tape around your natural waistline, positioned just above the belly button. Stand relaxed to ensure comfort.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-bold text-ink text-base mb-1">3. Hip Measurement</h3>
                  <p className="text-muted text-sm font-light leading-relaxed">
                    Stand with your heels together and wrap the tape around the fullest part of your hips. This is vital for tailored skirts and trousers.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-ink text-base mb-1">4. Shoulder Width & Inseam</h3>
                  <p className="text-muted text-sm font-light leading-relaxed">
                    Measure shoulder-to-shoulder for blazers/shirts, and crotch-to-hem for pants.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-surface-card rounded-none p-8 shadow-sm border border-hairline flex flex-col justify-between h-full">
              <div>
                <h3 className="text-xl font-bold text-ink mb-4">Pro Fitting Tips</h3>
                <ul className="space-y-4 text-sm text-muted font-light leading-relaxed">
                  <li className="flex gap-2 items-start">
                    <CheckCircle className="text-ink shrink-0 mt-1" size={16} />
                    <span><strong>Uniform Relaxed Fit:</strong> If you prefer a loose, active fit for movement, consider ordering one size larger than your exact body measurement.</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <CheckCircle className="text-ink shrink-0 mt-1" size={16} />
                    <span><strong>School Growth Margin:</strong> For school children who grow quickly, we suggest ordering school shirts and blazers 1 to 2 sizes larger to ensure the uniform lasts the full academic year.</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <CheckCircle className="text-ink shrink-0 mt-1" size={16} />
                    <span><strong>Shrinkage Allowance:</strong> Our high-quality poly-cotton fabrics are pre-shrunk, but a minor 1-2% shrinkage may still occur during the first few hot-water washes. Keep this in mind when measuring.</span>
                  </li>
                </ul>
              </div>
              <div className="bg-surface-elevated rounded-none p-6 mt-6 border border-hairline-strong flex items-center justify-center">
                <img 
                  src="https://picsum.photos/seed/measurement/300/400" 
                  alt="Standard body measuring guide illustration" 
                  className="max-h-56 object-contain rounded-none border border-hairline" 
                  referrerPolicy="no-referrer" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Kids Sizing Table */}
        <div className="bg-surface-card rounded-none p-8 md:p-10 shadow-sm border border-hairline mb-12">
          <h2 className="text-2xl font-bold mb-3 text-ink">Junior & Kids Sizing Chart (School Uniforms)</h2>
          <p className="text-sm text-muted font-light mb-6">
            These measurements correspond to children's apparel (shirts, pinafores, trousers, and skirts). Ages are approximate 
            averages; we strongly recommend measuring chest and waist sizes directly.
          </p>
          <div className="overflow-x-auto rounded-none border border-hairline-strong">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-elevated border-b border-hairline-strong">
                  <th className="p-4 font-semibold text-ink text-sm">Size Label</th>
                  <th className="p-4 font-semibold text-ink text-sm">Target Age</th>
                  <th className="p-4 font-semibold text-ink text-sm">Chest Size (inches)</th>
                  <th className="p-4 font-semibold text-ink text-sm">Waist Range (inches)</th>
                  <th className="p-4 font-semibold text-ink text-sm">Shirt Length (inches)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline-strong text-sm text-muted">
                <tr className="hover:bg-surface-elevated/30 transition-colors">
                  <td className="p-4 font-medium text-ink">Size 24</td>
                  <td className="p-4">Age 4-5 Years</td>
                  <td className="p-4">24"</td>
                  <td className="p-4">20" - 22"</td>
                  <td className="p-4">18"</td>
                </tr>
                <tr className="hover:bg-surface-elevated/30 transition-colors">
                  <td className="p-4 font-medium text-ink">Size 26</td>
                  <td className="p-4">Age 6-7 Years</td>
                  <td className="p-4">26"</td>
                  <td className="p-4">22" - 24"</td>
                  <td className="p-4">20"</td>
                </tr>
                <tr className="hover:bg-surface-elevated/30 transition-colors">
                  <td className="p-4 font-medium text-ink">Size 28</td>
                  <td className="p-4">Age 8-9 Years</td>
                  <td className="p-4">28"</td>
                  <td className="p-4">24" - 26"</td>
                  <td className="p-4">22"</td>
                </tr>
                <tr className="hover:bg-surface-elevated/30 transition-colors">
                  <td className="p-4 font-medium text-ink">Size 30</td>
                  <td className="p-4">Age 10-11 Years</td>
                  <td className="p-4">30"</td>
                  <td className="p-4">26" - 28"</td>
                  <td className="p-4">24"</td>
                </tr>
                <tr className="hover:bg-surface-elevated/30 transition-colors">
                  <td className="p-4 font-medium text-ink">Size 32</td>
                  <td className="p-4">Age 12-13 Years</td>
                  <td className="p-4">32"</td>
                  <td className="p-4">28" - 30"</td>
                  <td className="p-4">26"</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Adult Sizing Table */}
        <div className="bg-surface-card rounded-none p-8 md:p-10 shadow-sm border border-hairline mb-12">
          <h2 className="text-2xl font-bold mb-3 text-ink">Adult Sizing Chart (Corporate, Medical & Hospitality)</h2>
          <p className="text-sm text-muted font-light mb-6">
            These standards cover our unisex scrubs, formal corporate collared shirts, blazers, and chef aprons. Please cross-reference 
            with physical chest measurements.
          </p>
          <div className="overflow-x-auto rounded-none border border-hairline-strong">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-elevated border-b border-hairline-strong">
                  <th className="p-4 font-semibold text-ink text-sm">Size Label</th>
                  <th className="p-4 font-semibold text-ink text-sm">Equivalent Fit</th>
                  <th className="p-4 font-semibold text-ink text-sm">To Fit Chest (inches)</th>
                  <th className="p-4 font-semibold text-ink text-sm">To Fit Waist (inches)</th>
                  <th className="p-4 font-semibold text-ink text-sm">Sleeve Length (inches)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline-strong text-sm text-muted">
                <tr className="hover:bg-surface-elevated/30 transition-colors">
                  <td className="p-4 font-medium text-ink">Size 34 (XS)</td>
                  <td className="p-4">Men's XS / Women's S</td>
                  <td className="p-4">33" - 35"</td>
                  <td className="p-4">28" - 30"</td>
                  <td className="p-4">24.5"</td>
                </tr>
                <tr className="hover:bg-surface-elevated/30 transition-colors">
                  <td className="p-4 font-medium text-ink">Size 36 (S)</td>
                  <td className="p-4">Men's S / Women's M</td>
                  <td className="p-4">35" - 37"</td>
                  <td className="p-4">30" - 32"</td>
                  <td className="p-4">25.0"</td>
                </tr>
                <tr className="hover:bg-surface-elevated/30 transition-colors">
                  <td className="p-4 font-medium text-ink">Size 38 (M)</td>
                  <td className="p-4">Men's M / Women's L</td>
                  <td className="p-4">37" - 39"</td>
                  <td className="p-4">32" - 34"</td>
                  <td className="p-4">25.5"</td>
                </tr>
                <tr className="hover:bg-surface-elevated/30 transition-colors">
                  <td className="p-4 font-medium text-ink">Size 40 (L)</td>
                  <td className="p-4">Men's L / Women's XL</td>
                  <td className="p-4">39" - 41"</td>
                  <td className="p-4">34" - 36"</td>
                  <td className="p-4">26.0"</td>
                </tr>
                <tr className="hover:bg-surface-elevated/30 transition-colors">
                  <td className="p-4 font-medium text-ink">Size 42 (XL)</td>
                  <td className="p-4">Men's XL / Women's XXL</td>
                  <td className="p-4">41" - 43"</td>
                  <td className="p-4">36" - 38"</td>
                  <td className="p-4">26.5"</td>
                </tr>
                <tr className="hover:bg-surface-elevated/30 transition-colors">
                  <td className="p-4 font-medium text-ink">Size 44 (2XL)</td>
                  <td className="p-4">Men's XXL / Women's 3XL</td>
                  <td className="p-4">43" - 46"</td>
                  <td className="p-4">38" - 41"</td>
                  <td className="p-4">27.0"</td>
                </tr>
                <tr className="hover:bg-surface-elevated/30 transition-colors">
                  <td className="p-4 font-medium text-ink">Size 46 (3XL)</td>
                  <td className="p-4">Men's 3XL / Women's 4XL</td>
                  <td className="p-4">46" - 49"</td>
                  <td className="p-4">41" - 44"</td>
                  <td className="p-4">27.5"</td>
                </tr>
                <tr className="hover:bg-surface-elevated/30 transition-colors">
                  <td className="p-4 font-medium text-ink">Size 48 (4XL)</td>
                  <td className="p-4">Men's 4XL / Women's 5XL</td>
                  <td className="p-4">49" - 52"</td>
                  <td className="p-4">44" - 47"</td>
                  <td className="p-4">28.0"</td>
                </tr>
                <tr className="hover:bg-surface-elevated/30 transition-colors">
                  <td className="p-4 font-medium text-ink">Size 50 (5XL)</td>
                  <td className="p-4">Men's 5XL / Women's 6XL</td>
                  <td className="p-4">52" - 55"</td>
                  <td className="p-4">47" - 50"</td>
                  <td className="p-4">28.5"</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Fit tolerance and replacement policy */}
        <div className="bg-surface-card rounded-none p-8 md:p-10 shadow-sm border border-hairline text-center">
          <RefreshCw className="mx-auto text-ink mb-4" size={32} />
          <h3 className="text-xl font-bold text-ink mb-2">Need a Size Exchange?</h3>
          <p className="text-muted font-light text-sm max-w-2xl mx-auto leading-relaxed mb-6">
            We understand that fit preferences vary. If you receive your standard size uniform and find that it does 
            not fit as expected, you are welcome to request an exchange. Please keep the garment in its original, unwashed 
            condition with all institutional labels and tags attached. Refer to our full return and replacement guidelines 
            for eligibility terms on custom-embroidered apparel.
          </p>
          <p className="text-xs text-muted">
            * Note: For bulk orders of over 50 garments, our account coordinators provide fit sets to eliminate ordering errors. 
            Contact us for custom fitting sessions.
          </p>
        </div>
      </div>
    </div>
  );
}
