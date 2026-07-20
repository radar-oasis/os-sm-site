// Genealogy table — 27 crafts with rich filtering and drill-in.

const Genealogy = ({ query, filterLevel }) => {
  const D = window.APP_DATA;
  const [selected, setSelected] = React.useState(D.crafts[0]);
  const [catFilter, setCatFilter] = React.useState('ALL');

  const cats = ['ALL', ...new Set(D.crafts.map(c=>c.category))];
  const filtered = D.crafts.filter(c=>{
    if (catFilter!=='ALL' && c.category!==catFilter) return false;
    if (filterLevel!=='ALL' && !(c.level||'').includes(filterLevel)) return false;
    if (query && !`${c.name}${c.city}${c.spec}${c.role}${c.material}${c.works}`.includes(query)) return false;
    return true;
  });

  return (
    <div style={{display:'grid', gridTemplateColumns:'1fr 380px', gap:18, paddingTop:18}}>
      <div>
        <Divider label={`GENEALOGY · 27 CRAFTS · ${filtered.length} VISIBLE`}/>

        {/* Category pills */}
        <div style={{display:'flex', flexWrap:'wrap', gap:6, marginBottom:12}}>
          {cats.map(c=>(
            <button key={c} onClick={()=>setCatFilter(c)} style={{
              padding:'5px 10px', cursor:'pointer',
              background: catFilter===c ? 'var(--gold)' : 'rgba(255,255,255,.03)',
              color: catFilter===c ? 'var(--ink)' : 'var(--paper-2)',
              border:`1px solid ${catFilter===c?'var(--gold)':'var(--line-strong)'}`,
              fontFamily:'var(--serif)', fontSize:11.5, letterSpacing:'.1em', fontWeight: catFilter===c?600:400,
            }}>
              {c}
              <span style={{marginLeft:6, opacity:.6, fontFamily:'var(--mono)', fontSize:9}}>
                {c==='ALL' ? D.crafts.length : D.crafts.filter(x=>x.category===c).length}
              </span>
            </button>
          ))}
        </div>

        {/* Header row */}
        <div style={{display:'grid', gridTemplateColumns:'48px 1.5fr 1fr 0.8fr 1.2fr 2fr', background:'rgba(201,162,74,.06)', borderTop:'1px solid var(--line)', borderBottom:'1px solid var(--line)'}}>
          {['編號','工藝名稱','類別 · 等級','所在地','技藝特徵','應用作品 / 材質'].map((h,i)=>(
            <div key={i} style={{padding:'10px 12px', fontFamily:'var(--mono)', fontSize:10, color:'var(--gold)', letterSpacing:'.25em'}}>{h}</div>
          ))}
        </div>

        {/* Rows */}
        {filtered.map((c,i)=>{
          const active = selected?.id===c.id;
          const catColor = window.CATEGORY_COLORS[c.category]||'var(--gold)';
          return (
            <button key={c.id} onClick={()=>setSelected(c)} style={{
              display:'grid', gridTemplateColumns:'48px 1.5fr 1fr 0.8fr 1.2fr 2fr',
              width:'100%', textAlign:'left', cursor:'pointer',
              background: active ? 'rgba(201,162,74,.08)' : 'transparent',
              border:'none', borderBottom:'1px solid var(--line-bone)',
              borderLeft: active ? '2px solid var(--gold)' : '2px solid transparent',
              padding:0
            }}>
              <div style={{padding:'12px', fontFamily:'var(--mono)', fontSize:10, color:'var(--gold)', letterSpacing:'.18em'}}>{c.id}</div>
              <div style={{padding:'12px'}}>
                <div style={{fontFamily:'var(--serif)', fontSize:14, color: active?'var(--gold-bright)':'var(--paper)', fontWeight:500, letterSpacing:'.06em'}}>{c.name}</div>
                <div style={{fontFamily:'var(--mono)', fontSize:9, color:'var(--paper-3)', letterSpacing:'.18em', marginTop:2}}>{c.origin} · {c.peak.slice(0,12)}</div>
              </div>
              <div style={{padding:'12px', display:'flex', flexDirection:'column', gap:4, alignItems:'flex-start'}}>
                <span style={{display:'inline-flex', alignItems:'center', gap:6, fontFamily:'var(--serif)', fontSize:11.5, color:'var(--paper-2)'}}>
                  <span style={{width:6, height:6, background:catColor}}/>{c.category}
                </span>
                <Tag dense>{c.level}</Tag>
              </div>
              <div style={{padding:'12px', fontFamily:'var(--serif)', fontSize:11.5, color:'var(--paper-2)'}}>{c.province}<br/><span style={{color:'var(--paper-3)', fontSize:10.5}}>{c.city}</span></div>
              <div style={{padding:'12px', fontFamily:'var(--serif)', fontSize:11, color:'var(--paper-3)', lineHeight:1.5}}>{(c.spec||'').slice(0,60)}…</div>
              <div style={{padding:'12px', fontFamily:'var(--serif)', fontSize:11, color:'var(--paper-2)', lineHeight:1.5}}>
                <span style={{color:'var(--gold)', fontSize:10, fontFamily:'var(--mono)', letterSpacing:'.18em'}}>WORKS</span> {(c.works||'').slice(0,46)}<br/>
                <span style={{color:'var(--gold)', fontSize:10, fontFamily:'var(--mono)', letterSpacing:'.18em'}}>MAT.</span> {(c.material||'').slice(0,40)}
              </div>
            </button>
          );
        })}
      </div>

      {/* Detail */}
      {selected && (
        <aside style={{border:'1px solid var(--line)', background:'rgba(0,0,0,.4)', padding:20, alignSelf:'start', position:'sticky', top:140}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:8}}>
            <div>
              <div style={{fontFamily:'var(--mono)', fontSize:9.5, color:'var(--gold)', letterSpacing:'.3em'}}>CRAFT · {selected.id}</div>
              <h2 style={{fontFamily:'var(--serif)', fontSize:32, color:'var(--gold-bright)', fontWeight:600, letterSpacing:'.08em', marginTop:6}}>{selected.name}</h2>
            </div>
            <KanjiSeal char={selected.name[0]} size={48} color="var(--vermilion-deep)"/>
          </div>
          <div style={{display:'flex', flexWrap:'wrap', gap:6, marginTop:10}}>
            <Tag>{selected.level}</Tag>
            <Tag color="mute">{selected.category}</Tag>
            <Tag color="mute">{selected.province}</Tag>
          </div>

          <div style={{margin:'18px 0', height:1, background:'linear-gradient(to right, var(--gold), transparent)'}}/>

          {[
            {l:'產區 · CITY', v:selected.city},
            {l:'起源 · ORIGIN', v:selected.origin},
            {l:'鼎盛 · PEAK', v:selected.peak},
            {l:'技藝特徵 · SPEC', v:selected.spec},
            {l:'傳承體系 · LINEAGE', v:selected.lineage},
            {l:'項目角色 · ROLE', v:selected.role},
            {l:'主要作品 · WORKS', v:selected.works},
            {l:'材質 · MATERIAL', v:selected.material},
          ].map((f,i)=>(
            <div key={i} style={{padding:'10px 0', borderBottom:'1px solid var(--line-bone)'}}>
              <div style={{fontFamily:'var(--mono)', fontSize:9, color:'var(--paper-3)', letterSpacing:'.3em', marginBottom:4}}>{f.l}</div>
              <div style={{fontFamily:'var(--serif)', fontSize:12.5, color:'var(--paper)', lineHeight:1.65}}>{f.v}</div>
            </div>
          ))}
        </aside>
      )}
    </div>
  );
};

window.Genealogy = Genealogy;
