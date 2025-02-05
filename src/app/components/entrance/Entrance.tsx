"use client";
import styles from "./Entrance.module.scss";
import React, { useEffect, useState, useRef } from "react";
import { Ajisai } from "./ajisai/Ajisai";
import { Ripple } from "./ripple/Ripple";
import { Pool } from "./pool/Pool";

export const Entrance = () => {
  const [displayText, setDisplayText] = useState("");
  const text = `毎 日お疲れさま。\nちょっと一息。\n寄り道しない・・・？`; // 改行を含むテキスト
  const indexRef = useRef(0); // index を useRef で管理

  useEffect(() => {
    const speed = 100; // 文字が入力される速度 (ms)

    const type = () => {
      if (indexRef.current < text.length - 1) {
        setDisplayText((prev) => prev + text[indexRef.current]);
        indexRef.current++; // useRef なので確実に更新される
        setTimeout(type, speed); // 再帰的に setTimeout を呼び出す
      }
    };

    type(); // 初回呼び出し

    return () => {
      indexRef.current = text.length; // クリーンアップ
    };
  }, []);

  return (
    <div className={styles.entranceContainer}>
      <div className={styles.entranceText}>
        {displayText.split("\n").map((line, index) => (
          <React.Fragment key={index}>
            {line}
            <br />
          </React.Fragment>
        ))}
      </div>
      <Ajisai />
      <Ripple />
      <Pool />
    </div>
  );
};
