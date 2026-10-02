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
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Divider from '@mui/material/Divider';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import RefreshIcon from '@mui/icons-material/Refresh';
import PresentToAllIcon from '@mui/icons-material/PresentToAll';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
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
      <ExpandMoreIcon data-no-print="true" sx={{
        fontSize: 14, color: 'text.disabled', flexShrink: 0,
        transform: collapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
        transition: 'transform 0.2s',
      }} />
    </Box>
  );
}

function DashboardNav({ activeSection, onNavigate, hasCollapsed, onExpandAll, hiddenSections, onToggleVisibility }: {
  activeSection: string;
  onNavigate: (id: string) => void;
  hasCollapsed: boolean;
  onExpandAll: () => void;
  hiddenSections: Set<string>;
  onToggleVisibility: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const visibleSections = SECTIONS.filter(s => !hiddenSections.has(s.id));

  return (
    <Box
      data-no-print="true"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      sx={{
        flexShrink: 0,
        width: open ? 172 : 20,
        transition: 'width 0.22s ease',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
      }}
    >
      {/* Collapsed: dots for visible sections only */}
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
        {visibleSections.map(({ id }) => {
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
        width: 156,
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
          const hidden = hiddenSections.has(id);
          return (
            <Box
              key={id}
              sx={{
                display: 'flex', alignItems: 'center',
                py: 0.25, mb: 0.15, borderRadius: 1.5,
                '&:hover .vis-btn': { opacity: 1 },
              }}
            >
              {/* Label area — navigates or unhides */}
              <Box
                onClick={() => hidden ? onToggleVisibility(id) : onNavigate(id)}
                sx={{
                  display: 'flex', alignItems: 'center', gap: 1, flex: 1,
                  py: 0.35, px: 0.75, borderRadius: 1.5,
                  cursor: 'pointer', userSelect: 'none',
                  opacity: hidden ? 0.38 : 1,
                  bgcolor: active && !hidden ? 'primary.50' : 'transparent',
                  '&:hover': { bgcolor: active && !hidden ? 'primary.100' : 'action.hover' },
                  transition: 'background-color 0.12s, opacity 0.15s',
                }}
              >
                <Box sx={{
                  width: active && !hidden ? 8 : 6,
                  height: active && !hidden ? 8 : 6,
                  borderRadius: '50%',
                  flexShrink: 0,
                  bgcolor: active && !hidden ? 'primary.main' : 'grey.300',
                  transition: 'all 0.15s',
                }} />
                <Typography sx={{
                  fontSize: '0.75rem',
                  fontWeight: active && !hidden ? 700 : 400,
                  color: active && !hidden ? 'primary.main' : 'text.secondary',
                  lineHeight: 1.3,
                  whiteSpace: 'nowrap',
                  flex: 1,
                }}>
                  {label}
                </Typography>
              </Box>

              {/* Visibility toggle */}
              <IconButton
                className="vis-btn"
                size="small"
                onClick={e => { e.stopPropagation(); onToggleVisibility(id); }}
                sx={{
                  p: 0.3, mr: 0.25, flexShrink: 0,
                  opacity: hidden ? 1 : 0,
                  color: hidden ? 'text.disabled' : 'text.disabled',
                  transition: 'opacity 0.15s',
                  '&:hover': { color: hidden ? 'primary.main' : 'text.secondary' },
                }}
              >
                {hidden
                  ? <VisibilityOffIcon sx={{ fontSize: 14 }} />
                  : <VisibilityIcon sx={{ fontSize: 14 }} />
                }
              </IconButton>
            </Box>
          );
        })}

        {hasCollapsed && (
          <Box
            onClick={onExpandAll}
            sx={{ mt: 0.75, pt: 0.75, borderTop: '1px solid', borderColor: 'divider', textAlign: 'center', cursor: 'pointer', borderRadius: 1, py: 0.5, '&:hover': { bgcolor: 'action.hover' } }}
          >
            <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', fontWeight: 600 }}>Expand all</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

const ALL_SECTION_DEFS = [
  { id: 'section-overview', label: 'ROI Overview',       card: <RoiHero />,              pt: 0 },
  { id: 'section-profile',  label: 'Business Profile',   card: <ProfileSummary />,       pt: 1 },
  { id: 'section-mix',      label: 'Payment Mix',        card: <PaymentMixChart />,      pt: 1 },
  { id: 'section-impact',   label: 'Financial Impact',   card: <FinancialImpactChart />, pt: 1 },
  { id: 'section-invest',   label: 'Investment Summary', card: <InvestmentSummary />,    pt: 1 },
];

function Dashboard({ printRef }: { printRef: React.MutableRefObject<() => void> }) {
  const { state: { presentationMode, inputs } } = useRoi();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [hiddenSections, setHiddenSections] = useState<Set<string>>(new Set());
  const [focused, setFocused] = useState<string | null>(null);
  const focusTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toggle = (id: string) => setCollapsed(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });
  const isCollapsed = (id: string) => collapsed.has(id);

  const toggleVisibility = (id: string) => {
    setHiddenSections(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const visibleSectionIds = SECTIONS.map(s => s.id).filter(id => !hiddenSections.has(id));

  // navTargetRef tracks the intended current section for keyboard nav.
  // suppressNavRef prevents the scroll spy from overwriting it after
  // programmatic navigation (collapsed sections shift offsetTops, causing
  // the spy to resolve the wrong section from scrollTop=0).
  const navTargetRef = useRef(SECTIONS[0].id);
  const suppressNavRef = useRef(false);
  const suppressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      let current = visibleSectionIds[0] ?? SECTIONS[0].id;
      for (const id of visibleSectionIds) {
        const section = document.getElementById(id);
        if (section && section.offsetTop - 72 <= el.scrollTop) current = id;
      }
      setActiveSection(current);
      if (!suppressNavRef.current) navTargetRef.current = current;
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [visibleSectionIds.join(',')]); // eslint-disable-line react-hooks/exhaustive-deps

  const scrollTo = (id: string) => {
    navTargetRef.current = id;
    // Suppress scroll spy updates until the programmatic scroll settles
    suppressNavRef.current = true;
    if (suppressTimer.current) clearTimeout(suppressTimer.current);
    suppressTimer.current = setTimeout(() => { suppressNavRef.current = false; }, 900);

    setHiddenSections(prev => { const next = new Set(prev); next.delete(id); return next; });
    setCollapsed(new Set(visibleSectionIds.filter(s => s !== id)));

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

  const visibleSectionIdsRef = useRef(visibleSectionIds);
  visibleSectionIdsRef.current = visibleSectionIds;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;

      const ids = visibleSectionIdsRef.current;
      const idx = ids.indexOf(navTargetRef.current);

      if (e.key === 'ArrowRight') {
        const nextIdx = idx === -1 ? 0 : idx + 1;
        if (nextIdx < ids.length) scrollTo(ids[nextIdx]);
      } else {
        if (idx > 0) scrollTo(ids[idx - 1]);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const collapsedRef = useRef(collapsed);
  collapsedRef.current = collapsed;

  useEffect(() => {
    printRef.current = () => {
      const savedCollapsed = new Set(collapsedRef.current);
      setCollapsed(new Set()); // expand all visible sections

      requestAnimationFrame(() => {
        setTimeout(() => {
          // CSS @media print can't reliably break Chrome's scroll-container
          // clipping. Set inline styles with !important priority instead —
          // these always win over class-based styles.
          const PROPS: Array<[string, string]> = [
            ['overflow',   'visible'],
            ['overflow-y', 'visible'],
            ['overflow-x', 'visible'],
            ['height',     'auto'],
            ['max-height', 'none'],
            ['min-height', '0'],
            ['display',    'block'],
            ['flex',       'none'],
            ['position',   'static'],
          ];

          const selector = '[data-print-root],[data-print-content],[data-print-outer],[data-print-scroll]';
          const targets = Array.from(document.querySelectorAll<HTMLElement>(selector));

          // Save existing inline values and apply overrides
          const saved = targets.map(el => {
            const prev = PROPS.map(([p]) => el.style.getPropertyValue(p));
            PROPS.forEach(([p, v]) => el.style.setProperty(p, v, 'important'));
            return { el, prev };
          });

          // Hide chrome elements (AppBar, nav, input panel) via JS for
          // the same reason — CSS @media print loses to emotion specificity
          const hidden = Array.from(document.querySelectorAll<HTMLElement>('[data-no-print]'));
          hidden.forEach(el => el.style.setProperty('display', 'none', 'important'));

          // Guard so restore only runs once whether the user prints or cancels
          let restored = false;
          const restore = () => {
            if (restored) return;
            restored = true;
            saved.forEach(({ el, prev }) => {
              PROPS.forEach(([p], i) => {
                el.style.removeProperty(p);
                if (prev[i]) el.style.setProperty(p, prev[i]);
              });
            });
            hidden.forEach(el => el.style.removeProperty('display'));
            setCollapsed(savedCollapsed);
            window.removeEventListener('afterprint', restore);
            mql.removeEventListener('change', onMqlChange);
          };

          // afterprint fires on print; matchMedia fires on cancel — cover both
          const mql = window.matchMedia('print');
          const onMqlChange = (e: MediaQueryListEvent) => { if (!e.matches) restore(); };
          mql.addEventListener('change', onMqlChange);
          window.addEventListener('afterprint', restore);

          window.print();
        }, 350);
      });
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const p = { xs: 2, md: presentationMode ? 4 : 3 };

  return (
    <Box data-print-outer="true" sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
      <Box ref={scrollRef} data-print-scroll="true" sx={{ flex: 1, overflowY: 'auto', minWidth: 0 }}>
        <Box sx={{ p }}>

          {/* Dashboard / PDF header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <Box sx={{ width: 6, height: 36, bgcolor: 'primary.main', borderRadius: 1, flexShrink: 0 }} />
            <Typography sx={{ fontWeight: 800, fontSize: { xs: '1rem', md: '1.25rem' }, letterSpacing: 0.5, color: 'text.primary', lineHeight: 1.2 }}>
              VERSAPAY ROI{inputs.businessName ? ` — ${inputs.businessName.toUpperCase()}` : ''}
            </Typography>
          </Box>

          <Stack spacing={0}>

            {ALL_SECTION_DEFS
              .filter(({ id }) => !hiddenSections.has(id))
              .map(({ id, label, card, pt }, i, arr) => (
                <Box key={id} id={id} data-print-section="true" sx={{ pt: i === 0 ? 0 : (presentationMode ? 4 : pt * 3), pb: i === arr.length - 1 ? 4 : 0 }}>
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
        hiddenSections={hiddenSections}
        onToggleVisibility={toggleVisibility}
      />
    </Box>
  );
}

const HELP_SECTIONS = [
  {
    heading: 'Getting Started',
    items: [
      'Enter your customer\'s details in the left input panel — revenue, invoice volume, AR staffing, DSO, and payment mix.',
      'The dashboard updates live as you type. No save button needed.',
      'Use Reset (↺) at any time to return all inputs to default values.',
    ],
  },
  {
    heading: 'Input Panel',
    items: [
      'Business Profile — Core company metrics: annual revenue, invoice/payment volumes, AR headcount, and Days Sales Outstanding.',
      'Payment Mix — How the customer currently splits payments across Credit Card, Check, Offline ACH, and Online ACH. Adjust via slider or type a % directly.',
      'Versapay Impact — Conversion assumptions: what % of checks and ACH go online, portal adoption rates, and efficiency gains.',
      'Financial Assumptions — Cost of capital, surcharge rate, write-off recovery, software/implementation costs, and other line items.',
    ],
  },
  {
    heading: 'Dashboard Sections',
    items: [
      'ROI Overview — Headline metrics: Annual Benefit, Year 1 ROI, Working Capital Unlocked, and DSO Reduction.',
      'Business Profile — A read-only summary of inputs and key assumptions at a glance.',
      'Payment Mix — Current vs. Future payment breakdown as donut charts, plus Payment Transformation stats (% moved online, manual events eliminated, self-service rate).',
      'Annual Financial Impact — Individual benefit categories as a bar chart. Use the dropdown to exclude any benefits that don\'t apply. Click ⓘ on any row for a plain-English explanation and formula.',
      'Investment Summary — Full cost breakdown (software + implementation) with payback period and net Year 1 benefit alongside the ROI figure.',
    ],
  },
  {
    heading: 'Presentation Mode',
    items: [
      'Click Presentation in the top-right to hide the input panel and show a clean, full-width dashboard.',
      'Use "Pop out inputs" to open the input panel in a separate window — ideal for a second monitor. Changes sync to the presentation in real time.',
      'Click any section label to collapse it; use the floating nav on the right to jump between sections or expand all.',
      'Clicking a section in the nav collapses the others and centers that section with a highlight.',
    ],
  },
];

function PresentationOverlay({ onPrint }: { onPrint: () => void }) {
  const { state: { presentationMode }, dispatch, sessionId } = useRoi();
  if (!presentationMode) return null;
  return (
    <Box
      data-no-print="true"
      sx={{
        position: 'fixed', top: 16, right: 16, zIndex: 1200,
        display: 'flex', alignItems: 'center', gap: 0.5,
        bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider',
        borderRadius: 2, px: 1, py: 0.5, boxShadow: 2,
        opacity: 0.15, transition: 'opacity 0.2s',
        '&:hover': { opacity: 1 },
      }}
    >
      <Tooltip title="Pop out inputs">
        <IconButton size="small" onClick={() => window.open(`/inputs?session=${sessionId}`, 'roi-inputs', 'width=420,height=760,resizable=yes')}>
          <OpenInNewIcon sx={{ fontSize: 17 }} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Download PDF">
        <IconButton size="small" onClick={onPrint}>
          <PictureAsPdfIcon sx={{ fontSize: 17 }} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Exit Presentation">
        <Button size="small" variant="outlined" startIcon={<FullscreenExitIcon />} onClick={() => dispatch({ type: 'TOGGLE_PRESENTATION' })} sx={{ fontSize: '0.72rem' }}>
          Exit
        </Button>
      </Tooltip>
    </Box>
  );
}

function Header({ onPrint }: { onPrint: () => void }) {
  const { state: { inputPanelOpen, presentationMode, inputs }, dispatch, reset } = useRoi();
  const isMobile = useMediaQuery(useTheme().breakpoints.down('md'), { noSsr: true });
  const [helpOpen, setHelpOpen] = useState(false);

  if (presentationMode) return null;

  return (
    <>
      <AppBar data-no-print="true" position="static" elevation={0} sx={{ bgcolor: 'white', borderBottom: '1px solid', borderColor: 'divider', color: 'text.primary' }}>
        <Toolbar sx={{ gap: 1 }}>
          <Tooltip title={inputPanelOpen ? 'Hide inputs' : 'Show inputs'}>
            <IconButton onClick={() => dispatch({ type: 'TOGGLE_PANEL' })} edge="start" size="small">
              <MenuIcon />
            </IconButton>
          </Tooltip>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0 }}>
            <Box sx={{ width: 8, height: 28, bgcolor: 'primary.main', borderRadius: 1, flexShrink: 0 }} />
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: -0.5, fontSize: { xs: '0.95rem', md: '1.1rem' }, lineHeight: inputs.businessName ? 1.1 : undefined }}>
                VERSAPAY ROI CALCULATOR
              </Typography>
              {inputs.businessName && (
                <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', fontWeight: 500, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {inputs.businessName}
                </Typography>
              )}
            </Box>
            <Tooltip title="How to use this tool">
              <IconButton size="small" onClick={() => setHelpOpen(true)} sx={{ color: 'text.disabled', '&:hover': { color: 'text.secondary' } }}>
                <InfoOutlinedIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          </Box>
          <Tooltip title="Reset to defaults">
            <Button size="small" startIcon={<RefreshIcon />} onClick={reset} color="inherit" sx={{ fontSize: '0.75rem', display: { xs: 'none', sm: 'flex' } }}>
              Reset
            </Button>
          </Tooltip>
          <Tooltip title="Download PDF">
            <IconButton size="small" onClick={onPrint} sx={{ color: 'text.secondary' }}>
              <PictureAsPdfIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Presentation Mode">
            <Button size="small" variant="contained" startIcon={<PresentToAllIcon />} onClick={() => dispatch({ type: 'TOGGLE_PRESENTATION' })} sx={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
              {isMobile ? 'Present' : 'Presentation'}
            </Button>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Dialog open={helpOpen} onClose={() => setHelpOpen(false)} maxWidth="sm" fullWidth scroll="paper"
        slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
        <DialogTitle sx={{ fontWeight: 800, fontSize: '1.1rem', pb: 1 }}>
          How to Use the ROI Calculator
        </DialogTitle>
        <DialogContent dividers sx={{ px: 3, py: 2 }}>
          <Stack spacing={2.5}>
            {HELP_SECTIONS.map((section, i) => (
              <Box key={i}>
                <Typography sx={{ fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: 0.8, color: 'primary.main', mb: 1 }}>
                  {section.heading}
                </Typography>
                <Stack spacing={0.75}>
                  {section.items.map((item, j) => (
                    <Box key={j} sx={{ display: 'flex', gap: 1.25, alignItems: 'flex-start' }}>
                      <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: 'primary.main', flexShrink: 0, mt: '6px' }} />
                      <Typography sx={{ fontSize: '0.85rem', color: 'text.secondary', lineHeight: 1.6 }}>{item}</Typography>
                    </Box>
                  ))}
                </Stack>
                {i < HELP_SECTIONS.length - 1 && <Divider sx={{ mt: 2.5 }} />}
              </Box>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 1.5 }}>
          <Button onClick={() => setHelpOpen(false)} variant="contained" size="small">Got it</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function Calculator() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'), { noSsr: true });
  const printRef = useRef<() => void>(() => {});

  return (
    <Box data-print-root="true" sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: 'grey.50' }}>
      <Header onPrint={() => printRef.current()} />
      <PresentationOverlay onPrint={() => printRef.current()} />
      <Box data-print-content="true" sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <InputPanel isMobile={isMobile} />
        <Dashboard printRef={printRef} />
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
