import { motion } from 'framer-motion'
import type { PropsWithChildren } from 'react'

export function SectionReveal({ children }: PropsWithChildren) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
