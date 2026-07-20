// Works × craft matrix — data-driven 33 works × 27 crafts grid + detail.

const photoUrl = (p) => p ? p.split('/').map(encodeURIComponent).join('/') : '';
const mediaUrl = (p) => window.makeMediaAssetUrl ? window.makeMediaAssetUrl(p) : photoUrl(p);
const craftLabel = (key) => String(key || '').replace(/^C\d{2}\s*/, '');
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const WORK_MATRIX_HIDDEN_CRAFT_NAMES = new Set([
  '景德镇手工制瓷·瓷板微绘',
  '热贡艺术(青海唐卡)',
  '玉佛禅寺·雕版印刷佛像',
  '玉佛旧木香灰祈福绣球',
  '尼泊尔纽瓦力画派',
  '藏传噶当塔造型',
  '五台山白塔造型',
  '法门寺唐代金函制式',
  '菩提子/紫檀念珠',
  '印度小叶紫檀加工',
  '缅甸古玉工·英瓦造像',
]);
const WORK_STRUCTURE_PHOTO = '结构图.jpg';

const getWorkGallery = (work) => {
  if (!work) return [];
  const semanticImages = [
    work.buddhaPhoto,
    work.frontPhoto,
    work.thangkaPhoto,
    ...(work.otherPhotos || []),
  ];
  const images = Array.isArray(work.galleryPhotos) && work.galleryPhotos.length
    ? work.galleryPhotos
    : semanticImages.some(Boolean)
      ? [...semanticImages, work.detailPhoto]
      : [work.photo, work.detailPhoto];
  const imagesWithStructure = [...images.filter(src => src !== WORK_STRUCTURE_PHOTO), WORK_STRUCTURE_PHOTO];
  const seen = new Set();
  return imagesWithStructure.filter(Boolean).filter((src) => {
    if (seen.has(src)) return false;
    seen.add(src);
    return true;
  });
};

const getMediaSrc = (item) => typeof item === 'string' ? item : item?.src;
const getMediaType = (item) => typeof item === 'string' ? 'image' : item?.type;

const getWorkMedia = (work) => {
  if (!work) return [];
  const imageItems = getWorkGallery(work).map(src => ({type:'image', src}));
  const videoItems = (work.videoUrls || []).filter(Boolean).map(src => ({type:'video', src}));
  return [...imageItems, ...videoItems];
};

const getWorkVideoPoster = (work) => work?.buddhaPhoto || work?.photo || getWorkGallery(work)[0];

const IconButton = ({ children, onClick, title, disabled, style }) => (
  <button
    type="button"
    title={title}
    aria-label={title}
    disabled={disabled}
    onClick={onClick}
    style={{
      width:34,
      height:34,
      border:'1px solid var(--line-strong)',
      background: disabled ? 'rgba(201,162,74,.04)' : 'rgba(10,8,6,.78)',
      color: disabled ? 'rgba(214,201,168,.35)' : 'var(--gold-bright)',
      cursor: disabled ? 'default' : 'pointer',
      fontFamily:'var(--mono)',
      fontSize:15,
      display:'inline-flex',
      alignItems:'center',
      justifyContent:'center',
      ...style,
    }}
  >
    {children}
  </button>
);

const WorkPhotoCarousel = ({ work, gallery, activeIndex, onActiveIndex, onOpen }) => {
  const hasMany = gallery.length > 1;
  const activeItem = gallery[activeIndex] || gallery[0];
  const activeSrc = getMediaSrc(activeItem);
  const activeType = getMediaType(activeItem);
  const isActiveVideo = activeType === 'video';
  const videoPoster = getWorkVideoPoster(work);

  const go = (delta) => {
    if (!gallery.length) return;
    onActiveIndex((activeIndex + delta + gallery.length) % gallery.length);
  };

  return (
    <div>
      <div
        onClick={() => activeSrc && !isActiveVideo && onOpen(activeIndex)}
        style={{
          aspectRatio:'4/3',
          background:'repeating-linear-gradient(45deg, rgba(201,162,74,.08) 0 6px, transparent 6px 14px), linear-gradient(135deg, #1a1410, #0e0a07)',
          border:'1px solid var(--line-strong)',
          position:'relative',
          display:'flex',
          alignItems:'center',
          justifyContent:'center',
          overflow:'hidden',
          cursor: activeSrc && !isActiveVideo ? 'zoom-in' : 'default',
        }}
      >
        <KanjiSeal char={work.name[0]} size={70} color="rgba(201,162,74,.4)"/>
        {activeSrc && !isActiveVideo && (
          <img
            src={photoUrl(activeSrc)}
            alt={`${work.name} ${activeIndex + 1}`}
            onError={(e)=>{ e.currentTarget.style.display='none'; }}
            style={{
              position:'absolute',
              inset:0,
              width:'100%',
              height:'100%',
              objectFit:'contain',
              background:'linear-gradient(135deg, #1a1410, #0e0a07)',
            }}
          />
        )}
        {activeSrc && isActiveVideo && (
          <video
            src={mediaUrl(activeSrc)}
            poster={videoPoster ? photoUrl(videoPoster) : undefined}
            controls
            playsInline
            preload="metadata"
            onClick={(e)=>e.stopPropagation()}
            style={{
              position:'absolute',
              inset:0,
              width:'100%',
              height:'100%',
              objectFit:'contain',
              background:'linear-gradient(135deg, #1a1410, #0e0a07)',
            }}
          />
        )}
        {hasMany && (
          <>
            <IconButton
              title="上一张"
              onClick={(e)=>{ e.stopPropagation(); go(-1); }}
              style={{position:'absolute', left:8, top:'50%', transform:'translateY(-50%)', zIndex:3}}
            >←</IconButton>
            <IconButton
              title="下一张"
              onClick={(e)=>{ e.stopPropagation(); go(1); }}
              style={{position:'absolute', right:8, top:'50%', transform:'translateY(-50%)', zIndex:3}}
            >→</IconButton>
          </>
        )}
        <div style={{position:'absolute', top:8, left:10, fontFamily:'var(--mono)', fontSize:9, color:'var(--gold)', letterSpacing:'.24em', zIndex:2, textShadow:'0 1px 2px rgba(0,0,0,.8)'}}>
          {String(activeIndex + 1).padStart(2,'0')} / {String(Math.max(gallery.length, 1)).padStart(2,'0')}
        </div>
        <div style={{position:'absolute', bottom:8, right:10, fontFamily:'var(--mono)', fontSize:9, color:'var(--paper-3)', letterSpacing:'.2em', zIndex:2, textShadow:'0 1px 2px rgba(0,0,0,.8)'}}>{isActiveVideo ? 'WORK VIDEO' : 'WORK PHOTO'} · {work.id}</div>
      </div>

      {hasMany && (
        <div style={{display:'grid', gridTemplateColumns:`repeat(${Math.min(gallery.length, 5)}, minmax(0, 1fr))`, gap:6, marginTop:8}}>
          {gallery.map((item, i)=>{
            const src = getMediaSrc(item);
            const type = getMediaType(item);
            const isVideo = type === 'video';
            return (
            <button
              type="button"
              key={`${type}-${src}-${i}`}
              title={`${isVideo ? '视频' : '图片'} ${i + 1}`}
              aria-label={`${isVideo ? '视频' : '图片'} ${i + 1}`}
              onClick={()=>onActiveIndex(i)}
              style={{
                height:46,
                border:i === activeIndex ? '1px solid var(--gold-bright)' : '1px solid var(--line-bone)',
                background:'#100b08',
                padding:0,
                cursor:'pointer',
                opacity:i === activeIndex ? 1 : .62,
                overflow:'hidden',
                position:'relative',
              }}
            >
              {isVideo ? (
                <>
                  <video
                    src={mediaUrl(src)}
                    poster={videoPoster ? photoUrl(videoPoster) : undefined}
                    muted
                    playsInline
                    preload="metadata"
                    style={{width:'100%', height:'100%', objectFit:'cover', display:'block'}}
                  />
                  <span style={{position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--gold-bright)', background:'rgba(0,0,0,.22)', fontFamily:'var(--mono)', fontSize:14}}>▶</span>
                </>
              ) : (
                <img
                  src={photoUrl(src)}
                  alt=""
                  onError={(e)=>{ e.currentTarget.style.display='none'; }}
                  style={{width:'100%', height:'100%', objectFit:'cover', display:'block'}}
                />
              )}
            </button>
          )})}
        </div>
      )}
    </div>
  );
};

const WorkPhotoLightbox = ({ work, gallery, activeIndex, onActiveIndex, onClose }) => {
  const [scale, setScale] = React.useState(1);
  const [offset, setOffset] = React.useState({x:0, y:0});
  const pointersRef = React.useRef(new Map());
  const pinchRef = React.useRef(null);
  const activeItem = gallery[activeIndex] || gallery[0];
  const activeSrc = getMediaSrc(activeItem);
  const activeType = getMediaType(activeItem);
  const isActiveVideo = activeType === 'video';
  const videoPoster = getWorkVideoPoster(work);
  const hasMany = gallery.length > 1;

  React.useEffect(() => {
    setScale(1);
    setOffset({x:0, y:0});
    pointersRef.current.clear();
    pinchRef.current = null;
  }, [work.id, activeIndex]);

  const setZoom = (nextScale) => {
    const value = clamp(nextScale, 1, 4);
    setScale(value);
    if (value === 1) setOffset({x:0, y:0});
  };

  const go = (delta) => {
    if (!gallery.length) return;
    onActiveIndex((activeIndex + delta + gallery.length) % gallery.length);
  };

  const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

  const onPointerDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    pointersRef.current.set(e.pointerId, {x:e.clientX, y:e.clientY});
  };

  const onPointerMove = (e) => {
    if (!pointersRef.current.has(e.pointerId)) return;
    const previous = pointersRef.current.get(e.pointerId);
    pointersRef.current.set(e.pointerId, {x:e.clientX, y:e.clientY});
    const pointers = Array.from(pointersRef.current.values());

    if (pointers.length >= 2) {
      const currentDistance = distance(pointers[0], pointers[1]);
      if (pinchRef.current) {
        const delta = currentDistance / pinchRef.current.distance;
        const nextScale = clamp(pinchRef.current.scale * delta, 1, 4);
        setScale(nextScale);
        if (nextScale === 1) setOffset({x:0, y:0});
        pinchRef.current = {distance:currentDistance, scale:nextScale};
        return;
      }
      pinchRef.current = {distance:currentDistance, scale};
      return;
    }

    if (scale > 1 && previous) {
      setOffset(pos => ({x:pos.x + e.clientX - previous.x, y:pos.y + e.clientY - previous.y}));
    }
  };

  const onPointerEnd = (e) => {
    pointersRef.current.delete(e.pointerId);
    pinchRef.current = null;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position:'fixed',
        inset:0,
        zIndex:999,
        background:'rgba(6,4,3,.94)',
        display:'flex',
        flexDirection:'column',
        color:'var(--paper)',
      }}
    >
      <div style={{height:58, flex:'0 0 auto', display:'flex', alignItems:'center', gap:10, padding:'10px 16px', borderBottom:'1px solid var(--line-strong)', background:'rgba(10,8,6,.86)'}}>
        <div style={{minWidth:0, flex:1}}>
          <div style={{fontFamily:'var(--mono)', fontSize:9, color:'var(--gold)', letterSpacing:'.28em'}}>WORK · {work.id} · {String(activeIndex + 1).padStart(2,'0')}/{String(gallery.length).padStart(2,'0')}</div>
          <div style={{fontFamily:'var(--serif)', fontSize:15, color:'var(--paper)', letterSpacing:'.08em', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', marginTop:2}}>{work.name}</div>
        </div>
        {hasMany && <IconButton title="上一张" onClick={()=>go(-1)}>←</IconButton>}
        {hasMany && <IconButton title="下一张" onClick={()=>go(1)}>→</IconButton>}
        {!isActiveVideo && <IconButton title="缩小" onClick={()=>setZoom(scale - .5)} disabled={scale <= 1}>−</IconButton>}
        {!isActiveVideo && <IconButton title="放大" onClick={()=>setZoom(scale + .5)} disabled={scale >= 4}>+</IconButton>}
        {!isActiveVideo && <IconButton title="复位" onClick={()=>setZoom(1)}>1:1</IconButton>}
        <IconButton title="关闭" onClick={onClose}>×</IconButton>
      </div>

      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        onDoubleClick={()=>setZoom(scale > 1 ? 1 : 2)}
        style={{
          flex:1,
          minHeight:0,
          position:'relative',
          overflow:'hidden',
          display:'flex',
          alignItems:'center',
          justifyContent:'center',
          touchAction:'none',
          cursor:scale > 1 ? 'grab' : 'zoom-in',
          userSelect:'none',
        }}
      >
        {activeSrc && !isActiveVideo && (
          <img
            src={photoUrl(activeSrc)}
            alt={work.name}
            draggable={false}
            style={{
              maxWidth:'96vw',
              maxHeight:'calc(100vh - 92px)',
              objectFit:'contain',
              transform:`translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
              transformOrigin:'center center',
              transition:pointersRef.current.size ? 'none' : 'transform .14s ease',
              display:'block',
            }}
          />
        )}
        {activeSrc && isActiveVideo && (
          <video
            src={mediaUrl(activeSrc)}
            poster={videoPoster ? photoUrl(videoPoster) : undefined}
            controls
            playsInline
            preload="metadata"
            onPointerDown={(e)=>e.stopPropagation()}
            onDoubleClick={(e)=>e.stopPropagation()}
            style={{
              maxWidth:'96vw',
              maxHeight:'calc(100vh - 92px)',
              objectFit:'contain',
              display:'block',
              background:'#050403',
            }}
          />
        )}
      </div>
    </div>
  );
};

const Works = ({ query }) => {
  const D = window.APP_DATA;
  const craftKeys = React.useMemo(() => {
    const keys = Array.isArray(D.workCraftKeys) && D.workCraftKeys.length
      ? D.workCraftKeys
      : Array.from(new Set(D.works.flatMap(w => Object.keys(w.crafts || {}))));
    return keys.filter(key => !WORK_MATRIX_HIDDEN_CRAFT_NAMES.has(craftLabel(key)));
  }, [D]);

  const [hover, setHover] = React.useState(null);
  const [selectedWork, setSelectedWork] = React.useState(D.works[0]);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = React.useState(0);
  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const normalizedQuery = (query || '').trim();

  const works = D.works.filter(w => {
    if (!normalizedQuery) return true;
    return `${w.id}${w.name}${w.edition}${w.size}${w.parts}${w.hours}${w.description}${(w.videoUrls || []).join('')}`.includes(normalizedQuery);
  });

  React.useEffect(() => {
    if (works[0] && (!selectedWork || !works.some(w => w.id === selectedWork.id))) setSelectedWork(works[0]);
  }, [selectedWork, works]);

  React.useEffect(() => {
    setSelectedPhotoIndex(0);
    setLightboxOpen(false);
  }, [selectedWork && selectedWork.id]);

  const totals = craftKeys.map(k => works.filter(w => w.crafts && w.crafts[k]).length);
  const gridTemplate = `56px minmax(220px,260px) 82px repeat(${craftKeys.length}, 46px)`;
  const gallery = getWorkMedia(selectedWork);
  const selectedCrafts = selectedWork ? craftKeys.filter(k => selectedWork.crafts && selectedWork.crafts[k]) : [];

  return (
    <div style={{paddingTop:18}}>
      <Divider label={`WORKS × CRAFT MATRIX · ${D.works.length} 件 × ${craftKeys.length} 工藝`}/>

      <div style={{display:'grid', gridTemplateColumns:'minmax(0,1fr) 360px', gap:18, position:'relative'}}>
        <div style={{minWidth:0, border:'1px solid var(--line)', overflow:'auto', background:'rgba(0,0,0,.3)'}}>
          <div style={{display:'grid', gridTemplateColumns:gridTemplate,
            background:'rgba(201,162,74,.06)', borderBottom:'1px solid var(--line)', position:'sticky', top:0, zIndex:5, minWidth:'max-content'}}>
            <div style={{padding:'10px 8px', fontFamily:'var(--mono)', fontSize:9.5, color:'var(--gold)', letterSpacing:'.2em'}}>編號</div>
            <div style={{padding:'10px 12px', fontFamily:'var(--mono)', fontSize:9.5, color:'var(--gold)', letterSpacing:'.2em'}}>作品名 · WORK</div>
            <div style={{padding:'10px 8px', fontFamily:'var(--mono)', fontSize:9.5, color:'var(--gold)', letterSpacing:'.2em'}}>版別</div>
            {craftKeys.map(k=>(
              <div key={k} title={k} style={{padding:'10px 4px', fontFamily:'var(--serif)', fontSize:10, color:'var(--gold)',
                lineHeight:1.15, writingMode:'vertical-rl', textOrientation:'mixed', height:148, textAlign:'right'}}>
                <span>{craftLabel(k)}</span>
              </div>
            ))}
          </div>

          {works.map((w,i)=>{
            const active = selectedWork?.id===w.id;
            return (
              <div key={w.id} onClick={()=>setSelectedWork(w)}
                style={{display:'grid', gridTemplateColumns:gridTemplate, minWidth:'max-content',
                  borderBottom: i<works.length-1?'1px solid var(--line-bone)':'none',
                  cursor:'pointer',
                  background: active ? 'rgba(201,162,74,.08)' : 'transparent',
                  borderLeft: active?'2px solid var(--gold)':'2px solid transparent'}}>
                <div style={{padding:'12px 8px', fontFamily:'var(--mono)', fontSize:10, color:'var(--gold)', letterSpacing:'.18em'}}>{w.id}</div>
                <div style={{padding:'12px'}}>
                  <div style={{fontFamily:'var(--serif)', fontSize:13, color: active?'var(--gold-bright)':'var(--paper)', fontWeight:500, lineHeight:1.35}}>{w.name}</div>
                  <div style={{fontFamily:'var(--mono)', fontSize:9, color:'var(--paper-3)', letterSpacing:'.1em', marginTop:2}}>{w.size}</div>
                </div>
                <div style={{padding:'12px 8px', fontFamily:'var(--serif)', fontSize:11, color:'var(--paper-2)'}}>{w.edition}</div>
                {craftKeys.map(k=>{
                  const v = w.crafts && w.crafts[k];
                  const isHover = hover && hover.wId===w.id && hover.cKey===k;
                  return (
                    <div key={k} title={`${w.name} · ${k}`}
                      onMouseEnter={()=>setHover({wId:w.id, cKey:k})}
                      onMouseLeave={()=>setHover(null)}
                      style={{display:'flex', alignItems:'center', justifyContent:'center',
                        background: isHover ? 'rgba(232,199,115,.12)' : (v ? 'rgba(201,162,74,.04)' : 'transparent'),
                        borderLeft:'1px solid var(--line-bone)'}}>
                      {v ? (
                        <span style={{width:17, height:17, borderRadius:'50%',
                          background:'radial-gradient(circle, var(--gold-bright), var(--gold-deep))',
                          boxShadow:'0 0 6px rgba(201,162,74,.6)', display:'inline-block'}}/>
                      ) : (
                        <span style={{width:6, height:1, background:'var(--paper-3)', opacity:.3}}/>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}

          <div style={{display:'grid', gridTemplateColumns:gridTemplate, minWidth:'max-content',
            background:'rgba(184,51,31,.08)', borderTop:'1px solid var(--line-strong)'}}>
            <div style={{padding:'10px 8px', fontFamily:'var(--mono)', fontSize:9.5, color:'var(--vermilion)', letterSpacing:'.2em'}}>Σ</div>
            <div style={{padding:'10px 12px', fontFamily:'var(--serif)', fontSize:11.5, color:'var(--vermilion)', letterSpacing:'.1em'}}>命中合計 · HIT TOTALS</div>
            <div></div>
            {totals.map((t,i)=>(
              <div key={i} style={{padding:'10px 4px', fontFamily:'var(--display)', fontSize:18, color:'var(--gold-bright)', textAlign:'center', fontWeight:600}}>{t}</div>
            ))}
          </div>
        </div>

        {selectedWork && (
          <aside style={{
            border:'1px solid var(--line)',
            background:'rgba(0,0,0,.4)',
            padding:20,
            alignSelf:'start',
            position:'sticky',
            top:0,
            maxHeight:'calc(100vh - 128px)',
            overflowY:'auto',
            overscrollBehavior:'contain',
          }}>
            <div style={{fontFamily:'var(--mono)', fontSize:9.5, color:'var(--gold)', letterSpacing:'.3em'}}>WORK · {selectedWork.id} · {selectedWork.edition}</div>
            <h2 style={{fontFamily:'var(--serif)', fontSize:25, color:'var(--gold-bright)', fontWeight:600, letterSpacing:'.04em', marginTop:6, lineHeight:1.2}}>{selectedWork.name}</h2>
            <div style={{fontFamily:'var(--mono)', fontSize:10.5, color:'var(--paper-3)', letterSpacing:'.12em', marginTop:6}}>{selectedWork.size}</div>

            <div style={{margin:'18px 0', height:1, background:'linear-gradient(to right, var(--gold), transparent)'}}/>

            <WorkPhotoCarousel
              work={selectedWork}
              gallery={gallery}
              activeIndex={Math.min(selectedPhotoIndex, Math.max(gallery.length - 1, 0))}
              onActiveIndex={setSelectedPhotoIndex}
              onOpen={(index)=>{ setSelectedPhotoIndex(index); setLightboxOpen(true); }}
            />

            <div style={{marginTop:18}}>
              <div style={{fontFamily:'var(--mono)', fontSize:9, color:'var(--paper-3)', letterSpacing:'.3em', marginBottom:10}}>命中工藝 · CRAFTS · {selectedCrafts.length}/{craftKeys.length}</div>
              <div style={{display:'flex', flexWrap:'wrap', gap:6}}>
                {selectedCrafts.map(k=><Tag key={k} color="国家级">{craftLabel(k)}</Tag>)}
              </div>
            </div>

            {selectedWork.description && (
              <div style={{padding:'14px 0', marginTop:14, borderTop:'1px solid var(--line-bone)'}}>
                <div style={{fontFamily:'var(--mono)', fontSize:9, color:'var(--paper-3)', letterSpacing:'.3em', marginBottom:4}}>简介 · DESCRIPTION</div>
                <div style={{fontFamily:'var(--serif)', fontSize:13, color:'var(--paper)', lineHeight:1.65, whiteSpace:'pre-line'}}>{selectedWork.description}</div>
              </div>
            )}
          </aside>
        )}

        {lightboxOpen && selectedWork && gallery.length > 0 && (
          <WorkPhotoLightbox
            work={selectedWork}
            gallery={gallery}
            activeIndex={Math.min(selectedPhotoIndex, Math.max(gallery.length - 1, 0))}
            onActiveIndex={setSelectedPhotoIndex}
            onClose={()=>setLightboxOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

window.Works = Works;
