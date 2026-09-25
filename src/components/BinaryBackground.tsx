import React, { useMemo } from 'react';

interface BinaryBackgroundProps {
  theme: 'dark' | 'light';
}

interface BinaryColumn {
  id: number;
  chars: string[];
  leftPercent: number;
  animationDuration: number;
  animationDelay: number;
  opacity: number;
  fontSize: number;
}

export const BinaryBackground: React.FC<BinaryBackgroundProps> = ({ theme }) => {
  // Pre-generate pseudo-random binary stream columns so they remain stable across re-renders
  const columns: BinaryColumn[] = useMemo(() => {
    const cols: BinaryColumn[] = [];
    const count = 22;
    for (let i = 0; i < count; i++) {
      const length = 12 + Math.floor((i * 7) % 10);
      const chars: string[] = [];
      for (let j = 0; j < length; j++) {
        chars.push(((i * 3 + j * 5 + 1) % 2 === 0 ? '1' : '0'));
      }
      cols.push({
        id: i,
        chars,
        leftPercent: (i / count) * 100 + ((i % 3) * 1.5),
        animationDuration: 18 + ((i * 4) % 16),
        animationDelay: -((i * 3) % 12),
        opacity: theme === 'dark' ? 0.04 + ((i % 4) * 0.02) : 0.03 + ((i % 4) * 0.015),
        fontSize: 12 + ((i % 3) * 2),
      });
    }
    return cols;
  }, [theme]);

  return (
    <div
      id="binary-background-container"
      className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0"
      aria-hidden="true"
    >
      {/* Background Gradient Orbs */}
      <div
        className={`absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl transition-colors duration-700 ${
          theme === 'dark' ? 'bg-cyan-500/10' : 'bg-blue-300/20'
        }`}
      />
      <div
        className={`absolute top-1/3 -right-40 w-96 h-96 rounded-full blur-3xl transition-colors duration-700 ${
          theme === 'dark' ? 'bg-purple-600/10' : 'bg-indigo-300/25'
        }`}
      />
      <div
        className={`absolute -bottom-40 left-1/3 w-[30rem] h-[30rem] rounded-full blur-3xl transition-colors duration-700 ${
          theme === 'dark' ? 'bg-teal-500/10' : 'bg-purple-200/25'
        }`}
      />

      {/* Floating Binary Columns */}
      {columns.map((col) => (
        <div
          key={col.id}
          className="absolute top-0 flex flex-col font-mono leading-relaxed transition-opacity duration-500"
          style={{
            left: `${col.leftPercent}%`,
            opacity: col.opacity,
            fontSize: `${col.fontSize}px`,
            color: theme === 'dark' ? '#38BDF8' : '#6366F1',
            animation: `floatDown ${col.animationDuration}s linear infinite`,
            animationDelay: `${col.animationDelay}s`,
          }}
        >
          {col.chars.map((char, idx) => (
            <span key={idx} className="block my-1 font-bold">
              {char}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
};
