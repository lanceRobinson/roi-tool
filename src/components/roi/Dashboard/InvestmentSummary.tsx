'use client';
import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import { useRoi } from '@/lib/roi/context';
import { formatCurrency, formatCurrencyCompact, formatRoi } from '@/lib/roi/formatters';

function CostRow({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', py: 0.35 }}>
      <Box>
        <Typography variant="body2" sx={{ fontSize: '0.8rem', color: 'text.primary' }}>{label}</Typography>
        {sub && <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.7rem' }}>{sub}</Typography>}
      </Box>
      <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.85rem', ml: 2 }}>{value}</Typography>
    </Box>
  );
}

function SecondaryMetric({ value, label }: { value: string; label: string }) {
  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: 'primary.dark', lineHeight: 1.2 }}>
        {value}
      </Typography>
      <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary', mt: 0.25 }}>
        {label}
      </Typography>
    </Box>
  );
}

export default function InvestmentSummary() {
  const { state: { results } } = useRoi();

  const paybackMonths = results.totalAnnualBenefit > 0
    ? (results.totalInvestment / results.totalAnnualBenefit) * 12
    : 0;
  const netBenefit = results.totalAnnualBenefit - results.totalInvestment;

  return (
    <Paper variant="outlined" sx={{ borderRadius: 2, p: 2.5 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>Investment Summary</Typography>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'stretch' }}>

        {/* Annual Benefit */}
        <Box sx={{ flex: 1, textAlign: 'center', px: 3, py: 1.5 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>Annual Financial Benefit</Typography>
          <Typography variant="h5" color="primary.main" sx={{ fontWeight: 800 }}>{formatCurrency(results.totalAnnualBenefit)}</Typography>
        </Box>

        <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
        <Divider sx={{ display: { xs: 'block', sm: 'none' } }} />

        {/* Investment breakdown */}
        <Box sx={{ flex: 1, px: 3, py: 1.5 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>Total Investment</Typography>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 1.25 }}>{formatCurrency(results.totalInvestment)}</Typography>
          <Divider sx={{ mb: 0.75 }} />
          <CostRow label="Software" value={formatCurrency(results.softwareCost)} sub="Annual subscription" />
          <CostRow label="Implementation" value={formatCurrency(results.implementationCost)} sub="One-time fee" />
        </Box>

        <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
        <Divider sx={{ display: { xs: 'block', sm: 'none' } }} />

        {/* ROI */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', px: 3, py: 1.5, bgcolor: 'primary.50', borderRadius: { xs: 0, sm: '0 8px 8px 0' }, gap: 1.5 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.25 }}>Year 1 ROI</Typography>
            <Typography variant="h4" color="primary.main" sx={{ fontWeight: 900, lineHeight: 1 }}>{formatRoi(results.roi)}</Typography>
            <Typography variant="caption" color="text.disabled">Annual Benefit ÷ Investment</Typography>
          </Box>

          <Divider flexItem sx={{ borderColor: 'primary.100' }} />

          <Box sx={{ display: 'flex', gap: 2, width: '100%', justifyContent: 'center' }}>
            <SecondaryMetric
              value={`${paybackMonths.toFixed(1)} mo`}
              label="Payback Period"
            />
            <Divider orientation="vertical" flexItem sx={{ borderColor: 'primary.100' }} />
            <SecondaryMetric
              value={formatCurrencyCompact(netBenefit)}
              label="Net Year 1 Benefit"
            />
          </Box>
        </Box>

      </Box>
    </Paper>
  );
}
