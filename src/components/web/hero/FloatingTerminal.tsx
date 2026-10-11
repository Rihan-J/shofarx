'use client';

import React, { useState, useEffect } from 'react';
import { motion, MotionValue, useTransform } from 'framer-motion';
import { heroConfig } from './heroConfig';

interface Props {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}

const LINES = [
  { text: "> Initializing Project...", isAction: true },
  { text: "✓ Planning", isCheck: true },
  { text: "✓ Designing", isCheck: true },
  { text: "✓ Development", isCheck: true },
  { text: "✓ Testing", isCheck: true },
  { text: "✓ Optimization", isCheck: true },
  { text: "> Deploying...", isAction: true },
  { text: "Live ✓", isCheck: true }
];

export function FloatingTerminal({ mouseX, mouseY }: Props) {
  const [displayedLines, setDisplayedLines] = useState<{text: string, isAction?: boolean, isCheck?: boolean}[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  const lines = heroConfig.terminal.lines;
  
  const x = useTransform(mouseX, [-0.5, 0.5], [10, -10]);
  const y = useTransform(mouseY, [-0.5, 0.5], [10, -10]);

  useEffect(() => {
    if (currentLineIndex >= lines.length) {
      const timeout = setTimeout(() => {
        setDisplayedLines([]);
        setCurrentLineIndex(0);
        setCurrentCharIndex(0);
      }, heroConfig.terminal.restartDelayMs + Math.random() * 1000);
      return () => clearTimeout(timeout);
    }

    const currentLine = lines[currentLineIndex];

    if (currentCharIndex < currentLine.text.length) {
      const isAction = currentLine.isAction;
      const timeout = setTimeout(() => {
        setCurrentCharIndex(prev => prev + 1);
        
        setDisplayedLines(prev => {
          const newLines = [...prev];
          if (newLines.length <= currentLineIndex) {
            newLines.push({ ...currentLine, text: currentLine.text.charAt(currentCharIndex) });
          } else {
            newLines[currentLineIndex].text = currentLine.text.slice(0, currentCharIndex + 1);
          }
          return newLines;
        });
      }, isAction ? heroConfig.terminal.typingSpeedMs + (Math.random() * 30) : heroConfig.terminal.typingSpeedMs / 3);
      
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setCurrentLineIndex(prev => prev + 1);
        setCurrentCharIndex(0);
      }, heroConfig.terminal.lineDelayMs + (Math.random() * 200));
      return () => clearTimeout(timeout);
    }
  }, [currentLineIndex, currentCharIndex]);

  return (
    <motion.div
      style={{ x, y }}
      initial={{ opacity: 1, x: 0 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="wh-floating-terminal"
    >
      <div className="wh-term-header">
        <div className="wh-term-dots">
          <span className="wh-term-dot red" />
          <span className="wh-term-dot yellow" />
          <span className="wh-term-dot green" />
        </div>
        <div className="wh-term-title">build.sh</div>
      </div>
      <div className="wh-term-body">
        {displayedLines.map((line, i) => (
          <div key={i} className={`wh-term-line ${line.isCheck ? 'check' : ''}`}>
            {line.text}
          </div>
        ))}
        <div className="wh-term-cursor" />
      </div>
    </motion.div>
  );
}
