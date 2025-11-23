// src/components/background/SpaceBackground.jsx
// warp triggers background zoom + restored tooltip hover + navigate 연동
import React, { useEffect, useRef } from "react";
import "./SpaceBackground.css";

export default function SpaceBackground({ navigate }) {
  const spaceRef = useRef(null);
  const sceneRef = useRef(null);
  const smallLayerRef = useRef(null);
  const bigLayerRef = useRef(null);
  const tooltipRef = useRef(null);
  const warpLayerRef = useRef(null);
  const zoomLayerRef = useRef(null);

  const emitterTimerRef = useRef(null);
  const emitterEndTimerRef = useRef(null);

  // ✅ 리사이즈 디바운싱용 타이머
  const resizeTimerRef = useRef(null);

  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

  const showTooltip = (x, y, html) => {
    const tip = tooltipRef.current,
      spaceEl = spaceRef.current;
    if (!tip || !spaceEl) return;
    tip.innerHTML = html;
    tip.classList.add("show");
    requestAnimationFrame(() => {
      const W = spaceEl.clientWidth || window.innerWidth;
      const H = spaceEl.clientHeight || window.innerHeight;
      const maxLeft = W - (tip.offsetWidth || 0) - 8;
      const maxTop = H - (tip.offsetHeight || 0) - 8;
      tip.style.left = clamp(x + 28, 8, maxLeft) + "px";
      tip.style.top = clamp(y - 10, 8, maxTop) + "px";
    });
  };

  const hideTooltip = () => {
    const t = tooltipRef.current;
    if (t) t.classList.remove("show");
  };

  const distanceToEdgeFrom = (angleRad, W, H, x0, y0) => {
    const dx = Math.cos(angleRad),
      dy = Math.sin(angleRad);
    const tVals = [];
    if (dx !== 0) {
      const tx1 = (0 - x0) / dx;
      if (tx1 > 0) tVals.push(tx1);
      const tx2 = (W - x0) / dx;
      if (tx2 > 0) tVals.push(tx2);
    }
    if (dy !== 0) {
      const ty1 = (0 - y0) / dy;
      if (ty1 > 0) tVals.push(ty1);
      const ty2 = (H - y0) / dy;
      if (ty2 > 0) tVals.push(ty2);
    }
    const t = Math.min(...tVals);
    return Number.isFinite(t) ? t : Math.hypot(W, H);
  };

  // ===== warp effect =====
  const startWarp = () => {
    const spaceEl = spaceRef.current,
      warpLayer = warpLayerRef.current;
    if (!spaceEl || !warpLayer) return;
    stopWarp();

    // 배경(scene)에 확대 애니메이션 적용
    const scene = sceneRef.current;
    if (scene) scene.classList.add("scene-zooming");

    const W = spaceEl.clientWidth,
      H = spaceEl.clientHeight;
    const cx = W / 2,
      cy = H / 2;
    const Rmin = Math.min(W, H) * 0.1;
    const band = Math.min(W, H) * 0.08;

    const EMIT_BATCH = 20,
      EMIT_EVERY_MS = 140,
      MAX_EMIT_MS = 2000,
      OVERSHOOT = 200;

    const emitBatch = () => {
      for (let i = 0; i < EMIT_BATCH; i++) {
        const span = document.createElement("span");
        span.className = "streak";
        const angleDeg = Math.random() * 360;
        const angleRad = (angleDeg * Math.PI) / 180;
        const rStart = Rmin + Math.random() * band;
        const x0 = cx + Math.cos(angleRad) * rStart;
        const y0 = cy + Math.sin(angleRad) * rStart;
        const reach = distanceToEdgeFrom(angleRad, W, H, x0, y0) + OVERSHOOT;
        const dur = 1500 + Math.random() * 800;
        const delay = Math.random() * 80;
        span.style.setProperty("--angle", angleDeg + "deg");
        span.style.setProperty("--len", reach.toFixed(2) + "px");
        span.style.setProperty("--dur", Math.round(dur) + "ms");
        span.style.setProperty("--delay", Math.round(delay) + "ms");
        span.style.backgroundImage =
          "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) 30%, rgba(255,255,255,0) 100%)";
        span.style.left = x0 + "px";
        span.style.top = y0 + "px";
        warpLayer.appendChild(span);
        setTimeout(() => span.remove(), Math.round(delay + dur + 60));
      }
    };
    emitBatch();
    emitterTimerRef.current = setInterval(emitBatch, EMIT_EVERY_MS);
    emitterEndTimerRef.current = setTimeout(() => {
      stopWarp();
      if (scene) scene.classList.remove("scene-zooming");
    }, MAX_EMIT_MS);
  };

  const stopWarp = () => {
    if (emitterTimerRef.current) clearInterval(emitterTimerRef.current);
    if (emitterEndTimerRef.current) clearTimeout(emitterEndTimerRef.current);
    emitterTimerRef.current = emitterEndTimerRef.current = null;
    if (warpLayerRef.current) warpLayerRef.current.textContent = "";
  };

  // ===== big star click logic (애니메이션 + navigate) =====
  const zoomFromStar = (starEl, targetPath) => {
    const spaceEl = spaceRef.current;
    const zoomLayer = zoomLayerRef.current;
    if (!starEl || !spaceEl || !zoomLayer) return;

    const sRect = starEl.getBoundingClientRect();
    const pRect = spaceEl.getBoundingClientRect();
    const cx = sRect.left - pRect.left + sRect.width / 2;
    const cy = sRect.top - pRect.top + sRect.height / 2;
    const centerX = pRect.width / 2;
    const centerY = pRect.height / 2;
    const dx = centerX - cx;
    const dy = centerY - cy;

    starEl.style.setProperty("--mx", `${dx}px`);
    starEl.style.setProperty("--my", `${dy}px`);

    // 중앙으로 이동
    starEl.style.transition = "transform 0.8s ease-out";
    starEl.style.transform = `translate(${dx}px, ${dy}px) scale(1)`;

    setTimeout(() => {
      starEl.classList.add("zooming");
      startWarp(); // warp + background zoom

      const burst = document.createElement("div");
      burst.className = "zoom-burst";
      burst.style.left = centerX + "px";
      burst.style.top = centerY + "px";
      zoomLayer.appendChild(burst);
      setTimeout(() => burst.remove(), 700);

      setTimeout(() => {
        starEl.style.transition = "transform 0.8s ease-in";
        starEl.style.transform = "translate(0,0) scale(1)";
        starEl.style.setProperty("--mx", `0px`);
        starEl.style.setProperty("--my", `0px`);
        setTimeout(() => {
          starEl.classList.remove("zooming");
          starEl.style.transition = "";

          // ⭐ 애니메이션 끝난 뒤 페이지 이동
          if (navigate && targetPath) {
            navigate(targetPath);
          }
        }, 800);
      }, 1800);
    }, 800);
  };

  // ===== star generation =====
  const generateStars = () => {
    const spaceEl = spaceRef.current;
    const smallLayer = smallLayerRef.current;
    const bigLayer = bigLayerRef.current;
    if (!spaceEl || !smallLayer || !bigLayer) return;

    // 기존 별/큰별 초기화
    smallLayer.textContent = "";
    bigLayer.textContent = "";
    hideTooltip();

    const W = spaceEl.clientWidth || window.innerWidth;
    const H = spaceEl.clientHeight || window.innerHeight;

    const SMALL_COUNT = 200;
    const BIG_MIN_DIST = 120;
    const EDGE_MARGIN = 200;
    const bigStars = [];

    const isFar = (x, y, list, min) =>
      list.every((p) => Math.hypot(x - p.x, y - p.y) > min);

    const marginX = Math.min(EDGE_MARGIN, Math.max(0, W / 4));
    const marginY = Math.min(EDGE_MARGIN, Math.max(0, H / 4));
    const minX = marginX,
      maxX = Math.max(minX + 1, W - marginX);
    const minY = marginY,
      maxY = Math.max(minY + 1, H - marginY);

    // ⭐ 큰 별들 정보 (데이터 → UI)
    const starConfigs = [
      {
        title: "Introduction",
        desc: "This star contains an introduction to the website.",
        path: "/introduction",
      },
      {
        title: "Tutorial",
        desc: "Here, you can find the tutorial for this site.",
        path: "/tutorial",
      },
      {
        title: "Example",
        desc: "This star shows examples of how to use it.",
        path: "/example",
      },
      {
        title: "Inquiries",
        desc: "This star is for inquiries.",
        path: "/inquiries",
      },
    ];

    // 🔹 starConfigs.forEach 로 큰 별 생성 (map과 같은 개념)
    starConfigs.forEach((cfg) => {
      let x = 0,
        y = 0,
        tries = 0;
      do {
        x = minX + Math.random() * (maxX - minX);
        y = minY + Math.random() * (maxY - minY);
      } while (!isFar(x, y, bigStars, BIG_MIN_DIST) && tries++ < 400);

      const s = document.createElement("div");
      s.className = "big-star";
      s.style.left = x + "px";
      s.style.top = y + "px";

      const html = `<div class="tip-title">${cfg.title}</div><div class="tip-desc">${cfg.desc}</div>`;
      s.addEventListener("mouseenter", (e) =>
        showTooltip(e.clientX, e.clientY, html)
      );
      s.addEventListener("mousemove", (e) =>
        showTooltip(e.clientX, e.clientY, html)
      );
      s.addEventListener("mouseleave", hideTooltip);

      // 클릭 시: 이 별의 path로 이동
      s.addEventListener("click", () => zoomFromStar(s, cfg.path));

      bigLayer.appendChild(s);
      bigStars.push({ x, y });
    });

    // 작은 별들
    for (let i = 0; i < SMALL_COUNT; i++) {
      const s = document.createElement("div");
      s.className = "small-star";
      const size = 1.5 + Math.random() * 3;
      const opacity = 0.5 + Math.random() * 0.5;
      s.style.width = size + "px";
      s.style.height = size + "px";
      s.style.opacity = opacity;
      s.style.left = Math.random() * W + "px";
      s.style.top = Math.random() * H + "px";
      smallLayer.appendChild(s);
    }
  };

  useEffect(() => {
    // 최초 한 번 생성
    generateStars();

    // ✅ 창 크기 변경 시 별 다시 생성 (비율 맞춰 재배치)
    const handleResize = () => {
      if (resizeTimerRef.current) {
        clearTimeout(resizeTimerRef.current);
      }
      // 디바운스: 리사이즈 멈춘 뒤 200ms 후에 재생성
      resizeTimerRef.current = setTimeout(() => {
        generateStars();
      }, 200);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      stopWarp();
      window.removeEventListener("resize", handleResize);
      if (resizeTimerRef.current) {
        clearTimeout(resizeTimerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={spaceRef} className="space" aria-hidden="true">
      <div ref={sceneRef} className="scene">
        <div className="nebula" />
        <div ref={smallLayerRef} className="layer small-layer" />
        <div ref={bigLayerRef} className="layer big-layer" />
      </div>
      <div ref={warpLayerRef} className="warp-layer" />
      <div ref={zoomLayerRef} className="zoom-layer" />
      <div ref={tooltipRef} className="tooltip" />
    </div>
  );
}
