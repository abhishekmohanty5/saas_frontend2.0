import React from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingDown, DollarSign } from 'lucide-react';

const DataAnalysisSection = () => {
    return (
        <div className="py-24 px-6">
            <div className="max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'rgba(234, 241, 255, 0.95)' }}>
                        Smart Proration & Billing
                    </h2>
                    <p className="text-xl" style={{ color: 'rgba(226, 232, 240, 0.8)' }}>
                        Fair value calculations for every subscription change
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="glass-card p-8"
                    style={{
                        background: 'rgba(255, 255, 255, 0.12)',
                        border: '1px solid rgba(255, 255, 255, 0.25)',
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    {/* Scenario Header */}
                    <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-200">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                            <TrendingDown className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">Plan Downgrade Scenario</h3>
                            <p className="text-sm text-gray-600">Enterprise → Professional (Mid-cycle)</p>
                        </div>
                    </div>

                    {/* Calculation UI */}
                    <div className="space-y-6">
                        {/* Original Plan */}
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-semibold text-gray-700">Original Plan</span>
                                <span className="text-xs text-gray-500">Enterprise</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <CalcItem label="Monthly Rate" value="$499" />
                                <CalcItem label="Days Used" value="15/30" />
                                <CalcItem label="Used Amount" value="$249.50" />
                            </div>
                        </div>

                        {/* New Plan */}
                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-semibold text-gray-700">New Plan</span>
                                <span className="text-xs text-gray-500">Professional</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <CalcItem label="Monthly Rate" value="$199" />
                                <CalcItem label="Days Remaining" value="15/30" />
                                <CalcItem label="Prorated Amount" value="$99.50" />
                            </div>
                        </div>

                        {/* Fair Value Calculation */}
                        <div className="glass-card bg-gradient-to-br from-green-50 to-emerald-50 p-6 border-2 border-green-200">
                            <div className="flex items-center gap-3 mb-4">
                                <Calculator className="w-6 h-6 text-green-600" />
                                <span className="text-sm font-bold text-gray-900">AI-Calculated Fair Value</span>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-700">Credit from unused Enterprise</span>
                                    <span className="font-semibold text-gray-900">$249.50</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-700">Charge for Professional (prorated)</span>
                                    <span className="font-semibold text-gray-900">-$99.50</span>
                                </div>
                                <div className="h-px bg-gray-300" />
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-gray-900">Account Credit</span>
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="w-5 h-5 text-green-600" />
                                        <span className="text-2xl font-bold text-green-600">$150.00</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-green-200">
                                <p className="text-xs text-gray-600 text-center">
                                    ✓ Automatically applied to next billing cycle
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

// Calculation Item Component
const CalcItem = ({ label, value }) => (
    <div>
        <div className="text-xs text-gray-600 mb-1">{label}</div>
        <div className="text-lg font-bold text-gray-900">{value}</div>
    </div>
);

export default DataAnalysisSection;
