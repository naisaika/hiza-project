"use client";

import React, { useEffect, useRef } from "react";
import styles from "./Ajisai.module.scss";

export const Ajisai = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    // **直線グラデーションを作成**
    function createLinearGradient(
        ctx: CanvasRenderingContext2D,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        colors: [number, string][]
    ): CanvasGradient {
        const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        colors.forEach(([offset, color]) => gradient.addColorStop(offset, color));
        return gradient;
    }

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

        const marginX = 50;
        const marginY = 50;

        const flowerX = canvasWidth * 0.8 - marginX;
        const flowerY = canvasHeight * 0.8 - marginY;

        const flowerScale = 0.6;
        const positionScale = 0.6;

            // **葉のリスト**
        const leaves = [
            { x: flowerX - 70, y: flowerY + 10, width: 200, height: 180, angle: -Math.PI / 1.5, colors: ["#0b3b0f", "#B0E057"] },
            { x: flowerX + 130, y: flowerY - 70, width: 180, height: 160, angle: Math.PI / 3, colors: ["#0a320c", "#c0fa53"] },
            { x: flowerX + 50, y: flowerY + 30, width: 220, height: 180, angle: Math.PI / 1.1, colors: ["#2D662F", "#A7D948"] },
            { x: flowerX + 120, y: flowerY - 10, width: 140, height: 120, angle: Math.PI / 1.5, colors: ["#0e5413", "#B0E057"] },

            { x: flowerX - 170, y: flowerY + 70, width: 140, height: 120, angle: Math.PI / 1.1, colors: ["#0a320c", "#c0fa53"] },
            { x: flowerX - 250, y: flowerY + 40, width: 120, height: 100, angle: -Math.PI / 1.8, colors: ["#0b3b0f", "#B0E057"] },
            { x: flowerX - 120, y: flowerY + 40, width: 120, height: 100, angle: Math.PI / 1.6, colors: ["#2D662F", "#A7D948"] },
        ];

        // **葉を描画**
        leaves.forEach(({ x, y, width, height, angle, colors }) => {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle);

            // **影の設定**
            ctx.shadowColor = "rgba(0, 0, 0, 0.3)"; // 影の色を指定
            ctx.shadowBlur = 15; // 影のぼかし効果
            ctx.shadowOffsetX = 10; // 影のX方向
            ctx.shadowOffsetY = 10; // 影のY方向

            // **葉のグラデーション**
            const gradient = ctx.createLinearGradient(-width / 2, 0, width / 2, height / 2);
            gradient.addColorStop(0, colors[0]); // 濃い緑
            gradient.addColorStop(1, colors[1]); // 明るい緑
            ctx.fillStyle = gradient;

            // **葉の形 (楕円ベース + ベジェ曲線)**
            ctx.beginPath();
            ctx.moveTo(0, -height / 2); // 上端
            ctx.quadraticCurveTo(width / 2, height / 4, 0, height / 2); // 右カーブ
            ctx.quadraticCurveTo(-width / 2, height / 4, 0, -height / 2); // 左カーブ
            ctx.closePath();
            ctx.fill();

            ctx.restore();
        });


        // **花のリスト**
        const flowers = [
            { x: flowerX - 50, y: flowerY - 170, size: 40, colors: ["#4B2DCE", "#E00971"] },
            { x: flowerX + 30, y: flowerY - 170, size: 40, colors: ["#2d5dce", "#1273b8"] },
            { x: flowerX + 10, y: flowerY - 60, size: 25, colors: ["#4545ce", "#bb41e0"] },
            { x: flowerX + 20, y: flowerY - 120, size: 25, colors: ["#4545ce", "#bb41e0"] },
            { x: flowerX + 90, y: flowerY - 160, size: 25, colors: ["#7d3ccc", "#4d7dc4"] },
            { x: flowerX + 100, y: flowerY - 120, size: 40, colors: ["#7d3ccc", "#4d7dc4"] },
            { x: flowerX + 70, y: flowerY - 200, size: 30, colors: ["#4B2DCE", "#E00971"] },
            { x: flowerX + 50, y: flowerY - 40, size: 40, colors: ["#4B2DCE", "#E00971"] },
            { x: flowerX - 20, y: flowerY - 90, size: 40, colors: ["#673AB7", "#4a97d5"] },
            { x: flowerX - 100, y: flowerY - 130, size: 40, colors: ["#4780c2", "#453abf"] },
            { x: flowerX - 70, y: flowerY - 40, size: 30, colors: ["#4a6cc3", "#81c3d5"] },
            { x: flowerX - 70, y: flowerY - 85, size: 20, colors: ["#3F51B5", "#cd49b9"] },
            { x: flowerX - 120, y: flowerY - 70, size: 40, colors: ["#4545ce", "#bb41e0"] },
            { x: flowerX - 10, y: flowerY - 20, size: 40, colors: ["#2d5dce", "#1273b8"] },
            { x: flowerX - 20, y: flowerY - 190, size: 30, colors: ["#3F51B5", "#b179cb"] },
            { x: flowerX + 110, y: flowerY - 50, size: 30, colors: ["#3F51B5", "#3a9adf"] },
            { x: flowerX + 50, y: flowerY - 130, size: 30, colors: ["#9d3fb5", "#535dc9"] },
            { x: flowerX + 120, y: flowerY - 165, size: 30, colors: ["#3f7ab5", "#3c46ae"] },
            { x: flowerX - 20, y: flowerY - 145, size: 30,  colors: ["#553fb5", "#863cae"] },
            { x: flowerX - 50, y: flowerY - 115, size: 30, colors: ["#E00971", "#4B2DCE"] },
            { x: flowerX + 140, y: flowerY - 100, size: 25, colors: ["#9a3fb5", "#c349a9"] },
            { x: flowerX + 50, y: flowerY - 90, size: 25, colors: ["#3f6ab5", "#573cae"] },
        ];

        // **2つ目の花セット (左にずらし、色を反転)**
        const flowers2 = flowers.map(({ x, y, size, colors }) => ({
            x: x * positionScale + 120,  // **左にずらす**
            y: y * positionScale + 300, // **少し下にずらす**
            size: size * flowerScale,   // **サイズを縮小**
            colors: [colors[1], colors[0]] // **色を反転**
        }));

    // **花を描画**
    [{ flowers, blur: "blur(2px)", centerRadius: 5 }, { flowers: flowers2, blur: "blur(2px)", centerRadius: 3 }]
    .forEach(({ flowers, blur, centerRadius }) => {
        flowers.forEach(({ x, y, size, colors }) => {
            ctx.save();

            // **影の設定**
            ctx.shadowColor = "rgba(0, 0, 0, 0.2)"; // 影の色を指定
            ctx.shadowBlur = 15; // 影のぼかし効果
            ctx.shadowOffsetX = 10; // 影のX方向
            ctx.shadowOffsetY = 10; // 影のY方向
            
            ctx.filter = blur;

            for (let i = 0; i < 4; i++) {
                ctx.save();
                ctx.translate(x, y);
                ctx.rotate((Math.PI / 4) * i);

                // **直線グラデーションの作成**
                const gradient = createLinearGradient(ctx, -size, -size, size, size, [
                    [0, colors[0]], // **花びらの内側**
                    [1, colors[1]]  // **花びらの外側**
                ]);
                ctx.fillStyle = gradient;

                ctx.beginPath();
                ctx.moveTo(0, -size);
                ctx.lineTo(size, 0);
                ctx.lineTo(0, size);
                ctx.lineTo(-size, 0);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
            }

            ctx.restore();

            // **花の中心の白い円 (花のサイズに応じた適用)**
            ctx.beginPath();
            ctx.filter = "blur(2px)";
            ctx.fillStyle = "white";
            ctx.arc(x, y, centerRadius, 0, Math.PI * 2);
            ctx.fill();
            });
        });
    }, []);

    return <canvas ref={canvasRef} className={styles.ajisaiCanvas}></canvas>;
};