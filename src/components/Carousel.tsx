'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import clsx from 'clsx'
import styles from './Carousel.module.css'

type CarouselImage = {
  src: string
  alt: string
  blurDataURL?: string
  credit?: {
    name: string
    url?: string
  }
}

type CarouselProps = {
  images: CarouselImage[]
  interval?: number
  showCredit?: boolean
}

const MIN_INTERVAL = 4000

export default function Carousel({ images, interval = 6000, showCredit = false }: CarouselProps) {
  const safeInterval = useMemo(() => Math.max(interval, MIN_INTERVAL), [interval])
  const [current, setCurrent] = useState(0)
  const totalSlides = Array.isArray(images) ? images.length : 0
  const hasMultipleImages = totalSlides > 1

  useEffect(() => {
    if (!hasMultipleImages) {
      return undefined
    }

    const timer = window.setInterval(() => {
      setCurrent((prev) => (prev + 1) % totalSlides)
    }, safeInterval)

    return () => window.clearInterval(timer)
  }, [hasMultipleImages, safeInterval, totalSlides])

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + totalSlides) % totalSlides)
  }

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % totalSlides)
  }

  if (totalSlides === 0) {
    return <div className={styles.empty}>Nenhuma imagem disponível</div>
  }

  return (
    <div className={styles.carousel} role="region" aria-roledescription="carrossel" aria-live="polite">
      <div className={styles.container}>
        {images.map((image, index) => {
          const isActive = index === current

          return (
            <div
              key={index}
              className={clsx(styles.slide, isActive && styles.active)}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} de ${totalSlides}`}
              aria-hidden={!isActive}
            >
              <div className={styles.media}>
                <Image
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 960px, 1120px"
                  src={image.src}
                  alt={image.alt}
                  className={styles.image}
                  priority={index === 0}
                  placeholder={image.blurDataURL ? 'blur' : 'empty'}
                  blurDataURL={image.blurDataURL}
                />
                {showCredit && image.credit?.name ? (
                  <span className={styles.credit}>
                    Foto: {image.credit.url ? (
                      <a href={image.credit.url} target="_blank" rel="noreferrer" className={styles.creditLink}>
                        {image.credit.name}
                      </a>
                    ) : (
                      image.credit.name
                    )}
                  </span>
                ) : null}
              </div>
            </div>
          )
        })}
      </div>

      {hasMultipleImages ? (
        <>
          <button className={styles.prev} onClick={handlePrev} aria-label="Slide anterior">
            &#10094;
          </button>
          <button className={styles.next} onClick={handleNext} aria-label="Próximo slide">
            &#10095;
          </button>

          <div className={styles.indicators}>
            {images.map((_, index) => (
              <button
                key={index}
                className={clsx(styles.indicator, index === current && styles.active)}
                onClick={() => setCurrent(index)}
                aria-label={`Ir para slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  )
}
