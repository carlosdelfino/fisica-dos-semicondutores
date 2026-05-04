// English (UK) translation for the "FET Types" panel
const ui = {
  title: '🔬 Types of FET Transistors — Educational Panel',
  intro: 'Explore the main types of field-effect transistors. Each panel shows the cross-section structure with animation of electron and hole mobility and proportional arrows indicating the direction of current.',
  pause: '⏸️ Pause animations',
  resume: '▶️ Resume animations',
  legend: { electron: 'electron', hole: 'hole', current: 'conventional current' },
  sections: {
    operation: '🔎 Operation',
    advantages: '✅ Advantages',
    applications: '🏭 Applications',
    why: '📍 Where and why'
  },
  layersTitle: '🧱 Layers, materials and dopings',
  layersIntro: 'Each layer has a specific role; doping (type and concentration) determines barriers, capacitances, mobility and operating voltages.',
  layersTable: { layer: 'Layer', material: 'Material', doping: 'Doping', role: 'Role', impact: 'Impact on operation' },
  quickRef: '📚 Quick reference',
  info: {
    whatIs: { title: '🎯 What is a FET?', body: 'A device in which the current between source and drain is modulated by an electric field applied to the gate, with no significant gate current (high input impedance).' },
    isolation: { title: '⚙️ Gate isolation principles', body: 'MOSFET/IGBT: oxide. JFET: PN junction. MESFET: Schottky barrier. HEMT/MODFET: heterojunction + Schottky.' },
    trends: { title: '🚀 Trends', body: 'From planar → FinFET → GAAFET/Nanosheet for logic; GaN HEMT and vertical SiC for power; TFET for ultra-low power; OFET/TFT for displays and flexible electronics.' },
    reading: { title: '📐 Reading the figures', body: 'Colours are symbolic: blue = N region / electrons, orange = P region / holes, purple = gate, yellow = oxide. Arrow thicknesses are proportional to the typical current of the device.' }
  }
};

const catalog = {
  mosfet: {
    name: 'Planar MOSFET',
    tag: 'Classic CMOS',
    summary: 'Oxide-isolated gate over P/N substrate.',
    operation: 'A conducting channel is induced at the surface of the semiconductor when V_GS > V_TH. The gate oxide electrically isolates the control terminal, allowing high input impedance. Current flows laterally between source and drain through the channel.',
    advantages: 'High input impedance, mature CMOS fabrication, low static consumption.',
    applications: 'Foundation of all digital CMOS, memories, analog amplifiers.',
    why: 'Thermally grown oxide on Si is nearly perfect (SiO₂/Si): low interface state density and very high dielectric strength. This enables gates with negligible leakage and the mass miniaturisation that sustains the microprocessor and memory industry.',
    layers: [
      { name: 'P substrate (body)', material: 'Single-crystal Si', doping: 'Light, ~1×10¹⁵ cm⁻³ (B, acceptors)', role: 'Provides body for the inversion channel and voltage reference (bulk).', impact: 'Light doping allows formation of the depletion region required by the channel; if too high, V_TH rises and mobility drops due to impurity scattering.' },
      { name: 'N+ Source / Drain', material: 'Doped Si', doping: 'Degenerate, ~1×10²⁰ cm⁻³ (As, P, donors)', role: 'Electron reservoirs and low-resistance ohmic contacts.', impact: 'High doping ensures ohmic contact (no Schottky barrier) and reduces series resistance R_SD; an abrupt junction minimises short-channel effects.' },
      { name: 'Gate oxide (SiO₂)', material: 'Silicon dioxide', doping: 'Insulator (not intentionally doped)', role: 'Electrically isolates the gate from the channel; couples the gate electrostatic field.', impact: 'Thickness ~1–3 nm sets capacitance C_ox and therefore g_m and V_TH; if too thin, direct tunnelling (leakage) occurs.' },
      { name: 'N inversion channel', material: 'Inverted Si layer', doping: 'Electrostatically induced (not chemically)', role: 'Conducts electrons from source to drain.', impact: 'Density ∝ C_ox·(V_GS−V_TH); formation depends on body doping and gate work function.' },
      { name: 'Gate', material: 'N+ polysilicon (classic) or metal (HKMG)', doping: 'Poly N+ ~1×10²⁰ cm⁻³ / metal: undoped', role: 'Channel control electrode.', impact: 'Gate work function fixes V_TH; poly-Si suffers "poly depletion" → modern technologies use metal gate + high-κ.' }
    ]
  },
  finfet: {
    name: 'FinFET',
    tag: '3D, 22nm–5nm',
    summary: 'Vertical silicon fin with gate wrapping 3 sides.',
    operation: 'The channel is a vertical silicon "fin". The gate wraps it on three sides, multiplying electrostatic control and reducing short-channel effects (leakage, DIBL). Current sums over the three fin surfaces.',
    advantages: 'Better channel control, lower leakage, more current per area than planar.',
    applications: 'Processors from 22nm to 5nm (Intel, TSMC, Samsung).',
    why: 'Below ~22 nm, the planar MOSFET loses electrostatic control (DIBL, punch-through). Wrapping the channel on 3 sides increases gate–channel coupling and allows continuing Moore\'s scaling with lower V_DD and lower leakage.',
    layers: [
      { name: 'P bulk substrate', material: 'Si', doping: 'Light (B, ~10¹⁵)', role: 'Mechanical support and STI isolation.', impact: 'Electrically of little relevance; the channel resides entirely in the fin.' },
      { name: 'Fin (channel body)', material: 'Si', doping: 'Intrinsic or lightly doped (<10¹⁶)', role: '3D body where inversion occurs on three faces.', impact: 'Lightly doped fin → less statistical V_TH variation and higher mobility; fin width sets the electrostatics.' },
      { name: 'N+ Source / Drain (SiGe:P or SiP)', material: 'Epitaxial Si:P or SiGe', doping: 'Degenerate, ~1–3×10²⁰', role: 'Ohmic contact and mechanical-stress (strain) inducer.', impact: 'Strained epi increases mobility; high doping reduces R_SD.' },
      { name: 'Interfacial SiO₂ + high-κ (HfO₂)', material: 'Thin SiO₂ + HfO₂', doping: 'Insulators', role: 'High-κ gate dielectric with low EOT.', impact: 'High-κ reduces tunnelling while maintaining equivalent capacitance; interfacial preserves Si/oxide interface quality.' },
      { name: 'Metal gate (TiN/TaN + fill)', material: 'TiN, TaN, W', doping: 'Undoped', role: 'Electrode with work function tuned for nMOS/pMOS.', impact: 'Metal work function sets V_TH without depending on doping poly-Si; eliminates poly depletion.' }
    ]
  },
  gaafet: {
    name: 'GAAFET (Nanosheet)',
    tag: '3nm and below',
    summary: 'Gate fully wraps horizontal nanosheets.',
    operation: 'Several stacked silicon nanosheets form parallel channels, and the gate wraps them on every side (gate-all-around). Electrostatic control is maximal: the gate "closes" the channel entirely when off.',
    advantages: 'Better control than FinFET, adjustable effective width, ideal for ≤3nm.',
    applications: 'Samsung 3nm GAA, TSMC N2 and future generations.',
    why: 'FinFET saturates at ~5 nm fin width. GAA allows stacked channels with sheet width adjustable by design (not just by number of fins), giving current flexibility and ideal electrostatics for ≤3 nm nodes.',
    layers: [
      { name: 'Substrate + BOX', material: 'Si / buried SiO₂', doping: 'Isolation', role: 'Mechanical base and channel isolation.', impact: 'Reduces parasitic currents to bulk.' },
      { name: 'Si nanosheets', material: 'Epitaxial Si (grown on sacrificial SiGe)', doping: 'Intrinsic', role: 'Parallel channels wrapped by the gate.', impact: 'Absence of dopants eliminates impurity scattering → higher µ; thickness (~5 nm) sets tunnelling and quantum effects.' },
      { name: 'Inner spacers', material: 'Low-κ SiN', doping: 'Insulator', role: 'Separate the gate from S/D between sheets.', impact: 'Reduce parasitic capacitance C_gd and C_gs, improving frequency.' },
      { name: 'Epitaxial Source / Drain', material: 'SiP (nMOS) / SiGe:B (pMOS)', doping: '~1×10²¹', role: 'Ohmic contact to all sheets.', impact: 'Very high doping is needed for simultaneous contact to multiple sheets without R_SD bottleneck.' },
      { name: 'High-κ dielectric + metal gate', material: 'HfO₂ + TiN/TiAlC', doping: '—', role: 'Fully wraps each sheet.', impact: 'Maximum electrostatic coupling → SS close to ideal (~60 mV/dec) and minimum leakage.' }
    ]
  },
  hemt: {
    name: 'HEMT',
    tag: 'RF / high speed',
    summary: 'AlGaAs/GaAs heterostructure with 2DEG.',
    operation: 'The junction of materials with different bands (AlGaAs/GaAs or AlGaN/GaN) generates a two-dimensional electron gas (2DEG) at the interface. Electrons are spatially separated from donors, reducing impurity scattering → very high mobility.',
    advantages: 'Extremely high mobility, gain at microwave/mm-wave.',
    applications: '5G/6G radio, GaN power amplifiers, satellite, radar.',
    why: 'At mm-wave frequencies (>30 GHz), transit time limits Si. III-V materials offer much higher µ and v_sat, and the heterojunction trick separates carriers from impurities, something impossible in homo-structural MOSFETs.',
    layers: [
      { name: 'Semi-insulating substrate', material: 'SI GaAs or SiC (for GaN)', doping: 'Undoped / compensated (>10⁷ Ω·cm)', role: 'RF isolation (low parasitic capacitance).', impact: 'A conducting substrate would ruin GHz isolation; SI is essential for high Q.' },
      { name: 'Intrinsic buffer/channel', material: 'Undoped GaAs (or GaN)', doping: 'Intrinsic', role: 'Hosts the 2DEG without introducing impurities.', impact: 'No dopants in channel → mobility >8000 cm²/V·s (GaAs) or ~2000 (GaN) with very high v_sat.' },
      { name: 'AlGaAs/AlGaN spacer', material: 'Undoped AlGaAs (or AlGaN), ~2–5 nm', doping: 'Intrinsic', role: 'Physically separates donors from the channel.', impact: 'Reduces remote Coulomb scattering; trade-off: too thick reduces 2DEG density.' },
      { name: 'Doped barrier', material: 'AlGaAs:Si (or polarised AlGaN/GaN)', doping: 'δ-doping or uniform, ~1×10¹⁸ (Si)', role: 'Provides electrons that "fall" into the 2DEG well.', impact: '2DEG density (~1×10¹² – 1×10¹³ /cm²) is controlled by this doping; in GaN, spontaneous/piezo polarisation is used instead of doping.' },
      { name: 'GaAs / GaN n+ cap', material: 'GaAs or GaN', doping: '~1×10¹⁹', role: 'Reduces R_c of ohmic contacts.', impact: 'Without the cap, contacts would have an unwanted Schottky barrier.' },
      { name: 'Schottky gate', material: 'Ti/Pt/Au or Ni/Au', doping: '—', role: 'Modulates 2DEG density via depletion.', impact: 'Schottky barrier replaces the oxide (which is not stable on GaAs); low capacitance enables very high f_T.' }
    ]
  },
  igbt: {
    name: 'IGBT',
    tag: 'High power',
    summary: 'MOSFET + BJT hybrid for high currents.',
    operation: 'The input is a MOS gate (high impedance) that controls electron injection into a vertical BJT base. A second P+ terminal (collector) injects holes into the drift, causing conductivity modulation and bipolar-type I-V with low voltage drop.',
    advantages: 'High blocking voltage and current, voltage control (MOS).',
    applications: 'Industrial inverters, vehicle traction, solar/wind energy.',
    why: 'At >600 V with currents of tens to hundreds of amperes, a pure MOSFET would have prohibitive R_on. The IGBT injects holes into the drift (conductivity modulation), drastically reducing V_CE(sat) while keeping the easy MOS gate control.',
    layers: [
      { name: 'P+ collector (back-side)', material: 'Si', doping: 'Heavy, ~1×10¹⁹ (B)', role: 'Injects holes into the drift when on.', impact: 'This is what turns the MOSFET into bipolar: higher doping → more injection → lower V_CE(sat), but slower recovery (tail current).' },
      { name: 'N buffer (field-stop, optional)', material: 'Si', doping: '~1×10¹⁶', role: 'Stops the electric field before reaching the collector.', impact: 'Allows thinner drift for the same V_BR → lower R_on and better efficiency.' },
      { name: 'N⁻ drift', material: 'Si epi', doping: 'Very light, ~1×10¹³ – 5×10¹⁴ (P)', role: 'Sustains the entire blocking voltage.', impact: 'The lower the doping and the thicker, the higher V_BR — but higher off-state R_on; classic V_BR × R_on trade-off.' },
      { name: 'P-body', material: 'Si', doping: '~1×10¹⁷ (B)', role: 'Region where the MOS channel is inverted.', impact: 'Sets V_TH of the MOS gate; poorly calibrated doping ⇒ parasitic thyristor latch-up.' },
      { name: 'N+ emitter', material: 'Si', doping: '~1×10²⁰ (As)', role: 'Emitter ohmic contact and electron injector.', impact: 'High doping reduces resistance but increases latch-up risk if poorly sized.' },
      { name: 'Oxide + poly-Si gate', material: 'SiO₂ + Si:N+', doping: 'Poly N+ ~10²⁰', role: 'MOS control input.', impact: 'Allows voltage drive (little driver current), unlike current-driven BJT/Thyristor.' }
    ]
  },
  jfet: {
    name: 'JFET',
    tag: 'PN junction as gate',
    summary: 'PN depletion pinches the N channel.',
    operation: 'The gate is a reverse-biased PN junction. The depletion region expands within the N channel as V_GS becomes more negative, pinching the current. There is no oxide.',
    advantages: 'Low noise, simplicity, good linearity.',
    applications: 'Low-noise audio preamps, instrumentation.',
    why: 'Without oxide, there is no trapping at interface states or 1/f noise typical of the MOSFET. This makes the JFET the best choice for instrumentation front-ends and ultra-low-noise audio.',
    layers: [
      { name: 'N channel', material: 'Si', doping: 'Moderate, ~1×10¹⁶ – 1×10¹⁷ (P, As)', role: 'Main conducting path.', impact: 'Doping sets the saturation current I_DSS and the pinch-off voltage V_P; more doped → more current, but more negative V_P.' },
      { name: 'P+ gate (top and bottom)', material: 'Si', doping: 'Degenerate, ~1×10¹⁹ (B)', role: 'Forms the PN junction that controls depletion.', impact: 'P+ >> N ensures the depletion grows almost entirely inside the channel (where we want to modulate), not in the gate.' },
      { name: 'S/D ohmic contacts', material: 'Metal on N+ implant', doping: 'Locally N+ ~10²⁰', role: 'External connection.', impact: 'Degenerate region eliminates Schottky barrier and keeps noise low.' }
    ]
  },
  mesfet: {
    name: 'MESFET',
    tag: 'GaAs, microwave',
    summary: 'Direct Schottky gate on N channel (no oxide).',
    operation: 'The gate is a metal–semiconductor Schottky contact made directly on an n-doped GaAs channel. The Schottky barrier creates depletion that modulates the channel. Used where GaAs does not form a stable oxide.',
    advantages: 'High frequency on GaAs, simple oxide-free process.',
    applications: 'Microwave, satellite communication, LNA amplifiers.',
    why: 'GaAs does not form a stable native oxide like Si/SiO₂. Using a Schottky barrier circumvents this, and combined with the high µ of GaAs, allows operation up to tens of GHz with a simple process.',
    layers: [
      { name: 'SI GaAs substrate', material: 'GaAs compensated with Cr or EL2', doping: 'Semi-insulating (~10⁸ Ω·cm)', role: 'RF isolation.', impact: 'Avoids dielectric losses at GHz; essential for low-noise amplifiers.' },
      { name: 'Active layer (channel)', material: 'GaAs', doping: 'Moderate, ~1–5×10¹⁷ (Si)', role: 'Conducting channel.', impact: 'Doping sets I_DSS and V_P; more doped → more current, but lower Schottky breakdown voltage.' },
      { name: 'n+ cap for S/D', material: 'GaAs', doping: '~1×10¹⁸ – 10¹⁹', role: 'Reduces ohmic contact resistance.', impact: 'Without the localised raise, contacts would be unwanted Schottky.' },
      { name: 'Schottky gate', material: 'Ti/Pt/Au', doping: '—', role: 'Schottky barrier that modulates the channel via depletion.', impact: 'Barrier ≈0.7–0.9 eV limits positive V_GS but gives fast response (no oxide) → very high f_T.' }
    ]
  },
  modfet: {
    name: 'MODFET',
    tag: 'Modulated doping',
    summary: 'HEMT variant emphasising doping modulation.',
    operation: 'Donor atoms sit in a layer (AlGaAs:n) separated from the channel (GaAs:i) by an undoped spacer. Electrons "fall" into the GaAs forming the 2DEG, but the impurities stay behind — extremely high mobility.',
    advantages: 'Superior mobility, very high cutoff frequencies f_T.',
    applications: 'RF front-end, radio astronomy, cryogenic receivers.',
    why: 'At low temperatures (cryogenics, radio astronomy), ionised-impurity scattering dominates mobility. Physically separating donors from the channel (modulated doping) enables mobilities >10⁶ cm²/V·s at 4 K.',
    layers: [
      { name: 'SI GaAs substrate', material: 'GaAs', doping: 'Semi-insulating', role: 'Base and isolation.', impact: 'Same as HEMT: low RF loss.' },
      { name: 'Intrinsic GaAs channel', material: 'Undoped GaAs', doping: 'Intrinsic', role: 'Hosts the 2DEG.', impact: 'No impurities ⇒ µ can exceed 10⁶ cm²/V·s at 4 K.' },
      { name: 'Undoped AlGaAs spacer', material: 'AlGaAs', doping: '0', role: 'Physically separates donors from the 2DEG.', impact: 'Controls the µ vs 2DEG-density trade-off: thicker spacer → higher µ, lower n₂DEG.' },
      { name: 'AlGaAs:n (supply layer)', material: 'AlGaAs', doping: 'δ-doping Si ~5×10¹² cm⁻² or uniform ~10¹⁸', role: 'Supplies the electrons.', impact: 'Adjusts n₂DEG without introducing impurities in the channel; δ-doping concentrates donors in a plane for higher efficiency.' },
      { name: 'GaAs n+ cap', material: 'GaAs', doping: '~10¹⁹', role: 'Ohmic contact.', impact: 'Reduces critical R_c for noise in LNA.' },
      { name: 'Recessed Schottky gate', material: 'Ti/Pt/Au', doping: '—', role: '2DEG modulation.', impact: 'Gate recess brings it closer to the channel → higher g_m.' }
    ]
  },
  ofet: {
    name: 'OFET',
    tag: 'Organic electronics',
    summary: 'π-conjugated organic semiconductor.',
    operation: 'Channel formed by conjugated molecules/polymers (pentacene, P3HT, etc.). Conduction typically occurs by hopping between π states. Fabrication by printing on flexible substrates at low temperature.',
    advantages: 'Low cost, flexible, large area, biocompatible.',
    applications: 'Flexible displays, biomedical sensors, printed RFID.',
    why: 'It does not compete with Si in speed. It is chosen where mechanical flexibility, large area, low cost per cm² and low-temperature processing (<150 °C) matter more than frequency — e.g. flexible backplanes and disposable sensors.',
    layers: [
      { name: 'Flexible substrate', material: 'PET, PEN or thin glass', doping: '—', role: 'Flexible mechanical support.', impact: 'Limits process temperature; requires layers tolerating <150 °C.' },
      { name: 'Metal gate (bottom)', material: 'Au, Ag or ITO', doping: '—', role: 'Control electrode.', impact: 'Work function affects V_TH and effective contact doping.' },
      { name: 'Polymer dielectric', material: 'PVP, PMMA, PVA (or Al₂O₃ by ALD)', doping: 'Insulator', role: 'Gate isolation.', impact: 'Low κ requires thinner layers; interface traps cause hysteresis and V_TH shift.' },
      { name: 'Organic semiconductor', material: 'Pentacene, P3HT (p-type); C60, PCBM (n-type)', doping: 'Typically intrinsic; molecular doping possible (F4-TCNQ etc.)', role: 'Conducting channel by π hopping.', impact: 'Excessive doping increases I_off (loses on/off); molecular purity and ordering dominate µ (0.1–10 cm²/V·s).' },
      { name: 'Source / Drain', material: 'Au, Ag or PEDOT:PSS', doping: '—', role: 'Ohmic contact to HOMO (p) or LUMO (n).', impact: 'Work-function alignment with HOMO/LUMO determines contact resistance, often the OFET bottleneck.' }
    ]
  },
  tfet: {
    name: 'TFET',
    tag: 'Tunnelling',
    summary: 'Band-to-band tunnelling injection.',
    operation: 'Instead of thermionically injecting carriers over a barrier, the TFET uses band-to-band tunnelling (BTBT) at the P+ source/channel junction. This allows subthreshold slope below 60 mV/dec (Boltzmann limit).',
    advantages: 'Operation at very low voltages (<0.5 V), very low consumption.',
    applications: 'Future ultra-low-power ICs, IoT, autonomous sensors.',
    why: 'The MOSFET is fundamentally bound by the Boltzmann limit (SS ≥ 60 mV/dec at 300 K), which prevents reducing V_DD below ~0.5 V without exploding leakage. The TFET breaks this limit using tunnelling, enabling IoT with energy harvesting.',
    layers: [
      { name: 'P+ source', material: 'Si, Ge or InGaAs', doping: 'Degenerate, ~1×10²⁰ (B)', role: 'Hole reservoir and supplier of the tunnelling junction.', impact: 'Very high and abrupt doping is critical: it sets the BTBT barrier width (∝ 1/√N); more doped → higher tunnelling (higher I_on).' },
      { name: 'Intrinsic channel', material: 'Undoped Si/Ge/InGaAs', doping: 'Intrinsic', role: 'Region where the gate aligns the bands.', impact: 'No impurities → well-defined barrier, very low I_off; any residual doping degrades SS.' },
      { name: 'N+ drain', material: 'Si or InGaAs', doping: '~1×10²⁰ (As)', role: 'Collector of tunnelled electrons.', impact: 'P+/i/N+ asymmetry creates rectification giving the characteristic unidirectional behaviour.' },
      { name: 'High-κ dielectric', material: 'HfO₂', doping: '—', role: 'Couples the gate to the channel to align bands.', impact: 'High κ is essential: tunnelling depends on abrupt band curvature in the channel, only achieved with strong electrostatic coupling.' },
      { name: 'Metal gate', material: 'TiN or similar', doping: '—', role: 'Controls the alignment of E_C(channel) with E_V(source).', impact: 'Tuned work function reduces V_TH and maximises useful window below 0.5 V.' }
    ]
  },
  tft: {
    name: 'TFT (Thin-Film)',
    tag: 'Displays',
    summary: 'Thin-film transistor on glass/plastic.',
    operation: 'A thin layer of semiconductor (a-Si, LTPS or IGZO) is deposited on an insulating substrate (glass). Bottom-gate with dielectric (SiNx/SiO₂). Low-temperature process allows very large areas.',
    advantages: 'Large area, glass/plastic process, low cost.',
    applications: 'LCD/OLED backplanes, AMOLED, e-paper, digital X-ray.',
    why: 'Panels of several square metres require a low-temperature process (you cannot grow crystalline Si). Thin films (a-Si, LTPS, IGZO) are deposited directly onto glass, and each pixel gets its own transistor.',
    layers: [
      { name: 'Substrate', material: 'Glass or plastic (PI)', doping: '—', role: 'Mechanical base.', impact: 'Limits process temperature (<350 °C for glass, <250 °C for plastic).' },
      { name: 'Gate (bottom)', material: 'Mo, Al, Cu', doping: '—', role: 'Control electrode.', impact: 'Low-resistance metal is essential for large backplanes (signal uniformity).' },
      { name: 'Dielectric', material: 'SiNₓ, SiO₂ (PECVD) or Al₂O₃ (ALD)', doping: 'Insulator', role: 'Gate isolation.', impact: 'SiNx has traps that shift V_TH over time (bias stress) — major issue in AMOLED.' },
      { name: 'Thin-film semiconductor', material: 'a-Si:H (µ≈1), LTPS (µ≈100) or IGZO (µ≈10)', doping: 'a-Si: lightly n by hydrogen; IGZO: electrons from oxygen vacancies; LTPS: can be doped by implantation', role: 'Transistor channel.', impact: 'In IGZO, controlling O stoichiometry sets n_e: excess vacancies → channel always on (negative V_TH); too few → "dead" TFT.' },
      { name: 'Source / Drain', material: 'Mo or Ti/Al/Ti', doping: 'Locally reduced region in IGZO (rich in absent oxygen)', role: 'Ohmic contact.', impact: 'Plasma treatment creates an effective n+ layer in IGZO to lower R_c without implantation.' }
    ]
  },
  vpower: {
    name: 'Vertical GaAs/GaN Power',
    tag: 'Vertical power',
    summary: 'Vertical current through thick N⁻ drift.',
    operation: 'Vertical structure: source and gate on top, drain at the bottom. The thick N⁻ drift supports high blocked voltage. When the gate inverts the channel in the P-body, electrons flow vertically to the drain.',
    advantages: 'Supports very high V_DS, high current density.',
    applications: 'Power conversion in electric vehicles, industrial supplies, power GaN/SiC.',
    why: 'For traction inverters (>600 V, hundreds of A), the vertical geometry distributes heat across the entire chip and uses the substrate as a drain terminal. In SiC/GaN, the critical field ~10× higher than Si allows a 10× thinner drift → lower R_on·A.',
    layers: [
      { name: 'N+ substrate (drain)', material: 'SiC, GaN or Si', doping: 'Degenerate, ~1×10¹⁹', role: 'Ohmic drain terminal at the bottom.', impact: 'High doping ensures low substrate resistance; its thermal conductivity sets the dissipation.' },
      { name: 'N buffer (optional)', material: 'SiC/GaN epi', doping: '~1×10¹⁷', role: 'Transition to drift and field-stop.', impact: 'Allows thinner drift without punch-through.' },
      { name: 'N⁻ drift', material: 'Epitaxial SiC/GaN', doping: 'Light, ~1×10¹⁴ – 1×10¹⁶', role: 'Sustains all V_DS in blocking.', impact: 'Main R_on × V_BR trade-off: R_on,sp ∝ V_BR²·⁵/(µ·E_c³). That is why SiC/GaN beat Si in power (E_c ~10× higher).' },
      { name: 'P-body', material: 'SiC/GaN', doping: '~1×10¹⁷ (Al in SiC, Mg in GaN)', role: 'Region where the inversion channel is formed.', impact: 'Doping sets V_TH and punch-through robustness; in GaN it is still a challenge (Mg activation).' },
      { name: 'N+ source', material: 'SiC/GaN', doping: '~1×10²⁰', role: 'Electron supplier for the channel.', impact: 'High doping reduces R_c and allows high current density.' },
      { name: 'Trench gate + oxide', material: 'Poly-Si or metal on SiO₂/Al₂O₃', doping: 'N+ poly gate or metal', role: 'Vertical MOS channel in P-body.', impact: 'Trench geometry multiplies effective channel width, reducing R_on(channel); SiC oxide quality (SiC/SiO₂ interface) is historically the biggest challenge.' }
    ]
  }
};

export default { ui, catalog };
