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

    // Feature cards animation with stagger
    const featureCards = gsap.utils.toArray<HTMLElement>(".feature-card");
    if (featureCards.length > 0) {
      gsap.fromTo(
        featureCards,
        { 
          y: 100, 
          opacity: 0,
          scale: 0.9
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: featureCards[0],
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    // Hero badges animation - simplified to avoid conflicts
    const heroBadges = gsap.utils.toArray<HTMLElement>(".hero-badge");
    heroBadges.forEach((badge, index) => {
      gsap.fromTo(
        badge,
        { 
          x: (index % 2 === 0 ? -50 : 50),
          opacity: 0,
          scale: 0.8
        },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          delay: index * 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: badge,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    // Zoom animations with better timing
    const zoomElements = gsap.utils.toArray<HTMLElement>(".gsap-zoom");
    zoomElements.forEach((el, index) => {
      gsap.fromTo(
        el,
        { 
          scale: 0.8, 
          opacity: 0,
          y: 30
        },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay: index * 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 75%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    // Cleanup function
    return () => {
      smoother.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return <>{children}</>;
};

export default ScrollSmootherWrapper;
