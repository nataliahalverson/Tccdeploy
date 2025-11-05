export default function Main(
  props: React.PropsWithChildren<{ className?: string }>
) {
  return (
    <main id="conteudo" tabIndex={-1} className={`scroll-mt-24 ${props.className ?? ''}`}>
      {props.children}
    </main>
  )
}
