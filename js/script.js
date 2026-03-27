const elm_board = document.querySelector('.board');
const capturePanel = {
  title: document.querySelector('.capture-panel__title'),
  subtitle: document.querySelector('.capture-panel__subtitle'),
  collection: document.querySelector('.capture-panel__collection'),
  image: document.querySelector('.capture-panel__image'),
  status: document.querySelector('.capture-panel__status'),
  summary: document.querySelector('.capture-panel__summary'),
  link: document.querySelector('.capture-panel__link')
};

const game = new Chess();

const availableRulers = [
  {
    displayName: "Idris Alooma",
    fileName: "idris_alooma.jpg",
    wikiTitle: "Idris_Alooma"
  },
  {
    displayName: "King Arthur",
    fileName: "arthur.jpg",
    wikiTitle: "King_Arthur"
  },
  {
    displayName: "Gustavus Adolphus",
    fileName: "gustavus_adolphus_of_sweden.jpg",
    wikiTitle: "Gustavus_Adolphus"
  },
  {
    displayName: "Moshoeshoe I",
    fileName: "moshoeshoe_i.jpg",
    wikiTitle: "Moshoeshoe_I"
  },
  {
    displayName: "Shaka Zulu",
    fileName: "shaka_zulu.jpg",
    wikiTitle: "Shaka"
  },
  {
    displayName: "Louis XIV",
    fileName: "louisxiv.jpg",
    wikiTitle: "Louis_XIV"
  },
  {
    displayName: "William the Conqueror",
    fileName: "william_the_conqueror.jpg",
    wikiTitle: "William_the_Conqueror"
  },
  {
    displayName: "Philip II of Spain",
    fileName: "philip_ii_of_spain.jpg",
    wikiTitle: "Philip_II_of_Spain"
  },
  {
    displayName: "Mansa Musa",
    fileName: "mansa_musa.jpg",
    wikiTitle: "Mansa_Musa"
  },
  {
    displayName: "Peter the Great",
    fileName: "peter_the_great_of_russia.jpg",
    wikiTitle: "Peter_the_Great"
  },
  {
    displayName: "Charlemagne",
    fileName: "charlemagne.jpg",
    wikiTitle: "Charlemagne"
  },
  {
    displayName: "Richard I of England",
    fileName: "richard_i_of_england.jpg",
    wikiTitle: "Richard_I_of_England"
  },
  {
    displayName: "Gilgamesh",
    fileName: "gilgamesh.jpg",
    wikiTitle: "Gilgamesh"
  },
  {
    displayName: "Glele",
    fileName: "glele.jpg",
    wikiTitle: "Glele"
  },
  {
    displayName: "Henry VIII",
    fileName: "henryviii.jpg",
    wikiTitle: "Henry_VIII"
  },
  {
    displayName: "Askia Muhammad I",
    fileName: "askia_muhammad_i.jpg",
    wikiTitle: "Askia_Muhammad_I"
  },
  {
    displayName: "Behanzin",
    fileName: "behanzin.jpg",
    wikiTitle: "Behanzin"
  },
  {
    displayName: "Frederick II of Prussia",
    fileName: "frederick_ii_of_prussia.jpg",
    wikiTitle: "Frederick_the_Great"
  },
  {
    displayName: "Sundiata Keita",
    fileName: "sundiata_keita.png",
    wikiTitle: "Sundiata_Keita"
  },
  {
    displayName: "Ghezo",
    fileName: "ghezo.jpg",
    wikiTitle: "Ghezo"
  },
  {
    displayName: "Menelik II",
    fileName: "menelik_ii.png",
    wikiTitle: "Menelik_II"
  },
  {
    displayName: "George III",
    fileName: "george_iii_of_great_britain.jpg",
    wikiTitle: "George_III"
  }
];

const pieceTypes = [
  "white-pawn",
  "white-bishop",
  "white-knight",
  "white-rook",
  "white-queen",
  "white-king",
  "black-pawn",
  "black-bishop",
  "black-knight",
  "black-rook",
  "black-queen",
  "black-king"
];
const pieceCodeToName = {
  p: "pawn",
  b: "bishop",
  n: "knight",
  r: "rook",
  q: "queen",
  k: "king"
};
const assignedRulersByPieceType = new Map();
const collectedRulersByPieceType = new Map();
let captureRequestId = 0;
let selectedCollectedPieceType = null;

function toPieceUrl(fileName) {
  return `url("${new URL(`../images/pieces/${fileName}`, import.meta.url).href}")`;
}

function toPieceSrc(fileName) {
  return new URL(`../images/pieces/${fileName}`, import.meta.url).href;
}

function shuffle(items) {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }

  return copy;
}

function applyRandomPieceImages() {
  const root = document.documentElement;
  const shuffledRulers = shuffle(availableRulers);

  if (shuffledRulers.length < pieceTypes.length) {
    throw new Error("Not enough unique images to assign one per piece type.");
  }

  pieceTypes.forEach((pieceName, index) => {
    const ruler = shuffledRulers[index];
    assignedRulersByPieceType.set(pieceName, ruler);
    root.style.setProperty(`--${pieceName}-image`, toPieceUrl(ruler.fileName));
  });
}

applyRandomPieceImages();

function updateBoard() {
  ground.set({
    fen: game.fen(),
    turnColor: game.turn() === 'w' ? 'white' : 'black',
    movable: { dests: toDests(game) }
  });
}

function formatPieceLabel(pieceType) {
  const [, pieceName] = pieceType.split("-");
  return pieceName;
}

function resetCapturePanelForLoad(ruler, pieceType) {
  const pieceName = formatPieceLabel(pieceType);

  capturePanel.title.textContent = ruler.displayName;
  capturePanel.subtitle.textContent = `Your ${pieceName} card is loading from Wikipedia.`;
  capturePanel.image.src = toPieceSrc(ruler.fileName);
  capturePanel.image.alt = `${ruler.displayName} portrait`;
  capturePanel.image.hidden = false;
  capturePanel.status.textContent = "Loading Wikipedia entry...";
  capturePanel.status.hidden = false;
  capturePanel.summary.hidden = true;
  capturePanel.link.hidden = true;
}

function updateSelectedCard() {
  const cards = capturePanel.collection.querySelectorAll(".capture-card");
  cards.forEach((card) => {
    const isSelected = card.dataset.pieceType === selectedCollectedPieceType;

    card.classList.toggle("is-selected", isSelected);
    card.setAttribute("aria-pressed", String(isSelected));
  });
}

function renderCollectedRulerCard(pieceType, ruler) {
  const card = document.createElement("button");
  const pieceName = formatPieceLabel(pieceType);

  card.type = "button";
  card.className = "capture-card";
  card.dataset.pieceType = pieceType;
  card.innerHTML = `
    <img class="capture-card__image" src="${toPieceSrc(ruler.fileName)}" alt="${ruler.displayName} portrait" />
    <span class="capture-card__name">${ruler.displayName}</span>
    <span class="capture-card__piece">${pieceName}</span>
  `;
  card.addEventListener("click", () => {
    showCollectedRuler(pieceType);
  });

  capturePanel.collection.append(card);
}

function collectRuler(move) {
  if (!move.captured || move.color !== "w") {
    return;
  }

  const capturedColor = "black";
  const capturedPieceType = `${capturedColor}-${pieceCodeToName[move.captured]}`;
  const ruler = assignedRulersByPieceType.get(capturedPieceType);

  if (!ruler || collectedRulersByPieceType.has(capturedPieceType)) {
    return;
  }

  collectedRulersByPieceType.set(capturedPieceType, ruler);
  renderCollectedRulerCard(capturedPieceType, ruler);
  showCollectedRuler(capturedPieceType);
}

async function showCollectedRuler(pieceType) {
  const ruler = collectedRulersByPieceType.get(pieceType);

  if (!ruler) {
    return;
  }

  selectedCollectedPieceType = pieceType;
  updateSelectedCard();
  captureRequestId += 1;
  const requestId = captureRequestId;
  resetCapturePanelForLoad(ruler, pieceType);

  try {
    const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(ruler.wikiTitle)}`);
    if (!response.ok) {
      throw new Error(`Wikipedia returned ${response.status}`);
    }

    const summary = await response.json();
    if (requestId !== captureRequestId) {
      return;
    }

    capturePanel.title.textContent = summary.title || ruler.displayName;
    capturePanel.subtitle.textContent = summary.description || `Collected ${pieceType.replace("-", " ")}`;
    capturePanel.summary.textContent = summary.extract || "No summary was available for this ruler.";
    capturePanel.summary.hidden = false;
    capturePanel.status.hidden = true;
    capturePanel.link.href = summary.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${ruler.wikiTitle}`;
    capturePanel.link.hidden = false;
  } catch (error) {
    if (requestId !== captureRequestId) {
      return;
    }

    capturePanel.subtitle.textContent = `Collected ${pieceType.replace("-", " ")}`;
    capturePanel.summary.textContent = "Wikipedia could not be loaded right now, but the ruler image remains available.";
    capturePanel.summary.hidden = false;
    capturePanel.status.hidden = true;
    capturePanel.link.href = `https://en.wikipedia.org/wiki/${ruler.wikiTitle}`;
    capturePanel.link.hidden = false;
  }
}

function toDests(chess) {
  const dests = new Map();
  SQUARES.forEach(s => {
    const moves = chess.moves({ square: s, verbose: true });
    if (moves.length) dests.set(s, moves.map(m => m.to));
  });
  return dests;
}

function computerMove() {
  const moves = game.moves();
  if (moves.length > 0) {
    const move = game.move(moves[Math.floor(Math.random() * moves.length)]);
    updateBoard();
    collectRuler(move);
  }
}

const ground = Chessground(elm_board, {
  fen: game.fen(),
  turnColor: 'white',
  movable: {
    free: false,
    color: 'white',
    dests: toDests(game),
    events: {
      after: (orig, dest) => {
        const move = game.move({ from: orig, to: dest, promotion: 'q' });
        if (move) {
          updateBoard();
          collectRuler(move);

          if (!game.game_over()) {
            setTimeout(computerMove, 500);
          }
        }
      }
    }
  },
  viewOnly: false
});
