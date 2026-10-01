'use client';
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';

interface Props {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  decimals?: number;
  suffix?: string;
  helperText?: string;
}

export default function NumberInput({ label, value, onChange, min = 0, max, decimals = 0, suffix, helperText }: Props) {
  const [raw, setRaw] = useState('');
  const [focused, setFocused] = useState(false);

  const displayValue = focused ? raw : value.toFixed(decimals);

  return (
    <TextField
      label={label}
      value={displayValue + (focused ? '' : (suffix ? ` ${suffix}` : ''))}
      size="small"
      fullWidth
      helperText={helperText}
      onFocus={() => { setRaw(value.toFixed(decimals)); setFocused(true); }}
      onBlur={() => {
        setFocused(false);
        const n = parseFloat(raw);
        if (!isNaN(n)) {
          const clamped = max !== undefined ? Math.min(max, Math.max(min, n)) : Math.max(min, n);
          onChange(clamped);
        }
      }}
      onChange={e => setRaw(e.target.value)}
      slotProps={{ htmlInput: { inputMode: 'decimal' } }}
    />
  );
}
