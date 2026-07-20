// Main OS app — window manager + desktop assembly.

const OSApp = () => {
  const [windows, setWindows] = React.useState([]);
  const [focusedId, setFocusedId] = React.useState(null);
  const [zCounter, setZCounter] = React.useState(100);
  const [spotlight, setSpotlight] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [filterLevel, setFilterLevel] = React.useState('ALL');
  const [bootDone, setBootDone] = React.useState(false);

  // Boot: open Overview by default after a short delay
  React.useEffect(()=>{
    const t = setTimeout(()=>{
      launchApp(window.APPS[0]);
      setBootDone(true);
    }, 600);
    return ()=>clearTimeout(t);
  },[]);

  // Keyboard shortcuts
  React.useEffect(()=>{
    const onKey = (e) => {
      const isMod = e.metaKey || e.ctrlKey;
      if (isMod && e.key.toLowerCase()==='k') { e.preventDefault(); setSpotlight(s=>!s); return; }
      if (e.key === 'Escape' && spotlight) { setSpotlight(false); return; }
      if (isMod && e.key.toLowerCase()==='w' && focusedId) { e.preventDefault(); closeWindow(focusedId); return; }
      if (isMod && e.key.toLowerCase()==='h') { e.preventDefault(); hideAll(); return; }
    };
    window.addEventListener('keydown', onKey);
    return ()=>window.removeEventListener('keydown', onKey);
  },[focusedId, spotlight]);

  const focusWindow = (id) => {
    const z = zCounter + 1;
    setZCounter(z);
    setWindows(ws => ws.map(w => w.id===id ? {...w, z, minimized:false} : w));
    setFocusedId(id);
  };

  const launchApp = (app) => {
    // If already open: focus it
    const existing = windows.find(w => w.appId===app.id);
    if (existing) { focusWindow(existing.id); return; }
    const id = app.id + '-' + Math.random().toString(36).slice(2,7);
    const z = zCounter + 1;
    setZCounter(z);
    const offset = windows.length * 24;
    // Clamp to viewport — important for iPad / smaller screens
    const VW = window.innerWidth, VH = window.innerHeight;
    const MAX_W = Math.max(360, VW - 40);
    const MAX_H = Math.max(240, VH - 28 - 96 - 20); // menubar + dock
    const w = Math.min(app.defaultSize.w, MAX_W);
    const h = Math.min(app.defaultSize.h, MAX_H);
    const x = Math.max(10, Math.min(VW - w - 10, (app.defaultPos?.x||120) + offset));
    const y = Math.max(36, Math.min(VH - h - 100, (app.defaultPos?.y||80) + offset));
    const newWin = {
      id, appId: app.id,
      title: app.cn, subtitle: app.en + ' · ' + app.subtitle, seal: app.seal,
      x, y, w, h,
      z, minimized:false, maximized: VW < 900 || VH < 700,  // auto-max on small
      statusLeft: `${app.en} · ${app.subtitle}`,
    };
    setWindows(ws => [...ws, newWin]);
    setFocusedId(id);
  };

  const closeWindow = (id) => {
    setWindows(ws => ws.filter(w=>w.id!==id));
    if (focusedId === id) setFocusedId(null);
  };
  const minimizeWindow = (id) => {
    setWindows(ws => ws.map(w => w.id===id ? {...w, minimized:true}:w));
    if (focusedId === id) setFocusedId(null);
  };
  const maximizeWindow = (id) => {
    setWindows(ws => ws.map(w => w.id===id ? {...w, maximized:!w.maximized}:w));
  };
  const moveWindow = (id, {x,y}) => setWindows(ws => ws.map(w => w.id===id?{...w, x, y}:w));
  const resizeWindow = (id, geom) => setWindows(ws => ws.map(w => w.id===id?{...w, ...geom}:w));

  const closeAll = () => { setWindows([]); setFocusedId(null); };
  const hideAll = () => setWindows(ws => ws.map(w => ({...w, minimized:true})));
  const cascade = () => {
    let acc = 80;
    setWindows(ws => ws.map(w => { const r = {...w, x:80+acc, y:60+acc, minimized:false, maximized:false}; acc += 30; return r; }));
  };
  const tile = () => {
    const visible = windows.filter(w=>!w.minimized);
    const n = visible.length || 1;
    const cols = Math.ceil(Math.sqrt(n)), rows = Math.ceil(n/cols);
    const W = window.innerWidth, H = window.innerHeight - 28 - 100;
    const cw = W/cols, ch = H/rows;
    setWindows(ws => ws.map(w => {
      const idx = visible.findIndex(v=>v.id===w.id);
      if (idx<0) return w;
      const r = Math.floor(idx/cols), c = idx%cols;
      return {...w, x: c*cw+10, y: 32 + r*ch+10, w: cw-20, h: ch-20, maximized:false, minimized:false};
    }));
  };

  const handleMenuAction = (action) => {
    if (action==='reset') { closeAll(); setTimeout(()=>launchApp(window.APPS[0]), 100); }
    else if (action==='close-all') closeAll();
    else if (action==='hide-all') hideAll();
    else if (action==='cascade') cascade();
    else if (action==='tile') tile();
    else if (action.startsWith('open:')) {
      const id = action.slice(5);
      const app = window.APPS.find(a=>a.id===id);
      if (app) launchApp(app);
    }
  };

  const openById = (id) => {
    const app = window.APPS.find(a=>a.id===id);
    if (app) launchApp(app);
  };

  const activeWin = windows.find(w=>w.id===focusedId);

  return (
    <div style={{position:'relative', height:'100vh', overflow:'hidden'}}>
      {/* Menubar */}
      <MenuBar activeWin={activeWin} onAction={handleMenuAction} onSpotlight={()=>setSpotlight(true)}
        query={query} setQuery={setQuery}/>

      {/* Boot splash */}
      {!bootDone && (
        <div style={{position:'absolute', inset:0, zIndex:2000, display:'flex', flexDirection:'column',
          alignItems:'center', justifyContent:'center', gap:24,
          background:'linear-gradient(180deg, rgba(10,8,6,.9), rgba(20,16,12,.9))',
          animation:'fadeOut .6s .4s forwards', pointerEvents:'none'}}>
          <KanjiSeal char="寺" size={88} color="var(--vermilion)"/>
          <div style={{fontFamily:'var(--serif)', fontSize:24, color:'var(--gold-bright)', letterSpacing:'.36em'}}>隨身寺廟 OS</div>
          <div style={{fontFamily:'var(--mono)', fontSize:10, color:'var(--paper-3)', letterSpacing:'.4em'}}>BOOTING · v1.0</div>
          <div style={{width:200, height:1, background:'var(--line-strong)', position:'relative', overflow:'hidden'}}>
            <div style={{position:'absolute', left:0, top:0, height:'100%', background:'var(--gold)', animation:'progress 1s linear'}}/>
          </div>
        </div>
      )}

      {/* Desktop widgets — hidden on smaller iPad portrait to give windows room */}
      {window.innerWidth >= 1100 && (
        <div style={{position:'fixed', top:48, right:18, display:'flex', flexDirection:'column', gap:14, zIndex:5}}>
          <SealWidget/>
          <StatsWidget/>
          <HotNodeWidget onOpenHeatmap={()=>openById('heatmap')}/>
        </div>
      )}
      {window.innerWidth >= 900 && (
        <div style={{position:'fixed', bottom:104, left:18, zIndex:5}}>
          <MantraWidget/>
        </div>
      )}
      {/* Welcome cartouche on desktop center */}
      {windows.length === 0 && (
        <div style={{position:'fixed', left:'50%', top:'46%', transform:'translate(-50%,-50%)', zIndex:5, textAlign:'center', pointerEvents:'none'}}>
          <div style={{fontFamily:'var(--mono)', fontSize:11, color:'var(--gold)', letterSpacing:'.42em', marginBottom:18}}>SUISHEN SI MIAO OS · v1.0 · 2026</div>
          <div style={{fontFamily:'var(--serif)', fontSize:96, color:'var(--paper)', letterSpacing:'.24em', fontWeight:300, lineHeight:1}}>
            <span style={{color:'var(--gold-bright)'}}>隨身</span>寺廟
          </div>
          <div style={{fontFamily:'var(--display)', fontSize:18, fontStyle:'italic', color:'var(--paper-3)', marginTop:18, letterSpacing:'.08em'}}>
            Twenty-seven crafts · Seven centuries · One palm
          </div>
          <div style={{marginTop:30, fontFamily:'var(--mono)', fontSize:11, color:'var(--paper-3)', letterSpacing:'.3em', pointerEvents:'auto'}}>
            從下方船塢選擇應用 · ⌘K 全局搜索
          </div>
        </div>
      )}

      {/* Windows */}
      {windows.map(win => {
        const app = window.APPS.find(a=>a.id===win.appId);
        return (
          <OSWindow key={win.id} win={win} focused={focusedId===win.id}
            onFocus={()=>focusWindow(win.id)}
            onClose={closeWindow}
            onMinimize={minimizeWindow}
            onMaximize={maximizeWindow}
            onMove={moveWindow}
            onResize={resizeWindow}>
            {app?.render({query, filterLevel})}
          </OSWindow>
        );
      })}

      {/* Dock */}
      <Dock windows={windows.filter(w=>!w.minimized)} onLaunch={launchApp} onFocus={focusWindow}/>

      {/* Minimized strip — left side */}
      {windows.some(w=>w.minimized) && (
        <div style={{position:'fixed', left:18, top:48, display:'flex', flexDirection:'column', gap:6, zIndex:800}}>
          {windows.filter(w=>w.minimized).map(w=>{
            const app = window.APPS.find(a=>a.id===w.appId);
            return (
              <button key={w.id} onClick={()=>focusWindow(w.id)} title={w.title}
                style={{padding:'8px 12px', cursor:'pointer', display:'flex', alignItems:'center', gap:8,
                  background:'rgba(15,12,9,.8)', border:'1px solid var(--line)', backdropFilter:'blur(20px)'}}>
                <span style={{width:18, height:18, border:`1px solid ${app?.accent||'var(--gold)'}`, display:'inline-flex', alignItems:'center', justifyContent:'center',
                  fontFamily:'var(--serif)', fontSize:11, fontWeight:600, color:app?.accent||'var(--gold)', background:'rgba(0,0,0,.4)'}}>{w.seal}</span>
                <span style={{fontFamily:'var(--serif)', fontSize:11.5, color:'var(--paper)', letterSpacing:'.14em'}}>{w.title}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Spotlight overlay */}
      {spotlight && <Spotlight onClose={()=>setSpotlight(false)} onOpen={openById}/>}

      {/* iPad install prompt — only renders if component exists (PWA build) */}
      {window.IPadInstallPrompt && <IPadInstallPrompt/>}

      <style>{`
        @keyframes fadeIn { from{opacity:0; transform:translateY(4px);} to{opacity:1; transform:translateY(0);} }
        @keyframes fadeOut { to{opacity:0; visibility:hidden;} }
        @keyframes progress { from{width:0%;} to{width:100%;} }
      `}</style>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('app')).render(<OSApp/>);
