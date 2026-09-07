# Contributing to Public Health Analytics-OS

Thank you for helping improve the registry. Contributions may propose source updates, indicator corrections, programme additions, metadata improvements, graph mappings, validation rules, documentation or software changes.

All contributions are governed by the [Governance Charter](docs/GOVERNANCE-CHARTER.md).

## Before submitting

- Search existing issues and records for the same indicator, source or proposal.
- Use a public, citable source whenever the proposal changes public-health meaning.
- Identify the source authority, document title, version or publication date, URL/citation and exact page, table, section or field.
- Preserve the official source name. Put normalized wording or interpretation in a separate field.
- State what is known, what is inferred and what remains unavailable.
- Do not submit patient-level data, credentials, confidential exports, restricted dictionaries or unlicensed terminology content.

## Choose the appropriate pathway

### Indicator or source change

Use the indicator/source issue template for corrections, new source versions, missing indicators, formula or denominator problems, source-link changes and operational mapping evidence.

Include:

1. affected record IDs or programme;
2. requested change;
3. source authority and version;
4. exact source location;
5. impact on definition, formula, denominator, scale, reporting level, graph mappings or completeness;
6. whether the change supersedes an earlier source; and
7. any confidentiality or licensing constraint.

### Governance proposal

Use the governance template for changes to roles, decision rights, review gates, lifecycle, publication boundary or contribution policy. Describe alternatives and migration impact.

### Software change

Explain the user-visible problem, affected routes or data, expected behaviour and validation performed. Software changes must not silently alter official metadata or maturity labels.

## Review outcomes

A proposal may be:

- accepted;
- returned for revision;
- deferred;
- rejected with rationale; or
- blocked by missing evidence or authority.

Technical validation does not grant `Domain reviewed`, `Computable` or `Custodian approved` status. Those states require their own evidence under the charter.

## Authorship, interests and licensing

Contributors should identify themselves or their review role in material semantic submissions and disclose relevant institutional or commercial interests. By contributing repository content, contributors confirm that they have authority to provide it under the repository's licensing terms. Source material retains its own attribution and licensing conditions; inclusion of metadata does not relicense the source publication.

## Corrections

For a materially wrong formula, denominator, mapping, source attribution or privacy concern, clearly label the issue as urgent and explain the potential impact. Never place sensitive information in a public issue.
