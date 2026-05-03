import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';

export default function SizeGuide() {
  return (
    <div className="pt-32 pb-24 bg-canvas min-h-screen text-body-text">
      <Helmet>
        <title>Size Guide | Ovi Global Uniform</title>
      </Helmet>
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold mb-8 text-ink tracking-tight text-center">Size Guide</h1>
          
          <div className="bg-surface-card rounded-2xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-hairline mb-12">
            <h2 className="text-2xl font-bold mb-6 text-ink">How to Measure</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-ink">1. Chest</h3>
                  <p className="text-muted text-sm">Measure around the fullest part of the chest, keeping the tape horizontal.</p>
                </div>
                <div>
                  <h3 className="font-bold text-ink">2. Waist</h3>
                  <p className="text-muted text-sm">Measure around the narrowest part (typically where your body bends side to side), keeping the tape horizontal.</p>
                </div>
                <div>
                  <h3 className="font-bold text-ink">3. Hips</h3>
                  <p className="text-muted text-sm">Measure around the fullest part of your hips, keeping the tape horizontal.</p>
                </div>
              </div>
              <div className="bg-surface-elevated rounded-xl p-6 flex items-center justify-center border border-hairline-strong">
                <img src="https://picsum.photos/seed/measurement/300/400" alt="How to measure illustration" className="max-h-64 object-contain mix-blend-multiply" referrerPolicy="no-referrer" />
              </div>
            </div>
          </div>
          
          <div className="bg-surface-card rounded-2xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-hairline">
             <h2 className="text-2xl font-bold mb-6 text-ink">Standard Sizing Chart</h2>
             <div className="overflow-x-auto rounded-xl border border-hairline-strong">
                <table className="w-full text-left border-collapse">
                   <thead>
                      <tr className="bg-surface-elevated border-b border-hairline-strong">
                         <th className="p-4 font-semibold text-ink">Size</th>
                         <th className="p-4 font-semibold text-ink">Chest (inches)</th>
                         <th className="p-4 font-semibold text-ink">Waist (inches)</th>
                         <th className="p-4 font-semibold text-ink">Length (inches)</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-hairline-strong">
                      <tr className="hover:bg-surface-elevated/50 transition-colors">
                         <td className="p-4 font-medium text-ink">24 (Age 4-5)</td>
                         <td className="p-4 text-muted">24"</td>
                         <td className="p-4 text-muted">22"</td>
                         <td className="p-4 text-muted">18"</td>
                      </tr>
                      <tr className="hover:bg-surface-elevated/50 transition-colors">
                         <td className="p-4 font-medium text-ink">26 (Age 6-7)</td>
                         <td className="p-4 text-muted">26"</td>
                         <td className="p-4 text-muted">24"</td>
                         <td className="p-4 text-muted">20"</td>
                      </tr>
                      <tr className="hover:bg-surface-elevated/50 transition-colors">
                         <td className="p-4 font-medium text-ink">28 (Age 8-9)</td>
                         <td className="p-4 text-muted">28"</td>
                         <td className="p-4 text-muted">26"</td>
                         <td className="p-4 text-muted">22"</td>
                      </tr>
                      <tr className="hover:bg-surface-elevated/50 transition-colors">
                         <td className="p-4 font-medium text-ink">30 (Age 10-11)</td>
                         <td className="p-4 text-muted">30"</td>
                         <td className="p-4 text-muted">28"</td>
                         <td className="p-4 text-muted">24"</td>
                      </tr>
                      <tr className="hover:bg-surface-elevated/50 transition-colors">
                         <td className="p-4 font-medium text-ink">32 (Age 12-13)</td>
                         <td className="p-4 text-muted">32"</td>
                         <td className="p-4 text-muted">30"</td>
                         <td className="p-4 text-muted">26"</td>
                      </tr>
                      <tr className="hover:bg-surface-elevated/50 transition-colors">
                         <td className="p-4 font-medium text-ink">34 M</td>
                         <td className="p-4 text-muted">34"</td>
                         <td className="p-4 text-muted">32"</td>
                         <td className="p-4 text-muted">28"</td>
                      </tr>
                      <tr className="hover:bg-surface-elevated/50 transition-colors">
                         <td className="p-4 font-medium text-ink">36 L</td>
                         <td className="p-4 text-muted">36"</td>
                         <td className="p-4 text-muted">34"</td>
                         <td className="p-4 text-muted">29"</td>
                      </tr>
                   </tbody>
                </table>
             </div>
             <p className="text-sm text-muted mt-4">* Measurements are approximate and may vary slightly depending on the specific product and fabric.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
