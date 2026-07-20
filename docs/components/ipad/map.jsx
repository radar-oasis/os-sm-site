// Map — full-bleed pinch-zoom + bottom sheet detail.

const IpMap = ({ initialId, goto }) => {
  const D = window.APP_DATA;
  const nodeIndex = React.useMemo(()=>Object.fromEntries(D.nodes.map(n=>[n.name,n])), []);

  const W = 1600, H = 1000;
  const lngMin=68, lngMax=126, latMin=5, latMax=44;
  const project = ([lng,lat]) => {
    const x = (lng - lngMin) / (lngMax - lngMin) * W;
    const y = H - (lat - latMin) / (latMax - latMin) * H;
    return [x, y];
  };

  const containerRef = React.useRef(null);
  const [view, setView] = React.useState({tx:0, ty:0, scale:1});
  const [selId, setSelId] = React.useState(initialId || null);
  const [filter, setFilter] = React.useState('全部');

  React.useEffect(()=>{ if (initialId) setSelId(initialId); }, [initialId]);

  // Pointer-based pan + pinch zoom
  const pointers = React.useRef(new Map());
  const startView = React.useRef(null);
  const startDist = React.useRef(0);
  const startMid = React.useRef([0,0]);

  const onPointerDown = (e) => {
    e.currentTarget.setPointerCapture?.(e.pointerId);
    pointers.current.set(e.pointerId, [e.clientX, e.clientY]);
    if (pointers.current.size === 1) {
      startView.current = {...view, x:e.clientX, y:e.clientY};
    } else if (pointers.current.size === 2) {
      const pts = [...pointers.current.values()];
      const dx = pts[1][0]-pts[0][0], dy = pts[1][1]-pts[0][1];
      startDist.current = Math.hypot(dx, dy);
      startMid.current = [(pts[0][0]+pts[1][0])/2, (pts[0][1]+pts[1][1])/2];
      startView.current = {...view};
    }
  };
  const onPointerMove = (e) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, [e.clientX, e.clientY]);
    if (pointers.current.size === 1) {
      const s = startView.current; if (!s) return;
      setView(v => ({...v, tx: s.tx + (e.clientX - s.x), ty: s.ty + (e.clientY - s.y)}));
    } else if (pointers.current.size === 2) {
      const pts = [...pointers.current.values()];
      const dx = pts[1][0]-pts[0][0], dy = pts[1][1]-pts[0][1];
      const dist = Math.hypot(dx, dy);
      const s = startView.current;
      const scale = Math.max(0.5, Math.min(4, s.scale * (dist / startDist.current)));
      setView(v => ({...v, scale}));
    }
  };
  const onPointerUp = (e) => { pointers.current.delete(e.pointerId); };

  // Wheel zoom (desktop)
  const onWheel = (e) => {
    e.preventDefault();
    const rect = containerRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    setView(v => {
      const k = Math.exp(-e.deltaY * 0.001);
      const ns = Math.max(0.5, Math.min(4, v.scale * k));
      // zoom around cursor
      const tx = mx - (mx - v.tx) * (ns / v.scale);
      const ty = my - (my - v.ty) * (ns / v.scale);
      return {tx, ty, scale: ns};
    });
  };

  React.useEffect(()=>{
    const el = containerRef.current; if (!el) return;
    el.addEventListener('wheel', onWheel, {passive:false});
    return ()=>el.removeEventListener('wheel', onWheel);
  },[]);

  const resetView = () => setView({tx:0, ty:0, scale:1});
  const zoomBy = (k) => setView(v => {
    const ns = Math.max(0.5, Math.min(4, v.scale * k));
    const rect = containerRef.current.getBoundingClientRect();
    const cx = rect.width/2, cy = rect.height/2;
    return {tx: cx - (cx - v.tx)*(ns/v.scale), ty: cy - (cy - v.ty)*(ns/v.scale), scale: ns};
  });

  const typeStyle = {
    '中枢':       {fill:'var(--vermilion)', ring:'#f0c590', size:18, glow:.85, label:'中樞'},
    '非遗重镇':   {fill:'var(--gold)',      ring:'#e8c773', size:12, glow:.55, label:'非遺重鎮'},
    '非遗辐射':   {fill:'var(--gold-deep)', ring:'var(--gold)', size:10, glow:.35, label:'非遺輻射'},
    '参照圣地':   {fill:'var(--jade)',      ring:'#9bccbb', size:11, glow:.4, label:'參照聖地'},
    '跨境物源':   {fill:'var(--bone)',      ring:'#d6c9a8', size:10, glow:.35, label:'跨境物源'},
  };

  const filteredNodes = D.nodes.filter(n => filter==='全部' || n.type===filter);

  const sel = selId ? D.nodes.find(n=>n.id===selId) : null;

  // routes
  const routes = [
    {name:'絲路 · 陸路', color:'rgba(201,162,74,.55)', dash:'1 0', pts:['塔克西拉','于阗(和田)','龟兹(库车)','敦煌·莫高窟','法门寺','上海']},
    {name:'藏傳線',     color:'rgba(184,51,31,.65)', dash:'4 3', pts:['印度南部','尼泊尔加德满都','拉萨','昌都','上海']},
    {name:'南傳 · 海陸', color:'rgba(74,138,122,.7)', dash:'2 4', pts:['斯里兰卡','缅甸蒲甘/英瓦','广东·岭南','上海']},
  ];

  return (
    <div style={{flex:1, position:'relative', overflow:'hidden'}}
      onPointerLeave={()=>pointers.current.clear()}>
      {/* MAP */}
      <div ref={containerRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{
          position:'absolute', inset:0,
          touchAction:'none', cursor: pointers.current.size>0 ? 'grabbing':'grab',
          background:
            'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(122,29,16,.10), transparent 70%), linear-gradient(180deg, #0a0807 0%, #15110d 100%)',
          overflow:'hidden',
        }}>
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet"
          style={{width:'100%', height:'100%', display:'block'}}>
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

          <g transform={`translate(${view.tx} ${view.ty}) scale(${view.scale})`}>
            <rect width={W} height={H} fill="url(#grid)"/>
            <rect width={W} height={H} fill="url(#grid2)"/>

            {/* China abstract outline */}
            <g opacity=".55" fill="none" stroke="rgba(201,162,74,.24)" strokeWidth="1">
              <path d={(()=>{
                const pts = [
                  [73,40],[78,42],[85,43],[92,42.5],[100,43],[110,44],[120,42],[125,40],
                  [128,35],[125,28],[120,22],[112,21],[108,20],[100,21],[97,19],[95,16],
                  [92,18],[85,20],[80,25],[75,32],[73,36],[73,40]
                ].map(p => project(p));
                return 'M' + pts.map(p=>p.join(' ')).join(' L') + ' Z';
              })()}/>
              <path d={(()=>{
                const pts = [[68,32],[75,34],[78,30],[80,25],[78,18],[80,12],[78,8],[75,7],[80,6],[82,8]].map(p=>project(p));
                return 'M' + pts.map(p=>p.join(' ')).join(' L');
              })()}/>
            </g>

            {/* heat blobs */}
            <g style={{mixBlendMode:'screen'}}>
              {D.nodes.map(n => { const [x,y]=project(n.coord); return <circle key={n.id} cx={x} cy={y} r={90} fill="url(#heatBlob)" opacity=".55"/>; })}
              {(() => { const [x,y] = project(nodeIndex['上海'].coord); return <circle cx={x} cy={y} r={170} fill="url(#heatBlob2)" opacity=".75"/>; })()}
            </g>

            {/* routes */}
            <g fill="none">
              {routes.map((r,i)=>{
                const pts = r.pts.map(name => project(nodeIndex[name].coord));
                let d = `M${pts[0][0]} ${pts[0][1]}`;
                for (let j=1;j<pts.length;j++){
                  const [x1,y1]=pts[j-1], [x2,y2]=pts[j];
                  const cx=(x1+x2)/2, cy=Math.min(y1,y2)-30 - i*8;
                  d += ` Q${cx} ${cy} ${x2} ${y2}`;
                }
                return <path key={i} d={d} stroke={r.color} strokeWidth="1.4" strokeDasharray={r.dash} opacity=".9"/>;
              })}
            </g>

            {/* nodes */}
            {filteredNodes.map(n => {
              const [x,y] = project(n.coord);
              const t = typeStyle[n.type] || typeStyle['非遗重镇'];
              const isSel = selId === n.id;
              return (
                <g key={n.id} style={{cursor:'pointer'}}
                  onPointerDown={(e)=>{e.stopPropagation(); pointers.current.clear();}}
                  onClick={(e)=>{e.stopPropagation(); setSelId(n.id);}}>
                  <circle cx={x} cy={y} r={t.size+12} fill={t.fill} opacity={isSel ? .45 : .14}/>
                  {n.type==='中枢' && <circle cx={x} cy={y} r={t.size+18} fill="none" stroke={t.fill} strokeWidth="0.8" opacity=".5">
                    <animate attributeName="r" values={`${t.size+10};${t.size+30};${t.size+10}`} dur="3s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values=".5;0;.5" dur="3s" repeatCount="indefinite"/>
                  </circle>}
                  <circle cx={x} cy={y} r={t.size} fill={t.fill} stroke={t.ring} strokeWidth={isSel?3:1.4}/>
                  {n.type==='中枢' && <circle cx={x} cy={y} r={t.size-5} fill="var(--gold-bright)"/>}
                  <text x={x+t.size+8} y={y+2} fill={isSel?'var(--gold-bright)':'var(--paper)'}
                    style={{fontFamily:'var(--serif)', fontSize: n.type==='中枢' ? 18 : 14, fontWeight: n.type==='中枢'?600:500, letterSpacing:'.08em', pointerEvents:'none'}}>
                    {n.name}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* TOP-RIGHT FILTER */}
      <div style={{position:'absolute', top:16, right:18, display:'flex', gap:6,
        padding:8, background:'rgba(15,12,9,.85)', border:'1px solid var(--line-strong)',
        backdropFilter:'blur(16px)'}}>
        {['全部', ...Object.keys(typeStyle)].map(f => {
          const ts = typeStyle[f];
          const count = f==='全部' ? D.nodes.length : D.nodes.filter(n=>n.type===f).length;
          return (
            <button key={f} onClick={()=>setFilter(f)} style={{
              minHeight:38, padding:'6px 12px', cursor:'pointer',
              background: filter===f ? 'var(--gold)' : 'transparent',
              color: filter===f ? 'var(--ink)' : 'var(--paper-2)',
              border:`1px solid ${filter===f?'var(--gold)':'var(--line)'}`,
              fontFamily:'var(--serif)', fontSize:13, fontWeight: filter===f?600:500, letterSpacing:'.1em',
              display:'inline-flex', alignItems:'center', gap:6,
              whiteSpace:'nowrap',
            }}>
              {ts && <span style={{width:8, height:8, borderRadius:'50%', background:ts.fill, border:`1px solid ${ts.ring}`}}/>}
              {f==='全部' ? '全部' : ts.label}
              <span style={{fontFamily:'var(--mono)', fontSize:10, opacity:.7, letterSpacing:'.2em'}}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* ZOOM CONTROLS — bottom-right, stacked with SCALE badge */}
      <div style={{position:'absolute', bottom:18, right:18, display:'flex', flexDirection:'column',
        background:'rgba(15,12,9,.85)', border:'1px solid var(--line-strong)', backdropFilter:'blur(16px)'}}>
        {[
          {l:'＋', fn:()=>zoomBy(1.3), title:'放大'},
          {l:'－', fn:()=>zoomBy(1/1.3), title:'縮小'},
          {l:'⌂', fn:resetView, title:'復位'},
        ].map((b,i)=>(
          <button key={i} onClick={b.fn} title={b.title}
            style={{width:44, height:44, padding:0, background:'transparent', border:'none', cursor:'pointer',
              color:'var(--gold-bright)', fontFamily:'var(--display)', fontSize:18, fontWeight:500,
              borderBottom:'1px solid var(--line)'}}>{b.l}</button>
        ))}
        <div style={{padding:'6px 8px', textAlign:'center',
          fontFamily:'var(--mono)', fontSize:9.5, color:'var(--paper-2)', letterSpacing:'.18em'}}>
          {(view.scale*100).toFixed(0)}%
        </div>
      </div>

      {/* LEGEND — routes only, compact */}
      <div style={{position:'absolute', bottom:18, left:18, padding:'10px 14px',
        background:'rgba(15,12,9,.85)', border:'1px solid var(--line-strong)', backdropFilter:'blur(16px)'}}>
        <div style={{fontFamily:'var(--mono)', fontSize:9, color:'var(--gold)', letterSpacing:'.3em', marginBottom:6}}>ROUTES · 跨境三線</div>
        {routes.map((r,i)=>(
          <div key={i} style={{display:'flex', alignItems:'center', gap:8, padding:'3px 0'}}>
            <svg width="28" height="6"><line x1="0" y1="3" x2="28" y2="3" stroke={r.color} strokeWidth="1.6" strokeDasharray={r.dash}/></svg>
            <span style={{fontFamily:'var(--serif)', fontSize:11.5, color:'var(--paper)', letterSpacing:'.08em'}}>{r.name}</span>
          </div>
        ))}
      </div>

      {/* GESTURE HINT (auto-fades) */}
      <GestureHint/>

      {/* BOTTOM SHEET — node detail */}
      <IpSheet open={!!sel} onClose={()=>setSelId(null)} height="50%">
        {sel && <NodeDetail node={sel} goto={goto}/>}
      </IpSheet>
    </div>
  );
};

const GestureHint = () => {
  const [show, setShow] = React.useState(true);
  React.useEffect(()=>{
    const t = setTimeout(()=>setShow(false), 4500);
    return ()=>clearTimeout(t);
  },[]);
  if (!show) return null;
  return (
    <div style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)',
      padding:'14px 24px', background:'rgba(15,12,9,.85)', border:'1px solid var(--gold)',
      backdropFilter:'blur(20px)', pointerEvents:'none',
      animation:'fadeOut 4.5s forwards'}}>
      <div style={{display:'flex', alignItems:'center', gap:18}}>
        <span style={{fontFamily:'var(--mono)', fontSize:10, color:'var(--gold)', letterSpacing:'.34em'}}>單指拖動 · 雙指縮放 · 點擊節點</span>
      </div>
    </div>
  );
};

const NodeDetail = ({ node, goto }) => {
  const D = window.APP_DATA;
  const related = D.crafts.filter(c => (c.city||'').includes(node.name) || node.name.includes(c.city) || (node.craft||'').includes(c.name));
  const typeColor = {'中枢':'var(--vermilion)', '非遗重镇':'var(--gold)', '非遗辐射':'var(--gold-deep)', '参照圣地':'var(--jade)', '跨境物源':'var(--bone)'}[node.type] || 'var(--gold)';
  return (
    <div>
      <div style={{display:'grid', gridTemplateColumns:'auto 1fr auto', gap:24, alignItems:'flex-start'}}>
        <IpSeal char={node.name[0]} size={72} color={typeColor} bg={node.type==='中枢'?'var(--vermilion)':'rgba(0,0,0,.3)'} stroke="var(--gold)"/>
        <div>
          <div style={{display:'flex', alignItems:'baseline', gap:14, marginBottom:6}}>
            <span style={{fontFamily:'var(--mono)', fontSize:11, color:'var(--gold)', letterSpacing:'.34em'}}>{node.id} · {node.type.toUpperCase()}</span>
            <span style={{fontFamily:'var(--mono)', fontSize:10, color:'var(--paper-3)', letterSpacing:'.24em'}}>{node.region}</span>
          </div>
          <h3 style={{fontFamily:'var(--serif)', fontSize:36, fontWeight:600, color:'var(--gold-bright)', letterSpacing:'.12em', lineHeight:1.05, marginBottom:10}}>{node.name}</h3>
          <div style={{display:'flex', gap:8, alignItems:'center', flexWrap:'wrap'}}>
            <Tier level={node.level}/>
            <span style={{fontFamily:'var(--mono)', fontSize:10, color:'var(--paper-3)', letterSpacing:'.22em'}}>{node.coord[0].toFixed(2)}°E · {node.coord[1].toFixed(2)}°N</span>
          </div>
        </div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1.2fr 1fr', gap:24, marginTop:22}}>
        <div>
          <IpField label="核心工藝" en="CRAFT" value={node.craft}/>
          <IpField label="項目角色" en="FUNCTION" value={node.role}/>
        </div>
        <div>
          <div style={{fontFamily:'var(--mono)', fontSize:10, color:'var(--gold)', letterSpacing:'.32em', marginBottom:10}}>
            關聯工藝 · LINKED CRAFTS · {related.length}
          </div>
          {related.length === 0 ? (
            <div style={{fontFamily:'var(--serif)', fontSize:12, color:'var(--paper-3)', padding:'14px 0'}}>無直接關聯工藝</div>
          ) : (
            <div style={{display:'flex', flexDirection:'column', gap:6}}>
              {related.slice(0,5).map(c=>(
                <button key={c.id} onClick={()=>goto({section:'genealogy', id:c.id})}
                  style={{display:'flex', alignItems:'center', gap:12, padding:'10px 12px', cursor:'pointer', textAlign:'left',
                    background:'rgba(0,0,0,.3)', border:'1px solid var(--line)', minHeight:50}}>
                  <span style={{fontFamily:'var(--mono)', fontSize:10, color:'var(--gold)', letterSpacing:'.22em', width:30}}>{c.id}</span>
                  <span style={{flex:1, fontFamily:'var(--serif)', fontSize:13, color:'var(--paper)', letterSpacing:'.06em'}}>{c.name}</span>
                  <Tier level={c.level}/>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

window.IpMap = IpMap;
