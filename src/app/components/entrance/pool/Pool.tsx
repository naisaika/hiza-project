"use client";

import React, { useEffect, useRef } from "react";
import styles from "./Pool.module.scss";

export const Pool = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

     useEffect(() => {
            const canvas = canvasRef.current;
            if (!canvas) return;
    
            const dpr = window.devicePixelRatio || 1;
            const canvasWidth = Math.min(1024, window.innerWidth);
            const canvasHeight = window.innerHeight;
    
            canvas.width = canvasWidth * dpr;
            canvas.height = canvasHeight * dpr;
    
            const ctx = canvas.getContext("2d");
            if (!ctx) return;
    
            ctx.scale(dpr, dpr);

            const pools = [
                {
                    x: 500,
                    y: 500,
                    radiusX: 150,
                    radiusY: 100,
                    rotation: 0, 
                    startAngle: 0,
                    endAngle: Math.PI * 2,
                    fillStyle: "#1463d8",
                    filter: "blur(50px)",
                },
                {
                    x: 250,
                    y: 700,
                    radiusX: 180,
                    radiusY: 100,
                    rotation: 0, // 約17度
                    startAngle: 0,
                    endAngle: Math.PI * 2,
                    fillStyle: "#1463d8",
                    filter: "blur(50px)",
                },
                {
                    x: 800,
                    y: 600,
                    radiusX: 150,
                    radiusY: 100,
                    rotation: 0, 
                    startAngle: 0,
                    endAngle: Math.PI * 2,
                    fillStyle: "#1463d8",
                    filter: "blur(50px)",
                },
            ]

            pools.forEach((pool) => {
                ctx.beginPath();
                ctx.ellipse(
                  pool.x,
                  pool.y,
                  pool.radiusX,
                  pool.radiusY,
                  pool.rotation,
                  pool.startAngle,
                  pool.endAngle
                );
                ctx.filter = pool.filter;
                ctx.fillStyle = pool.fillStyle;
                ctx.fill();
            });

    // 虹の中心を左上に移動
    const centerX = 500;
    const centerY = 500;

        // 虹の太さを細くする
        const bandThickness = 30; // 細めに調整
        const colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"];
    
        // maxRadius を全色表示できるように設定
        const maxRadius = colors.length * bandThickness * 1.2; // 少し余裕を持たせる
    
        // 各色ごとに弧を描画（左上から弧を描く）
        colors.forEach((color, index) => {
            ctx.beginPath();
            const radius = maxRadius - index * bandThickness;
            ctx.arc(centerX, centerY, radius, Math.PI / 2, Math.PI); // 左上から弧を描く
            ctx.lineWidth = bandThickness;
            ctx.strokeStyle = color;
            ctx.stroke();
        });
    
        }, []);

  return (
    <canvas ref={canvasRef} className={styles.poolCanvas}></canvas>
  )
}
