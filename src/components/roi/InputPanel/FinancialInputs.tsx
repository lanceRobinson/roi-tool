'use client';
import React, { useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import { useRoi } from '@/lib/roi/context';
import PercentageInput from '../common/PercentageInput';
import CurrencyInput from '../common/CurrencyInput';
import InputSlider from '../common/InputSlider';
import type { RoiInputs } from '@/lib/roi/types';

export default function FinancialInputs() {
  const { state: { inputs }, setInputs, loadInputs } = useRoi();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const handleDownload = () => {
    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      inputs,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const slug = inputs.businessName
      ? inputs.businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      : 'assumptions';
    a.download = `versapay-roi-${slug}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string) as { version?: number; inputs?: Partial<RoiInputs> };
        if (!data.inputs || typeof data.inputs !== 'object') throw new Error('Missing inputs object');
        setLoadError(null);
        loadInputs(data.inputs);
      } catch {
        setLoadError('Could not load file — make sure it is a valid assumptions export.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {/* Save / Load */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          size="small"
          variant="outlined"
          startIcon={<DownloadIcon sx={{ fontSize: 15 }} />}
          onClick={handleDownload}
          sx={{ flex: 1, fontSize: '0.75rem', textTransform: 'none' }}
        >
          Download
        </Button>
        <Button
          size="small"
          variant="outlined"
          startIcon={<UploadIcon sx={{ fontSize: 15 }} />}
          onClick={() => fileInputRef.current?.click()}
          sx={{ flex: 1, fontSize: '0.75rem', textTransform: 'none' }}
        >
          Load
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </Box>
      {loadError && (
        <Alert severity="error" onClose={() => setLoadError(null)} sx={{ fontSize: '0.75rem', py: 0 }}>
          {loadError}
        </Alert>
      )}

      <Divider />

      <Grid container spacing={1.5}>
        <Grid size={{ xs: 6 }}>
          <PercentageInput label="Cost of Capital" value={inputs.costOfCapital} onChange={v => setInputs({ costOfCapital: v })} max={0.5} />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <PercentageInput label="Debt-to-AR Ratio" value={inputs.debtToArRatio} onChange={v => setInputs({ debtToArRatio: v })} max={0.5} />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <PercentageInput label="Surcharge Rate" value={inputs.surchargeRate} onChange={v => setInputs({ surchargeRate: v })} />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <PercentageInput label="CC Processing Savings" value={inputs.creditCardProcessingSavings} onChange={v => setInputs({ creditCardProcessingSavings: v })} max={0.1} />
        </Grid>
      </Grid>
      <InputSlider label="Write-Off Recovery Impact" value={inputs.writeoffRecoveryPct} onChange={v => setInputs({ writeoffRecoveryPct: v })} step={0.01} />
      <InputSlider label="Revenue / Churn Uplift" value={inputs.revenueUpliftPct} onChange={v => setInputs({ revenueUpliftPct: v })} step={0.001} max={0.05}
        formatValue={v => `${(v * 100).toFixed(2)}%`} />
      <CurrencyInput label="Software (Annual Subscription)" value={inputs.softwareCost} onChange={v => setInputs({ softwareCost: v })} />
      <CurrencyInput label="Implementation (One-Time Fee)" value={inputs.implementationCost} onChange={v => setInputs({ implementationCost: v })} />
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 6 }}>
          <CurrencyInput label="Avoided Hiring Cost" value={inputs.avoidedHiringCost} onChange={v => setInputs({ avoidedHiringCost: v })} />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <CurrencyInput label="System Decommission" value={inputs.systemDecommissionCost} onChange={v => setInputs({ systemDecommissionCost: v })} />
        </Grid>
      </Grid>
    </Box>
  );
}
