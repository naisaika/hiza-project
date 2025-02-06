"use client";
import styles from "./Entrance.module.scss";
import React, { useEffect, useState } from "react";
import { Ajisai } from "./ajisai/Ajisai";
import { Ripple } from "./ripple/Ripple";
import { Pool } from "./pool/Pool";

export const Entrance = () => {
  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(false);
  const text = `毎日お疲れさま。\nちょっと一息。\n寄り道しない・・・？`;

  useEffect(() => {
    const speed = 200; // 文字が入力される速度 (ms)

    if (index < text.length) {
      const timer = setTimeout(() => {
        setDisplayText((prev) => prev + text[index]);
        setIndex(index + 1);
        setShowCursor(true);
      }, speed);

      return () => clearTimeout(timer);
    } else {
      setShowCursor(false);
    }
  }, [index]);

  return (
    <div className={styles.entranceContainer}>
      <div
        className={styles.entranceText}
        dangerouslySetInnerHTML={{
          __html: displayText.replace(/\n/g, "<br />") + (showCursor ? '<span class="cursor">|</span>' : ""),
        }}
      />
      <button type="button" className={styles.entranceBtn}>
        <span className={styles.entranceBtn__text}>寄り道する</span>
        <span className={styles.entranceBtn__mark}>＞＞＞</span>
      </button>
      <Ajisai />
      <Ripple />
      <Pool />
    </div>
  );
};