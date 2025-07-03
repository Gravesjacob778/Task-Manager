'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, useCycle } from 'framer-motion';
import { useLocale } from 'next-intl';

export type MenuItem = {
  icon: string;
  label: string;
  route?: string;
  angle: number;
  action?: () => void;
};

interface Props {
  items: MenuItem[];
}

export default function RadialMenu({ items }: Props) {
  const dragRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [clickPrevented, setClickPrevented] = useState(false);
  const offset = useRef({ x: 0, y: 0 });

  const [isOpen, toggleOpen] = useCycle(false, true);
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const switchLocale = () => {
    const newLocale = locale === 'zh-TW' ? 'en' : 'zh-TW';
    const pathWithoutLocale = pathname.replace(/^\/(zh-TW|en)/, '');
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  const finalItems: MenuItem[] = [
    ...items,
    {
      icon: '🌐',
      label: '切換語言',
      angle: 120,
      action: switchLocale,
    },
  ];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      setClickPrevented(true);
      const newX = e.clientX - offset.current.x;
      const newY = e.clientY - offset.current.y;
      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setTimeout(() => setClickPrevented(false), 0);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = dragRef.current?.getBoundingClientRect();
    if (!rect) return;
    offset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    setIsDragging(true);
  };

  const handleToggleClick = () => {
    if (!clickPrevented) {
      toggleOpen();
    }
  };

  return (
    <div
      ref={dragRef}
      onMouseDown={handleMouseDown}
      className="fixed z-50 cursor-move"
      style={{ top: position.y, left: position.x }}
    >
      <div className="relative w-32 h-32">
        <motion.div
          className="relative w-full h-full flex items-center justify-center"
          animate={isOpen ? 'open' : 'closed'}
        >
          <motion.button
            onClick={handleToggleClick}
            className="z-50 w-16 h-16 rounded-full bg-white/30 backdrop-blur-md text-2xl text-white shadow-lg border border-white/20 hover:scale-110 transition"
            whileTap={{ scale: 0.9 }}
          >
            ☰
          </motion.button>

          {finalItems.map((item, index) => (
            <motion.button
              key={item.label}
              title={item.label}
              onClick={() =>
                item.action ? item.action() : item.route && router.push(item.route)
              }
              className="absolute w-12 h-12 rounded-full z-40 bg-white/20 backdrop-blur-lg text-white text-lg shadow-xl border border-white/10 hover:scale-125 hover:shadow-white transition"
              initial={{ x: 0, y: 0, opacity: 0 }}
              animate={
                isOpen
                  ? {
                      x: 100 * Math.cos((item.angle * Math.PI) / 180),
                      y: 100 * Math.sin((item.angle * Math.PI) / 180),
                      opacity: 1,
                      transition: {
                        type: 'spring',
                        stiffness: 500,
                        damping: 20,
                        delay: index * 0.05,
                      },
                    }
                  : { x: 0, y: 0, opacity: 0 }
              }
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              {item.icon}
            </motion.button>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
