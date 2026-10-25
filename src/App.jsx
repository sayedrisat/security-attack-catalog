import { useEffect, useMemo, useRef, useState } from 'react';
import catalog from './data/catalog.js';
import { BrandIcon, Icon } from './components/Icons.jsx';

const REPO_URL = 'https://github.com/sayedrisat/security-attack-catalog';
const LINKEDIN_URL = 'https://www.linkedin.com/in/risatdev/';
const totalEntries = catalog.reduce((sum, category) => sum + category.attacks.length, 0);
const preventionCount = catalog.reduce((sum, category) => sum + category.attacks.filter((attack) => Boolean(attack.prevention)).length, 0);
const coveragePercent = Math.round((preventionCount / totalEntries) * 100);

function shortTitle(title) {
  return title.replace(/^\d+\.\s*/, '').split(' & ')[0];
}

function preventionIssueUrl(category, attack) {
  const title = `Prevention: ${attack.name}`;
  return `${REPO_URL}/issues/new?template=prevention.yml&title=${encodeURIComponent(title)}`;
}

function ThemePicker({ theme, onChange }) {
  return (
    <div className="theme-picker" role="group" aria-label="Theme mode">
      {[
        ['system', 'Auto', 'monitor'],
        ['light', 'Light', 'sun'],
        ['dark', 'Dark', 'moon'],
      ].map(([value, label, icon]) => (
        <button key={value} type="button" className={`theme-btn ${theme === value ? 'active' : ''}`} aria-pressed={theme === value} onClick={() => onChange(value)} title={`${label} theme`}>
          <Icon name={icon} size={13} />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}

function SocialLink({ network, href, children, className = '' }) {
  return (
    <a className={className} href={href} target="_blank" rel="noopener noreferrer">
      <BrandIcon network={network} />
      <span>{children}</span>
    </a>
  );
}

function AttackCard({ attack, category, onCopy }) {
  const hasPrevention = Boolean(attack.prevention);
  return (
    <article className={`attack-card ${hasPrevention ? 'has-prevention' : 'needs-prevention'}`}>
      <div className="card-top">
        <div className="card-header-row">
          <h3 className="attack-name">{attack.name}</h3>
          <button type="button" className="btn-copy" onClick={() => onCopy(attack.name)} aria-label={`Copy ${attack.name}`} title="Copy attack name">
            <Icon name="copy" size={15} />
          </button>
        </div>
        {attack.notes && <div className="attack-notes">{attack.notes}</div>}
        <p className="attack-desc">{attack.desc}</p>
        {hasPrevention ? (
          <div className="prevention-panel">
            <div className="prevention-heading"><Icon name="check" size={14} /> How to prevent</div>
            <p>{attack.prevention}</p>
          </div>
        ) : (
          <div className="prevention-empty">
            <span>Prevention guidance needed</span>
            <a href={preventionIssueUrl(category, attack)} target="_blank" rel="noopener noreferrer" aria-label={`Suggest prevention for ${attack.name}`}>Contribute a fix <span aria-hidden="true">↗</span></a>
          </div>
        )}
      </div>
      <div className="card-bottom">
        <span className="card-category-tag"><Icon name="arrow" size={12} />{category.title}</span>
      </div>
    </article>
  );
}

export default function App() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'system');
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [needsOnly, setNeedsOnly] = useState(false);
  const [toast, setToast] = useState('');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const searchRef = useRef(null);
  const toastTimer = useRef(null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('sr_security_theme', theme); } catch (_) {}
  }, [theme]);

  useEffect(() => {
    function onKeyDown(event) {
      const typing = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName) || document.activeElement?.isContentEditable;
      if (!typing && (event.key === '/' || ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k'))) {
        event.preventDefault();
        searchRef.current?.focus();
      }
    }
    function onScroll() { setShowBackToTop(window.scrollY > 400); }
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('scroll', onScroll);
      clearTimeout(toastTimer.current);
    };
  }, []);

  const visibleSections = useMemo(() => {
    const term = query.trim().toLocaleLowerCase();
    return catalog.flatMap((category) => {
      if (activeCategory !== 'all' && activeCategory !== category.id) return [];
      const sectionMatches = category.title.toLocaleLowerCase().includes(term);
      const attacks = category.attacks.filter((attack) => {
        if (needsOnly && attack.prevention) return false;
        if (!term || sectionMatches) return true;
        return [attack.name, attack.notes, attack.desc, attack.prevention].some((value) => value?.toLocaleLowerCase().includes(term));
      });
      return attacks.length ? [{ ...category, visibleAttacks: attacks }] : [];
    });
  }, [query, activeCategory, needsOnly]);

  const visibleCount = visibleSections.reduce((sum, section) => sum + section.visibleAttacks.length, 0);

  function selectCategory(id, event) {
    setActiveCategory(id);
    event.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    if (id !== 'all') requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }

  async function copyAttack(name) {
    try {
      await navigator.clipboard.writeText(name);
      setToast(`Copied “${name}”`);
    } catch {
      setToast('Copy unavailable in this browser');
    }
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 2200);
  }

  const searchSummary = query.trim()
    ? `Found ${visibleCount} matching ${visibleCount === 1 ? 'entry' : 'entries'}`
    : needsOnly
      ? `${visibleCount} entries need prevention`
      : activeCategory !== 'all'
        ? `Showing ${visibleCount} entries in this section`
        : `Showing all ${totalEntries} entries`;

  return (
    <>
      <header className="header">
        <div className="container header-inner">
          <a href="#top" className="brand-group" aria-label="Security Attack Catalog, back to top">
            <span className="brand-icon">SR</span>
            <span className="brand-title">Security Attack Catalog <span className="brand-tag">Open source</span></span>
          </a>
          <div className="header-actions">
            <ThemePicker theme={theme} onChange={setTheme} />
            <SocialLink network="github" href={REPO_URL} className="btn-social">Project</SocialLink>
            <SocialLink network="linkedin" href={LINKEDIN_URL} className="btn-social">LinkedIn</SocialLink>
          </div>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="container">
          <div className="hero-eyebrow"><span>Web Application Security</span><span>•</span><span>Threat Modeling</span><span>•</span><span>Community Maintained</span></div>
          <h1 className="hero-title">The <span className="gradient-text">Web &amp; Infrastructure</span> Attack Catalog</h1>
          <p className="hero-subtitle">A searchable reference to security attacks, clear descriptions, and practical prevention guidance. Help make every entry more useful.</p>
          <div className="metrics-bar">
            <div className="metric-card"><div className="metric-val">{totalEntries}</div><div className="metric-lbl">Attack Entries</div></div>
            <div className="metric-card"><div className="metric-val">{catalog.length}</div><div className="metric-lbl">Security Sections</div></div>
          </div>
          <div className="coverage-callout">
            <span className="coverage-dot" aria-hidden="true" />
            <span><strong>{coveragePercent}% prevention coverage</strong> · {preventionCount} entries have guidance</span>
            <a href={`${REPO_URL}/blob/main/CONTRIBUTING.md`} target="_blank" rel="noopener noreferrer">Help finish the rest <span aria-hidden="true">↗</span></a>
          </div>
          <a className="hero-credit" href="https://github.com/sayedrisat" target="_blank" rel="noopener noreferrer" aria-label="Sayed Risat on GitHub">
            <img src={`${import.meta.env.BASE_URL}sayed-risat.png`} width="36" height="36" alt="Sayed Risat" />
            <span><small>Started by</small><strong>Sayed Risat</strong></span>
          </a>
        </div>
      </section>

      <div className="controls-wrapper">
        <div className="container controls-row">
          <div className="search-box">
            <span className="search-icon"><Icon name="search" size={18} /></span>
            <input ref={searchRef} type="search" className="search-input" aria-label="Search catalog" placeholder={`Search ${totalEntries} entries, sections, and defenses`} value={query} onChange={(event) => setQuery(event.target.value)} autoComplete="off" spellCheck="false" />
            {query && <button type="button" className="search-clear visible" aria-label="Clear search" onClick={() => { setQuery(''); searchRef.current?.focus(); }}><Icon name="close" size={16} /></button>}
          </div>
          <div className="search-count" role="status" aria-live="polite">{searchSummary}</div>
        </div>
        <div className="container filter-row">
          <div className="category-pills" aria-label="Filter by section">
            <button type="button" className={`pill-btn ${activeCategory === 'all' ? 'active' : ''}`} aria-pressed={activeCategory === 'all'} onClick={(event) => selectCategory('all', event)}><span>All Sections</span><span className="pill-count">{totalEntries}</span></button>
            {catalog.map((category) => <button key={category.id} type="button" className={`pill-btn ${activeCategory === category.id ? 'active' : ''}`} aria-pressed={activeCategory === category.id} onClick={(event) => selectCategory(category.id, event)}><span>{shortTitle(category.title)}</span><span className="pill-count">{category.attacks.length}</span></button>)}
          </div>
          <button type="button" className={`needs-filter ${needsOnly ? 'active' : ''}`} aria-pressed={needsOnly} onClick={() => setNeedsOnly(!needsOnly)}>Needs prevention <span>{totalEntries - preventionCount}</span></button>
        </div>
      </div>

      <main className="container" id="catalogContent">
        {visibleSections.length ? visibleSections.map((category) => (
          <section key={category.id} className="catalog-section" id={category.id}>
            <div className="section-header">
              <div className="section-title-wrap"><div className="section-icon"><Icon name={category.icon_key || category.id} size={22} /></div><div><h2 className="section-title">{category.order}. {category.title}</h2><p className="section-desc">{category.description}</p></div></div>
              <div className="section-badge">{category.visibleAttacks.length} {category.visibleAttacks.length === 1 ? 'Entry' : 'Entries'}</div>
            </div>
            <div className="attacks-grid">{category.visibleAttacks.map((attack) => <AttackCard key={`${category.id}:${attack.name}`} attack={attack} category={category} onCopy={copyAttack} />)}</div>
          </section>
        )) : <div className="empty-state visible"><div className="empty-icon">⌕</div><h2 className="empty-title">No entries found</h2><p className="empty-desc">Try a shorter search or clear your filters.</p><button type="button" className="empty-reset" onClick={() => { setQuery(''); setActiveCategory('all'); setNeedsOnly(false); }}>Clear filters</button></div>}
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-simple">
            <div><h2>Help expand the catalog</h2><p>Add an attack, improve a description, or contribute prevention guidance.</p></div>
            <div className="footer-simple-actions"><a href={`${REPO_URL}/blob/main/CONTRIBUTING.md`} target="_blank" rel="noopener noreferrer">Contribution guide <span aria-hidden="true">↗</span></a><a href={REPO_URL} target="_blank" rel="noopener noreferrer">GitHub project</a></div>
          </div>
          <div className="footer-bottom"><span>© {new Date().getFullYear()} Sayed Risat and contributors. MIT licensed.</span><span className="disclaimer">Educational and defensive reference. Test systems only with authorization.</span></div>
        </div>
      </footer>
      <button type="button" className={`back-to-top ${showBackToTop ? 'visible' : ''}`} aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}><Icon name="up" size={20} /></button>
      {toast && <div className="toast show" role="status">{toast}</div>}
    </>
  );
}
