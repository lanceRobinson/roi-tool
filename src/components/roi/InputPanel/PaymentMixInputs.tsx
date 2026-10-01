'use client';
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Alert from '@mui/material/Alert';
import { useRoi } from '@/lib/roi/context';

type MixKey = 'creditCard' | 'check' | 'offlineAch' | 'onlineAch';

const ALL_KEYS: MixKey[] = ['creditCard', 'check', 'offlineAch', 'onlineAch'];

interface MixSliderProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  color: string;
}

function MixSlider({ label, value, onChange, color }: MixSliderProps) {
  const [draft, setDraft] = useState<string | null>(null);

  const commit = (raw: string) => {
    setDraft(null);
    const num = parseFloat(raw);
    if (!isNaN(num)) onChange(Math.max(0, Math.min(100, num)) / 100);
  };

  return (
    <Box sx={{ mb: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.25 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: color, flexShrink: 0 }} />
          <Typography variant="caption" color="text.secondary">{label}</Typography>
        </Box>
        <Box sx={{
          display: 'flex', alignItems: 'center',
          border: '1px solid',
          borderColor: draft !== null ? 'primary.main' : 'divider',
          borderRadius: 0.75,
          bgcolor: draft !== null ? 'primary.50' : 'transparent',
          px: 0.5, py: 0.15,
          transition: 'border-color 0.15s, background-color 0.15s',
        }}>
          <InputBase
            value={draft !== null ? draft : (value * 100).toFixed(1)}
            onChange={e => setDraft(e.target.value)}
            onFocus={() => setDraft((value * 100).toFixed(1))}
            onBlur={e => commit(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') { commit(draft ?? ''); (e.target as HTMLInputElement).blur(); }
              if (e.key === 'Escape') { setDraft(null); (e.target as HTMLInputElement).blur(); }
            }}
            inputProps={{
              style: { textAlign: 'right', padding: 0, width: 36, fontSize: '0.75rem', fontWeight: 700 },
            }}
          />
          <Typography variant="caption" sx={{ fontWeight: 700, ml: 0.25, color: 'text.secondary', lineHeight: 1 }}>%</Typography>
        </Box>
      </Box>
      <Slider
        value={Math.round(value * 1000) / 10}
        min={0} max={100} step={1}
        size="small"
        sx={{ py: 0.5, '& .MuiSlider-thumb': { bgcolor: color }, '& .MuiSlider-track': { bgcolor: color }, '& .MuiSlider-rail': { bgcolor: 'grey.200' } }}
        onChange={(_, v) => onChange((v as number) / 100)}
      />
    </Box>
  );
}

export default function PaymentMixInputs() {
  const { state: { inputs }, setPaymentMix } = useRoi();
  const { creditCard, check, offlineAch, onlineAch } = inputs.paymentMix;
  const total = creditCard + check + offlineAch + onlineAch;
  const isValid = Math.abs(total - 1) < 0.005;

  // Recency order: index 0 = most recently touched, last = least recently touched (absorber).
  const [touchOrder, setTouchOrder] = useState<MixKey[]>(['creditCard', 'check', 'offlineAch', 'onlineAch']);

  const handleChange = (key: MixKey) => (newVal: number) => {
    const order = [key, ...touchOrder.filter(k => k !== key)];
    setTouchOrder(order);

    const mix = inputs.paymentMix;
    const vals: Record<MixKey, number> = {
      creditCard: mix.creditCard,
      check: mix.check,
      offlineAch: mix.offlineAch,
      onlineAch: mix.onlineAch,
      [key]: newVal,
    };

    // Distribute deficit from least-recently-touched, keeping all others frozen.
    let deficit = 1 - ALL_KEYS.reduce((s, k) => s + vals[k], 0);
    for (let i = order.length - 1; i >= 1 && Math.abs(deficit) > 0.0005; i--) {
      const k = order[i];
      const adj = Math.max(-vals[k], Math.min(1 - vals[k], deficit));
      vals[k] = Math.round((vals[k] + adj) * 1000) / 1000;
      deficit -= adj;
    }

    setPaymentMix(vals);
  };

  return (
    <Box>
      <MixSlider label="Credit Card" value={creditCard} onChange={handleChange('creditCard')} color="#1976d2" />
      <MixSlider label="Check"       value={check}      onChange={handleChange('check')}       color="#9c27b0" />
      <MixSlider label="Offline ACH" value={offlineAch} onChange={handleChange('offlineAch')} color="#ed6c02" />
      <MixSlider label="Online ACH"  value={onlineAch}  onChange={handleChange('onlineAch')}  color="#00838f" />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 0.5, borderTop: '1px solid', borderColor: 'divider' }}>
        <Typography variant="caption" color="text.secondary">Total</Typography>
        <Typography variant="caption" color={isValid ? 'success.main' : 'error.main'} sx={{ fontWeight: 700 }}>
          {(total * 100).toFixed(1)}%
        </Typography>
      </Box>
      {!isValid && (
        <Alert severity="error" sx={{ mt: 1, py: 0, fontSize: '0.72rem' }}>
          Payment mix must total 100%
        </Alert>
      )}
    </Box>
  );
}
