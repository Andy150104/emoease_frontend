// File: src/components/ScrollSmootherWrapper.tsx
"use client";
import React, { ReactNode, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

interface Props {
  children: ReactNode;
}

const ScrollSmootherWrapper: React.FC<Props> = ({ children }) => {
  useLayoutEffect(() => {
    const smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1,
      effects: true,
      normalizeScroll: true
    });

    // timeline cho cả in và out
    gsap.utils.toArray<HTMLElement>(".feature-card").forEach((card, i) => {
      const dir = i % 2 === 0 ? -1 : 1;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: "top bottom", // khi card dưới đáy viewport
          end: "bottom top", // tới khi card trên cùng viewport
          scrub: true,
        },
      });
      // 1st tween: bay vào
      tl.fromTo(
        card,
        { x: dir * 200, opacity: 0 },
        { x: 0, opacity: 1, ease: "power2.out", duration: 0.8 },
      )
        // 2nd tween: bay ra
        .to(
          card,
          { x: -dir * 200, opacity: 0, ease: "power2.in", duration: 0.8 },
          // băt đầu tween thứ 2 ngay sau tween thứ nhất
          "+=0",
        );
    });
    gsap.utils.toArray<HTMLElement>(".hero-badge").forEach((badge, i) => {
      const dir = (i % 2 === 0 ? -1 : 1) * 1; // chẵn/trái, lẻ/phải
      gsap.timeline({
        scrollTrigger: {
          trigger: badge,
          start: "top 95%",   // khi badge gần chạm đáy khung nhìn
          end: "bottom 5%",  // tới khi badge gần chạm đỉnh
          scrub: true,
        },
      })
      .fromTo(
        badge,
        { x: dir * 250, autoAlpha: 1 },
        { x: 0, autoAlpha: 1, opacity: 1, ease: "power2.out", duration: 0.6 }
      )
      .to(
        badge,
        { x: -dir * 250, autoAlpha: 1, opacity: 0, ease: "power2.in", duration: 0.6 },
        "+=0"
      );
    });

gsap.utils.toArray<HTMLElement>(".gsap-zoom").forEach((el) => {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: el,
      start: "top 80%",    // khi text vừa chạm 80% chiều cao viewport
      end: "bottom 20%",   // khi text chạm 20% đỉnh viewport
      scrub: true,
    },
  });

  // 1) zoom in: scale 0.5 → 1
  tl.fromTo(
    el,
    { scale: 0.5, autoAlpha: 0 },
    { scale: 1, autoAlpha: 1, ease: "power2.out", duration: 0.6 }
  )
  // 2) zoom out: scale 1 → 0.5
  .to(
    el,
    { scale: 0.5, autoAlpha: 0, ease: "power2.in", duration: 0.6 },
    "+=0"
  );
});

    return () => {
      smoother.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return <>{children}</>;
};

export default ScrollSmootherWrapper;
