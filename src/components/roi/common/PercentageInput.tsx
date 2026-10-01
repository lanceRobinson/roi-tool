'use client';
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

interface Props {
  label: string;
  value: number;   // fraction 0–1
  onChange: (v: number) => void;
  min?: number;    // fraction
  max?: number;    // fraction
  helperText?: string;
}

export default function PercentageInput({ label, value, onChange, min = 0, max = 1, helperText }: Props) {
  const [raw, setRaw] = useState('');
  const [focused, setFocused] = useState(false);

  const displayValue = focused ? raw : (value * 100).toFixed(1);

  return (
    <TextField
      label={label}
      value={displayValue}
      size="small"
      fullWidth
      helperText={helperText}
      slotProps={{
        input: { endAdornment: <InputAdornment position="end">%</InputAdornment> },
        htmlInput: { inputMode: 'decimal' },
      }}
      onFocus={() => { setRaw((value * 100).toFixed(1)); setFocused(true); }}
      onBlur={() => {
        setFocused(false);
        const n = parseFloat(raw);
        if (!isNaN(n)) {
          const clamped = Math.min(max * 100, Math.max(min * 100, n));
          onChange(clamped / 100);
        }
      }}
      onChange={e => setRaw(e.target.value)}
    />
  );
}
