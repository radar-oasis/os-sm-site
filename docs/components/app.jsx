// Root app — assembles everything.

const App = () => {
  const [tab, setTab] = React.useState('overview');
  const [query, setQuery] = React.useState('');
  const [filterLevel, setFilterLevel] = React.useState('ALL');
  const D = window.APP_DATA;
  const workCount = D.works.length;
  const workCraftCount = (D.workCraftKeys || []).length;

  React.useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey||e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        document.querySelector('input')?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div data-screen-label={`随身寺庙 · ${tab}`}>
      <Header tab={tab} setTab={setTab} query={query} setQuery={setQuery}
        filterLevel={filterLevel} setFilterLevel={setFilterLevel}/>
      <main style={{padding:'4px 36px 60px', maxWidth:1700, margin:'0 auto'}}>
        {tab==='overview' && <Overview goTab={setTab} query={query}/>}
        {tab==='heatmap' && <HeatMapPanel query={query} filterLevel={filterLevel}/>}
        {tab==='genealogy' && <Genealogy query={query} filterLevel={filterLevel}/>}
        {tab==='works' && <Works query={query}/>}
        {tab==='timeline' && <Timeline query={query}/>}
      </main>

      {/* footer */}
      <footer style={{borderTop:'1px solid var(--line)', padding:'18px 36px', display:'flex', justifyContent:'space-between',
        fontFamily:'var(--mono)', fontSize:10, color:'var(--paper-3)', letterSpacing:'.22em'}}>
        <span>SUISHEN SI MIAO · INTANGIBLE HERITAGE GENEALOGY DATABASE · v1.0 · 2026</span>
        <span>{workCraftCount} CRAFTS · {workCount} WORKS · 21 MATERIALS · 14 ERAS · 11 PROVINCES · 7 CROSS-BORDER</span>
        <span style={{color:'var(--gold)'}}>玉佛禪寺 · 應金小院</span>
      </footer>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('app')).render(<App/>);
