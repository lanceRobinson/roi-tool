'use client';

import React, { createContext, useContext, useReducer, useMemo, useEffect, useRef } from 'react';
import type { RoiInputs, RoiResults, RoiBenefits } from './types';
import { DEFAULT_INPUTS } from './defaults';
import { calculateRoi } from './calculations';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function maskBenefits(raw: RoiResults, disabled: (keyof RoiBenefits)[]): RoiResults {
  if (disabled.length === 0) return raw;
  const benefits = { ...raw.benefits };
  for (const key of disabled) benefits[key] = 0;
  const b = benefits;
  const totalAnnualBenefit =
    b.creditCardProcessingSavings +
    b.surchargeSavings +
    b.laborSavings +
    b.avoidedHiring +
    b.systemDecommissioning * 2 +
    b.strategicCollections +
    b.writeoffReduction +
    b.revenueUplift +
    b.workingCapitalInterest;
  const roi = raw.totalInvestment > 0 ? totalAnnualBenefit / raw.totalInvestment : 0;
  return { ...raw, benefits, totalAnnualBenefit, roi };
}

// ─── State ────────────────────────────────────────────────────────────────────

interface RoiState {
  inputs: RoiInputs;
  rawResults: RoiResults;
  results: RoiResults;
  disabledBenefits: (keyof RoiBenefits)[];
  inputPanelOpen: boolean;
  presentationMode: boolean;
}

function makeInitialState(): RoiState {
  const rawResults = calculateRoi(DEFAULT_INPUTS);
  return {
    inputs: DEFAULT_INPUTS,
    rawResults,
    results: rawResults,
    disabledBenefits: [],
    inputPanelOpen: true,
    presentationMode: false,
  };
}

// ─── Actions ──────────────────────────────────────────────────────────────────

type BroadcastPayload = { inputs: RoiInputs; disabledBenefits: (keyof RoiBenefits)[] };

type Action =
  | { type: 'SET_INPUTS'; payload: Partial<RoiInputs> }
  | { type: 'SET_PAYMENT_MIX'; payload: Partial<RoiInputs['paymentMix']> }
  | { type: 'LOAD_INPUTS'; payload: Partial<RoiInputs> }
  | { type: 'TOGGLE_BENEFIT'; payload: keyof RoiBenefits }
  | { type: 'SET_DISABLED_BENEFITS'; payload: (keyof RoiBenefits)[] }
  | { type: 'SYNC'; payload: BroadcastPayload }
  | { type: 'RESET' }
  | { type: 'TOGGLE_PANEL' }
  | { type: 'SET_PANEL_OPEN'; payload: boolean }
  | { type: 'TOGGLE_PRESENTATION' }
  | { type: 'SET_PRESENTATION'; payload: boolean };

function reducer(state: RoiState, action: Action): RoiState {
  switch (action.type) {
    case 'SET_INPUTS': {
      const inputs = { ...state.inputs, ...action.payload };
      const rawResults = calculateRoi(inputs);
      return { ...state, inputs, rawResults, results: maskBenefits(rawResults, state.disabledBenefits) };
    }
    case 'SET_PAYMENT_MIX': {
      const inputs = { ...state.inputs, paymentMix: { ...state.inputs.paymentMix, ...action.payload } };
      const rawResults = calculateRoi(inputs);
      return { ...state, inputs, rawResults, results: maskBenefits(rawResults, state.disabledBenefits) };
    }
    case 'LOAD_INPUTS': {
      // Merge loaded values over current state; missing keys keep their current values
      const partial = action.payload;
      const inputs: RoiInputs = {
        ...state.inputs,
        ...partial,
        paymentMix: partial.paymentMix
          ? { ...state.inputs.paymentMix, ...partial.paymentMix }
          : state.inputs.paymentMix,
      };
      const rawResults = calculateRoi(inputs);
      return { ...state, inputs, rawResults, results: maskBenefits(rawResults, state.disabledBenefits) };
    }
    case 'TOGGLE_BENEFIT': {
      const key = action.payload;
      const disabledBenefits = state.disabledBenefits.includes(key)
        ? state.disabledBenefits.filter(k => k !== key)
        : [...state.disabledBenefits, key];
      return { ...state, disabledBenefits, results: maskBenefits(state.rawResults, disabledBenefits) };
    }
    case 'SET_DISABLED_BENEFITS': {
      const disabledBenefits = action.payload;
      return { ...state, disabledBenefits, results: maskBenefits(state.rawResults, disabledBenefits) };
    }
    case 'SYNC': {
      const rawResults = calculateRoi(action.payload.inputs);
      const disabledBenefits = action.payload.disabledBenefits;
      return { ...state, inputs: action.payload.inputs, rawResults, results: maskBenefits(rawResults, disabledBenefits), disabledBenefits };
    }
    case 'RESET':
      return makeInitialState();
    case 'TOGGLE_PANEL':
      return { ...state, inputPanelOpen: !state.inputPanelOpen };
    case 'SET_PANEL_OPEN':
      return { ...state, inputPanelOpen: action.payload };
    case 'TOGGLE_PRESENTATION':
      return { ...state, presentationMode: !state.presentationMode };
    case 'SET_PRESENTATION':
      return { ...state, presentationMode: action.payload };
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface RoiContextValue {
  state: RoiState;
  dispatch: React.Dispatch<Action>;
  sessionId: string;
  setInputs: (payload: Partial<RoiInputs>) => void;
  setPaymentMix: (payload: Partial<RoiInputs['paymentMix']>) => void;
  loadInputs: (payload: Partial<RoiInputs>) => void;
  toggleBenefit: (key: keyof RoiBenefits) => void;
  setDisabledBenefits: (keys: (keyof RoiBenefits)[]) => void;
  reset: () => void;
}

const RoiContext = createContext<RoiContextValue | null>(null);

interface RoiProviderProps {
  children: React.ReactNode;
  sessionId?: string;
}

export function RoiProvider({ children, sessionId: propSessionId }: RoiProviderProps) {
  const [state, dispatch] = useReducer(reducer, undefined, makeInitialState);
  const sessionIdRef = useRef(propSessionId ?? Math.random().toString(36).slice(2, 8));
  const channelRef = useRef<BroadcastChannel | null>(null);
  const stateRef = useRef(state);
  const isSyncing = useRef(false);
  const hasMounted = useRef(false);

  // Keep stateRef current so message handlers always read latest state
  useEffect(() => { stateRef.current = state; });

  // Sync browser tab title with business name
  useEffect(() => {
    const name = state.inputs.businessName.trim();
    document.title = name ? `${name} — Versapay ROI Calculator` : 'Versapay ROI Calculator';
  }, [state.inputs.businessName]);

  // Set up BroadcastChannel
  useEffect(() => {
    if (typeof window === 'undefined' || !('BroadcastChannel' in window)) return;
    const ch = new BroadcastChannel(`roi-${sessionIdRef.current}`);
    channelRef.current = ch;

    ch.onmessage = (e) => {
      const { type, payload } = e.data as { type: string; payload: BroadcastPayload };
      if (type === 'SYNC') {
        isSyncing.current = true;
        dispatch({ type: 'SYNC', payload });
      } else if (type === 'REQUEST_STATE') {
        ch.postMessage({
          type: 'SYNC',
          payload: {
            inputs: stateRef.current.inputs,
            disabledBenefits: stateRef.current.disabledBenefits,
          },
        });
      }
    };

    // Ask any existing window for current state (pop-out requesting from main)
    ch.postMessage({ type: 'REQUEST_STATE' });

    return () => ch.close();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Broadcast local changes — skip initial mount and received syncs
  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    if (isSyncing.current) {
      isSyncing.current = false;
      return;
    }
    channelRef.current?.postMessage({
      type: 'SYNC',
      payload: { inputs: state.inputs, disabledBenefits: state.disabledBenefits },
    });
  }, [state.inputs, state.disabledBenefits]); // eslint-disable-line react-hooks/exhaustive-deps

  const value = useMemo<RoiContextValue>(() => ({
    state,
    dispatch,
    sessionId: sessionIdRef.current,
    setInputs: (payload) => dispatch({ type: 'SET_INPUTS', payload }),
    setPaymentMix: (payload) => dispatch({ type: 'SET_PAYMENT_MIX', payload }),
    loadInputs: (payload) => dispatch({ type: 'LOAD_INPUTS', payload }),
    toggleBenefit: (key) => dispatch({ type: 'TOGGLE_BENEFIT', payload: key }),
    setDisabledBenefits: (keys) => dispatch({ type: 'SET_DISABLED_BENEFITS', payload: keys }),
    reset: () => dispatch({ type: 'RESET' }),
  }), [state]);

  return <RoiContext.Provider value={value}>{children}</RoiContext.Provider>;
}

export function useRoi() {
  const ctx = useContext(RoiContext);
  if (!ctx) throw new Error('useRoi must be used inside RoiProvider');
  return ctx;
}
