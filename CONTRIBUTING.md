# Contributing

Thanks for improving the Security Attack Catalog. Focused pull requests are easiest to review and merge.

Please follow the [Code of Conduct](CODE_OF_CONDUCT.md). Report vulnerabilities in this repository or live site through the [security policy](SECURITY.md), not a public issue. Corrections to catalog content belong in the public correction form.

## Good contributions

- Add one distinct attack with an accurate, concise description.
- Add prevention guidance to an entry where `prevention` is `null`.
- Correct a misleading note, description, or prevention statement.
- Improve the UI or accessibility without changing the meaning of the catalog.

Before adding an attack, search the site and the JSON files for the same weakness under another name. A tool, payload, or CVE name is useful context, but should not duplicate a broader entry without explaining the distinct mechanism.

## Edit the catalog

1. Fork the repository and make a branch for one focused change.
2. Edit the relevant file in `src/data/categories/`. Each file contains one section and an `attacks` array.
3. Add an attack object with `name`, `notes`, `desc`, and `prevention`. Use an empty string for missing notes and `null` when prevention is not ready.
4. For prevention, explain the control that addresses the actual weakness. Avoid vague advice such as “sanitize input” or “use a WAF.” Say where a check belongs and what it must enforce.
5. In your pull request, link at least one reliable source for every new or changed security claim. Prefer standards, official vendor guidance, maintained security guidance, or original research. Explain any inference.
6. Run `npm ci`, `npm run check`, and `npm run build`. Open a pull request using the provided template.

Keep descriptions neutral and technically precise. State when a condition is required for exploitation. A missing disclosure file, an exposed metadata endpoint, or the ability to enumerate a public name is not automatically a vulnerability. Avoid instructions against real targets, secrets, copied proprietary text, and large payload collections.

## Review and merge

The maintainer checks for duplicate entries, factual support, clear prevention advice, JSON validation, and a passing build. An issue is a request for review; it does not guarantee a merge. The maintainer may suggest moving a new item into an existing entry or narrowing the scope.

## Project structure

- `src/data/categories/`: one JSON file per section; this is the source of truth.
- `src/App.jsx`: catalog interface and contribution links.
- `src/styles.css`: light/dark visual design.
- `scripts/validate-catalog.mjs`: structure and duplicate checks.
- `.github/workflows/`: CI and GitHub Pages deployment.

The original standalone HTML and Python generator are kept locally by the maintainer as migration backups. They do not generate the open-source React catalog.
