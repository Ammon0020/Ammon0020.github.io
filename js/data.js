// Projects configuration:
// - publish: defaults to true. Set 'publish: false' to hide WIP drafts from the site.
// - showOnHome: defaults to false. Set 'showOnHome: 1', 'showOnHome: 2', etc. to order them on the homepage, or 'showOnHome: true' to add project in order listed in this document.
window.siteData = {
  projects: [
    {
      title: "FLIGHT SIM CONTROLLER",
      category: "HARDWARE",
      image: "", // Leave empty to use placeholder
      summary: "Custom PCB design & fabrication for precision flight simulation input",
      status: "IN PROGRESS",
      date: "2026.04",
      contentFile: "projects/flight-sim-controller.md",
      showOnHome: 5
    },
    {
      title: "CHURCH BROADCAST SYSTEM",
      category: "IT",
      image: "",
      summary: "IP Camera for live streaming services with little human interaction.",
      status: "DEPLOYED",
      date: "2026.02",
      contentFile: "projects/church-broadcast.md",
      showOnHome: 2
    },
    {
      title: "CUSTOM ROUTER BUILD",
      category: "IT",
      image: "",
      summary: "Bespoke network infrastructure — routing, firewalling, traffic shaping",
      status: "OPERATIONAL",
      date: "2026.06",
      contentFile: "projects/custom-router.md",
      showOnHome: 1
    },
    {
      title: "Custom 3D Printer",
      category: "3D",
      image: "",
      summary: "Custom quality CoreXY 3D printer build with tool changing capability.",
      status: "IN PROGRESS",
      date: "2022.01",
      contentFile: "projects/custom-3d-printer.md"
    },
    {
      title: "WILDLIFE SERIES",
      category: "PHOTO",
      image: "",
      summary: "Capturing the diverse and often overlooked fauna native to the Greater Omaha and Council Bluffs area.",
      status: "IN PROGRESS",
      date: "2026.09",
      contentFile: "projects/wildlife-series.md"
    },
    {
      title: "WORKSTATION BUILD",
      category: "HARDWARE",
      image: "",
      summary: "High-performance custom workstation for rendering and creative work",
      status: "COMPLETE",
      date: "2026.03",
      contentFile: "projects/workstation-build.md",
      showOnHome: 4
    },
    {
      title: "HOMELAB DEVOPS CLUSTER",
      category: "IT",
      image: "",
      summary: "Multi-node Proxmox and Kubernetes cluster for CKA & DCA prep, network observability, and infrastructure services",
      status: "ACTIVE",
      date: "2026.09",
      contentFile: "projects/homelab-cluster.md",
      showOnHome: 3
    }
  ],
  // Gallery configuration:
  // - publish: defaults to true. Set 'publish: false' to hide photo from the site.
  // - The first 2 published photos appear on the homepage grid alongside the archive tile.
  gallery: [
    {
      title: "Take Off",
      image: "images/gallery/Take Off.jpg",
      caption: "Take Off — High-altitude contrail catching the last golden rays of dusk above silhouetted trees."
    },
    {
      title: "Forest Walk",
      image: "images/gallery/Forest Walk.jpg",
      caption: "Forest Walk — Winding boardwalk disappearing into the deep, quiet canopy."
    },
    {
      title: "A New Chapter",
      image: "images/gallery/A New Chapter.jpg",
      caption: "A New Chapter — Celebratory exit surrounded by family, friends, and shared joy."
    },
    {
      title: "Golden Overgrowth",
      image: "images/gallery/Golden Overgrowth.jpg",
      caption: "Golden Overgrowth — Natural greenery framing golden glittery accents in an ethereal portrait study."
    },
    {
      title: "The Overlook",
      image: "images/gallery/The Overlook.jpg",
      caption: "The Overlook — An intimate embrace suspended over the mist-filled canyon expanse."
    },
    {
      title: "Summer Woods",
      image: "images/gallery/Summer Woods.jpg",
      caption: "Summer Woods — Soft woodland light and delicate bokeh framing a contemplative portrait."
    },
    {
      title: "Hidden in the Meadow",
      image: "images/gallery/Hidden in the Meadow.jpg",
      caption: "Hidden in the Meadow — Quiet embrace secluded within tall summer grasses."
    },
    {
      title: "The Ring",
      image: "images/gallery/The Ring.jpg",
      caption: "The Ring — Macro focus capturing the promise of forever against an intimate embrace."
    },
    {
      title: "The Weight of Thought",
      image: "images/gallery/The Weight of Thought.jpg",
      caption: "The Weight of Thought — Moody, reflective portrait framed against rustic weathered wood."
    }
  ]
};
