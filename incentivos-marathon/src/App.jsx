import { useState, useEffect, useRef, useMemo } from "react";

// ═══════════════════════════════════════════════════════════
// TASAS ASESOR 70-30 — actualizado 13 agosto 2026
// ═══════════════════════════════════════════════════════════
const T70_CLUSTER = {
  "MARATHON SPORTS": {
    A: [[0,0],[0.9,0],[0.9499,0.0008],[0.9799,0.0015],[1,0.002],[1.0499,0.003],[1.0999,0.004],[1.15,0.005],[1.2,0.0055],[1.3,0.0065]],
    B: [[0,0],[0.9,0],[0.9499,0.0015],[0.9799,0.003],[1,0.0035],[1.0499,0.0045],[1.0999,0.0055],[1.15,0.0065],[1.2,0.0075],[1.3,0.0085]],
    C: [[0,0],[0.9,0],[0.9499,0.002],[0.9799,0.005],[1,0.006],[1.0499,0.007],[1.0999,0.008],[1.15,0.009],[1.2,0.01],[1.3,0.011]],
  },
  "EXPLORER": {
    A: [[0,0],[0.9,0],[0.9499,0.0055],[0.9799,0.006],[1,0.0065],[1.0499,0.007],[1.0999,0.0075],[1.15,0.008],[1.2,0.0085],[1.3,0.009]],
    B: [[0,0],[0.9,0],[0.9499,0.006],[0.9799,0.008],[1,0.009],[1.0499,0.01],[1.0999,0.0105],[1.15,0.011],[1.2,0.0115],[1.3,0.012]],
    C: [[0,0],[0.9,0],[0.9499,0.008],[0.9799,0.0085],[1,0.009],[1.0499,0.0095],[1.0999,0.01],[1.15,0.0105],[1.2,0.011],[1.3,0.0115]],
    D: [[0,0],[0.9,0],[0.9499,0.01],[0.9799,0.011],[1,0.0115],[1.0499,0.012],[1.0999,0.0125],[1.15,0.013],[1.2,0.0135],[1.3,0.014]],
  },
  "TAF": {
    A: [[0,0],[0.9,0],[0.9499,0.008],[0.9799,0.01],[1,0.012],[1.0499,0.014],[1.0999,0.016],[1.15,0.018],[1.2,0.02],[1.3,0.022]],
    B: [[0,0],[0.9,0],[0.9499,0.01],[0.9799,0.013],[1,0.0145],[1.0499,0.016],[1.0999,0.0185],[1.15,0.02],[1.2,0.0215],[1.3,0.023]],
  },
};
const T70_FLAT = {
  "TELESHOP": [[0,0],[0.9,0],[0.9499,0.01],[0.9799,0.015],[1,0.015],[1.0499,0.016],[1.0999,0.017],[1.15,0.018],[1.2,0.019],[1.3,0.02]],
  "PUMA": [[0,0],[0.9,0],[0.9499,0.008],[0.9799,0.01],[1,0.012],[1.0499,0.014],[1.0999,0.016],[1.15,0.018],[1.2,0.02],[1.3,0.022]],
  "UNDER ARMOUR": [[0,0],[0.9,0],[0.9499,0.008],[0.9799,0.01],[1,0.012],[1.0499,0.014],[1.0999,0.016],[1.15,0.018],[1.2,0.02],[1.3,0.022]],
  "CIKLA": [[0,0],[0.9,0],[0.9499,0.005],[0.9799,0.008],[1,0.012],[1.0499,0.018],[1.0999,0.018],[1.15,0.018],[1.2,0.018],[1.3,0.018]],
  "BIG HEAD": [[0,0],[0.9,0],[0.9499,0.008],[0.9799,0.01],[1,0.012],[1.0499,0.014],[1.0999,0.016],[1.15,0.018],[1.2,0.02],[1.3,0.022]],
  "JANSPORT": [[0,0],[0.9,0],[0.9499,0.008],[0.9799,0.01],[1,0.012],[1.0499,0.014],[1.0999,0.016],[1.15,0.018],[1.2,0.02],[1.3,0.022]],
};
const TBD = {
  "OUTLET":           [[0,0],[.9,.0004],[.9501,.0005],[1.,.0007],[1.1,.0009],[1.3,.0012]],
  "BODEGA DEPORTIVA": [[0,0],[.9,.0004],[.9501,.0005],[1.,.0007],[1.1,.0009],[1.3,.0012]],
};
const TNA_CLUSTER = {
  "JEFE DE ALMACEN": {
    "MARATHON SPORTS": {
      A:[[0,0],[0.9,0.0008],[0.9499,0.0014],[0.9799,0.0024],[1,0.0028],[1.0499,0.0033],[1.0999,0.0038],[1.15,0.0042],[1.2,0.0048],[1.3,0.0052]],
      B:[[0,0],[0.9,0.0014],[0.9499,0.0018],[0.9799,0.0032],[1,0.0038],[1.0499,0.004],[1.0999,0.0045],[1.15,0.005],[1.2,0.0055],[1.3,0.006]],
      C:[[0,0],[0.9,0.0018],[0.9499,0.0023],[0.9799,0.0038],[1,0.0053],[1.0499,0.006],[1.0999,0.0065],[1.15,0.007],[1.2,0.0075],[1.3,0.008]],
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
      A:[[0,0],[0.9,0.00002],[0.9499,0.0003],[0.9799,0.0004],[1,0.00045],[1.0499,0.0005],[1.0999,0.00055],[1.15,0.0006],[1.2,0.00065],[1.3,0.0007]],
      B:[[0,0],[0.9,0.00004],[0.9499,0.00055],[0.9799,0.0006],[1,0.00065],[1.0499,0.0007],[1.0999,0.00075],[1.15,0.0008],[1.2,0.00085],[1.3,0.0009]],
      C:[[0,0],[0.9,0.00006],[0.9499,0.00065],[0.9799,0.0007],[1,0.00075],[1.0499,0.0008],[1.0999,0.00085],[1.15,0.0009],[1.2,0.00095],[1.3,0.001]],
    },
    "EXPLORER": {
      A:[[0,0],[0.9,0.00003],[0.9499,0.0002],[0.9799,0.00035],[1,0.0004],[1.0499,0.0006],[1.0999,0.00065],[1.15,0.0007],[1.2,0.00075],[1.3,0.0008]],
      B:[[0,0],[0.9,0.00005],[0.9499,0.0003],[0.9799,0.0004],[1,0.0005],[1.0499,0.0007],[1.0999,0.00075],[1.15,0.0008],[1.2,0.00085],[1.3,0.0009]],
    },
  },
  "AUX. DE BODEGA": {
    "MARATHON SPORTS": {
      A:[[0,0],[0.9,0.00002],[0.9499,0.0003],[0.9799,0.0004],[1,0.00045],[1.0499,0.0005],[1.0999,0.00055],[1.15,0.0006],[1.2,0.00065],[1.3,0.0007]],
      B:[[0,0],[0.9,0.00004],[0.9499,0.00055],[0.9799,0.0006],[1,0.00065],[1.0499,0.0007],[1.0999,0.00075],[1.15,0.0008],[1.2,0.00085],[1.3,0.0009]],
      C:[[0,0],[0.9,0.00006],[0.9499,0.00065],[0.9799,0.0007],[1,0.00075],[1.0499,0.0008],[1.0999,0.00085],[1.15,0.0009],[1.2,0.00095],[1.3,0.001]],
    },
    "EXPLORER": {
      A:[[0,0],[0.9,0.00003],[0.9499,0.0002],[0.9799,0.00035],[1,0.0004],[1.0499,0.0006],[1.0999,0.00065],[1.15,0.0007],[1.2,0.00075],[1.3,0.0008]],
      B:[[0,0],[0.9,0.00005],[0.9499,0.0003],[0.9799,0.0004],[1,0.0005],[1.0499,0.0007],[1.0999,0.00075],[1.15,0.0008],[1.2,0.00085],[1.3,0.0009]],
    },
  },
};
const TNA_FLAT = {
  "JEFE DE ALMACEN": {
    "OUTLET":[[0,0],[0.9,0.0008],[0.9499,0.0018],[0.9799,0.0025],[1,0.0035],[1.0499,0.004],[1.0999,0.0045],[1.15,0.0048],[1.2,0.0052],[1.3,0.0057]],
    "BODEGA DEPORTIVA":[[0,0],[0.9,0.0008],[0.9499,0.0018],[0.9799,0.0025],[1,0.0035],[1.0499,0.004],[1.0999,0.0045],[1.15,0.0048],[1.2,0.0052],[1.3,0.0057]],
    "TELESHOP":[[0,0],[0.9,0.0015],[0.9499,0.0025],[0.9799,0.004],[1,0.005],[1.0499,0.006],[1.0999,0.007],[1.15,0.008],[1.2,0.009],[1.3,0.01]],
    "PUMA":[[0,0],[0.9,0.002],[0.9499,0.0055],[0.9799,0.006],[1,0.0065],[1.0499,0.007],[1.0999,0.0075],[1.15,0.008],[1.2,0.0085],[1.3,0.009]],
    "UNDER ARMOUR":[[0,0],[0.9,0.002],[0.9499,0.0055],[0.9799,0.006],[1,0.0065],[1.0499,0.007],[1.0999,0.0075],[1.15,0.008],[1.2,0.0085],[1.3,0.009]],
    "CIKLA":[[0,0],[0.9,0.00005],[0.9499,0.0002],[0.9799,0.0004],[1,0.0006],[1.0499,0.01],[1.0999,0.01],[1.15,0.01],[1.2,0.01],[1.3,0.01]],
    "BIG HEAD":[[0,0],[0.9,0.002],[0.9499,0.0055],[0.9799,0.006],[1,0.0065],[1.0499,0.007],[1.0999,0.0075],[1.15,0.008],[1.2,0.0085],[1.3,0.009]],
    "JANSPORT":[[0,0],[0.9,0.00005],[0.9501,0.0002],[1,0.0004],[1.1,0.0006],[1.3,0.01]],
  },
  "SUBJEFE DE ALMACEN": {
    "OUTLET":[[0,0],[0.9,0.00056],[0.9499,0.00126],[0.9799,0.00175],[1,0.00245],[1.0499,0.0028],[1.0999,0.00315],[1.15,0.00336],[1.2,0.00364],[1.3,0.00399]],
    "BODEGA DEPORTIVA":[[0,0],[0.9,0.00056],[0.9499,0.00126],[0.9799,0.00175],[1,0.00245],[1.0499,0.0028],[1.0999,0.00315],[1.15,0.00336],[1.2,0.00364],[1.3,0.00399]],
    "TELESHOP":[[0,0],[0.9,0.00105],[0.9499,0.00175],[0.9799,0.0028],[1,0.0035],[1.0499,0.0042],[1.0999,0.0049],[1.15,0.0056],[1.2,0.0063],[1.3,0.007]],
    "PUMA":[[0,0],[0.9,0.0014],[0.9499,0.00385],[0.9799,0.0042],[1,0.00455],[1.0499,0.0049],[1.0999,0.00525],[1.15,0.0056],[1.2,0.00595],[1.3,0.0063]],
    "UNDER ARMOUR":[[0,0],[0.9,0.0014],[0.9499,0.00385],[0.9799,0.0042],[1,0.00455],[1.0499,0.0049],[1.0999,0.00525],[1.15,0.0056],[1.2,0.00595],[1.3,0.0063]],
    "CIKLA":[[0,0],[0.9,0.00005],[0.9499,0.00055],[0.9799,0.00105],[1,0.00155],[1.0499,0.00205],[1.0999,0.00205],[1.15,0.00205],[1.2,0.00205],[1.3,0.00205]],
    "BIG HEAD":[[0,0],[0.9,0.0014],[0.9499,0.00385],[0.9799,0.0042],[1,0.00455],[1.0499,0.0049],[1.0999,0.00525],[1.15,0.0056],[1.2,0.00595],[1.3,0.0063]],
    "JANSPORT":[[0,0],[0.9,0.000035],[0.9501,0.00014],[1,0.00028],[1.1,0.00042],[1.3,0.007]],
  },
  "CAJERO": {
    "OUTLET":[[0,0],[0.9,0.0002],[0.9499,0.0005],[0.9799,0.0006],[1,0.00065],[1.0499,0.0007],[1.0999,0.00075],[1.15,0.0008],[1.2,0.00085],[1.3,0.0009]],
    "BODEGA DEPORTIVA":[[0,0],[0.9,0.0002],[0.9499,0.0005],[0.9799,0.0006],[1,0.00065],[1.0499,0.0007],[1.0999,0.00075],[1.15,0.0008],[1.2,0.00085],[1.3,0.0009]],
    "TELESHOP":[[0,0],[0.9,0],[0.9499,0],[0.9799,0],[1,0],[1.0499,0],[1.0999,0],[1.15,0],[1.2,0],[1.3,0]],
    "TAF":[[0,0],[0.9,0.00005],[0.9499,0.0003],[0.9799,0.0004],[1,0.0005],[1.0499,0.0007],[1.0999,0.00075],[1.15,0.0008],[1.2,0.00085],[1.3,0.0009]],
    "PUMA":[[0,0],[0.9,0.00005],[0.9501,0.0002],[1,0.0004],[1.1,0.0006],[1.3,0.0008]],
    "UNDER ARMOUR":[[0,0],[0.9,0.00005],[0.9501,0.0002],[1,0.0004],[1.1,0.0006],[1.3,0.0008]],
    "CIKLA":[[0,0],[0.9,0],[0.9499,0],[0.9799,0],[1,0],[1.0499,0],[1.0999,0],[1.15,0],[1.2,0],[1.3,0]],
    "BIG HEAD":[[0,0],[0.9,0.00005],[0.9499,0.0003],[0.9799,0.0004],[1,0.0005],[1.0499,0.0007],[1.0999,0.00075],[1.15,0.0008],[1.2,0.00085],[1.3,0.0009]],
    "JANSPORT":[[0,0],[0.9,0],[0.9501,0],[1,0],[1.1,0],[1.3,0]],
  },
  "AUX. DE BODEGA": {
    "OUTLET":[[0,0],[0.9,0.0002],[0.9499,0.0005],[0.9799,0.0006],[1,0.00065],[1.0499,0.0007],[1.0999,0.00075],[1.15,0.0008],[1.2,0.00085],[1.3,0.0009]],
    "BODEGA DEPORTIVA":[[0,0],[0.9,0.0002],[0.9499,0.0005],[0.9799,0.0006],[1,0.00065],[1.0499,0.0007],[1.0999,0.00075],[1.15,0.0008],[1.2,0.00085],[1.3,0.0009]],
    "TELESHOP":[[0,0],[0.9,0],[0.9499,0],[0.9799,0],[1,0],[1.0499,0],[1.0999,0],[1.15,0],[1.2,0],[1.3,0]],
    "TAF":[[0,0],[0.9,0.00005],[0.9499,0.0003],[0.9799,0.0004],[1,0.0005],[1.0499,0.0007],[1.0999,0.00075],[1.15,0.0008],[1.2,0.00085],[1.3,0.0009]],
    "PUMA":[[0,0],[0.9,0.00005],[0.9501,0.0002],[1,0.0004],[1.1,0.0006],[1.3,0.0008]],
    "UNDER ARMOUR":[[0,0],[0.9,0.00002],[0.9499,0.000028],[0.9799,0.0000392],[1,0.0000666],[1.0499,0.0001133],[1.0999,0.0001926],[1.15,0.0003274],[1.2,0.0005566],[1.3,0.0009462]],
    "CIKLA":[[0,0],[0.9,0.00005],[0.9499,0.0002],[0.9799,0.0004],[1,0.0006],[1.0499,0.01],[1.0999,0.01],[1.15,0.01],[1.2,0.01],[1.3,0.01]],
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
  {n:"MARATHON SPORTS MALL DEL SOL", con:"MARATHON SPORTS", cl:"A"},
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
  {n:"MARATHON SPORTS QUICENTRO SHOPPING", con:"MARATHON SPORTS", cl:"A"},
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
  {id:"TELESHOP",lbl:"Teleshop"},{id:"TAF",lbl:"TAF"},{id:"PUMA",lbl:"Puma"},
  {id:"UNDER ARMOUR",lbl:"Under Armour"},{id:"CIKLA",lbl:"Cikla"},
  {id:"BIG HEAD",lbl:"Big Head"},{id:"JANSPORT",lbl:"Jansport"},
  {id:"OUTLET",lbl:"Outlet"},{id:"BODEGA DEPORTIVA",lbl:"Bodega Deportiva"},
];
const CON_TIENDAS = ["MARATHON SPORTS","EXPLORER","TAF"]; // conceptos que requieren elegir tienda
const MARCA_PIN = {
  "TELESHOP": "62950",
  "PUMA": "59906",
  "UNDER ARMOUR": "36224",
  "CIKLA": "88569",
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

function porHasta(t,v){for(const[h,r]of t)if(v<=h)return r;return t[t.length-1][1];}
function porDesde(t,v){let r=0;for(const[d,x]of t)if(v>=d)r=x;return r;}

function tasaAsesor70(concepto, cluster, cumpl) {
  if (cluster && T70_CLUSTER[concepto]) return porHasta(T70_CLUSTER[concepto][cluster], cumpl);
  return porHasta(T70_FLAT[concepto], cumpl);
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
  const needPin  = cargo?.pin && !pinOk;

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