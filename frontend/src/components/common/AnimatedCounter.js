import React, { useState, useEffect, useRef } from 'react';

const AnimatedCounter = ({
  endValue,
  duration = 1500,
  prefix = '',
  suffix = '',
  formatter = null
}) => {
  const [currentValue, setCurrentValue] = useState(0);
  const elRef = useRef(null);
  const rafRef = useRef(null);
  const idRef = useRef(`counter-${Math.random().toString(36).slice(2, 9)}`);

  // Normalize endValue to a finite number
  const parseEndValue = (v) => {
    if (typeof v === 'number' && Number.isFinite(v)) return v;
    if (typeof v === 'string') {
      // strip commas or non-numeric characters except dot and minus
      const cleaned = v.replace(/,/g, '').trim();
      const n = Number(cleaned);
      return Number.isFinite(n) ? n : 0;
    }
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  useEffect(() => {
    const node = elRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // kick off animation by toggling a data attribute so the other effect runs
          node.dataset.visible = '1';
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const node = elRef.current;
    if (!node) return;
    if (node.dataset.visible !== '1') return;

    let startTime = null;
    const startValue = 0;
    const endVal = parseEndValue(endValue);

    const animate = (time) => {
      if (!startTime) startTime = time;
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(startValue + (endVal - startValue) * easeOut);
      setCurrentValue(value);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    // start animation
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [endValue, duration]);

  const formatValue = (value) => {
    const normalized = Number.isFinite(value) ? value : 0;
    if (formatter) return formatter(normalized);
    try {
      return normalized.toLocaleString();
    } catch (e) {
      return String(normalized);
    }
  };

  return (
    <span
      id={idRef.current}
      ref={elRef}
      className="inline-block"
      style={{
        fontVariantNumeric: 'tabular-nums',
        transition: 'color var(--transition-fast)'
      }}
    >
      {prefix}{formatValue(currentValue)}{suffix}
    </span>
  );
};

export default AnimatedCounter;