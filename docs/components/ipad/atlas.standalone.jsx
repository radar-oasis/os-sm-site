// Atlas — landing page. Big entry + dense info underneath.

const IpAtlas = ({ goto }) => {
  const D = window.APP_DATA;

  // Day-stable picks (rotates by day-of-year so client demos feel fresh)
  const day = Math.floor(Date.now() / 86400000);
  const todayCraft = D.crafts[day % D.crafts.length];
  const todayNode = D.nodes[(day*3) % D.nodes.length];
  const todayWork = D.works[(day*5) % D.works.length];
  const todayMat = D.materials.filter(m=>m.category?.includes('七宝'))[day % 7];
  const todayEra = D.timeline[(day*2) % D.timeline.length];

  // Rotating mantra
  const mantras = [
    {cn:'方寸之間 · 千年寺廟在掌心復現', en:'A temple in your palm'},
    {cn:'七寶為核 · 眾材拱衛', en:'Seven gems · Many materials'},
    {cn:'三十四載師承 · 顯微鏡下精修', en:'34 years of lineage'},
    {cn:'一千年信仰 · 一毫米經文', en:'A millennium of faith in one millimetre'},
  ];
  const [mIdx, setMIdx] = React.useState(0);
  React.useEffect(()=>{
    const t = setInterval(()=>setMIdx(i=>(i+1)%mantras.length), 7000);
    return ()=>clearInterval(t);
  },[]);
  const mantra = mantras[mIdx];

  const kpis = [
    {v:'27', u:'項', l:'非遺工藝', e:'CRAFTS'},
    {v:'11', u:'省', l:'重鎮網絡', e:'PROVINCES'},
    {v:'20+', u:'城', l:'手藝產區', e:'CITIES'},
    {v:'7', u:'地', l:'跨境物源', e:'CROSS-BORDER'},
    {v:'300', u:'道', l:'核心工序', e:'PROCEDURES'},
    {v:'21', u:'品', l:'材質譜系', e:'MATERIALS'},
    {v:'1640', u:'年', l:'時間跨度', e:'TIME-SPAN'},
    {v:'1:3520', l:'最大微縮比', e:'MAX MINIATURIZATION'},
  ];

  return (
    <div style={{height:'100%', overflow:'auto', padding:'24px 44px 40px'}}>
      {/* HERO BAND — text only */}
      <section style={{
        position:'relative',
        padding:'44px 50px',
        background:
          'radial-gradient(ellipse 80% 50% at 20% 20%, rgba(184,51,31,.12), transparent 60%), linear-gradient(180deg, rgba(20,16,12,.5), rgba(13,10,8,.7))',
        border:'1px solid var(--gold)',
        marginBottom:28,
        overflow:'hidden',
      }}>
        {/* Corner ornaments */}
        {[
          {top:14,left:14, r:0},{top:14,right:14, r:90},
          {bottom:14,right:14, r:180},{bottom:14,left:14, r:270},
        ].map((c,i)=>(
          <div key={i} style={{position:'absolute', ...c, transform:`rotate(${c.r}deg)`}}><Cartouche size={26}/></div>
        ))}
        {/* faint mandala behind */}
        <svg style={{position:'absolute', right:-160, top:-80, opacity:.18, pointerEvents:'none'}} width="600" height="600" viewBox="-100 -100 200 200">
          {[40, 56, 72, 88].map(r=>(<circle key={r} cx="0" cy="0" r={r} fill="none" stroke="var(--gold)" strokeWidth="0.5"/>))}
          {Array.from({length:24}).map((_,i)=>{
            const a = i*15*Math.PI/180; const x=88*Math.cos(a), y=88*Math.sin(a);
            return <line key={i} x1="0" y1="0" x2={x} y2={y} stroke="var(--gold)" strokeWidth="0.4"/>;
          })}
        </svg>

        <div style={{display:'grid', gridTemplateColumns:'40px 1fr 320px', gap:36, alignItems:'stretch', minHeight:340}}>
          {/* Vertical column */}
          <VColumn text="千年隨身信仰實物錨點" size={14} gap=".5em"/>

          {/* Center hero */}
          <div style={{display:'flex', flexDirection:'column', justifyContent:'space-between', minWidth:0}}>
            <div>
              <div style={{fontFamily:'var(--mono)', fontSize:11, color:'var(--gold)', letterSpacing:'.42em', marginBottom:18}}>SUISHEN SI MIAO · INTANGIBLE HERITAGE THINK-TANK</div>
              <h1 style={{fontFamily:'var(--serif)', fontSize:64, fontWeight:300, color:'var(--paper)', letterSpacing:'.22em', lineHeight:1, marginBottom:14}}>
                <span style={{color:'var(--gold-bright)', fontWeight:500}}>隨身</span>寺廟
              </h1>
              <div style={{fontFamily:'var(--display)', fontSize:22, fontStyle:'italic', color:'var(--paper-3)', letterSpacing:'.04em', marginBottom:32}}>
                Twenty-seven crafts · Seven centuries · One palm
              </div>

              <div key={mIdx} style={{
                padding:'14px 0', borderTop:'1px solid var(--line-strong)', borderBottom:'1px solid var(--line-strong)',
                animation:'fadeUp .6s ease',
              }}>
                <div style={{fontFamily:'var(--serif)', fontSize:22, color:'var(--gold-bright)', letterSpacing:'.16em', fontWeight:500, lineHeight:1.5}}>「{mantra.cn}」</div>
                <div style={{fontFamily:'var(--display)', fontSize:13, fontStyle:'italic', color:'var(--paper-3)', marginTop:6, letterSpacing:'.04em'}}>— {mantra.en}</div>
              </div>
            </div>

            <div style={{display:'flex', gap:12, marginTop:24, alignItems:'center', flexWrap:'wrap'}}>
              <button onClick={()=>goto({section:'genealogy'})} style={{
                minHeight:48, padding:'12px 24px', background:'var(--gold)', color:'var(--ink)', border:'none', cursor:'pointer',
                fontFamily:'var(--serif)', fontSize:14, fontWeight:600, letterSpacing:'.28em',
              }}>進入工藝譜系　→</button>
              <button onClick={()=>goto({section:'map'})} style={{
                minHeight:48, padding:'12px 24px', background:'transparent', color:'var(--gold)', border:'1px solid var(--gold)', cursor:'pointer',
                fontFamily:'var(--serif)', fontSize:14, fontWeight:500, letterSpacing:'.28em',
              }}>熱點地圖</button>
              <div style={{flex:1}}/>
              <div style={{textAlign:'right'}}>
                <div style={{fontFamily:'var(--mono)', fontSize:9.5, color:'var(--paper-3)', letterSpacing:'.32em'}}>GENESIS · 2018</div>
                <div style={{fontFamily:'var(--display)', fontSize:14, fontStyle:'italic', color:'var(--gold)'}}>「作明佛母」11mm</div>
              </div>
            </div>
          </div>

          {/* Right today's-craft seal — large vermilion focal point */}
          <button onClick={()=>goto({section:'genealogy', id:todayCraft.id})}
            style={{
              padding:'24px 22px', cursor:'pointer', textAlign:'left',
              background:'linear-gradient(180deg, rgba(184,51,31,.18), rgba(184,51,31,.05))',
              border:'1px solid var(--vermilion)', color:'var(--paper)',
              display:'flex', flexDirection:'column', justifyContent:'space-between',
            }}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
              <div>
                <div style={{fontFamily:'var(--mono)', fontSize:10, color:'#e8a899', letterSpacing:'.34em'}}>TODAY · 今日工藝</div>
                <div style={{fontFamily:'var(--mono)', fontSize:9, color:'var(--paper-3)', letterSpacing:'.22em', marginTop:6}}>{todayCraft.id} · {todayCraft.category}</div>
              </div>
              <IpSeal char={todayCraft.name[0]} size={56} color="var(--vermilion)" bg="var(--vermilion)" stroke="var(--gold)"/>
            </div>
            <div>
              <div style={{fontFamily:'var(--serif)', fontSize:30, fontWeight:600, color:'var(--gold-bright)', letterSpacing:'.1em', lineHeight:1.15, margin:'14px 0 8px'}}>{todayCraft.name}</div>
              <div style={{fontFamily:'var(--serif)', fontSize:13, color:'var(--paper-2)', lineHeight:1.7, letterSpacing:'.04em'}}>{(todayCraft.spec||'').slice(0,60)}…</div>
              <div style={{display:'flex', gap:6, marginTop:14, flexWrap:'wrap'}}>
                <Tier level={todayCraft.level}/>
                <span style={{fontFamily:'var(--mono)', fontSize:10, color:'var(--paper-3)', letterSpacing:'.22em', alignSelf:'center'}}>{(todayCraft.city||'').split('·')[0]}</span>
              </div>
            </div>
          </button>
        </div>
      </section>

      {/* FEATURED ARTIFACT — Pocket Temple anatomy */}
      <section style={{
        position:'relative',
        border:'1px solid var(--gold)',
        background:
          'radial-gradient(ellipse 60% 80% at 100% 50%, rgba(184,51,31,.10), transparent 60%), linear-gradient(180deg, rgba(20,16,12,.7), rgba(10,8,6,.7))',
        marginBottom:28,
        overflow:'hidden',
      }}>
        <div style={{display:'grid', gridTemplateColumns:'minmax(380px, 460px) 1fr', gap:0, alignItems:'stretch'}}>
          {/* Image side — full infographic, contained */}
          <div style={{
            position:'relative',
            background:'#000',
            borderRight:'1px solid var(--line-strong)',
            display:'flex', alignItems:'center', justifyContent:'center',
            minHeight:660,
            overflow:'hidden',
          }}>
            <img src={window.__resources?.anatomyImg || "assets/pocket-temple-anatomy.png"} alt="隨身寺廟 · 解構圖"
              style={{
                maxWidth:'100%', maxHeight:'100%', width:'auto', height:'auto',
                display:'block', pointerEvents:'none', userSelect:'none',
              }}/>
          </div>

          {/* Right narrative */}
          <div style={{padding:'38px 44px', display:'flex', flexDirection:'column', gap:24, position:'relative'}}>
            <div>
              <div style={{display:'flex', alignItems:'baseline', gap:14}}>
                <span style={{flex:1, height:1, background:'linear-gradient(to right, var(--gold), transparent)'}}/>
                <span style={{fontFamily:'var(--display)', fontSize:13, fontStyle:'italic', color:'var(--paper-3)', letterSpacing:'.04em'}}>A sacred shrine that travels with you</span>
              </div>
              <h2 style={{fontFamily:'var(--serif)', fontSize:44, fontWeight:300, color:'var(--gold-bright)', letterSpacing:'.18em', lineHeight:1.05, marginTop:18}}>
                <span style={{fontWeight:500}}>隨身</span>寺廟 <span style={{color:'var(--vermilion)', fontWeight:500}}>·</span> <span style={{fontFamily:'var(--display)', fontStyle:'italic', fontSize:34, fontWeight:400, color:'var(--paper-2)'}}>Anatomy</span>
              </h2>
              <div style={{fontFamily:'var(--serif)', fontSize:14, color:'var(--paper-2)', lineHeight:1.85, marginTop:14, letterSpacing:'.04em', maxWidth:560, textWrap:'pretty'}}>
                掌中方寸間的微縮佛龕：紫檀為骨、金漆為魂、朱砂為神、寶石為眼。
                覆鉢式塔頂象徵<span style={{color:'var(--gold-bright)'}}>覺悟</span>，
                忿怒主尊<span style={{color:'var(--vermilion)'}}>金剛橛</span>司守護，
                門首匾額、經幢、瑞獅、寶座、供瓶、香插、八吉祥鎖飾——每一構件，皆有所指。
              </div>
            </div>

            {/* Symbolism quartet */}
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:0, border:'1px solid var(--line-strong)'}}>
              {[
                {seal:'覺', en:'ENLIGHTENMENT', cn:'覺悟', d:'覆鉢塔頂 · 證得無上'},
                {seal:'護', en:'PROTECTION',    cn:'守護', d:'金剛橛 · 摧破諸障'},
                {seal:'福', en:'BLESSINGS',     cn:'福德', d:'經幢供物 · 招感吉祥'},
                {seal:'定', en:'STABILITY',    cn:'安定', d:'壇基瑞獅 · 持戒安住'},
              ].map((s,i)=>(
                <div key={i} style={{
                  padding:'14px 18px',
                  borderRight: i%2===0 ? '1px solid var(--line-strong)':'none',
                  borderBottom: i<2 ? '1px solid var(--line-strong)':'none',
                  display:'flex', alignItems:'center', gap:12,
                }}>
                  <IpSeal char={s.seal} size={32} color="var(--gold)" stroke="var(--gold)" bg="rgba(201,162,74,.06)"/>
                  <div style={{minWidth:0}}>
                    <div style={{fontFamily:'var(--serif)', fontSize:14, color:'var(--gold-bright)', fontWeight:500, letterSpacing:'.14em'}}>{s.cn}</div>
                    <div style={{fontFamily:'var(--mono)', fontSize:8.5, color:'var(--paper-3)', letterSpacing:'.28em', marginTop:2}}>{s.en}</div>
                    <div style={{fontFamily:'var(--serif)', fontSize:11, color:'var(--paper-2)', marginTop:4, letterSpacing:'.04em'}}>{s.d}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Specs row */}
            <div>
              <div style={{fontFamily:'var(--mono)', fontSize:9.5, color:'var(--gold)', letterSpacing:'.36em', marginBottom:10}}>SPECIFICATIONS · 規格</div>
              <div style={{display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:0, border:'1px solid var(--line-strong)'}}>
                {[
                  {v:'13.5', u:'cm', l:'高 · H'},
                  {v:'9.5',  u:'cm', l:'寬 · W'},
                  {v:'6.5',  u:'cm', l:'深 · D'},
                  {v:'560',  u:'g',  l:'重量'},
                  {v:'27',   u:'項', l:'非遺'},
                ].map((s,i)=>(
                  <div key={i} style={{padding:'12px 14px',
                    borderRight: i<4 ? '1px solid var(--line-strong)':'none'}}>
                    <div style={{display:'flex', alignItems:'baseline', gap:4, color:'var(--gold-bright)'}}>
                      <span style={{fontFamily:'var(--display)', fontSize:28, fontWeight:500, lineHeight:.95}}>{s.v}</span>
                      <span style={{fontFamily:'var(--mono)', fontSize:10, color:'var(--paper-3)', letterSpacing:'.18em'}}>{s.u}</span>
                    </div>
                    <div style={{fontFamily:'var(--mono)', fontSize:9, color:'var(--paper-3)', letterSpacing:'.26em', marginTop:6}}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{display:'flex', alignItems:'center', gap:14, marginTop:'auto'}}>
              <button onClick={()=>goto({section:'genealogy'})} style={{
                minHeight:44, padding:'10px 20px', background:'transparent', color:'var(--gold)', border:'1px solid var(--gold)',
                cursor:'pointer', fontFamily:'var(--serif)', fontSize:13, fontWeight:500, letterSpacing:'.24em',
              }}>解構 27 項工藝　→</button>
              <span style={{fontFamily:'var(--mono)', fontSize:9.5, color:'var(--paper-3)', letterSpacing:'.32em'}}>
                HANDCRAFTED · 紫檀 · 黃金 · 樹脂 · 寶石
              </span>
            </div>
          </div>
        </div>
      </section>


      {/* KPI STRIP */}
      <section style={{
        display:'grid', gridTemplateColumns:'repeat(8, 1fr)',
        border:'1px solid var(--line)', background:'rgba(0,0,0,.3)', marginBottom:28,
      }}>
        {kpis.map((k,i)=>(
          <div key={i} style={{padding:'22px 18px', borderRight: i<7 ? '1px solid var(--line-bone)' : 'none',
            position:'relative'}}>
            <IpNumber value={k.v} unit={k.u} label={k.l} en={k.e}/>
          </div>
        ))}
      </section>

      {/* THREE COLUMN: Today's Node / Era / Material */}
      <section style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:18, marginBottom:28}}>
        {/* Node */}
        <button onClick={()=>goto({section:'map', id:todayNode.id})}
          style={{padding:'24px 22px', cursor:'pointer', textAlign:'left',
            background:'linear-gradient(180deg, rgba(201,162,74,.06), rgba(0,0,0,.3))',
            border:'1px solid var(--line-strong)', color:'var(--paper)'}}>
          <div style={{fontFamily:'var(--mono)', fontSize:10, color:'var(--gold)', letterSpacing:'.32em'}}>TODAY · 今日重鎮</div>
          <div style={{fontFamily:'var(--serif)', fontSize:32, fontWeight:600, color:'var(--gold-bright)', letterSpacing:'.12em', marginTop:14, lineHeight:1.1}}>{todayNode.name}</div>
          <div style={{display:'flex', gap:6, marginTop:8}}>
            <Tier level={todayNode.level}/>
            <span style={{fontFamily:'var(--mono)', fontSize:10, color:'var(--paper-3)', letterSpacing:'.22em', alignSelf:'center'}}>{todayNode.type}</span>
          </div>
          <div style={{margin:'14px 0', height:1, background:'linear-gradient(to right, var(--gold), transparent)'}}/>
          <div style={{fontFamily:'var(--serif)', fontSize:13, color:'var(--paper-2)', lineHeight:1.7}}>{(todayNode.craft||'').slice(0,40)}…</div>
          <div style={{fontFamily:'var(--mono)', fontSize:9.5, color:'var(--paper-3)', letterSpacing:'.18em', marginTop:8}}>{todayNode.region} · {todayNode.coord[0].toFixed(2)}°E · {todayNode.coord[1].toFixed(2)}°N</div>
        </button>

        {/* Era */}
        <button onClick={()=>goto({section:'timeline'})}
          style={{padding:'24px 22px', cursor:'pointer', textAlign:'left',
            background:'linear-gradient(180deg, rgba(74,138,122,.06), rgba(0,0,0,.3))',
            border:'1px solid rgba(74,138,122,.4)', color:'var(--paper)'}}>
          <div style={{fontFamily:'var(--mono)', fontSize:10, color:'#9bccbb', letterSpacing:'.32em'}}>TODAY · 今日時代</div>
          <div style={{fontFamily:'var(--serif)', fontSize:32, fontWeight:600, color:'var(--gold-bright)', letterSpacing:'.12em', marginTop:14, lineHeight:1.1}}>{todayEra.era}</div>
          <div style={{fontFamily:'var(--mono)', fontSize:11, color:'var(--paper-3)', letterSpacing:'.22em', marginTop:6}}>{todayEra.year}</div>
          <div style={{margin:'14px 0', height:1, background:'linear-gradient(to right, var(--jade), transparent)'}}/>
          <div style={{fontFamily:'var(--serif)', fontSize:13, color:'var(--paper-2)', lineHeight:1.7}}>{(todayEra.object||'').slice(0,42)}</div>
          <div style={{fontFamily:'var(--mono)', fontSize:9.5, color:'var(--paper-3)', letterSpacing:'.18em', marginTop:8}}>{todayEra.place}</div>
        </button>

        {/* Material */}
        <button onClick={()=>goto({section:'materials'})}
          style={{padding:'24px 22px', cursor:'pointer', textAlign:'left',
            background:'linear-gradient(180deg, rgba(184,51,31,.06), rgba(0,0,0,.3))',
            border:'1px solid rgba(184,51,31,.42)', color:'var(--paper)'}}>
          <div style={{fontFamily:'var(--mono)', fontSize:10, color:'#e8a899', letterSpacing:'.32em'}}>TODAY · 今日七寶</div>
          <div style={{fontFamily:'var(--serif)', fontSize:32, fontWeight:600, color:'var(--gold-bright)', letterSpacing:'.12em', marginTop:14, lineHeight:1.1}}>{todayMat.name}</div>
          <div style={{fontFamily:'var(--mono)', fontSize:11, color:'var(--paper-3)', letterSpacing:'.22em', marginTop:6}}>{todayMat.category}</div>
          <div style={{margin:'14px 0', height:1, background:'linear-gradient(to right, var(--vermilion), transparent)'}}/>
          <div style={{fontFamily:'var(--serif)', fontSize:13, color:'var(--paper-2)', lineHeight:1.7}}>{(todayMat.source||'').slice(0,40)}</div>
          <div style={{fontFamily:'var(--mono)', fontSize:9.5, color:'var(--paper-3)', letterSpacing:'.18em', marginTop:8}}>{(todayMat.usage||'').slice(0,40)}</div>
        </button>
      </section>

      {/* THUMBSTRIP — 27 crafts */}
      <section style={{marginBottom:28}}>
        <div style={{display:'flex', alignItems:'baseline', gap:14, marginBottom:14}}>
          <span style={{fontFamily:'var(--mono)', fontSize:10, color:'var(--gold)', letterSpacing:'.4em'}}>CRAFTS INDEX · 二十七項非遺工藝</span>
          <span style={{flex:1, height:1, background:'linear-gradient(to right, var(--line-strong), transparent)'}}/>
          <button onClick={()=>goto({section:'genealogy'})} style={{
            padding:'6px 12px', background:'transparent', border:'1px solid var(--line-strong)', cursor:'pointer',
            fontFamily:'var(--mono)', fontSize:9.5, color:'var(--gold)', letterSpacing:'.28em'}}>全部 →</button>
        </div>
        <div style={{display:'grid', gridTemplateColumns:'repeat(9, 1fr)', gap:0, border:'1px solid var(--line)'}}>
          {D.crafts.map((c,i)=>(
            <button key={c.id} onClick={()=>goto({section:'genealogy', id:c.id})}
              style={{
                padding:'14px 12px', minHeight:78,
                borderRight: (i+1)%9 ? '1px solid var(--line-bone)' : 'none',
                borderBottom: i<18 ? '1px solid var(--line-bone)' : 'none',
                background: 'transparent', cursor:'pointer', textAlign:'left',
                display:'flex', flexDirection:'column', justifyContent:'space-between', gap:6,
              }}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
                <span style={{fontFamily:'var(--mono)', fontSize:9, color:'var(--gold)', letterSpacing:'.22em'}}>{c.id}</span>
                <span style={{width:5, height:5, background: window.CATEGORY_COLORS?.[c.category]||'var(--gold)'}}/>
              </div>
              <div>
                <div style={{fontFamily:'var(--serif)', fontSize:13, color:'var(--paper)', fontWeight:500, letterSpacing:'.08em', lineHeight:1.2}}>{c.name}</div>
                <div style={{fontFamily:'var(--mono)', fontSize:8.5, color:'var(--paper-3)', letterSpacing:'.18em', marginTop:4}}>{c.city.split('·')[0].split('+')[0]}</div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* CROSS-BORDER LINES */}
      <section style={{padding:'24px 28px', border:'1px solid var(--line-strong)', background:'rgba(0,0,0,.3)'}}>
        <div style={{display:'flex', alignItems:'baseline', gap:14, marginBottom:18}}>
          <span style={{fontFamily:'var(--mono)', fontSize:10, color:'var(--gold)', letterSpacing:'.4em'}}>CROSS-BORDER · 跨境三線</span>
          <span style={{flex:1, height:1, background:'linear-gradient(to right, var(--line-strong), transparent)'}}/>
        </div>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:24}}>
          {[
            {color:'var(--gold)', name:'絲路 · 陸路', en:'SILK ROAD · LAND', desc:'印度→犍陀羅→於闐→龜茲→敦煌→中原', items:'紫檀 · 青金石 · 玉兽 · 紅玉髓'},
            {color:'var(--vermilion)', name:'藏傳線', en:'TIBETAN LINE', desc:'印度→尼泊爾→拉薩 / 昌都', items:'噶瑪噶赤畫派 · 紐瓦力 · 礦物顏料'},
            {color:'var(--jade)', name:'南傳 · 海陸路', en:'SOUTHERN · SEA', desc:'印度→斯里蘭卡→蒲甘→雲南', items:'藍寶石 · 緬甸金佛 · 香料'},
          ].map((r,i)=>(
            <div key={i}>
              <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:8}}>
                <span style={{width:32, height:2.5, background:r.color}}/>
                <span style={{fontFamily:'var(--serif)', fontSize:15, color:r.color, fontWeight:600, letterSpacing:'.14em'}}>{r.name}</span>
              </div>
              <div style={{fontFamily:'var(--mono)', fontSize:9.5, color:'var(--paper-3)', letterSpacing:'.18em', marginLeft:42, marginBottom:8}}>{r.en}</div>
              <div style={{fontFamily:'var(--mono)', fontSize:10, color:'var(--paper-2)', letterSpacing:'.14em', marginLeft:42, marginBottom:6}}>{r.desc}</div>
              <div style={{fontFamily:'var(--serif)', fontSize:13, color:'var(--gold-bright)', marginLeft:42, lineHeight:1.6}}>{r.items}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

window.IpAtlas = IpAtlas;
