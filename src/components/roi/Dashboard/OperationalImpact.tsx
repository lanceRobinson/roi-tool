'use client';
import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import { useRoi } from '@/lib/roi/context';
import { formatPercent, formatNumber } from '@/lib/roi/formatters';

function Stat({ value, sub, label }: { value: string; sub?: string; label: string }) {
  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', px: 1.5, py: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
        <Typography sx={{ fontSize: '2rem', fontWeight: 800, color: 'primary.main', lineHeight: 1.1 }}>
          {value}
        </Typography>
        {sub && (
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: 'primary.light' }}>
            {sub}
          </Typography>
        )}
      </Box>
      <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary', mt: 0.5, lineHeight: 1.4 }}>
        {label}
      </Typography>
    </Box>
  );
}

function ComparisonStat({ onlineValue, offlineValue, label }: { onlineValue: string; offlineValue: string; label: string }) {
  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', px: 1.5, py: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
        <Typography sx={{ fontSize: '2rem', fontWeight: 800, color: 'primary.main', lineHeight: 1.1 }}>
          {onlineValue}
        </Typography>
        <Typography sx={{ fontSize: '0.85rem', color: 'text.disabled', fontWeight: 500 }}>
          online
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
        <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: 'text.disabled' }}>
          vs {offlineValue}
        </Typography>
        <Typography sx={{ fontSize: '0.78rem', color: 'text.disabled' }}>
          offline
        </Typography>
      </Box>
      <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary', mt: 0.5, lineHeight: 1.4 }}>
        {label}
      </Typography>
    </Box>
  );
}

export default function OperationalImpact() {
  const { state: { inputs, results } } = useRoi();
  const { currentPaymentMix: cur, futurePaymentMix: fut } = results;

  const movedOnlineCount = (cur.check.count - fut.check.count) + (cur.offlineAch.count - fut.offlineAch.count);
  const movedOnlinePct   = cur.total.count > 0 ? movedOnlineCount / cur.total.count : 0;
  const manualEliminated = Math.round(movedOnlineCount);
  const selfServiceRate  = inputs.portalLoginRate * inputs.portalPaymentRate;
  const fteReleased      = inputs.fteExpense > 0 ? results.benefits.laborSavings / inputs.fteExpense : 0;

  return (
    <Paper variant="outlined" sx={{ borderRadius: 2, p: 2.5 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>Operational Impact</Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start' }}>

        <Stat
          value={formatNumber(manualEliminated)}
          label="manual payment events eliminated / year"
        />
        <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />

        <Stat
          value={fteReleased.toFixed(1)}
          sub="FTE"
          label="capacity released"
        />
        <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />

        <Stat
          value={formatPercent(movedOnlinePct, 1)}
          label="of payments moved online"
        />
        <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />

        <Stat
          value={formatPercent(selfServiceRate, 0)}
          label="customer self-service rate"
        />
        <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />

        <ComparisonStat
          onlineValue={formatPercent(inputs.onlineMatchRate, 0)}
          offlineValue={formatPercent(inputs.offlineMatchRate, 0)}
          label="payment match rate"
        />

      </Box>
    </Paper>
  );
}
