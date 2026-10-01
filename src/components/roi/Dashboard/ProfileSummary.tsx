'use client';
import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import { useRoi } from '@/lib/roi/context';
import { formatCurrencyCompact, formatCurrency, formatPercent, formatNumber } from '@/lib/roi/formatters';

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', py: 0.4, borderBottom: '1px solid', borderColor: 'divider' }}>
      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>{label}</Typography>
      <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem', ml: 2 }}>{value}</Typography>
    </Box>
  );
}

const MIX_COLORS = {
  creditCard: '#1976d2',
  check:      '#9c27b0',
  offlineAch: '#ed6c02',
  onlineAch:  '#00838f',
};

export default function ProfileSummary() {
  const { state: { inputs, results } } = useRoi();
  const { paymentMix } = inputs;
  const totalFte = inputs.cashApplicationFte + inputs.collectionsFte;

  return (
    <Paper variant="outlined" sx={{ borderRadius: 2, p: 2.5 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>Business Profile & Assumptions</Typography>

      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>

        {/* Business Profile */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', mb: 0.5 }}>
            Business Profile
          </Typography>
          <StatRow label="Annual Revenue" value={formatCurrencyCompact(inputs.annualInvoiceValue)} />
          <StatRow label="Monthly Invoices" value={formatNumber(inputs.monthlyInvoiceVolume)} />
          <StatRow label="Monthly Payments" value={formatNumber(inputs.monthlyPaymentVolume)} />
          <StatRow label="Avg Invoice Value" value={formatCurrency(results.averageInvoiceValue)} />
          <StatRow label="Avg Payment Value" value={formatCurrency(results.averagePaymentValue)} />
          <StatRow label="AR Staff (FTE)" value={`${totalFte.toFixed(1)} (${inputs.cashApplicationFte.toFixed(1)} CA · ${inputs.collectionsFte.toFixed(1)} Collections)`} />
          <StatRow label="FTE Expense" value={formatCurrencyCompact(inputs.fteExpense)} />
        </Box>

        <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />

        {/* Key Assumptions */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', mb: 0.5 }}>
            Key Assumptions
          </Typography>
          <StatRow label="Current DSO" value={`${inputs.dso} days`} />
          <StatRow label="Annual Growth Rate" value={formatPercent(inputs.growthRate)} />
          <StatRow label="Cost of Capital" value={formatPercent(inputs.costOfCapital)} />
          <StatRow label="Debt-to-AR Ratio" value={formatPercent(inputs.debtToArRatio)} />
          <StatRow label="Surcharge Rate" value={formatPercent(inputs.surchargeRate)} />
          <StatRow label="CC Processing Savings" value={formatPercent(inputs.creditCardProcessingSavings)} />
          <StatRow label="Write-Off Recovery" value={formatPercent(inputs.writeoffRecoveryPct)} />
        </Box>
      </Box>

      {/* Payment Mix Bar */}
      <Box sx={{ mt: 2.5 }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', mb: 1 }}>
          Current Payment Mix
        </Typography>
        <Box sx={{ display: 'flex', height: 20, borderRadius: 1, overflow: 'hidden', mb: 1 }}>
          {paymentMix.creditCard > 0 && (
            <Box sx={{ width: `${paymentMix.creditCard * 100}%`, bgcolor: MIX_COLORS.creditCard }} />
          )}
          {paymentMix.check > 0 && (
            <Box sx={{ width: `${paymentMix.check * 100}%`, bgcolor: MIX_COLORS.check }} />
          )}
          {paymentMix.offlineAch > 0 && (
            <Box sx={{ width: `${paymentMix.offlineAch * 100}%`, bgcolor: MIX_COLORS.offlineAch }} />
          )}
          {paymentMix.onlineAch > 0 && (
            <Box sx={{ width: `${paymentMix.onlineAch * 100}%`, bgcolor: MIX_COLORS.onlineAch }} />
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 2.5, flexWrap: 'wrap' }}>
          {[
            { key: 'creditCard', label: 'Credit Card', pct: paymentMix.creditCard },
            { key: 'check',      label: 'Check',       pct: paymentMix.check },
            { key: 'offlineAch', label: 'Offline ACH', pct: paymentMix.offlineAch },
            { key: 'onlineAch',  label: 'Online ACH',  pct: paymentMix.onlineAch },
          ].filter(s => s.pct > 0).map(s => (
            <Box key={s.key} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: MIX_COLORS[s.key as keyof typeof MIX_COLORS], flexShrink: 0 }} />
              <Typography variant="caption" color="text.secondary">{s.label}</Typography>
              <Typography variant="caption" sx={{ fontWeight: 700 }}>{formatPercent(s.pct)}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Paper>
  );
}
