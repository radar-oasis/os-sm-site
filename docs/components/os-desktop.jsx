// Desktop chrome: menubar, dock, widgets, spotlight.

// ---- MENUBAR ----
const MenuBar = ({ activeWin, onAction, onSpotlight, query, setQuery }) => {
  const [time, setTime] = React.useState(new Date());
  const [open, setOpen] = React.useState(null);
  React.useEffect(()=>{
    const t = setInterval(()=>setTime(new Date()), 1000);
    return ()=>clearInterval(t);
  },[]);
  const pad = n=>String(n).padStart(2,'0');
  const ts = `${time.getFullYear()}.${pad(time.getMonth()+1)}.${pad(time.getDate())}  ${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(time.getSeconds())}`;

  // Lunar / chinese era label — purely decorative
  const eraLabel = '丙午年 · 立夏';

  const menus = {
    '寺': [
      {l:'關於 隨身寺廟 OS', shortcut:''},
      {l:'系統偏好…', shortcut:''},
      {sep:true},
      {l:'重置桌面', action:'reset'},
      {l:'關閉全部窗口', action:'close-all', shortcut:'⌘W'},
    ],
    '檔': [
      {l:'新建窗口', shortcut:'⌘N'},
      {l:'打印…', shortcut:'⌘P'},
      {sep:true},
      {l:'導出數據庫…', shortcut:''},
    ],
    '視': [
      {l:'層疊全部窗口', action:'cascade'},
      {l:'平鋪全部窗口', action:'tile'},
      {l:'隱藏全部窗口', action:'hide-all', shortcut:'⌘H'},
    ],
    '走': [
      ...window.APPS.map(a=>({l:`${a.cn}`, en:a.en, action:'open:'+a.id})),
    ],
  };

  return (
    <div style={{
      position:'fixed', top:0, left:0, right:0, height:28, zIndex:1000,
      display:'flex', alignItems:'center',
      background:'linear-gradient(180deg, rgba(20,16,12,.92), rgba(13,10,8,.88))',
      borderBottom:'1px solid rgba(201,162,74,.18)',
      backdropFilter:'blur(20px)',
      padding:'0 12px',
      fontFamily:'var(--mono)', fontSize:11, color:'var(--paper-2)',
    }}>
      {/* Brand seal */}
      <div style={{display:'flex', alignItems:'center', gap:8, marginRight:18}}>
        <span style={{width:14, height:14, border:'1px solid var(--gold)', display:'inline-flex', alignItems:'center', justifyContent:'center',
          background:'var(--vermilion)', color:'var(--paper)', fontFamily:'var(--serif)', fontSize:10, fontWeight:700}}>寺</span>
        <span style={{fontFamily:'var(--serif)', fontSize:12, fontWeight:600, color:'var(--gold-bright)', letterSpacing:'.18em'}}>隨身寺廟 OS</span>
      </div>

      {/* Active window label */}
      <span style={{fontFamily:'var(--serif)', fontSize:12, fontWeight:600, color:'var(--paper)', letterSpacing:'.16em', marginRight:24}}>
        {activeWin ? activeWin.title : '桌面'}
      </span>

      {/* Menus */}
      {Object.entries(menus).map(([k, items])=>(
        <div key={k} style={{position:'relative'}} onMouseEnter={()=>open && setOpen(k)}>
          <button onClick={()=>setOpen(open===k?null:k)}
            style={{padding:'4px 10px', background: open===k?'rgba(201,162,74,.18)':'transparent',
              color: open===k?'var(--gold-bright)':'var(--paper-2)',
              border:'none', cursor:'pointer', fontFamily:'var(--serif)', fontSize:12, letterSpacing:'.18em'}}>
            {k}
          </button>
          {open===k && (
            <div style={{position:'absolute', top:'100%', left:0, minWidth:230,
              background:'rgba(15,12,9,.96)', border:'1px solid var(--line-strong)', backdropFilter:'blur(20px)',
              padding:'6px 0', boxShadow:'0 18px 50px rgba(0,0,0,.7)'}}>
              {items.map((it,i)=> it.sep ? (
                <div key={i} style={{height:1, background:'var(--line-bone)', margin:'4px 8px'}}/>
              ) : (
                <button key={i} onMouseDown={()=>{ if(it.action) onAction(it.action); setOpen(null); }}
                  style={{display:'flex', justifyContent:'space-between', width:'100%', padding:'6px 16px',
                  background:'transparent', border:'none', cursor:'pointer',
                  fontFamily:'var(--serif)', fontSize:12, color:'var(--paper)', letterSpacing:'.08em', textAlign:'left'}}
                  onMouseEnter={e=>{e.target.style.background='rgba(201,162,74,.14)'; e.target.style.color='var(--gold-bright)'}}
                  onMouseLeave={e=>{e.target.style.background='transparent'; e.target.style.color='var(--paper)'}}>
                  <span>{it.l}</span>
                  {it.en && <span style={{fontFamily:'var(--mono)', fontSize:9, color:'var(--paper-3)', letterSpacing:'.2em', marginLeft:14}}>{it.en}</span>}
                  {it.shortcut && <span style={{fontFamily:'var(--mono)', fontSize:9.5, color:'var(--paper-3)', letterSpacing:'.18em'}}>{it.shortcut}</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}

      <div style={{flex:1}}/>

      {/* status icons */}
      <button onClick={onSpotlight} title="Spotlight (⌘K)" style={{padding:'4px 10px', background:'transparent', border:'1px solid var(--line)', cursor:'pointer',
        color:'var(--paper-2)', fontFamily:'var(--mono)', fontSize:10, letterSpacing:'.22em', marginRight:12}}>
        {window.innerWidth >= 1180 ? '⌘K 　搜索 27 工藝 · 21 材質' : '⌘K 　搜索'}
      </button>
      <span style={{color:'var(--vermilion)', marginRight:14, fontFamily:'var(--serif)', fontSize:12, letterSpacing:'.18em',
        display: window.innerWidth >= 1180 ? 'inline' : 'none'}}>{eraLabel}</span>
      <span style={{color:'var(--gold)', fontFamily:'var(--mono)', letterSpacing:'.22em'}}>{ts}</span>
      <span style={{color:'var(--paper-3)', marginLeft:12, fontFamily:'var(--mono)', letterSpacing:'.22em',
        display: window.innerWidth >= 1280 ? 'inline' : 'none'}}>上海 · GMT+8</span>
    </div>
  );
};

// ---- DOCK ----
const Dock = ({ windows, onLaunch, onFocus }) => {
  const [hover, setHover] = React.useState(null);
  // Build active map by app id
  const activeMap = {};
  windows.forEach(w => { activeMap[w.appId] = w; });

  return (
    <div style={{
      position:'fixed', bottom:14, left:'50%', transform:'translateX(-50%)', zIndex:900,
      display:'flex', alignItems:'flex-end', gap:6, padding:'10px 16px',
      background:'rgba(15,12,9,.78)', border:'1px solid rgba(201,162,74,.32)',
      backdropFilter:'blur(24px)',
      boxShadow:'0 24px 60px rgba(0,0,0,.7), 0 0 0 1px rgba(232,199,115,.06)',
    }}>
      {window.APPS.map(a=>{
        const isOpen = !!activeMap[a.id];
        const isHover = hover === a.id;
        const scale = isHover ? 1.18 : 1;
        return (
          <button key={a.id}
            onMouseEnter={()=>setHover(a.id)} onMouseLeave={()=>setHover(null)}
            onClick={()=>onLaunch(a)}
            style={{
              position:'relative', width:56, height:56, padding:0,
              background: `linear-gradient(135deg, ${a.accent}, color-mix(in oklch, ${a.accent} 60%, var(--ink)))`,
              border:'1px solid rgba(232,199,115,.42)',
              cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
              transform:`scale(${scale}) translateY(${isHover?-4:0}px)`,
              transformOrigin:'bottom center',
              transition:'transform .22s cubic-bezier(.34,1.5,.64,1)',
              boxShadow: isHover ? `0 20px 40px ${a.accent}80, 0 0 0 1px rgba(232,199,115,.4)` : '0 6px 18px rgba(0,0,0,.5)',
            }}>
            <span style={{fontFamily:'var(--serif)', fontSize:22, fontWeight:700, color:'var(--paper)',
              textShadow:'0 1px 2px rgba(0,0,0,.5)', letterSpacing:0}}>{a.seal}</span>

            {/* Tooltip */}
            {isHover && (
              <div style={{position:'absolute', bottom:'calc(100% + 14px)', left:'50%', transform:'translateX(-50%)',
                whiteSpace:'nowrap', padding:'6px 12px', background:'rgba(15,12,9,.96)',
                border:'1px solid var(--line-strong)', pointerEvents:'none'}}>
                <div style={{fontFamily:'var(--serif)', fontSize:12, fontWeight:600, color:'var(--gold-bright)', letterSpacing:'.16em'}}>{a.cn}</div>
                <div style={{fontFamily:'var(--mono)', fontSize:9, color:'var(--paper-3)', letterSpacing:'.22em', marginTop:2}}>{a.en} · {a.subtitle}</div>
              </div>
            )}

            {/* Open indicator */}
            {isOpen && <span style={{position:'absolute', bottom:-7, width:5, height:5, background:'var(--gold-bright)', borderRadius:'50%'}}/>}
          </button>
        );
      })}
    </div>
  );
};

// ---- DESKTOP WIDGETS ----
const Widget = ({ children, w=280, h='auto', style }) => (
  <div style={{
    width: w, height: h,
    background:'linear-gradient(135deg, rgba(20,16,12,.75), rgba(13,10,8,.6))',
    border:'1px solid var(--line)',
    backdropFilter:'blur(20px)',
    padding:18, position:'relative',
    boxShadow:'0 18px 40px rgba(0,0,0,.4)',
    ...style,
  }}>{children}</div>
);

const MantraWidget = () => {
  const mantras = [
    {cn:'方寸之間 · 千年寺廟在掌心復現', en:'A temple in your palm'},
    {cn:'七寶為核 · 眾材拱衛', en:'Seven gems · Many materials'},
    {cn:'34 年師承 · 自一九九一年起', en:'34 years of lineage'},
    {cn:'1mm 見方 · 心經 268 字', en:'268 characters in 1mm²'},
    {cn:'1:3520 · 436 億倍體積壓縮', en:'1:3520 ratio'},
  ];
  const [i, setI] = React.useState(0);
  React.useEffect(()=>{
    const t = setInterval(()=>setI(x=>(x+1)%mantras.length), 6000);
    return ()=>clearInterval(t);
  },[]);
  const m = mantras[i];
  return (
    <Widget w={360}>
      <div style={{fontFamily:'var(--mono)', fontSize:9, color:'var(--gold)', letterSpacing:'.3em', marginBottom:10}}>MANTRA · 今日語錄</div>
      <div key={i} style={{fontFamily:'var(--serif)', fontSize:18, fontWeight:500, color:'var(--gold-bright)', letterSpacing:'.12em', lineHeight:1.5,
        animation:'fadeIn .6s ease'}}>{m.cn}</div>
      <div style={{fontFamily:'var(--display)', fontSize:13, fontStyle:'italic', color:'var(--paper-3)', marginTop:10, letterSpacing:'.04em'}}>「{m.en}」</div>
      <div style={{display:'flex', gap:4, marginTop:14}}>
        {mantras.map((_,j)=>(<span key={j} style={{width:18, height:2, background: j===i?'var(--gold-bright)':'var(--line-strong)'}}/>))}
      </div>
    </Widget>
  );
};

const SealWidget = () => (
  <Widget w={250} style={{padding:24, display:'flex', flexDirection:'column', alignItems:'center', gap:8}}>
    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
      <KanjiSeal char="慈" size={44} color="var(--vermilion)"/>
      <KanjiSeal char="悲" size={44} color="var(--vermilion)"/>
      <KanjiSeal char="方" size={44} color="var(--gold)"/>
      <KanjiSeal char="寸" size={44} color="var(--gold)"/>
    </div>
    <div style={{fontFamily:'var(--mono)', fontSize:9, color:'var(--paper-3)', letterSpacing:'.3em', marginTop:12}}>SERIES SEAL · v1.0</div>
    <div style={{fontFamily:'var(--serif)', fontSize:13, color:'var(--paper-2)', letterSpacing:'.2em'}}>慈悲方寸 · 148p</div>
  </Widget>
);

const StatsWidget = () => {
  const stats = [
    {v:'27', l:'非遺工藝', c:'var(--gold-bright)'},
    {v:'20+',l:'手藝重鎮', c:'var(--paper)'},
    {v:'7', l:'跨境物源', c:'var(--jade)'},
    {v:'14',l:'歷史錨點', c:'var(--vermilion)'},
  ];
  return (
    <Widget w={280}>
      <div style={{fontFamily:'var(--mono)', fontSize:9, color:'var(--gold)', letterSpacing:'.3em', marginBottom:14}}>LIVE STATS · 智庫概況</div>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px 14px'}}>
        {stats.map((s,i)=>(
          <div key={i}>
            <div style={{fontFamily:'var(--display)', fontSize:34, fontWeight:500, color:s.c, lineHeight:.9, letterSpacing:'-.02em'}}>{s.v}</div>
            <div style={{fontFamily:'var(--sans)', fontSize:10.5, color:'var(--paper-3)', letterSpacing:'.16em', marginTop:4}}>{s.l}</div>
          </div>
        ))}
      </div>
    </Widget>
  );
};

const HotNodeWidget = ({ onOpenHeatmap }) => {
  // pick top 5 重镇
  const top = window.APP_DATA.nodes.filter(n=>n.type==='中枢'||n.type==='非遗重镇').slice(0,6);
  return (
    <Widget w={320}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <span style={{fontFamily:'var(--mono)', fontSize:9, color:'var(--gold)', letterSpacing:'.3em'}}>HOT NODES · 熱點地圖</span>
        <button onClick={onOpenHeatmap} style={{fontFamily:'var(--mono)', fontSize:9, color:'var(--gold-bright)', letterSpacing:'.22em',
          background:'transparent', border:'1px solid var(--line-strong)', padding:'2px 8px', cursor:'pointer'}}>OPEN →</button>
      </div>
      <div style={{marginTop:12}}>
        {top.map((n,i)=>(
          <div key={n.id} style={{display:'flex', alignItems:'baseline', gap:8, padding:'6px 0',
            borderTop: i===0?'none':'1px solid var(--line-bone)'}}>
            <span style={{fontFamily:'var(--mono)', fontSize:9, color:'var(--gold)', letterSpacing:'.18em', width:32}}>{n.id}</span>
            <span style={{flex:1, fontFamily:'var(--serif)', fontSize:12.5, color:'var(--paper)', fontWeight: n.type==='中枢'?600:400}}>{n.name}</span>
            <span style={{fontFamily:'var(--mono)', fontSize:8.5, color:'var(--paper-3)', letterSpacing:'.18em'}}>{n.type==='中枢'?'CORE':'NODE'}</span>
          </div>
        ))}
      </div>
    </Widget>
  );
};

// ---- SPOTLIGHT ----
const Spotlight = ({ onClose, onOpen }) => {
  const [q, setQ] = React.useState('');
  const [idx, setIdx] = React.useState(0);
  const inputRef = React.useRef(null);
  React.useEffect(()=>{ inputRef.current?.focus(); },[]);

  const results = React.useMemo(()=>{
    if (!q.trim()) {
      return window.APPS.slice(0,5).map(a => ({type:'APP', icon:a.seal, title:a.cn, sub:a.en+' · '+a.subtitle, action:()=>onOpen(a.id)}));
    }
    const D = window.APP_DATA;
    const matches = [];
    // apps
    window.APPS.forEach(a => {
      if (`${a.cn}${a.en}${a.subtitle}`.toLowerCase().includes(q.toLowerCase()))
        matches.push({type:'APP', icon:a.seal, title:a.cn, sub:a.en, action:()=>onOpen(a.id)});
    });
    D.crafts.forEach(c=>{
      if (`${c.name}${c.city}${c.spec}${c.material}`.includes(q))
        matches.push({type:'CRAFT', icon:c.id, title:c.name, sub:`${c.category} · ${c.city}`, action:()=>onOpen('genealogy')});
    });
    D.nodes.forEach(n=>{
      if (`${n.name}${n.craft}${n.role}`.includes(q))
        matches.push({type:'NODE', icon:n.id, title:n.name, sub:`${n.type} · ${n.craft}`, action:()=>onOpen('heatmap')});
    });
    D.works.forEach(w=>{
      if (`${w.name}${w.edition}${w.size}`.includes(q))
        matches.push({type:'WORK', icon:w.id, title:w.name, sub:`${w.edition} · ${w.size}`, action:()=>onOpen('works')});
    });
    D.materials.forEach(m=>{
      if (`${m.name}${m.source}${m.usage}`.includes(q))
        matches.push({type:'MAT', icon:m.id, title:m.name, sub:`${m.category} · ${m.source}`, action:()=>onOpen('materials')});
    });
    return matches.slice(0, 14);
  },[q]);

  const exec = (i) => { results[i]?.action(); onClose(); };

  return (
    <div onClick={onClose} style={{position:'fixed', inset:0, background:'rgba(5,4,3,.7)', backdropFilter:'blur(8px)', zIndex:1500,
      display:'flex', alignItems:'flex-start', justifyContent:'center', paddingTop:'12vh'}}>
      <div onClick={e=>e.stopPropagation()} style={{
        width:680, background:'linear-gradient(180deg, rgba(20,16,12,.97), rgba(13,10,8,.97))',
        border:'1px solid var(--line-strong)', boxShadow:'0 40px 100px rgba(0,0,0,.8), 0 0 0 1px rgba(232,199,115,.1)',
      }}>
        <div style={{display:'flex', alignItems:'center', gap:14, padding:'18px 22px', borderBottom:'1px solid var(--line)'}}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="9" cy="9" r="6" stroke="var(--gold)" strokeWidth="1.4"/>
            <path d="M13.5 13.5 L17 17" stroke="var(--gold)" strokeWidth="1.4"/>
          </svg>
          <input ref={inputRef} value={q} onChange={e=>{setQ(e.target.value); setIdx(0);}}
            onKeyDown={e=>{
              if (e.key==='Escape') onClose();
              if (e.key==='ArrowDown') { e.preventDefault(); setIdx(i=>Math.min(results.length-1, i+1)); }
              if (e.key==='ArrowUp')   { e.preventDefault(); setIdx(i=>Math.max(0, i-1)); }
              if (e.key==='Enter')     { e.preventDefault(); exec(idx); }
            }}
            placeholder="檢索 應用 · 工藝 · 重鎮 · 作品 · 材質…"
            style={{flex:1, background:'transparent', border:'none', outline:'none',
              fontFamily:'var(--serif)', fontSize:22, color:'var(--gold-bright)', letterSpacing:'.06em', fontWeight:500}}/>
          <span style={{fontFamily:'var(--mono)', fontSize:9, color:'var(--paper-3)', letterSpacing:'.32em'}}>ESC</span>
        </div>
        <div style={{maxHeight:'50vh', overflowY:'auto'}}>
          {results.length === 0 && (
            <div style={{padding:'40px', textAlign:'center', fontFamily:'var(--serif)', fontSize:14, color:'var(--paper-3)', letterSpacing:'.18em'}}>
              無匹配結果 · NO MATCHES
            </div>
          )}
          {results.map((r,i)=>(
            <button key={i} onMouseEnter={()=>setIdx(i)} onClick={()=>exec(i)}
              style={{width:'100%', display:'grid', gridTemplateColumns:'48px 60px 1fr 80px', alignItems:'center',
                gap:14, padding:'12px 22px', cursor:'pointer', border:'none', textAlign:'left',
                background: idx===i?'rgba(201,162,74,.14)':'transparent',
                borderLeft: idx===i?'2px solid var(--gold)':'2px solid transparent'}}>
              <span style={{width:32, height:32, border:'1px solid var(--gold)', display:'inline-flex', alignItems:'center', justifyContent:'center',
                fontFamily:'var(--serif)', fontSize:14, fontWeight:600, color:'var(--gold-bright)', background:'rgba(184,51,31,.12)'}}>{r.icon[0]}</span>
              <span style={{fontFamily:'var(--mono)', fontSize:9, color:'var(--gold)', letterSpacing:'.28em'}}>{r.type}</span>
              <div>
                <div style={{fontFamily:'var(--serif)', fontSize:14, color:'var(--paper)', fontWeight:500, letterSpacing:'.08em'}}>{r.title}</div>
                <div style={{fontFamily:'var(--mono)', fontSize:9.5, color:'var(--paper-3)', letterSpacing:'.18em', marginTop:2}}>{r.sub}</div>
              </div>
              <span style={{fontFamily:'var(--mono)', fontSize:9, color:'var(--paper-3)', letterSpacing:'.22em', textAlign:'right'}}>{idx===i?'↵ OPEN':''}</span>
            </button>
          ))}
        </div>
        <div style={{padding:'10px 22px', borderTop:'1px solid var(--line)', display:'flex', justifyContent:'space-between',
          fontFamily:'var(--mono)', fontSize:9, color:'var(--paper-3)', letterSpacing:'.24em'}}>
          <span>↑↓ 選擇　↵ 打開　ESC 退出</span>
          <span>{results.length} 結果</span>
        </div>
      </div>
    </div>
  );
};

window.MenuBar = MenuBar;
window.Dock = Dock;
window.MantraWidget = MantraWidget;
window.SealWidget = SealWidget;
window.StatsWidget = StatsWidget;
window.HotNodeWidget = HotNodeWidget;
window.Spotlight = Spotlight;
