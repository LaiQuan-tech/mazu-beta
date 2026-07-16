import { motion, useReducedMotion } from 'motion/react';

export const BEAD_MENU_ITEMS = [
  { id: 'home', label: '首頁' },
  { id: 'about', label: '緣起' },
  { id: 'deities', label: '神明' },
  { id: 'booking', label: '預約問事' },
  { id: 'lamps', label: '光明點燈' },
  { id: 'blessing', label: '消災祈福' },
  { id: 'donation', label: '捐獻護持' },
] as const;

interface BeadCurtainMenuProps {
  activeSection: string;
  onMenuItemClick: (sectionId: string) => void;
  onScriptureClick?: () => void;
  onMemberClick?: () => void;
  memberLabel?: string;
}

interface BeadStringProps {
  label: string;
  isActive: boolean;
  isOuter: boolean;
  onClick: () => void;
}

const BeadString = ({ label, isActive, isOuter, onClick }: BeadStringProps) => {
  const reduceMotion = useReducedMotion();
  const characters = label.split('');

  return (
    <motion.button
      type="button"
      aria-current={isActive ? 'page' : undefined}
      aria-label={label}
      className="group flex min-h-11 min-w-11 flex-col items-center px-1 font-serif outline-none focus-visible:ring-4 focus-visible:ring-temple-gold/70 focus-visible:ring-offset-2"
      onClick={onClick}
      whileHover={reduceMotion ? undefined : { rotate: isOuter ? 2 : -2 }}
      whileTap={reduceMotion ? undefined : { scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 180, damping: 14 }}
    >
      <span aria-hidden="true" className="-mb-1 h-3 w-3 rounded-full border-2 border-yellow-500/90" />
      <span aria-hidden="true" className="flex origin-top flex-col items-center">
        {characters.map((character, index) => (
          <span key={`${character}-${index}`} className="flex flex-col items-center">
            {index > 0 && <span className="h-1.5 w-px bg-amber-700/60" />}
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold shadow-sm transition-colors duration-200 ${
                isOuter
                  ? isActive
                    ? 'border-yellow-300 bg-red-700 text-yellow-100 shadow-red-950/30'
                    : 'border-red-300 bg-red-600 text-white group-hover:border-yellow-300 group-hover:text-yellow-100'
                  : isActive
                    ? 'border-yellow-500 bg-amber-50 text-red-700 shadow-amber-700/20'
                    : 'border-stone-300 bg-stone-50 text-stone-800 group-hover:border-yellow-500 group-hover:text-red-700'
              }`}
            >
              {character}
            </span>
          </span>
        ))}
        <span className="mt-1 h-2.5 w-px bg-amber-700/60" />
        <span className="h-4 w-4 rounded-full border border-yellow-200 bg-gradient-to-br from-yellow-200 via-amber-500 to-amber-700 shadow-sm" />
      </span>
    </motion.button>
  );
};

export const BeadCurtainMenu = ({
  activeSection,
  onMenuItemClick,
  onScriptureClick,
  onMemberClick = () => {},
  memberLabel = '會員中心',
}: BeadCurtainMenuProps) => (
  <div className="flex items-start gap-2" aria-label="主要導覽">
    <div className="relative flex flex-col items-center pt-1">
      <div aria-hidden="true" className="h-4 w-full min-w-[31rem] rounded-sm border-b border-amber-500 bg-gradient-to-b from-amber-500 via-amber-700 to-amber-950 px-3 shadow-md">
        <div className="h-px w-full bg-yellow-300/50" />
      </div>
      <div className="flex items-start justify-center gap-0.5 px-1">
        {BEAD_MENU_ITEMS.map((item, index) => (
          <BeadString
            key={item.id}
            label={item.label}
            isActive={activeSection === item.id}
            isOuter={index === 0 || index === BEAD_MENU_ITEMS.length - 1}
            onClick={() => onMenuItemClick(item.id)}
          />
        ))}
      </div>
    </div>
    <div className="flex flex-col gap-1 pt-2">
      {onScriptureClick && (
        <button
          type="button"
          onClick={onScriptureClick}
          className="rounded border border-temple-red/35 px-2 py-1 text-xs font-semibold text-temple-red transition-colors duration-200 hover:bg-temple-red hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-temple-gold/70"
        >
          經文閱讀
        </button>
      )}
      <button
        type="button"
        onClick={onMemberClick}
        className="rounded border border-temple-gold bg-temple-red px-2 py-1 text-xs font-semibold text-white transition-colors duration-200 hover:bg-[#5C1A04] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-temple-gold/70"
      >
        {memberLabel}
      </button>
    </div>
  </div>
);
