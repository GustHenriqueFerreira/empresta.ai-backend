interface ToastProps {
  message: string | null
}

/* Toast fixo do rodapé — layout.md §5.6. A auto-remoção em 2600ms fica no App. */
export function Toast({ message }: ToastProps) {
  if (!message) return null
  return (
    <div className="toast" role="status">
      {message}
    </div>
  )
}
