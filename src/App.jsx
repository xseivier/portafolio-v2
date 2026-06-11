import { useEffect, useRef, useState } from 'react'
import { FaEnvelope, FaInstagram, FaMapMarkerAlt, FaWhatsapp } from 'react-icons/fa'
import './App.css'

const sectionNames = [
  'Yo',
  'Sobre mi',
  'Servicios',
  'Algo de mi trabajo',
  'Fotos gastronomica',
  'Fotos mascotas',
  'Pasion sobre ruedas',
  'Sesion para cumple',
  'Mockups + foticos',
  'Motion graphics',
  'Reels + animacion',
  'Efectos/podcast',
  '+ reels',
  'Letterings',
]

const pages = sectionNames.map((sectionName, index) => {
  const pageNumber = index + 1

  return {
    id: `seccion-${pageNumber}`,
    label: sectionName,
    src: `/pagina${pageNumber}.mp4`,
  }
})

const contact = {
  name: 'Angel Ramos',
  email: 'angelmiguelsk8@gmail.com',
  phone: '3227080986',
  instagram: '@unangeldirector',
  instagramUrl: 'https://www.instagram.com/unangeldirector/',
  address: 'Cra. 73b #146f-50, Suba, Bogota, Cundinamarca, Colombia',
}

function App() {
  const [isContactOpen, setIsContactOpen] = useState(false)
  const [isPageMenuOpen, setIsPageMenuOpen] = useState(false)
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const dropdownRef = useRef(null)
  const videoRefs = useRef([])
  const pageRefs = useRef([])

  useEffect(() => {
    const videos = videoRefs.current.filter(Boolean)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target

          if (entry.isIntersecting) {
            setCurrentPageIndex(videos.indexOf(video))
            video.play().catch(() => {})
            return
          }

          video.pause()
        })
      },
      { threshold: 0.65 },
    )

    videos.forEach((video) => observer.observe(video))

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isContactOpen && !isPageMenuOpen) {
      return undefined
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsContactOpen(false)
        setIsPageMenuOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isContactOpen, isPageMenuOpen])

  useEffect(() => {
    if (!isPageMenuOpen) {
      return undefined
    }

    const handlePointerDown = (event) => {
      if (!dropdownRef.current?.contains(event.target)) {
        setIsPageMenuOpen(false)
      }
    }

    window.addEventListener('pointerdown', handlePointerDown)

    return () => window.removeEventListener('pointerdown', handlePointerDown)
  }, [isPageMenuOpen])

  const handlePageSelect = (pageIndex) => {
    setCurrentPageIndex(pageIndex)
    setIsPageMenuOpen(false)
    pageRefs.current[pageIndex]?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <header className="site-header">
        <div className="page-select" ref={dropdownRef}>
          <span className="page-select__label">Secciones</span>
          <div className="page-select__control">
            <button
              className="page-select__trigger"
              type="button"
              aria-haspopup="listbox"
              aria-expanded={isPageMenuOpen}
              onClick={() => setIsPageMenuOpen((isOpen) => !isOpen)}
            >
              {pages[currentPageIndex].label}
            </button>
            <span className="page-select__icon" aria-hidden="true" />
          </div>

          {isPageMenuOpen && (
            <div className="page-select__menu" role="listbox" aria-label="Secciones">
              {pages.map((page, index) => (
                <button
                  className="page-select__option"
                  type="button"
                  key={page.id}
                  role="option"
                  aria-selected={currentPageIndex === index}
                  onClick={() => handlePageSelect(index)}
                >
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  {page.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="topbar-actions">
          <a
            className="topbar-social-link topbar-social-link--whatsapp"
            href={`https://wa.me/57${contact.phone}`}
            target="_blank"
            rel="noreferrer"
            aria-label="Abrir WhatsApp"
          >
            <FaWhatsapp />
          </a>
          <a
            className="topbar-social-link topbar-social-link--instagram"
            href={contact.instagramUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={`Abrir Instagram ${contact.instagram}`}
          >
            <FaInstagram />
          </a>
          <button
            className="contact-button"
            type="button"
            onClick={() => setIsContactOpen(true)}
          >
            Contactame
          </button>
        </div>
      </header>

      <main className="app">
        {pages.map((page, index) => (
          <section
            className="video-page"
            key={page.id}
            ref={(element) => {
              pageRefs.current[index] = element
            }}
            aria-label={page.label}
          >
            <video
              ref={(element) => {
                videoRefs.current[index] = element
              }}
              className="video-page__media"
              src={page.src}
              muted
              loop
              playsInline
              disablePictureInPicture
              controlsList="nodownload nofullscreen noplaybackrate"
              preload={index === 0 ? 'auto' : 'metadata'}
            />
          </section>
        ))}
      </main>

      {isContactOpen && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={() => setIsContactOpen(false)}
        >
          <section
            className="contact-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              className="contact-modal__close"
              type="button"
              aria-label="Cerrar modal de contacto"
              onClick={() => setIsContactOpen(false)}
            >
              Cerrar
            </button>

            <p className="contact-modal__eyebrow">Contacto</p>
            <h2 id="contact-title">{contact.name}</h2>

            <div className="contact-list">
              <a href={`mailto:${contact.email}`}>
                <span className="contact-list__icon" aria-hidden="true">
                  <FaEnvelope />
                </span>
                <span className="contact-list__content">
                  <span className="contact-list__label">Correo</span>
                  {contact.email}
                </span>
              </a>
              <a
                className="contact-list__link--whatsapp"
                href={`https://wa.me/57${contact.phone}`}
                target="_blank"
                rel="noreferrer"
              >
                <span className="contact-list__icon" aria-hidden="true">
                  <FaWhatsapp />
                </span>
                <span className="contact-list__content">
                  <span className="contact-list__label">WhatsApp</span>
                  +57 {contact.phone}
                </span>
              </a>
              <a
                className="contact-list__link--instagram"
                href={contact.instagramUrl}
                target="_blank"
                rel="noreferrer"
              >
                <span className="contact-list__icon" aria-hidden="true">
                  <FaInstagram />
                </span>
                <span className="contact-list__content">
                  <span className="contact-list__label">Instagram</span>
                  {contact.instagram}
                </span>
              </a>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  contact.address,
                )}`}
                target="_blank"
                rel="noreferrer"
              >
                <span className="contact-list__icon" aria-hidden="true">
                  <FaMapMarkerAlt />
                </span>
                <span className="contact-list__content">
                  <span className="contact-list__label">Direccion</span>
                  Colombia, Bogota, Suba
                  <small>{contact.address}</small>
                </span>
              </a>
            </div>
          </section>
        </div>
      )}
    </>
  )
}

export default App
