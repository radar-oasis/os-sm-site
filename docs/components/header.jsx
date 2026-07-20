// Top header / nav

const Header = ({ tab, setTab, query, setQuery, filterLevel, setFilterLevel }) => {
  const D = window.APP_DATA;
  const workCount = D.works.length;
  const workCraftCount = (D.workCraftKeys || []).length;
  const tabs = [
    {k:'overview', cn:'总览', en:'OVERVIEW', sub:'数据驾驶舱'},
    {k:'heatmap',  cn:'热点地图', en:'HEAT MAP', sub:'27 节点 · 11 省'},
    {k:'genealogy',cn:'工艺谱系', en:'GENEALOGY', sub:'27 项非遗'},
    {k:'works',    cn:'作品矩阵', en:'WORKS MATRIX', sub:`${workCount} 件 × ${workCraftCount} 工艺`},
    {k:'timeline', cn:'时间舍利', en:'TIMELINE', sub:'公元 386 → 2026'},
  ];
  const [time, setTime] = React.useState(() => new Date());
  React.useEffect(()=>{
    const t = setInterval(()=>setTime(new Date()), 1000);
    return ()=>clearInterval(t);
  },[]);
  const pad = n => String(n).padStart(2,'0');
  const ts = `${time.getFullYear()}.${pad(time.getMonth()+1)}.${pad(time.getDate())} · ${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(time.getSeconds())}`;

  return (
    <header style={{
      position:'sticky', top:0, zIndex:50,
      background:'linear-gradient(180deg, rgba(13,10,8,.96), rgba(13,10,8,.86) 80%, rgba(13,10,8,.0))',
      backdropFilter:'blur(14px)',
      borderBottom:'1px solid var(--line)',
    }}>
      <div style={{padding:'14px 36px 0', display:'flex', alignItems:'center', gap:24}}>
        {/* Brand */}
        <div style={{display:'flex', alignItems:'center', gap:14, flex:'0 0 auto'}}>
          <KanjiSeal char="寺" size={42} color="var(--vermilion)"/>
          <div style={{lineHeight:1.1}}>
            <div style={{fontFamily:'var(--serif)', fontSize:18, fontWeight:600, color:'var(--gold-bright)', letterSpacing:'.16em'}}>隨身寺廟 · 智庫</div>
            <div style={{fontFamily:'var(--mono)', fontSize:9.5, color:'var(--paper-3)', letterSpacing:'.32em', marginTop:3}}>SUISHEN SI MIAO · INTANGIBLE HERITAGE THINK-TANK</div>
          </div>
        </div>

        <div style={{flex:1}}/>

        {/* search */}
        <div style={{display:'flex', alignItems:'center', gap:10, padding:'8px 14px', border:'1px solid var(--line-strong)', minWidth:280, background:'rgba(0,0,0,.3)'}}>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="5" stroke="var(--gold)" strokeWidth="1.2"/><path d="M11 11 L14 14" stroke="var(--gold)" strokeWidth="1.2"/></svg>
          <input value={query} onChange={e=>setQuery(e.target.value)}
            placeholder="检索 工艺 / 重镇 / 作品 / 材质…"
            style={{flex:1, background:'transparent', border:'none', outline:'none', color:'var(--paper)',
              fontFamily:'var(--serif)', fontSize:13, letterSpacing:'.05em'}}/>
          <span style={{fontFamily:'var(--mono)', fontSize:9, color:'var(--paper-3)', letterSpacing:'.18em'}}>⌘K</span>
        </div>

        {/* level filter */}
        <div style={{display:'flex', gap:6}}>
          {['ALL','世界级','国家级','省级','跨境'].map(l => (
            <button key={l} onClick={()=>setFilterLevel(l)} style={{
              padding:'6px 10px', fontFamily:'var(--mono)', fontSize:10, letterSpacing:'.18em',
              background: filterLevel===l ? 'var(--gold)' : 'transparent',
              color: filterLevel===l ? 'var(--ink)' : 'var(--paper-3)',
              border:`1px solid ${filterLevel===l ? 'var(--gold)':'var(--line)'}`,
              cursor:'pointer', textTransform:'uppercase'
            }}>{l}</button>
          ))}
        </div>

        {/* timestamp */}
        <div style={{textAlign:'right', minWidth:200}}>
          <div style={{fontFamily:'var(--mono)', fontSize:10.5, color:'var(--gold)', letterSpacing:'.18em'}}>{ts}</div>
          <div style={{fontFamily:'var(--mono)', fontSize:9, color:'var(--paper-3)', letterSpacing:'.32em', marginTop:3}}>SHANGHAI · GMT+08 · LIVE</div>
        </div>
      </div>

      {/* tab bar */}
      <div style={{display:'flex', alignItems:'flex-end', gap:0, padding:'14px 36px 0', position:'relative'}}>
        {tabs.map(t => {
          const active = tab === t.k;
          return (
            <button key={t.k} onClick={()=>setTab(t.k)} style={{
              padding:'12px 22px 14px', background:'transparent', border:'none', cursor:'pointer',
              borderBottom: active ? '2px solid var(--gold)' : '2px solid transparent',
              borderTop: active ? '1px solid var(--line)' : '1px solid transparent',
              borderLeft: active ? '1px solid var(--line)' : '1px solid transparent',
              borderRight: active ? '1px solid var(--line)' : '1px solid transparent',
              background: active ? 'rgba(201,162,74,.06)' : 'transparent',
              textAlign:'left', minWidth:130,
            }}>
              <div style={{display:'flex', alignItems:'baseline', gap:8}}>
                <span style={{fontFamily:'var(--serif)', fontSize:15, fontWeight:600,
                  color: active ? 'var(--gold-bright)' : 'var(--paper)', letterSpacing:'.12em'}}>{t.cn}</span>
                <span style={{fontFamily:'var(--mono)', fontSize:9, color:'var(--paper-3)', letterSpacing:'.18em'}}>{t.en}</span>
              </div>
              <div style={{fontFamily:'var(--mono)', fontSize:9.5, color: active ? 'var(--gold)':'var(--paper-3)', letterSpacing:'.16em', marginTop:4}}>{t.sub}</div>
            </button>
          );
        })}
        <div style={{flex:1, borderBottom:'1px solid var(--line)', alignSelf:'flex-end', height:0}}/>
        <div style={{padding:'12px 0 14px 18px', alignSelf:'flex-end', borderBottom:'1px solid var(--line)'}}>
          <span style={{fontFamily:'var(--mono)', fontSize:9.5, color:'var(--paper-3)', letterSpacing:'.18em'}}>v1.0 · 2026.05</span>
        </div>
      </div>
    </header>
  );
};

window.Header = Header;
