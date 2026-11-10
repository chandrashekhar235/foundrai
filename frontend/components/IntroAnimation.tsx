
"use client";

import { useEffect, useState } from "react";

export default function IntroAnimation() {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const exitTimer = setTimeout(() => {
      setExiting(true);
    }, 1600);

    const removeTimer = setTimeout(() => {
      setVisible(false);
    }, 2100);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`intro-screen ${
        exiting ? "intro-exit" : ""
      }`}
    >
      {/* Ambient glow */}
      <div className="intro-glow" />

      {/* Logo */}
      <div className="intro-content">

        <div className="intro-logo">
          <span>F</span>
        </div>

        <h1 className="intro-title">
          Foundr<span>AI</span>
        </h1>

        <p className="intro-subtitle">
          THINK. VALIDATE. BUILD.
        </p>

        {/* Loading line */}
        <div className="intro-progress">
          <div className="intro-progress-fill" />
        </div>

      </div>
    </div>
  );
}
