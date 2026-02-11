'use client';

import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { CharacterState } from '@/types';
import CharacterFace from './CharacterFace';

type Props = { state: CharacterState };

const variants: Variants = {
  enter: { scale: 0.85, opacity: 0 },
  center: { scale: 1, opacity: 1, transition: { duration: 0.2, ease: 'easeOut' } },
  exit: { scale: 0.85, opacity: 0, transition: { duration: 0.15 } },
};

export default function Character({ state }: Props) {
  return (
    <div className="w-24 h-24">
      <AnimatePresence mode="wait">
        <motion.div
          key={state}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          className="w-full h-full"
        >
          <CharacterFace state={state} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
