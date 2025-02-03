// "use client";
import styles from "./Entrance.module.scss"

import React from "react";
import { Ajisai } from "./ajisai/Ajisai";
import { Ripple } from "./ripple/Ripple";
import { Pool } from "./pool/Pool";

export const Entrance = () => {
  return (
    <div className={styles.entranceContainer}>
      <Ajisai />
      <Ripple />
      <Pool/>
    </div>
  );
};