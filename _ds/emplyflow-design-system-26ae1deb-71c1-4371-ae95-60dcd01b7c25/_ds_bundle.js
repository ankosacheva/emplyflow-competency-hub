/* @ds-bundle: {"format":3,"namespace":"EmplyFlowDesignSystem_26ae1d","components":[],"sourceHashes":{"ui_kits/website/components-core.jsx":"afc733f4cee7","ui_kits/website/components-sections.jsx":"7b0c62b0cfb7"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.EmplyFlowDesignSystem_26ae1d = window.EmplyFlowDesignSystem_26ae1d || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// ui_kits/website/components-core.jsx
try { (() => {
/* =============================================================
   EmplyFlow Website UI Kit — single-file component library
   ============================================================= */

const {
  useState
} = React;

/* ---------- shared primitives ---------- */

const Sparkle = ({
  size = 18,
  color = "#ffffff",
  style
}) => /*#__PURE__*/React.createElement("svg", {
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: color,
  style: style,
  "aria-hidden": "true"
}, /*#__PURE__*/React.createElement("path", {
  d: "M12 0L13.5 10.5 24 12 13.5 13.5 12 24 10.5 13.5 0 12 10.5 10.5z"
}));
const Button = ({
  variant = "orange",
  children,
  leadingIcon,
  onClick
}) => {
  const base = {
    fontFamily: "Manrope, sans-serif",
    fontSize: 16,
    fontWeight: 500,
    border: 0,
    borderRadius: 999,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 12,
    transition: "filter 150ms, transform 120ms"
  };
  const variants = {
    orange: {
      background: "#ffb777",
      color: "#151515",
      padding: "18px 36px"
    },
    indigo: {
      background: "#4a3bff",
      color: "#fff",
      padding: "12px 36px 12px 14px"
    },
    ghost: {
      background: "transparent",
      color: "#fff",
      padding: "14px 28px",
      boxShadow: "inset 0 0 0 1px rgba(217,214,255,.32)"
    },
    light: {
      background: "#fff",
      color: "#050230",
      padding: "12px 24px",
      fontSize: 15
    }
  };
  return /*#__PURE__*/React.createElement("button", {
    style: {
      ...base,
      ...variants[variant]
    },
    onMouseDown: e => e.currentTarget.style.transform = "scale(0.98)",
    onMouseUp: e => e.currentTarget.style.transform = "scale(1.0)",
    onMouseLeave: e => e.currentTarget.style.transform = "scale(1.0)",
    onMouseEnter: e => e.currentTarget.style.filter = "brightness(1.06)",
    onMouseOut: e => e.currentTarget.style.filter = "brightness(1.0)",
    onClick: onClick
  }, leadingIcon, /*#__PURE__*/React.createElement("span", null, children));
};
const ArrowIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2
}) => /*#__PURE__*/React.createElement("svg", {
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: color,
  strokeWidth: strokeWidth,
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("path", {
  d: "M7 17 17 7"
}), /*#__PURE__*/React.createElement("path", {
  d: "M7 7h10v10"
}));
const RoundArrowIcon = () => /*#__PURE__*/React.createElement("span", {
  style: {
    width: 36,
    height: 36,
    borderRadius: 999,
    background: "#fff",
    color: "#4a3bff",
    display: "grid",
    placeItems: "center"
  }
}, /*#__PURE__*/React.createElement("svg", {
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("path", {
  d: "M5 12h14"
}), /*#__PURE__*/React.createElement("path", {
  d: "M13 6l6 6-6 6"
})));
const DashedCallout = ({
  children,
  size = "lg"
}) => {
  const sizes = {
    lg: {
      padding: "14px 30px",
      fontSize: 44,
      borderRadius: 999,
      borderWidth: 2
    },
    md: {
      padding: "10px 22px",
      fontSize: 22,
      borderRadius: 999,
      borderWidth: 2
    },
    block: {
      padding: "18px 22px",
      fontSize: 17,
      borderRadius: 18,
      borderWidth: 1.5
    }
  };
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-block",
      border: `${sizes[size].borderWidth}px dashed #ffb8e2`,
      padding: sizes[size].padding,
      borderRadius: sizes[size].borderRadius,
      fontSize: sizes[size].fontSize,
      fontWeight: 700,
      letterSpacing: "-0.02em",
      color: "#fff",
      lineHeight: 1.1
    }
  }, children);
};

/* Decorative hand-drawn arrow scribble for the dark canvas */
const HandArrow = ({
  style
}) => /*#__PURE__*/React.createElement("svg", {
  width: "80",
  height: "100",
  viewBox: "0 0 80 100",
  fill: "none",
  style: style,
  "aria-hidden": "true"
}, /*#__PURE__*/React.createElement("path", {
  d: "M65 8 C 60 15, 55 24, 48 30 C 40 36, 30 38, 18 42",
  stroke: "rgba(217,214,255,0.22)",
  strokeWidth: "1.4",
  strokeLinecap: "round",
  strokeDasharray: "0",
  fill: "none"
}), /*#__PURE__*/React.createElement("path", {
  d: "M14 38 L 18 42 L 16 48",
  stroke: "rgba(217,214,255,0.22)",
  strokeWidth: "1.4",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  fill: "none"
}));

/* Iridescent sparkle placeholder for the hero 3D objects */
const IridescentStar = ({
  size = 140,
  style
}) => /*#__PURE__*/React.createElement("svg", {
  width: size,
  height: size,
  viewBox: "0 0 100 100",
  style: {
    filter: "drop-shadow(0 0 24px rgba(74,59,255,.55))",
    ...style
  },
  "aria-hidden": "true"
}, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
  id: "iri-grad",
  x1: "0",
  y1: "0",
  x2: "1",
  y2: "1"
}, /*#__PURE__*/React.createElement("stop", {
  offset: "0%",
  stopColor: "#ffb8e2"
}), /*#__PURE__*/React.createElement("stop", {
  offset: "35%",
  stopColor: "#cec8ff"
}), /*#__PURE__*/React.createElement("stop", {
  offset: "70%",
  stopColor: "#4a3bff"
}), /*#__PURE__*/React.createElement("stop", {
  offset: "100%",
  stopColor: "#050230"
})), /*#__PURE__*/React.createElement("linearGradient", {
  id: "iri-hi",
  x1: "0",
  y1: "0",
  x2: "0",
  y2: "1"
}, /*#__PURE__*/React.createElement("stop", {
  offset: "0%",
  stopColor: "rgba(255,255,255,0.7)"
}), /*#__PURE__*/React.createElement("stop", {
  offset: "100%",
  stopColor: "rgba(255,255,255,0)"
}))), /*#__PURE__*/React.createElement("path", {
  fill: "url(#iri-grad)",
  d: "M50 4 L54 44 L96 50 L54 56 L50 96 L46 56 L4 50 L46 44 Z"
}), /*#__PURE__*/React.createElement("path", {
  fill: "url(#iri-hi)",
  opacity: "0.5",
  d: "M50 4 L54 44 L96 50 L60 48 Z"
}));

/* ---------- Nav ---------- */
const Nav = () => /*#__PURE__*/React.createElement("header", {
  style: {
    position: "sticky",
    top: 0,
    zIndex: 50,
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    background: "rgba(5,2,48,0.55)",
    borderBottom: "1px solid rgba(217,214,255,0.06)"
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    maxWidth: 1440,
    margin: "0 auto",
    padding: "18px 40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 24
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "Manrope, sans-serif",
    fontWeight: 700,
    fontSize: 22,
    letterSpacing: "-0.02em",
    color: "#fff"
  }
}, "\u042D\u043C\u043F\u043B\u0438\u0424\u043B\u043E\u0443"), /*#__PURE__*/React.createElement("nav", {
  style: {
    display: "flex",
    gap: 28
  }
}, ["Модули системы", "О нас", "Внедрение/Интеграция", "Проекты", "Новости", "Контакты"].map(l => /*#__PURE__*/React.createElement("a", {
  key: l,
  href: "#",
  style: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 14,
    textDecoration: "none",
    whiteSpace: "nowrap"
  }
}, l))), /*#__PURE__*/React.createElement(Button, {
  variant: "orange"
}, "\u041F\u043E\u043B\u0443\u0447\u0438\u0442\u044C \u0434\u043E\u0441\u0442\u0443\u043F")));

/* ---------- Hero ---------- */
const Hero = () => /*#__PURE__*/React.createElement("section", {
  style: {
    position: "relative",
    padding: "80px 40px 120px",
    overflow: "hidden"
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    position: "absolute",
    inset: 0,
    background: "radial-gradient(40% 60% at 8% 30%, rgba(74,59,255,0.35) 0%, transparent 60%)",
    pointerEvents: "none"
  }
}), /*#__PURE__*/React.createElement(HandArrow, {
  style: {
    position: "absolute",
    top: 80,
    left: 320,
    opacity: 0.7
  }
}), /*#__PURE__*/React.createElement(HandArrow, {
  style: {
    position: "absolute",
    top: 260,
    left: 580,
    transform: "rotate(180deg)",
    opacity: 0.6
  }
}), /*#__PURE__*/React.createElement(IridescentStar, {
  size: 220,
  style: {
    position: "absolute",
    left: 220,
    bottom: 60,
    transform: "rotate(-8deg)"
  }
}), /*#__PURE__*/React.createElement(IridescentStar, {
  size: 150,
  style: {
    position: "absolute",
    right: 220,
    top: 380
  }
}), /*#__PURE__*/React.createElement("div", {
  style: {
    maxWidth: 1440,
    margin: "0 auto",
    position: "relative"
  }
}, /*#__PURE__*/React.createElement("h1", {
  style: {
    fontFamily: "Manrope, sans-serif",
    fontWeight: 700,
    fontSize: 84,
    lineHeight: 1.02,
    letterSpacing: "-0.03em",
    color: "#fff",
    maxWidth: 1100
  }
}, "HRM-\u043F\u043B\u0430\u0442\u0444\u043E\u0440\u043C\u0430 \u0434\u043B\u044F \u043E\u0446\u0435\u043D\u043A\u0438,", /*#__PURE__*/React.createElement("br", null), "\u0446\u0435\u043B\u0435\u043F\u043E\u043B\u0430\u0433\u0430\u043D\u0438\u044F \u0438 \u043C\u043E\u0442\u0438\u0432\u0430\u0446\u0438\u0438", /*#__PURE__*/React.createElement("br", null), "\u0441\u043E\u0442\u0440\u0443\u0434\u043D\u0438\u043A\u043E\u0432 ", /*#__PURE__*/React.createElement(DashedCallout, {
  size: "lg"
}, "\u043D\u0430 \u0431\u0430\u0437\u0435 \u0418\u0418")), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    gap: 40,
    marginTop: 80,
    alignItems: "end"
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    maxWidth: 540,
    marginLeft: 260
  }
}, /*#__PURE__*/React.createElement("p", {
  style: {
    fontSize: 18,
    lineHeight: 1.5,
    color: "rgba(255,255,255,0.78)"
  }
}, "\u0425\u043E\u0442\u0438\u0442\u0435 \u0432\u044B\u0441\u0442\u0440\u043E\u0438\u0442\u044C \u043F\u0440\u043E\u0437\u0440\u0430\u0447\u043D\u044B\u0435 \u043F\u0440\u043E\u0446\u0435\u0441\u0441\u044B \u043E\u0446\u0435\u043D\u043A\u0438 \u0438 \u043F\u0440\u043E\u0434\u0432\u0438\u0436\u0435\u043D\u0438\u044F \u0441\u043E\u0442\u0440\u0443\u0434\u043D\u0438\u043A\u043E\u0432? \u0423\u0437\u043D\u0430\u0442\u044C \u0431\u043E\u043B\u044C\u0448\u0435 \u043E\u0431 \u0438\u0445 \u043F\u043E\u0442\u0435\u043D\u0446\u0438\u0430\u043B\u0435 \u0438 \u0443\u0440\u043E\u0432\u043D\u0435 \u043A\u043E\u043C\u043F\u0435\u0442\u0435\u043D\u0446\u0438\u0438? \u0418\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0439\u0442\u0435 \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E\u0441\u0442\u0438 \u043D\u0430\u0448\u0435\u0433\u043E \u0440\u0435\u0448\u0435\u043D\u0438\u044F!"), /*#__PURE__*/React.createElement("div", {
  style: {
    marginTop: 28
  }
}, /*#__PURE__*/React.createElement(Button, {
  variant: "indigo",
  leadingIcon: /*#__PURE__*/React.createElement(RoundArrowIcon, null)
}, "\u0427\u0442\u043E \u0432\u0445\u043E\u0434\u0438\u0442 \u0432 \u043F\u043B\u0430\u0442\u0444\u043E\u0440\u043C\u0443"))), /*#__PURE__*/React.createElement("div", {
  style: {
    background: "rgba(217,214,255,0.06)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(217,214,255,0.22)",
    borderRadius: 28,
    padding: "26px 28px",
    maxWidth: 280,
    color: "#fff"
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    gap: 6,
    marginBottom: 14
  }
}, /*#__PURE__*/React.createElement(Sparkle, {
  size: 20,
  color: "#ffb777"
}), /*#__PURE__*/React.createElement(Sparkle, {
  size: 14,
  color: "#ffb8e2"
})), /*#__PURE__*/React.createElement("div", {
  style: {
    fontSize: 24,
    fontWeight: 700,
    letterSpacing: "-0.02em"
  }
}, "\u041B\u0443\u0447\u0448\u0438\u0439 \u043F\u0440\u043E\u0435\u043A\u0442"), /*#__PURE__*/React.createElement("div", {
  style: {
    fontSize: 13,
    color: "rgba(255,255,255,0.62)",
    marginTop: 8,
    lineHeight: 1.4
  }
}, "\u0432 \u0441\u0444\u0435\u0440\u0435 HR \u043F\u043E \u0432\u0435\u0440\u0441\u0438\u0438 Rusbase \u0432 2024 \u0433\u043E\u0434\u0443")))));

/* ---------- Customer logos ---------- */
const CustomerLogos = () => {
  const logos = [{
    name: "Ростелеком",
    color: "#fff"
  }, {
    name: "Транспортные инновации Москвы",
    color: "#fff"
  }, {
    name: "Yandex Cloud",
    color: "#fff"
  }, {
    name: "novadial",
    color: "#fff"
  }, {
    name: "GdeTech",
    color: "#fff"
  }];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "40px 40px 60px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1440,
      margin: "0 auto",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 32,
      flexWrap: "wrap",
      opacity: 0.85
    }
  }, logos.map(l => /*#__PURE__*/React.createElement("div", {
    key: l.name,
    style: {
      color: l.color,
      fontFamily: "Manrope, sans-serif",
      fontWeight: 600,
      fontSize: 22,
      letterSpacing: "-0.02em"
    }
  }, l.name))));
};
Object.assign(window, {
  Sparkle,
  Button,
  ArrowIcon,
  RoundArrowIcon,
  DashedCallout,
  HandArrow,
  IridescentStar,
  Nav,
  Hero,
  CustomerLogos
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/components-core.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/components-sections.jsx
try { (() => {
/* =============================================================
   EmplyFlow Website — sections below the fold
   ============================================================= */

const {
  useState: useStateB
} = React;

/* ---------- Module switcher ---------- */
const MODULES = [{
  id: "pr",
  name: "Performance Review",
  headline: "Анализ эффективности сотрудников и команд",
  features: [{
    title: "Оценка результативности сотрудников (Performance Review)",
    body: "Подсчёт суммарного балла как объективной оценки по различным показателям сотрудников: от достижения квартальных целей до результатов оценки 360 и обратной связи от коллег",
    highlighted: true
  }],
  side: [{
    ic: "clock",
    title: "Автосоздание матрицы потенциала",
    body: "Удобная визуализация сотрудников для наглядного восприятия и работы с разными группами (HiPo, низкоэффективные, будущие звёзды, ключевые игроки)"
  }, {
    ic: "ai",
    title: "Глубокий анализ и сравнение",
    body: "AI-аналитика по результатам оценок, ИПР и достижениям с возможностью бенчмаркинга"
  }, {
    ic: "star",
    title: "Формирование ТОП",
    body: "Рейтинги сотрудников и команд для прозрачной мотивации"
  }]
}, {
  id: "comp",
  name: "Оценка компетенций"
}, {
  id: "goals",
  name: "Постановка и управление целями"
}, {
  id: "track",
  name: "Карьерные треки и планы развития"
}, {
  id: "tasks",
  name: "Проекты и задачи"
}, {
  id: "moti",
  name: "Нематериальная мотивация"
}];
const ModuleIcon = ({
  kind
}) => {
  const props = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#4a3bff",
    strokeWidth: 1.75,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  };
  if (kind === "clock") return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "12 7 12 12 16 14"
  }));
  if (kind === "ai") return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "3",
    width: "18",
    height: "18",
    rx: "4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9 16V8M15 16V8M9 12h6"
  }));
  if (kind === "star") return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("polygon", {
    points: "12 2 14.6 8.6 21.6 9.2 16.3 13.8 17.9 20.8 12 17 6.1 20.8 7.7 13.8 2.4 9.2 9.4 8.6"
  }));
  return null;
};
const ModuleSwitcher = () => {
  const [active, setActive] = useStateB("pr");
  const mod = MODULES.find(m => m.id === active);
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "100px 40px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1440,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "Manrope, sans-serif",
      fontWeight: 700,
      fontSize: 64,
      lineHeight: 1.05,
      letterSpacing: "-0.03em",
      color: "#fff",
      textAlign: "center",
      margin: "0 auto 60px",
      maxWidth: 1100
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#ffb8e2"
    }
  }, "\u0421\u043E\u043A\u0440\u0430\u0442\u0438\u0442\u0435 \u0432\u0440\u0435\u043C\u044F"), " \u043D\u0430 \u0440\u0443\u0442\u0438\u043D\u043D\u044B\u0435 \u0437\u0430\u0434\u0430\u0447\u0438 \u0438 \u0441\u043E\u0441\u0440\u0435\u0434\u043E\u0442\u043E\u0447\u044C\u0442\u0435\u0441\u044C \u043D\u0430 \u0441\u0442\u0440\u0430\u0442\u0435\u0433\u0438\u0438"), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#4a3bff",
      borderRadius: 40,
      padding: 20,
      display: "grid",
      gridTemplateColumns: "320px 1fr",
      gap: 20,
      minHeight: 600
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 6px 12px 16px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      color: "#fff",
      marginBottom: 28
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 28,
      height: 28,
      borderRadius: 8,
      background: "rgba(255,255,255,.18)",
      display: "grid",
      placeItems: "center"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "4",
    width: "18",
    height: "14",
    rx: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3 9h18"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 18,
      fontWeight: 600
    }
  }, "\u041C\u043E\u0434\u0443\u043B\u0438")), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: "none",
      padding: 0,
      margin: 0,
      display: "flex",
      flexDirection: "column",
      gap: 22
    }
  }, MODULES.map(m => /*#__PURE__*/React.createElement("li", {
    key: m.id
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setActive(m.id),
    style: {
      background: "transparent",
      border: 0,
      padding: 0,
      cursor: "pointer",
      textAlign: "left",
      color: m.id === active ? "#fff" : "rgba(255,255,255,0.55)",
      fontSize: 17,
      fontWeight: m.id === active ? 600 : 400,
      fontFamily: "Manrope, sans-serif"
    }
  }, m.name))))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#f3f1ff",
      borderRadius: 28,
      padding: "32px 36px",
      color: "#151515",
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-block",
      padding: "8px 18px",
      border: "1px solid rgba(21,21,21,.18)",
      borderRadius: 999,
      fontSize: 14
    }
  }, "\u041C\u043E\u0434\u0443\u043B\u044C ", mod.name), /*#__PURE__*/React.createElement(Button, {
    variant: "light"
  }, "\u0421\u043C\u043E\u0442\u0440\u0435\u0442\u044C")), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 44,
      fontWeight: 700,
      letterSpacing: "-0.025em",
      lineHeight: 1.05,
      color: "#4a3bff",
      maxWidth: 720,
      marginBottom: 32
    }
  }, mod.headline || mod.name), mod.features && /*#__PURE__*/React.createElement("div", {
    style: {
      border: "1.5px dashed #ffb8e2",
      borderRadius: 20,
      padding: "20px 22px",
      marginBottom: 28,
      maxWidth: 560
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 17,
      fontWeight: 700,
      marginBottom: 8
    }
  }, mod.features[0].title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: "rgba(21,21,21,0.7)",
      lineHeight: 1.5
    }
  }, mod.features[0].body)), mod.side && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 28
    }
  }, mod.side.map(s => /*#__PURE__*/React.createElement("div", {
    key: s.title
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      alignItems: "center",
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement(ModuleIcon, {
    kind: s.ic
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 17,
      fontWeight: 700
    }
  }, s.title)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "rgba(21,21,21,0.66)",
      lineHeight: 1.5
    }
  }, s.body)))), !mod.features && /*#__PURE__*/React.createElement("div", {
    style: {
      color: "rgba(21,21,21,0.55)",
      fontSize: 14,
      fontStyle: "italic"
    }
  }, "(\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u043C\u043E\u0434\u0443\u043B\u044F \u2014 placeholder. \u0417\u0430\u043C\u0435\u043D\u0438\u0442\u0435 \u0441\u043E\u0434\u0435\u0440\u0436\u0438\u043C\u044B\u043C \u0438\u0437 \u0438\u0441\u0445\u043E\u0434\u043D\u043E\u0433\u043E \u0441\u0430\u0439\u0442\u0430.)")))));
};

/* ---------- Stats section ---------- */
const StatsSection = () => /*#__PURE__*/React.createElement("section", {
  style: {
    padding: "80px 40px 100px"
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    maxWidth: 1440,
    margin: "0 auto"
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    display: "grid",
    gridTemplateColumns: "1fr 380px",
    gap: 60,
    alignItems: "start",
    marginBottom: 60
  }
}, /*#__PURE__*/React.createElement("h2", {
  style: {
    fontFamily: "Manrope, sans-serif",
    fontWeight: 700,
    fontSize: 140,
    lineHeight: 0.95,
    letterSpacing: "-0.04em",
    color: "#d5fff3",
    margin: 0
  }
}, "\u042D\u043C\u043F\u043B\u0438\u0424\u043B\u043E\u0443"), /*#__PURE__*/React.createElement("p", {
  style: {
    fontSize: 17,
    lineHeight: 1.5,
    color: "rgba(255,255,255,.82)",
    paddingTop: 30
  }
}, "\u041F\u043E\u043C\u043E\u0433\u0430\u0435\u043C \u0448\u0430\u0433\u0430\u0442\u044C \u0432 \u043D\u043E\u0433\u0443 \u0441\u043E \u0432\u0440\u0435\u043C\u0435\u043D\u0435\u043C \u0438 \u0443\u043F\u0440\u0430\u0432\u043B\u044F\u0442\u044C \u0441\u043E\u0431\u0441\u0442\u0432\u0435\u043D\u043D\u044B\u043C \u043F\u0435\u0440\u0441\u043E\u043D\u0430\u043B\u043E\u043C, \u0441\u043E\u0447\u0435\u0442\u0430\u044F \u0441\u043E\u0432\u0440\u0435\u043C\u0435\u043D\u043D\u044B\u0435 \u0442\u0435\u0445\u043D\u043E\u043B\u043E\u0433\u0438\u0438 AI \u0438 \u0430\u043D\u0430\u043B\u0438\u0437\u0430 \u0434\u0430\u043D\u043D\u044B\u0445 \u0441 \u0438\u043D\u0441\u0442\u0440\u0443\u043C\u0435\u043D\u0442\u0430\u043C\u0438 \u043F\u043E\u0432\u044B\u0448\u0435\u043D\u0438\u044F \u043C\u043E\u0442\u0438\u0432\u0430\u0446\u0438\u0438 \u0438 \u0432\u043E\u0432\u043B\u0435\u0447\u0451\u043D\u043D\u043E\u0441\u0442\u0438 \u0441\u043E\u0442\u0440\u0443\u0434\u043D\u0438\u043A\u043E\u0432")), /*#__PURE__*/React.createElement("p", {
  style: {
    fontSize: 22,
    lineHeight: 1.3,
    color: "#fff",
    marginBottom: 40,
    maxWidth: 480
  }
}, "\u0422\u0435\u0445\u043D\u043E\u043B\u043E\u0433\u0438\u0447\u0435\u0441\u043A\u0430\u044F \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u044F, \u0440\u0430\u0437\u0440\u0430\u0431\u0430\u0442\u044B\u0432\u0430\u044E\u0449\u0430\u044F \u0440\u0435\u0448\u0435\u043D\u0438\u044F \u0434\u043B\u044F \u043D\u0430\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0439 \u043E\u0446\u0435\u043D\u043A\u0438 \u0438 \u0440\u0430\u0437\u0432\u0438\u0442\u0438\u044F \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u0439 \u0441\u0440\u0435\u0434\u043D\u0435\u0433\u043E \u0438 \u043A\u0440\u0443\u043F\u043D\u043E\u0433\u043E \u0431\u0438\u0437\u043D\u0435\u0441\u0430"), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "grid",
    gridTemplateColumns: "1fr 1.3fr 1.2fr",
    gap: 20
  }
}, /*#__PURE__*/React.createElement(StatTile, {
  bg: "transparent",
  stroke: true,
  num: "5+",
  eyebrow: "\u0417\u0430\u043A\u0430\u0437\u0447\u0438\u043A\u043E\u0432",
  tone: "dark",
  caption: /*#__PURE__*/React.createElement(React.Fragment, null, "\u043D\u0430 \u0433\u043E\u0441\u0443\u0434\u0430\u0440\u0441\u0442\u0432\u0435\u043D\u043D\u043E\u043C", /*#__PURE__*/React.createElement("br", null), "\u0438 \u043A\u043E\u0440\u043F\u043E\u0440\u0430\u0442\u0438\u0432\u043D\u043E\u043C \u0443\u0440\u043E\u0432\u043D\u0435")
}), /*#__PURE__*/React.createElement(StatTile, {
  bg: "#ffb8e2",
  num: ">35",
  unit: "\u043C\u043B\u043D \u20BD",
  tone: "light",
  caption: "\u0432 \u0433\u043E\u0434 \u2014 \u044D\u043A\u043E\u043D\u043E\u043C\u0438\u0447\u0435\u0441\u043A\u0430\u044F \u043E\u043A\u0443\u043F\u0430\u0435\u043C\u043E\u0441\u0442\u044C \u0432\u043D\u0435\u0434\u0440\u0435\u043D\u0438\u044F \u043D\u0430\u0448\u0435\u0439 \u043F\u043B\u0430\u0442\u0444\u043E\u0440\u043C\u044B \u0434\u043B\u044F \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u0438"
}), /*#__PURE__*/React.createElement(StatTile, {
  bg: "#4a3bff",
  num: "500+",
  unit: "\u043C\u043B\u043D \u20BD",
  tone: "dark",
  caption: "\u0441\u044D\u043A\u043E\u043D\u043E\u043C\u0438\u043B\u0438 \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u044F\u043C \u043D\u0430 \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0437\u0430\u0446\u0438\u0438"
}))));
const StatTile = ({
  bg,
  num,
  unit,
  eyebrow,
  caption,
  tone,
  stroke
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    background: bg,
    borderRadius: 32,
    padding: "32px 30px",
    minHeight: 260,
    color: tone === "light" ? "#151515" : "#fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    boxShadow: stroke ? "inset 0 0 0 1px rgba(217,214,255,.12)" : "none"
  }
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
  style: {
    fontFamily: "Manrope, sans-serif",
    fontWeight: 700,
    fontSize: 96,
    lineHeight: 0.9,
    letterSpacing: "-0.04em",
    color: bg === "transparent" ? "#d5fff3" : tone === "light" ? "#151515" : "#fff"
  }
}, num), unit && /*#__PURE__*/React.createElement("span", {
  style: {
    fontSize: 12,
    fontWeight: 700,
    padding: "6px 12px",
    borderRadius: 999,
    background: tone === "light" ? "rgba(21,21,21,.08)" : "rgba(255,255,255,.18)",
    color: tone === "light" ? "#151515" : "#fff",
    marginLeft: 10,
    verticalAlign: "middle",
    textTransform: "uppercase",
    letterSpacing: ".06em"
  }
}, unit), eyebrow && /*#__PURE__*/React.createElement("div", {
  style: {
    marginTop: 14
  }
}, /*#__PURE__*/React.createElement("span", {
  style: {
    fontSize: 11,
    fontWeight: 600,
    padding: "6px 12px",
    borderRadius: 999,
    background: "rgba(255,255,255,.06)",
    color: "rgba(255,255,255,.7)",
    textTransform: "uppercase",
    letterSpacing: ".12em",
    border: "1px solid rgba(217,214,255,.22)"
  }
}, eyebrow))), /*#__PURE__*/React.createElement("div", {
  style: {
    fontSize: 13,
    lineHeight: 1.45,
    color: tone === "light" ? "rgba(21,21,21,0.7)" : "rgba(255,255,255,0.78)",
    maxWidth: 280
  }
}, caption));

/* ---------- Implementation grid ---------- */
const IMPL = [{
  num: "01",
  title: "Определение задачи и диагностика",
  bg: "#4a3bff",
  tone: "dark"
}, {
  num: "02",
  title: "Настройка платформы под структуру компании",
  bg: "#ffb777",
  tone: "light"
}, {
  num: "03",
  title: "Интеграции с привычными сервисами",
  bg: "#d5fff3",
  tone: "light"
}, {
  num: "04",
  title: "Внедрение и запуск",
  bg: "#0a0540",
  tone: "dark",
  stroke: true
}, {
  num: "05",
  title: "Сопровождение и обучение",
  bg: "#ffb8e2",
  tone: "light"
}, {
  num: "06",
  title: "Развитие и масштабирование",
  bg: "#cec8ff",
  tone: "light"
}];
const ImplementationGrid = () => /*#__PURE__*/React.createElement("section", {
  style: {
    padding: "60px 40px 120px"
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    maxWidth: 1440,
    margin: "0 auto"
  }
}, /*#__PURE__*/React.createElement("h2", {
  style: {
    fontFamily: "Manrope, sans-serif",
    fontWeight: 700,
    fontSize: 56,
    lineHeight: 1.05,
    letterSpacing: "-0.03em",
    color: "#fff",
    textAlign: "center",
    margin: "0 auto 60px",
    maxWidth: 900
  }
}, "\u0412\u043D\u0435\u0434\u0440\u044F\u0435\u043C \u043F\u043B\u0430\u0442\u0444\u043E\u0440\u043C\u0443 \u0432\xA06\xA0\u0448\u0430\u0433\u043E\u0432"), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 22
  }
}, IMPL.map(t => /*#__PURE__*/React.createElement("div", {
  key: t.num,
  style: {
    background: t.bg,
    borderRadius: 32,
    padding: 28,
    minHeight: 280,
    position: "relative",
    color: t.tone === "light" ? "#151515" : "#fff",
    boxShadow: t.stroke ? "inset 0 0 0 1px rgba(217,214,255,.10)" : "none",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    justifyContent: "flex-end"
  }
}, /*#__PURE__*/React.createElement(ArrowIcon, {
  size: 40,
  strokeWidth: 2.2,
  color: t.tone === "light" ? "#151515" : "#fff"
})), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
  style: {
    display: "inline-block",
    fontSize: 11,
    fontWeight: 700,
    padding: "6px 14px",
    borderRadius: 999,
    background: t.tone === "light" ? "rgba(21,21,21,.08)" : "rgba(255,255,255,.16)",
    marginBottom: 16
  }
}, t.num), /*#__PURE__*/React.createElement("div", {
  style: {
    fontSize: 24,
    fontWeight: 700,
    lineHeight: 1.12,
    letterSpacing: "-0.02em",
    maxWidth: 280
  }
}, t.title)))))));

/* ---------- Footer ---------- */
const Footer = () => /*#__PURE__*/React.createElement("footer", {
  style: {
    padding: "100px 40px 40px",
    background: "linear-gradient(180deg, #050230 0%, #0a0540 100%)",
    position: "relative"
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    maxWidth: 1440,
    margin: "0 auto"
  }
}, /*#__PURE__*/React.createElement("h2", {
  style: {
    fontFamily: "Manrope, sans-serif",
    fontWeight: 700,
    fontSize: 84,
    lineHeight: 1.04,
    letterSpacing: "-0.03em",
    color: "#fff",
    maxWidth: 1000,
    marginBottom: 40
  }
}, "\u0421\u0434\u0435\u043B\u0430\u0439\u0442\u0435 \u043F\u0440\u043E\u0446\u0435\u0441\u0441\u044B \u043F\u0440\u043E\u0437\u0440\u0430\u0447\u043D\u044B\u043C\u0438 \u0438\xA0\u0443\u043F\u0440\u0430\u0432\u043B\u044F\u0435\u043C\u044B\u043C\u0438"), /*#__PURE__*/React.createElement(Button, {
  variant: "indigo",
  leadingIcon: /*#__PURE__*/React.createElement(RoundArrowIcon, null)
}, "\u041F\u043E\u043B\u0443\u0447\u0438\u0442\u044C \u0434\u0435\u043C\u043E\u0434\u043E\u0441\u0442\u0443\u043F \u043A \u043F\u043B\u0430\u0442\u0444\u043E\u0440\u043C\u0435"), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 40,
    marginTop: 120,
    alignItems: "end"
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    fontSize: 26,
    color: "#fff",
    letterSpacing: "-0.01em"
  }
}, "headoffice@emplyflow.ru"), /*#__PURE__*/React.createElement("div", null), /*#__PURE__*/React.createElement("div", {
  style: {
    fontSize: 12,
    color: "rgba(255,255,255,.55)",
    lineHeight: 1.6,
    textAlign: "right"
  }
}, "\u041E\u0431\u0449\u0435\u0441\u0442\u0432\u043E \u0441 \u043E\u0433\u0440\u0430\u043D\u0438\u0447\u0435\u043D\u043D\u043E\u0439 \u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0435\u043D\u043D\u043E\u0441\u0442\u044C\u044E \xAB\u042D\u041C\u041F\u041B\u0418\u0424\u041B\u041E\u0423\xBB", /*#__PURE__*/React.createElement("br", null), "\u041E\u0413\u0420\u041D: 1237700492479", /*#__PURE__*/React.createElement("br", null), "\u0418\u041D\u041D: 7743422816", /*#__PURE__*/React.createElement("br", null), "\u041A\u041F\u041F: 773301001")), /*#__PURE__*/React.createElement("div", {
  style: {
    fontFamily: "Manrope, sans-serif",
    fontWeight: 700,
    fontSize: 140,
    lineHeight: 0.9,
    letterSpacing: "-0.04em",
    color: "#fff",
    textAlign: "right",
    marginTop: 30
  }
}, "\u042D\u043C\u043F\u043B\u0438\u0424\u043B\u043E\u0443"), /*#__PURE__*/React.createElement("div", {
  style: {
    marginTop: 40,
    paddingTop: 24,
    borderTop: "1px solid rgba(217,214,255,.10)",
    display: "flex",
    justifyContent: "space-between",
    fontSize: 12,
    color: "rgba(255,255,255,.55)"
  }
}, /*#__PURE__*/React.createElement("span", null, "\u041F\u043E\u043B\u0438\u0442\u0438\u043A\u0430 \u043A\u043E\u043D\u0444\u0438\u0434\u0435\u043D\u0446\u0438\u0430\u043B\u044C\u043D\u043E\u0441\u0442\u0438"), /*#__PURE__*/React.createElement("span", null, "\xA9 2026. \u0412\u0441\u0435 \u043F\u0440\u0430\u0432\u0430 \u0437\u0430\u0449\u0438\u0449\u0435\u043D\u044B"), /*#__PURE__*/React.createElement("span", null, "\u0421\u0430\u0439\u0442 \u0437\u0430\u043F\u0443\u0441\u0442\u0438\u043B\u0430 \u041C\u043E\u043B\u043D\u0438\u044F"))));
Object.assign(window, {
  ModuleSwitcher,
  StatsSection,
  ImplementationGrid,
  Footer
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/components-sections.jsx", error: String((e && e.message) || e) }); }

})();
