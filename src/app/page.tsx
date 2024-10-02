"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Play, Pause, Menu } from 'lucide-react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { formatDate } from '@/lib/dateUtils'; // Update the import path accordingly

const artists = ["JOE FUSS", "ADAM F", "APPRIL K", "GROOVINWAVES"]
const parties = [
  { date: "15.10", name: "TECHNO NIGHT", venue: "REVOLVER" },
  { date: "22.10", name: "BASS EXPLOSION", venue: "FABRIC" },
  { date: "29.10", name: "MINIMAL MADNESS", venue: "ONENINENINE" },
  { date: "05.11", name: "UNDERGROUND VIBES", venue: "XE69" },
]

const mockReleases = [
  { id: 1, title: "Midnight Echoes EP", artist: "JOE FUSS", date: "2023-10-01", image: "/release1.png" },
  { id: 2, title: "Neon Pulse", artist: "ADAM F", date: "2023-09-15", image: "/release2.png" },
  { id: 3, title: "Techno Dreamscape", artist: "APPRIL K", date: "2023-09-01", image: "/release3.png" },
  { id: 4, title: "Sonic Waves", artist: "GROOVINWAVES", date: "2023-08-15", image: "/release4.png" },
  { id: 5, title: "Rhythm Fusion", artist: "JOE FUSS", date: "2023-07-30", image: "/release5.png" },
]

const mixtapes = [
  { id: 1, title: "PAM TAPE 1", artist: "JOE FUSS", image: "/pam1.png", soundcloudUrl: "https://soundcloud.com/jozefconor/pam-tape-1" },
  { id: 2, title: "PAM TAPE 2", artist: "JOE FUSS", image: "/pam2.png", soundcloudUrl: "https://soundcloud.com/jozefconor/pam-tape-2" },
  { id: 3, title: "PAM TAPE 3", artist: "JOE FUSS", image: "/pam3.png", soundcloudUrl: "https://soundcloud.com/jozefconor/pam-tape-3" },
  { id: 4, title: "PAM TAPE 4", artist: "JOE FUSS", image: "/pam4.png", soundcloudUrl: "https://soundcloud.com/jozefconor/pam-tape-4" },
  { id: 5, title: "PAM TAPE 5", artist: "ADAM F", image: "/pam5.png", soundcloudUrl: "https://soundcloud.com/adamf/pam-tape-5" },
  { id: 6, title: "PAM TAPE 6", artist: "ADAM F", image: "/pam6.png", soundcloudUrl: "https://soundcloud.com/adamf/pam-tape-6" },
  { id: 7, title: "PAM TAPE 7", artist: "APPRIL K", image: "/pam7.png", soundcloudUrl: "https://soundcloud.com/apprilk/pam-tape-7" },
  { id: 8, title: "PAM TAPE 8", artist: "APPRIL K", image: "/pam8.png", soundcloudUrl: "https://soundcloud.com/apprilk/pam-tape-8" },
]

export default function Home() {
  return (
    <Page />
  );
}

function Page() {
  const [scrollY, setScrollY] = useState(0)
  const [releases] = useState(mockReleases)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioSrc, setAudioSrc] = useState("")
  const artistRefs = useRef<(HTMLDivElement | null)[]>([])
  const circleRefs = useRef<(SVGCircleElement | null)[]>([])
  const audioRef = useRef<HTMLAudioElement>(null)
  const sectionRefs = useRef<{ [key: string]: React.RefObject<HTMLElement> }>({
    home: React.createRef(),
    pam: React.createRef(),
    artists: React.createRef(),
    parties: React.createRef(),
    releases: React.createRef(),
    pamTapes: React.createRef(),
    store: React.createRef(),
  })

  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
      updateActiveSection()
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in')
          } else {
            entry.target.classList.remove('fade-in')
          }
        })
      },
      { threshold: 0.1 }
    )

    artistRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    let animationFrameId: number
    const animate = () => {
      const time = Date.now() / 1000
      circleRefs.current.forEach((circle, index) => {
        if (circle) {
          const offset = index * 2
          const x = 50 + Math.sin(time + offset) * 2
          const y = 50 + Math.cos(time + offset) * 2
          circle.setAttribute('cx', x.toString())
          circle.setAttribute('cy', y.toString())
        }
      })
      animationFrameId = requestAnimationFrame(animate)
    }
    animate()
    return () => cancelAnimationFrame(animationFrameId)
  }, [])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch(error => {
          console.error("Audio playback failed:", error)
        })
      }
      setIsPlaying(!isPlaying)
    }
  }

  const scrollToSection = (sectionId: string) => {
    const section = sectionRefs.current[sectionId]
    if (section && section.current) {
      section.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const updateActiveSection = () => {
    const scrollPosition = window.scrollY + 100
    Object.entries(sectionRefs.current).forEach(([id, ref]) => {
      if (ref.current) {
        const element = ref.current
        const { offsetTop, offsetHeight } = element
        if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
          setActiveSection(id)
        }
      }
    })
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 font-mono overflow-hidden">
      <div className="fixed inset-0 z-0">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
          <circle ref={(el) => { if (el) circleRefs.current[0] = el }} cx="50" cy="50" r="48" fill="none" stroke="gray" strokeWidth="0.5" opacity="0.1" />
          <circle ref={(el) => { if (el) circleRefs.current[1] = el }} cx="50" cy="50" r="38" fill="none" stroke="gray" strokeWidth="0.5" opacity="0.1" />
          <circle ref={(el) => { if (el) circleRefs.current[2] = el }} cx="50" cy="50" r="28" fill="none" stroke="gray" strokeWidth="0.5" opacity="0.1" />
        </svg>
      </div>

      <header className="fixed top-0 left-0 w-full z-10 bg-transparent backdrop-blur-sm">
        <nav className="flex justify-between items-center p-4 max-w-5xl mx-auto">
          <Button variant="ghost" onClick={() => scrollToSection('home')} className="text-lg font-bold tracking-wider hover:text-gray-600 transition-colors">PAM TRAX</Button>
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu size={20} />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-white bg-opacity-90 backdrop-blur-sm text-gray-800">
                <SheetHeader>
                  <SheetTitle className="text-gray-800">Menu</SheetTitle>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-8rem)] mt-4">
                  {['pam', 'artists', 'parties', 'releases', 'pamTapes', 'store'].map((section) => (
                    <Button
                      key={section}
                      variant="ghost"
                      onClick={() => {
                        scrollToSection(section)
                        document.body.click() // This will close the Sheet
                      }}
                      className={`w-full justify-start text-left mb-2 ${activeSection === section ? 'text-primary' : ''}`}
                    >
                      {section === 'pamTapes' ? 'PAM TAPES' : section.toUpperCase()}
                    </Button>
                  ))}
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>
          <div className="hidden md:flex space-x-4">
            {['pam', 'artists', 'parties', 'releases', 'pamTapes', 'store'].map((section) => (
              <Button
                key={section}
                variant="ghost"
                onClick={() => scrollToSection(section)}
                className={`text-xs hover:text-primary transition-colors ${activeSection === section ? 'text-primary' : ''}`}
              >
                {section === 'pamTapes' ? 'PAM TAPES' : section.toUpperCase()}
              </Button>
            ))}
          </div>
        </nav>
      </header>

      <main className="relative z-10">
        <section ref={sectionRefs.current.home} className="h-screen flex flex-col items-center justify-center">
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 glitch"
            data-text="PAM TRAX"
            style={{
              transform: `translateY(${scrollY * 0.5}px)`,
              transition: 'transform 0.3s ease-out'
            }}
          >
            PAM TRAX
          </h1>
        </section>

        <section ref={sectionRefs.current.pam} className="py-24 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <div className="w-full md:w-1/2 transform transition-all duration-1000 hover:scale-105">
                <Image
                  src="/logo.svg"
                  alt="PAM TRAX Logo"
                  width={400}
                  height={400}
                  className="w-full h-auto rounded-sm"
                />
              </div>
              <div className="w-full md:w-1/2 text-center md:text-left">
                <p className="mb-4 text-sm leading-relaxed opacity-0 transform translate-y-4 transition-all duration-1000 delay-300 animate-fade-in-up">
                  PAM TRAX is a music label inspired by the spirit of Pam, whose influence runs deep through everything we do. As Joey&apos;s mother, her presence guides us with a quiet wisdom and unwavering energy that keeps us true to our vision.
                </p>
                <p className="mb-4 text-sm leading-relaxed opacity-0 transform translate-y-4 transition-all duration-1000 delay-600 animate-fade-in-up">
                  At PAM TRAX, we don&apos;t chase trends—we create music that resonates beyond the moment. It&apos;s about depth, quality, and an unshakable commitment to authenticity.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section ref={sectionRefs.current.artists} className="py-24 px-4 bg-gray-50">
          <h2 className="text-2xl font-bold mb-12 text-center">ARTISTS</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            {artists.map((artist, index) => (
              <div
                key={artist}
                className="text-center transform transition-all duration-1000 ease-in-out hover:scale-105"
                ref={(el) => { if (el) artistRefs.current[index] = el }}
              >
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 flex items-center justify-center overflow-hidden rounded-sm">
                  <span className="text-gray-800 text-2xl font-bold">{artist[0]}</span>
                </div>
                <p className="text-sm">{artist}</p>
              </div>
            ))}
          </div>
        </section>

        <section ref={sectionRefs.current.parties} className="py-24 px-4">
          <h2 className="text-2xl font-bold mb-12 text-center">UPCOMING PARTIES</h2>
          <div className="space-y-8 max-w-2xl mx-auto">
            {parties.map((party, index) => (
              <div
                key={party.name}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-200 pb-4 opacity-0 transform translate-y-4 transition-all duration-1000"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div>
                  <p className="text-xs text-gray-500">{party.date}</p>
                  <h3 className="text-sm font-bold">{party.name}</h3>
                  <p className="text-xs text-gray-500">{party.venue}</p>
                </div>
                <Button variant="outline" size="sm" className="mt-2 sm:mt-0 text-xs">RSVP</Button>
              </div>
            ))}
          </div>
        </section>

        <section ref={sectionRefs.current.releases} className="py-24 px-4 bg-gray-50">
          <h2 className="text-2xl font-bold mb-12 text-center">LATEST RELEASES</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {releases.map((release, index) => (
              <Card key={release.id} className="bg-white border border-gray-200 transform transition-all duration-500 hover:scale-105 opacity-0 animate-fade-in" style={{ animationDelay: `${index * 200}ms` }}>
                <CardContent className="p-4">
                  <Image src={release.image} alt={release.title} width={200} height={200} className="w-full h-40 object-cover mb-4 rounded-sm" />
                  <h3 className="text-sm font-bold mb-1">{release.title}</h3>
                  <p className="text-xs text-gray-500 mb-1">{release.artist}</p>
                  <p className="text-xs text-gray-400 mb-2">{formatDate(release.date)}</p> {/* Updated Line */}
                  <Button
                    variant="outline"
                    onClick={() => {
                      setAudioSrc(`/audio/${release.id}.mp3`)
                      setIsPlaying(true)
                    }}
                    className="w-full text-xs"
                  >
                    Play Preview
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section ref={sectionRefs.current.pamTapes} className="py-24 px-4">
          <h2 className="text-2xl font-bold mb-12 text-center">PAM TAPES</h2>
          <Carousel className="w-full max-w-4xl mx-auto">
            <CarouselContent>
              {mixtapes.map((mixtape) => (
                <CarouselItem key={mixtape.id} className="md:basis-1/2 lg:basis-1/3 pl-4">
                  <Card className="bg-white border border-gray-200 transform transition-all duration-500 hover:scale-105">
                    <CardContent className="p-4">
                      <Image
                        src={mixtape.image}
                        alt={mixtape.title}
                        width={300}
                        height={300}
                        className="w-full h-auto mb-4 rounded-sm"
                      />
                      <h3 className="text-sm font-bold mb-1">{mixtape.title}</h3>
                      <p className="text-xs text-gray-500 mb-2">{mixtape.artist}</p>
                      <iframe
                        width="100%"
                        height="80"
                        scrolling="no"
                        frameBorder="no"
                        allow="autoplay"
                        src={`https://w.soundcloud.com/player/?url=${mixtape.soundcloudUrl}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`}
                        className="rounded-sm"
                      ></iframe>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>

        <section ref={sectionRefs.current.store} className="py-24 px-4 bg-gray-50">
          <h2 className="text-2xl font-bold mb-8 text-center">STORE</h2>
          <p className="text-center text-sm mb-8">Coming soon! Stay tuned for exclusive PAM TRAX merchandise.</p>
          <div className="flex justify-center">
            <Button variant="outline" size="sm" className="text-xs px-4 py-2 rounded-sm transform transition-all duration-300 hover:scale-105">
              Subscribe to our Label
            </Button>
          </div>
        </section>
      </main>

      <footer className="relative z-10 py-12 px-4 border-t border-gray-200 bg-white">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-8 md:mb-0">
            <Image
              src="/logoblack.png"
              alt="PAM TRAX Logo"
              width={100}
              height={50}
              className="mx-auto md:mx-0"
            />
          </div>
          <div className="text-center md:text-right">
            <p className="mb-4 text-xs text-gray-500">© 2023 PAM TRAX. ALL RIGHTS RESERVED.</p>
            <div className="flex flex-wrap justify-center md:justify-end space-x-4">
              <a href="https://soundcloud.com/jozefconor/sets/2023-hardware-works-im-still/s-7M74BWolEsG?si=a26c334fda6e427ea884e5314575065f&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing" className="text-xs hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">SOUNDCLOUD</a>
              <a href="https://soundcloud.com/jozefconor/sets/2023-hardware-works-im-still/s-7M74BWolEsG?si=a26c334fda6e427ea884e5314575065f&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing" className="text-xs hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">BANDCAMP</a>
              <a href="https://soundcloud.com/jozefconor/sets/2023-hardware-works-im-still/s-7M74BWolEsG?si=a26c334fda6e427ea884e5314575065f&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing" className="text-xs hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">INSTAGRAM</a>
              <a href="https://www.discogs.com/" className="text-xs hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">DISCOGS</a>
            </div>
          </div>
        </div>
      </footer>

      <div className="fixed bottom-6 right-6 z-20">
        <button
          onClick={togglePlay}
          className="w-16 h-16 bg-white bg-opacity-90 backdrop-blur-sm rounded-full flex items-center justify-center border border-gray-200 hover:bg-opacity-100 transition-all duration-300 focus:outline-none group shadow-lg transform hover:scale-105"
          aria-label={isPlaying ? "Pause music" : "Play music"}
        >
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 bg-gray-200 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300"></div>
            {isPlaying ? (
              <Pause className="w-6 h-6 text-gray-800 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            ) : (
              <Play className="w-6 h-6 text-gray-800 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            )}
          </div>
        </button>
      </div>

      <audio
        ref={audioRef}
        src={audioSrc}
        onEnded={() => setIsPlaying(false)}
        onError={(e) => {
          console.error("Audio playback error:", e)
          setIsPlaying(false)
        }}
      />

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&display=swap');

        body {
          font-family: 'Roboto Mono', monospace;
          background-color: white;
          color: #333;
        }

        @keyframes glitch {
          0% {
            text-shadow: 0.05em 0 0 rgba(255,0,0,.75),
                        -0.025em -0.05em 0 rgba(0,255,0,.75),
                        0.025em 0.05em 0 rgba(0,0,255,.75);
          }
          14% {
            text-shadow: 0.05em 0 0 rgba(255,0,0,.75),
                        -0.025em -0.05em 0 rgba(0,255,0,.75),
                        0.025em 0.05em 0 rgba(0,0,255,.75);
          }
          15% {
            text-shadow: -0.05em -0.025em 0 rgba(255,0,0,.75),
                        0.025em 0.025em 0 rgba(0,255,0,.75),
                        -0.05em -0.05em 0 rgba(0,0,255,.75);
          }
          49% {
            text-shadow: -0.05em -0.025em 0 rgba(255,0,0,.75),
                        0.025em 0.025em 0 rgba(0,255,0,.75),
                        -0.05em -0.05em 0 rgba(0,0,255,.75);
          }
          50% {
            text-shadow: 0.025em 0.05em 0 rgba(255,0,0,.75),
                        0.05em 0 0 rgba(0,255,0,.75),
                        0 -0.05em 0 rgba(0,0,255,.75);
          }
          99% {
            text-shadow: 0.025em 0.05em 0 rgba(255,0,0,.75),
                        0.05em 0 0 rgba(0,255,0,.75),
                        0 -0.05em 0 rgba(0,0,255,.75);
          }
          100% {
            text-shadow: -0.025em 0 0 rgba(255,0,0,.75),
                        -0.025em -0.025em 0 rgba(0,255,0,.75),
                        -0.025em -0.05em 0 rgba(0,0,255,.75);
          }
        }

        .glitch {
          animation: glitch 1s linear infinite;
          color: #333;
        }

        .fade-in {
          animation: fadeIn 1s ease-out forwards;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Parallax effect for sections */
        section {
          position: relative;
          overflow: hidden;
        }

        section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          transform: translateY(-5%);
          transition: transform 0.5s ease-out;
          z-index: -1;
        }

        section:hover::before {
          transform: translateY(0);
        }

        /* New animations */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out forwards;
        }

        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}