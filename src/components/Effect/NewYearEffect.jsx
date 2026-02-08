import React, { useMemo } from "react";
import anhHoaMai from '../../assets/images/effect/flower.png';
import './SnowEffect.css';

const FLOWER_COUNT = 10;

export default function NewYearEffect() {
    // Tạo danh sách các thông số ngẫu nhiên một lần duy nhất
    const flowers = useMemo(() => {
        return Array.from({ length: FLOWER_COUNT }).map((_, i) => ({
            id: i,
            size: Math.random() * 20 + 15,
            left: Math.random() * 100 + "%",
            fallDuration: Math.random() * 6 + 6 + "s",
            swayDuration: Math.random() * 3 + 2 + "s",
            delay: Math.random() * 5 + "s",
            opacity: Math.random() * 0.7 + 0.3,
            blur: Math.random() * 1 + "px",
        }));
    }, []);

    return (
        <div className="effect-container">
            {flowers.map((f) => (
                <img
                    key={f.id}
                    src={anhHoaMai}
                    className="mai-flower"
                    style={{
                        left: f.left,
                        width: f.size + "px",
                        height: "auto",
                        opacity: f.opacity,
                        filter: `blur(${f.blur})`,
                        animationDuration: `${f.fallDuration}, ${f.swayDuration}`,
                        animationDelay: f.delay,
                    }}
                    alt="flower"
                />
            ))}
        </div>
    );
}