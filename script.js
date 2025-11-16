const nftData = [
  {
    id: 1,
    name: "Ghost Rider #1",
    image: "👻",
    rarity: "Rare",
    traits: ["Red Eyes", "Fire Chain"],
    wldPrice: 2.5,
    approved: true,
    owner: null,
  },
  {
    id: 2,
    name: "Flaming Skull #42",
    image: "💀",
    rarity: "Epic",
    traits: ["Glowing", "Ancient"],
    wldPrice: 5.0,
    approved: true,
    owner: null,
  },
  {
    id: 3,
    name: "Alien Punk #88",
    image: "👽",
    rarity: "Legendary",
    traits: ["Holographic", "Rare"],
    wldPrice: 10.0,
    approved: true,
    owner: null,
  },
  {
    id: 4,
    name: "Glitch Spirit #7",
    image: "✨",
    rarity: "Rare",
    traits: ["Shimmer", "Ethereal"],
    wldPrice: 3.2,
    approved: true,
    owner: null,
  },
  {
    id: 5,
    name: "Ether Phantom #13",
    image: "🕸️",
    rarity: "Common",
    traits: ["Void Silk", "Night Pulse"],
    wldPrice: 0.9,
    approved: true,
    owner: "0x32f1e35291967c07ec02aa81394dbf87d1d25e52",
  },
];

const WLD_TO_GHOSTART_RATE = 0.000009;

const galleryEl = document.querySelector("#gallery");
const chipEls = document.querySelectorAll(".chip");
const statEls = document.querySelectorAll("[data-stat]");
const converterForm = document.querySelector("#converter");
const modalEl = document.querySelector("#modal");
const modalLog = document.querySelector("#modal-log");
const modalClose = document.querySelector(".modal__close");
const verifyButton = document.querySelector("[data-action='verify']");
const yearEl = document.querySelector("#year");
const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");
const navLinks = document.querySelectorAll(".nav a");

const renderStats = () => {
  const approvedNfts = nftData.filter((nft) => nft.approved);
  const uniqueOwners = new Set(
    approvedNfts.filter((nft) => nft.owner).map((nft) => nft.owner.toLowerCase()),
  );
  const totalValue = approvedNfts.reduce((sum, nft) => sum + nft.wldPrice, 0);

  statEls.forEach((el) => {
    switch (el.dataset.stat) {
      case "nfts":
        el.textContent = approvedNfts.length;
        break;
      case "value":
        el.textContent = totalValue.toFixed(2);
        break;
      case "owners":
        el.textContent = uniqueOwners.size;
        break;
      default:
        break;
    }
  });
};

const renderGallery = (filter = "all") => {
  if (!galleryEl) return;

  const items =
    filter === "all"
      ? nftData
      : nftData.filter((nft) => nft.rarity.toLowerCase() === filter.toLowerCase());

  if (!items.length) {
    galleryEl.innerHTML =
      '<p class="hint">No NFTs found for this rarity tier. Check back after the next drop.</p>';
    return;
  }

  galleryEl.innerHTML = items
    .map(
      (nft) => `
      <article class="nft-card">
        <span class="nft-card__badge">${nft.rarity}</span>
        <div class="nft-card__emoji">${nft.image}</div>
        <h4 class="nft-card__title">${nft.name}</h4>
        <p class="hint">Price: ${nft.wldPrice} WLD</p>
        <div class="nft-card__traits">
          ${nft.traits.map((trait) => `<span>${trait}</span>`).join("")}
        </div>
        <p class="hint">
          ${nft.owner ? `Owned by ${shortenAddress(nft.owner)}` : "Available for claim"}
        </p>
        <button class="btn btn--ghost btn--wide" data-nft="${nft.id}">View Listing</button>
      </article>
    `,
    )
    .join("");
};

const shortenAddress = (address) => {
  if (!address) return "";
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
};

chipEls.forEach((chip) => {
  chip.addEventListener("click", () => {
    chipEls.forEach((c) => c.classList.remove("chip--active"));
    chip.classList.add("chip--active");
    renderGallery(chip.dataset.filter);
  });
});

if (converterForm) {
  converterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const wldInput = converterForm.elements.namedItem("wld");
    const ghostInput = converterForm.elements.namedItem("ghost");

    const wldValue = Number.parseFloat(wldInput.value) || 0;
    const ghostValue = wldValue * WLD_TO_GHOSTART_RATE;
    ghostInput.value = ghostValue.toFixed(9);
  });
}

if (verifyButton) {
  verifyButton.addEventListener("click", () => {
    const payload = {
      action: "GHOSTART",
      walletAddress: "0x0000000000000000000000000000000000000000",
      merkle_root: "0x1f38b57f3bdf96f05ea62fa68814871bf0ca8ce4dbe073d8497d5a6b0a53e5e0",
      nullifier_hash: "0x0339861e70a9bdb6b01a88c7534a3332db915d3d06511b79a5724221a6958fbe",
      proof: "0x063942fd7ea1616f17787d2e3374c1826ebcd2d41d2394...",
      verification_level: "orb",
      timestamp: new Date().toISOString(),
    };

    modalLog.textContent = JSON.stringify(payload, null, 2);
    modalEl.classList.add("modal--open");
  });
}

modalClose?.addEventListener("click", () => {
  modalEl.classList.remove("modal--open");
});

modalEl?.addEventListener("click", (event) => {
  if (event.target === modalEl) {
    modalEl.classList.remove("modal--open");
  }
});

document.addEventListener("click", (event) => {
  if (!(event.target instanceof HTMLElement)) return;

  if (event.target.matches("[data-nft]")) {
    const nft = nftData.find((item) => item.id === Number(event.target.dataset.nft));
    if (!nft) return;

    const payload = {
      id: nft.id,
      name: nft.name,
      wldPrice: nft.wldPrice,
      rarity: nft.rarity,
      traits: nft.traits,
      listed: true,
      owner: nft.owner ?? "Unlisted",
      creatorRoyalty: "10%",
      contractAddress: "0x32f1e35291967c07ec02aa81394dbf87d1d25e52",
    };

    modalLog.textContent = JSON.stringify(payload, null, 2);
    modalEl.classList.add("modal--open");
  }
});

const init = () => {
  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!expanded));
      nav.classList.toggle("nav--open", !expanded);
      document.body.classList.toggle("menu-open", !expanded);
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navToggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("nav--open");
        document.body.classList.remove("menu-open");
      });
    });
  }

  renderStats();
  renderGallery();

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  const ghostInput = converterForm?.elements.namedItem("ghost");
  if (ghostInput) {
    ghostInput.value = (1 * WLD_TO_GHOSTART_RATE).toFixed(9);
  }
};

init();

