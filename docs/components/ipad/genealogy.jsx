// Genealogy — 3-pane: filters + craft list + museum-label detail.

const IpGenealogy = ({ initialId, goto }) => {
  const D = window.APP_DATA;
  const [cat, setCat] = React.useState('全部');
  const [tier, setTier] = React.useState('全部');
  const [selId, setSelId] = React.useState(initialId || D.crafts[0].id);

  React.useEffect(()=>{ if (initialId) setSelId(initialId); }, [initialId]);

  const cats = ['全部', ...new Set(D.crafts.map(c=>c.category))];
  const tiers = ['全部','世界級','國家級','跨境'];
  const tierMap = {'全部':null,'世界級':'世界级','國家級':'国家级','跨境':'跨境'};
  const filtered = D.crafts.filter(c => {
    if (cat!=='全部' && c.category!==cat) return false;
    const t = tierMap[tier];
    if (t && !(c.level||'').includes(t)) return false;
    return true;
  });

  // Ensure selected is in filtered list, else pick first
  React.useEffect(()=>{
    if (!filtered.find(c=>c.id===selId) && filtered[0]) setSelId(filtered[0].id);
  }, [cat, tier]);

  const sel = D.crafts.find(c=>c.id===selId) || D.crafts[0];

  // related: nodes that match the craft's city/province
  const relatedNodes = D.nodes.filter(n => (sel.city||'').includes(n.name) || n.name.includes(sel.city) || (sel.name||'').includes(n.craft||'__never__'));
  // related: works that mention this craft
  const relatedWorks = D.works.filter(w => Object.values(w.crafts).some(v=>v) && (sel.works||'').includes(w.name.split('·')[0].split('(')[0].trim()));

  return (
    <div style={{flex:1, display:'flex', flexDirection:'column', overflow:'hidden'}}>
      {/* Filter strip */}
      <div style={{display:'flex', flexDirection:'column', gap:12, padding:'18px 32px',
        borderBottom:'1px solid var(--line)', flexShrink:0}}>
        <div style={{display:'flex', alignItems:'center', gap:14}}>
          <span style={{fontFamily:'var(--mono)', fontSize:10, color:'var(--paper-3)', letterSpacing:'.32em', flex:'0 0 96px'}}>CATEGORY</span>
          <div style={{display:'flex', flexWrap:'wrap', gap:6}}>
            {cats.map(c => <IpPill key={c} active={cat===c} onClick={()=>setCat(c)}
              count={c==='全部' ? D.crafts.length : D.crafts.filter(x=>x.category===c).length}>{c}</IpPill>)}
          </div>
        </div>
        <div style={{display:'flex', alignItems:'center', gap:14}}>
          <span style={{fontFamily:'var(--mono)', fontSize:10, color:'var(--paper-3)', letterSpacing:'.32em', flex:'0 0 96px'}}>TIER</span>
          <div style={{display:'flex', gap:6}}>
            {tiers.map(t => <IpPill key={t} active={tier===t} onClick={()=>setTier(t)}>{t}</IpPill>)}
          </div>
          <div style={{flex:1}}/>
          <span style={{fontFamily:'var(--mono)', fontSize:10, color:'var(--gold)', letterSpacing:'.3em'}}>
            VISIBLE · {filtered.length} / {D.crafts.length}
          </span>
        </div>
      </div>

      {/* Two-pane body */}
      <div style={{flex:1, display:'flex', overflow:'hidden'}}>
        {/* LIST */}
        <div style={{flex:'0 0 360px', borderRight:'1px solid var(--line)', overflow:'auto'}}>
          {filtered.map(c => {
            const active = selId === c.id;
            const catColor = window.CATEGORY_COLORS?.[c.category] || 'var(--gold)';
            return (
              <IpRow key={c.id} active={active} onClick={()=>setSelId(c.id)}
                height={86}
                left={<IpSeal char={c.name[0]} size={44} color={active?'var(--vermilion)':catColor}
                  bg={active?'var(--vermilion)':'transparent'} stroke={active?'var(--gold)':catColor}/>}
                primary={c.name}
                secondary={`${c.id} · ${c.category} · ${c.city.split('·')[0].split('+')[0]}`}
                right={<Tier level={c.level}/>}
              />
            );
          })}
        </div>

        {/* DETAIL — museum label */}
        <div style={{flex:1, overflow:'auto', padding:'34px 44px 60px', position:'relative'}}>
          {/* Big seal background */}
          <div style={{position:'absolute', right:36, top:30, opacity:.05, pointerEvents:'none', fontFamily:'var(--serif)', fontSize:340, fontWeight:700, color:'var(--vermilion)', lineHeight:.85, letterSpacing:0}}>
            {sel.name[0]}
          </div>

          <div style={{position:'relative', zIndex:1}}>
            {/* Header */}
            <div style={{display:'grid', gridTemplateColumns:'auto 1fr', gap:24, alignItems:'flex-start'}}>
              <IpSeal char={sel.name[0]} size={84} color="var(--vermilion)" bg="var(--vermilion)" stroke="var(--gold)"/>
              <div>
                <div style={{display:'flex', alignItems:'baseline', gap:14, marginBottom:6}}>
                  <span style={{fontFamily:'var(--mono)', fontSize:11, color:'var(--gold)', letterSpacing:'.36em'}}>{sel.id} · CRAFT</span>
                  <span style={{fontFamily:'var(--mono)', fontSize:10, color:'var(--paper-3)', letterSpacing:'.26em'}}>{sel.category}</span>
                </div>
                <h2 style={{fontFamily:'var(--serif)', fontSize:48, fontWeight:600, color:'var(--gold-bright)', letterSpacing:'.1em', lineHeight:1.05, marginBottom:14}}>{sel.name}</h2>
                <div style={{display:'flex', gap:8, flexWrap:'wrap', alignItems:'center'}}>
                  <Tier level={sel.level}/>
                  <span style={{fontFamily:'var(--serif)', fontSize:14, color:'var(--paper-2)', letterSpacing:'.1em'}}>{sel.province}</span>
                  <span style={{fontFamily:'var(--mono)', fontSize:10, color:'var(--paper-3)', letterSpacing:'.22em'}}>·</span>
                  <span style={{fontFamily:'var(--serif)', fontSize:14, color:'var(--paper)', letterSpacing:'.1em'}}>{sel.city}</span>
                </div>
              </div>
            </div>

            {/* Origin / Peak callout */}
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:0, marginTop:34,
              border:'1px solid var(--line-strong)'}}>
              <div style={{padding:'18px 22px', borderRight:'1px solid var(--line-strong)'}}>
                <div style={{fontFamily:'var(--mono)', fontSize:9.5, color:'var(--paper-3)', letterSpacing:'.34em'}}>ORIGIN · 起源</div>
                <div style={{fontFamily:'var(--serif)', fontSize:18, color:'var(--gold-bright)', fontWeight:500, marginTop:6, letterSpacing:'.1em'}}>{sel.origin}</div>
              </div>
              <div style={{padding:'18px 22px'}}>
                <div style={{fontFamily:'var(--mono)', fontSize:9.5, color:'var(--paper-3)', letterSpacing:'.34em'}}>PEAK · 鼎盛</div>
                <div style={{fontFamily:'var(--serif)', fontSize:18, color:'var(--gold-bright)', fontWeight:500, marginTop:6, letterSpacing:'.1em'}}>{sel.peak}</div>
              </div>
            </div>

            {/* Spec — featured */}
            <div style={{marginTop:30, padding:'24px 28px',
              background:'linear-gradient(135deg, rgba(201,162,74,.06), transparent 70%)',
              border:'1px solid var(--line-strong)', borderLeft:'3px solid var(--gold)'}}>
              <div style={{fontFamily:'var(--mono)', fontSize:10, color:'var(--gold)', letterSpacing:'.34em'}}>TECHNIQUE · 技藝特徵</div>
              <div style={{fontFamily:'var(--serif)', fontSize:18, color:'var(--paper)', lineHeight:1.85, marginTop:10, letterSpacing:'.04em'}}>{sel.spec}</div>
            </div>

            {/* Fields */}
            <div style={{marginTop:14}}>
              <IpField label="傳承體系" en="LINEAGE" value={sel.lineage}/>
              <IpField label="項目角色" en="PROJECT ROLE" value={sel.role}/>
              <IpField label="主要作品" en="MAIN WORKS" value={sel.works}/>
              <IpField label="材質輔料" en="MATERIALS" value={sel.material}/>
            </div>

            {/* Related lookup */}
            {relatedNodes.length > 0 && (
              <div style={{marginTop:28}}>
                <div style={{fontFamily:'var(--mono)', fontSize:10, color:'var(--gold)', letterSpacing:'.32em', marginBottom:10}}>
                  RELATED · 工藝重鎮 · {relatedNodes.length}
                </div>
                <div style={{display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:10}}>
                  {relatedNodes.slice(0,4).map(n => (
                    <button key={n.id} onClick={()=>goto({section:'map', id:n.id})}
                      style={{padding:'14px 16px', cursor:'pointer', textAlign:'left',
                        background:'rgba(0,0,0,.3)', border:'1px solid var(--line)',
                        display:'flex', alignItems:'center', gap:14, minHeight:60}}>
                      <IpSeal char={n.name[0]} size={36} color="var(--gold)" stroke="var(--gold)" bg="rgba(201,162,74,.08)"/>
                      <div style={{flex:1}}>
                        <div style={{fontFamily:'var(--serif)', fontSize:14, color:'var(--paper)', fontWeight:500, letterSpacing:'.08em'}}>{n.name}</div>
                        <div style={{fontFamily:'var(--mono)', fontSize:9, color:'var(--paper-3)', letterSpacing:'.22em', marginTop:3}}>{n.type} · {n.region}</div>
                      </div>
                      <svg width="10" height="14" viewBox="0 0 10 14"><path d="M2 2 L8 7 L2 12" fill="none" stroke="var(--gold)" strokeWidth="1.4"/></svg>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Footer cartouche */}
            <div style={{marginTop:40, padding:'18px 0', borderTop:'1px solid var(--line)', display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
              <span style={{fontFamily:'var(--mono)', fontSize:9.5, color:'var(--paper-3)', letterSpacing:'.36em'}}>END OF RECORD · {sel.id}</span>
              <span style={{fontFamily:'var(--display)', fontSize:13, fontStyle:'italic', color:'var(--gold)', letterSpacing:'.06em'}}>「{sel.name}」</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

window.IpGenealogy = IpGenealogy;
