"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Play, Pause } from 'lucide-react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { formatDate } from '@/lib/dateUtils'
import Navbar from '@/components/Navbar'

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
  const [activeSection, setActiveSection] = useState('pam')
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioSrc, setAudioSrc] = useState("")
  const [isHovered, setIsHovered] = useState(false)
  const [logoLoaded, setLogoLoaded] = useState(false)
  const [logoScale, setLogoScale] = useState(1)
  const circleRefs = useRef<(SVGCircleElement | null)[]>([])
  const audioRef = useRef<HTMLAudioElement>(null)
  const sectionRefs = useRef<{ [key: string]: React.RefObject<HTMLElement> }>({
    pam: React.createRef(),
    about: React.createRef(),
    artists: React.createRef(),
    parties: React.createRef(),
    releases: React.createRef(),
    pamTapes: React.createRef(),
    store: React.createRef(),
  })

  useEffect(() => {
    const timer = setTimeout(() => setLogoLoaded(true), 500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      updateActiveSection()
      const scrollPosition = window.scrollY
      const maxScroll = 300
      const scale = 1 + (scrollPosition / maxScroll) * 0.5
      setLogoScale(Math.min(scale, 1.5))
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
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

      <Navbar activeSection={activeSection} />

      <main className="relative z-10">
        <section id="pam" ref={sectionRefs.current.pam} className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center relative">
            <div
              className={`transition-all duration-1000 ease-out ${logoLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
              style={{
                transform: `scale(${logoScale})`,
                transition: 'transform 0.3s ease-out, opacity 1s ease-out, translate 1s ease-out',
              }}
            >
              <Image
                src="/logoblack.png"
                alt="PAM TRAX Logo"
                width={600}
                height={600}
                className="mx-auto w-full max-w-[400px] md:max-w-[600px] animate-pulse-slow"
                onLoadingComplete={() => setLogoLoaded(true)}
              />
            </div>
          </div>
        </section>

        <section id="about" ref={sectionRefs.current.about} className="py-16 md:py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
              <div className="w-full md:w-2/3 transform transition-all duration-1000 hover:scale-105">
                <Image
                  src="/about.png"
                  alt="About PAM TRAX"
                  width={1000}
                  height={1000}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="w-full md:w-1/3 text-center md:text-left">
                <p className="mb-4 text-sm md:text-base leading-relaxed opacity-0 transform translate-y-4 transition-all duration-1000 delay-300 animate-fade-in-up">
                  PAM TRAX is a music label from Melbourne, inspired by the spirit of Pam, whose influence runs deep through everything we do. As Joey&apos;s mother, her presence guides us with a quiet wisdom and unwavering energy that keeps us true to our vision.
                </p>
                <p className="mb-4 text-sm md:text-base leading-relaxed opacity-0 transform translate-y-4 transition-all duration-1000 delay-600 animate-fade-in-up">
                  It&apos;s about depth, quality, and an unshakable commitment to authenticity. Pam&apos;s imprint reminds us to stay grounded while making music that lasts.
                </p>
                <p className="text-sm md:text-base leading-relaxed opacity-0 transform translate-y-4 transition-all duration-1000 delay-900 animate-fade-in-up">
                  This is where sound meets soul, crafted with purpose and timeless moments.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="artists" ref={sectionRefs.current.artists} className="py-16 md:py-24 px-4 bg-gray-50">
          <h2 className="text-xl md:text-2xl font-bold mb-8 md:mb-12 text-center">ARTISTS</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-3xl mx-auto">
            {artists.map((artist) => (
              <div
                key={artist}
                className="text-center transform transition-all duration-1000 ease-in-out hover:scale-105"
              >
                <div className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-2 md:mb-4 bg-gray-200 flex items-center justify-center overflow-hidden rounded-sm">
                  <span className="text-gray-800 text-xl md:text-2xl font-bold">{artist[0]}</span>
                </div>
                <p className="text-xs md:text-sm">{artist}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="parties" ref={sectionRefs.current.parties} className="py-16 md:py-24 px-4">
          <h2 className="text-xl md:text-2xl font-bold mb-8 md:mb-12 text-center">UPCOMING PARTIES</h2>
          <div className="space-y-4 md:space-y-8 max-w-2xl mx-auto">
            {parties.map((party, index) => (
              <div
                key={party.name}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-200 pb-4 opacity-0 transform translate-y-4 transition-all duration-1000 animate-fade-in-up"
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

        <section id="releases" ref={sectionRefs.current.releases} className="py-16 md:py-24 px-4 bg-gray-50">
          <h2 className="text-xl md:text-2xl font-bold mb-8 md:mb-12 text-center">LATEST RELEASES</h2>
          <Carousel className="w-full max-w-5xl mx-auto">
            <CarouselContent>
              {mockReleases.map((release) => (
                <CarouselItem key={release.id} className="md:basis-1/2 lg:basis-1/3 pl-4">
                  <Card className="m-2 bg-white border border-gray-200 transform transition-all duration-500 hover:scale-105">
                    <CardContent className="flex flex-col items-center justify-center p-4 md:p-6">
                      <Image src={release.image} alt={release.title} width={200} height={200} className="w-full h-auto rounded-sm mb-4" />
                      <h3 className="text-xs md:text-sm font-bold mb-1">{release.title}</h3>
                      <p className="text-xs text-gray-500 mb-1">{release.artist}</p>
                      <p className="text-xs text-gray-400">{formatDate(release.date)}</p>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setAudioSrc(`/audio/${release.id}.mp3`)
                          setIsPlaying(true)
                        }}
                        className="mt-2 text-xs"
                      >
                        Play Preview
                      </Button>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>

        <section id="pamTapes" ref={sectionRefs.current.pamTapes} className="py-16 md:py-24 px-4">
          <h2 className="text-xl md:text-2xl font-bold mb-8 md:mb-12 text-center">PAM TAPES</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-6xl mx-auto">
            {mixtapes.map((mixtape) => (
              <div key={mixtape.id} className="text-center group">
                <Image src={mixtape.image} alt={mixtape.title} width={200} height={200} className="w-full h-auto rounded-sm mx-auto mb-2 md:mb-4 group-hover:opacity-80 transition-opacity" />
                <p className="font-semibold mb-1 text-xs md:text-sm">{mixtape.title}</p>
                <p className="text-xs text-gray-500 mb-2">{mixtape.artist}</p>
                <Button variant="outline" size="sm" asChild className="border-gray-200 hover:border-gray-400 text-xs">
                  <a href={mixtape.soundcloudUrl} target="_blank" rel="noopener noreferrer">Listen</a>
                </Button>
              </div>
            ))}
          </div>
        </section>

        <section id="store" ref={sectionRefs.current.store} className="py-16 md:py-24 px-4 bg-gray-50">
          <div className="text-center">
            <h2 className="text-xl md:text-2xl font-bold mb-4">PAM Store</h2>
            <p className="text-sm mb-8 opacity-70">Coming Soon</p>
            <Button variant="outline" size="sm" className="text-xs border-gray-200 hover:border-gray-400">
              Get Notified
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-white text-gray-800 py-4">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col items-center space-y-4">
            <Image src="/logo.svg" alt="PAM TRAX Logo" width={50} height={50} />
            <div className="flex flex-wrap justify-center gap-4">
              <a href="https://www.soundcloud.com/jozefconor" target="_blank" rel="noopener noreferrer" className="text-xs hover:text-gray-600">SoundCloud</a>
              <a href="https://www.soundcloud.com/jozefconor" target="_blank" rel="noopener noreferrer" className="text-xs hover:text-gray-600">Instagram</a>
              <a href="https://www.soundcloud.com/jozefconor" target="_blank" rel="noopener noreferrer" className="text-xs hover:text-gray-600">Bandcamp</a>
              <a href="https://www.soundcloud.com/jozefconor" target="_blank" rel="noopener noreferrer" className="text-xs hover:text-gray-600">Discogs</a>
            </div>
            <p className="text-xs opacity-70 text-center">&copy; 2024 PAM TRAX. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <div
        className="fixed bottom-8 right-8 z-50 transition-all duration-300 ease-in-out"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={`absolute inset-0 bg-gray-200 rounded-full transition-all duration-300 ${isHovered ? 'scale-150 opacity-20' : 'scale-100 opacity-0'}`}></div>
        <Button
          onClick={togglePlay}
          className={`relative bg-white text-gray-800 hover:bg-gray-100 transition-all duration-300 rounded-full w-16 h-16 flex items-center justify-center shadow-lg ${isHovered ? 'scale-110' : 'scale-100'}`}
        >
          {isPlaying ? (
            <Pause size={24} className="text-gray-800" />
          ) : (
            <Play size={24} className="text-gray-800" />
          )}
        </Button>
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
        }

        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out forwards;
        }

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

        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-15px) rotate(-2deg); }
          50% { transform: translateY(0px) rotate(0deg); }
          75% { transform: translateY(-15px) rotate(2deg); }
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}