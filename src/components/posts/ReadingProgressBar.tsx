"use client";

import { useState, useEffect } from "react";

export function ReadingProgressBar() {
  const [progress, setProgress] = useState<number>(0);

  const calculateProgress = () => {
    const totalHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const currentScroll = window.scrollY;

    if (totalHeight > 0) {
      setProgress((currentScroll / totalHeight) * 100);
    } else {
      setProgress(100);
    }
  };

  useEffect(() => {
    calculateProgress();

    window.addEventListener("scroll", calculateProgress);
    window.addEventListener("resize", calculateProgress);

    return () => {
      window.removeEventListener("scroll", calculateProgress);
      window.removeEventListener("resize", calculateProgress);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-[6px] z-50">
      <div
        className="h-full bg-teal-500 transition-all duration-100 ease-out"
        style={{ width: `${progress}%` }}
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
}
