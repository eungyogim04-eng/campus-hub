import { ReactNode } from 'react'

interface VisuallyHiddenProps {
  children: ReactNode
}

export default function VisuallyHidden({ children }: VisuallyHiddenProps) {
  return (
    <span
      style={{
        position: 'absolute',
        width: 1,
        height: 1,
        padding: 0,
        margin: -1,
        overflow: 'hidden',
        clip: 'rect(0,0,0,0)',
        whiteSpace: 'nowrap',
        border: 0,
      }}
    >
      {children}
    </span>
  )
}
