'use client';
import React, { useRef, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';
import Collapse from '@mui/material/Collapse';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import RefreshIcon from '@mui/icons-material/Refresh';
import PresentToAllIcon from '@mui/icons-material/PresentToAll';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { RoiProvider, useRoi } from '@/lib/roi/context';
import InputPanel from './InputPanel/InputPanel';
import ProfileSummary from './Dashboard/ProfileSummary';
import RoiHero from './Dashboard/RoiHero';
import PaymentMixChart from './Dashboard/PaymentMixChart';
import FinancialImpactChart from './Dashboard/FinancialImpactChart';
import InvestmentSummary from './Dashboard/InvestmentSummary';

const SECTIONS = [
  { id: 'section-overview', label: 'ROI Overview' },
  { id: 'section-profile', label: 'Business Profile' },
  { id: 'section-mix',     label: 'Payment Mix' },
  { id: 'section-impact',  label: 'Financial Impact' },
  { id: 'section-invest',  label: 'Investment' },
];

function SectionLabel({ children, collapsed, onToggle }: { children: string; collapsed: boolean; onToggle: () => void }) {
  return (
    <Box
      onClick={onToggle}
      sx={{
        display: 'flex', alignItems: 'center', gap: 1.5, mb: collapsed ? 0 : 1.5, mt: 0.5,
        cursor: 'pointer', userSelect: 'none',
        '&:hover .section-rule': { bgcolor: 'text.disabled' },
        '&:hover .section-title': { color: 'text.secondary' },
      }}
    >
      <Box className="section-rule" sx={{ height: 1, width: 16, bgcolor: 'divider', transition: 'background-color 0.15s' }} />
      <Typography className="section-title" sx={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'text.disabled', whiteSpace: 'nowrap', transition: 'color 0.15s' }}>
        {children}
      </Typography>
      <Box className="section-rule" sx={{ flex: 1, height: 1, bgcolor: 'divider', transition: 'background-color 0.15s' }} />
      <ExpandMoreIcon sx={{
        fontSize: 14, color: 'text.disabled', flexShrink: 0,
        transform: collapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
        transition: 'transform 0.2s',
      }} />
    </Box>
  );
}

function DashboardNav({ activeSection, onNavigate, hasCollapsed, onExpandAll }: {
  activeSection: string;
  onNavigate: (id: string) => void;
  hasCollapsed: boolean;
  onExpandAll: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Box
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      sx={{
        flexShrink: 0,
        width: open ? 156 : 20,
        transition: 'width 0.22s ease',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
      }}
    >
      {/* Collapsed: dots only */}
      <Box sx={{
        position: 'absolute',
        right: 4,
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
        opacity: open ? 0 : 1,
        transition: 'opacity 0.15s',
        pointerEvents: 'none',
      }}>
        {SECTIONS.map(({ id }) => {
          const active = activeSection === id;
          return (
            <Box key={id} sx={{
              width: active ? 7 : 5,
              height: active ? 7 : 5,
              borderRadius: '50%',
              bgcolor: active ? 'primary.main' : 'grey.300',
              transition: 'all 0.15s',
              flexShrink: 0,
            }} />
          );
        })}
      </Box>

      {/* Expanded: pill card */}
      <Box sx={{
        position: 'absolute',
        right: 8,
        top: '50%',
        transform: 'translateY(-50%)',
        width: 140,
        bgcolor: 'background.paper',
        borderRadius: 2.5,
        boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
        border: '1px solid',
        borderColor: 'divider',
        py: 1.25,
        px: 0.75,
        opacity: open ? 1 : 0,
        transition: 'opacity 0.18s',
        pointerEvents: open ? 'auto' : 'none',
      }}>
        {SECTIONS.map(({ id, label }) => {
          const active = activeSection === id;
          return (
            <Box
              key={id}
              onClick={() => onNavigate(id)}
              sx={{
                display: 'flex', alignItems: 'center', gap: 1,
                py: 0.6, px: 0.75, mb: 0.15,
                borderRadius: 1.5,
                cursor: 'pointer',
                userSelect: 'none',
                bgcolor: active ? 'primary.50' : 'transparent',
                '&:hover': { bgcolor: active ? 'primary.100' : 'action.hover' },
                transition: 'background-color 0.12s',
              }}
            >
              <Box sx={{
                width: active ? 8 : 6,
                height: active ? 8 : 6,
                borderRadius: '50%',
                flexShrink: 0,
                bgcolor: active ? 'primary.main' : 'grey.300',
                transition: 'all 0.15s',
              }} />
              <Typography sx={{
                fontSize: '0.75rem',
                fontWeight: active ? 700 : 400,
                color: active ? 'primary.main' : 'text.secondary',
                lineHeight: 1.3,
                whiteSpace: 'nowrap',
              }}>
                {label}
              </Typography>
            </Box>
          );
        })}
        {hasCollapsed && (
          <Box
            onClick={onExpandAll}
            sx={{
              mt: 0.75, pt: 0.75,
              borderTop: '1px solid', borderColor: 'divider',
              textAlign: 'center',
              cursor: 'pointer',
              borderRadius: 1,
              py: 0.5,
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', fontWeight: 600 }}>
              Expand all
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

function Dashboard() {
  const { state: { presentationMode } } = useRoi();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [focused, setFocused] = useState<string | null>(null);
  const focusTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toggle = (id: string) => setCollapsed(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });
  const isCollapsed = (id: string) => collapsed.has(id);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      let current = SECTIONS[0].id;
      for (const { id } of SECTIONS) {
        const section = document.getElementById(id);
        if (section && section.offsetTop - 72 <= el.scrollTop) current = id;
      }
      setActiveSection(current);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    // Collapse all others, expand target
    setCollapsed(new Set(SECTIONS.map(s => s.id).filter(s => s !== id)));

    // After collapse animation, center the section and flash highlight
    setTimeout(() => {
      const el = scrollRef.current;
      const section = document.getElementById(id);
      if (!el || !section) return;
      const top = section.offsetTop - (el.clientHeight / 2) + (section.offsetHeight / 2);
      el.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });

      setFocused(id);
      if (focusTimer.current) clearTimeout(focusTimer.current);
      focusTimer.current = setTimeout(() => setFocused(null), 1800);
    }, 280);
  };

  const p = { xs: 2, md: presentationMode ? 4 : 3 };

  return (
    <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
      <Box ref={scrollRef} sx={{ flex: 1, overflowY: 'auto', minWidth: 0 }}>
        <Box sx={{ p }}>
          <Stack spacing={0}>

            {[
              { id: 'section-overview', label: 'ROI Overview',        card: <RoiHero />,             pt: 0 },
              { id: 'section-profile',  label: 'Business Profile',   card: <ProfileSummary />,      pt: presentationMode ? 4 : 3 },
              { id: 'section-mix',      label: 'Payment Mix',         card: <PaymentMixChart />,     pt: presentationMode ? 4 : 3 },
              { id: 'section-impact',   label: 'Financial Impact',    card: <FinancialImpactChart />,pt: presentationMode ? 4 : 3 },
              { id: 'section-invest',   label: 'Investment Summary',  card: <InvestmentSummary />,   pt: presentationMode ? 4 : 3 },
            ].map(({ id, label, card, pt }, i) => (
              <Box key={id} id={id} sx={{ pt: i === 0 ? 0 : pt, pb: i === 4 ? 4 : 0 }}>
                <SectionLabel collapsed={isCollapsed(id)} onToggle={() => toggle(id)}>{label}</SectionLabel>
                <Collapse in={!isCollapsed(id)}>
                  <Box sx={{
                    borderRadius: 2,
                    outline: focused === id ? '2px solid' : '2px solid transparent',
                    outlineColor: focused === id ? 'primary.main' : 'transparent',
                    transition: 'outline-color 0.3s ease',
                  }}>
                    {card}
                  </Box>
                </Collapse>
              </Box>
            ))}

          </Stack>
        </Box>
      </Box>
      <DashboardNav
        activeSection={activeSection}
        onNavigate={scrollTo}
        hasCollapsed={collapsed.size > 0}
        onExpandAll={() => setCollapsed(new Set())}
      />
    </Box>
  );
}

function Header() {
  const { state: { inputPanelOpen, presentationMode }, dispatch, reset, sessionId } = useRoi();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'), { noSsr: true });

  return (
    <AppBar position="static" elevation={0} sx={{ bgcolor: 'white', borderBottom: '1px solid', borderColor: 'divider', color: 'text.primary' }}>
      <Toolbar sx={{ gap: 1 }}>
        {!presentationMode && (
          <Tooltip title={inputPanelOpen ? 'Hide inputs' : 'Show inputs'}>
            <IconButton onClick={() => dispatch({ type: 'TOGGLE_PANEL' })} edge="start" size="small">
              <MenuIcon />
            </IconButton>
          </Tooltip>
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
          <Box sx={{ width: 8, height: 28, bgcolor: 'primary.main', borderRadius: 1, flexShrink: 0 }} />
          <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: -0.5, fontSize: { xs: '0.95rem', md: '1.1rem' } }}>
            VERSAPAY ROI CALCULATOR
          </Typography>
        </Box>
        {!presentationMode && (
          <Tooltip title="Reset to defaults">
            <Button size="small" startIcon={<RefreshIcon />} onClick={reset} color="inherit" sx={{ fontSize: '0.75rem', display: { xs: 'none', sm: 'flex' } }}>
              Reset
            </Button>
          </Tooltip>
        )}
        {presentationMode && (
          <Tooltip title="Open inputs on a second screen">
            <Button
              size="small"
              variant="outlined"
              startIcon={<OpenInNewIcon />}
              onClick={() => window.open(`/inputs?session=${sessionId}`, 'roi-inputs', 'width=420,height=760,resizable=yes')}
              sx={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}
            >
              Pop out inputs
            </Button>
          </Tooltip>
        )}
        <Tooltip title={presentationMode ? 'Exit Presentation' : 'Presentation Mode'}>
          <Button
            size="small"
            variant={presentationMode ? 'outlined' : 'contained'}
            startIcon={presentationMode ? <FullscreenExitIcon /> : <PresentToAllIcon />}
            onClick={() => dispatch({ type: 'TOGGLE_PRESENTATION' })}
            sx={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}
          >
            {presentationMode ? 'Exit' : (isMobile ? 'Present' : 'Presentation')}
          </Button>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}

function Calculator() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'), { noSsr: true });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: 'grey.50' }}>
      <Header />
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <InputPanel isMobile={isMobile} />
        <Dashboard />
      </Box>
    </Box>
  );
}

export default function RoiCalculator() {
  return (
    <RoiProvider>
      <Calculator />
    </RoiProvider>
  );
}
