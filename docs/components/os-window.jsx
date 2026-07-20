// Draggable / resizable / focusable / minimizable window component.

const OSWindow = ({ win, focused, onFocus, onClose, onMinimize, onMaximize, onMove, onResize, children }) => {
  const dragState = React.useRef(null);
  const winRef = React.useRef(null);

  const startDrag = (e, mode='move', edge=null) => {
    // Allow primary mouse button OR any touch/pen pointer
    if (e.button !== undefined && e.button !== 0 && e.pointerType === 'mouse') return;
    e.preventDefault();
    e.stopPropagation();
    onFocus();
    const target = e.currentTarget;
    try { target.setPointerCapture(e.pointerId); } catch(_) {}
    dragState.current = {
      mode, edge, pointerId: e.pointerId, target,
      startX: e.clientX, startY: e.clientY,
      x: win.x, y: win.y, w: win.w, h: win.h,
    };
    const move = (ev) => {
      const s = dragState.current; if (!s || ev.pointerId !== s.pointerId) return;
      const dx = ev.clientX - s.startX, dy = ev.clientY - s.startY;
      if (s.mode === 'move') {
        onMove(win.id, {x: Math.max(0, s.x+dx), y: Math.max(28, s.y+dy)});
      } else {
        let {x,y,w,h} = s;
        if (edge.includes('e')) w = Math.max(360, s.w + dx);
        if (edge.includes('s')) h = Math.max(220, s.h + dy);
        if (edge.includes('w')) { w = Math.max(360, s.w - dx); x = s.x + (s.w - w); }
        if (edge.includes('n')) { h = Math.max(220, s.h - dy); y = Math.max(28, s.y + (s.h - h)); }
        onResize(win.id, {x,y,w,h});
      }
    };
    const up = (ev) => {
      const s = dragState.current;
      if (s && ev.pointerId === s.pointerId) {
        try { s.target.releasePointerCapture(s.pointerId); } catch(_) {}
        dragState.current = null;
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
        window.removeEventListener('pointercancel', up);
      }
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
  };

  if (win.minimized) return null;

  const isMax = win.maximized;
  const style = isMax
    ? { left:0, top:28, width:'100vw', height:'calc(100vh - 28px - 92px)' }
    : { left: win.x, top: win.y, width: win.w, height: win.h };

  return (
    <div ref={winRef}
      onPointerDown={onFocus}
      className="os-window"
      style={{
        position:'absolute', ...style,
        zIndex: win.z,
        background:'linear-gradient(180deg, rgba(20,16,12,.96), rgba(13,10,8,.96))',
        border: focused ? '1px solid rgba(201,162,74,.6)' : '1px solid rgba(201,162,74,.18)',
        boxShadow: focused
          ? '0 30px 80px rgba(0,0,0,.7), 0 0 0 1px rgba(232,199,115,.18), 0 0 40px rgba(184,51,31,.08)'
          : '0 18px 50px rgba(0,0,0,.55)',
        display:'flex', flexDirection:'column',
        backdropFilter:'blur(20px)',
        transition: focused ? 'border-color .2s, box-shadow .2s' : 'none',
      }}>
      {/* Title bar */}
      <div onPointerDown={(e)=>!isMax && startDrag(e,'move')}
        onDoubleClick={() => onMaximize(win.id)}
        style={{
          display:'flex', alignItems:'center', gap:14,
          padding:'10px 14px',
          borderBottom: focused ? '1px solid rgba(201,162,74,.32)' : '1px solid rgba(201,162,74,.10)',
          background: focused
            ? 'linear-gradient(180deg, rgba(201,162,74,.10), rgba(184,51,31,.04))'
            : 'rgba(0,0,0,.3)',
          cursor: isMax ? 'default' : 'move',
        }}>
        {/* Traffic lights — luxe style */}
        <div style={{display:'flex', gap:7}}>
          {/* Larger touch hit area achieved via padding + transparent button */}
          {[
            {bg:'var(--vermilion)', bd:'rgba(184,51,31,.7)', title:'關閉', fn:()=>onClose(win.id)},
            {bg:'var(--gold)',      bd:'rgba(201,162,74,.7)', title:'收於塢', fn:()=>onMinimize(win.id)},
            {bg:'var(--jade)',      bd:'rgba(74,138,122,.7)', title:'全屏',   fn:()=>onMaximize(win.id)},
          ].map((b,i)=>(
            <button key={i} onPointerDown={(e)=>{e.stopPropagation();}} onClick={(e)=>{e.stopPropagation(); b.fn();}} title={b.title}
              style={{width:16, height:16, padding:0, borderRadius:'50%', border:'none', background:'transparent', cursor:'pointer',
                display:'flex', alignItems:'center', justifyContent:'center'}}>
              <span style={{width:12, height:12, borderRadius:'50%', border:`1px solid ${b.bd}`,
                background: focused ? b.bg : 'transparent', display:'block'}}/>
            </button>
          ))}
        </div>
        {/* Seal char + title */}
        <div style={{width:22, height:22, border:'1px solid var(--gold)', display:'flex', alignItems:'center', justifyContent:'center',
          color:'var(--gold)', fontFamily:'var(--serif)', fontSize:13, fontWeight:600, background:'rgba(184,51,31,.18)'}}>
          {win.seal}
        </div>
        <div style={{flex:1, display:'flex', alignItems:'baseline', gap:10, minWidth:0}}>
          <span style={{fontFamily:'var(--serif)', fontSize:13, fontWeight:600, color: focused?'var(--gold-bright)':'var(--paper-2)', letterSpacing:'.18em', whiteSpace:'nowrap'}}>{win.title}</span>
          <span style={{fontFamily:'var(--mono)', fontSize:9.5, color:'var(--paper-3)', letterSpacing:'.3em', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{win.subtitle}</span>
        </div>
        <div style={{fontFamily:'var(--mono)', fontSize:9, color:'var(--paper-3)', letterSpacing:'.3em'}}>WIN · {win.id.toUpperCase()}</div>
      </div>

      {/* Body */}
      <div className="os-window-body" style={{
        flex:1, overflow:'auto', position:'relative',
        background:'rgba(0,0,0,.18)',
      }}>
        <div style={{padding:'14px 18px 20px'}}>
          {children}
        </div>
      </div>

      {/* Status bar */}
      <div style={{display:'flex', justifyContent:'space-between', padding:'5px 12px',
        borderTop:'1px solid var(--line-bone)', background:'rgba(0,0,0,.45)',
        fontFamily:'var(--mono)', fontSize:9, color:'var(--paper-3)', letterSpacing:'.22em'}}>
        <span>{win.statusLeft || '隨身寺廟 OS · v1.0'}</span>
        <span style={{color: focused ? 'var(--gold)':'var(--paper-3)'}}>{focused ? '◉ FOCUSED' : '○ IDLE'}</span>
        <span>{Math.round(isMax ? window.innerWidth : win.w)} × {Math.round(isMax ? window.innerHeight-120 : win.h)}</span>
      </div>

      {/* Resize handles — bigger on touch, with visible SE grip */}
      {!isMax && (
        <>
          {['n','s','e','w','ne','nw','se','sw'].map(edge => {
            const isTouch = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
            const t = isTouch ? 14 : 6;
            const c = isTouch ? 22 : 12;
            const styles = {
              n: {top:-t/2, left:12, right:12, height:t, cursor:'ns-resize'},
              s: {bottom:-t/2, left:12, right:12, height:t, cursor:'ns-resize'},
              e: {right:-t/2, top:12, bottom:12, width:t, cursor:'ew-resize'},
              w: {left:-t/2, top:12, bottom:12, width:t, cursor:'ew-resize'},
              ne:{right:-t/2, top:-t/2, width:c, height:c, cursor:'nesw-resize'},
              nw:{left:-t/2, top:-t/2, width:c, height:c, cursor:'nwse-resize'},
              se:{right:-t/2, bottom:-t/2, width:c, height:c, cursor:'nwse-resize'},
              sw:{left:-t/2, bottom:-t/2, width:c, height:c, cursor:'nesw-resize'},
            };
            return <div key={edge} className="resize-edge" onPointerDown={(e)=>startDrag(e,'resize',edge)}
              style={{position:'absolute', touchAction:'none', ...styles[edge]}}>
              {edge==='se' && <svg width="100%" height="100%" viewBox="0 0 12 12" style={{position:'absolute', inset:0, opacity:.5, pointerEvents:'none'}}>
                <path d="M2 10 L10 2 M5 11 L11 5 M8 11 L11 8" stroke="var(--gold)" strokeWidth="0.8"/>
              </svg>}
            </div>;
          })}
        </>
      )}
    </div>
  );
};

window.OSWindow = OSWindow;
