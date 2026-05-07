import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui';
import { SKILL_DATA } from '../../lib/skillUtils';

const sheetVariants = {
  hidden:  { y: '100%', opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  exit:    { y: '100%', opacity: 0, transition: { duration: 0.2 } }
};

export default function SkillModal({ isOpen, skillId, onConfirm, onCancel }) {
  const skill = SKILL_DATA[skillId];

  return (
    <AnimatePresence>
      {isOpen && skill && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-40"
            onClick={onCancel}
          />
          <motion.div 
            variants={sheetVariants} initial="hidden" animate="visible" exit="exit"
            className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-surface-card rounded-t-3xl p-6 z-50 flex flex-col items-center shadow-2xl"
          >
            <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center text-3xl mb-4 border border-primary-200">
              {skill.icon}
            </div>
            
            <h3 className="font-serif font-black text-2xl text-ink mb-2">{skill.label}</h3>
            <p className="font-sans text-ink-muted text-center mb-6">{skill.desc}</p>
            
            {(skillId === 'erase' || skillId === 'steal') && (
              <div className="bg-warning-50 text-warning-800 text-sm p-3 rounded-lg w-full text-center mb-6 border border-warning-200">
                Pilih kotak lawan setelah menekan tombol Gunakan.
              </div>
            )}

            <div className="flex gap-3 w-full">
              <Button variant="outline" className="flex-1" onClick={onCancel}>Batal</Button>
              <Button className="flex-1" onClick={() => onConfirm(skillId)}>Gunakan</Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
