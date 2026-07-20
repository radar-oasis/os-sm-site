// iPad install prompt — Safari can't auto-install, so guide the user.

const IPadInstallPrompt = () => {
  const isStandalone = window.__IS_STANDALONE;
  const isIOS = window.__IS_IOS;
  const [dismissed, setDismissed] = React.useState(() => {
    try { return localStorage.getItem('install-dismissed') === '1'; } catch(e){ return false; }
  });
  const [open, setOpen] = React.useState(false);

  // Auto-show once per session if iOS Safari and not installed
  React.useEffect(()=>{
    if (isStandalone || dismissed) return;
    const t = setTimeout(()=>setOpen(true), 2500);
    return ()=>clearTimeout(t);
  },[isStandalone, dismissed]);

  const dismiss = (permanent=false) => {
    setOpen(false);
    if (permanent) {
      try { localStorage.setItem('install-dismissed','1'); } catch(e){}
      setDismissed(true);
    }
  };

  if (isStandalone || dismissed) return null;

  return (
    <>
      {/* Floating install icon (always available unless installed) */}
      {!open && (
        <button onClick={()=>setOpen(true)} title="安裝到主屏幕" style={{
          position:'fixed', right: 18, bottom: 100, zIndex: 950,
          width:44, height:44, padding:0,
          background:'linear-gradient(135deg, var(--vermilion), var(--vermilion-deep))',
          border:'1px solid var(--gold)', cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'center',
          boxShadow:'0 12px 30px rgba(184,51,31,.5), 0 0 0 1px rgba(232,199,115,.2)',
        }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2 L10 13 M10 13 L6 9 M10 13 L14 9" stroke="#f4ead7" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            <rect x="3" y="15" width="14" height="3" stroke="#f4ead7" strokeWidth="1.4"/>
          </svg>
        </button>
      )}

      {open && (
        <div onClick={()=>dismiss(false)} style={{
          position:'fixed', inset:0, zIndex:3000, background:'rgba(5,4,3,.78)', backdropFilter:'blur(10px)',
          display:'flex', alignItems:'center', justifyContent:'center', padding:24,
        }}>
          <div onClick={e=>e.stopPropagation()} style={{
            width:560, maxWidth:'92vw',
            background:'linear-gradient(180deg, rgba(20,16,12,.98), rgba(13,10,8,.98))',
            border:'1px solid var(--line-strong)',
            boxShadow:'0 40px 100px rgba(0,0,0,.8), 0 0 0 1px rgba(232,199,115,.12)',
          }}>
            {/* Header */}
            <div style={{padding:'22px 26px', borderBottom:'1px solid var(--line-strong)',
              background:'linear-gradient(180deg, rgba(201,162,74,.08), transparent)',
              display:'flex', alignItems:'center', gap:18}}>
              <img src="icons/icon-180.png" alt="" width="56" height="56"
                style={{display:'block', border:'1px solid var(--gold)', borderRadius:8}}/>
              <div>
                <div style={{fontFamily:'var(--mono)', fontSize:10, color:'var(--gold)', letterSpacing:'.32em'}}>INSTALL · 安裝至 iPad</div>
                <div style={{fontFamily:'var(--serif)', fontSize:22, fontWeight:600, color:'var(--gold-bright)', letterSpacing:'.14em', marginTop:4}}>隨身寺廟 OS</div>
                <div style={{fontFamily:'var(--display)', fontSize:13, fontStyle:'italic', color:'var(--paper-3)', marginTop:2, letterSpacing:'.04em'}}>Suishen Si Miao · v1.0</div>
              </div>
            </div>

            {/* Body */}
            <div style={{padding:'22px 26px'}}>
              <p style={{fontFamily:'var(--serif)', fontSize:14, color:'var(--paper)', lineHeight:1.75, letterSpacing:'.04em'}}>
                將本應用<span style={{color:'var(--gold-bright)'}}>添加到主屏幕</span>後，可全屏離線運行，
                如同 App Store 安裝的應用一樣。
              </p>

              <div style={{margin:'18px 0', height:1, background:'linear-gradient(to right, var(--gold), transparent)'}}/>

              {isIOS ? (
                <ol style={{listStyle:'none', counterReset:'step', display:'flex', flexDirection:'column', gap:14}}>
                  {[
                    {cn:'點擊 Safari 底部（或頂部）的「分享」按鈕', en:'Tap the Share button', icon:(
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M10 2 L10 13 M10 2 L6 6 M10 2 L14 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M4 9 L4 17 L16 17 L16 9" stroke="currentColor" strokeWidth="1.4"/>
                      </svg>
                    )},
                    {cn:'在分享面板中滑動找到「添加到主屏幕」', en:'Add to Home Screen', icon:(
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <rect x="3" y="3" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.4"/>
                        <path d="M10 7 L10 13 M7 10 L13 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                      </svg>
                    )},
                    {cn:'點擊「添加」即可在主屏幕看到寺院印章圖標', en:'Tap "Add"', icon:(
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M4 10 L8 14 L16 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )},
                  ].map((s,i)=>(
                    <li key={i} style={{display:'flex', alignItems:'center', gap:14}}>
                      <span style={{
                        width:32, height:32, flex:'0 0 32px',
                        display:'flex', alignItems:'center', justifyContent:'center',
                        border:'1px solid var(--gold)', color:'var(--gold-bright)',
                        fontFamily:'var(--display)', fontSize:17, fontWeight:600,
                      }}>{i+1}</span>
                      <span style={{color:'var(--gold)', flex:'0 0 24px', display:'flex', alignItems:'center'}}>{s.icon}</span>
                      <div style={{flex:1}}>
                        <div style={{fontFamily:'var(--serif)', fontSize:14, color:'var(--paper)', letterSpacing:'.06em'}}>{s.cn}</div>
                        <div style={{fontFamily:'var(--mono)', fontSize:9.5, color:'var(--paper-3)', letterSpacing:'.22em', marginTop:2}}>{s.en}</div>
                      </div>
                    </li>
                  ))}
                </ol>
              ) : (
                <div style={{fontFamily:'var(--serif)', fontSize:13, color:'var(--paper-2)', lineHeight:1.8}}>
                  在 iPad 上使用 Safari 打開此頁面，然後在地址欄旁找到分享按鈕，選擇<span style={{color:'var(--gold-bright)'}}>「添加到主屏幕」</span>。
                  <br/><br/>
                  在桌面瀏覽器（Chrome / Edge），點擊地址欄右側的安裝圖標即可。
                </div>
              )}

              <div style={{marginTop:22, padding:'12px 14px', border:'1px solid var(--line)',
                background:'rgba(201,162,74,.04)', display:'flex', gap:12, alignItems:'flex-start'}}>
                <span style={{fontFamily:'var(--mono)', fontSize:9.5, color:'var(--gold)', letterSpacing:'.28em', whiteSpace:'nowrap'}}>NOTE</span>
                <span style={{fontFamily:'var(--serif)', fontSize:11.5, color:'var(--paper-2)', lineHeight:1.6}}>
                  本應用以 PWA 形式運行 · 完全離線可用 · 無需 App Store · 數據保存在本地。
                  如需發佈至 App Store，可使用 Capacitor 包裝為原生 IPA（詳見項目 README）。
                </span>
              </div>
            </div>

            {/* Footer */}
            <div style={{padding:'14px 26px', borderTop:'1px solid var(--line)', display:'flex', justifyContent:'space-between', gap:12}}>
              <button onClick={()=>dismiss(true)} style={{
                padding:'10px 18px', background:'transparent', border:'1px solid var(--line-strong)',
                color:'var(--paper-3)', cursor:'pointer',
                fontFamily:'var(--serif)', fontSize:12.5, letterSpacing:'.2em',
              }}>不再提示</button>
              <button onClick={()=>dismiss(false)} style={{
                padding:'10px 22px', background:'var(--gold)', border:'1px solid var(--gold)',
                color:'var(--ink)', cursor:'pointer',
                fontFamily:'var(--serif)', fontSize:12.5, fontWeight:600, letterSpacing:'.22em',
              }}>明白了</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

window.IPadInstallPrompt = IPadInstallPrompt;
