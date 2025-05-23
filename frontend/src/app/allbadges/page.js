"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {useState} from "react";
import React from "react";
import Link from "next/link";

const badges = [
  {
    id: 1,
    title: "Cyber Warrior",
    description: "Earned for demonstrating intermediate-level skills in navigating the Dark Web safely and ethically.",
    tags: ["Dark Web", "Intermediate"],
    img: "/images/img1.png",
  },
  {
    id: 2,
    title: "Cyber Guardian",
    description: "Awarded to noobs beginning their journey in Red Teaming with a foundational understanding of offensive security.",
    tags: ["Red Teaming", "Noob"],
    img: "/images/img2.png",
  },
  {
    id: 3,
    title: "Cyber Commander",
    description: "Granted to amateurs developing their skills in digital forensics and evidence handling.",
    tags: ["Forensics", "Amateur"],
    img: "/images/img3.png",
  },
  {
    id: 4,
    title: "Cyber Analyst",
    description: "Recognizes amateurs who can gather and assess OSINT data with moderate proficiency.",
    tags: ["OSINT", "Amateur"],
    img: "/images/img4.png",
  },
  {
    id: 5,
    title: "Dev Defender",
    description: "Awarded to amateurs who build secure applications and understand secure coding practices.",
    tags: ["Development", "Amateur"],
    img: "/images/img5.png",
  },
  {
    id: 6,
    title: "Digital Sentinel",
    description: "Earned by intermediates who perform forensic analysis on compromised systems.",
    tags: ["Forensics", "Intermediate"],
    img: "/images/img6.png",
  },
  {
    id: 7,
    title: "Red Ops Specialist",
    description: "Expert-level badge for mastering advanced Red Team operations and adversary simulation.",
    tags: ["Red Teaming", "Expert"],
    img: "/images/img7.png",
  },
  {
    id: 8,
    title: "OSINT Master",
    description: "Awarded to experts who can extract actionable intelligence using OSINT techniques.",
    tags: ["OSINT", "Expert"],
    img: "/images/img8.png",
  },
];

export default function AllBadgesPage() {
  return (
    <>
      <Navbar />
      <main className="bg-gradient-to-br from-[#00011E] to-[#000022] min-h-screen text-white px-4 py-12">
        <section className="text-center max-w-4xl mx-auto mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
            Cybersecurity <span className="text-cyan-400">Badges</span>
          </h1>
          <p className="text-lg text-gray-300">
            Complete challenges and earn badges to showcase your cybersecurity skills
          </p>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {badges.map((badge) => (
            <Link 
            href={`/badges/${badge.id}`} 
            key={badge.id}>
            <div className="bg-[#0A0E2A] rounded-xl p-6 shadow-lg border border-white/5 hover:shadow-cyan-500/20 transition duration-300">
              <div className="flex justify-center mb-4">
                <img
                  src={badge.img}
                  alt={badge.title}
                  className="w-24 h-24 object-contain drop-shadow-xl"
                />
              </div>
              <h3 className="text-xl font-semibold text-cyan-400 mb-2 text-center">
                {badge.title}
              </h3>
              <p className="text-gray-400 text-sm text-center mb-4">
                {badge.description}
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {badge.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full border border-cyan-400/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            </Link>
          ))}
        </section>

        <div className="text-center mt-16">
          <a
            href="/"
            className="inline-block px-6 py-3 border border-cyan-400 text-cyan-300 rounded hover:bg-cyan-500/10 transition"
          >
            Back to Home
          </a>
        </div>
      </main>
      <Footer />
    </>
  );
}