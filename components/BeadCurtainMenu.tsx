import React, { useEffect } from 'react';
import { motion, useAnimation } from 'motion/react';

interface BeadNodeProps {
  chars: string[];
  charIndex: number;
  isRed: boolean;
  isActive: boolean;
  onClick: () => void;
  animateControls: any;
}

const TOTAL_BEADS = 6; // Set constant total length to reach down to the content gracefully

// Web Audio API helper for a beautiful golden temple bell sound
const playBellSound = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;
    
    // Deeper fundamental + golden brass overtones
    const frequencies = [330, 415.3, 493.88, 660, 990]; 
    const gains = [0.4, 0.2, 0.15, 0.1, 0.05];
    
    frequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      
      // Exp decay for bell resonance
      gainNode.gain.setValueAtTime(gains[idx], now);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 1.8 + idx * 0.15);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start(now);
      osc.stop(now + 2.5);
    });
  } catch (e) {
    console.error("Audio error:", e);
  }
};

const jointVariants = {
  idle: { 
    rotate: 0,
    transition: { type: "spring", stiffness: 80, damping: 15 }
  },
  swing: (i: number) => ({
    rotate: [
      0, 
      15 * Math.pow(0.82, i), 
      -12 * Math.pow(0.82, i), 
      9 * Math.pow(0.82, i), 
      -6 * Math.pow(0.82, i), 
      3 * Math.pow(0.82, i), 
      -1.5 * Math.pow(0.82, i),
      0
    ],
    transition: {
      duration: 2.2,
      ease: "easeInOut",
      delay: i * 0.05, // ripple propagation delay down the string
    }
  })
};

const BeadNode: React.FC<BeadNodeProps> = ({ chars, charIndex, isRed, isActive, onClick, animateControls }) => {
  if (charIndex > TOTAL_BEADS) {
    return null;
  }

  if (charIndex === TOTAL_BEADS) {
    // Weighted bottom decorative gold pendant/bell
    return (
      <motion.div
        custom={charIndex}
        variants={jointVariants}
        animate={animateControls}
        className="flex flex-col items-center origin-top pointer-events-none"
      >
        {/* Brass connecting rod */}
        <div className="w-0.5 h-2.5 sm:h-3 bg-amber-600/60" />
        {/* Shiny golden sphere representing the terminal weighting pendant */}
        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-yellow-300 via-amber-500 to-amber-700 border border-yellow-200 shadow-lg flex items-center justify-center relative before:content-[''] before:absolute before:top-0.5 before:left-0.5 before:w-1 sm:before:w-1.5 before:h-1 sm:before:h-1.5 before:bg-white/70 before:rounded-full shadow-yellow-500/20" />
      </motion.div>
    );
  }

  const hasChar = charIndex < chars.length;
  const char = hasChar ? chars[charIndex] : null;
  
  // Outer strings (red), middle strings (white)
  let beadClass = "";
  if (hasChar) {
    if (isRed) {
      beadClass = isActive
        ? "bg-gradient-to-br from-red-500 via-red-600 to-red-800 border-2 border-yellow-400 text-yellow-200 shadow-md shadow-yellow-500/20 scale-105 font-extrabold"
        : "bg-gradient-to-br from-red-400 via-red-500 to-red-700 border border-red-300 text-white hover:border-yellow-400 hover:text-yellow-200";
    } else {
      beadClass = isActive
        ? "bg-gradient-to-br from-yellow-50 via-white to-amber-100 border-2 border-yellow-500 text-red-600 font-extrabold shadow-md shadow-yellow-500/20 scale-105"
        : "bg-gradient-to-br from-white via-gray-50 to-gray-200 border border-gray-300 text-gray-800 hover:border-yellow-500 hover:text-red-600";
    }
  } else {
    // Empty spacer golden beads to extend the curtain to a uniform length
    beadClass = "bg-gradient-to-br from-yellow-300 via-amber-500 to-amber-600 border border-yellow-200 shadow-md shadow-amber-500/10 hover:brightness-110";
  }

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    playBellSound();
    onClick();
  };

  return (
    <motion.div
      custom={charIndex}
      variants={jointVariants}
      animate={animateControls}
      className="flex flex-col items-center origin-top select-none"
    >
      {/* Thread connecting beads */}
      {charIndex > 0 && <div className="w-0.5 h-1 sm:h-1.5 bg-amber-600/40" />}
      
      {/* Bead Button (interactive if it has character or empty) */}
      {hasChar ? (
        <button
          onClick={handleButtonClick}
          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full ${beadClass} shadow-sm flex items-center justify-center relative font-serif font-semibold text-[10px] sm:text-xs tracking-normal transition-all duration-300 cursor-pointer before:content-[''] before:absolute before:top-0.5 before:left-0.5 before:w-1 sm:before:w-1.5 before:h-1 sm:before:h-1.5 before:bg-white/40 before:rounded-full focus:outline-none`}
        >
          <span className="relative z-10">{char}</span>
        </button>
      ) : (
        <button
          onClick={handleButtonClick}
          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full ${beadClass} flex items-center justify-center relative transition-all duration-300 cursor-pointer before:content-[''] before:absolute before:top-0.5 before:left-0.5 before:w-1 sm:before:w-1.5 before:h-1 sm:before:h-1.5 before:bg-white/60 before:rounded-full focus:outline-none`}
        />
      )}

      {/* Recursive children beads */}
      <BeadNode 
        chars={chars} 
        charIndex={charIndex + 1} 
        isRed={isRed} 
        isActive={isActive} 
        onClick={onClick} 
        animateControls={animateControls} 
      />
    </motion.div>
  );
};

interface BeadStringProps {
  label: string;
  sectionId: string;
  isActive: boolean;
  isRed: boolean;
  onClick: () => void;
}

const BeadString: React.FC<BeadStringProps> = ({ label, sectionId, isActive, isRed, onClick }) => {
  const controls = useAnimation();
  const chars = label.split('');

  const handleMouseEnter = () => {
    controls.set("idle");
    controls.start("swing");
  };

  // Automatically sway occasionally or on mount to draw attention to its interactive nature!
  useEffect(() => {
    const timer = setTimeout(() => {
      controls.start("swing");
    }, 1000 + Math.random() * 2000);
    return () => clearTimeout(timer);
  }, [controls]);

  return (
    <div 
      onMouseEnter={handleMouseEnter}
      className="flex flex-col items-center cursor-pointer px-0.5 sm:px-1.5 md:px-2"
      style={{ minWidth: '36px' }}
    >
      {/* Mini golden hanging hook/ring */}
      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 border-2 border-yellow-500/80 rounded-full -mb-1 bg-transparent animate-pulse" />
      
      {/* The chain of beads */}
      <motion.div 
        animate={controls}
        variants={jointVariants}
        custom={0}
        className="origin-top flex flex-col items-center"
      >
        <BeadNode 
          chars={chars} 
          charIndex={0} 
          isRed={isRed} 
          isActive={isActive} 
          onClick={onClick} 
          animateControls={controls} 
        />
      </motion.div>
    </div>
  );
};

interface BeadCurtainMenuProps {
  activeSection: string;
  onMenuItemClick: (sectionId: string) => void;
}

export const BeadCurtainMenu: React.FC<BeadCurtainMenuProps> = ({ activeSection, onMenuItemClick }) => {
  const menuItems = [
    { id: 'home', label: '宮廟首頁' },
    { id: 'about', label: '和聖緣起' },
    { id: 'deities', label: '奉祀神明' },
    { id: 'booking', label: '預約問事' },
    { id: 'lighting', label: '光明點燈' },
    { id: 'blessing', label: '消災祈福' },
    { id: 'donation', label: '捐獻護持' },
    { id: 'scripture', label: '聖母經文' },
  ];

  return (
    <div className="relative flex flex-col items-center pt-2 select-none">
      {/* Chinese Traditional Canopy Beam - styled like the Baishatun Station entrance canopy */}
      <div className="w-full max-w-2xl h-4 bg-gradient-to-b from-amber-600 via-amber-700 to-amber-900 rounded-md shadow-lg border-b border-amber-500 relative flex items-center justify-between px-4 z-10">
        {/* Left and Right ornamental brass caps */}
        <div className="absolute left-0 top-0 h-full w-2.5 bg-gradient-to-b from-yellow-300 via-yellow-500 to-yellow-600 rounded-l-md border-r border-yellow-400" />
        <div className="absolute right-0 top-0 h-full w-2.5 bg-gradient-to-b from-yellow-300 via-yellow-500 to-yellow-600 rounded-r-md border-l border-yellow-400" />
        
        {/* Subtle inner design line */}
        <div className="w-full h-0.5 bg-yellow-400/30 self-center" />
      </div>

      {/* Hanging Bead Strings */}
      <div className="flex items-start justify-center space-x-0.5 sm:space-x-1.5 md:space-x-2.5 px-1 sm:px-2 pt-0.5 overflow-visible relative max-w-full">
        {/* Shadow layer behind curtain for physical depth */}
        <div className="absolute inset-0 bg-transparent pointer-events-none" />
        
        {menuItems.map((item, index) => {
          // outer strings are red, inner are white (Mazu crown layout)
          const isRed = index === 0 || index === menuItems.length - 1;
          return (
            <BeadString
              key={item.id}
              label={item.label}
              sectionId={item.id}
              isActive={activeSection === item.id}
              isRed={isRed}
              onClick={() => onMenuItemClick(item.id)}
            />
          );
        })}
      </div>
    </div>
  );
};
