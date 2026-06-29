# Portfolio Content for 3D Room Modals

> Ready-to-paste content for the Work, About, and Contact modals.
> All links are real. Tone: casual, friendly, confident.

---

## WORK MODAL — `~ My Work ~`

<!-- Each project block: name + 1-2 sentence description, then skill tags -->

### project-card

**Name:** Room Portfolio

**Description:**
An interactive 3D room you can explore — click around, discover hidden objects, and unlock modals. Built with Three.js for real-time 3D rendering, GSAP for buttery animations, and a baked Blender scene. The room itself is the portfolio.

**Skills:** Three.js, GSAP, Vite, Blender, WebGL

---

### project-card

**Name:** MacBook GSAP App

**Description:**
A scroll-driven MacBook showcase that uses GSAP ScrollTrigger to animate every angle. React + Vite frontend with Tailwind CSS styling. Think Apple product page vibes, but I built it from scratch.

**Skills:** React, GSAP, ScrollTrigger, Vite, Tailwind CSS

---

### project-card

**Name:** Markboard

**Description:**
A Fiverr-inspired freelancing marketplace where buyers and sellers connect through listings. Real-time backend with Convex, clean UI with shadcn/ui, and a Next.js App Router architecture. No payment processing — just the marketplace flow done right.

**Skills:** Next.js, TypeScript, Convex, Tailwind CSS, shadcn/ui

---

### project-card

**Name:** Terminal 3D Rotating Cube

**Description:**
A spinning 3D cube rendered entirely in your terminal — no browser, no GPU, just pure Rust doing math and printing characters. It rotates in real time using ASCII art projection. Proof that you can make anything visual if you try hard enough.

**Skills:** Rust, ASCII Art, 3D Math, Terminal UI

---

### project-card

**Name:** Mapping Robot

**Description:**
An autonomous robot that maps its environment using sensors and Arduino. Written in C++ with real hardware — not a simulation. It navigates, avoids obstacles, and builds a map of the space around it.

**Skills:** C++, Arduino, Robotics, Sensor Integration, Embedded Systems

---

## ABOUT MODAL — `~ About Me ~`

Hey! I'm **Lasisi Akinoluwa** — an aspiring autonomous systems engineer and creative developer from Nigeria. I build things that live at the intersection of AI, robotics, and really cool web experiences.

Right now I'm working toward my **Bachelor in Computer Science & AI at IE University**, where I get to combine my love for intelligent systems with hands-on software engineering. Outside of class, I'm usually deep in some side project — whether it's a 3D room you can walk through in your browser, a robot that maps its environment, or a Rust program that draws cubes in your terminal just because it can.

When I'm not coding, you'll find me exploring creative coding, 3D art with Blender, or figuring out how to make robots do things they weren't designed to do. I'm passionate about building safe, intelligent systems — things that actually help people move and live better.

**Currently:** Building autonomous systems, shipping web projects, and figuring out how to make AI-powered robots solve real problems.

**Fun fact:** I once won a Gold Medal in a national coding competition. And yes, I do name my GitHub repos things like `catcaptions` because cats are cool.

Special thanks to **Three.js**, **GSAP**, and **Blender** for making this portfolio possible. Also big thanks to the open-source community — you all are incredible.

---

## CONTACT MODAL — `~ Say hello! ~`

Got an idea? A question? Or just want to say hi? I'd love to hear from you. Drop me a message — I'm always down to chat about projects, robots, or really anything cool.

---

### contact-links

**Email:** lasisiakinoluwa@gmail.com

**GitHub:** github.com/catcaptions

**LinkedIn:** linkedin.com/in/akinoluwa-lasisi-808b6b3a4

**Instagram:** @catcaptions

---

## Notes for Implementation

- The `socialLinks` in `config.js` should be updated:
  ```js
  export const socialLinks = {
    Email: "mailto:lasisiakinoluwa@gmail.com",
    GitHub: "https://github.com/catcaptions",
    LinkedIn: "https://linkedin.com/in/akinoluwa-lasisi-808b6b3a4",
    Instagram: "https://instagram.com/catcaptions",
  };
  ```
- Each `project-card` block in the WORK modal should be wrapped in a card/container div with a subtle hover effect.
- Skill tags should be styled as small pill-shaped badges.
- The ABOUT modal text should be in a scrollable container if it exceeds the modal height.
- The CONTACT links should be clickable and open in a new tab (except Email which opens mailto:).
