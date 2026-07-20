// Shared atoms / tokens for the dashboard.

const Sigil = ({ size=14, color="currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" style={{display:'inline-block', verticalAlign:'middle'}}>
    <circle cx="8" cy="8" r="7" fill="none" stroke={color} strokeWidth="0.6" opacity=".4"/>
    <circle cx="8" cy="8" r="1.6" fill={color}/>
    <path d="M8 1.5 L8 4.5 M8 11.5 L8 14.5 M1.5 8 L4.5 8 M11.5 8 L14.5 8" stroke={color} strokeWidth="0.6" opacity=".7"/>
  </svg>
);

const KanjiSeal = ({ char="寺", size=44, color="var(--vermilion)" }) => (
  <svg width={size} height={size} viewBox="0 0 44 44">
    <rect x="2" y="2" width="40" height="40" fill="none" stroke={color} strokeWidth="2"/>
    <rect x="5" y="5" width="34" height="34" fill="none" stroke={color} strokeWidth="0.5" opacity=".6"/>
    <text x="22" y="32" textAnchor="middle" fill={color} style={{fontFamily:'var(--serif)', fontSize:24, fontWeight:700}}>{char}</text>
  </svg>
);

const Divider = ({ label, gold=true, dense=false }) => (
  <div style={{display:'flex', alignItems:'center', gap:14, color: gold? 'var(--gold)':'var(--paper-3)', margin: dense ? '0' : '4px 0 16px', flex:'0 0 auto'}}>
    <span style={{fontFamily:'var(--mono)', fontSize:10, letterSpacing:'.4em', textTransform:'uppercase', whiteSpace:'nowrap'}}>{label}</span>
    <span style={{flex:1, height:1, background:'linear-gradient(to right, var(--line-strong), transparent)'}}/>
    <svg width="10" height="10" viewBox="0 0 10 10"><path d="M5 0 L10 5 L5 10 L0 5 Z" fill="currentColor" opacity=".7"/></svg>
  </div>
);

// Vertical bar with chinese characters, like a seal column
const SealColumn = ({ text, color="var(--gold)", size=10 }) => (
  <div style={{
    writingMode:'vertical-rl', textOrientation:'mixed',
    fontFamily:'var(--serif)', color, fontSize:size, letterSpacing:'.4em',
    fontWeight:500, opacity:.85
  }}>{text}</div>
);

// Number badge with metric
const Stat = ({ value, unit, label, accent }) => (
  <div style={{display:'flex', flexDirection:'column', gap:6, padding:'14px 0', minWidth:0}}>
    <div style={{display:'flex', alignItems:'baseline', gap:4, color: accent || 'var(--gold-bright)'}}>
      <span style={{fontFamily:'var(--display)', fontSize:42, fontWeight:500, lineHeight:.9, letterSpacing:'-.02em'}}>{value}</span>
      {unit && <span style={{fontFamily:'var(--mono)', fontSize:10, color:'var(--paper-3)', letterSpacing:'.1em'}}>{unit}</span>}
    </div>
    <div style={{fontFamily:'var(--sans)', fontSize:11, color:'var(--paper-3)', letterSpacing:'.18em'}}>{label}</div>
  </div>
);

const Tag = ({ children, color, dense=false, active=false, onClick }) => {
  const colors = {
    '世界级': {bg:'rgba(184,51,31,.16)', fg:'#e8a899', bd:'rgba(184,51,31,.45)'},
    '国家级': {bg:'rgba(201,162,74,.14)', fg:'var(--gold-bright)', bd:'rgba(201,162,74,.42)'},
    '省级':   {bg:'rgba(74,138,122,.16)', fg:'#9bccbb', bd:'rgba(74,138,122,.45)'},
    '跨境':   {bg:'rgba(214,201,168,.10)', fg:'var(--bone)', bd:'rgba(214,201,168,.35)'},
    'mute':   {bg:'rgba(255,255,255,.04)', fg:'var(--paper-3)', bd:'rgba(255,255,255,.10)'},
  };
  const key = color in colors ? color : (
    children?.toString().includes('世界级') ? '世界级' :
    children?.toString().includes('国家级') ? '国家级' :
    children?.toString().includes('省级')   ? '省级'   :
    children?.toString().includes('跨境')   ? '跨境'   : 'mute'
  );
  const c = colors[key];
  return (
    <span onClick={onClick} style={{
      display:'inline-flex', alignItems:'center', gap:4,
      padding: dense ? '2px 7px' : '4px 10px',
      fontFamily:'var(--sans)', fontSize: dense ? 9.5 : 10.5, letterSpacing:'.12em',
      color: active ? 'var(--ink)' : c.fg,
      background: active ? c.fg : c.bg,
      border: `1px solid ${c.bd}`,
      borderRadius:1,
      cursor: onClick ? 'pointer':'default',
      transition: 'all .2s ease',
      whiteSpace:'nowrap',
    }}>{children}</span>
  );
};

// 7 categories of crafts, each with its own jade/gold/red hue
const CATEGORY_COLORS = {
  '木作类': '#9b7d4a',
  '雕刻类': '#c9a24a',
  '金工类': '#e8c773',
  '镶嵌类': '#a8462e',
  '绘画类': '#7a4a8c',
  '印刷类': '#6b8aa0',
  '织造类': '#4a8a7a',
  '造像类': '#c2541b',
  '建筑参照': '#7a6a55',
  '材质': '#5a6a7a',
};

window.Sigil = Sigil;
window.KanjiSeal = KanjiSeal;
window.Divider = Divider;
window.SealColumn = SealColumn;
window.Stat = Stat;
window.Tag = Tag;
window.CATEGORY_COLORS = CATEGORY_COLORS;
