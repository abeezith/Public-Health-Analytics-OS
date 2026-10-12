const scanFields=['definition','displayDefinition','caveats','currentness','crosswalkStatus','sourcePage','sourceVersion'];
const flagPatterns=[
  {code:'pending-verification',pattern:/\b(pending|awaiting)\b/i},
  {code:'unresolved',pattern:/\b(unresolved|not resolved)\b/i},
  {code:'not-stated',pattern:/\b(not stated|not reported|not specified)\b/i},
  {code:'requires-confirmation',pattern:/\b(requires? (confirmation|verification|clarification)|to be confirmed)\b/i}
];

export function extractVerificationQueue(records=[]){
  const queue=[];
  for(const record of records){
    const metadata=record.indicatorMetadata||record.hmisMetadata||record;
    for(const field of scanFields){
      const raw=metadata?.[field];
      if(raw===undefined||raw===null||raw==='')continue;
      const text=Array.isArray(raw)?raw.join('; '):String(raw);
      const matches=flagPatterns.filter(item=>item.pattern.test(text)).map(item=>item.code);
      if(matches.length)queue.push({canonicalObjectId:record.canonicalObjectId||record.id||'unknown',field,flags:[...new Set(matches)],excerpt:text.slice(0,240)});
    }
  }
  return queue;
}

export const verificationQueueConfiguration={scanFields,flagCodes:flagPatterns.map(item=>item.code)};
