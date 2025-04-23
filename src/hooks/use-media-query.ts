import { useEffect, useState } from "react"

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    
    // Verifica se o matchMedia é suportado
    if (media.matches !== matches) {
      setMatches(media.matches)
    }

    // Adiciona o listener para mudanças
    const listener = () => setMatches(media.matches)
    media.addEventListener("change", listener)

    // Cleanup
    return () => media.removeEventListener("change", listener)
  }, [matches, query])

  return matches
} 