// Heat map — geographical visualization of 27 craft nodes.
// Custom Albers-ish projection over greater asia (lng 70-125, lat 5-45).

const HeatMap = ({ filtered, onSelect, selectedId, hoveredId, setHoveredId }) => {
  const W = 920, H = 620;
  const lngMin=68, lngMax=126, latMin=5, latMax=44;
  const project = ([lng,lat]) => {
    const x = (lng - lngMin) / (lngMax - lngMin) * W;
    const y = H - (lat - latMin) / (latMax - latMin) * H;
    return [x, y];
  };

  // routes (arcs) — silk road, southern sea, tibetan
  const routes = [
    {name:'丝路 · 陆路', color:'rgba(201,162,74,.55)', dash:'1 0', pts:[
      '塔克西拉','于阗(和田)','龟兹(库车)','敦煌·莫高窟','法门寺','上海'
    ]},
    {name:'藏传线', color:'rgba(122,29,16,.65)', dash:'4 3', pts:[
      '印度南部','尼泊尔加德满都','拉萨','昌都','上海'
    ]},
    {name:'南传 · 海路', color:'rgba(74,138,122,.7)', dash:'2 4', pts:[
      '斯里兰卡','缅甸蒲甘/英瓦','广东·岭南','上海'
    ]},
  ];

  const nodeIndex = Object.fromEntries(window.APP_DATA.nodes.map(n=>[n.name,n]));

  const typeStyle = {
    '中枢':       {fill:'var(--vermilion)', ring:'#f0c590', size:14, glow:.85},
    '非遗重镇':   {fill:'var(--gold)',     ring:'#e8c773', size:9,  glow:.55},
    '非遗辐射':   {fill:'var(--gold-deep)',ring:'var(--gold)', size:7,  glow:.35},
    '参照圣地':   {fill:'var(--jade)',     ring:'#9bccbb', size:8,  glow:.4},
    '跨境物源':   {fill:'var(--bone)',     ring:'#d6c9a8', size:7,  glow:.35},
  };

  // Heat blobs — group nearby nodes
  const heatPoints = window.APP_DATA.nodes.map(n => project(n.coord));

  return (
    <div style={{position:'relative', border:'1px solid var(--line)', background:
      'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(122,29,16,.10), transparent 70%), linear-gradient(180deg, #0a0807 0%, #15110d 100%)',
      padding:18}}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{width:'100%', display:'block'}}>
        <defs>
          <radialGradient id="heatBlob"><stop offset="0%" stopColor="rgba(232,199,115,.45)"/><stop offset="60%" stopColor="rgba(184,51,31,.12)"/><stop offset="100%" stopColor="transparent"/></radialGradient>
          <radialGradient id="heatBlob2"><stop offset="0%" stopColor="rgba(184,51,31,.6)"/><stop offset="100%" stopColor="transparent"/></radialGradient>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0 L0 0 0 40" fill="none" stroke="rgba(201,162,74,.06)" strokeWidth="0.5"/>
          </pattern>
          <pattern id="grid2" width="160" height="160" patternUnits="userSpaceOnUse">
            <path d="M160 0 L0 0 0 160" fill="none" stroke="rgba(201,162,74,.10)" strokeWidth="0.5"/>
          </pattern>
        </defs>

        <rect width={W} height={H} fill="url(#grid)"/>
        <rect width={W} height={H} fill="url(#grid2)"/>

        {/* China outline approximate (very simplified abstract shapes) */}
        <g opacity=".55" fill="none" stroke="rgba(201,162,74,.22)" strokeWidth="0.7">
          {/* China rough silhouette: just a stylized wavy boundary */}
          <path d={(()=>{
            const pts = [
              [73,40],[78,42],[85,43],[92,42.5],[100,43],[110,44],[120,42],[125,40],
              [128,35],[125,28],[120,22],[112,21],[108,20],[100,21],[97,19],[95,16],
              [92,18],[85,20],[80,25],[75,32],[73,36],[73,40]
            ].map(p => project(p));
            return 'M' + pts.map(p=>p.join(' ')).join(' L') + ' Z';
          })()}/>
          {/* India + nepal + sri lanka */}
          <path d={(()=>{
            const pts = [[68,32],[75,34],[78,30],[80,25],[78,18],[80,12],[78,8],[75,7],[80,6],[82,8]].map(p=>project(p));
            return 'M' + pts.map(p=>p.join(' ')).join(' L');
          })()}/>
        </g>

        {/* heat blobs */}
        <g style={{mixBlendMode:'screen'}}>
          {heatPoints.map(([x,y],i)=>(
            <circle key={i} cx={x} cy={y} r={70} fill="url(#heatBlob)" opacity=".55"/>
          ))}
          {/* shanghai stronger */}
          {(() => { const [x,y] = project(nodeIndex['上海'].coord); return <circle cx={x} cy={y} r={130} fill="url(#heatBlob2)" opacity=".7"/>; })()}
        </g>

        {/* routes */}
        <g fill="none">
          {routes.map((r,i)=>{
            const pts = r.pts.map(name => project(nodeIndex[name].coord));
            // smooth curve via quadratic
            let d = `M${pts[0][0]} ${pts[0][1]}`;
            for (let j=1;j<pts.length;j++){
              const [x1,y1]=pts[j-1], [x2,y2]=pts[j];
              const cx=(x1+x2)/2, cy=Math.min(y1,y2)-30 - i*8;
              d += ` Q${cx} ${cy} ${x2} ${y2}`;
            }
            return <path key={i} d={d} stroke={r.color} strokeWidth="1.1" strokeDasharray={r.dash} opacity=".9"/>;
          })}
        </g>

        {/* nodes */}
        {filtered.map(n => {
          const [x,y] = project(n.coord);
          const t = typeStyle[n.type] || typeStyle['非遗重镇'];
          const isHover = hoveredId === n.id;
          const isSel = selectedId === n.id;
          return (
            <g key={n.id} style={{cursor:'pointer'}}
               onMouseEnter={()=>setHoveredId(n.id)} onMouseLeave={()=>setHoveredId(null)}
               onClick={()=>onSelect(n)}>
              {/* halo */}
              <circle cx={x} cy={y} r={t.size+8} fill={t.fill} opacity={isHover||isSel ? .35 : .12}/>
              {/* pulsing for 中枢 */}
              {n.type==='中枢' && <circle cx={x} cy={y} r={t.size+14} fill="none" stroke={t.fill} strokeWidth="0.6" opacity=".5">
                <animate attributeName="r" values={`${t.size+8};${t.size+24};${t.size+8}`} dur="3s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values=".5;0;.5" dur="3s" repeatCount="indefinite"/>
              </circle>}
              <circle cx={x} cy={y} r={t.size} fill={t.fill} stroke={t.ring} strokeWidth={isHover||isSel?2:1}/>
              {n.type==='中枢' && <circle cx={x} cy={y} r={t.size-4} fill="var(--gold-bright)"/>}
              <text x={x+t.size+6} y={y+1} fill={isHover||isSel?'var(--gold-bright)':'var(--paper)'}
                style={{fontFamily:'var(--serif)', fontSize: n.type==='中枢'?13:10.5, fontWeight: n.type==='中枢'?600:400, letterSpacing:'.08em'}}>
                {n.name}
              </text>
              {(isHover||isSel) && (
                <text x={x+t.size+6} y={y+13} fill="var(--paper-3)" style={{fontFamily:'var(--mono)', fontSize:8.5, letterSpacing:'.12em'}}>
                  {n.id} · {n.level}
                </text>
              )}
            </g>
          );
        })}

        {/* corner cartouches */}
        <g style={{fontFamily:'var(--mono)', fontSize:9, letterSpacing:'.2em'}} fill="var(--paper-3)">
          <text x="18" y="22">N 44° ─────────────────────────────</text>
          <text x="18" y={H-12}>N 5°  ─────────────────────────────</text>
          <text x="18" y={H/2} transform={`rotate(-90 18 ${H/2})`}>LON 68° → 126° E</text>
        </g>
      </svg>

      {/* legend */}
      <div style={{position:'absolute', left:30, bottom:30, padding:'12px 16px', background:'rgba(0,0,0,.55)',
        border:'1px solid var(--line-strong)', backdropFilter:'blur(6px)'}}>
        <div style={{fontFamily:'var(--mono)', fontSize:9, color:'var(--paper-3)', letterSpacing:'.3em', marginBottom:8}}>NODE LEGEND</div>
        {Object.entries(typeStyle).map(([k,v])=>(
          <div key={k} style={{display:'flex', alignItems:'center', gap:8, marginBottom:5}}>
            <span style={{width:v.size*1.2, height:v.size*1.2, borderRadius:'50%', background:v.fill, border:`1px solid ${v.ring}`}}/>
            <span style={{fontFamily:'var(--serif)', fontSize:11, color:'var(--paper)', letterSpacing:'.1em'}}>{k}</span>
            <span style={{fontFamily:'var(--mono)', fontSize:9, color:'var(--paper-3)', marginLeft:'auto'}}>
              {window.APP_DATA.nodes.filter(n=>n.type===k).length}
            </span>
          </div>
        ))}
        <div style={{height:1, background:'var(--line)', margin:'8px 0'}}/>
        <div style={{fontFamily:'var(--mono)', fontSize:9, color:'var(--paper-3)', letterSpacing:'.3em', marginBottom:6}}>ROUTES</div>
        {routes.map((r,i)=>(
          <div key={i} style={{display:'flex', alignItems:'center', gap:8, marginBottom:4}}>
            <svg width="22" height="6"><line x1="0" y1="3" x2="22" y2="3" stroke={r.color} strokeWidth="1.5" strokeDasharray={r.dash}/></svg>
            <span style={{fontFamily:'var(--serif)', fontSize:10.5, color:'var(--paper)'}}>{r.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const HeatMapPanel = ({ query, filterLevel }) => {
  const [hoveredId, setHoveredId] = React.useState(null);
  const [selected, setSelected] = React.useState(window.APP_DATA.nodes[0]);

  const filtered = window.APP_DATA.nodes.filter(n => {
    if (filterLevel !== 'ALL' && !(n.level||'').includes(filterLevel) && !(n.type||'').includes(filterLevel)) return false;
    if (query && !`${n.name}${n.craft}${n.role}${n.region}`.includes(query)) return false;
    return true;
  });

  const node = window.APP_DATA.nodes.find(n=>n.id===hoveredId) || selected;
  // related crafts at this node
  const relatedCrafts = window.APP_DATA.crafts.filter(c => (c.city||'').includes(node.name) || node.name.includes(c.city) || (node.craft||'').includes(c.name));

  return (
    <div style={{display:'grid', gridTemplateColumns:'1fr 360px', gap:18}}>
      <div>
        <Divider label="HEAT MAP · 27 NODES · 11 PROVINCES + 7 CROSS-BORDER"/>
        <HeatMap filtered={filtered} onSelect={setSelected} selectedId={selected?.id}
          hoveredId={hoveredId} setHoveredId={setHoveredId}/>

        {/* Node strip */}
        <div style={{marginTop:18}}>
          <Divider label="ALL NODES · INDEX"/>
          <div style={{display:'grid', gridTemplateColumns:'repeat(9, 1fr)', gap:0, border:'1px solid var(--line)'}}>
            {window.APP_DATA.nodes.map(n=>{
              const active = (selected?.id===n.id) || (hoveredId===n.id);
              return (
                <button key={n.id} onClick={()=>setSelected(n)}
                  onMouseEnter={()=>setHoveredId(n.id)} onMouseLeave={()=>setHoveredId(null)}
                  style={{
                    padding:'10px 8px', borderRight:'1px solid var(--line)', borderBottom:'1px solid var(--line)',
                    borderTop:'none', borderLeft:'none', cursor:'pointer', textAlign:'left',
                    background: active ? 'rgba(201,162,74,.08)' : 'transparent',
                  }}>
                  <div style={{fontFamily:'var(--mono)', fontSize:8.5, color:'var(--gold)', letterSpacing:'.2em'}}>{n.id}</div>
                  <div style={{fontFamily:'var(--serif)', fontSize:11.5, color:'var(--paper)', fontWeight:500, marginTop:2, letterSpacing:'.05em'}}>{n.name}</div>
                  <div style={{fontFamily:'var(--mono)', fontSize:8.5, color:'var(--paper-3)', marginTop:2, letterSpacing:'.1em'}}>{n.type}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right inspector */}
      <aside style={{border:'1px solid var(--line)', background:'rgba(0,0,0,.3)', padding:'18px', alignSelf:'start', position:'sticky', top:140}}>
        <div style={{display:'flex', alignItems:'flex-start', gap:10}}>
          <div style={{flex:1}}>
            <div style={{fontFamily:'var(--mono)', fontSize:9.5, color:'var(--gold)', letterSpacing:'.32em'}}>{node.id} · {node.type.toUpperCase()}</div>
            <div style={{fontFamily:'var(--serif)', fontSize:28, color:'var(--gold-bright)', fontWeight:600, marginTop:4, letterSpacing:'.06em'}}>{node.name}</div>
            <div style={{fontFamily:'var(--mono)', fontSize:9.5, color:'var(--paper-3)', letterSpacing:'.18em', marginTop:4}}>{node.region} · {node.coord[0].toFixed(2)}°E · {node.coord[1].toFixed(2)}°N</div>
          </div>
          <SealColumn text="重镇" size={11}/>
        </div>

        <div style={{margin:'18px 0 12px', height:1, background:'linear-gradient(to right, var(--gold), transparent)'}}/>

        <div style={{display:'flex', flexWrap:'wrap', gap:6, marginBottom:14}}>
          <Tag>{node.level}</Tag><Tag color="mute">{node.type}</Tag>
        </div>

        <div style={{marginBottom:14}}>
          <div style={{fontFamily:'var(--mono)', fontSize:9, color:'var(--paper-3)', letterSpacing:'.3em', marginBottom:6}}>核心工艺 · CRAFT</div>
          <div style={{fontFamily:'var(--serif)', fontSize:14, color:'var(--paper)', lineHeight:1.6}}>{node.craft}</div>
        </div>

        <div style={{marginBottom:14}}>
          <div style={{fontFamily:'var(--mono)', fontSize:9, color:'var(--paper-3)', letterSpacing:'.3em', marginBottom:6}}>项目角色 · FUNCTION</div>
          <div style={{fontFamily:'var(--serif)', fontSize:13, color:'var(--paper-2)', lineHeight:1.7}}>{node.role}</div>
        </div>

        {relatedCrafts.length > 0 && (
          <div>
            <div style={{fontFamily:'var(--mono)', fontSize:9, color:'var(--paper-3)', letterSpacing:'.3em', marginBottom:8}}>关联工艺 · LINKED CRAFTS · {relatedCrafts.length}</div>
            {relatedCrafts.slice(0,6).map(c=>(
              <div key={c.id} style={{display:'flex', alignItems:'baseline', gap:8, padding:'7px 0', borderTop:'1px solid var(--line-bone)'}}>
                <span style={{fontFamily:'var(--mono)', fontSize:9, color:'var(--gold)', letterSpacing:'.2em', flex:'0 0 30px'}}>{c.id}</span>
                <span style={{fontFamily:'var(--serif)', fontSize:12.5, color:'var(--paper)', flex:1}}>{c.name}</span>
                <Tag dense>{c.level}</Tag>
              </div>
            ))}
          </div>
        )}
      </aside>
    </div>
  );
};

window.HeatMapPanel = HeatMapPanel;
