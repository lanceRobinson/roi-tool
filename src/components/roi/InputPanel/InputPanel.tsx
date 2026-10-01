'use client';
import React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import BusinessIcon from '@mui/icons-material/Business';
import PaymentsIcon from '@mui/icons-material/Payments';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { useRoi } from '@/lib/roi/context';
import BusinessInputs from './BusinessInputs';
import PaymentMixInputs from './PaymentMixInputs';
import ImpactInputs from './ImpactInputs';
import FinancialInputs from './FinancialInputs';

const PANEL_WIDTH = 360;

const sections = [
  { key: 'business',  label: 'Business Profile',       icon: <BusinessIcon sx={{ fontSize: 16 }} />,       content: <BusinessInputs /> },
  { key: 'payments',  label: 'Payment Mix',             icon: <PaymentsIcon sx={{ fontSize: 16 }} />,       content: <PaymentMixInputs /> },
  { key: 'impact',    label: 'Versapay Impact',         icon: <AutoGraphIcon sx={{ fontSize: 16 }} />,      content: <ImpactInputs /> },
  { key: 'financial', label: 'Financial Assumptions',   icon: <AccountBalanceIcon sx={{ fontSize: 16 }} />, content: <FinancialInputs /> },
];

function PanelContent({ onClose }: { onClose: () => void }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider', flexShrink: 0 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', fontSize: '0.7rem', color: 'text.secondary' }}>
          Assumptions
        </Typography>
        <Tooltip title="Collapse panel">
          <IconButton size="small" onClick={onClose}><ChevronLeftIcon /></IconButton>
        </Tooltip>
      </Box>
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
    </Box>
  );
}

interface Props {
  isMobile: boolean;
}

export default function InputPanel({ isMobile }: Props) {
  const { state: { inputPanelOpen, presentationMode }, dispatch } = useRoi();
  const close = () => dispatch({ type: 'SET_PANEL_OPEN', payload: false });

  if (presentationMode) return null;

  if (isMobile) {
    return (
      <Drawer open={inputPanelOpen} onClose={close} slotProps={{ paper: { sx: { width: PANEL_WIDTH } } }}>
        <PanelContent onClose={close} />
      </Drawer>
    );
  }

  return (
    <Box sx={{
      width: inputPanelOpen ? PANEL_WIDTH : 0,
      minWidth: inputPanelOpen ? PANEL_WIDTH : 0,
      flexShrink: 0,
      transition: 'width 0.25s ease, min-width 0.25s ease',
      overflow: 'hidden',
      borderRight: '1px solid',
      borderColor: 'divider',
      bgcolor: 'background.paper',
      height: '100%',
    }}>
      {inputPanelOpen && <PanelContent onClose={close} />}
    </Box>
  );
}
