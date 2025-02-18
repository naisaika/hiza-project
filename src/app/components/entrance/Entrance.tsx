"use client";
import styles from "./Entrance.module.scss";
import React, { useEffect, useState, useRef } from "react";
import { Ajisai } from "./ajisai/Ajisai";
import { Ripple } from "./ripple/Ripple";
import { Pool } from "./pool/Pool";
import { Bear } from "../bear/Bear";
import { Rabbit } from "../rabbit/Rabbit";

export const Entrance = () => {
  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(false);
  const [showBtn, setShowBtn] = useState(false);
  const [currentComponent, setCurrentComponent] = useState("Entrance");
  const text = `毎日お疲れさま。\nちょっと一息。\n寄り道しない・・・？`;
  const entranceRef = useRef<HTMLDivElement | null>(null);

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
      setShowBtn(true); // 文字がすべて出たらボタンを表示
    }
  }, [index]);

  const handleClickBtn = () => {
    if(entranceRef.current) {
      entranceRef.current.classList.add(styles.entranceContainer__hidden);
    }
    setTimeout(() => {
      setCurrentComponent("Bear");
    }, 3000);
  }

  const handleNextComponent = () => {
      setCurrentComponent("Rabbit");
  }

  return (
    <>
      {currentComponent === "Entrance" && (
        <div className={styles.entranceContainer} ref={entranceRef}>
        <div
          className={styles.entranceText}
          dangerouslySetInnerHTML={{
            __html:
              displayText.replace(/\n/g, "<br />") +
              (showCursor ? '<span class="cursor">|</span>' : ""),
          }}
        />
        {showBtn && (
          <button
            type="button"
            className={`${styles.entranceBtn} ${showBtn ? styles.entranceBtn__visible : ""}`}
            onClick={handleClickBtn}
          >
            <span className={styles.entranceBtn__text}>寄り道する</span>
            <span className={styles.entrance__mark}>＞＞＞</span>
          </button>
        )}
        <Ajisai />
        <Ripple />
        <Pool />
      </div>)
    }
     {currentComponent === "Bear" && (<Bear nextComponent={handleNextComponent}/>)}
     {currentComponent === "Rabbit" && (<Rabbit/>)}
    </>
  );
};