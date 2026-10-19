import { useState, useEffect, useRef, useMemo } from "react";

// ═══════════════════════════════════════════════════════════
// TASAS ASESOR 70-30 — actualizado 13 agosto 2026
// ═══════════════════════════════════════════════════════════
const T70_CLUSTER = {
  "MARATHON SPORTS": {
    A: [[0,0],[0.9,0.00129],[0.9499,0.00206],[0.9799,0.002831],[1,0.003986],[1.0499,0.005141],[1.0999,0.006296],[1.15,0.007451],[1.2,0.008992],[1.3,0.010532]],
    B: [[0,0],[0.9,0.001523],[0.9499,0.00241],[0.9799,0.003296],[1,0.004626],[1.0499,0.005956],[1.0999,0.007286],[1.15,0.008616],[1.2,0.010389],[1.3,0.012163]],
    C: [[0,0],[0.9,0.002033],[0.9499,0.003174],[0.9799,0.004316],[1,0.006028],[1.0499,0.00774],[1.0999,0.009452],[1.15,0.011164],[1.2,0.013447],[1.3,0.01573]],
    AA: [[0,0],[0.9,0.0015],[0.9499,0.0023],[0.9799,0.003],[1,0.0042],[1.0499,0.0053],[1.0999,0.0065],[1.15,0.008],[1.2,0.008992],[1.3,0.010532]],
  },
  "EXPLORER": {
    A: [[0,0],[0.9,0.001718099656],[0.9499,0.002577149483],[0.9799,0.003436199311],[1,0.004724774053],[1.0499,0.006013348794],[1.0999,0.007301923536],[1.15,0.008590498278],[1.2,0.01030859793],[1.3,0.01202669759]],
    B: [[0,0],[0.9,0.002074890083],[0.9499,0.003112335124],[0.9799,0.004149780166],[1,0.005705947728],[1.0499,0.00726211529],[1.0999,0.008818282852],[1.15,0.01037445041],[1.2,0.0124493405],[1.3,0.01452423058]],
    C: [[0,0],[0.9,0.002331067015],[0.9499,0.003496600523],[0.9799,0.004662134031],[1,0.006410434292],[1.0499,0.008158734553],[1.0999,0.009907034815],[1.15,0.01165533508],[1.2,0.01398640209],[1.3,0.01631746911]],
    D: [[0,0],[0.9,0.002950915235],[0.9499,0.004426372852],[0.9799,0.005901830469],[1,0.008115016895],[1.0499,0.01032820332],[1.0999,0.01254138975],[1.15,0.01475457617],[1.2,0.01770549141],[1.3,0.02065640664]],
  },
  "TAF": {
    A: [[0,0],[0.9,0.00421019548],[0.9499,0.00631529322],[0.9799,0.00842039096],[1,0.01157803757],[1.0499,0.01473568418],[1.0999,0.01789333079],[1.15,0.0210509774],[1.2,0.02526117288],[1.3,0.02947136836]],
    B: [[0,0],[0.9,0.004550222265],[0.9499,0.006825333398],[0.9799,0.009100444531],[1,0.01251311123],[1.0499,0.01592577793],[1.0999,0.01933844463],[1.15,0.02275111133],[1.2,0.02730133359],[1.3,0.03185155586]],
  },
};
const T70_FLAT = {
  "TELESHOP": [[0,0],[0.9,0.004190094291],[0.9499,0.006285141436],[0.9799,0.008380188581],[1,0.0115227593],[1.0499,0.01466533002],[1.0999,0.01780790074],[1.15,0.02095047145],[1.2,0.02514056574],[1.3,0.02933066003]],
  "BIG HEAD": [[0,0],[0.9,0.002912079196],[0.9499,0.004368118793],[0.9799,0.005824158391],[1,0.008008217788],[1.0499,0.01019227718],[1.0999,0.01237633658],[1.15,0.01456039598],[1.2,0.01747247517],[1.3,0.02038455437]],
  "JANSPORT": [[0,0],[0.9,0.003470036256],[0.9499,0.005205054385],[0.9799,0.006940072513],[1,0.009542599705],[1.0499,0.0121451269],[1.0999,0.01474765409],[1.15,0.01735018128],[1.2,0.02082021754],[1.3,0.0242902538]],
};
const TBD = {
  "OUTLET":           [[0,0],[0.9,0.00026],[0.9499,0.00033],[0.9799,0.000415],[1,0.00053],[1.0499,0.00059],[1.0999,0.000675],[1.15,0.00075],[1.2,0.00085],[1.3,0.000965]],
  "BODEGA DEPORTIVA": [[0,0],[0.9,0.00027],[0.9499,0.000375],[0.9799,0.0003925],[1,0.000555],[1.0499,0.000579],[1.0999,0.00067],[1.15,0.000725],[1.2,0.000875],[1.3,0.00113]],
};
const TNA_CLUSTER = {
  "JEFE DE ALMACEN": {
    "MARATHON SPORTS": {
      A:[[0,0],[0.9,0.0008],[0.9499,0.0014],[0.9799,0.0024],[1,0.0028],[1.0499,0.0033],[1.0999,0.0038],[1.15,0.0042],[1.2,0.0048],[1.3,0.0052]],
      B:[[0,0],[0.9,0.0014],[0.9499,0.0018],[0.9799,0.0032],[1,0.0038],[1.0499,0.004],[1.0999,0.0045],[1.15,0.005],[1.2,0.0055],[1.3,0.006]],
      C:[[0,0],[0.9,0.0018],[0.9499,0.0023],[0.9799,0.0038],[1,0.0053],[1.0499,0.006],[1.0999,0.0065],[1.15,0.007],[1.2,0.0075],[1.3,0.008]],
      AA:[[0,0],[0.9,0.0008],[0.9499,0.0014],[0.9799,0.0024],[1,0.0028],[1.0499,0.0033],[1.0999,0.0038],[1.15,0.0042],[1.2,0.0048],[1.3,0.0052]],
    },
    "EXPLORER": {
      A:[[0,0],[0.9,0.0008],[0.9499,0.0018],[0.9799,0.0028],[1,0.0038],[1.0499,0.0042],[1.0999,0.0045],[1.15,0.005],[1.2,0.0055],[1.3,0.006]],
      B:[[0,0],[0.9,0.001],[0.9499,0.0028],[0.9799,0.0038],[1,0.0045],[1.0499,0.0048],[1.0999,0.0052],[1.15,0.0055],[1.2,0.006],[1.3,0.0065]],
      C:[[0,0],[0.9,0.0008],[0.9499,0.0018],[0.9799,0.0028],[1,0.0038],[1.0499,0.0042],[1.0999,0.0045],[1.15,0.005],[1.2,0.0055],[1.3,0.006]],
      D:[[0,0],[0.9,0.0008],[0.9499,0.0018],[0.9799,0.0028],[1,0.0038],[1.0499,0.0042],[1.0999,0.0045],[1.15,0.005],[1.2,0.0055],[1.3,0.006]],
    },
    "TAF": {
      A:[[0,0],[0.9,0.002],[0.9499,0.0055],[0.9799,0.006],[1,0.0065],[1.0499,0.007],[1.0999,0.0075],[1.15,0.008],[1.2,0.0085],[1.3,0.009]],
      B:[[0,0],[0.9,0.0025],[0.9499,0.0065],[0.9799,0.007],[1,0.0075],[1.0499,0.008],[1.0999,0.0085],[1.15,0.009],[1.2,0.0095],[1.3,0.01]],
    },
  },
  "SUBJEFE DE ALMACEN": {
    "MARATHON SPORTS": {
      A:[[0,0],[0.9,0.00064],[0.9499,0.00098],[0.9799,0.00168],[1,0.00196],[1.0499,0.00231],[1.0999,0.00266],[1.15,0.00294],[1.2,0.00336],[1.3,0.00364]],
      B:[[0,0],[0.9,0.00112],[0.9499,0.00126],[0.9799,0.00224],[1,0.00266],[1.0499,0.0028],[1.0999,0.00315],[1.15,0.0035],[1.2,0.00385],[1.3,0.0042]],
      C:[[0,0],[0.9,0.00144],[0.9499,0.00161],[0.9799,0.00266],[1,0.00371],[1.0499,0.0042],[1.0999,0.00455],[1.15,0.0049],[1.2,0.00525],[1.3,0.0056]],
      AA:[[0,0],[0.9,0.00064],[0.9499,0.00098],[0.9799,0.00168],[1,0.00196],[1.0499,0.00231],[1.0999,0.00266],[1.15,0.00294],[1.2,0.00336],[1.3,0.00364]],
    },
    "EXPLORER": {
      A:[[0,0],[0.9,0.00056],[0.9499,0.00126],[0.9799,0.00196],[1,0.00266],[1.0499,0.00294],[1.0999,0.00315],[1.15,0.0035],[1.2,0.00385],[1.3,0.0042]],
      B:[[0,0],[0.9,0.0007],[0.9499,0.00196],[0.9799,0.00266],[1,0.00315],[1.0499,0.00336],[1.0999,0.00364],[1.15,0.00385],[1.2,0.0042],[1.3,0.00455]],
      C:[[0,0],[0.9,0.0007],[0.9499,0.00196],[0.9799,0.00266],[1,0.00315],[1.0499,0.00336],[1.0999,0.00364],[1.15,0.00385],[1.2,0.0042],[1.3,0.00455]],
      D:[[0,0],[0.9,0.00056],[0.9499,0.00126],[0.9799,0.00196],[1,0.00266],[1.0499,0.00294],[1.0999,0.00315],[1.15,0.0035],[1.2,0.00385],[1.3,0.0042]],
    },
    "TAF": {
      A:[[0,0],[0.9,0.0014],[0.9499,0.00385],[0.9799,0.0042],[1,0.00455],[1.0499,0.0049],[1.0999,0.00525],[1.15,0.0056],[1.2,0.00595],[1.3,0.0063]],
      B:[[0,0],[0.9,0.00175],[0.9499,0.00455],[0.9799,0.0049],[1,0.00525],[1.0499,0.0056],[1.0999,0.00595],[1.15,0.0063],[1.2,0.00665],[1.3,0.007]],
    },
  },
  "CAJERO": {
    "MARATHON SPORTS": {
      A:[[0,0],[0.9,0.0001805152299],[0.9499,0.0002456085069],[0.9799,0.000350596978],[1,0.0003959138432],[1.0499,0.0004265947701],[1.0999,0.0004807816269],[1.15,0.0004953314396],[1.2,0.000513539776],[1.3,0.0006014428425]],
      B:[[0,0],[0.9,0.0002046421596],[0.9499,0.0002892410743],[0.9799,0.0004256900462],[1,0.0004845864145],[1.0499,0.0005244610873],[1.0999,0.0005948853998],[1.15,0.0006137951616],[1.2,0.0006374597484],[1.3,0.0007517035594]],
      C:[[0,0],[0.9,0.0002394998152],[0.9499,0.0003522797218],[0.9799,0.0005341816096],[1,0.0006126971193],[1.0499,0.000665854561],[1.0999,0.0007597381221],[1.15,0.0007849469699],[1.2,0.0008164945365],[1.3,0.0009687944373]],
      AA:[[0,0],[0.9,0.0001805152299],[0.9499,0.0002456085069],[0.9799,0.000350596978],[1,0.0003959138432],[1.0499,0.0004265947701],[1.0999,0.0004807816269],[1.15,0.0004953314396],[1.2,0.000513539776],[1.3,0.0006014428425]],
    },
    "EXPLORER": {
      A:[[0,0],[0.9,0.0001897679754],[0.9499,0.0002623417194],[0.9799,0.0003793953811],[1,0.000429920024],[1.0499,0.0004641267784],[1.0999,0.0005245407451],[1.15,0.0005407626106],[1.2,0.0005610634344],[1.3,0.0006590682506]],
      B:[[0,0],[0.9,0.00005],[0.9499,0.0003],[0.9799,0.0004],[1,0.0005],[1.0499,0.0007],[1.0999,0.00075],[1.15,0.0008],[1.2,0.00085],[1.3,0.0009]],
    },
  },
  "AUX. DE BODEGA": {
    "MARATHON SPORTS": {
      A:[[0,0.0001],[0.9,0.000164632507],[0.9499,0.0002168852507],[0.9799,0.0003011633195],[1,0.0003375408173],[1.0499,0.0003621695146],[1.0999,0.0004056672777],[1.15,0.0004173469422],[1.2,0.0004319634369],[1.3,0.0005025264293]],
      B:[[0,0.0001],[0.9,0.0001826290176],[0.9499,0.0002494312057],[0.9799,0.000357175967],[1,0.0004036825478],[1.0499,0.0004351689493],[1.0999,0.000490778388],[1.15,0.0005057101807],[1.2,0.0005243965455],[1.3,0.0006146073545]],
      C:[[0,0.0001],[0.9,0.0002389777414],[0.9499,0.0003513355725],[0.9799,0.0005325566979],[1,0.0006107783657],[1.0499,0.0006637368673],[1.0999,0.0007572690719],[1.15,0.0007823835764],[1.2,0.0008138130771],[1.3,0.0009655430001]],
      AA:[[0,0.0001],[0.9,0.000164632507],[0.9499,0.0002168852507],[0.9799,0.0003011633195],[1,0.0003375408173],[1.0499,0.0003621695146],[1.0999,0.0004056672777],[1.15,0.0004173469422],[1.2,0.0004319634369],[1.3,0.0005025264293]],
    },
    "EXPLORER": {
      A:[[0,0.0001],[0.9,0.0001917524767],[0.9499,0.000265930609],[0.9799,0.0003855719769],[1,0.0004372135684],[1.0499,0.0004721765318],[1.0999,0.0005339260706],[1.15,0.0005505065529],[1.2,0.0005712561672],[1.3,0.0006714275766]],
      B:[[0,0.0001],[0.9,0.0001722071761],[0.9499,0.0002305837307],[0.9799,0.0003247388493],[1,0.0003653796432],[1.0499,0.0003928947245],[1.0999,0.00044149025],[1.15,0.000454538724],[1.2,0.0004708682129],[1.3,0.0005497009034]],
    },
  },
};
const TNA_FLAT = {
  "JEFE DE ALMACEN": {
    "OUTLET":[[0,0],[0.9,0.0008],[0.9499,0.0018],[0.9799,0.0025],[1,0.0035],[1.0499,0.004],[1.0999,0.0045],[1.15,0.0048],[1.2,0.0052],[1.3,0.0057]],
    "BODEGA DEPORTIVA":[[0,0],[0.9,0.0008],[0.9499,0.0018],[0.9799,0.0025],[1,0.0035],[1.0499,0.004],[1.0999,0.0045],[1.15,0.0048],[1.2,0.0052],[1.3,0.0057]],
    "TELESHOP":[[0,0],[0.9,0.0015],[0.9499,0.0025],[0.9799,0.004],[1,0.005],[1.0499,0.006],[1.0999,0.007],[1.15,0.008],[1.2,0.009],[1.3,0.01]],
    "BIG HEAD":[[0,0],[0.9,0.002],[0.9499,0.0055],[0.9799,0.006],[1,0.0065],[1.0499,0.007],[1.0999,0.0075],[1.15,0.008],[1.2,0.0085],[1.3,0.009]],
    "JANSPORT":[[0,0],[0.9,0.00005],[0.9501,0.0002],[1,0.0004],[1.1,0.0006],[1.3,0.01]],
  },
  "SUBJEFE DE ALMACEN": {
    "OUTLET":[[0,0],[0.9,0.00056],[0.9499,0.00126],[0.9799,0.00175],[1,0.00245],[1.0499,0.0028],[1.0999,0.00315],[1.15,0.00336],[1.2,0.00364],[1.3,0.00399]],
    "BODEGA DEPORTIVA":[[0,0],[0.9,0.00056],[0.9499,0.00126],[0.9799,0.00175],[1,0.00245],[1.0499,0.0028],[1.0999,0.00315],[1.15,0.00336],[1.2,0.00364],[1.3,0.00399]],
    "TELESHOP":[[0,0],[0.9,0.00105],[0.9499,0.00175],[0.9799,0.0028],[1,0.0035],[1.0499,0.0042],[1.0999,0.0049],[1.15,0.0056],[1.2,0.0063],[1.3,0.007]],
    "BIG HEAD":[[0,0],[0.9,0.0014],[0.9499,0.00385],[0.9799,0.0042],[1,0.00455],[1.0499,0.0049],[1.0999,0.00525],[1.15,0.0056],[1.2,0.00595],[1.3,0.0063]],
    "JANSPORT":[[0,0],[0.9,0.000035],[0.9501,0.00014],[1,0.00028],[1.1,0.00042],[1.3,0.007]],
  },
  "CAJERO": {
    "OUTLET":[[0,0],[0.9,0.0002474583381],[0.9499,0.0003666723856],[0.9799,0.0005589518522],[1,0.0006419467046],[1.0499,0.0006981368007],[1.0999,0.0007973764582],[1.15,0.0008240234813],[1.2,0.0008573708498],[1.3,0.001018359524]],
    "BODEGA DEPORTIVA":[[0,0],[0.9,0.000227355011],[0.9499,0.0003303163391],[0.9799,0.0004963819133],[1,0.0005680618907],[1.0499,0.0006165914645],[1.0999,0.0007023015562],[1.15,0.0007253157306],[1.2,0.0007541167773],[1.3,0.000893157503]],
    "TELESHOP":[[0,0],[0.9,0.000189968458],[0.9499,0.000262704284],[0.9799,0.0003800193667],[1,0.0004306568483],[1.0499,0.0004649399981],[1.0999,0.00052548889],[1.15,0.0005417469844],[1.2,0.0005620931469],[1.3,0.0006603168414]],
    "TAF":[[0,0],[0.9,0.0002179210952],[0.9499,0.0003132554874],[0.9799,0.0004670196324],[1,0.0005333898629],[1.0499,0.0005783245729],[1.0999,0.0006576856266],[1.15,0.0006789950093],[1.2,0.0007056625973],[1.3,0.0008344037792]],
    "BIG HEAD":[[0,0],[0.9,0.000189968458],[0.9499,0.000262704284],[0.9799,0.0003800193667],[1,0.0004306568483],[1.0499,0.0004649399981],[1.0999,0.00052548889],[1.15,0.0005417469844],[1.2,0.0005620931469],[1.3,0.0006603168414]],
    "JANSPORT":[[0,0],[0.9,0],[0.9501,0],[1,0],[1.1,0],[1.3,0]],
  },
  "AUX. DE BODEGA": {
    "OUTLET":[[0,0.0001],[0.9,0.0002004730652],[0.9499,0.0002817014374],[0.9799,0.0004127140857],[1,0.0004692639378],[1.0499,0.0005075499463],[1.0999,0.0005751684527],[1.15,0.0005933248223],[1.2,0.000616046578],[1.3,0.0007257387509]],
    "BODEGA DEPORTIVA":[[0,0.0001],[0.9,0.0001735170877],[0.9499,0.0002329526522],[0.9799,0.0003288158404],[1,0.0003701938995],[1.0499,0.0003982081323],[1.0999,0.0004476852301],[1.15,0.0004609704166],[1.2,0.0004775961391],[1.3,0.0005578589347]],
    "TELESHOP":[[0,0],[0.9,0.00009],[0.9499,0.0001627],[0.9799,0.00028],[1,0.0003307],[1.0499,0.0003649],[1.0999,0.0004255],[1.15,0.0004417],[1.2,0.0004621],[1.3,0.0005603]],
    "TAF":[[0,0.0001],[0.9,0.0001713532433],[0.9499,0.000229039428],[0.9799,0.0003220810542],[1,0.000362241224],[1.0499,0.0003894309078],[1.0999,0.0004374517354],[1.15,0.0004503458962],[1.2,0.0004664822702],[1.3,0.0005443826736]],
    "BIG HEAD":[[0,0],[0.9,0.00005],[0.9499,0.0003],[0.9799,0.0004],[1,0.0005],[1.0499,0.0007],[1.0999,0.00075],[1.15,0.0008],[1.2,0.00085],[1.3,0.0009]],
    "JANSPORT":[[0,0],[0.9,0.00005],[0.9501,0.0002],[1,0.0004],[1.1,0.0006],[1.3,0.01]],
  },
};
const BONO_NA = {"JEFE DE ALMACEN":100,"SUBJEFE DE ALMACEN":70};
const SIN_IV  = ["AUX. DE TIENDA","MECANICO BICICLETAS"];
const PIN     = "INCENTIVOS2026*";
const ADMIN_PIN = "marathon*admin2026";
const RANGOS  = ["< 90%","90–95%","95–100%","100–110%","110–130%","+130%"];
const RANGO_V = {"< 90%":.85,"90–95%":.925,"95–100%":.975,"100–110%":1.05,"110–130%":1.20,"+130%":1.35};

// ═══════════════════════════════════════════════════════════
// TIENDAS — Marathon (46) y Explorer (18) con cluster asignado
// ═══════════════════════════════════════════════════════════
const TIENDAS = [
  {n:"MARATHON SPORTS 9 DE OCTUBRE", con:"MARATHON SPORTS", cl:"B"},
  {n:"MARATHON SPORTS BAHIA DE CARAQUEZ", con:"MARATHON SPORTS", cl:"C"},
  {n:"MARATHON SPORTS BOMBOLI SHOPPING", con:"MARATHON SPORTS", cl:"A"},
  {n:"MARATHON SPORTS CITY MALL", con:"MARATHON SPORTS", cl:"B"},
  {n:"MARATHON SPORTS COLON", con:"MARATHON SPORTS", cl:"A"},
  {n:"MARATHON SPORTS CONDADO SHOPPING", con:"MARATHON SPORTS", cl:"A"},
  {n:"MARATHON SPORTS EL BOSQUE", con:"MARATHON SPORTS", cl:"C"},
  {n:"MARATHON SPORTS EL PORTAL", con:"MARATHON SPORTS", cl:"A"},
  {n:"MARATHON SPORTS EL RECREO", con:"MARATHON SPORTS", cl:"A"},
  {n:"MARATHON SPORTS IÑAQUITO", con:"MARATHON SPORTS", cl:"B"},
  {n:"MARATHON SPORTS LAGUNA MALL", con:"MARATHON SPORTS", cl:"B"},
  {n:"MARATHON SPORTS MALL DE LOS ANDES", con:"MARATHON SPORTS", cl:"B"},
  {n:"MARATHON SPORTS MALL DEL ALTO", con:"MARATHON SPORTS", cl:"A"},
  {n:"MARATHON SPORTS MALL DEL NORTE", con:"MARATHON SPORTS", cl:"B"},
  {n:"MARATHON SPORTS MALL DEL PACIFICO", con:"MARATHON SPORTS", cl:"A"},
  {n:"MARATHON SPORTS MALL DEL RIO", con:"MARATHON SPORTS", cl:"A"},
  {n:"MARATHON SPORTS MALL DEL SOL", con:"MARATHON SPORTS", cl:"AA"},
  {n:"MARATHON SPORTS MALL DEL SUR", con:"MARATHON SPORTS", cl:"B"},
  {n:"MARATHON SPORTS MALL EL JARDIN", con:"MARATHON SPORTS", cl:"B"},
  {n:"MARATHON SPORTS MALTERIA PLAZA", con:"MARATHON SPORTS", cl:"B"},
  {n:"MARATHON SPORTS MULTIPLAZA", con:"MARATHON SPORTS", cl:"C"},
  {n:"MARATHON SPORTS MULTIPLAZA LA PRADERA", con:"MARATHON SPORTS", cl:"B"},
  {n:"MARATHON SPORTS PASEO LA PENINSULA", con:"MARATHON SPORTS", cl:"B"},
  {n:"MARATHON SPORTS PASEO MACHALA", con:"MARATHON SPORTS", cl:"A"},
  {n:"MARATHON SPORTS PASEO PORTOVIEJO", con:"MARATHON SPORTS", cl:"B"},
  {n:"MARATHON SPORTS PASEO SAN FRANCISCO", con:"MARATHON SPORTS", cl:"C"},
  {n:"MARATHON SPORTS PASEO SANTO DOMINGO", con:"MARATHON SPORTS", cl:"C"},
  {n:"MARATHON SPORTS PASEO SHOPPING AMBATO", con:"MARATHON SPORTS", cl:"C"},
  {n:"MARATHON SPORTS PASEO SHOPPING BABAHOYO", con:"MARATHON SPORTS", cl:"B"},
  {n:"MARATHON SPORTS PASEO SHOPPING DAULE", con:"MARATHON SPORTS", cl:"C"},
  {n:"MARATHON SPORTS PASEO SHOPPING MANTA", con:"MARATHON SPORTS", cl:"B"},
  {n:"MARATHON SPORTS PASEO SHOPPING MILAGRO", con:"MARATHON SPORTS", cl:"B"},
  {n:"MARATHON SPORTS PASEO SHOPPING PLAYAS", con:"MARATHON SPORTS", cl:"C"},
  {n:"MARATHON SPORTS PASEO SHOPPING QUEVEDO", con:"MARATHON SPORTS", cl:"B"},
  {n:"MARATHON SPORTS PLAZA SHOPPING CENTER", con:"MARATHON SPORTS", cl:"B"},
  {n:"MARATHON SPORTS POLICENTRO", con:"MARATHON SPORTS", cl:"B"},
  {n:"MARATHON SPORTS QUICENTRO SHOPPING", con:"MARATHON SPORTS", cl:"AA"},
  {n:"MARATHON SPORTS QUICENTRO SUR", con:"MARATHON SPORTS", cl:"A"},
  {n:"MARATHON SPORTS RIOBAMBA", con:"MARATHON SPORTS", cl:"B"},
  {n:"MARATHON SPORTS RIOCENTRO EL DORADO", con:"MARATHON SPORTS", cl:"A"},
  {n:"MARATHON SPORTS RIOCENTRO ENTRE RIOS", con:"MARATHON SPORTS", cl:"B"},
  {n:"MARATHON SPORTS RIOCENTRO LOS CEIBOS", con:"MARATHON SPORTS", cl:"B"},
  {n:"MARATHON SPORTS RIOCENTRO NORTE", con:"MARATHON SPORTS", cl:"B"},
  {n:"MARATHON SPORTS SAN LUIS SHOPPING", con:"MARATHON SPORTS", cl:"A"},
  {n:"MARATHON SPORTS SAN MARINO", con:"MARATHON SPORTS", cl:"A"},
  {n:"MARATHON SPORTS SCALA SHOPPING", con:"MARATHON SPORTS", cl:"A"},
  {n:"EXPLORER CONDADO SHOPPING", con:"EXPLORER", cl:"C"},
  {n:"EXPLORER EL BOSQUE", con:"EXPLORER", cl:"D"},
  {n:"EXPLORER EL PORTAL", con:"EXPLORER", cl:"D"},
  {n:"EXPLORER EL RECREO", con:"EXPLORER", cl:"B"},
  {n:"EXPLORER LAGUNA MALL", con:"EXPLORER", cl:"B"},
  {n:"EXPLORER MALL DE LOS ANDES", con:"EXPLORER", cl:"D"},
  {n:"EXPLORER MALL DEL RIO", con:"EXPLORER", cl:"B"},
  {n:"EXPLORER MALL DEL SOL", con:"EXPLORER", cl:"B"},
  {n:"EXPLORER MALL EL JARDIN", con:"EXPLORER", cl:"B"},
  {n:"EXPLORER MALTERIA PLAZA", con:"EXPLORER", cl:"C"},
  {n:"EXPLORER MULTIPLAZA LA PRADERA", con:"EXPLORER", cl:"C"},
  {n:"EXPLORER PASEO SHOPPING RIOBAMBA", con:"EXPLORER", cl:"C"},
  {n:"EXPLORER POLICENTRO", con:"EXPLORER", cl:"C"},
  {n:"EXPLORER QUICENTRO SHOPPING", con:"EXPLORER", cl:"A"},
  {n:"EXPLORER RIOCENTRO SHOPPING QUITO", con:"EXPLORER", cl:"D"},
  {n:"EXPLORER SAN LUIS SHOPPING", con:"EXPLORER", cl:"C"},
  {n:"EXPLORER SCALA SHOPPING", con:"EXPLORER", cl:"B"},
  {n:"EXPLORER VENTURA MALL", con:"EXPLORER", cl:"D"},
  {n:"TAF CONDADO SHOPPING", con:"TAF", cl:"A"},
  {n:"TAF EL BOSQUE", con:"TAF", cl:"B"},
  {n:"TAF EL PORTAL", con:"TAF", cl:"A"},
  {n:"TAF MALL DEL NORTE", con:"TAF", cl:"B"},
  {n:"TAF MALL DEL PACIFICO", con:"TAF", cl:"A"},
  {n:"TAF MALL DEL SOL", con:"TAF", cl:"A"},
  {n:"TAF MALL DEL SUR", con:"TAF", cl:"B"},
  {n:"TAF MALL EL JARDIN", con:"TAF", cl:"A"},
  {n:"TAF POLICENTRO", con:"TAF", cl:"B"},
  {n:"TAF QUICENTRO SUR", con:"TAF", cl:"A"},
  {n:"TAF RIOCENTRO SHOPPING QUITO", con:"TAF", cl:"B"},
  {n:"TAF SCALA SHOPPING MALL", con:"TAF", cl:"A"},
];

const CONCEPTOS_FLAT = [
  {id:"MARATHON SPORTS",lbl:"Marathon Sports"},{id:"EXPLORER",lbl:"Explorer"},
  {id:"TELESHOP",lbl:"Teleshop"},{id:"TAF",lbl:"TAF"},
  {id:"BIG HEAD",lbl:"Big Head"},{id:"JANSPORT",lbl:"Jansport"},
  {id:"OUTLET",lbl:"Outlet"},{id:"BODEGA DEPORTIVA",lbl:"Bodega Deportiva"},
];
const CON_TIENDAS = ["MARATHON SPORTS","EXPLORER","TAF"]; // conceptos que requieren elegir tienda
const MARCA_PIN = {
  "TELESHOP": "62950",
  "BIG HEAD": "33435",
  "JANSPORT": "40180",
  "OUTLET": "42562",
  "BODEGA DEPORTIVA": "27464",
};

const TIENDA_PIN = {
  "MARATHON SPORTS 9 DE OCTUBRE": "93810",
  "MARATHON SPORTS BAHIA DE CARAQUEZ": "24592",
  "MARATHON SPORTS BOMBOLI SHOPPING": "13278",
  "MARATHON SPORTS CITY MALL": "46048",
  "MARATHON SPORTS COLON": "42098",
  "MARATHON SPORTS CONDADO SHOPPING": "39256",
  "MARATHON SPORTS EL BOSQUE": "28289",
  "MARATHON SPORTS EL PORTAL": "23434",
  "MARATHON SPORTS EL RECREO": "98696",
  "MARATHON SPORTS IÑAQUITO": "81482",
  "MARATHON SPORTS LAGUNA MALL": "21395",
  "MARATHON SPORTS MALL DE LOS ANDES": "87397",
  "MARATHON SPORTS MALL DEL ALTO": "65302",
  "MARATHON SPORTS MALL DEL NORTE": "14165",
  "MARATHON SPORTS MALL DEL PACIFICO": "13905",
  "MARATHON SPORTS MALL DEL RIO": "22280",
  "MARATHON SPORTS MALL DEL SOL": "38657",
  "MARATHON SPORTS MALL DEL SUR": "40495",
  "MARATHON SPORTS MALL EL JARDIN": "76237",
  "MARATHON SPORTS MALTERIA PLAZA": "88907",
  "MARATHON SPORTS MULTIPLAZA": "13478",
  "MARATHON SPORTS MULTIPLAZA LA PRADERA": "83563",
  "MARATHON SPORTS PASEO LA PENINSULA": "36062",
  "MARATHON SPORTS PASEO MACHALA": "95181",
  "MARATHON SPORTS PASEO PORTOVIEJO": "81426",
  "MARATHON SPORTS PASEO SAN FRANCISCO": "64987",
  "MARATHON SPORTS PASEO SANTO DOMINGO": "38893",
  "MARATHON SPORTS PASEO SHOPPING AMBATO": "68878",
  "MARATHON SPORTS PASEO SHOPPING BABAHOYO": "87236",
  "MARATHON SPORTS PASEO SHOPPING DAULE": "46463",
  "MARATHON SPORTS PASEO SHOPPING MANTA": "10851",
  "MARATHON SPORTS PASEO SHOPPING MILAGRO": "30926",
  "MARATHON SPORTS PASEO SHOPPING PLAYAS": "65392",
  "MARATHON SPORTS PASEO SHOPPING QUEVEDO": "54597",
  "MARATHON SPORTS PLAZA SHOPPING CENTER": "46421",
  "MARATHON SPORTS POLICENTRO": "30379",
  "MARATHON SPORTS QUICENTRO SHOPPING": "38221",
  "MARATHON SPORTS QUICENTRO SUR": "54118",
  "MARATHON SPORTS RIOBAMBA": "23396",
  "MARATHON SPORTS RIOCENTRO EL DORADO": "22156",
  "MARATHON SPORTS RIOCENTRO ENTRE RIOS": "59797",
  "MARATHON SPORTS RIOCENTRO LOS CEIBOS": "22676",
  "MARATHON SPORTS RIOCENTRO NORTE": "57052",
  "MARATHON SPORTS SAN LUIS SHOPPING": "55082",
  "MARATHON SPORTS SAN MARINO": "89131",
  "MARATHON SPORTS SCALA SHOPPING": "44671",
  "EXPLORER CONDADO SHOPPING": "15695",
  "EXPLORER EL BOSQUE": "70217",
  "EXPLORER EL PORTAL": "80284",
  "EXPLORER EL RECREO": "26361",
  "EXPLORER LAGUNA MALL": "59615",
  "EXPLORER MALL DE LOS ANDES": "20328",
  "EXPLORER MALL DEL RIO": "82357",
  "EXPLORER MALL DEL SOL": "48427",
  "EXPLORER MALL EL JARDIN": "92397",
  "EXPLORER MALTERIA PLAZA": "91070",
  "EXPLORER MULTIPLAZA LA PRADERA": "57400",
  "EXPLORER PASEO SHOPPING RIOBAMBA": "85674",
  "EXPLORER POLICENTRO": "35203",
  "EXPLORER QUICENTRO SHOPPING": "19116",
  "EXPLORER RIOCENTRO SHOPPING QUITO": "16006",
  "EXPLORER SAN LUIS SHOPPING": "96673",
  "EXPLORER SCALA SHOPPING": "39871",
  "EXPLORER VENTURA MALL": "47930",
  "TAF CONDADO SHOPPING": "20458",
  "TAF EL BOSQUE": "40512",
  "TAF EL PORTAL": "23238",
  "TAF MALL DEL NORTE": "59823",
  "TAF MALL DEL PACIFICO": "46434",
  "TAF MALL DEL SOL": "69429",
  "TAF MALL DEL SUR": "93320",
  "TAF MALL EL JARDIN": "57819",
  "TAF POLICENTRO": "31319",
  "TAF QUICENTRO SUR": "58520",
  "TAF RIOCENTRO SHOPPING QUITO": "56566",
  "TAF SCALA SHOPPING MALL": "37460",
};

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

function porDesde(t,v){let r=0;for(const[d,x]of t)if(v>=d)r=x;return r;}

function tasaAsesor70(concepto, cluster, cumpl) {
  if (cluster && T70_CLUSTER[concepto]) return porDesde(T70_CLUSTER[concepto][cluster], cumpl);
  return porDesde(T70_FLAT[concepto], cumpl);
}
function tasaNA(cargo, concepto, cluster, cumpl) {
  if (cluster && TNA_CLUSTER[cargo] && TNA_CLUSTER[cargo][concepto] && TNA_CLUSTER[cargo][concepto][cluster]) {
    return porDesde(TNA_CLUSTER[cargo][concepto][cluster], cumpl);
  }
  const flat = TNA_FLAT[cargo] || {};
  return porDesde(flat[concepto] || [], cumpl);
}

function calc({concepto,cluster,cargo,metaA,ventaA,tiendaOk,ventaT,metaT,rangoT,margen}){
  const esAse  = cargo==="ASESOR DE VENTAS";
  const es7030 = esAse && (T70_CLUSTER[concepto] || T70_FLAT[concepto]) && concepto!=="OUTLET" && concepto!=="BODEGA DEPORTIVA";
  const esBD   = esAse && !!TBD[concepto];

  if (esAse && !es7030 && !esBD) return null;

  if (es7030) {
    const m=parseFloat(metaA)||0, v=parseFloat(ventaA)||0;
    if(!m||!v) return null;
    const cumplA=v/m, tasa=tasaAsesor70(concepto,cluster,cumplA), base=v*tasa, bono=margen?30:0;
    return {tipo:"7030",comInd:base*.7,comTienda:tiendaOk?base*.3:0,bono,total:base*.7+(tiendaOk?base*.3:0)+bono,cumplA,tasa};
  }
  if (esBD) {
    let cumplT=null, vt=parseFloat(ventaT)||0;
    if(metaT&&ventaT){const mt=parseFloat(metaT)||0;if(mt>0&&vt>0)cumplT=vt/mt;}else if(rangoT)cumplT=RANGO_V[rangoT];
    if(cumplT===null) return null;
    const tasa=porDesde(TBD[concepto],cumplT)*.8, bono=0; // Outlet y Bodega Deportiva no tienen bono de margen bruto
    if(vt>0) return {tipo:"tienda",comInd:0,comTienda:vt*tasa,bono,total:vt*tasa+bono,cumplT,tasa};
    return {tipo:"soloTasa",tasa,cumplT,bono};
  }
  let cumplT=null, vt=parseFloat(ventaT)||0;
  if(metaT&&ventaT){const mt=parseFloat(metaT)||0;if(mt>0&&vt>0)cumplT=vt/mt;}else if(rangoT)cumplT=RANGO_V[rangoT];
  if(cumplT===null) return null;
  const sinBonoMargen = concepto==="OUTLET" || concepto==="BODEGA DEPORTIVA";
  const tasa=tasaNA(cargo,concepto,cluster,cumplT), bono=(margen&&!sinBonoMargen)?(BONO_NA[cargo]||0):0;
  if(vt>0) return {tipo:"tienda",comInd:0,comTienda:vt*tasa,bono,total:vt*tasa+bono,cumplT,tasa};
  return {tipo:"soloTasa",tasa,cumplT,bono};
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
  if(cumpl==null) return null;
  const maxs=is7030?[.9499,.9999,1.0999,1.2999,Infinity]:[.8999,.9499,.9999,1.0999,1.2999,Infinity];
  const lbls=is7030?["<95%","<100%","Meta","Superando","+130%"]:["<90%","90–95%","95–100%","100–110%","110–130%","+130%"];
  const off=is7030?1:0, idx=maxs.findIndex(m=>cumpl<=m), act=idx===-1?maxs.length-1:idx;
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
  const[deferredPrompt,setDeferredPrompt]=useState(null);
  const[showIosHelp,setShowIosHelp]=useState(false);
  const[yaInstalada,setYaInstalada]=useState(false);

  useEffect(()=>{
    const esStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone===true;
    setYaInstalada(esStandalone);

    const onBeforeInstall = (e)=>{ e.preventDefault(); setDeferredPrompt(e); };
    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', ()=>{ setYaInstalada(true); setDeferredPrompt(null); });
    return ()=>window.removeEventListener('beforeinstallprompt', onBeforeInstall);
  },[]);

  const esIOS = typeof navigator!=="undefined" && /iPhone|iPad|iPod/.test(navigator.userAgent);

  const handleDescargar = async ()=>{
    if(deferredPrompt){
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
    } else if(esIOS){
      setShowIosHelp(true);
    }
  };

  const[cargo,setCargo]=useState(null);
  const[tienda,setTienda]=useState(null);       // {n, con, cl} si es Marathon/Explorer
  const[tiendaPendiente,setTiendaPendiente]=useState(null); // tienda elegida, esperando PIN
  const[pinTienda,setPinTienda]=useState("");
  const[pinTiendaErr,setPinTiendaErr]=useState(false);
  const[marcaPendiente,setMarcaPendiente]=useState(null); // marca sin cluster, esperando PIN
  const[pinMarca,setPinMarca]=useState("");
  const[pinMarcaErr,setPinMarcaErr]=useState(false);
  const[marcaOk,setMarcaOk]=useState(null); // marca ya desbloqueada esta sesion
  const[conceptoFlat,setConceptoFlat]=useState(null); // string si es otro concepto
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
  const[adminMode,setAdminMode]=useState(false);
  const[showAdminPin,setShowAdminPin]=useState(false);
  const[pinAdmin,setPinAdmin]=useState("");
  const[pinAdminErr,setPinAdminErr]=useState(false);

  const reset=()=>{setMetaA("");setVentaA("");setTiendaOk(false);setVentaT("");setMetaT("");setRangoT(null);setMargen(false);};
  const selCargo=c=>{if(c.pin&&!pinOk&&!adminMode){setCargo(c);setShowPin(true);return;}setCargo(c);setShowPin(false);reset();};
  const submitPin=()=>{if(pin===PIN){setPinOk(true);setPinErr(false);setShowPin(false);reset();}else setPinErr(true);};

  const submitPinAdmin=()=>{
    if(pinAdmin===ADMIN_PIN){setAdminMode(true);setShowAdminPin(false);setPinAdminErr(false);}
    else setPinAdminErr(true);
  };

  const elegirTienda=t=>{
    if(adminMode){setTienda(t);reset();return;}
    setTiendaPendiente(t);setPinTienda("");setPinTiendaErr(false);
  };
  const submitPinTienda=()=>{
    if(tiendaPendiente&&pinTienda===TIENDA_PIN[tiendaPendiente.n]){
      setTienda(tiendaPendiente);setTiendaPendiente(null);setPinTiendaErr(false);reset();
    }else{
      setPinTiendaErr(true);
    }
  };

  const elegirMarca=id=>{
    if(CON_TIENDAS.includes(id)){setConceptoFlat(id);setTienda(null);reset();return;}
    if(adminMode||marcaOk===id){setConceptoFlat(id);setTienda(null);reset();return;}
    setMarcaPendiente(id);setPinMarca("");setPinMarcaErr(false);
  };
  const submitPinMarca=()=>{
    if(marcaPendiente&&pinMarca===MARCA_PIN[marcaPendiente]){
      setMarcaOk(marcaPendiente);setConceptoFlat(marcaPendiente);setTienda(null);setMarcaPendiente(null);setPinMarcaErr(false);reset();
    }else{
      setPinMarcaErr(true);
    }
  };

  const necesitaTienda = conceptoFlat && CON_TIENDAS.includes(conceptoFlat);
  const concepto = necesitaTienda ? (tienda?tienda.con:null) : conceptoFlat;
  const cluster  = tienda ? tienda.cl : null;
  const listoParaInputs = necesitaTienda ? !!tienda : !!conceptoFlat;

  const esAsesor = cargo?.id==="ASESOR DE VENTAS";
  const es7030   = esAsesor && concepto && (T70_CLUSTER[concepto] || T70_FLAT[concepto]) && concepto!=="OUTLET" && concepto!=="BODEGA DEPORTIVA";
  const esBD     = esAsesor && concepto && !!TBD[concepto];
  const noAse    = !esAsesor;
  const sinIV    = cargo && SIN_IV.includes(cargo.id);
  const conBono  = cargo && ["JEFE DE ALMACEN","SUBJEFE DE ALMACEN"].includes(cargo.id) && concepto!=="OUTLET" && concepto!=="BODEGA DEPORTIVA";
  const needPin  = cargo?.pin && !pinOk && !adminMode;

  const resultado = useMemo(()=>{
    if(!cargo||!concepto||!listoParaInputs||needPin||sinIV) return null;
    return calc({concepto,cluster,cargo:cargo.id,metaA,ventaA,tiendaOk,ventaT,metaT,rangoT,margen});
  },[cargo,concepto,cluster,listoParaInputs,metaA,ventaA,tiendaOk,ventaT,metaT,rangoT,margen,needPin,sinIV]);

  const cumplA=useMemo(()=>{const m=parseFloat(metaA),v=parseFloat(ventaA);return m>0&&v>0?v/m:null;},[metaA,ventaA]);
  const cumplT=useMemo(()=>{const m=parseFloat(metaT),v=parseFloat(ventaT);if(m>0&&v>0)return v/m;if(rangoT)return RANGO_V[rangoT];return null;},[metaT,ventaT,rangoT]);
  const campeon=resultado?.tipo!=="soloTasa"&&(resultado?.cumplA||resultado?.cumplT||0)>=1.3;

  const cumplRelevante = es7030 ? cumplA : cumplT;
  const bajoMinimo = resultado && cumplRelevante!=null && cumplRelevante < 0.90;

  const box={marginBottom:"clamp(24px,6vw,40px)"};

  const[appDesbloqueada,setAppDesbloqueada]=useState(true);
  const[mostrarPinApp,setMostrarPinApp]=useState(false);
  const[pinApp,setPinApp]=useState("");
  const[pinAppErr,setPinAppErr]=useState(false);
  const APP_LOCK_PIN = "MARATHON2026CERRADO";
  const submitPinApp=()=>{
    if(pinApp===APP_LOCK_PIN){setAppDesbloqueada(true);setPinAppErr(false);}
    else setPinAppErr(true);
  };

  if(!appDesbloqueada){
    return(
      <div style={{minHeight:"100vh",width:"100%",background:C.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:20,boxSizing:"border-box",gap:20}}>
        <div style={{width:56,height:56,borderRadius:16,background:`${C.b1}18`,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:4}}>
          <span style={{fontSize:26}}>🛠️</span>
        </div>
        <p style={{color:C.b2,fontSize:12,textTransform:"uppercase",letterSpacing:".12em",margin:0,fontWeight:600}}>Vendes+, Ganas+</p>
        <p style={{color:C.whi,fontWeight:700,fontSize:22,margin:0,fontFamily:"Barlow Condensed,sans-serif",textAlign:"center"}}>Estamos en mantenimiento</p>
        <p style={{color:C.mut,fontSize:14,margin:"-8px 0 4px",textAlign:"center",maxWidth:300,lineHeight:1.5}}>Estamos actualizando el simulador. Cuando esté listo podrás volver a ver tus incentivos aquí mismo.</p>

        {!mostrarPinApp?(
          <button onClick={()=>setMostrarPinApp(true)} style={{background:"none",border:"none",color:C.dim,fontSize:11,cursor:"pointer",fontFamily:"inherit",marginTop:24}}>·</button>
        ):(
          <>
            <div style={{display:"flex",gap:8,width:"100%",maxWidth:320}}>
              <input type="password" value={pinApp}
                onChange={e=>{setPinApp(e.target.value);setPinAppErr(false);}}
                onKeyDown={e=>e.key==="Enter"&&submitPinApp()}
                placeholder="PIN de acceso" autoFocus
                style={{flex:1,minWidth:0,background:C.card,border:`1px solid ${pinAppErr?"#EF5350":C.b0}`,borderRadius:12,padding:"14px 16px",color:C.whi,fontSize:16,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
              <button onClick={submitPinApp} style={{background:C.b1,color:"#fff",border:"none",borderRadius:12,padding:"14px 20px",cursor:"pointer",fontFamily:"inherit",fontWeight:600,fontSize:18,flexShrink:0}}>→</button>
            </div>
            {pinAppErr&&<p style={{color:"#EF5350",fontSize:13,margin:0}}>PIN incorrecto</p>}
          </>
        )}
      </div>
    );
  }

  if(!started){
    return(
      <div style={{minHeight:"100vh",width:"100%",background:C.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"clamp(20px,6vw,40px)",boxSizing:"border-box",gap:"clamp(20px,5vw,32px)"}}>
        <img src="/banner.jpg" alt="Vendes+, Ganas+ Marathon" style={{width:"100%",maxWidth:480,borderRadius:20,boxShadow:"0 0 60px rgba(21,101,192,.25)"}}/>

        {!yaInstalada&&(deferredPrompt||esIOS)&&(
          <button onClick={handleDescargar} style={{background:"transparent",color:C.b2,border:`1.5px solid ${C.b1}`,borderRadius:14,padding:"12px 24px",fontFamily:"Inter,sans-serif",fontWeight:600,fontSize:"clamp(14px,3.5vw,16px)",cursor:"pointer",display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:18}}>📲</span> Descarga la app en tu celular
          </button>
        )}
        {yaInstalada&&(
          <p style={{color:C.mut,fontSize:13,margin:0}}>✓ App instalada en tu celular</p>
        )}

        <button onClick={()=>setStarted(true)} style={{background:C.b1,color:"#fff",border:"none",borderRadius:16,padding:"18px 40px",fontFamily:"Barlow Condensed,sans-serif",fontWeight:900,fontSize:"clamp(20px,5vw,26px)",letterSpacing:".02em",cursor:"pointer",boxShadow:"0 0 40px rgba(21,101,192,.4)"}}>
          CALCULAR MIS GANANCIAS
        </button>

        {showIosHelp&&(
          <div onClick={()=>setShowIosHelp(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.7)",display:"flex",alignItems:"flex-end",zIndex:100}}>
            <div onClick={e=>e.stopPropagation()} style={{background:C.surf,borderTopLeftRadius:20,borderTopRightRadius:20,padding:"28px 24px",width:"100%",boxSizing:"border-box",border:`1px solid ${C.b0}`}}>
              <p style={{color:C.whi,fontWeight:700,fontSize:18,margin:"0 0 16px",fontFamily:"Barlow Condensed,sans-serif"}}>Instalar en iPhone</p>
              <p style={{color:C.sof,fontSize:15,lineHeight:1.7,margin:"0 0 20px"}}>
                1. Toca el ícono <strong>"•••"</strong> en la parte inferior derecha de la pantalla<br/>
                2. Selecciona <strong>"Compartir"</strong> en el menú que aparece<br/>
                3. Desliza hacia abajo en el siguiente menú<br/>
                4. Selecciona <strong>"Agregar a pantalla de inicio"</strong><br/>
                5. Toca <strong>"Agregar"</strong> en la esquina superior derecha
              </p>
              <button onClick={()=>setShowIosHelp(false)} style={{background:C.b1,color:"#fff",border:"none",borderRadius:12,padding:"12px 24px",width:"100%",fontWeight:600,fontSize:15,cursor:"pointer"}}>Entendido</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return(
    <div style={{minHeight:"100vh",width:"100%",background:C.bg,color:C.whi,fontFamily:"Inter,sans-serif",boxSizing:"border-box",overflowX:"hidden"}}>
      <div style={{maxWidth:900,margin:"0 auto",padding:"0 clamp(16px,5vw,40px) clamp(40px,10vw,80px)",boxSizing:"border-box"}}>

        <div style={{padding:"clamp(24px,6vw,40px) 0 clamp(20px,5vw,32px)",borderBottom:`1px solid ${C.b0}`,marginBottom:"clamp(24px,6vw,40px)",display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12}}>
          <div>
            <h1 style={{margin:0,fontFamily:"Barlow Condensed,sans-serif",fontWeight:900,fontSize:"clamp(38px,11vw,64px)",lineHeight:1,letterSpacing:"-1px"}}>
              <span style={{color:C.b2}}>Vendes+</span><span style={{color:C.whi}}>, Ganas+</span>
            </h1>
            <p style={{margin:"8px 0 0",color:C.mut,fontSize:"clamp(13px,3.5vw,16px)"}}>Simulador de Incentivo Variable</p>
          </div>
          {adminMode?(
            <span style={{fontSize:11,color:C.gld,border:`1px solid ${C.gld}`,borderRadius:20,padding:"6px 12px",whiteSpace:"nowrap",flexShrink:0}}>✓ Admin</span>
          ):(
            <button onClick={()=>setShowAdminPin(true)} style={{background:"transparent",border:`1px solid ${C.b0}`,color:C.mut,borderRadius:20,padding:"6px 14px",fontSize:12,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap",flexShrink:0}}>Admin</button>
          )}
        </div>

        {showAdminPin&&(
          <div onClick={()=>setShowAdminPin(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,padding:20,boxSizing:"border-box"}}>
            <div onClick={e=>e.stopPropagation()} style={{background:C.surf,borderRadius:16,padding:"28px 24px",width:"100%",maxWidth:360,boxSizing:"border-box",border:`1px solid ${C.b0}`}}>
              <p style={{color:C.whi,fontWeight:700,fontSize:18,margin:"0 0 16px",fontFamily:"Barlow Condensed,sans-serif"}}>Acceso Admin</p>
              <div style={{display:"flex",gap:8}}>
                <input type="password" value={pinAdmin}
                  onChange={e=>{setPinAdmin(e.target.value);setPinAdminErr(false);}}
                  onKeyDown={e=>e.key==="Enter"&&submitPinAdmin()}
                  placeholder="PIN de administrador" autoFocus
                  style={{flex:1,minWidth:0,background:C.card,border:`1px solid ${pinAdminErr?"#EF5350":C.b0}`,borderRadius:12,padding:"14px 16px",color:C.whi,fontSize:16,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
                <button onClick={submitPinAdmin} style={{background:C.b1,color:"#fff",border:"none",borderRadius:12,padding:"14px 20px",cursor:"pointer",fontFamily:"inherit",fontWeight:600,fontSize:18,flexShrink:0}}>→</button>
              </div>
              {pinAdminErr&&<p style={{color:"#EF5350",fontSize:13,margin:"10px 0 0"}}>PIN incorrecto</p>}
              <button onClick={()=>setShowAdminPin(false)} style={{marginTop:16,background:"none",border:"none",color:C.mut,fontSize:13,cursor:"pointer",fontFamily:"inherit",width:"100%"}}>Cancelar</button>
            </div>
          </div>
        )}

        {/* PASO 1 — CARGO */}
        <div style={box}>
          <div style={{color:C.mut,fontSize:12,textTransform:"uppercase",letterSpacing:".1em",marginBottom:16}}>¿Cuál es tu cargo?</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
            {CARGOS.map(c=>{const a=cargo?.id===c.id;return(
              <button key={c.id} onClick={()=>selCargo(c)} style={{padding:"10px 18px",borderRadius:24,cursor:"pointer",fontFamily:"inherit",fontSize:"clamp(13px,3.5vw,16px)",transition:"all .2s",border:a?"none":`1px solid ${C.b0}`,background:a?C.b1:"transparent",color:a?C.whi:C.mut,fontWeight:a?600:400,whiteSpace:"nowrap"}}>
                {c.lbl}{c.pin&&<span style={{marginLeft:5,fontSize:11,opacity:.5}}>{(pinOk||adminMode)?"✓":"🔒"}</span>}
              </button>);})}
          </div>
        </div>

        {/* PIN */}
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

        {/* PASO 2 — MARCA */}
        {cargo&&!showPin&&(
          <div style={box}>
            <div style={{color:C.mut,fontSize:12,textTransform:"uppercase",letterSpacing:".1em",marginBottom:16}}>¿En qué marca trabajas?</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(130px, 1fr))",gap:8}}>
              {CONCEPTOS_FLAT.map(con=>{const a=conceptoFlat===con.id;return(
                <button key={con.id} onClick={()=>elegirMarca(con.id)} style={{padding:"14px 12px",borderRadius:14,cursor:"pointer",fontFamily:"inherit",fontSize:"clamp(12px,3.2vw,15px)",transition:"all .2s",textAlign:"left",border:a?`1px solid ${C.b1}`:`1px solid ${C.b0}`,background:a?`${C.b1}22`:"transparent",color:a?C.whi:C.mut,fontWeight:a?600:400,minWidth:0}}>
                  {con.lbl}
                </button>);})}
            </div>
          </div>
        )}

        {/* PASO 2b — TIENDA (solo si eligió Marathon o Explorer) */}
        {cargo&&conceptoFlat&&CON_TIENDAS.includes(conceptoFlat)&&!showPin&&(
          <div style={box}>
            <div style={{color:C.mut,fontSize:12,textTransform:"uppercase",letterSpacing:".1em",marginBottom:16}}>¿Cuál es tu tienda?</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(150px, 1fr))",gap:8}}>
              {TIENDAS.filter(t=>t.con===conceptoFlat).map(t=>{const a=tienda?.n===t.n;return(
                <button key={t.n} onClick={()=>elegirTienda(t)} style={{padding:"12px 12px",borderRadius:12,cursor:"pointer",fontFamily:"inherit",fontSize:"clamp(11px,3vw,13px)",transition:"all .2s",textAlign:"left",border:a?`1px solid ${C.b1}`:`1px solid ${C.b0}`,background:a?`${C.b1}22`:"transparent",color:a?C.whi:C.mut,fontWeight:a?600:400,minWidth:0}}>
                  {t.n.replace(t.con+" ","")}
                </button>);})}
            </div>
          </div>
        )}

        {/* PIN DE TIENDA — se pide al elegir cualquier tienda */}
        {tiendaPendiente&&(
          <div onClick={()=>setTiendaPendiente(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,padding:20,boxSizing:"border-box"}}>
            <div onClick={e=>e.stopPropagation()} style={{background:C.surf,borderRadius:16,padding:"28px 24px",width:"100%",maxWidth:360,boxSizing:"border-box",border:`1px solid ${C.b0}`}}>
              <p style={{color:C.mut,fontSize:12,textTransform:"uppercase",letterSpacing:".08em",margin:"0 0 6px"}}>{tiendaPendiente.n}</p>
              <p style={{color:C.whi,fontWeight:700,fontSize:18,margin:"0 0 16px",fontFamily:"Barlow Condensed,sans-serif"}}>Ingresa el PIN de tu tienda</p>
              <div style={{display:"flex",gap:8}}>
                <input type="password" inputMode="numeric" maxLength={5} value={pinTienda}
                  onChange={e=>{setPinTienda(e.target.value.replace(/\D/g,""));setPinTiendaErr(false);}}
                  onKeyDown={e=>e.key==="Enter"&&submitPinTienda()}
                  placeholder="•••••" autoFocus
                  style={{flex:1,minWidth:0,background:C.card,border:`1px solid ${pinTiendaErr?"#EF5350":C.b0}`,borderRadius:12,padding:"14px 16px",color:C.whi,fontSize:20,letterSpacing:"4px",textAlign:"center",outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
                <button onClick={submitPinTienda} style={{background:C.b1,color:"#fff",border:"none",borderRadius:12,padding:"14px 20px",cursor:"pointer",fontFamily:"inherit",fontWeight:600,fontSize:18,flexShrink:0}}>→</button>
              </div>
              {pinTiendaErr&&<p style={{color:"#EF5350",fontSize:13,margin:"10px 0 0"}}>PIN incorrecto</p>}
              <button onClick={()=>setTiendaPendiente(null)} style={{marginTop:16,background:"none",border:"none",color:C.mut,fontSize:13,cursor:"pointer",fontFamily:"inherit",width:"100%"}}>Cancelar</button>
            </div>
          </div>
        )}

        {/* PIN DE MARCA — se pide al elegir marcas sin cluster (Puma, Big Head, etc) */}
        {marcaPendiente&&(
          <div onClick={()=>setMarcaPendiente(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,padding:20,boxSizing:"border-box"}}>
            <div onClick={e=>e.stopPropagation()} style={{background:C.surf,borderRadius:16,padding:"28px 24px",width:"100%",maxWidth:360,boxSizing:"border-box",border:`1px solid ${C.b0}`}}>
              <p style={{color:C.mut,fontSize:12,textTransform:"uppercase",letterSpacing:".08em",margin:"0 0 6px"}}>{marcaPendiente}</p>
              <p style={{color:C.whi,fontWeight:700,fontSize:18,margin:"0 0 16px",fontFamily:"Barlow Condensed,sans-serif"}}>Ingresa el PIN de tu marca</p>
              <div style={{display:"flex",gap:8}}>
                <input type="password" inputMode="numeric" maxLength={5} value={pinMarca}
                  onChange={e=>{setPinMarca(e.target.value.replace(/\D/g,""));setPinMarcaErr(false);}}
                  onKeyDown={e=>e.key==="Enter"&&submitPinMarca()}
                  placeholder="•••••" autoFocus
                  style={{flex:1,minWidth:0,background:C.card,border:`1px solid ${pinMarcaErr?"#EF5350":C.b0}`,borderRadius:12,padding:"14px 16px",color:C.whi,fontSize:20,letterSpacing:"4px",textAlign:"center",outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
                <button onClick={submitPinMarca} style={{background:C.b1,color:"#fff",border:"none",borderRadius:12,padding:"14px 20px",cursor:"pointer",fontFamily:"inherit",fontWeight:600,fontSize:18,flexShrink:0}}>→</button>
              </div>
              {pinMarcaErr&&<p style={{color:"#EF5350",fontSize:13,margin:"10px 0 0"}}>PIN incorrecto</p>}
              <button onClick={()=>setMarcaPendiente(null)} style={{marginTop:16,background:"none",border:"none",color:C.mut,fontSize:13,cursor:"pointer",fontFamily:"inherit",width:"100%"}}>Cancelar</button>
            </div>
          </div>
        )}

        {/* SIN INCENTIVO */}
        {cargo&&listoParaInputs&&sinIV&&(
          <div style={{marginBottom:"clamp(24px,6vw,40px)",background:C.surf,borderRadius:16,padding:"clamp(24px,6vw,32px)",border:`1px solid ${C.b0}`,textAlign:"center",boxSizing:"border-box"}}>
            <p style={{color:C.sof,fontSize:"clamp(15px,4vw,18px)",margin:0,fontWeight:500}}>Este cargo no tiene incentivo variable en el modelo 2026.</p>
          </div>
        )}

        {/* PASO 3 — INPUTS */}
        {cargo&&listoParaInputs&&!showPin&&!needPin&&!sinIV&&(
          <div style={box}>
            <div style={{background:C.surf,borderRadius:16,border:`1px solid ${C.b0}`,overflow:"hidden"}}>
              <div style={{padding:"14px clamp(16px,5vw,28px)",background:"#081018",borderBottom:`1px solid ${C.b0}`,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                <span style={{fontSize:13,color:C.b2,textTransform:"uppercase",letterSpacing:".08em",fontWeight:600}}>{tienda?tienda.n:concepto}</span>
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
                    <div style={{display:"flex",flexWrap:"wrap",gap:14}}>
                      <div style={{flex:"1 1 130px",minWidth:0}}><Dinero lbl="Venta de la tienda" val={ventaT} set={v=>{setVentaT(v);setRangoT(null);}} note="Opcional"/></div>
                      <div style={{flex:"1 1 130px",minWidth:0}}><Dinero lbl="Meta de la tienda" val={metaT} set={v=>{setMetaT(v);setRangoT(null);}} note="Opcional"/></div>
                    </div>
                    {cumplT!=null&&metaT&&(<><div style={{display:"flex",justifyContent:"space-between",fontSize:14,color:C.mut}}><span>Cumplimiento tienda</span><span style={{color:C.b2,fontWeight:600}}>{(cumplT*100).toFixed(1)}%</span></div><NivelBar cumpl={cumplT} is7030={false}/></>)}
                    <div style={{color:C.mut,fontSize:11,textTransform:"uppercase",letterSpacing:".07em",margin:"12px 0"}}>— o elige el nivel —</div>
                    <Rango val={rangoT} set={r=>{setRangoT(r);setMetaT("");if(r)setVentaT("");}}/>
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
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* MENSAJE MOTIVADOR — bajo el mínimo */}
        {bajoMinimo&&(
          <div style={{marginBottom:"clamp(24px,6vw,40px)",borderRadius:20,padding:"clamp(32px,8vw,56px) clamp(24px,6vw,40px)",textAlign:"center",boxSizing:"border-box",
            background:"linear-gradient(135deg,#0C1828,#081018)",border:`1px solid ${C.b0}`}}>
            {resultado.bono>0&&(
              <div style={{marginBottom:28,padding:"20px 24px",borderRadius:14,background:`${C.gld}18`,border:`1px solid ${C.gld}40`,display:"inline-block"}}>
                <span style={{color:C.gld,fontSize:"clamp(28px,7vw,40px)",fontWeight:900,fontFamily:"Barlow Condensed,sans-serif"}}>+ ${resultado.bono.toFixed(2)}</span>
                <p style={{color:C.gld,fontSize:"clamp(13px,3.5vw,15px)",margin:"4px 0 0",fontWeight:600}}>bono Margen Bruto</p>
              </div>
            )}
            <div style={{fontSize:"clamp(32px,8vw,48px)",marginBottom:16}}>💪</div>
            <p style={{color:C.whi,fontSize:"clamp(18px,4.5vw,24px)",fontWeight:600,margin:"0 0 12px",fontFamily:"Barlow Condensed,sans-serif"}}>
              Este mes todavía no activas tu incentivo por ventas
            </p>
            <p style={{color:C.mut,fontSize:"clamp(14px,3.8vw,16px)",lineHeight:1.6,margin:"0 auto",maxWidth:420}}>
              El incentivo por ventas se activa desde el 90% de cumplimiento. Aún estás a tiempo de cerrar el mes fuerte — cada venta te acerca a esa meta.
            </p>
          </div>
        )}

        {/* RESULTADO */}
        {resultado&&!bajoMinimo&&(
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
          </div>
        )}

      </div>
    </div>
  );
}