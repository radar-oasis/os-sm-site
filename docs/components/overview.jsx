// Overview / dashboard tab — at-a-glance KPIs + featured panels.

const Overview = ({ goTab, query }) => {
  const D = window.APP_DATA;
  const workCount = D.works.length;
  const headlineMetrics = [
    {v:'27', u:'项', l:'非遗工艺'},
    {v:'11', u:'省', l:'重镇网络'},
    {v:'20+', u:'城', l:'手艺产区'},
    {v:'7', u:'地/国', l:'跨境物源'},
    {v:'300', u:'道', l:'核心工序'},
    {v:'600+', u:'件', l:'最大零件数'},
    {v:'8', u:'年', l:'制作跨度'},
    {v:'1:3520', u:'比', l:'最大微缩'},
  ];

  // Precision records
  const precision = D.metrics.filter(m=>m.category==='精度纪录');

  // Top 6 categories pie-ish
  const catCount = {};
  D.crafts.forEach(c=>{ catCount[c.category] = (catCount[c.category]||0)+1; });
  const cats = Object.entries(catCount).sort((a,b)=>b[1]-a[1]);

  return (
    <div>
      {/* Hero */}
      <section style={{padding:'42px 0 28px', borderBottom:'1px solid var(--line)', position:'relative'}}>
        <div style={{display:'grid', gridTemplateColumns:'auto 1fr auto', gap:36, alignItems:'center'}}>
          <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:10}}>
            <KanjiSeal char="慈" size={64} color="var(--vermilion)"/>
            <KanjiSeal char="悲" size={64} color="var(--vermilion)"/>
            <KanjiSeal char="方" size={64} color="var(--gold)"/>
            <KanjiSeal char="寸" size={64} color="var(--gold)"/>
          </div>
          <div>
            <div style={{fontFamily:'var(--mono)', fontSize:11, color:'var(--gold)', letterSpacing:'.42em'}}>SUISHEN SI MIAO · INTANGIBLE HERITAGE THINK-TANK · v1.0</div>
            <h1 style={{fontFamily:'var(--serif)', fontSize:72, fontWeight:300, color:'var(--paper)',
              letterSpacing:'.18em', lineHeight:1, margin:'18px 0 12px'}}>
              <span style={{color:'var(--gold-bright)'}}>隨身寺廟</span>
              <span style={{color:'var(--paper-3)', fontSize:34, marginLeft:18, letterSpacing:'.3em'}}>非遺工藝譜系</span>
            </h1>
            <div style={{fontFamily:'var(--serif)', fontSize:16, color:'var(--paper-2)', maxWidth:780, lineHeight:1.85, fontWeight:300, letterSpacing:'.05em'}}>
              <span style={{color:'var(--gold)'}}>七寶為核 · 眾材拱衛</span>　以紫檀為骨、黃金為魂、唐卡為神、寶石為眼，
              於方寸之間集 <span style={{color:'var(--gold-bright)'}}>27 項非遺工藝</span> 與 <span style={{color:'var(--gold-bright)'}}>11 省 20 城</span> 的手藝協作網絡 ——
              一座可以隨身佩戴的、千年信仰的當代結晶。
            </div>
            <div style={{display:'flex', gap:10, marginTop:22}}>
              <button onClick={()=>goTab('heatmap')} style={{padding:'12px 22px', background:'var(--gold)', color:'var(--ink)', border:'none', cursor:'pointer',
                fontFamily:'var(--serif)', fontSize:13, fontWeight:600, letterSpacing:'.3em'}}>進入熱點地圖 →</button>
              <button onClick={()=>goTab('genealogy')} style={{padding:'12px 22px', background:'transparent', color:'var(--gold)', border:'1px solid var(--gold)', cursor:'pointer',
                fontFamily:'var(--serif)', fontSize:13, fontWeight:600, letterSpacing:'.3em'}}>工藝譜系總表</button>
              <button onClick={()=>goTab('works')} style={{padding:'12px 22px', background:'transparent', color:'var(--paper)', border:'1px solid var(--line-strong)', cursor:'pointer',
                fontFamily:'var(--serif)', fontSize:13, fontWeight:500, letterSpacing:'.3em'}}>{workCount} 件作品矩陣</button>
            </div>
          </div>
          <div style={{textAlign:'right', borderLeft:'1px solid var(--line-strong)', paddingLeft:30}}>
            <div style={{fontFamily:'var(--mono)', fontSize:9.5, color:'var(--paper-3)', letterSpacing:'.3em', marginBottom:6}}>FIRST RECORD · 2018</div>
            <div style={{fontFamily:'var(--display)', fontSize:32, color:'var(--gold-bright)', fontWeight:500, lineHeight:1.1}}>「作明佛母」</div>
            <div style={{fontFamily:'var(--serif)', fontSize:13, color:'var(--paper-2)', marginTop:4}}>11mm 清代擦擦</div>
            <div style={{fontFamily:'var(--mono)', fontSize:10, color:'var(--paper-3)', letterSpacing:'.2em', marginTop:14}}>始發點 · GENESIS</div>
            <div style={{margin:'10px 0', height:1, background:'var(--line-strong)'}}/>
            <div style={{fontFamily:'var(--mono)', fontSize:9.5, color:'var(--paper-3)', letterSpacing:'.3em', marginBottom:6}}>LATEST · 2026</div>
            <div style={{fontFamily:'var(--display)', fontSize:32, color:'var(--gold-bright)', fontWeight:500, lineHeight:1.1}}>{workCount}</div>
            <div style={{fontFamily:'var(--serif)', fontSize:13, color:'var(--paper-2)', marginTop:4}}>件作品檔案</div>
          </div>
        </div>
      </section>

      {/* KPI strip */}
      <section style={{padding:'24px 0', borderBottom:'1px solid var(--line)'}}>
        <Divider label="HEADLINE METRICS · 8 KPI · LIVE"/>
        <div style={{display:'grid', gridTemplateColumns:'repeat(8, 1fr)', borderTop:'1px solid var(--line-bone)', borderBottom:'1px solid var(--line-bone)'}}>
          {headlineMetrics.map((m,i)=>(
            <div key={i} style={{padding:'18px 16px', borderRight: i<7 ? '1px solid var(--line-bone)' : 'none'}}>
              <Stat value={m.v} unit={m.u} label={m.l}/>
            </div>
          ))}
        </div>
      </section>

      {/* Three columns */}
      <section style={{padding:'28px 0', display:'grid', gridTemplateColumns:'1.3fr 1fr 1fr', gap:28}}>
        {/* Precision records — list */}
        <div>
          <Divider label="PRECISION · 精度紀錄"/>
          <div style={{border:'1px solid var(--line)', background:'rgba(0,0,0,.3)'}}>
            {precision.map((p,i)=>{
              const max = 10;
              const v = parseFloat((p.value+'').match(/[\d.]+/)?.[0]) || 0;
              const pct = Math.min(100, Math.max(4, (1 - Math.log10(v+0.05)/Math.log10(max+0.05)) * 100 ));
              return (
                <div key={i} style={{display:'grid', gridTemplateColumns:'1fr auto 100px', gap:12, padding:'10px 14px',
                  borderBottom: i<precision.length-1 ? '1px solid var(--line-bone)':'none', alignItems:'center'}}>
                  <div>
                    <div style={{fontFamily:'var(--serif)', fontSize:13, color:'var(--paper)'}}>{p.name}</div>
                    <div style={{fontFamily:'var(--mono)', fontSize:9.5, color:'var(--paper-3)', letterSpacing:'.18em', marginTop:2}}>{p.note}</div>
                  </div>
                  <div style={{fontFamily:'var(--display)', fontSize:22, color:'var(--gold-bright)', fontWeight:500}}>
                    {p.value}<span style={{fontFamily:'var(--mono)', fontSize:9, color:'var(--paper-3)', marginLeft:4, letterSpacing:'.15em'}}>{p.unit}</span>
                  </div>
                  <div style={{height:3, background:'rgba(255,255,255,.06)', position:'relative'}}>
                    <div style={{position:'absolute', left:0, top:0, height:'100%', width: pct+'%',
                      background:'linear-gradient(to right, var(--gold-bright), var(--gold))'}}/>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Categories breakdown — radial chart */}
        <div>
          <Divider label="CATEGORY · 工藝門類分佈"/>
          <div style={{border:'1px solid var(--line)', background:'rgba(0,0,0,.3)', padding:'20px'}}>
            <div style={{position:'relative', width:'100%', aspectRatio:'1', maxWidth:280, margin:'0 auto'}}>
              <svg viewBox="-110 -110 220 220" style={{width:'100%', height:'100%'}}>
                {(() => {
                  const total = D.crafts.length;
                  let acc = 0;
                  return cats.map(([cat, n], i) => {
                    const start = acc / total * Math.PI * 2 - Math.PI/2;
                    acc += n;
                    const end = acc / total * Math.PI * 2 - Math.PI/2;
                    const r1 = 60, r2 = 100;
                    const x1=r2*Math.cos(start), y1=r2*Math.sin(start);
                    const x2=r2*Math.cos(end), y2=r2*Math.sin(end);
                    const x3=r1*Math.cos(end), y3=r1*Math.sin(end);
                    const x4=r1*Math.cos(start), y4=r1*Math.sin(start);
                    const large = end-start>Math.PI?1:0;
                    const d = `M${x1} ${y1} A${r2} ${r2} 0 ${large} 1 ${x2} ${y2} L${x3} ${y3} A${r1} ${r1} 0 ${large} 0 ${x4} ${y4} Z`;
                    const color = window.CATEGORY_COLORS[cat] || 'var(--gold)';
                    return <path key={cat} d={d} fill={color} opacity=".9" stroke="var(--ink)" strokeWidth="1"/>;
                  });
                })()}
                <text x="0" y="-3" textAnchor="middle" fill="var(--gold-bright)" style={{fontFamily:'var(--display)', fontSize:32, fontWeight:500}}>27</text>
                <text x="0" y="14" textAnchor="middle" fill="var(--paper-3)" style={{fontFamily:'var(--mono)', fontSize:8.5, letterSpacing:'.3em'}}>CRAFTS</text>
              </svg>
            </div>
            <div style={{marginTop:18, display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px 14px'}}>
              {cats.map(([cat,n])=>(
                <div key={cat} style={{display:'flex', alignItems:'center', gap:8}}>
                  <span style={{width:10, height:10, background: window.CATEGORY_COLORS[cat]||'var(--gold)'}}/>
                  <span style={{fontFamily:'var(--serif)', fontSize:11.5, color:'var(--paper)', flex:1}}>{cat}</span>
                  <span style={{fontFamily:'var(--mono)', fontSize:10, color:'var(--gold)'}}>{n}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cross-border */}
        <div>
          <Divider label="CROSS-BORDER · 跨境三線"/>
          <div style={{border:'1px solid var(--line)', background:'rgba(0,0,0,.3)', padding:'18px'}}>
            {[
              {c:'var(--gold)', name:'絲路 · 陸路', desc:'印度→犍陀羅→於闐→龜茲→敦煌→中原', items:'紫檀 · 青金石 · 玉兽 · 紅玉髓'},
              {c:'var(--vermilion)', name:'藏傳線', desc:'印度→尼泊爾紐瓦力→拉薩 / 昌都', items:'噶瑪噶赤 · 紐瓦力畫派 · 礦物顏料'},
              {c:'var(--jade)', name:'南傳 · 海陸路', desc:'印度→斯里蘭卡→蒲甘 / 英瓦→雲南', items:'藍寶石 · 緬甸金佛 · 香料'},
            ].map((r,i)=>(
              <div key={i} style={{padding:'12px 0', borderBottom: i<2 ? '1px solid var(--line-bone)':'none'}}>
                <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:6}}>
                  <span style={{width:24, height:2, background:r.c}}/>
                  <span style={{fontFamily:'var(--serif)', fontSize:13.5, color:'var(--paper)', fontWeight:600, letterSpacing:'.1em'}}>{r.name}</span>
                </div>
                <div style={{fontFamily:'var(--mono)', fontSize:10, color:'var(--paper-3)', letterSpacing:'.12em', marginLeft:34, marginBottom:4}}>{r.desc}</div>
                <div style={{fontFamily:'var(--serif)', fontSize:11.5, color:'var(--gold-bright)', marginLeft:34}}>{r.items}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured triple-table sample */}
      <section style={{padding:'10px 0 36px'}}>
        <Divider label="QUICK REFERENCE · 工藝→作品→城市三聯速查 · TOP 8"/>
        <div style={{border:'1px solid var(--line)', overflow:'hidden'}}>
          <div style={{display:'grid', gridTemplateColumns:'90px 1fr 1.4fr 1.2fr 2fr', background:'rgba(201,162,74,.06)', borderBottom:'1px solid var(--line)'}}>
            {['類別','工藝 / 技法','代表作品','重鎮 / 物源','講解錨點'].map((h,i)=>(
              <div key={i} style={{padding:'10px 14px', fontFamily:'var(--mono)', fontSize:10, color:'var(--gold)', letterSpacing:'.25em'}}>{h}</div>
            ))}
          </div>
          {D.triple.slice(0,8).map((t,i)=>(
            <div key={i} style={{display:'grid', gridTemplateColumns:'90px 1fr 1.4fr 1.2fr 2fr', borderBottom: i<7?'1px solid var(--line-bone)':'none'}}>
              <div style={{padding:'12px 14px', fontFamily:'var(--mono)', fontSize:10, color:'var(--paper-3)', letterSpacing:'.18em'}}>{t.category}</div>
              <div style={{padding:'12px 14px', fontFamily:'var(--serif)', fontSize:13, color:'var(--gold-bright)', fontWeight:500}}>{t.craft}</div>
              <div style={{padding:'12px 14px', fontFamily:'var(--serif)', fontSize:12.5, color:'var(--paper)'}}>{t.work}</div>
              <div style={{padding:'12px 14px', fontFamily:'var(--serif)', fontSize:12, color:'var(--paper-2)'}}>{t.place}</div>
              <div style={{padding:'12px 14px', fontFamily:'var(--serif)', fontSize:12, color:'var(--paper-3)', lineHeight:1.5}}>{t.anchor}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

window.Overview = Overview;
