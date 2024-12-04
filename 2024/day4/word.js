const WORD = "XMAS";

const DIRECTIONS = [
  [0, 1],
  [1, 1],
  [1, 0],
  [1, -1],
  [0, -1],
  [-1, -1],
  [-1, 0],
  [-1, 1],
];

// Configuration object
const CONFIG = {
  scrollDelay: 500,
  searchDelay: 100,
  checkDelay: 20,
  viewportScrollFraction: 2, // Divide viewport by this for scroll amount
};

let isScrolling = false;

// UI Helper Functions
const UI = {
  highlightCell: (element, intensity = "20") => {
    element?.classList.add(`text-white/${intensity}`);
  },

  markMatch: async (elements) => {
    for (const el of elements) {
      el.classList.add("glow", "font-bold");
      await sleep(CONFIG.checkDelay);
    }
  },

  updateTotalCount: (count) => {
    document.getElementById("totalCount").innerHTML = count;
  },

  getCell: (row, col) => document.getElementById(`${row}-${col}`),
};

// Scrolling Logic
async function handleScroll(element) {
  if (!element || isScrolling) return;

  const rect = element.getBoundingClientRect();
  const { innerWidth: viewportWidth, innerHeight: viewportHeight } = window;

  if (rect.right > viewportWidth) {
    isScrolling = true;
    window.scrollBy({
      left: viewportWidth / CONFIG.viewportScrollFraction,
      behavior: 'smooth'
    });
  } else if (rect.left < 0) {
    isScrolling = true;
    window.scrollTo({
      left: 0,
      behavior: 'smooth'
    });
  } else if (rect.bottom > viewportHeight) {
    isScrolling = true;
    window.scrollBy({
      top: viewportHeight / CONFIG.viewportScrollFraction,
      behavior: 'smooth'
    });
  }

  if (isScrolling) {
    await sleep(CONFIG.scrollDelay);
    isScrolling = false;
  }
}

// Search Logic
async function checkDirection(grid, startRow, startCol, direction, word) {
  const [dr, dc] = direction;
  const checkEls = [UI.getCell(startRow, startCol)];
  
  let row = startRow + dr;
  let col = startCol + dc;

  for (const symbol of word.slice(1)) {
    const cell = UI.getCell(row, col);
    UI.highlightCell(cell);
    await sleep(CONFIG.checkDelay);

    if (grid[row]?.[col] !== symbol) return null;
    
    checkEls.push(cell);
    row += dr;
    col += dc;
  }

  return checkEls;
}

async function wordSearch(data, word) {
  const grid = data.split("\n");
  let totalCount = 0;

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      await sleep(CONFIG.searchDelay);
      
      const currentCell = UI.getCell(row, col);
      UI.highlightCell(currentCell);
      await handleScroll(currentCell);

      if (grid[row][col] === word[0]) {
        for (const direction of DIRECTIONS) {
          const matchedCells = await checkDirection(grid, row, col, direction, word);
          if (matchedCells) {
            await UI.markMatch(matchedCells);
            totalCount++;
            UI.updateTotalCount(totalCount);
          }
        }
      }
    }
  }

  return totalCount;
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function init(data) {
  const inputEl = document.getElementById("input");

  const rows = data.split("\n");

  for (let row = 0; row < rows.length; row++) {
    let rowEl = document.createElement("div");
    rowEl.classList.add("flex", "gap-1");
    inputEl.appendChild(rowEl);
    for (let col = 0; col < rows[0].length; col++) {
      const charEl = document.createElement("div");
      charEl.id = `${row}-${col}`;
      charEl.classList.add(
        "text-base",
        "text-white/10",
        "text-center",
        "w-8",
        "h-8",
        "transition-all",
        "duration-300",
        "ease-in-out",
        "shrink-0"
      );
      charEl.innerHTML = rows[row][col];
      rowEl.appendChild(charEl);
    }
  }
}

async function main() {
  const startEl = document.getElementById("start");
  const totalCount = document.getElementById("totalCount");
  const totalCountLabel = document.getElementById("totalCountLabel");

  init(input);

  startEl.addEventListener("click", () => {
    startEl.classList.add("hidden");
    totalCountLabel.classList.remove("hidden");
    totalCount.classList.remove("hidden");
    wordSearch(input, WORD);
  });
}

main();
