// Top status bar — sealed brand + section title + search/clock.

const IpTopBar = ({ section, onSearch }) => {
  const [time, setTime] = React.useState(new Date());
  React.useEffect(()=>{
    const t = setInterval(()=>setTime(new Date()), 1000);
    return ()=>clearInterval(t);
  },[]);
  const pad = n => String(n).padStart(2,'0');
  const ts = `${time.getFullYear()}.${pad(time.getMonth()+1)}.${pad(time.getDate())}  ${pad(time.getHours())}:${pad(time.getMinutes())}`;

  return (
    <header style={{
      height:64, flex:'0 0 64px',
      display:'flex', alignItems:'center', gap:18, padding:'0 28px',
      borderBottom:'1px solid var(--line)',
      background:'linear-gradient(180deg, rgba(20,16,12,.95), rgba(13,10,8,.92))',
      position:'relative',
    }}>
      {/* Vermilion seal + brand */}
      <div style={{display:'flex', alignItems:'center', gap:14}}>
        <IpSeal char="寺" size={38} color="var(--vermilion)" bg="var(--vermilion)" stroke="var(--gold)"/>
        <div style={{lineHeight:1.1}}>
          <div style={{fontFamily:'var(--serif)', fontSize:15, fontWeight:600, color:'var(--gold-bright)', letterSpacing:'.18em'}}>隨身寺廟</div>
          <div style={{fontFamily:'var(--mono)', fontSize:9, color:'var(--paper-3)', letterSpacing:'.32em', marginTop:3}}>SUISHEN SI MIAO</div>
        </div>
      </div>

      {/* Vertical hairline */}
      <span style={{width:1, height:38, background:'var(--line-strong)', margin:'0 12px'}}/>

      {/* Section title */}
      {section && (
        <div style={{display:'flex', alignItems:'baseline', gap:14}}>
          <span style={{fontFamily:'var(--serif)', fontSize:22, fontWeight:500, color:'var(--paper)', letterSpacing:'.18em'}}>{section.cn}</span>
          <span style={{fontFamily:'var(--mono)', fontSize:10, color:'var(--paper-3)', letterSpacing:'.34em'}}>{section.en}</span>
        </div>
      )}

      <div style={{flex:1}}/>

      {/* Search button — large touch target */}
      <button onClick={onSearch} title="搜索"
        style={{minHeight:44, padding:'10px 18px',
          display:'inline-flex', alignItems:'center', gap:10,
          background:'transparent', border:'1px solid var(--line-strong)', cursor:'pointer',
          color:'var(--paper-2)', fontFamily:'var(--serif)', fontSize:13, letterSpacing:'.14em'}}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <circle cx="7" cy="7" r="5" stroke="var(--gold)" strokeWidth="1.4"/>
          <path d="M11 11 L14 14" stroke="var(--gold)" strokeWidth="1.4"/>
        </svg>
        <span>檢索</span>
      </button>

      <div style={{textAlign:'right', minWidth:140, marginLeft:14}}>
        <div style={{fontFamily:'var(--mono)', fontSize:11, color:'var(--gold)', letterSpacing:'.22em'}}>{ts}</div>
        <div style={{fontFamily:'var(--mono)', fontSize:9, color:'var(--paper-3)', letterSpacing:'.32em', marginTop:2}}>上海 · 丙午 · 立夏</div>
      </div>
    </header>
  );
};

// Left sidebar — 7 sections.
const IpSidebar = ({ sections, current, onSelect }) => {
  return (
    <aside style={{
      width:264, flex:'0 0 264px',
      display:'flex', flexDirection:'column',
      borderRight:'1px solid var(--line)',
      background:'linear-gradient(180deg, rgba(15,12,9,.7), rgba(10,8,6,.8))',
      position:'relative',
    }}>
      {/* Section list */}
      <div style={{flex:1, overflowY:'auto', paddingTop:14}}>
        {sections.map(s => {
          const active = current === s.id;
          return (
            <button key={s.id} onClick={()=>onSelect(s.id)}
              style={{
                width:'100%', minHeight:72, padding:'12px 18px',
                display:'flex', alignItems:'center', gap:14,
                background: active ? 'linear-gradient(to right, rgba(201,162,74,.12), transparent 85%)' : 'transparent',
                border:'none',
                borderLeft: active ? '2px solid var(--gold)' : '2px solid transparent',
                cursor:'pointer', textAlign:'left',
                transition:'background .2s ease',
              }}>
              <IpSeal char={s.seal} size={40} color={active ? 'var(--vermilion)' : s.color}
                bg={active?'var(--vermilion)':'transparent'} stroke={active?'var(--gold)':s.color}/>
              <div style={{flex:1, minWidth:0}}>
                <div style={{fontFamily:'var(--serif)', fontSize:15.5, fontWeight: active?600:500,
                  color: active?'var(--gold-bright)':'var(--paper)', letterSpacing:'.14em', lineHeight:1.2}}>{s.cn}</div>
                <div style={{fontFamily:'var(--mono)', fontSize:9.5, color: active?'var(--gold)':'var(--paper-3)', letterSpacing:'.28em', marginTop:4}}>{s.en}</div>
              </div>
              {active && (
                <svg width="10" height="14" viewBox="0 0 10 14" style={{flexShrink:0}}>
                  <path d="M2 2 L8 7 L2 12" fill="none" stroke="var(--gold)" strokeWidth="1.4"/>
                </svg>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer cartouche */}
      <div style={{padding:'18px 20px', borderTop:'1px solid var(--line-bone)', display:'flex', alignItems:'center', gap:12}}>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:2}}>
          <IpSeal char="慈" size={20} color="var(--vermilion)"/>
          <IpSeal char="悲" size={20} color="var(--vermilion)"/>
          <IpSeal char="方" size={20} color="var(--gold)"/>
          <IpSeal char="寸" size={20} color="var(--gold)"/>
        </div>
        <div style={{lineHeight:1.3}}>
          <div style={{fontFamily:'var(--serif)', fontSize:11, color:'var(--paper-2)', letterSpacing:'.18em'}}>慈悲方寸</div>
          <div style={{fontFamily:'var(--mono)', fontSize:8.5, color:'var(--paper-3)', letterSpacing:'.3em', marginTop:2}}>148p · v1.0 · 2026</div>
        </div>
      </div>
    </aside>
  );
};

// Search overlay — full-screen modal
const IpSearch = ({ onClose, onGo }) => {
  const [q, setQ] = React.useState('');
  const [idx, setIdx] = React.useState(0);
  const inputRef = React.useRef(null);
  React.useEffect(()=>{ inputRef.current?.focus(); },[]);

  const results = React.useMemo(()=>{
    const D = window.APP_DATA;
    if (!q.trim()) {
      // Trending: featured items
      return [
        ...D.crafts.slice(0,3).map(c => ({type:'工藝', icon:c.id, title:c.name, sub:`${c.category} · ${c.city}`, go:{section:'genealogy', id:c.id}})),
        ...D.nodes.filter(n=>n.type==='中枢'||n.type==='非遗重镇').slice(0,3).map(n => ({type:'重鎮', icon:n.id, title:n.name, sub:`${n.type} · ${n.craft}`, go:{section:'map', id:n.id}})),
      ];
    }
    const out = [];
    D.crafts.forEach(c=>{
      if (`${c.name}${c.city}${c.spec}${c.material}${c.works}`.includes(q))
        out.push({type:'工藝', icon:c.id, title:c.name, sub:`${c.category} · ${c.city}`, go:{section:'genealogy', id:c.id}});
    });
    D.nodes.forEach(n=>{
      if (`${n.name}${n.craft}${n.role}`.includes(q))
        out.push({type:'重鎮', icon:n.id, title:n.name, sub:`${n.type} · ${n.craft}`, go:{section:'map', id:n.id}});
    });
    return out.slice(0,16);
  },[q]);

  return (
    <div onClick={onClose} style={{position:'fixed', inset:0, background:'rgba(5,4,3,.78)', backdropFilter:'blur(12px)', zIndex:2000,
      display:'flex', alignItems:'flex-start', justifyContent:'center', paddingTop:'12vh'}}>
      <div onClick={e=>e.stopPropagation()} style={{
        width:'min(720px, 92vw)',
        background:'linear-gradient(180deg, rgba(20,16,12,.98), rgba(13,10,8,.98))',
        border:'1px solid var(--line-strong)',
        boxShadow:'0 40px 100px rgba(0,0,0,.8), 0 0 0 1px rgba(232,199,115,.1)',
      }}>
        <div style={{display:'flex', alignItems:'center', gap:14, padding:'22px 24px', borderBottom:'1px solid var(--line)'}}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <circle cx="10" cy="10" r="6.5" stroke="var(--gold)" strokeWidth="1.6"/>
            <path d="M15 15 L19 19" stroke="var(--gold)" strokeWidth="1.6"/>
          </svg>
          <input ref={inputRef} value={q} onChange={e=>{setQ(e.target.value); setIdx(0);}}
            onKeyDown={e=>{
              if (e.key==='Escape') onClose();
              if (e.key==='Enter') { e.preventDefault(); const r=results[idx]; if (r) { onGo(r.go); onClose(); } }
            }}
            placeholder="檢索 工藝 · 重鎮 · 作品 · 材質…"
            style={{flex:1, background:'transparent', border:'none', outline:'none',
              fontFamily:'var(--serif)', fontSize:22, color:'var(--gold-bright)', letterSpacing:'.06em', fontWeight:500, minHeight:44}}/>
          <button onClick={onClose} style={{padding:'8px 14px', background:'transparent', border:'1px solid var(--line-strong)',
            color:'var(--paper-3)', cursor:'pointer', fontFamily:'var(--mono)', fontSize:10, letterSpacing:'.3em'}}>關閉</button>
        </div>
        <div style={{maxHeight:'58vh', overflowY:'auto'}}>
          {!q.trim() && (
            <div style={{padding:'14px 24px 4px', fontFamily:'var(--mono)', fontSize:10, color:'var(--paper-3)', letterSpacing:'.32em'}}>熱門 · TRENDING</div>
          )}
          {results.length===0 && (
            <div style={{padding:'40px', textAlign:'center', fontFamily:'var(--serif)', fontSize:14, color:'var(--paper-3)'}}>無匹配 · 換個關鍵字試試</div>
          )}
          {results.map((r,i)=>(
            <button key={i} onClick={()=>{ onGo(r.go); onClose(); }}
              style={{width:'100%', display:'grid', gridTemplateColumns:'48px 60px 1fr', gap:14, padding:'14px 24px',
                cursor:'pointer', border:'none', background: idx===i?'rgba(201,162,74,.10)':'transparent', textAlign:'left',
                borderLeft: idx===i?'2px solid var(--gold)':'2px solid transparent', minHeight:60}}>
              <IpSeal char={r.icon[0]} size={36} color="var(--vermilion)" bg="rgba(184,51,31,.18)" stroke="var(--gold)"/>
              <span style={{alignSelf:'center', fontFamily:'var(--mono)', fontSize:10, color:'var(--gold)', letterSpacing:'.32em'}}>{r.type}</span>
              <div style={{alignSelf:'center'}}>
                <div style={{fontFamily:'var(--serif)', fontSize:15, color:'var(--paper)', fontWeight:500, letterSpacing:'.08em'}}>{r.title}</div>
                <div style={{fontFamily:'var(--mono)', fontSize:10, color:'var(--paper-3)', letterSpacing:'.22em', marginTop:3}}>{r.sub}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

window.IpTopBar = IpTopBar;
window.IpSidebar = IpSidebar;
window.IpSearch = IpSearch;
