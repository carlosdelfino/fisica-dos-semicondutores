import fetTypes from './fetTypes/en.js';
import transistorTech from './transistorTech/en.js';

export default {
  fetTypes,
  transistorTech,
  meta: {
    code: 'en',
    name: 'English (UK)',
    nativeName: 'English',
    dir: 'ltr',
    flag: '\u{1F1EC}\u{1F1E7}'
  },
  header: {
    title: 'Learning Semiconductor Physics',
    subtitle: 'Educational Simulator - Disseminating Science and Advanced Physics',
    visitors: 'Visitors'
  },
  footer: {
    model: 'Physical model: parabolic band approximation, complete ionisation of dopants above freeze-out temperature, non-degenerate semiconductor. Varshni formula for Eg(T). SI constants.',
    nonprofit: 'Non-profit project',
    partOf: 'Part of the',
    network: 'Basicão da Eletrônica network of sites',
    copyright: 'Educational CC BY-SA 4.0 · React + SVG + KaTeX'
  },
  menu: {
    categories: {
      learning: '📚 Learning',
      fundamentals: '🔬 Fundamentals',
      bandStructure: '⚛️ Band Structure',
      quantumStatistics: '📊 Quantum Statistics',
      devices: '⚡ Devices',
      reference: '📐 Reference'
    },
    items: {
      objectives: '🎯 Study Roadmap',
      conceptsQ: '📖 Question Concepts',
      questions: '❓ Questions',
      glossary: '📚 Glossary',
      overview: 'Overview',
      lattice: 'Crystal Lattice',
      'crystal-structures': '💎 Crystal Structures',
      atomband: 'Atoms → Bands',
      allowed: 'Allowed/Forbidden Bands',
      kp: 'Kronig-Penney',
      mis: 'Metal × Insulator × Semiconductor',
      kspace: 'k-Space (Si × GaAs)',
      effmass: 'Effective Mass',
      particles: 'Electron × Hole',
      fermi: 'Fermi-Dirac & MB',
      'fermi-edu': '📊 Fermi-Dirac Educational',
      dos: 'Density of States',
      'dos-edu': '📊 DOS Educational',
      arrhenius: 'n(T) Arrhenius',
      junction: '⚡ PN Junction',
      transistorTech: '🔬 Transistor Technologies',
      fetTypes: '🧪 FET Transistor Types',
      czochralski: '🔬 Growth Methods',
      perovskites: '☀️ 2D Perovskites',
      exercises: '📝 Exercises',
      periodic: '⚛️ Periodic Table',
      about: '👤 About',
      'support-us': '💖 Support Us',
      community: '🤝 Collaborate on GitHub',
      community_title: 'Join the GitHub Discussions forum — a GitHub account is required to collaborate'
    }
  },
  controlPanel: {
    title: '⚙️ System Parameters'
  },
  controls: {
    material: 'Material',
    dopingType: 'Doping Type',
    intrinsic: 'Intrinsic',
    ntype: 'n-Type (P)',
    ptype: 'p-Type (B)',
    temperature: 'Temperature',
    donorConcentration: 'N_D (Phosphorus)',
    acceptorConcentration: 'N_A (Boron)',
    manualFermi: 'Set E_F manually (eV)'
  },
  carrierPanel: {
    title: 'Calculated numerical values',
    material: 'Material',
    hint: 'Note that {formula} is maintained (mass action law) regardless of doping, as long as the semiconductor remains non-degenerate (E_F at least 3kT from band edges).'
  },
  common: {
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    close: 'Close',
    loading: 'Loading...',
    error: 'Error',
    search: 'Search',
    more: 'More',
    less: 'Less',
    showMore: 'Show more',
    showLess: 'Show less',
    goTo: 'Go to'
  },
  graphs: {
    title: 'Graph',
    details: 'Details',
    formula: 'Formula',
    description: 'Description',
    concepts: 'Concepts',
    symbols: 'Symbols',
    symbol: 'Symbol',
    showDetails: 'Show Details',
    hideDetails: 'Hide Details',
    replayAnimation: 'Replay Animation',
    PhotonEnergyGraph: 'Photon Energy',
    HeisenbergUncertaintyGraph: 'Heisenberg Uncertainty',
    DensityOfStatesGraph: 'Density of States',
    BandStructureGraph: 'Band Structure'
  },
  learningObjectives: {
    title: 'Study Roadmap — 8 competencies to develop',
    intro: 'After exploring this system, you should be able to discuss each of the items below. Use the buttons to go directly to the tab that demonstrates each concept.',
    selfAssessment: 'Self-assessment:',
    selfAssessmentBody: 'try to formulate aloud a 2-3 sentence answer for each item before consulting the tab. If you can explain all of them, you have mastered the fundamentals of band theory in semiconductors.',
    items: {
      q1: {
        title: 'Discuss allowed and forbidden bands, qualitatively and rigorously (Kronig-Penney)',
        hints: [
          'Qualitative: bring atoms closer in the "Atoms → Bands" panel and see how the levels split.',
          'Rigorous: on the "Kronig-Penney" tab vary P and see the equation P·sin(αa)/(αa) + cos(αa) = cos(ka) generate bands where |LHS| ≤ 1.',
          'In "Allowed/Forbidden Bands" observe the full crystal structure with core bands, VB, gap and CB.'
        ]
      },
      q2: {
        title: 'Discuss the splitting of energy levels in Silicon',
        hints: [
          'Move the slider r from 1 (isolated atoms) to 0 (crystal). The 3s and 3p levels split first.',
          'Increase N to see that with 10²³ atoms the splitting is virtually continuous.',
          'The gap E_g ≈ 1.12 eV emerges between the top of the band originating from 3s and the base of the CB originating from 3p.'
        ]
      },
      q3: {
        title: 'Define effective mass from the E×k diagram and its meaning for motion',
        hints: [
          '1/m* = (1/ℏ²)(d²E/dk²): the inverse of band curvature at the extremum.',
          'In "Effective Mass" apply a force F and see the free particle (m₀) and the crystal one (m*) accelerate differently.',
          'In "k-Space" switch between Si and GaAs: GaAs has m*_n = 0.067 m₀ → much "lighter" and faster electrons.'
        ]
      },
      q4: {
        title: 'Discuss the concept of a hole',
        hints: [
          'In "Electron × Hole": charge +q, effective mass m*_p > 0, lives at the top of the VB.',
          'The hole obeys F = m*_p · a with charge +q because the mass is defined by m*_p = −ℏ²/(d²E/dk²) with d²E/dk² < 0 at the top of the VB.',
          'In the "Crystal Lattice" p-type view, observe the empty state in the bond missing an electron when boron replaces Si.'
        ]
      },
      q5: {
        title: 'Discuss characteristics of direct vs indirect gaps',
        hints: [
          'In "k-Space" switch the material:',
          '• GaAs (direct gap, Γ): CB minimum and VB maximum at the same k. Radiative transition by photon alone → good for LEDs and lasers.',
          '• Si/Ge (indirect gap): CB minimum shifted in k. Transition requires photon + phonon → inefficient light emission.'
        ]
      },
      q6: {
        title: 'Differentiate metal × insulator × semiconductor by energy bands',
        hints: [
          'In "Metal × Insulator × Semiconductor":',
          '• Metal: E_F inside an allowed band → empty states immediately accessible.',
          '• Semiconductor: small gap (~1 eV), σ ↑ with T (thermal excitation generates carriers).',
          '• Insulator: large gap (>5 eV), σ negligible even at 300 K.'
        ]
      },
      q7: {
        title: 'Define and compute the density of states function g(E)',
        hints: [
          'Model: 3D infinite well ⇒ E = ℏ²π²(n_x²+n_y²+n_z²)/(2mL²).',
          'In "Density of States" the QuantumWell3D panel shows states as discrete points in k-space; increase the Fermi sphere radius and compare the discrete count with the continuous prediction.',
          'Result: g(E) = (1/2π²)(2m*/ℏ²)^(3/2) √(E−E_c) for the CB.'
        ]
      },
      q8: {
        title: 'Understand the Fermi-Dirac distribution and the Fermi energy',
        hints: [
          'f(E) = 1 / [1 + exp((E−E_F)/k_BT)] gives the probability that a state of energy E is occupied.',
          'At T = 0 K: f is a perfect step at E_F. At T > 0: smooth transition of width ~ k_BT.',
          'E_F is the chemical potential of electrons. In a metal it lies within the band; in an intrinsic semiconductor it lies near the midgap.',
          'For |E − E_F| ≫ k_BT, f(E) ≈ exp(−(E−E_F)/k_BT) — Maxwell-Boltzmann limit.'
        ]
      }
    }
  },
  questions: {
    title: '❓ Questions — self-assessment',
    modeOne: '📇 One at a time',
    modeAll: '📋 All',
    stats: {
      pending: 'pending',
      reset: '♻️ Reset',
      resetTitle: 'Reset everything'
    },
    progress: 'Question {current} of {total}',
    nav: {
      previous: '← Previous',
      next: 'Next →'
    },
    card: {
      prompt1: '1. Try to formulate your answer mentally in 30 seconds.',
      prompt2: '2. List the main points you would include.',
      prompt3: '3. When ready, click below to check.',
      show: '👁️ Show answer',
      hide: '🔁 Hide',
      modelAnswer: 'Model answer:',
      keyPoints: 'Key points:',
      demos: 'Demonstrations:',
      score: 'How did you do?',
      scoreOk: '✅ Got it right',
      scoreNo: '❌ Wrong / partial'
    },
    usage: {
      title: 'How to use:',
      body: 'try to formulate the answer before revealing. Use self-assessment to identify weak points. Review the concept in the tab'
    }
  },
  about: {
    title: '👤 About',
    tabs: {
      author: '👤 Author',
      bibliography: '📚 Bibliography'
    },
    section: {
      about: 'About the project',
      author: 'Author',
      contribute: 'Contribute — feedback and suggestions via Pull Request',
      repository: 'Repository'
    },
    project: {
      p1body: 'This project aims to facilitate learning of Semiconductor Physics and will be continuously expanded as my own studies progress. It was built using Claude Opus 4.7 as a pair-programming partner, with SWE-1.6 for minor adjustments, based on my readings of the book Semiconductor Physics and Devices by Donald A. Neamen, complemented by the Modular Series on Solid State Devices (Robert F. Pierret et al.).',
      p2body: 'This is a non-profit project that is part of the Basicão da Eletrônica network of sites, dedicated to disseminating electronics knowledge in an accessible and free way.'
    },
    authorInfo: {
      name: 'Name:',
      email: 'E-mail:',
      whatsapp: 'WhatsApp:',
      community: 'WhatsApp Community — Semiconductor Physics:',
      joinGroup: 'Join the group',
      linkedin: 'LinkedIn:',
      github: 'GitHub:',
      twitter: 'X (Twitter):'
    },
    pr: {
      heading: '🎯 Key message:',
      body: 'the best way to criticise, suggest, correct or improve this project is by opening a Pull Request. Your contribution is always welcome, be it a comma in an explanation or a whole chapter of new visualisations. Even if the PR is not accepted exactly as-is, it opens a valuable discussion that usually evolves into something incorporated into the project.',
      openPR: '🚀 Open Pull Request',
      guide: '📖 Contribution Guide (CONTRIBUTING.md)',
      openIssue: '🐛 Open Issue'
    },
    windsurf: {
      heading: '🌊 Use Windsurf — the project is already prepared',
      p1: 'I strongly recommend Windsurf as the editor for contributing. The project contains coding rules in .windsurf/rules/ that the editor applies automatically: logging pattern (PDCL), markdown formatting, component structure — all already configured. There are also ready-made workflows in .windsurf/workflows/ (e.g. /pdcl) that automate common tasks. The Cascade agent understands the PDCL methodology (Plan, Do, Check, Loop) adopted here and naturally guides new implementations within that flow.',
      p2: 'If you prefer VS Code, Cursor or another editor, everything works — just observe the rules described in .windsurf/rules/ manually.'
    },
    hook: {
      heading: '⚙️ pre-commit Hook — standardised documentation automatically',
      body: 'There is an automatic script at scripts/markdown_history_manager.py, activated by .git/hooks/pre-commit. At every commit involving .md files, it detects author and date, and adds an entry in the Change History following the standard defined in .windsurf/rules/documentacao.md.',
      useAlways: 'Always use it — it is what keeps documentation traceable and standardised.'
    },
    biblio: {
      heading: 'Recommended bibliography',
      intro: 'Organised list with {count} titles. The first two are the main references used in building this system; the rest complement band theory, devices and solid-state physics. Each item links to Amazon (search or direct product).',
      mainRefs: '📌 Main references of the project',
      supplementary: '📚 Supplementary bibliography',
      amazonBtn: '🛒 Amazon',
      amazonTitle: 'Buy/search on Amazon',
      note: 'Note:',
      noteBody: 'some links go to a specific product page when available on Amazon Brazil; others lead to the search by title/author, returning the closest available edition. Old editions may be out of print — also look at second-hand bookshops, university libraries and platforms such as Z-Library, IEEE Xplore and Google Books.'
    }
  },
  glossary: {
    title: '📚 Glossary',
    searchPlaceholder: 'Search term or definition...',
    noResults: 'No term found',
    categories: {
      all: 'All',
      physics: 'Physics',
      materials: 'Materials',
      devices: 'Devices',
      technology: 'Technology'
    }
  },
  support: {
    title: '💖 Support Us',
    tabs: {
      about: '👤 About',
      donation: '💰 Donations'
    },
    about: {
      title: 'About the Project',
      p1: 'This project is a non-profit educational initiative aimed at disseminating knowledge about semiconductor physics in an accessible and free way.',
      p2: 'Developing and maintaining this platform requires time, resources, and dedication. Your contribution helps keep the project active and expand its content.',
      p3: 'All donations are used to cover hosting costs, development of new features, and continuous improvement of the system.',
      highlight: 'Together, we can make education in physics and engineering more accessible for everyone!',
      howToHelp: 'How you can help:',
      codeContribution: 'Contribute code through Pull Requests on GitHub',
      documentation: 'Improve documentation and translations',
      translation: 'Translate content to other languages',
      reporting: 'Report bugs and suggest improvements',
      financial: 'Make a financial donation to support the project'
    },
    donation: {
      title: 'Make a Donation',
      intro: 'Choose the contribution method you prefer. Any amount is welcome and makes a difference!',
      pixScan: 'Scan the QR Code',
      pixKey: 'PIX Key',
      pixNote: 'Use the key above or scan the QR Code with your banking app',
      crypto: 'Cryptocurrencies',
      copy: 'Copy',
      viewExplorer: 'View on explorer',
      disclaimer: 'Important Notice',
      disclaimerText: 'Donations are voluntary and non-refundable. By making a donation, you are supporting a non-profit educational project. Contact us if you have questions.'
    },
    wallet: {
      title: 'Donate via Wallet',
      connectDescription: 'Connect your crypto wallet (MetaMask, WalletConnect, etc.) to make a direct donation.',
      connecting: 'Connecting...',
      connectButton: '🦊 Connect MetaMask',
      wallet: 'Wallet',
      network: 'Network',
      ethereumMainnet: 'Ethereum Mainnet',
      sepoliaTestnet: 'Sepolia Testnet',
      chainId: 'Chain ID',
      switchNetwork: 'Switch to Ethereum Mainnet',
      crypto: 'Cryptocurrency',
      addressOnly: 'Address only',
      amount: 'Amount',
      suggestedAmounts: 'Suggested amounts',
      donateButton: '💖 Donate Now',
      processing: 'Processing...',
      transactionSent: 'Transaction sent',
      addressDescription: 'For {{crypto}} donations, use the address below:',
      disconnect: 'Disconnect',
      copy: 'Copy'
    }
  }
};
