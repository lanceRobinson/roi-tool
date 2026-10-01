'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BusinessIcon from '@mui/icons-material/Business';
import PaymentsIcon from '@mui/icons-material/Payments';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import RefreshIcon from '@mui/icons-material/Refresh';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { RoiProvider, useRoi } from '@/lib/roi/context';
import BusinessInputs from '@/components/roi/InputPanel/BusinessInputs';
import PaymentMixInputs from '@/components/roi/InputPanel/PaymentMixInputs';
import ImpactInputs from '@/components/roi/InputPanel/ImpactInputs';
import FinancialInputs from '@/components/roi/InputPanel/FinancialInputs';

const sections = [
  { key: 'business',  label: 'Business Profile',     icon: <BusinessIcon sx={{ fontSize: 16 }} />,       content: <BusinessInputs /> },
  { key: 'payments',  label: 'Payment Mix',           icon: <PaymentsIcon sx={{ fontSize: 16 }} />,       content: <PaymentMixInputs /> },
  { key: 'impact',    label: 'Versapay Impact',       icon: <AutoGraphIcon sx={{ fontSize: 16 }} />,      content: <ImpactInputs /> },
  { key: 'financial', label: 'Financial Assumptions', icon: <AccountBalanceIcon sx={{ fontSize: 16 }} />, content: <FinancialInputs /> },
];

function InputsPanel() {
  const { reset } = useRoi();
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Brief delay so the REQUEST_STATE round-trip can complete before showing connected
    const t = setTimeout(() => setConnected(true), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <Box sx={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        px: 2, py: 1.5,
        bgcolor: 'white',
        borderBottom: '1px solid',
        borderColor: 'divider',
        flexShrink: 0,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ width: 6, height: 24, bgcolor: 'primary.main', borderRadius: 0.5 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.8rem', letterSpacing: 0.3 }}>
            VERSAPAY ROI — INPUTS
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{
              width: 7, height: 7, borderRadius: '50%',
              bgcolor: connected ? 'success.main' : 'warning.main',
              transition: 'background-color 0.3s',
            }} />
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
              {connected ? 'Live' : 'Connecting…'}
            </Typography>
          </Box>
          <Tooltip title="Reset to defaults">
            <IconButton size="small" onClick={reset}>
              <RefreshIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Accordions */}
      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        {sections.map((s, idx) => (
          <Accordion key={s.key} defaultExpanded={idx === 0} disableGutters elevation={0}
            sx={{ '&:before': { display: 'none' }, borderBottom: '1px solid', borderColor: 'divider' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ fontSize: 18 }} />} sx={{ px: 2, py: 0.5, minHeight: 44 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ color: 'primary.main' }}>{s.icon}</Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{s.label}</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ px: 2, pb: 2, pt: 0.5 }}>
              {s.content}
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      <Box sx={{ px: 2, py: 1, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'white' }}>
        <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.68rem' }}>
          Changes sync to the presentation window in real time.
        </Typography>
      </Box>
    </Box>
  );
}

export default function InputsClient() {
  const params = useSearchParams();
  const sessionId = params.get('session') ?? undefined;

  return (
    <RoiProvider sessionId={sessionId}>
      <InputsPanel />
    </RoiProvider>
  );
}
