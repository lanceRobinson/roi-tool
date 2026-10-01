'use client';
import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useRoi } from '@/lib/roi/context';
import { formatCurrencyCompact, formatPercent, formatNumber } from '@/lib/roi/formatters';

const CURRENT_COLORS: Record<string, string> = {
  creditCard: '#1976d2',
  check:      '#9c27b0',
  offlineAch: '#ed6c02',
  onlineAch:  '#00838f',
};

const FUTURE_COLORS: Record<string, string> = {
  versapayCard: '#2e7d32',
  versapayAch:  '#00838f',
  check:        '#9c27b0',
  offlineAch:   '#ed6c02',
};

const CURRENT_LABELS: Record<string, string> = {
  creditCard: 'Credit Card',
  check:      'Check',
  offlineAch: 'Offline ACH',
  onlineAch:  'Online ACH',
};

const FUTURE_LABELS: Record<string, string> = {
  versapayCard: 'Versapay Card',
  versapayAch:  'Versapay ACH',
  check:        'Check',
  offlineAch:   'Offline ACH',
};

function BreakdownRow({ color, label, pct, value }: { color: string; label: string; pct: number; value: number }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, py: 0.3 }}>
      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: color, flexShrink: 0 }} />
      <Typography sx={{ fontSize: '0.78rem', flex: 1, color: 'text.secondary' }}>{label}</Typography>
      <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, width: 38, textAlign: 'right' }}>{formatPercent(pct)}</Typography>
      <Typography sx={{ fontSize: '0.78rem', color: 'text.disabled', width: 54, textAlign: 'right' }}>{formatCurrencyCompact(value)}</Typography>
    </Box>
  );
}

function MixPie({ title, data, colors, labels, total }: {
  title: string;
  data: { key: string; value: number }[];
  colors: Record<string, string>;
  labels: Record<string, string>;
  total: number;
}) {
  const active = data.filter(d => d.value > 0);
  const pieData = active.map(d => ({ name: d.key, value: d.value }));

  return (
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography variant="body2" sx={{ fontWeight: 700, textAlign: 'center', mb: 0.5 }}>{title}</Typography>
      <ResponsiveContainer width="100%" height={160}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius={44}
            outerRadius={72}
            paddingAngle={2}
            dataKey="value"
          >
            {pieData.map(entry => (
              <Cell key={entry.name} fill={colors[entry.name] ?? '#546e7a'} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: unknown, name: unknown) => [
              `${formatCurrencyCompact(Number(value))} (${formatPercent(Number(value) / total)})`,
              labels[String(name)] ?? String(name),
            ]}
          />
        </PieChart>
      </ResponsiveContainer>
      <Box sx={{ mt: 1 }}>
        {active.map(({ key, value }) => (
          <BreakdownRow
            key={key}
            color={colors[key] ?? '#546e7a'}
            label={labels[key] ?? key}
            pct={total > 0 ? value / total : 0}
            value={value}
          />
        ))}
      </Box>
    </Box>
  );
}

function TransformStat({ value, label }: { value: string; label: string }) {
  return (
    <Box sx={{ flex: 1, textAlign: 'center', px: 1 }}>
      <Typography sx={{ fontSize: '1.6rem', fontWeight: 800, color: 'primary.main', lineHeight: 1.1 }}>
        {value}
      </Typography>
      <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary', mt: 0.5, lineHeight: 1.4 }}>
        {label}
      </Typography>
    </Box>
  );
}

export default function PaymentMixChart() {
  const { state: { inputs, results } } = useRoi();
  const { currentPaymentMix: cur, futurePaymentMix: fut } = results;

  // Payments moved online = checks + offline ACH that converted to Versapay
  const movedOnlineCount = (cur.check.count - fut.check.count) + (cur.offlineAch.count - fut.offlineAch.count);
  const movedOnlinePct = cur.total.count > 0 ? movedOnlineCount / cur.total.count : 0;

  // Manual events eliminated = same converted count (each was a manual processing event)
  const manualEliminated = Math.round(movedOnlineCount);

  // Customer self-service rate = portal login rate × portal payment rate
  const selfServiceRate = inputs.portalLoginRate * inputs.portalPaymentRate;

  const currentData = [
    { key: 'creditCard', value: cur.creditCard.value },
    { key: 'check',      value: cur.check.value },
    { key: 'offlineAch', value: cur.offlineAch.value },
    { key: 'onlineAch',  value: cur.onlineAch.value },
  ];

  const futureData = [
    { key: 'versapayCard', value: fut.versapayCard.value },
    { key: 'versapayAch',  value: fut.versapayAch.value },
    { key: 'check',        value: fut.check.value },
    { key: 'offlineAch',   value: fut.offlineAch.value },
  ];

  return (
    <Paper variant="outlined" sx={{ borderRadius: 2, p: 2.5 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>Current vs Future Payment Mix</Typography>

      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
        <MixPie
          title="Current"
          data={currentData}
          colors={CURRENT_COLORS}
          labels={CURRENT_LABELS}
          total={cur.total.value}
        />
        <Divider orientation="vertical" flexItem />
        <MixPie
          title="Future (with Versapay)"
          data={futureData}
          colors={FUTURE_COLORS}
          labels={FUTURE_LABELS}
          total={fut.total.value}
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box>
        <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'text.disabled', mb: 1.5 }}>
          Payment Transformation
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
          <TransformStat
            value={formatPercent(movedOnlinePct, 1)}
            label="of payments moved online"
          />
          <Divider orientation="vertical" flexItem />
          <TransformStat
            value={formatNumber(manualEliminated)}
            label="manual payment events eliminated annually"
          />
          <Divider orientation="vertical" flexItem />
          <TransformStat
            value={formatPercent(selfServiceRate)}
            label="customer self-service rate"
          />
        </Box>
      </Box>
    </Paper>
  );
}
