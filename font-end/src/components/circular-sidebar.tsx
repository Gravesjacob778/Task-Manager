'use client';

import { useRouter, usePathname } from 'next/navigation';
import { motion, useCycle } from 'framer-motion';
import { useLocale } from 'next-intl';
import React from 'react';

type MenuItem = {
  icon: string;
  label: string;
  route?: string; // 可選，語系切換不需要 route
  angle: number;
  action?: () => void;
};

type Props = {
  items: MenuItem[];
};

export default function CircularSidebar({ items }: Props) {
  const [isOpen, toggleOpen] = useCycle(false, true);
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  // 切換語言邏輯（zh-TW ↔ en）
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
      angle: 100,
      action: switchLocale,
    },
  ];

  return (
    <div className="fixed top-1/2 left-0 z-50 -translate-y-1/2 w-32 h-32">
      <motion.div
        className="relative w-full h-full flex items-center justify-center"
        animate={isOpen ? 'open' : 'closed'}
      >
        {/* 主按鈕 */}
        <motion.button
          onClick={() => toggleOpen()}
          className="z-50 w-16 h-16 rounded-full bg-white/30 backdrop-blur-md text-2xl text-white shadow-lg border border-white/20 hover:scale-110 transition"
          whileTap={{ scale: 0.9 }}
        >
          ☰
        </motion.button>

        {/* 選單按鈕 */}
        {finalItems.map((item, index) => (
          <motion.button
            key={item.label}
            title={item.label}
            onClick={() => item.action ? item.action() : router.push(item.route!)}
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
  );
}
