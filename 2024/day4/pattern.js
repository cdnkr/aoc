const FLIP_SYMBOLS = {
  M: 'S',
  S: 'M',
};

const DIRECTIONS = [
  [1, 1],
  [1, -1],
];

const CONFIG = {
  scrollDelay: 500,
  searchDelay: 100,
  checkDelay: 20,
  viewportScrollFraction: 2, // Divide viewport by this for scroll amount
};

let isScrolling = false;

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

async function patternSearch(data) {
  const rows = data.split('\n');
  let totalCount = 0;
  for (let row = 1; row < rows.length - 1; row++) {
    outerLoop2: for (let col = 1; col < rows[0].length - 1; col++) {
      await sleep(CONFIG.searchDelay);
      
      const currentCell = UI.getCell(row, col);
      UI.highlightCell(currentCell);
      await handleScroll(currentCell);

      if (rows[row][col] === 'A') {
        let els = [];
        const startEl = document.getElementById(`${row}-${col}`);
        for (const [dr, dc] of DIRECTIONS) {
          const firstChar = rows[row + dr][col + dc];
          const firstCharEl = document.getElementById(`${row + dr}-${col + dc}`);
          UI.highlightCell(firstCharEl);
          await sleep(CONFIG.checkDelay);
          
          if (firstChar !== 'M' && firstChar !== 'S') {
            continue outerLoop2;
          }

          const secondChar = rows[row - dr][col - dc];
          const secondCharEl = document.getElementById(`${row - dr}-${col - dc}`);
          UI.highlightCell(secondCharEl);
          await sleep(CONFIG.checkDelay);
          
          if (secondChar !== FLIP_SYMBOLS[firstChar]) {
            continue outerLoop2;
          }

          els.push(startEl, firstCharEl, secondCharEl);
        }

        await UI.markMatch(els);
        totalCount++;
        UI.updateTotalCount(totalCount);
      }
    }
  }
  return totalCount;
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
    patternSearch(input);
  });
}

main(); 