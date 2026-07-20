// Root iPad app — sidebar router + 7 views (3 native, 4 legacy framed).

const IpadRoot = () => {
  const [route, setRoute] = React.useState({section:'atlas', id:null});
  const [searchOpen, setSearchOpen] = React.useState(false);

  // Hash routing — supports deep links + iOS shortcuts
  React.useEffect(()=>{
    const apply = () => {
      const h = location.hash.replace(/^#/,'').trim();
      if (h) {
        const [section, id] = h.split('/');
        setRoute({section: section || 'atlas', id: id || null});
      }
    };
    apply();
    window.addEventListener('hashchange', apply);
    return ()=>window.removeEventListener('hashchange', apply);
  },[]);

  const sections = [
    {id:'atlas',     cn:'導覽 · 進入',   en:'ATLAS',      seal:'覽', color:'var(--gold-bright)'},
    {id:'genealogy', cn:'工藝譜系',     en:'GENEALOGY',  seal:'譜', color:'var(--gold)'},
    {id:'map',       cn:'熱點地圖',     en:'HEAT MAP',   seal:'圖', color:'var(--vermilion)'},
    {id:'works',     cn:'作品矩陣',     en:'WORKS',      seal:'作', color:'var(--jade)'},
    {id:'materials', cn:'材質物源',     en:'MATERIALS',  seal:'材', color:'#a8462e'},
    {id:'timeline',  cn:'時間舍利',     en:'TIMELINE',   seal:'時', color:'#7a6a55'},
    {id:'reference', cn:'三聯速查',     en:'REFERENCE',  seal:'聯', color:'#7a4a8c'},
  ];

  const current = sections.find(s=>s.id===route.section) || sections[0];

  const goto = ({section, id}) => {
    setRoute({section: section || route.section, id: id || null});
    // Don't push hash for every keypress — only for true navigations
    history.replaceState(null, '', `#${section || route.section}${id?'/'+id:''}`);
  };

  return (
    <div style={{height:'100vh', width:'100vw', display:'flex', flexDirection:'column', overflow:'hidden'}}>
      <IpTopBar section={current} onSearch={()=>setSearchOpen(true)}/>

      <div style={{flex:1, display:'flex', overflow:'hidden'}}>
        <IpSidebar sections={sections} current={route.section} onSelect={(s)=>goto({section:s, id:null})}/>

        <main style={{flex:1, position:'relative', overflow:'hidden', display:'flex', flexDirection:'column'}}>
          {/* Three iPad-native views */}
          {route.section==='atlas' && <IpAtlas goto={goto}/>}
          {route.section==='genealogy' && <IpGenealogy initialId={route.id} goto={goto}/>}
          {route.section==='map' && <IpMap initialId={route.id} goto={goto}/>}

          {/* Legacy views — framed inside iPad shell */}
          {route.section==='works' && (
            <LegacyFrame label="作品矩陣" en="WORKS MATRIX">
              <Works query=""/>
            </LegacyFrame>
          )}
          {route.section==='materials' && (
            <LegacyFrame label="材質物源" en="MATERIALS">
              <MaterialsApp query=""/>
            </LegacyFrame>
          )}
          {route.section==='timeline' && (
            <LegacyFrame label="時間舍利" en="TIMELINE">
              <Timeline query=""/>
            </LegacyFrame>
          )}
          {route.section==='reference' && (
            <LegacyFrame label="三聯速查" en="TRIPLE TABLE">
              <TripleApp query=""/>
            </LegacyFrame>
          )}
        </main>
      </div>

      {searchOpen && <IpSearch onClose={()=>setSearchOpen(false)} onGo={goto}/>}

      {/* Keep install prompt for PWA */}
      {window.IPadInstallPrompt && <IPadInstallPrompt/>}

      <style>{`
        @keyframes fadeUp { from{opacity:0; transform:translateY(8px);} to{opacity:1; transform:translateY(0);} }
        @keyframes fadeOut { 0%{opacity:1;} 70%{opacity:1;} 100%{opacity:0;} }
        @keyframes sheetUp { from{transform:translateY(100%);} to{transform:translateY(0);} }
      `}</style>
    </div>
  );
};

const LegacyFrame = ({ label, en, children }) => (
  <div style={{flex:1, overflow:'auto', padding:'24px 36px 48px'}}>
    <div style={{display:'flex', alignItems:'baseline', gap:14, marginBottom:16}}>
      <h2 style={{fontFamily:'var(--serif)', fontSize:30, color:'var(--gold-bright)', fontWeight:600, letterSpacing:'.16em'}}>{label}</h2>
      <span style={{fontFamily:'var(--mono)', fontSize:11, color:'var(--paper-3)', letterSpacing:'.36em'}}>{en}</span>
      <span style={{flex:1, height:1, background:'var(--line-strong)'}}/>
    </div>
    {children}
  </div>
);

ReactDOM.createRoot(document.getElementById('app')).render(<IpadRoot/>);
