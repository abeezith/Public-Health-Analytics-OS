import crypto from 'node:crypto';

const dimensions = [
  ['gender-identity','Gender identity',/gender identity|transgender|third gender|hijra/i],
  ['age','Age or life-course group',/\bage\b|age group|life[- ]?course|adolescent|neonatal|infant|child|older person/i],
  ['sex','Sex',/(^|[;,/]\s*)sex\b|\bmale\b|\bfemale\b/i],
  ['residence','Rural / urban residence',/rural|urban|residence/i],
  ['socioeconomic-position','Wealth or socioeconomic position',/wealth|socioeconomic|poverty|income|deprivation/i],
  ['social-group','Social, caste, tribal or ethnic group',/caste|social group|tribal|indigenous|ethnic/i],
  ['education','Education',/education|schooling|literacy/i],
  ['disability','Disability status',/disability|functional status/i],
  ['facility-type','Facility or reporting-unit type',/facility type|facility level|reporting unit|phc|chc|district hospital|health facility/i],
  ['service-setting','Service setting',/service setting|outreach|in[- ]?facility|session type/i],
  ['ownership-sector','Ownership or public/private sector',/ownership|public.*private|private.*public|service sector/i],
  ['antigen-dose','Antigen or dose',/antigen|vaccine dose|dose number/i],
  ['pregnancy-status','Pregnancy status',/pregnancy status|pregnant.*non[- ]?pregnant/i],
  ['cadre','Health-worker cadre',/\bcadre\b|health worker|provider type/i],
  ['disease-condition','Disease or condition',/\bdisease\b|condition|diagnosis/i],
  ['clinical-category','Clinical or programme category',/cause of death|cause-specific|drug resistance|tb type|hiv status|clinical category|case classification/i],
  ['temporal-validity','Temporal validity',/temporal|active from|active to|validity period/i],
  ['administrative-geography','Administrative geography',/geograph|national|state|district|block|subdistrict|sub-district|community|village/i]
];

const text = value => String(value || '').trim();
const reviewState = provenance => provenance?.status === 'domain-reviewed' ? 'Domain reviewed' : provenance?.status === 'technically-validated' ? 'Technically validated' : 'Review pending';
const hash = value => crypto.createHash('sha256').update(value).digest('hex').slice(0,12);

function applicability(indicator, hmis, fallbackLevel) {
  return {
    geography: text(indicator?.country || (indicator?.indiaProgram ? 'India' : 'Not stated')) || 'Not stated',
    reportingLevel: text(indicator?.reportingLevel || indicator?.administrativeLevel || hmis?.reportingLevels?.join('; ') || fallbackLevel) || 'Not stated',
    facilityType: text(indicator?.facilityType || hmis?.facilityTypes?.join('; ')) || 'Not stated',
    population: text(indicator?.population || indicator?.denominatorPopulation || hmis?.denominatorPopulation) || 'Not stated'
  };
}

function assertionsFromText({canonicalObjectId,claimType,status,raw,evidence,applicability:scope,reviewStatus}) {
  const exactText = text(raw);
  if (!exactText) return {assertions:[],unresolved:[]};
  const matched = dimensions.filter(([, ,pattern])=>pattern.test(exactText));
  const assertions = matched.map(([dimensionId,dimensionLabel])=>({
    assertionId:`DISAGG-${hash(`${canonicalObjectId}|${claimType}|${dimensionId}|${exactText}`)}`,
    dimensionId,
    dimensionLabel,
    claimType,
    status,
    evidence:{...evidence,exactText},
    applicability:scope,
    reviewStatus
  }));
  return {assertions,unresolved:matched.length?[]:[exactText]};
}

export function disaggregationProfile({canonicalObjectId,indicator,hmis,provenance,normalizedLowestReportingLevel,observedReportSchema}) {
  const reviewStatus=reviewState(provenance),scope=applicability(indicator,hmis,normalizedLowestReportingLevel);
  const recommended=assertionsFromText({
    canonicalObjectId,
    claimType:'analyst-recommended',
    status:'Recommendation only; availability unverified',
    raw:indicator?.disaggregation,
    evidence:{authority:'Public Health Analytics-OS',sourceId:indicator?.sourceId||null,sourceUrl:indicator?.url||null,sourceVersion:indicator?.sourceVersion||null,locator:'Legacy recommended-disaggregation field'},
    applicability:scope,
    reviewStatus
  });
  const systemAssertions=[];
  if(observedReportSchema){
    const systemDimensions=[
      ['administrative-geography','Administrative geography','State, district, sub-district/ULB, block and health-block fields'],
      ['facility-type','Facility or reporting-unit type','Facility Type and Category fields'],
      ['residence','Rural / urban residence','Rural/Urban field'],
      ['service-setting','Service setting','In-facility, outreach or total and outreach-service fields'],
      ['ownership-sector','Ownership or public/private sector','Ownership classification, ownership and administrative-body fields'],
      ['temporal-validity','Temporal validity','Active-from and active-to date fields']
    ];
    for(const [dimensionId,dimensionLabel,exactText] of systemDimensions)systemAssertions.push({
      assertionId:`DISAGG-${hash(`${canonicalObjectId}|system-available|${dimensionId}|${observedReportSchema.schemaId}`)}`,
      dimensionId,dimensionLabel,claimType:'system-available',
      status:'Observed in declared report schema; value-domain validation pending',
      evidence:{authority:observedReportSchema.authority,sourceId:observedReportSchema.schemaId,sourceUrl:null,sourceVersion:observedReportSchema.version,locator:'Default report-dimension columns',exactText},
      applicability:{...scope,geography:'India; applicability evidenced only for the observed report schema'},
      reviewStatus:'Review pending'
    });
  }
  const assertions=[...systemAssertions,...recommended.assertions];
  const claimTypes=[...new Set(assertions.map(item=>item.claimType))];
  return {
    modelId:'PHAOS-DISAGG-001',
    assertions,
    claimTypes,
    dimensions:[...new Set(assertions.map(item=>item.dimensionId))],
    evidenceState:systemAssertions.length?'Observed schema evidence + recommendations kept separate':recommended.assertions.length?'Recommendation only; availability not evidenced':'No governed disaggregation assertion',
    unresolvedSourceText:recommended.unresolved,
    assertionCounts:{sourceRequired:0,systemAvailable:systemAssertions.length,analystRecommended:recommended.assertions.length},
    boundary:'Absence means not evidenced in this release; recommendation does not establish source requirement or system availability.'
  };
}
