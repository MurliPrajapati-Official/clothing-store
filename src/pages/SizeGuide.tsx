import { useState } from 'react';
import SEO from '../components/layout/SEO';
import { Ruler, Sparkles } from 'lucide-react';
import { STORE_NAME } from '../constants';
import { cn } from '../lib/utils';

export default function SizeGuide() {
  const [unit, setUnit] = useState<'in' | 'cm'>('in');
  const [activeGender, setActiveGender] = useState<'men' | 'women' | 'unisex'>('men');

  const MEN_SIZES = [
    { size: 'S', chestIn: '36 - 38', chestCm: '91 - 96', waistIn: '30 - 32', waistCm: '76 - 81', shoulderIn: '17.5', shoulderCm: '44.5' },
    { size: 'M', chestIn: '39 - 41', chestCm: '99 - 104', waistIn: '32 - 34', waistCm: '81 - 86', shoulderIn: '18.25', shoulderCm: '46.3' },
    { size: 'L', chestIn: '42 - 44', chestCm: '106 - 112', waistIn: '35 - 37', waistCm: '89 - 94', shoulderIn: '19.0', shoulderCm: '48.2' },
    { size: 'XL', chestIn: '45 - 47', chestCm: '114 - 119', waistIn: '38 - 40', waistCm: '96 - 101', shoulderIn: '19.75', shoulderCm: '50.1' },
    { size: '2XL', chestIn: '48 - 50', chestCm: '122 - 127', waistIn: '41 - 43', waistCm: '104 - 109', shoulderIn: '20.5', shoulderCm: '52.0' },
  ];

  const WOMEN_SIZES = [
    { size: 'XS', bustIn: '31 - 32', bustCm: '78 - 81', waistIn: '24 - 25', waistCm: '61 - 64', hipsIn: '34 - 35', hipsCm: '86 - 89' },
    { size: 'S', bustIn: '33 - 34', bustCm: '84 - 86', waistIn: '26 - 27', waistCm: '66 - 69', hipsIn: '36 - 37', hipsCm: '91 - 94' },
    { size: 'M', bustIn: '35 - 37', bustCm: '89 - 94', waistIn: '28 - 30', waistCm: '71 - 76', hipsIn: '38 - 40', hipsCm: '96 - 101' },
    { size: 'L', bustIn: '38 - 40', bustCm: '96 - 101', waistIn: '31 - 33', waistCm: '79 - 84', hipsIn: '41 - 43', hipsCm: '104 - 109' },
    { size: 'XL', bustIn: '41 - 43', bustCm: '104 - 109', waistIn: '34 - 36', waistCm: '86 - 91', hipsIn: '44 - 46', hipsCm: '112 - 117' },
  ];

  return (
    <div className="pt-28 pb-24 bg-canvas min-h-screen">
      <SEO
        title={`Size & Fit Guide | ${STORE_NAME}`}
        description="Comprehensive clothing size chart for Men and Women at Clothing Store."
      />

      <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
        <div className="text-center mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-card border border-hairline text-xs font-bold uppercase tracking-widest text-ink">
            <Ruler size={13} />
            <span>Size & Fit Guide</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-ink">
            Apparel Measurement Charts
          </h1>
          <p className="text-xs text-muted max-w-lg mx-auto leading-relaxed">
            Find your exact fit with our body measurement benchmarks. Measurements are provided in both Inches and Centimeters.
          </p>
        </div>

        {/* Controls: Gender Tab + Units Switch */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-hairline">
          {/* Gender Buttons */}
          <div className="inline-flex border border-hairline bg-white p-1">
            {(['men', 'women', 'unisex'] as const).map((g) => (
              <button
                key={g}
                onClick={() => setActiveGender(g)}
                className={cn(
                  "px-6 py-2 text-xs font-bold uppercase tracking-wider transition-colors",
                  activeGender === g ? "bg-ink text-white" : "text-muted hover:text-ink"
                )}
              >
                {g}'s Sizing
              </button>
            ))}
          </div>

          {/* Unit Toggle */}
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase text-muted">
            <span>Unit:</span>
            <div className="inline-flex border border-hairline bg-white p-0.5">
              <button
                onClick={() => setUnit('in')}
                className={cn("px-3 py-1 text-xs font-bold", unit === 'in' ? "bg-ink text-white" : "text-muted")}
              >
                Inches (IN)
              </button>
              <button
                onClick={() => setUnit('cm')}
                className={cn("px-3 py-1 text-xs font-bold", unit === 'cm' ? "bg-ink text-white" : "text-muted")}
              >
                Centimeters (CM)
              </button>
            </div>
          </div>
        </div>

        {/* Sizing Table */}
        <div className="bg-white border border-hairline overflow-hidden mb-12 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-surface-soft border-b border-hairline text-ink font-bold uppercase tracking-wider">
                  <th className="p-4">Size</th>
                  <th className="p-4">{activeGender === 'women' ? 'Bust' : 'Chest'} ({unit.toUpperCase()})</th>
                  <th className="p-4">Waist ({unit.toUpperCase()})</th>
                  <th className="p-4">{activeGender === 'women' ? 'Hips' : 'Shoulder'} ({unit.toUpperCase()})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline font-medium text-body-text">
                {activeGender === 'women' ? (
                  WOMEN_SIZES.map((row) => (
                    <tr key={row.size} className="hover:bg-canvas transition-colors">
                      <td className="p-4 font-bold text-ink">{row.size}</td>
                      <td className="p-4">{unit === 'in' ? row.bustIn : row.bustCm}</td>
                      <td className="p-4">{unit === 'in' ? row.waistIn : row.waistCm}</td>
                      <td className="p-4">{unit === 'in' ? row.hipsIn : row.hipsCm}</td>
                    </tr>
                  ))
                ) : (
                  MEN_SIZES.map((row) => (
                    <tr key={row.size} className="hover:bg-canvas transition-colors">
                      <td className="p-4 font-bold text-ink">{row.size}</td>
                      <td className="p-4">{unit === 'in' ? row.chestIn : row.chestCm}</td>
                      <td className="p-4">{unit === 'in' ? row.waistIn : row.waistCm}</td>
                      <td className="p-4">{unit === 'in' ? row.shoulderIn : row.shoulderCm}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* How to measure */}
        <div className="p-8 bg-surface-card border border-hairline space-y-6">
          <h2 className="text-base font-black uppercase tracking-widest text-ink pb-3 border-b border-hairline">
            How to Measure For Accurate Sizing
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-muted leading-relaxed">
            <div>
              <strong className="text-ink uppercase block mb-1">1. Chest / Bust</strong>
              <p>Wrap a soft measuring tape around the fullest part of your chest, keeping the tape level and under your arms.</p>
            </div>
            <div>
              <strong className="text-ink uppercase block mb-1">2. Natural Waist</strong>
              <p>Measure around your natural waistline, where your body naturally bends at the narrowest point.</p>
            </div>
            <div>
              <strong className="text-ink uppercase block mb-1">3. Hips / Seat</strong>
              <p>Stand with your feet together and measure around the fullest point of your hips and seat.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
