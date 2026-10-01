'use client';
import React from 'react';
import Box from '@mui/material/Box';
import { useRoi } from '@/lib/roi/context';
import InputSlider from '../common/InputSlider';

export default function ImpactInputs() {
  const { state: { inputs }, setInputs } = useRoi();
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
      <InputSlider label="% Check Payments → Online" value={inputs.checkToOnlinePct} onChange={v => setInputs({ checkToOnlinePct: v })} />
      <InputSlider label="% Offline ACH → Online ACH" value={inputs.achToOnlinePct} onChange={v => setInputs({ achToOnlinePct: v })} />
      <InputSlider label="Online Payment Match Rate" value={inputs.onlineMatchRate} onChange={v => setInputs({ onlineMatchRate: v })} />
      <InputSlider label="Offline Payment Match Rate" value={inputs.offlineMatchRate} onChange={v => setInputs({ offlineMatchRate: v })} step={0.01} />
      <InputSlider label="% Customers Logging into Portal" value={inputs.portalLoginRate} onChange={v => setInputs({ portalLoginRate: v })} />
      <InputSlider label="% Portal Users Paying in Portal" value={inputs.portalPaymentRate} onChange={v => setInputs({ portalPaymentRate: v })} />
      <InputSlider label="Collections Efficiency Gain" value={inputs.collectionsEfficiencyGain} onChange={v => setInputs({ collectionsEfficiencyGain: v })} />
      <InputSlider label="DSO Reduction — Offline → Online" value={inputs.offlineToOnlineDsoReduction} onChange={v => setInputs({ offlineToOnlineDsoReduction: v })} step={0.01} />
      <InputSlider label="DSO Reduction — Redeployed Headcount" value={inputs.redeployedHeadcountDsoReduction} onChange={v => setInputs({ redeployedHeadcountDsoReduction: v })} step={0.01} max={0.25} />
    </Box>
  );
}
