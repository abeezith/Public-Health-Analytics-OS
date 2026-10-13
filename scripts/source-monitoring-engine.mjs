import crypto from 'node:crypto';

export const sha256=value=>crypto.createHash('sha256').update(typeof value==='string'||Buffer.isBuffer(value)||value instanceof Uint8Array?value:JSON.stringify(value)).digest('hex');
export const metadataFingerprint=source=>sha256({id:source.id,name:source.name,org:source.org,url:source.url,access:source.access,boundary:source.boundary,release:source.release,status:source.status,observedRecords:source.observedRecords});
export const versionFingerprint=source=>sha256({release:source.release,status:source.status,lastChecked:source.lastChecked});

export function compareSnapshots(previous,current){
  if(!previous)return 'baseline-established';
  if(['http-error','network-error'].includes(current.linkState))return 'inaccessible';
  if(!previous.contentFingerprint||!current.contentFingerprint)return 'indeterminate';
  const contentChanged=previous.contentFingerprint!==current.contentFingerprint;
  const versionChanged=previous.versionFingerprint!==current.versionFingerprint;
  if(contentChanged&&versionChanged)return 'content-and-version-changed';
  if(contentChanged)return 'content-changed';
  if(versionChanged)return 'version-changed';
  if(previous.finalUrl&&current.finalUrl&&previous.finalUrl!==current.finalUrl)return 'redirected';
  return 'unchanged';
}

export function buildReviewItem(previous,current){
  const changeState=compareSnapshots(previous,current);
  if(['baseline-established','unchanged'].includes(changeState))return null;
  const severity=changeState==='inaccessible'?'high':changeState.includes('version')?'high':changeState==='content-changed'?'high':'medium';
  return {reviewItemId:`SRC-REVIEW-${current.observedOn.replaceAll('-','')}-${current.sourceId}`,sourceId:current.sourceId,sourceName:current.sourceName,detectedOn:current.observedOn,changeState,severity,disposition:'pending-triage',priorFingerprint:previous?.contentFingerprint||previous?.metadataFingerprint||null,currentFingerprint:current.contentFingerprint||current.metadataFingerprint||null,affectedRecordIds:current.affectedRecordIds||[],reviewReason:`Human review required for ${changeState}; HTTP availability alone does not establish unchanged meaning.`,automaticMutationProhibited:true};
}
