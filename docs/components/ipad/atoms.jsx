// iPad primitives — buttons, cards, drop-caps, ornaments, sheets, vertical columns.

const IpSeal = ({ char, size=44, color='var(--vermilion)', bg='transparent', stroke }) => (
  <div style={{
    width:size, height:size,
    display:'inline-flex', alignItems:'center', justifyContent:'center',
    background: bg,
    border: `${size>=44?2:1.5}px solid ${stroke||color}`,
    color: color === 'var(--vermilion)' ? 'var(--paper)' : color,
    fontFamily:'var(--serif)', fontWeight:700,
    fontSize: size*0.55, lineHeight:1,
    letterSpacing:0,
    flexShrink:0,
  }}>{char}</div>
);

// Cartouche corner — gold L-bracket for window/page corners
const Cartouche = ({ size=18, color='var(--gold)' }) => (
  <span style={{width:size, height:size, position:'relative', display:'inline-block'}}>
    <span style={{position:'absolute', left:0, top:0, width:size*0.6, height:1.5, background:color}}/>
    <span style={{position:'absolute', left:0, top:0, width:1.5, height:size*0.6, background:color}}/>
  </span>
);

// Page wrapper with corner ornaments + label
const IpPage = ({ label, title, en, children, sidebar }) => (
  <div style={{flex:1, position:'relative', overflow:'hidden', display:'flex', flexDirection:'column'}}>
    {/* Corner ornaments */}
    {[
      {top:24,    left:24,  rot:0},
      {top:24,    right:24, rot:90},
      {bottom:24, right:24, rot:180},
      {bottom:24, left:24,  rot:270},
    ].map((c,i)=>(
      <div key={i} style={{position:'absolute', ...c, zIndex:1, opacity:.5, pointerEvents:'none', transform:`rotate(${c.rot}deg)`}}>
        <Cartouche size={22}/>
      </div>
    ))}
    {/* Title row */}
    {(label || title) && (
      <header style={{padding:'24px 40px 18px', display:'flex', alignItems:'flex-end', gap:24, position:'relative', zIndex:2}}>
        {label && <div style={{fontFamily:'var(--mono)', fontSize:11, color:'var(--gold)', letterSpacing:'.4em', writingMode:'vertical-rl', textOrientation:'mixed', alignSelf:'flex-start', paddingTop:6}}>{label}</div>}
        {title && (
          <div style={{flex:1}}>
            <h1 style={{fontFamily:'var(--serif)', fontSize:40, fontWeight:600, color:'var(--gold-bright)', letterSpacing:'.16em', lineHeight:1.1}}>{title}</h1>
            {en && <div style={{fontFamily:'var(--mono)', fontSize:11, color:'var(--paper-3)', letterSpacing:'.42em', marginTop:8}}>{en}</div>}
          </div>
        )}
        {sidebar}
      </header>
    )}
    <div style={{flex:1, overflow:'hidden', display:'flex', position:'relative', zIndex:2}}>
      {children}
    </div>
  </div>
);

// Vertical column of Chinese characters
const VColumn = ({ text, color='var(--gold)', size=14, gap='.4em' }) => (
  <div style={{
    writingMode:'vertical-rl', textOrientation:'mixed',
    fontFamily:'var(--serif)', color, fontSize:size, letterSpacing: gap,
    fontWeight:500, lineHeight:1.8, userSelect:'none',
  }}>{text}</div>
);

// Big "row" with hairline divider for list items
const IpRow = ({ left, primary, secondary, right, active, onClick, height=72, accent='var(--gold)' }) => (
  <button onClick={onClick} style={{
    display:'flex', alignItems:'center', gap:14,
    width:'100%', minHeight: height, padding:'10px 20px',
    background: active ? 'linear-gradient(to right, rgba(201,162,74,.10), transparent 80%)' : 'transparent',
    border:'none', borderLeft: active ? `2px solid ${accent}` : '2px solid transparent',
    borderBottom:'1px solid var(--line-bone)',
    textAlign:'left', cursor:'pointer',
    transition:'background .18s ease',
  }}>
    {left}
    <div style={{flex:1, minWidth:0}}>
      <div style={{fontFamily:'var(--serif)', fontSize:16, fontWeight: active?600:500,
        color: active?'var(--gold-bright)':'var(--paper)', letterSpacing:'.08em', textWrap:'pretty'}}>{primary}</div>
      {secondary && <div style={{fontFamily:'var(--mono)', fontSize:10, color:'var(--paper-3)', letterSpacing:'.22em', marginTop:3}}>{secondary}</div>}
    </div>
    {right}
  </button>
);

// Tier chip — small, calligraphed, three styles
const Tier = ({ level }) => {
  const map = {
    '世界级': {fg:'#e8a899', bd:'rgba(184,51,31,.55)', bg:'rgba(184,51,31,.18)'},
    '国家级': {fg:'var(--gold-bright)', bd:'rgba(201,162,74,.55)', bg:'rgba(201,162,74,.14)'},
    '省级':   {fg:'#9bccbb', bd:'rgba(74,138,122,.55)', bg:'rgba(74,138,122,.14)'},
    '跨境':   {fg:'var(--bone)', bd:'rgba(214,201,168,.4)', bg:'rgba(214,201,168,.08)'},
  };
  const k = Object.keys(map).find(k => (level||'').includes(k)) || '跨境';
  const c = map[k];
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:5,
      padding:'4px 10px',
      fontFamily:'var(--serif)', fontSize:11, letterSpacing:'.18em',
      color:c.fg, background:c.bg, border:`1px solid ${c.bd}`,
      whiteSpace:'nowrap',
    }}>{level}</span>
  );
};

// Bottom-sheet — slides up from bottom, dismissable
const IpSheet = ({ open, onClose, height='52%', children, drag=true }) => {
  if (!open) return null;
  return (
    <>
      <div onClick={onClose} style={{position:'absolute', inset:0, background:'rgba(0,0,0,.4)', zIndex:30}}/>
      <div style={{
        position:'absolute', left:0, right:0, bottom:0, height,
        background:'linear-gradient(180deg, rgba(20,16,12,.98), rgba(13,10,8,.98))',
        borderTop:'1px solid var(--gold)',
        boxShadow:'0 -30px 80px rgba(0,0,0,.8), 0 -1px 0 rgba(232,199,115,.18) inset',
        zIndex:40,
        display:'flex', flexDirection:'column',
        animation:'sheetUp .35s cubic-bezier(.2,.9,.3,1)',
      }}>
        {drag && (
          <div onClick={onClose} style={{padding:'12px 0 8px', display:'flex', justifyContent:'center', cursor:'pointer'}}>
            <span style={{width:40, height:4, borderRadius:2, background:'var(--gold)', opacity:.6}}/>
          </div>
        )}
        <div style={{flex:1, overflow:'auto', padding:'8px 32px 32px'}}>{children}</div>
      </div>
    </>
  );
};

// Field block — label + value, museum-label style
const IpField = ({ label, en, value, vertical=false }) => (
  <div style={{padding:'14px 0', borderBottom:'1px solid var(--line-bone)', display: vertical?'block':'flex', gap:24, alignItems:'baseline'}}>
    <div style={{flex:'0 0 140px'}}>
      <div style={{fontFamily:'var(--mono)', fontSize:10, color:'var(--paper-3)', letterSpacing:'.32em'}}>{en}</div>
      <div style={{fontFamily:'var(--serif)', fontSize:13, color:'var(--gold)', letterSpacing:'.16em', marginTop:2}}>{label}</div>
    </div>
    <div style={{flex:1, fontFamily:'var(--serif)', fontSize:16, color:'var(--paper)', lineHeight:1.7, letterSpacing:'.04em'}}>{value}</div>
  </div>
);

// Pill button
const IpPill = ({ active, onClick, children, count }) => (
  <button onClick={onClick} style={{
    minHeight:38, padding:'8px 16px',
    background: active ? 'var(--gold)' : 'transparent',
    color: active ? 'var(--ink)' : 'var(--paper-2)',
    border:`1px solid ${active?'var(--gold)':'rgba(201,162,74,.32)'}`,
    cursor:'pointer',
    fontFamily:'var(--serif)', fontSize:13, fontWeight: active?600:500, letterSpacing:'.14em',
    display:'inline-flex', alignItems:'center', gap:8,
    transition:'background .18s, color .18s, border-color .18s',
  }}>
    {children}
    {count!==undefined && <span style={{fontFamily:'var(--mono)', fontSize:10, opacity:.7, letterSpacing:'.18em'}}>{count}</span>}
  </button>
);

// Big-numeric data callout
const IpNumber = ({ value, unit, label, en, accent='var(--gold-bright)' }) => (
  <div>
    <div style={{display:'flex', alignItems:'baseline', gap:6, color: accent}}>
      <span style={{fontFamily:'var(--display)', fontSize:56, fontWeight:500, lineHeight:.9, letterSpacing:'-.02em'}}>{value}</span>
      {unit && <span style={{fontFamily:'var(--mono)', fontSize:13, color:'var(--paper-3)', letterSpacing:'.16em'}}>{unit}</span>}
    </div>
    <div style={{fontFamily:'var(--serif)', fontSize:13, color:'var(--paper-2)', marginTop:6, letterSpacing:'.18em'}}>{label}</div>
    {en && <div style={{fontFamily:'var(--mono)', fontSize:9.5, color:'var(--paper-3)', letterSpacing:'.32em', marginTop:2}}>{en}</div>}
  </div>
);

window.IpSeal = IpSeal;
window.IpPage = IpPage;
window.IpRow = IpRow;
window.Tier = Tier;
window.IpSheet = IpSheet;
window.IpField = IpField;
window.IpPill = IpPill;
window.IpNumber = IpNumber;
window.VColumn = VColumn;
window.Cartouche = Cartouche;
