'use client';
import React, { useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import BusinessIcon from '@mui/icons-material/Business';
import PaymentsIcon from '@mui/icons-material/Payments';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { useRoi } from '@/lib/roi/context';
import type { RoiInputs } from '@/lib/roi/types';
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
  const { state: { inputs }, loadInputs } = useRoi();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const handleDownload = () => {
    const payload = { version: 1, exportedAt: new Date().toISOString(), inputs };
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
        if (!data.inputs || typeof data.inputs !== 'object') throw new Error('Missing inputs');
        setLoadError(null);
        loadInputs(data.inputs);
      } catch {
        setLoadError('Could not load file — make sure it is a valid assumptions export.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1, borderBottom: '1px solid', borderColor: 'divider', flexShrink: 0, gap: 0.5 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', fontSize: '0.7rem', color: 'text.secondary', flex: 1 }}>
          Assumptions
        </Typography>
        <Tooltip title="Download assumptions">
          <IconButton size="small" onClick={handleDownload} sx={{ color: 'text.secondary' }}>
            <DownloadIcon sx={{ fontSize: 17 }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Load assumptions">
          <IconButton size="small" onClick={() => fileInputRef.current?.click()} sx={{ color: 'text.secondary' }}>
            <UploadIcon sx={{ fontSize: 17 }} />
          </IconButton>
        </Tooltip>
        <input ref={fileInputRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleFileChange} />
        <Tooltip title="Collapse panel">
          <IconButton size="small" onClick={onClose}><ChevronLeftIcon /></IconButton>
        </Tooltip>
      </Box>

      <Snackbar open={!!loadError} autoHideDuration={5000} onClose={() => setLoadError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
        <Alert severity="error" onClose={() => setLoadError(null)} sx={{ fontSize: '0.8rem' }}>
          {loadError}
        </Alert>
      </Snackbar>
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
    <Box data-no-print="true" sx={{
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
