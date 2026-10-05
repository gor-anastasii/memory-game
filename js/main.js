import { CARDS } from "./cards.js";
import { el } from "./dom.js";
import { openModal, closeModal } from "./modal.js";
import { loadResults, saveResult, formatDate } from "./leaderboard.js";

const MISMATCH_DELAY = 1000;
const TOTAL_PAIRS = CARDS.length;

const state = {
  deck: [],
  opened: [],
  moves: 0,
  pairs: 0,
  locked: false,
  timer: null,
};
const ui = {};

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function createCard(data, index) {
  const face = data.image
    ? el("img", {
        className: "card__img",
        attrs: { src: data.image, alt: data.label },
      })
    : el("span", {
        className: "card__ph",
        text: data.placeholder,
        attrs: { "aria-hidden": "true" },
      });
  const front = el(
    "div",
    {
      className: "card__face card__front",
      attrs: { style: `--hue:${data.hue}` },
    },
    [face],
  );
  const back = el("div", { className: "card__face card__back" }, [
    el("span", { className: "card__mark", text: "?" }),
  ]);
  const btn = el(
    "button",
    {
      className: "card",
      attrs: {
        type: "button",
        "aria-label": "Закрытая карточка",
        style: `--i:${index}`,
      },
      on: { click: () => onCardClick(btn) },
    },
    [el("div", { className: "card__inner" }, [back, front])],
  );
  btn.dataset.id = data.id;
  btn.dataset.label = data.label;
  return btn;
}

function setFlipped(btn, flipped) {
  btn.classList.toggle("flipped", flipped);
  btn.setAttribute(
    "aria-label",
    flipped ? btn.dataset.label : "Закрытая карточка",
  );
}

function updateStats() {
  ui.moves.textContent = state.moves;
  ui.pairs.textContent = `${state.pairs} из ${TOTAL_PAIRS}`;
  ui.progress.style.width = `${(state.pairs / TOTAL_PAIRS) * 100}%`;
}

function bump(node) {
  node.classList.remove("bump");
  void node.offsetWidth;
  node.classList.add("bump");
}

function startGame() {
  clearTimeout(state.timer);
  state.timer = null;
  Object.assign(state, { opened: [], moves: 0, pairs: 0, locked: false });
  state.deck = shuffle([...CARDS, ...CARDS]);
  ui.board.replaceChildren(...state.deck.map(createCard));
  ui.board.classList.remove("won");
  updateStats();
}

function onCardClick(btn) {
  if (
    state.locked ||
    btn.classList.contains("flipped") ||
    btn.classList.contains("matched")
  )
    return;
  setFlipped(btn, true);
  state.opened.push(btn);
  if (state.opened.length < 2) return;

  const [a, b] = state.opened;
  state.moves++;
  bump(ui.moves);
  if (a.dataset.id === b.dataset.id) {
    state.opened = [];
    state.pairs++;
    [a, b].forEach((c) => setTimeout(() => c.classList.add("matched"), 350));
    updateStats();
    bump(ui.pairs);
    if (state.pairs === TOTAL_PAIRS) finishGame();
  } else {
    state.locked = true;
    [a, b].forEach((c) => c.classList.add("wrong"));
    state.timer = setTimeout(() => {
      [a, b].forEach((c) => {
        c.classList.remove("wrong");
        setFlipped(c, false);
      });
      state.opened = [];
      state.locked = false;
      state.timer = null;
    }, MISMATCH_DELAY);
    updateStats();
  }
}

function finishGame() {
  state.locked = true;
  saveResult(state.moves);
  ui.board.classList.add("won");
  setTimeout(() => {
    confetti();
    openModal({
      title: "Победа! 🎉",
      content: el("p", { className: "modal__text" }, [
        document.createTextNode("Все пары найдены за "),
        el("strong", { text: `${state.moves}` }),
        document.createTextNode(" ходов."),
      ]),
      actions: [
        el("button", {
          className: "btn btn--primary",
          text: "Новая игра",
          on: { click: newGame },
        }),
        el("button", {
          className: "btn",
          text: "Закрыть",
          on: { click: closeModal },
        }),
      ],
    });
  }, 900);
}

function newGame() {
  closeModal();
  startGame();
}

function showLeaderboard() {
  const results = loadResults().slice(0, 10);
  let content;
  if (!results.length) {
    content = el("p", {
      className: "modal__text",
      text: "Пока нет результатов",
    });
  } else {
    const head = el(
      "tr",
      {},
      ["Место", "Ходы", "Дата"].map((t) => el("th", { text: t })),
    );
    const rows = results.map((r, i) =>
      el(
        "tr",
        {},
        [String(i + 1), String(r.moves), formatDate(r.timestamp)].map((t) =>
          el("td", { text: t }),
        ),
      ),
    );
    content = el("div", { className: "table-wrap" }, [
      el("table", { className: "table" }, [
        el("thead", {}, [head]),
        el("tbody", {}, rows),
      ]),
    ]);
  }
  openModal({
    title: "Таблица лидеров",
    content,
    actions: [
      el("button", {
        className: "btn",
        text: "Закрыть",
        on: { click: closeModal },
      }),
    ],
  });
}

function confetti() {
  const layer = el("div", {
    className: "confetti",
    attrs: { "aria-hidden": "true" },
  });
  for (let i = 0; i < 60; i++) {
    layer.append(
      el("i", {
        attrs: {
          style: `--x:${Math.random() * 100}vw;--d:${Math.random() * 0.6}s;--t:${2 + Math.random() * 2}s;--h:${Math.random() * 360};--r:${Math.random() * 720 - 360}deg`,
        },
      }),
    );
  }
  document.body.append(layer);
  setTimeout(() => layer.remove(), 5000);
}

function stat(label, valueNode) {
  return el("div", { className: "stat" }, [
    el("span", { className: "stat__label", text: label }),
    valueNode,
  ]);
}

function buildApp() {
  ui.moves = el("span", { className: "stat__value", text: "0" });
  ui.pairs = el("span", {
    className: "stat__value",
    text: `0 из ${TOTAL_PAIRS}`,
  });
  ui.progress = el("div", { className: "progress__bar" });
  ui.board = el("main", { className: "board" });

  const header = el("header", { className: "header" }, [
    el("h1", { className: "logo", text: "Memory" }),
    el("div", { className: "header__btns" }, [
      el("button", {
        className: "btn btn--primary",
        text: "✦ Новая игра",
        on: { click: newGame },
      }),
      el("button", {
        className: "btn",
        text: "🏆 Таблица лидеров",
        on: { click: showLeaderboard },
      }),
    ]),
  ]);
  const stats = el("section", { className: "stats" }, [
    stat("Ходы", ui.moves),
    stat("Найдено пар", ui.pairs),
    el("div", { className: "progress" }, [ui.progress]),
  ]);
  const bg = el("div", { className: "bg", attrs: { "aria-hidden": "true" } }, [
    el("span", { className: "blob blob--1" }),
    el("span", { className: "blob blob--2" }),
    el("span", { className: "blob blob--3" }),
  ]);
  const app = el("div", { className: "app" }, [
    header,
    stats,
    el("div", { className: "board-area" }, [ui.board]),
  ]);
  document.body.prepend(bg, app);
}

buildApp();
startGame();
