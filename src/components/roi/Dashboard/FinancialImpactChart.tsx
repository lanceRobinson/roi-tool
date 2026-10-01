'use client';
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Popover from '@mui/material/Popover';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useRoi } from '@/lib/roi/context';
import { formatCurrency, formatCurrencyCompact } from '@/lib/roi/formatters';
import type { RoiBenefits } from '@/lib/roi/types';

const BENEFIT_LABELS: Record<keyof RoiBenefits, string> = {
  laborSavings:               'Labor Savings',
  revenueUplift:              'Revenue / Churn Uplift',
  workingCapitalInterest:     'Working Capital Interest',
  writeoffReduction:          'Write-Off Reduction',
  avoidedHiring:              'Avoided Hiring',
  strategicCollections:       'Strategic Collections',
  surchargeSavings:           'Surcharge Recovery',
  systemDecommissioning:      'System Decommission',
  creditCardProcessingSavings:'CC Processing Savings',
  workingCapitalRedeployed:   'Redeployed WC',
};

interface BenefitInfo { title: string; description: string; formula: string }

const BENEFIT_INFO: Partial<Record<keyof RoiBenefits, BenefitInfo>> = {
  laborSavings: {
    title: 'Labor Savings',
    description: 'Reduces manual AR staff time through automation of cash application and collections workflows. Versapay\'s online portal and automated matching directly cut the hours your team spends on routine tasks.',
    formula: '(Collections FTE × 2,080 hrs × Efficiency Gain + Cash App FTE × 2,080 hrs × Offline Match Rate) × Hourly Rate',
  },
  revenueUplift: {
    title: 'Revenue / Churn Uplift',
    description: 'Incremental revenue retained by improving the customer payment experience and strengthening AR relationships. Better visibility and self-service options reduce disputes and customer attrition.',
    formula: 'Revenue Uplift % × Annual Invoice Value',
  },
  workingCapitalInterest: {
    title: 'Working Capital Interest',
    description: 'Interest savings from faster cash collection as offline payments shift to online. Reducing Days Sales Outstanding (DSO) means cash arrives sooner, lowering the cost of carrying outstanding receivables.',
    formula: 'DSO × Offline-to-Online DSO Reduction % × Daily Average Sales × Cost of Capital',
  },
  writeoffReduction: {
    title: 'Write-Off Reduction',
    description: 'Bad debt recovered through improved collections visibility, proactive dunning, and earlier dispute resolution. Versapay\'s dispute management tools help recover receivables that would otherwise be written off.',
    formula: 'Debt-to-AR Ratio × Annual Invoice Value × Write-Off Recovery %',
  },
  avoidedHiring: {
    title: 'Avoided Hiring',
    description: 'Headcount cost avoided by automating AR processes instead of adding staff to handle volume growth. Entered as a fixed annual dollar value based on projected hiring needs.',
    formula: 'Fixed dollar input (estimated cost of headcount that would otherwise be hired)',
  },
  strategicCollections: {
    title: 'Strategic Collections',
    description: 'Working capital value unlocked when collections staff are redeployed from manual tasks to strategic, high-value account management. The resulting further DSO reduction generates additional interest savings.',
    formula: 'DSO × Redeployed Headcount DSO Reduction % × Daily Average Sales × Cost of Capital',
  },
  surchargeSavings: {
    title: 'Surcharge Recovery',
    description: 'Revenue captured by passing credit card processing fees to customers who choose to pay by card. Versapay\'s surcharge capability allows compliant fee pass-through on card transactions.',
    formula: 'Surcharge Rate × Annual Credit Card Payment Volume',
  },
  systemDecommissioning: {
    title: 'System Decommission',
    description: 'Annual savings from retiring legacy AR and payment systems that Versapay replaces. Includes software licenses, maintenance fees, and integration costs for systems no longer needed.',
    formula: 'Fixed dollar input (annual cost of legacy systems being retired)',
  },
  creditCardProcessingSavings: {
    title: 'CC Processing Savings',
    description: 'Reduced cost of credit card acceptance through Versapay\'s negotiated interchange rates or processing fee optimization. Applied to the existing credit card payment volume.',
    formula: 'CC Processing Savings Rate × Annual Credit Card Payment Volume',
  },
};

const BAR_COLORS: Partial<Record<keyof RoiBenefits, string>> = {
  laborSavings:               '#1976d2',
  revenueUplift:              '#2e7d32',
  workingCapitalInterest:     '#00838f',
  writeoffReduction:          '#7b1fa2',
  avoidedHiring:              '#e65100',
  strategicCollections:       '#558b2f',
  surchargeSavings:           '#0277bd',
  systemDecommissioning:      '#4e342e',
  creditCardProcessingSavings:'#c62828',
};

export default function FinancialImpactChart() {
  const { state: { rawResults, results, disabledBenefits }, setDisabledBenefits } = useRoi();
  const [popover, setPopover] = useState<{ anchorEl: HTMLElement; key: keyof RoiBenefits } | null>(null);

  // All toggleable keys sorted by raw value descending
  const allEntries = (Object.keys(rawResults.benefits) as (keyof RoiBenefits)[])
    .filter(k => k !== 'workingCapitalRedeployed')
    .map(k => ({ key: k, label: BENEFIT_LABELS[k], rawValue: rawResults.benefits[k] }))
    .filter(e => e.rawValue > 0)
    .sort((a, b) => b.rawValue - a.rawValue);

  const enabledKeys = allEntries.map(e => e.key).filter(k => !disabledBenefits.includes(k));
  const visibleEntries = allEntries.filter(e => !disabledBenefits.includes(e.key));
  const maxValue = Math.max(...visibleEntries.map(e => e.rawValue), 1);

  const handleSelectChange = (event: SelectChangeEvent<string[]>) => {
    const selected = event.target.value as string[];
    const newDisabled = allEntries.map(e => e.key).filter(k => !selected.includes(k));
    setDisabledBenefits(newDisabled as (keyof RoiBenefits)[]);
  };

  const renderValue = (selected: string[]) => {
    if (selected.length === allEntries.length) return 'All benefits';
    return `${selected.length} of ${allEntries.length} benefits`;
  };

  const activeInfo = popover ? BENEFIT_INFO[popover.key] : null;

  return (
    <Paper variant="outlined" sx={{ borderRadius: 2, p: 2.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Annual Financial Impact</Typography>
        <Select
          multiple
          value={enabledKeys as string[]}
          onChange={handleSelectChange}
          renderValue={renderValue}
          size="small"
          sx={{ fontSize: '0.8rem', minWidth: 160 }}
          MenuProps={{ slotProps: { paper: { sx: { maxHeight: 320 } } } }}
        >
          {allEntries.map(({ key, label }) => (
            <MenuItem key={key} value={key} dense>
              <Checkbox checked={enabledKeys.includes(key)} size="small" sx={{ py: 0.25 }} />
              <ListItemText primary={label} slotProps={{ primary: { sx: { fontSize: '0.85rem' } } }} />
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
        {visibleEntries.map(({ key, label, rawValue }) => {
          const barPct = (rawValue / maxValue) * 100;
          const color = BAR_COLORS[key] ?? '#546e7a';
          const hasInfo = Boolean(BENEFIT_INFO[key]);
          return (
            <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', width: 190, flexShrink: 0, gap: 0.25 }}>
                <Typography sx={{ fontSize: '0.85rem', flex: 1 }}>
                  {label}
                </Typography>
                {hasInfo && (
                  <IconButton
                    size="small"
                    onClick={e => setPopover({ anchorEl: e.currentTarget, key })}
                    sx={{ p: 0.25, color: 'text.disabled', '&:hover': { color: 'text.secondary' } }}
                  >
                    <InfoOutlinedIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                )}
              </Box>
              <Box sx={{ flex: 1, height: 16, bgcolor: 'grey.100', borderRadius: 1, overflow: 'hidden', position: 'relative' }}>
                <Box sx={{
                  position: 'absolute', left: 0, top: 0, bottom: 0,
                  width: `${barPct}%`,
                  bgcolor: color,
                  borderRadius: 1,
                }} />
              </Box>
              <Typography sx={{
                fontSize: '0.85rem',
                width: 72,
                textAlign: 'right',
                flexShrink: 0,
                fontVariantNumeric: 'tabular-nums',
              }}>
                {formatCurrencyCompact(rawValue)}
              </Typography>
            </Box>
          );
        })}
      </Box>

      <Divider sx={{ mt: 1.5, mb: 1 }} />
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 0.5 }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
          Total Annual Benefit
        </Typography>
        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="h6" color="primary.main" sx={{ fontWeight: 800, lineHeight: 1 }}>
            {formatCurrency(results.totalAnnualBenefit)}
          </Typography>
        </Box>
      </Box>

      <Popover
        open={Boolean(popover)}
        anchorEl={popover?.anchorEl}
        onClose={() => setPopover(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{ paper: { sx: { maxWidth: 320, borderRadius: 2, p: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.12)' } } }}
      >
        {activeInfo && (
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', mb: 0.75 }}>
              {activeInfo.title}
            </Typography>
            <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary', mb: 1.25, lineHeight: 1.5 }}>
              {activeInfo.description}
            </Typography>
            <Box sx={{ bgcolor: 'grey.50', borderRadius: 1, p: 1, borderLeft: '3px solid', borderColor: 'primary.main' }}>
              <Typography sx={{ fontSize: '0.7rem', color: 'text.disabled', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, mb: 0.4 }}>
                Formula
              </Typography>
              <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary', lineHeight: 1.5 }}>
                {activeInfo.formula}
              </Typography>
            </Box>
          </Box>
        )}
      </Popover>
    </Paper>
  );
}
