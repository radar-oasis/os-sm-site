// Print-mode root app — renders ALL tabs stacked, each as its own print page.

const PrintApp = () => {
  const tabs = [
    {k:'overview', cn:'總覽 · OVERVIEW', el: <Overview goTab={()=>{}} query=""/>},
    {k:'heatmap',  cn:'熱點地圖 · HEAT MAP', el: <HeatMapPanel query="" filterLevel="ALL"/>},
    {k:'genealogy',cn:'工藝譜系 · GENEALOGY', el: <Genealogy query="" filterLevel="ALL"/>},
    {k:'works',    cn:'作品矩陣 · WORKS MATRIX', el: <Works query=""/>},
    {k:'timeline', cn:'時間舍利 · TIMELINE', el: <Timeline query=""/>},
  ];

  return (
    <div className="print-root">
      {/* Cover */}
      <section className="print-page print-cover">
        <div style={{display:'flex', flexDirection:'column', justifyContent:'space-between', height:'100%', padding:'40px 60px'}}>
          <div style={{fontFamily:'var(--mono)', fontSize:11, color:'var(--gold)', letterSpacing:'.42em'}}>
            SUISHEN SI MIAO · INTANGIBLE HERITAGE THINK-TANK · v1.0 · 2026
          </div>
          <div style={{textAlign:'center'}}>
            <div style={{display:'flex', justifyContent:'center', gap:14, marginBottom:30}}>
              <KanjiSeal char="慈" size={72} color="var(--vermilion)"/>
              <KanjiSeal char="悲" size={72} color="var(--vermilion)"/>
              <KanjiSeal char="方" size={72} color="var(--gold)"/>
              <KanjiSeal char="寸" size={72} color="var(--gold)"/>
            </div>
            <div style={{fontFamily:'var(--serif)', fontSize:78, fontWeight:300, color:'var(--gold-bright)', letterSpacing:'.22em', lineHeight:1}}>隨身寺廟</div>
            <div style={{fontFamily:'var(--serif)', fontSize:30, color:'var(--paper-2)', letterSpacing:'.36em', marginTop:20}}>非遺工藝譜系智庫</div>
            <div style={{fontFamily:'var(--display)', fontSize:18, fontStyle:'italic', color:'var(--paper-3)', marginTop:20, letterSpacing:'.04em'}}>
              Twenty-seven crafts · Seven centuries · One palm
            </div>
            <div style={{margin:'40px auto 0', width:300, height:1, background:'linear-gradient(to right, transparent, var(--gold), transparent)'}}/>
            <div style={{display:'flex', justifyContent:'center', gap:50, marginTop:30, fontFamily:'var(--mono)', fontSize:11, color:'var(--paper-3)', letterSpacing:'.3em'}}>
              <span>27 CRAFTS</span>
              <span>20+ CITIES</span>
              <span>11 PROVINCES</span>
              <span>7 CROSS-BORDER</span>
              <span>14 ERAS</span>
            </div>
          </div>
          <div style={{display:'flex', justifyContent:'space-between', fontFamily:'var(--mono)', fontSize:10, color:'var(--paper-3)', letterSpacing:'.3em'}}>
            <span>玉佛禪寺 · 應金小院</span>
            <span>2026.05 · SHANGHAI</span>
          </div>
        </div>
      </section>

      {tabs.map((t,i)=>(
        <section key={t.k} className="print-page">
          <div className="print-page-header">
            <div style={{fontFamily:'var(--mono)', fontSize:10, color:'var(--gold)', letterSpacing:'.32em'}}>
              {String(i+1).padStart(2,'0')} / {tabs.length} · {t.cn}
            </div>
            <div style={{fontFamily:'var(--mono)', fontSize:10, color:'var(--paper-3)', letterSpacing:'.32em'}}>
              隨身寺廟 · 智庫 v1.0
            </div>
          </div>
          <div className="print-page-body">
            {t.el}
          </div>
        </section>
      ))}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('app')).render(<PrintApp/>);

// auto print after fonts + layout settle
(async () => {
  try { await document.fonts.ready; } catch(e){}
  await new Promise(r => setTimeout(r, 1500));
  window.print();
})();
