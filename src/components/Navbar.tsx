"use client";

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface NavbarProps {
    activeSection: string;
}

const Navbar: React.FC<NavbarProps> = ({ activeSection }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navItems = [
        { id: 'pam', label: 'Home' },
        { id: 'about', label: 'About' },
        { id: 'artists', label: 'Artists' },
        { id: 'parties', label: 'Parties' },
        { id: 'releases', label: 'Releases' },
        { id: 'pamTapes', label: 'PAM Tapes' },
        { id: 'store', label: 'Store' },
    ]

    const scrollToSection = (sectionId: string) => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
        setIsMenuOpen(false);
    }

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 bg-black bg-opacity-50 backdrop-blur-md z-50">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <button onClick={() => scrollToSection('pam')}>
                            <Image src="/logo.svg" alt="PAM TRAX Logo" width={40} height={40} />
                        </button>
                        <div className="hidden md:flex space-x-4">
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => scrollToSection(item.id)}
                                    className={`text-sm ${activeSection === item.id ? 'text-white' : 'text-gray-300 hover:text-white'
                                        } transition-colors`}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                        <button
                            className="md:hidden flex flex-col space-y-1.5"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <div className="w-6 h-0.5 bg-white"></div>
                            <div className="w-6 h-0.5 bg-white"></div>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Full-screen menu for mobile */}
            {isMenuOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
                    <div className="text-center">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => scrollToSection(item.id)}
                                className="block text-white text-2xl mb-6 hover:text-gray-300 transition-colors"
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </>
    )
}

export default Navbar