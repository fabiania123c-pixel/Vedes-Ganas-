import { useState, useEffect, useRef, useMemo } from "react";

const T70 = {
  "MARATHON SPORTS": [[.9499,.0015],[.9999,.003],[1.0999,.004],[1.2999,.009],[1.3,.012]],
  "EXPLORER":        [[.9499,.007], [.9999,.008],[1.0999,.011],[1.2999,.013],[1.3,.015]],
  "TELESHOP":        [[.9499,.012], [.9999,.015],[1.0999,.017],[1.2999,.02], [1.3,.023]],
  "TAF":             [[.9499,.007], [.9999,.008],[1.0999,.011],[1.2999,.013],[1.3,.015]],
  "PUMA":            [[.9499,.007], [.9999,.008],[1.0999,.011],[1.2999,.013],[1.3,.015]],
  "UNDER ARMOUR":    [[.9499,.007], [.9999,.008],[1.0999,.011],[1.2999,.013],[1.3,.015]],
  "CIKLA":           [[.9499,.0035],[.9999,.005],[1.0999,.008],[1.2999,.012],[1.3,.018]],
  "BIG HEAD":        [[.9499,.007], [.9999,.008],[1.0999,.011],[1.2999,.013],[1.3,.015]],
  "JANSPORT":        [[.9499,.0035],[.9999,.005],[1.0999,.008],[1.2999,.012],[1.3,.018]],
  "XPLOIT":          [[.9499,.007], [.9999,.008],[1.0999,.01], [1.2999,.012],[1.3,.018]],
};
const TBD = {
  "BODEGA DEPORTIVA": [[0,0],[.9,.0004],[.9501,.0005],[1.,.0007],[1.1,.0009],[1.3,.0012]],
  "OUTLET":           [[0,0],[.9,.0004],[.9501,.0005],[1.,.0007],[1.1,.0009],[1.3,.0012]],
};
const TNA = {
  "JEFE DE ALMACEN": {
    "MARATHON SPORTS":  [[0,0],[.9,.0012],[.9501,.0025],[1.,.003],[1.1,.004],[1.3,.005]],
    "BODEGA DEPORTIVA": [[0,0],[.9,.0015],[.9501,.0025],[1.,.0035],[1.1,.0045],[1.3,.0055]],
    "OUTLET":           [[0,0],[.9,.0015],[.9501,.0025],[1.,.0035],[1.1,.0045],[1.3,.0055]],
    "EXPLORER":         [[0,0],[.9,.003], [.9501,.004], [1.,.005],[1.1,.006],[1.3,.007]],
    "TELESHOP":         [[0,0],[.9,.002], [.9501,.004], [1.,.006],[1.1,.008],[1.3,.01]],
    "TAF":              [[0,0],[.9,.003], [.9501,.004], [1.,.005],[1.1,.006],[1.3,.007]],
    "PUMA":             [[0,0],[.9,.003], [.9501,.004], [1.,.005],[1.1,.006],[1.3,.007]],
    "UNDER ARMOUR":     [[0,0],[.9,.003], [.9501,.004], [1.,.005],[1.1,.006],[1.3,.007]],
    "CIKLA":            [[0,0],[.9,.00005],[.9501,.0002],[1.,.0004],[1.1,.0006],[1.3,.01]],
    "BIG HEAD":         [[0,0],[.9,.0015],[.9501,.003], [1.,.004],[1.1,.005],[1.3,.006]],
    "JANSPORT":         [[0,0],[.9,.00005],[.9501,.0002],[1.,.0004],[1.1,.0006],[1.3,.01]],
    "XPLOIT":           [[0,0],[.9,.0015],[.9501,.003], [1.,.004],[1.1,.005],[1.3,.006]],
    _d:                 [[0,0],[.9,.0015],[.9501,.0025],[1.,.003],[1.1,.004],[1.3,.005]],
  },
  "SUBJEFE DE ALMACEN": {
    "MARATHON SPORTS":  [[0,0],[.9,.001], [.9501,.002], [1.,.0025],[1.1,.003],[1.3,.004]],
    "BODEGA DEPORTIVA": [[0,0],[.9,.0012],[.9501,.002], [1.,.003],[1.1,.004],[1.3,.005]],
    "OUTLET":           [[0,0],[.9,.0012],[.9501,.002], [1.,.003],[1.1,.004],[1.3,.005]],
    "EXPLORER":         [[0,0],[.9,.002], [.9501,.003], [1.,.004],[1.1,.005],[1.3,.006]],
    "TELESHOP":         [[0,0],[.9,.0015],[.9501,.0035],[1.,.0055],[1.1,.0075],[1.3,.0095]],
    "TAF":              [[0,0],[.9,.002], [.9501,.003], [1.,.004],[1.1,.005],[1.3,.006]],
    "PUMA":             [[0,0],[.9,.002], [.9501,.003], [1.,.004],[1.1,.005],[1.3,.006]],
    "UNDER ARMOUR":     [[0,0],[.9,.002], [.9501,.003], [1.,.004],[1.1,.005],[1.3,.006]],
    "BIG HEAD":         [[0,0],[.9,.0012],[.9501,.0025],[1.,.003],[1.1,.004],[1.3,.005]],
    "XPLOIT":           [[0,0],[.9,.0012],[.9501,.0025],[1.,.003],[1.1,.004],[1.3,.005]],
    _d:                 [[0,0],[.9,.0012],[.9501,.002], [1.,.0025],[1.1,.003],[1.3,.004]],
  },
  "CAJERO": {
    "MARATHON SPORTS":  [[0,0],[.9,.00005],[.9501,.0002],[1.,.0004],[1.1,.0006],[1.3,.0008]],
    "BODEGA DEPORTIVA": [[0,0],[.9,.0001], [.9501,.0002],[1.,.0004],[1.1,.0006],[1.3,.0008]],
    "OUTLET":           [[0,0],[.9,.0001], [.9501,.0002],[1.,.0004],[1.1,.0006],[1.3,.0008]],
    "EXPLORER":         [[0,0],[.9,.00005],[.9501,.0002],[1.,.0004],[1.1,.0006],[1.3,.0008]],
    "TAF":              [[0,0],[.9,.00005],[.9501,.0002],[1.,.0004],[1.1,.0006],[1.3,.0008]],
    "PUMA":             [[0,0],[.9,.00005],[.9501,.0002],[1.,.0004],[1.1,.0006],[1.3,.0008]],
    "UNDER ARMOUR":     [[0,0],[.9,.00005],[.9501,.0002],[1.,.0004],[1.1,.0006],[1.3,.0008]],
    "CIKLA":            [[0,0],[.9,0],[.9501,0],[1.,0],[1.1,0],[1.3,0]],
    "JANSPORT":         [[0,0],[.9,0],[.9501,0],[1.,0],[1.1,0],[1.3,0]],
    "TELESHOP":         [[0,0],[.9,0],[.9501,0],[1.,0],[1.1,0],[1.3,0]],
    _d:                 [[0,0],[.9,.00005],[.9501,.0002],[1.,.0004],[1.1,.0006],[1.3,.0008]],
  },
  "AUX. DE BODEGA": {
    "BODEGA DEPORTIVA": [[0,0],[.9,.0001],[.9501,.0002],[1.,.0004],[1.1,.0006],[1.3,.0008]],
    "OUTLET":           [[0,0],[.9,.0001],[.9501,.0002],[1.,.0004],[1.1,.0006],[1.3,.0008]],
    _d:                 [[0,0],[.9,.00005],[.9501,.0002],[1.,.0004],[1.1,.0006],[1.3,.0008]],
  },
};

const BONO_NA = {"JEFE DE ALMACEN":100,"SUBJEFE DE ALMACEN":70};
const SIN_IV  = ["AUX. DE TIENDA","MECANICO BICICLETAS"];
const PIN     = "INCENTIVOS2026*";
const RANGOS  = ["< 90%","90–95%","95–100%","100–110%","110–130%","+130%"];
const RANGO_V = {"< 90%":.85,"90–95%":.925,"95–100%":.975,"100–110%":1.05,"110–130%":1.20,"+130%":1.35};
const CONCEPTOS = [
  {id:"MARATHON SPORTS",lbl:"Marathon Sports"},{id:"EXPLORER",lbl:"Explorer"},
  {id:"BODEGA DEPORTIVA",lbl:"Bodega Deportiva"},{id:"TELESHOP",lbl:"Teleshop"},
  {id:"TAF",lbl:"TAF"},
  {id:"OUTLET",lbl:"Outlet"},{id:"PUMA",lbl:"Puma"},
  {id:"UNDER ARMOUR",lbl:"Under Armour"},{id:"BIG HEAD",lbl:"Big Head"},
  {id:"JANSPORT",lbl:"Jansport"},
];
const CARGOS = [
  {id:"ASESOR DE VENTAS",lbl:"Asesor",pin:false},
  {id:"CAJERO",lbl:"Cajero",pin:false},
  {id:"SUBJEFE DE ALMACEN",lbl:"Subjefe",pin:true},
  {id:"AUX. DE BODEGA",lbl:"Aux. Bodega",pin:false},
  {id:"JEFE DE ALMACEN",lbl:"Jefe",pin:true},
];

const C = {
  bg:"#060C16",surf:"#0C1828",card:"#0F1E38",
  b0:"#182840",b1:"#1565C0",b2:"#1E88E5",
  whi:"#FFFFFF",sof:"#8DB4D8",mut:"#3D5A7A",
  dim:"#1A2D45",gld:"#FFB800",
};
const LVL = ["#1A2D45","#0D3B8C","#0D47A1","#1565C0","#1976D2","#1E88E5"];

function porHasta(t,v){for(const[h,r]of t)if(v<=h)return r;return t[t.length-1][1];}
function porDesde(t,v){let r=0;for(const[d,x]of t)if(v>=d)r=x;return r;}
function tasaNA(cargo,concepto,cumpl){const g=TNA[cargo]||{};return porDesde(g[concepto]||g._d||[],cumpl);}

function calc({concepto,cargo,metaA,ventaA,tiendaOk,ventaT,metaT,rangoT,margen}){
  const esAse=cargo==="ASESOR DE VENTAS",es7030=esAse&&!!T70[concepto],esBD=esAse&&!!TBD[concepto];
  if(esAse&&!es7030&&!esBD)return null;
  if(es7030){
    const m=parseFloat(metaA)||0,v=parseFloat(ventaA)||0;
    if(!m||!v)return null;
    const cumplA=v/m,tasa=porHasta(T70[concepto],cumplA),base=v*tasa,bono=margen?30:0;
    return{tipo:"7030",comInd:base*.7,comTienda:tiendaOk?base*.3:0,bono,total:base*.7+(tiendaOk?base*.3:0)+bono,cumplA,tasa};
  }
  if(esBD){
    let cumplT=null,vt=parseFloat(ventaT)||0;
    if(metaT&&ventaT){const mt=parseFloat(metaT)||0;if(mt>0&&vt>0)cumplT=vt/mt;}else if(rangoT)cumplT=RANGO_V[rangoT];
    if(cumplT===null)return null;
    const tasa=porDesde(TBD[concepto],cumplT)*.8,bono=margen?30:0;
    if(vt>0)return{tipo:"tienda",comInd:0,comTienda:vt*tasa,bono,total:vt*tasa+bono,cumplT,tasa};
    return{tipo:"soloTasa",tasa,cumplT,bono};
  }
  let cumplT=null,vt=parseFloat(ventaT)||0;
  if(metaT&&ventaT){const mt=parseFloat(metaT)||0;if(mt>0&&vt>0)cumplT=vt/mt;}else if(rangoT)cumplT=RANGO_V[rangoT];
  if(cumplT===null)return null;
  const tasa=tasaNA(cargo,concepto,cumplT),bono=margen?(BONO_NA[cargo]||0):0;
  if(vt>0)return{tipo:"tienda",comInd:0,comTienda:vt*tasa,bono,total:vt*tasa+bono,cumplT,tasa};
  return{tipo:"soloTasa",tasa,cumplT,bono};
}

function AnimNum({val}){
  const[d,sd]=useState(0),fr=useRef(),s=useRef(0),t0=useRef(null),tg=useRef(val);
  useEffect(()=>{
    tg.current=val;s.current=d;t0.current=null;cancelAnimationFrame(fr.current);
    const run=t=>{if(!t0.current)t0.current=t;const p=Math.min((t-t0.current)/500,1);
      sd(s.current+(tg.current-s.current)*(1-Math.pow(1-p,3)));if(p<1)fr.current=requestAnimationFrame(run);};
    fr.current=requestAnimationFrame(run);return()=>cancelAnimationFrame(fr.current);
  },[val]);
  return <span>${d.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g,",")}</span>;
}

function NivelBar({cumpl,is7030}){
  if(cumpl==null)return null;
  const maxs=is7030?[.9499,.9999,1.0999,1.2999,Infinity]:[.8999,.9499,.9999,1.0999,1.2999,Infinity];
  const lbls=is7030?["<95%","<100%","Meta","Superando","+130%"]:["<90%","90–95%","95–100%","100–110%","110–130%","+130%"];
  const off=is7030?1:0,idx=maxs.findIndex(m=>cumpl<=m),act=idx===-1?maxs.length-1:idx;
  return(
    <div style={{margin:"10px 0 18px"}}>
      <div style={{display:"flex",gap:4}}>{lbls.map((_,i)=><div key={i} style={{flex:1,height:6,borderRadius:3,background:i<=act?LVL[i+off]:C.dim,transition:"background .3s",boxShadow:i===act?`0 0 8px ${LVL[i+off]}`:"none"}}/>)}</div>
      <div style={{display:"flex",gap:4,marginTop:5}}>{lbls.map((l,i)=><div key={i} style={{flex:1,textAlign:"center",fontSize:"clamp(8px,2.3vw,10px)",color:i<=act?LVL[i+off]:C.dim,fontWeight:i===act?700:400}}>{l}</div>)}</div>
    </div>
  );
}

const IS={width:"100%",background:C.card,border:`1px solid ${C.b0}`,borderRadius:12,color:C.whi,fontSize:18,outline:"none",boxSizing:"border-box",fontFamily:"inherit",padding:"16px 16px 16px 36px"};

function Dinero({lbl,val,set,note}){
  return(
    <div style={{marginBottom:20}}>
      <div style={{color:C.mut,fontSize:12,textTransform:"uppercase",letterSpacing:".07em",marginBottom:8}}>{lbl}</div>
      <div style={{position:"relative"}}>
        <span style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",color:C.mut,fontSize:18,pointerEvents:"none"}}>$</span>
        <input type="number" inputMode="decimal" value={val} onChange={e=>set(e.target.value)} placeholder="0.00" style={IS}/>
      </div>
      {note&&<div style={{color:C.mut,fontSize:12,marginTop:6}}>{note}</div>}
    </div>
  );
}

function Tog({lbl,val,set,note}){
  return(
    <div style={{padding:"16px 0",borderBottom:`1px solid ${C.b0}`}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:16}}>
        <span style={{color:C.sof,fontSize:16,lineHeight:1.4}}>{lbl}</span>
        <div onClick={()=>set(!val)} style={{width:52,height:28,borderRadius:14,cursor:"pointer",flexShrink:0,background:val?C.b1:C.dim,position:"relative",transition:"background .25s"}}>
          <div style={{width:22,height:22,borderRadius:"50%",background:"#fff",position:"absolute",top:3,left:val?26:4,transition:"left .25s",boxShadow:"0 1px 4px rgba(0,0,0,.5)"}}/>
        </div>
      </div>
      {note&&<div style={{color:C.mut,fontSize:12,marginTop:6}}>{note}</div>}
    </div>
  );
}

function Rango({val,set}){
  return(
    <div style={{display:"flex",flexWrap:"wrap",gap:10}}>
      {RANGOS.map((r,i)=>{const a=val===r;return(
        <button key={r} onClick={()=>set(a?null:r)} style={{padding:"10px 16px",borderRadius:20,cursor:"pointer",fontFamily:"inherit",fontSize:14,transition:"all .2s",border:a?"none":`1px solid ${C.b0}`,background:a?LVL[i]:"transparent",color:a?C.whi:C.mut,fontWeight:a?600:400,whiteSpace:"nowrap"}}>{r}</button>
      );})}
    </div>
  );
}

export default function App(){
  useEffect(()=>{
    const l=document.createElement("link");
    l.href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;900&family=Inter:wght@400;500;600&display=swap";
    l.rel="stylesheet";document.head.appendChild(l);
    document.documentElement.style.background=C.bg;
    document.body.style.background=C.bg;
    document.body.style.margin="0";
    document.body.style.overflowX="hidden";
  },[]);

  const[started,setStarted]=useState(false);
  const[cargo,setCargo]=useState(null);
  const[concepto,setConcepto]=useState(null);
  const[pin,setPin]=useState("");
  const[pinOk,setPinOk]=useState(false);
  const[pinErr,setPinErr]=useState(false);
  const[showPin,setShowPin]=useState(false);
  const[metaA,setMetaA]=useState("");
  const[ventaA,setVentaA]=useState("");
  const[tiendaOk,setTiendaOk]=useState(false);
  const[ventaT,setVentaT]=useState("");
  const[metaT,setMetaT]=useState("");
  const[rangoT,setRangoT]=useState(null);
  const[margen,setMargen]=useState(false);

  const reset=()=>{setMetaA("");setVentaA("");setTiendaOk(false);setVentaT("");setMetaT("");setRangoT(null);setMargen(false);};
  const selCargo=c=>{if(c.pin&&!pinOk){setCargo(c);setShowPin(true);return;}setCargo(c);setShowPin(false);reset();};
  const submitPin=()=>{if(pin===PIN){setPinOk(true);setPinErr(false);setShowPin(false);reset();}else setPinErr(true);};

  const esAsesor=cargo?.id==="ASESOR DE VENTAS";
  const es7030=esAsesor&&!!T70[concepto];
  const esBD=esAsesor&&!!TBD[concepto];
  const noAse=!esAsesor;
  const sinIV=cargo&&SIN_IV.includes(cargo.id);
  const conBono=cargo&&["JEFE DE ALMACEN","SUBJEFE DE ALMACEN"].includes(cargo.id);
  const needPin=cargo?.pin&&!pinOk;

  const resultado=useMemo(()=>{
    if(!cargo||!concepto||needPin||sinIV)return null;
    return calc({concepto,cargo:cargo.id,metaA,ventaA,tiendaOk,ventaT,metaT,rangoT,margen});
  },[cargo,concepto,metaA,ventaA,tiendaOk,ventaT,metaT,rangoT,margen,needPin,sinIV]);

  const cumplA=useMemo(()=>{const m=parseFloat(metaA),v=parseFloat(ventaA);return m>0&&v>0?v/m:null;},[metaA,ventaA]);
  const cumplT=useMemo(()=>{const m=parseFloat(metaT),v=parseFloat(ventaT);if(m>0&&v>0)return v/m;if(rangoT)return RANGO_V[rangoT];return null;},[metaT,ventaT,rangoT]);
  const campeon=resultado?.tipo!=="soloTasa"&&(resultado?.cumplA||resultado?.cumplT||0)>=1.3;

  if(!started){
    return(
      <div style={{minHeight:"100vh",width:"100%",background:C.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"clamp(20px,6vw,40px)",boxSizing:"border-box",gap:"clamp(24px,6vw,40px)"}}>
        <img src="/banner.jpg" alt="Vendes+, Ganas+ Marathon" style={{width:"100%",maxWidth:480,borderRadius:20,boxShadow:"0 0 60px rgba(21,101,192,.25)"}}/>
        <button onClick={()=>setStarted(true)} style={{background:C.b1,color:"#fff",border:"none",borderRadius:16,padding:"18px 40px",fontFamily:"Barlow Condensed,sans-serif",fontWeight:900,fontSize:"clamp(20px,5vw,26px)",letterSpacing:".02em",cursor:"pointer",boxShadow:"0 0 40px rgba(21,101,192,.4)"}}>
          CALCULAR MIS GANANCIAS
        </button>
      </div>
    );
  }

  return(
    <div style={{minHeight:"100vh",width:"100%",background:C.bg,color:C.whi,fontFamily:"Inter,sans-serif",boxSizing:"border-box",overflowX:"hidden"}}>
      <div style={{maxWidth:900,margin:"0 auto",padding:"0 clamp(16px,5vw,40px) clamp(40px,10vw,80px)",boxSizing:"border-box"}}>

        <div style={{padding:"clamp(24px,6vw,40px) 0 clamp(20px,5vw,32px)",borderBottom:`1px solid ${C.b0}`,marginBottom:"clamp(24px,6vw,40px)"}}>
          <h1 style={{margin:0,fontFamily:"Barlow Condensed,sans-serif",fontWeight:900,fontSize:"clamp(38px,11vw,64px)",lineHeight:1,letterSpacing:"-1px"}}>
            <span style={{color:C.b2}}>Vendes+</span><span style={{color:C.whi}}>, Ganas+</span>
          </h1>
          <p style={{margin:"8px 0 0",color:C.mut,fontSize:"clamp(13px,3.5vw,16px)"}}>Simulador de Incentivo Variable · Ecuador 2026</p>
        </div>

        <div style={{marginBottom:"clamp(24px,6vw,40px)"}}>
          <div style={{color:C.mut,fontSize:12,textTransform:"uppercase",letterSpacing:".1em",marginBottom:16}}>¿Cuál es tu cargo?</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
            {CARGOS.map(c=>{const a=cargo?.id===c.id;return(
              <button key={c.id} onClick={()=>selCargo(c)} style={{padding:"10px 18px",borderRadius:24,cursor:"pointer",fontFamily:"inherit",fontSize:"clamp(13px,3.5vw,16px)",transition:"all .2s",border:a?"none":`1px solid ${C.b0}`,background:a?C.b1:"transparent",color:a?C.whi:C.mut,fontWeight:a?600:400,whiteSpace:"nowrap"}}>
                {c.lbl}{c.pin&&<span style={{marginLeft:5,fontSize:11,opacity:.5}}>{pinOk?"✓":"🔒"}</span>}
              </button>);})}
          </div>
        </div>

        {showPin&&(
          <div style={{marginBottom:"clamp(24px,6vw,40px)",background:C.surf,borderRadius:16,padding:"clamp(20px,5vw,28px)",border:`1px solid ${C.b0}`,boxSizing:"border-box"}}>
            <p style={{color:C.mut,fontSize:15,margin:"0 0 14px"}}>PIN de acceso</p>
            <div style={{display:"flex",gap:10}}>
              <input type="password" value={pin} onChange={e=>{setPin(e.target.value);setPinErr(false);}} onKeyDown={e=>e.key==="Enter"&&submitPin()} placeholder="Ingresa tu PIN"
                style={{flex:1,minWidth:0,background:C.card,border:`1px solid ${pinErr?"#EF5350":C.b0}`,borderRadius:12,padding:"14px 16px",color:C.whi,fontSize:16,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
              <button onClick={submitPin} style={{background:C.b1,color:"#fff",border:"none",borderRadius:12,padding:"14px 20px",cursor:"pointer",fontFamily:"inherit",fontWeight:600,fontSize:18,flexShrink:0}}>→</button>
            </div>
            {pinErr&&<p style={{color:"#EF5350",fontSize:13,margin:"10px 0 0"}}>PIN incorrecto</p>}
          </div>
        )}

        {cargo&&!showPin&&(
          <div style={{marginBottom:"clamp(24px,6vw,40px)"}}>
            <div style={{color:C.mut,fontSize:12,textTransform:"uppercase",letterSpacing:".1em",marginBottom:16}}>¿En qué concepto trabajas?</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(130px, 1fr))",gap:8}}>
              {CONCEPTOS.map(con=>{const a=concepto===con.id;return(
                <button key={con.id} onClick={()=>{setConcepto(con.id);reset();}} style={{padding:"14px 12px",borderRadius:14,cursor:"pointer",fontFamily:"inherit",fontSize:"clamp(12px,3.2vw,15px)",transition:"all .2s",textAlign:"left",border:a?`1px solid ${C.b1}`:`1px solid ${C.b0}`,background:a?`${C.b1}22`:"transparent",color:a?C.whi:C.mut,fontWeight:a?600:400,minWidth:0}}>
                  {con.lbl}
                </button>);})}
            </div>
          </div>
        )}

        {cargo&&concepto&&sinIV&&(
          <div style={{marginBottom:"clamp(24px,6vw,40px)",background:C.surf,borderRadius:16,padding:"clamp(24px,6vw,32px)",border:`1px solid ${C.b0}`,textAlign:"center",boxSizing:"border-box"}}>
            <p style={{color:C.sof,fontSize:"clamp(15px,4vw,18px)",margin:0,fontWeight:500}}>Este cargo no tiene incentivo variable en el modelo 2026.</p>
            <p style={{color:C.mut,fontSize:14,margin:"8px 0 0"}}>Consulta con tu Jefe de Almacén.</p>
          </div>
        )}

        {cargo&&concepto&&!showPin&&!needPin&&!sinIV&&(
          <div style={{marginBottom:"clamp(24px,6vw,40px)"}}>
            <div style={{background:C.surf,borderRadius:16,border:`1px solid ${C.b0}`,overflow:"hidden"}}>
              <div style={{padding:"14px clamp(16px,5vw,28px)",background:"#081018",borderBottom:`1px solid ${C.b0}`,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                <span style={{fontSize:13,color:C.b2,textTransform:"uppercase",letterSpacing:".08em",fontWeight:600}}>{concepto}</span>
                <span style={{color:C.dim}}>·</span>
                <span style={{fontSize:13,color:C.mut}}>{cargo.lbl}</span>
              </div>
              <div style={{padding:"clamp(20px,5vw,32px)",boxSizing:"border-box"}}>
                {es7030&&(
                  <>
                    <Dinero lbl="Mi meta individual este mes" val={metaA} set={setMetaA} note="El monto que tu tienda espera que vendas"/>
                    <Dinero lbl="Lo que llevo vendido / espero vender" val={ventaA} set={setVentaA}/>
                    {cumplA!=null&&(<><div style={{display:"flex",justifyContent:"space-between",fontSize:14,color:C.mut}}><span>Cumplimiento individual</span><span style={{color:C.b2,fontWeight:600}}>{(cumplA*100).toFixed(1)}%</span></div><NivelBar cumpl={cumplA} is7030={true}/></>)}
                    <Tog lbl="¿Tu tienda llegó al 100% de su meta?" val={tiendaOk} set={setTiendaOk} note={tiendaOk?"Ganas el 30% adicional sobre tu comisión":"Sin esto, recibes solo el 70%"}/>
                    <div style={{marginTop:20}}><Tog lbl="¿Margen Bruto ≥ 100%? (+$30)" val={margen} set={setMargen} note="Bono fijo que aplica a tu cargo."/></div>
                  </>
                )}
                {esBD&&(
                  <>
                    <div style={{background:`${C.b1}12`,borderRadius:10,padding:"14px 16px",marginBottom:20,fontSize:14,color:"#90CAF9",border:`1px solid ${C.b1}20`}}>En {concepto}, tu comisión se calcula sobre las ventas de la tienda.</div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:14}}>
                      <div style={{flex:"1 1 130px",minWidth:0}}><Dinero lbl="Venta de la tienda" val={ventaT} set={v=>{setVentaT(v);setRangoT(null);}} note="Opcional"/></div>
                      <div style={{flex:"1 1 130px",minWidth:0}}><Dinero lbl="Meta de la tienda" val={metaT} set={v=>{setMetaT(v);setRangoT(null);}} note="Opcional"/></div>
                    </div>
                    {cumplT!=null&&metaT&&(<><div style={{display:"flex",justifyContent:"space-between",fontSize:14,color:C.mut}}><span>Cumplimiento tienda</span><span style={{color:C.b2,fontWeight:600}}>{(cumplT*100).toFixed(1)}%</span></div><NivelBar cumpl={cumplT} is7030={false}/></>)}
                    <div style={{color:C.mut,fontSize:11,textTransform:"uppercase",letterSpacing:".07em",margin:"12px 0"}}>— o elige el nivel —</div>
                    <Rango val={rangoT} set={r=>{setRangoT(r);setMetaT("");if(r)setVentaT("");}}/>
                    <div style={{marginTop:20}}><Tog lbl="¿Margen Bruto ≥ 100%? (+$30)" val={margen} set={setMargen} note="Bono fijo que aplica a tu cargo."/></div>
                  </>
                )}
                {noAse&&(
                  <>
                    <div style={{display:"flex",flexWrap:"wrap",gap:14}}>
                      <div style={{flex:"1 1 130px",minWidth:0}}><Dinero lbl="Venta de la tienda" val={ventaT} set={setVentaT} note="Opcional"/></div>
                      <div style={{flex:"1 1 130px",minWidth:0}}><Dinero lbl="Meta de la tienda" val={metaT} set={v=>{setMetaT(v);setRangoT(null);}} note="Opcional"/></div>
                    </div>
                    {cumplT!=null&&metaT&&(<><div style={{display:"flex",justifyContent:"space-between",fontSize:14,color:C.mut}}><span>Cumplimiento tienda</span><span style={{color:C.b2,fontWeight:600}}>{(cumplT*100).toFixed(1)}%</span></div><NivelBar cumpl={cumplT} is7030={false}/></>)}
                    <div style={{color:C.mut,fontSize:11,textTransform:"uppercase",letterSpacing:".07em",margin:"12px 0"}}>— o elige el nivel —</div>
                    <Rango val={rangoT} set={r=>{setRangoT(r);setMetaT("");}}/>
                    {conBono&&<div style={{marginTop:20}}><Tog lbl={`¿Margen Bruto ≥ 100%? (+$${cargo.id==="JEFE DE ALMACEN"?100:70})`} val={margen} set={setMargen} note="Bono fijo adicional que aplica a tu cargo."/></div>}
                    {cargo.id==="CAJERO"&&<p style={{marginTop:16,color:C.mut,fontSize:13,padding:"10px 14px",background:C.dim,borderRadius:10}}>El Cajero no recibe bono de Margen Bruto.</p>}
                    {cargo.id==="AUX. DE BODEGA"&&<p style={{marginTop:16,color:C.mut,fontSize:13,padding:"10px 14px",background:C.dim,borderRadius:10}}>El Aux. de Bodega no recibe bono de Margen Bruto.</p>}
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {resultado&&(
          <div style={{marginBottom:"clamp(24px,6vw,40px)",borderRadius:20,padding:"clamp(28px,7vw,48px) clamp(20px,5vw,48px)",textAlign:"center",boxSizing:"border-box",
            background:campeon?"linear-gradient(135deg,#131000,#0C1828)":"linear-gradient(135deg,#081428,#060C16)",
            border:`1px solid ${campeon?C.gld:C.b1}`,
            boxShadow:`0 0 80px ${campeon?"rgba(255,184,0,.15)":"rgba(21,101,192,.2)"}`,
          }}>
            {resultado.tipo==="soloTasa"?(
              <>
                <p style={{color:C.mut,fontSize:13,textTransform:"uppercase",letterSpacing:".1em",margin:"0 0 10px"}}>Tasa que te corresponde</p>
                <div style={{fontSize:"clamp(48px,14vw,96px)",fontFamily:"Barlow Condensed,sans-serif",fontWeight:900,color:C.b2,lineHeight:1,letterSpacing:"-2px"}}>{(resultado.tasa*100).toFixed(3)}%</div>
                <p style={{color:C.mut,fontSize:"clamp(14px,3.8vw,17px)",margin:"10px 0 16px"}}>de las ventas de la tienda</p>
                {resultado.bono>0&&<div style={{padding:"12px 16px",borderRadius:10,background:`${C.b1}15`,color:"#90CAF9",fontSize:15}}>+ ${resultado.bono} bono Margen Bruto</div>}
              </>
            ):(
              <>
                <p style={{color:C.mut,fontSize:13,textTransform:"uppercase",letterSpacing:".1em",margin:"0 0 8px"}}>Tu incentivo estimado este mes</p>
                <div style={{fontSize:"clamp(48px,15vw,112px)",fontFamily:"Barlow Condensed,sans-serif",fontWeight:900,color:campeon?C.gld:C.whi,lineHeight:1,letterSpacing:"-2px",textShadow:campeon?"0 0 50px rgba(255,184,0,.4)":"0 0 40px rgba(33,150,243,.2)",wordBreak:"break-word"}}>
                  <AnimNum val={resultado.total}/>
                </div>
                <p style={{color:C.mut,fontSize:"clamp(13px,3.5vw,15px)",margin:"8px 0 28px"}}>USD estimados / mes</p>
                <div style={{textAlign:"left",borderTop:`1px solid ${C.b0}`,paddingTop:20}}>
                  {resultado.comInd>0&&<div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",fontSize:"clamp(14px,3.8vw,17px)",color:C.mut,gap:8}}><span>Individual (70%)</span><span style={{color:"#90CAF9"}}>${resultado.comInd.toFixed(2)}</span></div>}
                  {resultado.comTienda>0&&<div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",fontSize:"clamp(14px,3.8vw,17px)",color:C.mut,gap:8}}><span>{es7030?"Tienda (30%)":"Comisión tienda"}</span><span style={{color:"#90CAF9"}}>${resultado.comTienda.toFixed(2)}</span></div>}
                  {resultado.bono>0&&<div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",fontSize:"clamp(14px,3.8vw,17px)",fontWeight:600,color:C.gld,gap:8}}><span>Bono Margen Bruto</span><span>+${resultado.bono.toFixed(2)}</span></div>}
                  {resultado.total===0&&resultado.bono===0&&<p style={{color:C.mut,fontSize:"clamp(14px,3.8vw,17px)",textAlign:"center",margin:0}}>Con este nivel no hay incentivo variable.</p>}
                </div>
                {resultado.tasa>0&&(
                  <div style={{marginTop:16,padding:"12px 16px",borderRadius:10,background:campeon?"rgba(255,184,0,.07)":"rgba(21,101,192,.08)",border:`1px solid ${campeon?"rgba(255,184,0,.18)":"rgba(21,101,192,.2)"}`,fontSize:"clamp(13px,3.5vw,15px)",color:campeon?C.gld:"#90CAF9",textAlign:"left"}}>
                    {campeon?"Nivel máximo — estás por encima del 130%.":
                      `Tasa: ${(resultado.tasa*100).toFixed(3)}% · Cumpl: ${((resultado.cumplA||resultado.cumplT||0)*100).toFixed(1)}%`}
                  </div>
                )}
                {es7030&&!tiendaOk&&resultado.comInd>0&&(
                  <div style={{marginTop:12,padding:"12px 16px",borderRadius:10,background:"rgba(255,167,38,.06)",border:"1px solid rgba(255,167,38,.15)",fontSize:"clamp(13px,3.5vw,15px)",color:"#FFB74D",textAlign:"left"}}>
                    Si tu tienda llega al 100%, ganarías <strong>${(resultado.comInd/0.7*0.3).toFixed(2)} más</strong> este mes.
                  </div>
                )}
              </>
            )}
            <p style={{color:C.b0,fontSize:11,margin:"24px 0 0",lineHeight:1.5}}>Simulación educativa · Los montos reales pueden variar según políticas internas.</p>
          </div>
        )}

      </div>
    </div>
  );
}