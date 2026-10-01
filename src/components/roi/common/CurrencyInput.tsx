'use client';
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

interface Props {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  helperText?: string;
}

export default function CurrencyInput({ label, value, onChange, min = 0, helperText }: Props) {
  const [raw, setRaw] = useState('');
  const [focused, setFocused] = useState(false);

  const displayValue = focused ? raw : value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  return (
    <TextField
      label={label}
      value={displayValue}
      size="small"
      fullWidth
      helperText={helperText}
      slotProps={{
        input: { startAdornment: <InputAdornment position="start">$</InputAdornment> },
        htmlInput: { inputMode: 'numeric' },
      }}
      onFocus={() => { setRaw(String(value)); setFocused(true); }}
      onBlur={() => {
        setFocused(false);
        const n = parseFloat(raw.replace(/,/g, ''));
        if (!isNaN(n) && n >= min) onChange(n);
      }}
      onChange={e => setRaw(e.target.value)}
    />
  );
}
