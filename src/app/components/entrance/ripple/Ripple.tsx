"use client";

import React, { useEffect, useRef } from "react";
import styles from "./Ripple.module.scss";

export const Ripple = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const ripples = useRef<{ 
        id: number; 
        x: number; 
        y: number; 
        radius: number; 
        alpha: number; 
        startTime: number;
    }[]>([]);
    
    const animationFrameId = useRef<number | null>(null);
    const lastTime = useRef<number | null>(null);
    let rippleIdCounter = 0; // **波紋IDカウンター**

    // **波紋の固定された発生位置 (5か所)**
    const fixedPositions = [
        { x: 500, y: 300 },
        { x: 800, y: 450 },
        { x: 600, y: 700 },
        { x: 250, y: 500 },
    ];

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        ctx.scale(dpr, dpr);

        function drawRipples(time: number) {
            if (!lastTime.current) lastTime.current = time;
            const deltaTime = (time - lastTime.current) / 1500; // **秒単位の経過時間**
            lastTime.current = time;
            if(!canvas) return;
            if(!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height); // **画面をクリア**

            ripples.current.forEach((ripple) => {
                ctx.beginPath();
                ctx.ellipse(ripple.x, ripple.y, ripple.radius * 2.3, ripple.radius * 0.8, 0, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(173, 216, 230, ${ripple.alpha})`;
                ctx.lineWidth = 2;
                ctx.stroke();

                ripple.radius += 100 * deltaTime * 0.6;  // **波紋の広がる速度**
                ripple.alpha -= 0.3 * deltaTime;  // **フェードアウト速度**
            });

            // **波紋の削除処理**
            ripples.current = ripples.current.filter((ripple) => ripple.alpha > 0);

            // **アニメーションの継続**
            animationFrameId.current = requestAnimationFrame(drawRipples);
        }

        function addRippleAt(x: number, y: number) {
            ripples.current.push({ 
                id: rippleIdCounter++,
                x, 
                y, 
                radius: 10, 
                alpha: 0.8, 
                startTime: performance.now()
            });

            // **1秒後に追加**
            setTimeout(() => {
                ripples.current.push({ 
                    id: rippleIdCounter++,
                    x, 
                    y, 
                    radius: 10, 
                    alpha: 0.8, 
                    startTime: performance.now()
                });
            }, 1500);

            // **2秒後に追加**
            setTimeout(() => {
                ripples.current.push({ 
                    id: rippleIdCounter++,
                    x, 
                    y, 
                    radius: 10, 
                    alpha: 0.8, 
                    startTime: performance.now()
                });
            }, 3000);
        }

        function addFixedRipple() {
            // fixedPositions の各要素に対して、インデックスに応じた遅延時間（ミリ秒）を設定
            fixedPositions.forEach((position, index) => {
              setTimeout(() => {
                addRippleAt(position.x, position.y);
              }, index * 1200); // 1つ目は 0ms、2つ目は 1000ms、3つ目は 2000ms、...
            });
          }

        // **最初のアニメーションを開始**
        animationFrameId.current = requestAnimationFrame(drawRipples);

        // **3秒ごとに固定位置で波紋を追加**
        const interval = setInterval(addFixedRipple, 3000);

        return () => {
            clearInterval(interval);
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
                animationFrameId.current = null;
            }
        };
    }, []);

    return <canvas ref={canvasRef} className={styles.rippleCanvas}></canvas>;
};