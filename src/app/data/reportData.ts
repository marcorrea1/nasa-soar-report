// NASA Small Spacecraft State-of-the-Art Report — Mock Data

export interface SubSection {
  id: string;
  title: string;
  description: string;
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  subsections: SubSection[];
}

export interface Technology {
  id: string;
  chapterId: string;
  chapterNumber: number;
  subsectionId: string;
  title: string;
  category: string; // 'platforms' | 'power' | 'propulsion' | 'gnc' | 'cdh' | 'comm' | 'structures' | 'thermal'
  trl: number; // 1–9
  manufacturer: string;
  summary: string;
  specs: Record<string, string>;
  recentDevelopments: string;
}

export const chapters: Chapter[] = [
  {
    id: 'ch1',
    number: 1,
    title: 'Introduction',
    subsections: [
      { id: 'ch1-1', title: 'Purpose and Scope', description: 'Overview of small spacecraft technology survey methodology and applications' },
      { id: 'ch1-2', title: 'Technology Readiness Levels', description: 'TRL assessment methodology and definitions for aerospace systems' },
      { id: 'ch1-3', title: 'Report Organization', description: 'Structure and content overview of the state-of-the-art survey' }
    ]
  },
  {
    id: 'ch2',
    number: 2,
    title: 'Complete Spacecraft Platforms',
    subsections: [
      { id: 'ch2-1', title: 'CubeSat Standards', description: 'Standard form factors and specifications for CubeSat-class spacecraft' },
      { id: 'ch2-2', title: 'Hosted Orbital Services', description: 'Rideshare and hosted payload capabilities for small spacecraft' },
      { id: 'ch2-3', title: 'Integrated Platforms', description: 'Turnkey spacecraft bus solutions for small satellite missions' }
    ]
  },
  {
    id: 'ch3',
    number: 3,
    title: 'Power',
    subsections: [
      { id: 'ch3-1', title: 'Solar Arrays and Cells', description: 'Photovoltaic systems optimized for small spacecraft power budgets' },
      { id: 'ch3-2', title: 'Energy Storage', description: 'Battery technologies and power management for small satellites' },
      { id: 'ch3-3', title: 'Power Distribution', description: 'Electrical power subsystem architecture and conditioning electronics' }
    ]
  },
  {
    id: 'ch4',
    number: 4,
    title: 'In-Space Propulsion',
    subsections: [
      { id: 'ch4-1', title: 'Chemical Propulsion', description: 'Monopropellant and bipropellant systems for small spacecraft maneuvers' },
      { id: 'ch4-2', title: 'Electric Propulsion', description: 'Ion and Hall-effect thrusters for high-efficiency small satellite propulsion' },
      { id: 'ch4-3', title: 'Cold Gas Systems', description: 'Low-cost attitude control and station-keeping thrusters' }
    ]
  },
  {
    id: 'ch5',
    number: 5,
    title: 'Guidance, Navigation, and Control',
    subsections: [
      { id: 'ch5-1', title: 'Attitude Determination', description: 'Star trackers, sun sensors, and magnetometers for attitude knowledge' },
      { id: 'ch5-2', title: 'Reaction Wheels', description: 'Momentum exchange devices for precise attitude control' },
      { id: 'ch5-3', title: 'Magnetorquers', description: 'Magnetic torque rods for orbit maintenance and attitude control' }
    ]
  },
  {
    id: 'ch6',
    number: 6,
    title: 'Command and Data Handling',
    subsections: [
      { id: 'ch6-1', title: 'Flight Computers', description: 'Radiation-tolerant and radiation-hardened processors for small spacecraft' },
      { id: 'ch6-2', title: 'Data Storage', description: 'Solid-state recorders and non-volatile memory systems' },
      { id: 'ch6-3', title: 'Software Architecture', description: 'Flight software frameworks, RTOS, and middleware for small satellites' }
    ]
  },
  {
    id: 'ch7',
    number: 7,
    title: 'Communications',
    subsections: [
      { id: 'ch7-1', title: 'RF Systems', description: 'S-band, X-band, and UHF transceivers for small spacecraft downlinks' },
      { id: 'ch7-2', title: 'Optical Communications', description: 'Laser communication terminals for high-bandwidth data return' },
      { id: 'ch7-3', title: 'Antennas', description: 'Deployable, patch, and phased array antennas for small platforms' }
    ]
  },
  {
    id: 'ch8',
    number: 8,
    title: 'Structures and Mechanisms',
    subsections: [
      { id: 'ch8-1', title: 'Deployable Structures', description: 'Solar panel booms, antenna deployment, and drag sails' },
      { id: 'ch8-2', title: 'Primary Structures', description: 'Structural frames and panels for CubeSat and ESPA-class spacecraft' },
      { id: 'ch8-3', title: 'Launch Vehicle Integration', description: 'Separation systems, P-POD dispensers, and launch interfaces' }
    ]
  },
  {
    id: 'ch9',
    number: 9,
    title: 'Passive Thermal Control',
    subsections: [
      { id: 'ch9-1', title: 'Multi-Layer Insulation', description: 'MLI blanket design and application for small spacecraft thermal control' },
      { id: 'ch9-2', title: 'Surface Coatings', description: 'Thermal control paints, tapes, and optical solar reflectors' },
      { id: 'ch9-3', title: 'Heat Pipes', description: 'Two-phase thermal transport devices for passive heat redistribution' }
    ]
  },
  {
    id: 'ch10',
    number: 10,
    title: 'Active Thermal Control',
    subsections: [
      { id: 'ch10-1', title: 'Heaters', description: 'Resistive heating elements and thermostatic control for cold components' },
      { id: 'ch10-2', title: 'Louvers', description: 'Variable emittance devices for dynamic thermal load management' },
      { id: 'ch10-3', title: 'Pumped Fluid Loops', description: 'Active thermal transport systems for high-power small spacecraft' }
    ]
  }
];

export const technologies: Technology[] = [
  // ── Chapter 2: Complete Spacecraft Platforms ──────────────────────────────
  {
    id: 'tech-ch2-1',
    chapterId: 'ch2', chapterNumber: 2, subsectionId: 'ch2-1',
    title: '1U CubeSat Bus',
    category: 'platforms', trl: 9,
    manufacturer: 'GomSpace, Endurosat, Pumpkin Inc.',
    summary: 'The 1U CubeSat (10×10×10 cm, ≤1.33 kg) is the fundamental CubeSat form factor defined by the Cal Poly/Stanford CubeSat Design Specification. Hundreds of 1U spacecraft have flown since the first QuakeSat launch in 2003. Commercial off-the-shelf (COTS) bus components are widely available and have demonstrated high on-orbit reliability.',
    specs: { 'Volume': '10×10×10 cm', 'Mass limit': '1.33 kg', 'Power (avg)': '≤1 W', 'Standard': 'CDS Rev 14' },
    recentDevelopments: 'CDS Rev 14 (2022) updated mechanical tolerances and added provisions for non-standard deployables. Multiple vendors now supply fully integrated 1U buses with EPS, OBC, and UHF radio within a 1U envelope.'
  },
  {
    id: 'tech-ch2-2',
    chapterId: 'ch2', chapterNumber: 2, subsectionId: 'ch2-1',
    title: '3U CubeSat Bus',
    category: 'platforms', trl: 9,
    manufacturer: 'Clyde Space, GomSpace, ISIS',
    summary: 'The 3U CubeSat (10×10×34 cm, ≤4 kg) is the most common small spacecraft form factor. It provides sufficient volume for both a capable bus and a dedicated payload. Over 1,000 3U spacecraft have been launched, with Planet Labs Dove constellation representing the largest single-platform deployment.',
    specs: { 'Volume': '10×10×34 cm', 'Mass limit': '4 kg', 'Power (avg)': '3–8 W', 'Payload volume': '~1U' },
    recentDevelopments: 'Spire Global and Planet Labs have demonstrated constellation operations with hundreds of 3U platforms. Improved solar panel deployables now routinely provide 10–15 W average power.'
  },
  {
    id: 'tech-ch2-3',
    chapterId: 'ch2', chapterNumber: 2, subsectionId: 'ch2-1',
    title: '6U CubeSat Bus',
    category: 'platforms', trl: 9,
    manufacturer: 'Surrey Satellite, Blue Canyon Technologies, Tyvak',
    summary: 'The 6U form factor (10×20×34 cm, ≤12 kg) enables more capable missions with larger payloads and power systems. It has become the preferred format for lunar and deep-space CubeSat missions, including the twin MarCO spacecraft that flew by Mars in 2018.',
    specs: { 'Volume': '10×20×34 cm', 'Mass limit': '12 kg', 'Power (avg)': '10–20 W', 'Delta-V capability': 'up to ~100 m/s with propulsion' },
    recentDevelopments: 'MarCO (NASA JPL) demonstrated 6U CubeSats in deep space. Lunar IceCube and LunIR were deployed from Artemis I in 2022. Blue Canyon XB-6 bus achieves sub-arcsecond pointing.'
  },
  {
    id: 'tech-ch2-4',
    chapterId: 'ch2', chapterNumber: 2, subsectionId: 'ch2-2',
    title: 'Rideshare Launch Services',
    category: 'platforms', trl: 9,
    manufacturer: 'SpaceX Transporter, Rocket Lab, D-Orbit',
    summary: 'Dedicated rideshare missions aggregate multiple small satellites onto a single launch vehicle, dramatically reducing per-kg launch costs. SpaceX Transporter missions routinely carry 100+ smallsats to SSO on a single Falcon 9, while ION Satellite Carrier provides in-orbit transport and deployment.',
    specs: { 'Launch cost': '$5,500–$6,000/kg (SSO)', 'Cadence': 'Monthly (SpaceX)', 'Max payload': 'Up to 1,000 kg total', 'Orbits': 'SSO, LEO, GTO' },
    recentDevelopments: 'SpaceX Transporter-10 (2024) carried 53 payloads. D-Orbit ION SCV provides last-mile delivery to custom orbits. Rocket Lab Electron offers dedicated small satellite launches from $7.5M.'
  },
  {
    id: 'tech-ch2-5',
    chapterId: 'ch2', chapterNumber: 2, subsectionId: 'ch2-3',
    title: 'ESPA-Class Spacecraft Bus',
    category: 'platforms', trl: 8,
    manufacturer: 'Orbital Sciences (Northrop Grumman), Sierra Space, York Space',
    summary: 'ESPA (EELV Secondary Payload Adapter) class spacecraft use the 6×ESPA ports to fly as secondary payloads on large launch vehicles. Each port accommodates up to 181 kg, enabling more capable missions than CubeSats while still flying as a secondary.',
    specs: { 'Mass': 'up to 181 kg per port', 'Power': '100–400 W', 'Delta-V': 'up to 500 m/s', 'Pointing': '0.1–1 deg' },
    recentDevelopments: 'STP-3 (2021) flew multiple ESPA-class secondary payloads on Atlas V. York Space S-Class bus has completed 18+ missions. Sierra Space Dream Chaser will carry ESPA payloads.'
  },

  // ── Chapter 3: Power ──────────────────────────────────────────────────────
  {
    id: 'tech-ch3-1',
    chapterId: 'ch3', chapterNumber: 3, subsectionId: 'ch3-1',
    title: 'Triple-Junction GaAs Solar Cells',
    category: 'power', trl: 9,
    manufacturer: 'Spectrolab (Boeing), SolAero (Rocket Lab), Azur Space',
    summary: 'Triple-junction GaAs (InGaP/GaAs/Ge) solar cells are the standard for spacecraft power generation, offering up to 30% beginning-of-life efficiency. They operate across a wide temperature range and exhibit excellent radiation tolerance making them suitable for LEO and GEO missions.',
    specs: { 'BOL efficiency': '28–30%', 'EOL efficiency (LEO 5yr)': '~25%', 'Mass density': '860 g/m²', 'Voltage (Voc)': '2.7 V per cell' },
    recentDevelopments: 'Spectrolab XTJ Prime achieves 30.7% efficiency. Azur Space 3G30C is widely used in CubeSat deployable panels. SolAero IMM-α inverted metamorphic cells reach 33%+ efficiency in R&D.'
  },
  {
    id: 'tech-ch3-2',
    chapterId: 'ch3', chapterNumber: 3, subsectionId: 'ch3-1',
    title: 'Body-Mounted Solar Panels',
    category: 'power', trl: 9,
    manufacturer: 'Clyde Space, GomSpace, Endurosat',
    summary: 'Body-mounted solar panels provide power generation without deployment mechanisms, reducing complexity and failure modes. For 1–3U CubeSats they typically provide 1–5 W average power in a 550 km LEO orbit. Panel efficiency has improved significantly with adoption of triple-junction cells.',
    specs: { 'Power (1U face)': '0.8–1.5 W', 'Power (3U body-mounted)': '3–5 W avg', 'Voltage': '5–8.4 V (regulated)', 'Mass': '20–80 g per panel' },
    recentDevelopments: 'Endurosat 1U solar panel achieves 1.4 W per face with XTJ cells. GomSpace P31u EPS integrates MPPT for each panel independently. Combined-face harvesting on tumbling spacecraft is now standard.'
  },
  {
    id: 'tech-ch3-3',
    chapterId: 'ch3', chapterNumber: 3, subsectionId: 'ch3-1',
    title: 'Deployable Solar Arrays',
    category: 'power', trl: 8,
    manufacturer: 'MMA Design, DHV Technology, Rocket Lab',
    summary: 'Deployable solar arrays dramatically increase power generation for larger CubeSats and smallsats. Fold-out or roll-out designs can provide 20–100+ W for 6U–12U platforms. Single-fault tolerant deployment mechanisms have been demonstrated on multiple missions.',
    specs: { 'Power': '10–100 W (form-factor dependent)', 'Specific power': '120–200 W/kg', 'Stowed volume': '~0.5U per wing', 'Deployment': 'Spring-loaded or motor-driven' },
    recentDevelopments: 'MMA Design eHawk arrays have flown on 20+ missions including NASA PACE. Rocket Lab SolarPack provides 40 W in a compact form. ROSA (Roll-Out Solar Array) demonstrated on ISS for potential smallsat adaptation.'
  },
  {
    id: 'tech-ch3-4',
    chapterId: 'ch3', chapterNumber: 3, subsectionId: 'ch3-2',
    title: 'Lithium-Ion Battery Packs',
    category: 'power', trl: 9,
    manufacturer: 'Clyde Space, GomSpace, EaglePicher',
    summary: 'Lithium-ion battery packs are the standard energy storage solution for small spacecraft, providing high energy density with proven orbital heritage. Commercial cells from Samsung, LG, and Sony are space-qualified and used in most CubeSat missions. Capacity ranges from 5 Wh (1U) to 200+ Wh (ESPA-class).',
    specs: { 'Energy density': '200–250 Wh/kg', 'Cycle life (LEO)': '>10,000 cycles', 'Voltage': '7.4–16.8 V', 'Operating temp': '-10°C to +45°C' },
    recentDevelopments: 'Space-qualified 18650 and 21700 cell formats are now standard. GomSpace BPX battery achieves 39 Wh in a 0.5U form factor. EaglePicher custom packs qualified for lunar thermal environments.'
  },
  {
    id: 'tech-ch3-5',
    chapterId: 'ch3', chapterNumber: 3, subsectionId: 'ch3-3',
    title: 'Electrical Power Systems (EPS)',
    category: 'power', trl: 9,
    manufacturer: 'Clyde Space, GomSpace, Endurosat',
    summary: 'An EPS integrates solar panel maximum power point tracking (MPPT), battery charge control, and regulated bus distribution into a single board. Modern small satellite EPS boards are highly integrated, efficient (>90%), and include telemetry for all power rails.',
    specs: { 'Input voltage': '4–17 V (solar)', 'Output rails': '3.3 V, 5 V, 12 V (regulated)', 'Efficiency': '>92%', 'Max input power': '30–120 W' },
    recentDevelopments: 'GomSpace P31u EPS supports up to 8 independent MPPT inputs. Clyde Space 3G EPS achieves 30+ W average input. Software-defined power management allows mission operators to reconfigure load priorities on orbit.'
  },

  // ── Chapter 4: In-Space Propulsion ───────────────────────────────────────
  {
    id: 'tech-ch4-1',
    chapterId: 'ch4', chapterNumber: 4, subsectionId: 'ch4-1',
    title: 'Monopropellant Hydrazine Thruster',
    category: 'propulsion', trl: 9,
    manufacturer: 'Aerojet Rocketdyne, Bradford ECAPS, Moog',
    summary: 'Monopropellant hydrazine thrusters decompose N₂H₄ over an iridium Shell-405 catalyst, producing thrust from 0.1 N to 22 N. They are the most heritage-rich chemical propulsion option for small spacecraft and have been used on hundreds of spacecraft since the 1970s.',
    specs: { 'Specific impulse': '220–235 s', 'Thrust range': '0.1–22 N', 'Propellant': 'Hydrazine (N₂H₄)', 'Delta-V (5 kg s/c)': 'up to 300 m/s' },
    recentDevelopments: 'MRE-0.1 (Moog) supports 0.1 N CubeSat applications. Green monopropellant alternatives (AF-M315E, LMP-103S) are reducing handling hazards. Multiple 3U CubeSats have demonstrated N₂H₄ propulsion on orbit.'
  },
  {
    id: 'tech-ch4-2',
    chapterId: 'ch4', chapterNumber: 4, subsectionId: 'ch4-1',
    title: 'Green Monopropellant (AF-M315E)',
    category: 'propulsion', trl: 7,
    manufacturer: 'Aerojet Rocketdyne, VACCO Industries',
    summary: 'AF-M315E (ASCENT) is an ionic liquid monopropellant offering 12% higher Isp than hydrazine with significantly reduced toxicity. NASA\'s GPIM CubeSat mission demonstrated AF-M315E in 2019, validating the propellant and BGT-X5 thruster in LEO.',
    specs: { 'Specific impulse': '250–255 s', 'Thrust': '0.5–1 N (BGT-X5)', 'Propellant': 'AF-M315E / ASCENT', 'Density': '1470 kg/m³' },
    recentDevelopments: 'NASA GPIM (2019) completed the first on-orbit demonstration of AF-M315E propulsion. VACCO MiPS propulsion module integrates tank, valve, and thruster in a 0.5U package. ESA is evaluating LMP-103S (HPGP) for multiple missions.'
  },
  {
    id: 'tech-ch4-3',
    chapterId: 'ch4', chapterNumber: 4, subsectionId: 'ch4-2',
    title: 'Electrospray / Ion Electrospray Thruster',
    category: 'propulsion', trl: 7,
    manufacturer: 'Accion Systems, MIT Space Propulsion Lab, Busek',
    summary: 'Electrospray thrusters emit charged droplets or ions from ionic liquid propellant under strong electric fields, enabling micro-Newton to milli-Newton thrust with very high specific impulse. They are ideal for precision maneuvering and attitude control on CubeSats where propellant mass is severely constrained.',
    specs: { 'Thrust': '1–100 µN per emitter', 'Specific impulse': '1,000–4,000 s', 'Power': '0.5–3 W', 'Propellant': 'EMI-BF4 ionic liquid' },
    recentDevelopments: 'Accion Systems TILE thruster has flown on >10 commercial smallsats. MIT Nano-FEEP thruster demonstrated attitude control on AeroCube-8. Cluster configurations enable larger CubeSat propulsion needs.'
  },
  {
    id: 'tech-ch4-4',
    chapterId: 'ch4', chapterNumber: 4, subsectionId: 'ch4-2',
    title: 'Hall-Effect Thruster (miniaturized)',
    category: 'propulsion', trl: 7,
    manufacturer: 'Busek, Exotrail, ThrustMe',
    summary: 'Miniaturized Hall-effect thrusters operate on xenon or krypton propellant, providing thrust levels of 1–50 mN with specific impulse up to 1,700 s. They are suitable for ESPA-class and 12U+ CubeSat missions requiring significant orbit raising or station-keeping delta-V.',
    specs: { 'Thrust': '1–50 mN', 'Specific impulse': '800–1,700 s', 'Power': '50–500 W', 'Propellant': 'Xenon or Krypton' },
    recentDevelopments: 'Exotrail ExoMG nano-Hall thruster demonstrated on commercial constellation. ThrustMe NPT30-I2 iodine-propellant Hall thruster flew on Beihangkongshi-1. Busek BHT-200 has 20+ years of flight heritage.'
  },
  {
    id: 'tech-ch4-5',
    chapterId: 'ch4', chapterNumber: 4, subsectionId: 'ch4-3',
    title: 'Cold Gas Propulsion System',
    category: 'propulsion', trl: 9,
    manufacturer: 'VACCO Industries, Marotta Controls, Bradford Engineering',
    summary: 'Cold gas systems expand compressed propellant (typically N₂, CO₂, or R-134a) through a nozzle to generate thrust. They are the simplest and safest propulsion option for CubeSats, with no combustion or high-voltage components. Specific impulse is limited (~70 s), restricting their use to attitude control and small delta-V maneuvers.',
    specs: { 'Specific impulse': '50–75 s', 'Thrust': '0.01–1 N', 'Propellant': 'N₂, CO₂, R-134a', 'Tank pressure': '350–3,000 psi' },
    recentDevelopments: 'VACCO MiPS cold gas module integrates tank, valves, and thrusters in a CubeSat standard form factor. Multiple DARPA and NASA CubeSat missions have used cold gas for proximity operations. Phase-change propellants like R-236fa offer higher storage density.'
  },
  {
    id: 'tech-ch4-6',
    chapterId: 'ch4', chapterNumber: 4, subsectionId: 'ch4-3',
    title: 'Water Electrolysis Micro-Propulsion',
    category: 'propulsion', trl: 5,
    manufacturer: 'Tethers Unlimited (HYDROS), Bradford ECAPS',
    summary: 'Water electrolysis propulsion systems electrolyze stored water to produce H₂ and O₂ on demand, which are then combusted in a thruster. Water is non-toxic, non-pressurized during storage, and dense, making it attractive for CubeSat applications where propellant handling is a concern.',
    specs: { 'Specific impulse': '310–350 s', 'Thrust': '0.25–1 N', 'Propellant': 'Water (H₂O)', 'Power (electrolysis)': '5–30 W' },
    recentDevelopments: 'Tethers Unlimited HYDROS-C flew on Orbital Hydros test in 2021. Bradford ECAPS is developing a 6U-compatible water propulsion system. TU Delft has demonstrated lab-scale water micro-thruster performance.'
  },

  // ── Chapter 5: Guidance, Navigation, and Control ─────────────────────────
  {
    id: 'tech-ch5-1',
    chapterId: 'ch5', chapterNumber: 5, subsectionId: 'ch5-1',
    title: 'Miniaturized Star Tracker',
    category: 'gnc', trl: 9,
    manufacturer: 'Blue Canyon Technologies, Sinclair Interplanetary, Leonardo DRS',
    summary: 'Star trackers determine spacecraft attitude to sub-arcminute accuracy by comparing observed star patterns against an onboard catalog. Miniaturized versions (<100 g) have been qualified for CubeSat applications. They are the primary attitude determination sensor for precise-pointing small satellites.',
    specs: { 'Accuracy (3σ)': '10–200 arcsec (cross-axis)', 'Update rate': '1–10 Hz', 'Mass': '50–300 g', 'Power': '0.5–2 W' },
    recentDevelopments: 'BCT Nano Star Camera achieves <50 arcsec accuracy at 100 g. Sinclair Interplanetary ST-16RT2 demonstrated on over 50 CubeSats. Leonardo DRS µST achieves sub-arcsecond accuracy for ESPA-class missions.'
  },
  {
    id: 'tech-ch5-2',
    chapterId: 'ch5', chapterNumber: 5, subsectionId: 'ch5-1',
    title: 'Sun Sensor',
    category: 'gnc', trl: 9,
    manufacturer: 'Solar MEMS Technologies, Bradford Engineering, Adcole',
    summary: 'Sun sensors measure the angle of the sun vector relative to the spacecraft body frame, providing coarse attitude knowledge. They are used during safe mode, initial acquisition, and as a low-power supplement to star trackers. Fine sun sensors achieve <0.1° accuracy.',
    specs: { 'Accuracy': '0.1°–2° (fine–coarse)', 'Field of view': '120°–160° half-angle', 'Mass': '1–30 g', 'Power': '<0.1 W' },
    recentDevelopments: 'Solar MEMS nanoSSOC achieves 0.1° accuracy at 2.6 g. Adcole digital sun sensor is heritage from thousands of spacecraft. CSS (coarse sun sensor) arrays are now integrated directly into CubeSat panels.'
  },
  {
    id: 'tech-ch5-3',
    chapterId: 'ch5', chapterNumber: 5, subsectionId: 'ch5-2',
    title: 'Miniaturized Reaction Wheel',
    category: 'gnc', trl: 9,
    manufacturer: 'Blue Canyon Technologies, Sinclair Interplanetary, Rocket Lab',
    summary: 'Reaction wheels store angular momentum via a spinning flywheel, enabling precise 3-axis attitude control without propellant expenditure. Miniaturized versions for CubeSats operate at speeds up to 10,000 RPM and provide angular momentum storage of 1–10 mNms. Wheel desaturation requires a magnetorquer or propulsion system.',
    specs: { 'Angular momentum': '0.5–10 mNms', 'Max torque': '0.1–1 mNm', 'Speed range': '±10,000 RPM', 'Mass': '50–150 g per wheel' },
    recentDevelopments: 'BCT RWA-0.003 (3 mNms) is qualified for 3U CubeSats. Sinclair Interplanetary RW-0.03 provides 30 mNms in a 0.3U volume. Multi-wheel configurations (4 wheels for redundancy) are common on ESPA-class platforms.'
  },
  {
    id: 'tech-ch5-4',
    chapterId: 'ch5', chapterNumber: 5, subsectionId: 'ch5-3',
    title: 'Electromagnetic Magnetorquer',
    category: 'gnc', trl: 9,
    manufacturer: 'GomSpace, ISIS, AAC Clyde Space',
    summary: 'Magnetorquers generate magnetic dipole moments by passing current through coils, interacting with Earth\'s magnetic field to produce torques for attitude control and wheel desaturation. They are low-cost, low-power, and highly reliable. They cannot generate torque along the local magnetic field vector.',
    specs: { 'Dipole moment': '0.1–1 Am²', 'Power': '0.2–1 W', 'Mass': '10–80 g', 'Type': 'Air-core rod or printed circuit board' },
    recentDevelopments: 'PCB-integrated magnetorquers are now standard on 1U CubeSats. GomSpace MTQ3axes provides 0.2 Am² in a 3U package. Pumpkin CubeSat Kit integrates torque rods in the structural frame for minimal volume impact.'
  },
  {
    id: 'tech-ch5-5',
    chapterId: 'ch5', chapterNumber: 5, subsectionId: 'ch5-1',
    title: 'MEMS Inertial Measurement Unit (IMU)',
    category: 'gnc', trl: 8,
    manufacturer: 'Honeywell, KVH Industries, Silicon Sensing',
    summary: 'MEMS-based IMUs integrate accelerometers and gyroscopes on a single chip, providing angular rate and linear acceleration measurements at very low mass and power. Space-qualified MEMS IMUs are used for attitude propagation between star tracker measurements and for measuring nutation during maneuvers.',
    specs: { 'Gyro bias stability': '0.1–10 °/hr', 'Angular random walk': '0.05–0.5 °/√hr', 'Mass': '10–100 g', 'Power': '0.1–0.5 W' },
    recentDevelopments: 'Honeywell MIMU demonstrated on multiple LEO smallsats. KVH 1775 IMU provides 0.5 °/hr stability for medium-performance missions. Radiation-tolerant MEMS gyros are being developed for beyond-LEO applications.'
  },

  // ── Chapter 6: Command and Data Handling ──────────────────────────────────
  {
    id: 'tech-ch6-1',
    chapterId: 'ch6', chapterNumber: 6, subsectionId: 'ch6-1',
    title: 'ARM Cortex-M / CubeSat OBC',
    category: 'cdh', trl: 9,
    manufacturer: 'GomSpace, ISIS, CubeComputer Corp',
    summary: 'Commercial-grade ARM Cortex-M based on-board computers (OBCs) dominate the CubeSat market, offering adequate performance for housekeeping and simple payload operations at very low cost and power. COTS processors are often COTS radiation-tested rather than fully rad-hard, relying on software watchdogs and scrubbing for reliability.',
    specs: { 'Processor': 'ARM Cortex-M4/M7 (32-bit)', 'Clock speed': '48–400 MHz', 'RAM': '256 KB – 8 MB', 'Power': '0.1–0.5 W', 'Flash storage': '1–64 MB' },
    recentDevelopments: 'GomSpace NanoMind A3200 and ISIS iOBC are the most widely deployed CubeSat OBCs. FreeRTOS is the dominant RTOS. NanoMind Z7000 (Zynq-7000 SoC) adds FPGA fabric for payload processing.'
  },
  {
    id: 'tech-ch6-2',
    chapterId: 'ch6', chapterNumber: 6, subsectionId: 'ch6-1',
    title: 'RAD750 Radiation-Hardened Processor',
    category: 'cdh', trl: 9,
    manufacturer: 'BAE Systems',
    summary: 'The RAD750 is a radiation-hardened PowerPC 750 derivative used as the flight computer on NASA\'s Curiosity rover, MRO, Kepler, Dawn, LRO, and dozens of other missions. It provides deterministic, fault-tolerant performance in high-radiation environments at the cost of low performance by modern standards.',
    specs: { 'Architecture': 'PowerPC 750 (32-bit)', 'Clock speed': '110–200 MHz', 'TID tolerance': '>300 krad(Si)', 'SEL immunity': '>120 MeV·cm²/mg', 'Power': '5 W' },
    recentDevelopments: 'RAD750 remains the baseline for NASA Class A/B missions. BAE Systems RAD5545 (SPARC V8 quad-core) offers 4× performance improvement for newer high-performance missions.'
  },
  {
    id: 'tech-ch6-3',
    chapterId: 'ch6', chapterNumber: 6, subsectionId: 'ch6-2',
    title: 'Solid-State Mass Memory',
    category: 'cdh', trl: 9,
    manufacturer: 'Seakr Engineering, Aeroflex, Maxwell Technologies',
    summary: 'Solid-state mass memory stores large volumes of payload data (imagery, science data) for later downlink. Space-qualified flash memory and SDRAM boards can store 32 GB to several TB while tolerating the radiation environment. EDAC (Error Detection and Correction) is used to handle single-event upsets.',
    specs: { 'Capacity': '32 GB – 4 TB', 'Interface': 'SpaceWire, PCIe, LVDS', 'Data rate': '1–10 Gbps', 'TID tolerance': '>100 krad' },
    recentDevelopments: 'Seakr Engineering provides mass memory for GOES-R and WGS satellites. 3D NAND flash enables higher densities at lower cost. Xilinx Kintex-7 FPGA controllers with EDAC are standard in modern designs.'
  },
  {
    id: 'tech-ch6-4',
    chapterId: 'ch6', chapterNumber: 6, subsectionId: 'ch6-3',
    title: 'Core Flight System (cFS)',
    category: 'cdh', trl: 8,
    manufacturer: 'NASA Goddard Space Flight Center (open source)',
    summary: 'NASA\'s Core Flight System (cFS) is an open-source, reusable flight software framework used on dozens of missions. It provides a portable, component-based architecture with standardized interfaces for applications, enabling code reuse across missions. cFS runs on VxWorks, RTEMS, and Linux.',
    specs: { 'Architecture': 'Component-based publish/subscribe', 'RTOS': 'VxWorks, RTEMS, FreeRTOS', 'Languages': 'C, C++', 'License': 'NASA Open Source Agreement' },
    recentDevelopments: 'cFS used on LCRD, LRO uplink, CCSDS File Delivery Protocol (CFDP) baseline. Community contributions added CFS-CI (command ingest) and cFS-TO (telemetry output). NASA open-sourced cFS on GitHub in 2019.'
  },

  // ── Chapter 7: Communications ─────────────────────────────────────────────
  {
    id: 'tech-ch7-1',
    chapterId: 'ch7', chapterNumber: 7, subsectionId: 'ch7-1',
    title: 'UHF/VHF Transceiver',
    category: 'comm', trl: 9,
    manufacturer: 'AstroDev, Gomspace, ISIS',
    summary: 'UHF (435–438 MHz) and VHF (144–148 MHz) amateur radio transceivers are the most common communication system for CubeSats. They leverage the global amateur radio ground station network (e.g., SatNOGS) and require only simple dipole or turnstile antennas. Typical data rates are 1–19.2 kbps.',
    specs: { 'Frequency': '437 MHz (UHF)', 'Data rate': '1.2–19.2 kbps', 'TX power': '0.5–2 W RF', 'Antenna': 'Deployable dipole/turnstile' },
    recentDevelopments: 'AstroDev Lithium-2 radios deployed on >200 CubeSats. SatNOGS global network provides free ground station access for CubeSat operators. AFSK, FSK, and GMSK modulations are standard.'
  },
  {
    id: 'tech-ch7-2',
    chapterId: 'ch7', chapterNumber: 7, subsectionId: 'ch7-1',
    title: 'S-Band Transceiver',
    category: 'comm', trl: 9,
    manufacturer: 'Syrlinks, Clyde Space, ISAT',
    summary: 'S-band (2–4 GHz) transceivers provide higher data rates than UHF, typically 1–100 Mbps, enabling imagery and science data downlink. They are widely used for both command/telemetry and high-rate payload downlink on CubeSats and small satellites.',
    specs: { 'Frequency': '2.025–2.110 GHz (uplink), 2.200–2.290 GHz (downlink)', 'Data rate': '1–100 Mbps', 'TX power': '0.5–5 W RF', 'Antenna gain': '3–10 dBi' },
    recentDevelopments: 'Syrlinks EWC27 S-band transceiver achieves 50 Mbps in a CubeSat form factor. Clyde Space CPUT transceiver integrates S-band with UHF in a single board. Software-defined radio (SDR) enables reconfigurable waveforms on orbit.'
  },
  {
    id: 'tech-ch7-3',
    chapterId: 'ch7', chapterNumber: 7, subsectionId: 'ch7-1',
    title: 'X-Band Transmitter',
    category: 'comm', trl: 8,
    manufacturer: 'Tethers Unlimited (SWIFT-XTS), Innoflight, L3Harris',
    summary: 'X-band (8–12 GHz) transmitters provide high data-rate downlinks (100 Mbps – 1 Gbps) for imaging and science missions requiring large data volumes. They require directional antennas (patch arrays or dish reflectors) and precise pointing to achieve link closure.',
    specs: { 'Frequency': '8.025–8.500 GHz', 'Data rate': '100–1,000 Mbps', 'TX power': '1–10 W RF', 'Required antenna': '>15 dBi' },
    recentDevelopments: 'Tethers Unlimited SWIFT-XTS achieved 100 Mbps on a 3U CubeSat. Planet Labs uses X-band for Dove constellation downlink. NASA LLCD successor LCRD uses optical for higher rates.'
  },
  {
    id: 'tech-ch7-4',
    chapterId: 'ch7', chapterNumber: 7, subsectionId: 'ch7-2',
    title: 'Optical / Laser Communication Terminal',
    category: 'comm', trl: 6,
    manufacturer: 'NASA GSFC, MIT Lincoln Laboratory, Mynaric',
    summary: 'Optical communication terminals use laser beams at near-infrared wavelengths (1064 or 1550 nm) to achieve data rates of 1–100 Gbps, far exceeding RF capability. They require precise pointing (sub-µrad) and are affected by atmospheric turbulence for ground links. NASA\'s LCRD and ILLUMA-T demonstrated optical relay via ISS.',
    specs: { 'Wavelength': '1064 or 1550 nm', 'Data rate': '1–100 Gbps', 'Pointing requirement': '<10 µrad', 'Power': '10–100 W' },
    recentDevelopments: 'NASA LCRD (2021) demonstrated 1.2 Gbps optical relay in GEO. ILLUMA-T on ISS demonstrated 1.2 Gbps to ground. Mynaric CONDOR and HAWK terminals are being commercialized for LEO constellations. NASA TBIRD demonstrated 200 Gbps from LEO in 2022.'
  },
  {
    id: 'tech-ch7-5',
    chapterId: 'ch7', chapterNumber: 7, subsectionId: 'ch7-3',
    title: 'Deployable Patch Antenna Array',
    category: 'comm', trl: 8,
    manufacturer: 'Tethers Unlimited, Cobham, L3Harris',
    summary: 'Deployable patch antenna arrays provide high-gain directional communication for small spacecraft while stowing compactly during launch. They use spring-loaded or motor-driven mechanisms to deploy flat panels with integrated radiating elements, achieving 15–25 dBi gain.',
    specs: { 'Gain': '15–25 dBi', 'Frequency': 'S, X, or Ka-band', 'Stowed volume': '~0.25U', 'Pointing': 'Fixed or gimbaled' },
    recentDevelopments: 'Tethers Unlimited SWIFT-SAT deployed on 6U CubeSat demonstrating 15 dBi X-band. Ka-band phased arrays under development for high-throughput LEO constellation links. DARPA ASTERIA demonstrated steerable arrays on small platforms.'
  },

  // ── Chapter 8: Structures and Mechanisms ─────────────────────────────────
  {
    id: 'tech-ch8-1',
    chapterId: 'ch8', chapterNumber: 8, subsectionId: 'ch8-1',
    title: 'Tape Spring Deployable Boom',
    category: 'structures', trl: 8,
    manufacturer: 'DHV Technology, Oxford Space Systems, Roccor',
    summary: 'Tape spring booms use the elastic energy stored in a rolled metallic or CFRP tape to self-deploy solar panel substrates, antennas, or science instruments. They are passive (no motors), extremely lightweight, and have demonstrated reliable deployment in hundreds of CubeSat missions.',
    specs: { 'Deployed length': '0.1–5 m', 'Mass': '10–100 g', 'Deployment': 'Passive spring-driven', 'Tip deflection': '<1 mm @ 1 m' },
    recentDevelopments: 'Oxford Space Systems AstroTube used on ESA OPS-SAT and multiple commercial missions. DHV Deployable Boom flown on Lightsail-2. Bi-stable composite (TRAC) booms enable longer deployments with reduced tip deflection.'
  },
  {
    id: 'tech-ch8-2',
    chapterId: 'ch8', chapterNumber: 8, subsectionId: 'ch8-1',
    title: 'Roll-Out Drag Sail',
    category: 'structures', trl: 7,
    manufacturer: 'Tethers Unlimited (Terminator Tape), TriSept, CU Aerospace',
    summary: 'Drag augmentation devices (drag sails, deorbit sails) deploy large area-to-mass ratio structures after mission end to accelerate atmospheric reentry and reduce orbital debris. They are increasingly required by regulatory agencies as a deorbit provision for small spacecraft.',
    specs: { 'Sail area': '1–25 m²', 'Mass': '50–300 g', 'Deorbit acceleration (600 km)': '5–50× improvement', 'Stowed volume': '0.1–0.5U' },
    recentDevelopments: 'Tethers Unlimited Terminator Tape flown on 10+ missions. TriSept/CU Aerospace DAVID drag sail demonstrated on a 3U CubeSat. FCC now requires deorbit provisions for all small satellites below 600 km.'
  },
  {
    id: 'tech-ch8-3',
    chapterId: 'ch8', chapterNumber: 8, subsectionId: 'ch8-2',
    title: 'Aluminum CubeSat Structure',
    category: 'structures', trl: 9,
    manufacturer: 'Pumpkin Inc., ISIS, Clyde Space',
    summary: 'Machined 6061-T6 aluminum structures form the standard CubeSat chassis, providing compliance with the CDS mechanical standard while offering good thermal conductivity and machinability. PC/104 stackable board form factors mount inside on threaded rods.',
    specs: { 'Material': 'Al 6061-T6', 'Wall thickness': '1–3 mm', 'Compliance': 'CDS Rev 14', 'Anodizing': 'Type II or III' },
    recentDevelopments: 'Pumpkin CubeSat Kit is the most widely used structure with >1,000 flight units. ISIS Structure 3U has >500 flight heritage. Carbon fiber reinforced polymer (CFRP) structures are emerging for mass-critical applications.'
  },
  {
    id: 'tech-ch8-4',
    chapterId: 'ch8', chapterNumber: 8, subsectionId: 'ch8-3',
    title: 'P-POD CubeSat Deployer',
    category: 'structures', trl: 9,
    manufacturer: 'Cal Poly SLO, ISL, Planetary Systems Corp',
    summary: 'The Poly Picosatellite Orbital Deployer (P-POD) is the standard mechanism for deploying CubeSats from launch vehicles. A spring-loaded door deploys CubeSats into orbit at separation from the launch vehicle. The P-POD accommodates 1–3U CubeSats and has deployed >500 CubeSats since 2003.',
    specs: { 'Capacity': '3U (or 3× 1U)', 'Spring ejection velocity': '1.6–2.4 m/s', 'Envelope': 'CDS compliant', 'Mass': '~340 g' },
    recentDevelopments: 'NanoRacks NRCSD adapts the P-POD concept for ISS deployment. SpaceX Falcon 9 SHERPA rideshare uses ISIPOD deployers. 6U and 12U deployers (e.g., ISISpace 6U POD) are now standard for larger CubeSats.'
  },

  // ── Chapter 9: Passive Thermal Control ───────────────────────────────────
  {
    id: 'tech-ch9-1',
    chapterId: 'ch9', chapterNumber: 9, subsectionId: 'ch9-1',
    title: 'Multi-Layer Insulation (MLI) Blanket',
    category: 'thermal', trl: 9,
    manufacturer: 'Sheldahl, Dunmore, ILC Dover',
    summary: 'Multi-layer insulation blankets consist of alternating layers of aluminized Mylar (or Kapton) and low-conductance spacers (Dacron net or dimpled Mylar), reducing radiative heat transfer to the spacecraft interior. An effective emittance of 0.01–0.03 is achievable with 10–20 layers.',
    specs: { 'Effective emittance': '0.01–0.03 (≥10 layers)', 'Layer material': 'Aluminized Mylar / Kapton', 'Spacer': 'Dacron net or dimpled film', 'Density': '0.1–0.3 kg/m²' },
    recentDevelopments: 'CubeSat-scale MLI kits are now available from multiple vendors. Perforated and vented MLI designs address trapped outgassing. Atomic oxygen-resistant coatings extend life in LEO above 400 km.'
  },
  {
    id: 'tech-ch9-2',
    chapterId: 'ch9', chapterNumber: 9, subsectionId: 'ch9-2',
    title: 'Optical Solar Reflector (OSR)',
    category: 'thermal', trl: 9,
    manufacturer: 'Qioptiq, NSGP, Thales Alenia',
    summary: 'Optical solar reflectors are second-surface mirrors consisting of a reflective metallic coating on the back of a transparent quartz or glass substrate. They provide very low solar absorptance (0.05–0.10) combined with high IR emittance (0.80–0.85), making them ideal radiator surfaces for high-temperature rejection.',
    specs: { 'Solar absorptance': '0.05–0.10', 'IR emittance': '0.80–0.85', 'Thickness': '0.1–0.2 mm', 'Mass density': '0.5–0.7 kg/m²' },
    recentDevelopments: 'OSRs are standard on GEO spacecraft radiators. Flexible silver-backed OSR tapes (AZ-93) used on CubeSat-scale missions. Silver contamination in LEO has led to preference for quartz-based OSRs above 500 km.'
  },
  {
    id: 'tech-ch9-3',
    chapterId: 'ch9', chapterNumber: 9, subsectionId: 'ch9-3',
    title: 'Variable Conductance Heat Pipe (VCHP)',
    category: 'thermal', trl: 8,
    manufacturer: 'Advanced Cooling Technologies (ACT), Thermacore, Lockheed Martin',
    summary: 'Variable conductance heat pipes use a non-condensable gas reservoir to automatically modulate heat transport as power levels change. When power decreases, the gas expands into the condenser, reducing effective length and thermal conductance. This provides passive temperature regulation without electrical power.',
    specs: { 'Heat transport': '5–500 W', 'Temperature control': '±5°C passive', 'Working fluid': 'Ammonia, propylene', 'Operating temp': '-40°C to +80°C' },
    recentDevelopments: 'ACT VCHPs are qualified for LEO and GEO spacecraft. Miniaturized 6mm VCHPs demonstrated for CubeSat/smallsat applications. Loop heat pipes (LHPs) offer greater geometric flexibility for complex routing.'
  },

  // ── Chapter 10: Active Thermal Control ───────────────────────────────────
  {
    id: 'tech-ch10-1',
    chapterId: 'ch10', chapterNumber: 10, subsectionId: 'ch10-1',
    title: 'Kapton Film Heater',
    category: 'thermal', trl: 9,
    manufacturer: 'Minco, Watlow, BriskHeat',
    summary: 'Kapton (polyimide) film heaters are thin, flexible resistive heating elements bonded directly to spacecraft surfaces to prevent components from reaching their lower temperature limits. They are controlled by thermostat relays (simple) or proportional temperature controllers (precision). They are the primary active thermal tool on virtually all spacecraft.',
    specs: { 'Watt density': '0.3–1.5 W/cm²', 'Voltage': '28 VDC nominal', 'Temperature range': '-200°C to +200°C', 'Thickness': '0.1–0.5 mm' },
    recentDevelopments: 'Digital heater controllers (DHCs) provide proportional control and telemetry for dozens of heater zones. CubeSat heater circuits are now integrated directly on PCBs. Machine learning-based thermal prediction systems optimize heater operation.'
  },
  {
    id: 'tech-ch10-2',
    chapterId: 'ch10', chapterNumber: 10, subsectionId: 'ch10-2',
    title: 'Louver (Bi-Metallic / Electric)',
    category: 'thermal', trl: 7,
    manufacturer: 'Heliofocus, Alcatel Space, Ball Aerospace',
    summary: 'Louvers are variable emittance devices consisting of movable vanes or blades that open to expose high-emittance surfaces for heat rejection or close to insulate when cold. Bi-metallic louvers self-actuate passively based on local temperature; electric louvers are servo-driven for active control.',
    specs: { 'Effective emittance (open)': '0.7–0.8', 'Effective emittance (closed)': '0.1–0.15', 'Temperature trigger': 'adjustable (bimetal)', 'Mass': '1–2 kg/m²' },
    recentDevelopments: 'Electric Variable Emittance Coatings (EVEC) using electrochromic materials offer solid-state louver alternatives. ESA Alphabus uses electric louvers for GEO thermal control. Miniaturized louver concepts under development for smallsat high-power payloads.'
  },
  {
    id: 'tech-ch10-3',
    chapterId: 'ch10', chapterNumber: 10, subsectionId: 'ch10-3',
    title: 'Single-Phase Mechanically Pumped Fluid Loop',
    category: 'thermal', trl: 7,
    manufacturer: 'Creare, Mezzo Technologies, NASA JPL',
    summary: 'Pumped fluid loops circulate a single-phase coolant (e.g., propylene glycol/water, HFE-7100) between heat sources and a radiator, providing predictable heat transport over long distances (>1 m). They are used on high-power spacecraft where heat pipes cannot transport sufficient power.',
    specs: { 'Heat transport': '50–5,000 W', 'Coolant': 'PGW, HFE-7100, or ammonia', 'Pump mass': '0.5–2 kg', 'Operating temp': '-40°C to +60°C' },
    recentDevelopments: 'NASA JPL mini-pump demonstrated on MIRO instrument (Rosetta). Creare miniaturized pump qualified for CubeSat power levels (10–50 W). Two-phase pumped loops (TPFL) offer higher efficiency for future high-power smallsats.'
  }
];

export const technicalTerms = [
  'TRL (Technology Readiness Level)',
  'CubeSat', '1U CubeSat', '3U CubeSat', '6U CubeSat',
  'Solar cells', 'GaAs solar cells', 'Triple-junction cells',
  'Propulsion systems', 'Monopropellant', 'Bipropellant', 'Electrospray',
  'Hosted orbital services', 'Rideshare',
  'Star tracker', 'Sun sensor', 'IMU',
  'Reaction wheels', 'Magnetorquers',
  'Ion thruster', 'Hall-effect thruster', 'Cold gas',
  'S-band communication', 'X-band', 'UHF', 'Optical communication',
  'Deployable solar arrays', 'Deployable boom',
  'Attitude control', 'Power management',
  'Radiation hardening', 'RAD750', 'cFS', 'Flight software',
  'Thermal control', 'Multi-layer insulation', 'MLI',
  'Heat pipe', 'Louver', 'Kapton heater',
  'P-POD', 'ESPA', 'CDS standard',
];

export const searchSuggestions = (query: string) => {
  const lowerQuery = query.toLowerCase();
  const suggestions: {
    type: 'chapter' | 'section' | 'term' | 'technology';
    text: string;
    chapterId?: string;
    sectionId?: string;
    techId?: string;
  }[] = [];

  // Search chapters
  chapters.forEach(chapter => {
    if (chapter.title.toLowerCase().includes(lowerQuery)) {
      suggestions.push({ type: 'chapter', text: `Chapter ${chapter.number}: ${chapter.title}`, chapterId: chapter.id });
    }
    chapter.subsections.forEach(subsection => {
      if (subsection.title.toLowerCase().includes(lowerQuery)) {
        suggestions.push({ type: 'section', text: subsection.title, chapterId: chapter.id, sectionId: subsection.id });
      }
    });
  });

  // Search technologies
  technologies.forEach(tech => {
    if (tech.title.toLowerCase().includes(lowerQuery) || tech.manufacturer.toLowerCase().includes(lowerQuery)) {
      suggestions.push({ type: 'technology', text: tech.title, chapterId: tech.chapterId, techId: tech.id });
    }
  });

  // Search technical terms
  technicalTerms.forEach(term => {
    if (term.toLowerCase().includes(lowerQuery)) {
      suggestions.push({ type: 'term', text: term });
    }
  });

  return suggestions.slice(0, 8);
};
