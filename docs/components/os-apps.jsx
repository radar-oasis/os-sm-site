// Apps catalog — each is mounted inside an OSWindow.

// Lightweight content components for new OS-native apps:

// 1. MaterialsApp — 21 materials grid
const MaterialsApp = ({ query, filterLevel }) => {
  const D = window.APP_DATA;
  const filtered = D.materials.filter(m => !query || `${m.name}${m.source}${m.usage}${m.spec}`.includes(query));
  const [sel, setSel] = React.useState(filtered[0]||D.materials[0]);
  return (
    <div style={{display:'grid', gridTemplateColumns:'1fr 320px', gap:14}}>
      <div>
        <Divider label={`MATERIALS · 21 · ${filtered.length} VISIBLE`} dense/>
        <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:0, border:'1px solid var(--line)', marginTop:12}}>
          {filtered.map((m,i)=>{
            const isCore = m.category && m.category.includes('七宝');
            const active = sel?.id===m.id;
            return (
              <button key={m.id} onClick={()=>setSel(m)} style={{
                textAlign:'left', cursor:'pointer', border:'none', padding:'12px',
                borderRight:'1px solid var(--line-bone)', borderBottom:'1px solid var(--line-bone)',
                background: active ? 'rgba(201,162,74,.12)' : (isCore ? 'rgba(184,51,31,.06)' : 'transparent'),
              }}>
                {isCore && <span style={{display:'block', fontFamily:'var(--mono)', fontSize:8, color:'var(--vermilion)', letterSpacing:'.2em', marginBottom:4}}>★ 七寶</span>}
                <div style={{fontFamily:'var(--mono)', fontSize:9, color:'var(--gold)', letterSpacing:'.2em'}}>{m.id}</div>
                <div style={{fontFamily:'var(--serif)', fontSize:14, color:'var(--paper)', fontWeight:600, letterSpacing:'.06em', marginTop:3}}>{m.name}</div>
                <div style={{fontFamily:'var(--serif)', fontSize:11, color:'var(--paper-3)', marginTop:4, lineHeight:1.4}}>{(m.source||'').slice(0,30)}</div>
              </button>
            );
          })}
        </div>
      </div>
      <aside style={{border:'1px solid var(--gold)', padding:14, background:'rgba(184,51,31,.04)', alignSelf:'start'}}>
        <div style={{fontFamily:'var(--mono)', fontSize:9.5, color:'var(--gold)', letterSpacing:'.3em'}}>MATERIAL · {sel.id}</div>
        <h3 style={{fontFamily:'var(--serif)', fontSize:24, color:'var(--gold-bright)', fontWeight:600, letterSpacing:'.08em', marginTop:6}}>{sel.name}</h3>
        <div style={{margin:'14px 0', height:1, background:'linear-gradient(to right, var(--gold), transparent)'}}/>
        {[
          {l:'類別', v:sel.category},
          {l:'物源 · SOURCE', v:sel.source},
          {l:'歷史路徑 · PATH', v:sel.path},
          {l:'應用 · USAGE', v:sel.usage},
          {l:'規格 · SPEC', v:sel.spec},
          {l:'對應工藝 · CRAFT', v:sel.craft},
        ].map((f,i)=>(
          <div key={i} style={{padding:'8px 0', borderBottom:'1px solid var(--line-bone)'}}>
            <div style={{fontFamily:'var(--mono)', fontSize:9, color:'var(--paper-3)', letterSpacing:'.3em', marginBottom:3}}>{f.l}</div>
            <div style={{fontFamily:'var(--serif)', fontSize:12.5, color:'var(--paper)', lineHeight:1.6}}>{f.v}</div>
          </div>
        ))}
      </aside>
    </div>
  );
};

// 2. CrossBorderApp — 10 cross-border nodes with line color
const CrossBorderApp = ({ query }) => {
  const D = window.APP_DATA;
  const lines = ['全部', '丝路陆路', '南传线', '藏传线', '源头', '海上丝路'];
  const [line, setLine] = React.useState('全部');
  const filtered = D.cross.filter(c => {
    if (line!=='全部' && !c.line.includes(line.replace('陆路','').replace('海上',''))) return false;
    if (query && !`${c.country}${c.oldName}${c.item}${c.path}`.includes(query)) return false;
    return true;
  });
  return (
    <div>
      <Divider label={`CROSS-BORDER · 跨境物源 · 10 NODES`} dense/>
      <div style={{display:'flex', gap:6, marginTop:12, marginBottom:12, flexWrap:'wrap'}}>
        {lines.map(l=>(
          <button key={l} onClick={()=>setLine(l)} style={{
            padding:'4px 10px', cursor:'pointer',
            background: line===l ? 'var(--gold)' : 'transparent',
            color: line===l ? 'var(--ink)' : 'var(--paper-2)',
            border:`1px solid ${line===l?'var(--gold)':'var(--line-strong)'}`,
            fontFamily:'var(--serif)', fontSize:11, letterSpacing:'.12em',
          }}>{l}</button>
        ))}
      </div>
      <div style={{border:'1px solid var(--line)', background:'rgba(0,0,0,.3)'}}>
        <div style={{display:'grid', gridTemplateColumns:'50px 120px 1fr 1fr 1.5fr 100px', background:'rgba(201,162,74,.06)', borderBottom:'1px solid var(--line)'}}>
          {['#','現屬國','古地名','溯源線','輸入物 · 路徑','年代'].map((h,i)=>(
            <div key={i} style={{padding:'10px', fontFamily:'var(--mono)', fontSize:9.5, color:'var(--gold)', letterSpacing:'.22em'}}>{h}</div>
          ))}
        </div>
        {filtered.map((c,i)=>{
          const lineColor = c.line.includes('絲路')||c.line.includes('丝路')?'var(--gold)':c.line.includes('藏')?'var(--vermilion)':c.line.includes('南')?'var(--jade)':'var(--bone)';
          return (
            <div key={i} style={{display:'grid', gridTemplateColumns:'50px 120px 1fr 1fr 1.5fr 100px',
              borderBottom: i<filtered.length-1?'1px solid var(--line-bone)':'none', alignItems:'center'}}>
              <div style={{padding:'10px', fontFamily:'var(--mono)', fontSize:10, color:'var(--paper-3)', letterSpacing:'.18em'}}>{c.id}</div>
              <div style={{padding:'10px', fontFamily:'var(--serif)', fontSize:12, color:'var(--paper)'}}>{c.country}</div>
              <div style={{padding:'10px', fontFamily:'var(--serif)', fontSize:12, color:'var(--paper-2)'}}>{c.oldName}</div>
              <div style={{padding:'10px', display:'flex', alignItems:'center', gap:6}}>
                <span style={{width:18, height:1.5, background:lineColor}}/>
                <span style={{fontFamily:'var(--mono)', fontSize:9.5, color:lineColor, letterSpacing:'.15em'}}>{c.line}</span>
              </div>
              <div style={{padding:'10px', fontFamily:'var(--serif)', fontSize:11.5, color:'var(--gold-bright)', lineHeight:1.4}}>
                {c.item}
                <div style={{fontFamily:'var(--mono)', fontSize:8.5, color:'var(--paper-3)', letterSpacing:'.15em', marginTop:3}}>{c.path}</div>
              </div>
              <div style={{padding:'10px', fontFamily:'var(--mono)', fontSize:10, color:'var(--paper-3)', letterSpacing:'.18em'}}>{c.era}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 3. MetricsApp — 28 KPIs
const MetricsApp = ({ query }) => {
  const D = window.APP_DATA;
  const filtered = D.metrics.filter(m => !query || `${m.category}${m.name}${m.value}${m.note}`.includes(query));
  const byCat = {};
  filtered.forEach(m => { (byCat[m.category]=byCat[m.category]||[]).push(m); });
  return (
    <div>
      <Divider label={`METRICS · 28 KPI · ${filtered.length} VISIBLE`} dense/>
      <div style={{display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:14, marginTop:14}}>
        {Object.entries(byCat).map(([cat, ms])=>(
          <div key={cat} style={{border:'1px solid var(--line)', background:'rgba(0,0,0,.3)'}}>
            <div style={{padding:'10px 14px', borderBottom:'1px solid var(--line)', background:'rgba(201,162,74,.06)',
              display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <span style={{fontFamily:'var(--serif)', fontSize:13, color:'var(--gold-bright)', fontWeight:600, letterSpacing:'.12em'}}>{cat}</span>
              <span style={{fontFamily:'var(--mono)', fontSize:9.5, color:'var(--gold)', letterSpacing:'.22em'}}>{ms.length} ITEMS</span>
            </div>
            {ms.map((m,i)=>(
              <div key={i} style={{display:'grid', gridTemplateColumns:'1fr auto', gap:14, padding:'10px 14px',
                borderBottom: i<ms.length-1?'1px solid var(--line-bone)':'none', alignItems:'center'}}>
                <div>
                  <div style={{fontFamily:'var(--serif)', fontSize:12.5, color:'var(--paper)'}}>{m.name}</div>
                  <div style={{fontFamily:'var(--mono)', fontSize:9, color:'var(--paper-3)', letterSpacing:'.15em', marginTop:2}}>{m.note}</div>
                </div>
                <div style={{fontFamily:'var(--display)', fontSize:22, color:'var(--gold-bright)', fontWeight:500, whiteSpace:'nowrap'}}>
                  {m.value}<span style={{fontFamily:'var(--mono)', fontSize:9, color:'var(--paper-3)', marginLeft:4, letterSpacing:'.15em'}}>{m.unit}</span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// 4. TripleApp — 60-row triple quick-reference table
const TripleApp = ({ query }) => {
  const D = window.APP_DATA;
  const cats = ['ALL', ...new Set(D.triple.map(t=>t.category))];
  const [cat, setCat] = React.useState('ALL');
  const filtered = D.triple.filter(t => {
    if (cat!=='ALL' && t.category!==cat) return false;
    if (query && !`${t.craft}${t.work}${t.place}${t.anchor}`.includes(query)) return false;
    return true;
  });
  return (
    <div>
      <Divider label={`QUICK REFERENCE · 工藝 → 作品 → 城市 · ${filtered.length} ROWS`} dense/>
      <div style={{display:'flex', gap:5, flexWrap:'wrap', margin:'12px 0'}}>
        {cats.map(c=>(
          <button key={c} onClick={()=>setCat(c)} style={{
            padding:'4px 9px', cursor:'pointer',
            background: cat===c ? 'var(--gold)' : 'transparent',
            color: cat===c ? 'var(--ink)' : 'var(--paper-2)',
            border:`1px solid ${cat===c?'var(--gold)':'var(--line-strong)'}`,
            fontFamily:'var(--serif)', fontSize:11, letterSpacing:'.1em',
          }}>{c}</button>
        ))}
      </div>
      <div style={{border:'1px solid var(--line)'}}>
        <div style={{display:'grid', gridTemplateColumns:'80px 1fr 1.3fr 1.2fr 2fr', background:'rgba(201,162,74,.06)', borderBottom:'1px solid var(--line)'}}>
          {['類別','工藝','代表作品','重鎮 / 物源','講解錨點'].map((h,i)=>(
            <div key={i} style={{padding:'10px', fontFamily:'var(--mono)', fontSize:9.5, color:'var(--gold)', letterSpacing:'.22em'}}>{h}</div>
          ))}
        </div>
        {filtered.map((t,i)=>(
          <div key={i} style={{display:'grid', gridTemplateColumns:'80px 1fr 1.3fr 1.2fr 2fr', borderBottom: i<filtered.length-1?'1px solid var(--line-bone)':'none'}}>
            <div style={{padding:'10px', fontFamily:'var(--mono)', fontSize:9.5, color:'var(--paper-3)', letterSpacing:'.18em'}}>{t.category}</div>
            <div style={{padding:'10px', fontFamily:'var(--serif)', fontSize:12, color:'var(--gold-bright)', fontWeight:500}}>{t.craft}</div>
            <div style={{padding:'10px', fontFamily:'var(--serif)', fontSize:12, color:'var(--paper)'}}>{t.work}</div>
            <div style={{padding:'10px', fontFamily:'var(--serif)', fontSize:11.5, color:'var(--paper-2)'}}>{t.place}</div>
            <div style={{padding:'10px', fontFamily:'var(--serif)', fontSize:11.5, color:'var(--paper-3)', lineHeight:1.5}}>{t.anchor}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// App catalog. Each entry maps to a window definition.
const APPS = [
  { id:'overview',  seal:'總', cn:'總覽',     en:'OVERVIEW',     subtitle:'數據駕駛艙', defaultSize:{w:1180, h:720}, defaultPos:{x:100, y:80},
    accent:'var(--gold-bright)', glyph:'⌂',
    render: () => <Overview goTab={()=>{}} query=""/> },
  { id:'heatmap',   seal:'圖', cn:'熱點地圖', en:'HEAT MAP',     subtitle:'27 節點地理智庫', defaultSize:{w:1200, h:780}, defaultPos:{x:140, y:110},
    accent:'var(--vermilion)', glyph:'◉',
    render: ({query, filterLevel}) => <HeatMapPanel query={query} filterLevel={filterLevel}/> },
  { id:'genealogy', seal:'譜', cn:'工藝譜系', en:'GENEALOGY',    subtitle:'27 項非遺工藝', defaultSize:{w:1180, h:720}, defaultPos:{x:170, y:140},
    accent:'var(--gold)', glyph:'❋',
    render: ({query, filterLevel}) => <Genealogy query={query} filterLevel={filterLevel}/> },
  { id:'works',     seal:'作', cn:'作品矩陣', en:'WORKS MATRIX', subtitle:'33 件 × 27 工藝', defaultSize:{w:1280, h:720}, defaultPos:{x:200, y:170},
    accent:'var(--jade)', glyph:'▦',
    render: ({query}) => <Works query={query}/> },
  { id:'timeline',  seal:'時', cn:'時間舍利', en:'TIMELINE',     subtitle:'公元 386 → 2026', defaultSize:{w:1200, h:760}, defaultPos:{x:230, y:200},
    accent:'var(--vermilion-deep)', glyph:'⌛',
    render: ({query}) => <Timeline query={query}/> },
  { id:'materials', seal:'材', cn:'材質物源', en:'MATERIALS',    subtitle:'七寶核心 + 眾材拱衛', defaultSize:{w:1040, h:680}, defaultPos:{x:260, y:230},
    accent:'#a8462e', glyph:'◈',
    render: ({query}) => <MaterialsApp query={query}/> },
  { id:'cross',     seal:'境', cn:'跨境物源', en:'CROSS-BORDER', subtitle:'絲路 · 南傳 · 藏傳', defaultSize:{w:1100, h:600}, defaultPos:{x:290, y:130},
    accent:'#9b7d4a', glyph:'⟁',
    render: ({query}) => <CrossBorderApp query={query}/> },
  { id:'metrics',   seal:'數', cn:'關鍵指標', en:'METRICS',      subtitle:'28 KPI 速查', defaultSize:{w:1080, h:680}, defaultPos:{x:320, y:160},
    accent:'#6b8aa0', glyph:'≡',
    render: ({query}) => <MetricsApp query={query}/> },
  { id:'triple',    seal:'聯', cn:'三聯速查', en:'TRIPLE-TABLE', subtitle:'工藝 → 作品 → 城市', defaultSize:{w:1240, h:700}, defaultPos:{x:350, y:190},
    accent:'#7a4a8c', glyph:'⌬',
    render: ({query}) => <TripleApp query={query}/> },
];

window.APPS = APPS;
window.MaterialsApp = MaterialsApp;
window.CrossBorderApp = CrossBorderApp;
window.MetricsApp = MetricsApp;
window.TripleApp = TripleApp;
