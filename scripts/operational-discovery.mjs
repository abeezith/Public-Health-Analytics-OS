const text = value => String(value || '').trim();
const lower = value => text(value).toLowerCase();

export function frequencyFacet(indicator, hmis) {
  const source = text(indicator?.frequency || hmis?.periodicity || hmis?.reportingPeriod);
  const value = lower(source);
  if (!value || value.includes('latest api release')) return { value: 'Not stated', source };
  const matches = [
    ['Continuous / sub-monthly', /continuous|real[- ]?time|daily|weekly/],
    ['Monthly', /monthly|month/],
    ['Quarterly', /quarter/],
    ['Semiannual', /semiannual|semi-annual|half-year/],
    ['Annual', /annual|annually|yearly/],
    ['Event / campaign cycle', /campaign|round|event|session|episode/],
    ['Survey / periodic cycle', /survey|periodic|modelled|census/],
    ['Cohort / follow-up', /cohort|follow[- ]?up/]
  ].filter(([, pattern]) => pattern.test(value)).map(([label]) => label);
  if (matches.length > 1) return { value: 'Mixed / source-defined', source };
  return { value: matches[0] || 'Source-defined / other', source };
}

export function cadreFacet(indicator) {
  const source = text(indicator?.responsibleCadre);
  if (!source) return { values: ['Not stated'], source };
  const value = lower(source), values = [];
  const add = (label, pattern) => { if (pattern.test(value)) values.push(label); };
  add('Community workforce', /asha|anm|a?ww|anganwadi|peer educator|community|gram pradhan|vhsnc|jas|cho/);
  add('Clinical / facility workforce', /medical officer|doctor|nurse|clinical|facility|labour room|ot team|counsellor/);
  add('Laboratory workforce', /laborator|technician|stls|dmc|c&dst|reference lab/);
  add('Data / reporting workforce', /data|reporting|records|statistic|monitor/);
  add('Programme management', /programme manager|program manager|programme team|program team|district health official|block health official|dio|sio|sepio/);
  add('Surveillance / public-health workforce', /surveillance|epidemi|public health/);
  add('Quality / governance body', /committee|quality team|quality circle|dqac|sqac|task force/);
  return { values: [...new Set(values.length ? values : ['Source-defined / other'])], source };
}

export function reviewFacet(provenance) {
  if (provenance?.status === 'domain-reviewed') return 'Domain reviewed';
  if (provenance?.status === 'technically-validated') return 'Technically validated';
  return 'Review pending';
}

export function lifecycleFacet(status) {
  const values = { active: 'Active', draft: 'Draft', superseded: 'Superseded', retired: 'Retired' };
  return values[lower(status)] || 'Unknown';
}

export function computabilityFacet(indicator, hmis, objectType) {
  if (objectType !== 'Indicator') return 'Not applicable to this object class';
  const formula = text(indicator?.normalizedFormula || hmis?.normalizedFormula || indicator?.formula || hmis?.formula);
  const numerator = lower(indicator?.numerator || hmis?.numerator);
  const denominator = lower(indicator?.denominator || hmis?.denominator);
  const incomplete = /consult authoritative|source-defined|not computable|not applicable|reporting element/i.test(formula);
  const explicitOperation = /[÷×+]|\s\/\s|per\s+(1,?000|10,?000|100,?000)/i.test(formula);
  const placeholder = value => !value || /not applicable|source-defined|unless specified|not specified/.test(value);
  if (explicitOperation && !incomplete && !placeholder(numerator) && !placeholder(denominator)) return 'C2 · Formula specified; implementation unvalidated';
  if (formula && !/consult authoritative|not applicable - source reporting element/i.test(formula)) return 'C1 · Method stated; inputs incomplete';
  return 'C0 · Not assessed / insufficient metadata';
}

export function operationalDiscovery({ indicator, hmis, objectType, provenance, lifecycleStatus }) {
  const frequency = frequencyFacet(indicator, hmis);
  const cadre = cadreFacet(indicator);
  const sourceUrl = text(indicator?.url || hmis?.sourceUrl);
  return {
    modelId: 'PHAOS-OPDISC-001',
    frequency: frequency.value,
    frequencySource: frequency.source || 'Not stated',
    cadreCategories: cadre.values,
    responsibleCadreSource: cadre.source || 'Not stated',
    dataAvailability: sourceUrl ? 'Metadata link available; values not published' : 'Metadata link not stated; values not published',
    reviewStatus: reviewFacet(provenance),
    lifecycle: lifecycleFacet(lifecycleStatus),
    computabilityMaturity: computabilityFacet(indicator, hmis, objectType)
  };
}
