// Timeline tab — vertical stele-style layout with 14 historical anchors.

const Timeline = ({ query }) => {
  const D = window.APP_DATA;
  const [selected, setSelected] = React.useState(D.timeline[D.timeline.length-1]);

  const year = (s) => {
    const m = (s||'').match(/\d{3,4}/g);
    if (!m) return 2000;
    return parseInt(m[0]);
  };

  // Group eras into dynasties for visual chaptering
  const epoch = (y) => {
    if (y < 600) return {k:'六朝',  c:'#7a6a55'};
    if (y < 900) return {k:'隋唐',  c:'#c9a24a'};
    if (y < 1280) return {k:'宋遼', c:'#9b7d4a'};
    if (y < 1370) return {k:'元',   c:'#7a4a8c'};
    if (y < 1645) return {k:'明',   c:'#c2541b'};
    if (y < 1912) return {k:'清',   c:'#a8462e'};
    if (y < 2010) return {k:'近現代',c:'#6b8aa0'};
    return {k:'當代', c:'#e8c773'};
  };

  // Compute relative density bar (where in 1640-year span)
  const yMin = 380, yMax = 2030;
  const densPos = y => ((y - yMin)/(yMax - yMin) * 100);

  return (
    <div style={{paddingTop:18}}>
      <Divider label="TIMELINE · 千年「隨身信仰」實物錨點 · 公元 386 → 2026"/>

      {/* Density mini-axis at top */}
      <div style={{position:'relative', padding:'12px 0 28px', borderBottom:'1px solid var(--line-bone)', marginBottom:24}}>
        <div style={{fontFamily:'var(--mono)', fontSize:9.5, color:'var(--paper-3)', letterSpacing:'.3em', marginBottom:14}}>DENSITY MAP · 1640 年跨度 · 14 件實物錨點</div>
        <div style={{position:'relative', height:28}}>
          <div style={{position:'absolute', top:14, left:0, right:0, height:1, background:'linear-gradient(to right, transparent, var(--gold) 8%, var(--gold) 92%, var(--vermilion))'}}/>
          {[400,600,800,1000,1200,1400,1600,1800,2000].map(y=>(
            <div key={y} style={{position:'absolute', left:densPos(y)+'%', top:8}}>
              <div style={{width:1, height:14, background:'var(--gold)', opacity:.4}}/>
              <div style={{fontFamily:'var(--mono)', fontSize:9, color:'var(--paper-3)', letterSpacing:'.18em', transform:'translateX(-50%)', marginTop:4}}>{y}</div>
            </div>
          ))}
          {D.timeline.map((t,i)=>{
            const y = year(t.year);
            const sel = selected?.id === t.id;
            const ep = epoch(y);
            return (
              <div key={t.id} onClick={()=>setSelected(t)}
                title={`${t.era} · ${t.year}`}
                style={{position:'absolute', left:densPos(y)+'%', top:8, transform:'translateX(-50%)',
                  cursor:'pointer', zIndex: sel?5:2}}>
                <div style={{
                  width: sel?13:9, height: sel?13:9, borderRadius:'50%',
                  background: sel?'var(--gold-bright)':ep.c,
                  boxShadow: sel?'0 0 14px rgba(232,199,115,.9)':'0 0 0 2px var(--ink)',
                  marginTop: sel?-2:0, marginLeft: sel?-2:0,
                }}/>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:32}}>
        {/* LEFT — vertical chronicle */}
        <div>
          <Divider label="CHRONICLE · 14 ERAS · 公元 386 → 2026" dense/>
          <div style={{position:'relative', marginTop:18}}>
            {/* central spine */}
            <div style={{position:'absolute', left:54, top:8, bottom:8, width:1,
              background:'linear-gradient(to bottom, var(--gold), var(--vermilion))', opacity:.6}}/>
            {D.timeline.map((t,i)=>{
              const y = year(t.year);
              const ep = epoch(y);
              const sel = selected?.id === t.id;
              return (
                <div key={t.id} onClick={()=>setSelected(t)}
                  style={{position:'relative', display:'grid', gridTemplateColumns:'108px 1fr',
                    gap:18, padding:'14px 0', cursor:'pointer',
                    borderBottom: i<D.timeline.length-1 ? '1px solid var(--line-bone)' : 'none',
                    background: sel ? 'linear-gradient(to right, rgba(201,162,74,.08), transparent)' : 'transparent',
                  }}>
                  {/* year column */}
                  <div style={{textAlign:'right', paddingRight:8}}>
                    <div style={{fontFamily:'var(--display)', fontSize: sel?28:22, fontWeight:500, color: sel?'var(--gold-bright)':'var(--paper)', lineHeight:1, letterSpacing:'.02em'}}>
                      {t.year.split('-')[0].split('→')[0]}
                    </div>
                    <div style={{fontFamily:'var(--mono)', fontSize:9, color:'var(--paper-3)', letterSpacing:'.2em', marginTop:4}}>{t.id}</div>
                    <div style={{display:'inline-flex', alignItems:'center', gap:4, marginTop:8, padding:'2px 6px',
                      border:`1px solid ${ep.c}`, color:ep.c, fontFamily:'var(--serif)', fontSize:10, letterSpacing:'.2em'}}>{ep.k}</div>
                  </div>
                  {/* dot on spine */}
                  <div style={{position:'absolute', left:46, top:24, zIndex:2}}>
                    <div style={{width:16, height:16, borderRadius:'50%',
                      background: sel?'var(--gold-bright)':'var(--ink)',
                      border:`2px solid ${sel?'var(--gold-bright)':'var(--gold)'}`,
                      boxShadow: sel?'0 0 14px rgba(232,199,115,.7)':'none'}}/>
                  </div>
                  {/* content */}
                  <div style={{paddingLeft:22}}>
                    <div style={{fontFamily:'var(--serif)', fontSize: sel?17:15, fontWeight:600, color: sel?'var(--gold-bright)':'var(--paper)', letterSpacing:'.08em'}}>{t.era}</div>
                    <div style={{fontFamily:'var(--serif)', fontSize:12.5, color:'var(--paper-2)', marginTop:4, lineHeight:1.55}}>{t.object}</div>
                    <div style={{fontFamily:'var(--mono)', fontSize:9.5, color:'var(--paper-3)', letterSpacing:'.18em', marginTop:6}}>{t.place}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT — selected detail + cross-border + materials */}
        <div style={{display:'flex', flexDirection:'column', gap:24}}>
          {selected && (
            <div style={{border:'1px solid var(--gold)', padding:'24px', background:
              'linear-gradient(135deg, rgba(201,162,74,.06), rgba(184,51,31,.04))', position:'sticky', top:140}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
                <div>
                  <div style={{fontFamily:'var(--mono)', fontSize:10, color:'var(--gold)', letterSpacing:'.32em'}}>ERA · {selected.id}</div>
                  <h2 style={{fontFamily:'var(--serif)', fontSize:30, color:'var(--gold-bright)', fontWeight:600, marginTop:8, letterSpacing:'.1em'}}>{selected.era}</h2>
                  <div style={{fontFamily:'var(--mono)', fontSize:11, color:'var(--paper-3)', letterSpacing:'.18em', marginTop:4}}>{selected.year}</div>
                </div>
                <KanjiSeal char={selected.era[0]} size={48} color="var(--vermilion)"/>
              </div>
              <div style={{margin:'18px 0', height:1, background:'linear-gradient(to right, var(--gold), transparent)'}}/>
              {[
                {l:'代表實物 · ARTIFACT', v:selected.object},
                {l:'地理座標 · PLACE', v:selected.place},
                {l:'傳承意義 · MEANING', v:selected.meaning},
                {l:'項目體現 · IN PROJECT', v:selected.role},
              ].map((f,i)=>(
                <div key={i} style={{padding:'10px 0', borderBottom:'1px solid var(--line-bone)'}}>
                  <div style={{fontFamily:'var(--mono)', fontSize:9, color:'var(--paper-3)', letterSpacing:'.3em', marginBottom:4}}>{f.l}</div>
                  <div style={{fontFamily:'var(--serif)', fontSize:13, color:'var(--paper)', lineHeight:1.7}}>{f.v}</div>
                </div>
              ))}
            </div>
          )}

          <div>
            <Divider label="CROSS-BORDER · 跨境物源 · 10 NODES" dense/>
            <div style={{border:'1px solid var(--line)', background:'rgba(0,0,0,.3)', marginTop:14}}>
              {D.cross.map((c,i)=>{
                const lineColor = c.line.includes('絲路')||c.line.includes('丝路')?'var(--gold)':c.line.includes('藏')?'var(--vermilion)':c.line.includes('南')?'var(--jade)':'var(--bone)';
                return (
                  <div key={i} style={{display:'grid', gridTemplateColumns:'40px 90px 1fr', borderBottom: i<D.cross.length-1?'1px solid var(--line-bone)':'none', padding:'10px 12px', gap:10, alignItems:'center'}}>
                    <span style={{fontFamily:'var(--mono)', fontSize:10, color:'var(--paper-3)', letterSpacing:'.18em'}}>{c.id}</span>
                    <span style={{fontFamily:'var(--serif)', fontSize:12, color:'var(--paper)'}}>{c.country}</span>
                    <div>
                      <div style={{display:'flex', alignItems:'center', gap:6}}>
                        <span style={{width:14, height:1, background:lineColor}}/>
                        <span style={{fontFamily:'var(--mono)', fontSize:9, color:'var(--paper-3)', letterSpacing:'.18em'}}>{c.line} · {c.era}</span>
                      </div>
                      <div style={{fontFamily:'var(--serif)', fontSize:11.5, color:'var(--gold-bright)', marginTop:3, lineHeight:1.4}}>{c.item}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Materials grid */}
      <div style={{marginTop:32}}>
        <Divider label="MATERIALS · 材質物源譜 · 七寶核心 + 眾材拱衛 · 21 PROJECT MATERIALS"/>
        <div style={{display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap:0, border:'1px solid var(--line)'}}>
          {D.materials.map((m,i)=>{
            const isCore = m.category && m.category.includes('七宝');
            return (
              <div key={i} style={{
                padding:'14px 12px',
                borderRight: (i+1)%7 ? '1px solid var(--line-bone)' : 'none',
                borderBottom: i<14 ? '1px solid var(--line-bone)' : 'none',
                background: isCore ? 'rgba(184,51,31,.08)' : 'transparent',
                position:'relative'
              }}>
                {isCore && <span style={{position:'absolute', top:6, right:6, fontFamily:'var(--mono)', fontSize:8, color:'var(--vermilion)', letterSpacing:'.2em'}}>★ 七寶</span>}
                <div style={{fontFamily:'var(--mono)', fontSize:9, color:'var(--gold)', letterSpacing:'.2em'}}>{m.id}</div>
                <div style={{fontFamily:'var(--serif)', fontSize:14, color:'var(--paper)', fontWeight:600, marginTop:4, letterSpacing:'.06em'}}>{m.name}</div>
                <div style={{fontFamily:'var(--mono)', fontSize:9, color:'var(--paper-3)', letterSpacing:'.15em', marginTop:6}}>SOURCE</div>
                <div style={{fontFamily:'var(--serif)', fontSize:11, color:'var(--paper-2)', marginTop:2, lineHeight:1.4}}>{(m.source||'').slice(0,24)}</div>
                <div style={{fontFamily:'var(--mono)', fontSize:9, color:'var(--paper-3)', letterSpacing:'.15em', marginTop:8}}>SPEC</div>
                <div style={{fontFamily:'var(--serif)', fontSize:10.5, color:'var(--gold-bright)', marginTop:2, lineHeight:1.4}}>{(m.spec||'').slice(0,32)}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

window.Timeline = Timeline;
