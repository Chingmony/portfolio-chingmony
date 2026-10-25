"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { profile } from "@/data/profile";
import { Container } from "@/components/section";
import { NetworkGraph } from "@/components/network-graph";
import { LinkButton, Button, CornerTicks } from "@/components/ui/primitives";
import { useTerminal } from "@/components/terminal/terminal-provider";
import { TerminalIcon, ArrowIcon } from "@/components/icons";
import { ScrambleText } from "@/components/scramble-text";
import { Magnetic } from "@/components/magnetic";
import { CountUp } from "@/components/count-up";
import { Darkhamster } from "@/components/darkhamster";

function RotatingRole() {
  const reduced = useReducedMotion();
  const roles = profile.roleRotation;
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const t = setInterval(() => setI((p) => (p + 1) % roles.length), 2600);
    return () => clearInterval(t);
  }, [reduced, roles.length]);

  return (
    <span className="relative inline-flex h-[1.3em] overflow-hidden align-bottom">
      <motion.span
        key={i}
        initial={reduced ? false : { y: "110%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="text-accent"
      >
        {roles[i]}
      </motion.span>
    </span>
  );
}

const Diamond = () => <span className="inline-block h-2 w-2 rotate-45 bg-accent" aria-hidden />;

export function Hero() {
  const { openTerminal } = useTerminal();
  const reduced = useReducedMotion();

  return (
    <section className="relative flex min-h-[100svh] flex-col overflow-hidden pt-[var(--nav-h)]">
      {/* background layers */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="grid-field grid-mask absolute inset-0 opacity-40" />
        {/* giant background word */}
        <div className="absolute inset-x-0 top-[12%] flex justify-center sm:top-[9%]">
          <motion.span
            aria-hidden
            initial={reduced ? false : { opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="display-huge select-none whitespace-nowrap text-[26vw] text-accent/85 sm:text-[22vw]"
            style={{ letterSpacing: "-0.01em" }}
          >
            {profile.heroWord}
          </motion.span>
        </div>
        {/* network graph */}
        <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_55%_55%_at_40%_45%,#000,transparent_72%)]">
          <NetworkGraph className="h-full w-full" />
        </div>
        {/* legibility vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_60%_at_45%_45%,transparent_25%,var(--bg)_82%)]" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-b from-transparent to-bg" />
        <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-bg to-transparent" />
      </div>

      {/* top masthead */}
      <Container className="relative">
        <div className="flex items-start justify-between gap-4 border-b border-line py-4 font-mono text-[10.5px] uppercase leading-tight tracking-[0.16em] text-faint sm:text-[11px]">
          <div className="flex flex-col gap-0.5">
            <span className="text-dim">Penetration Tester</span>
            <span>Security Researcher</span>
          </div>
          <div className="flex items-center gap-2 text-right">
            <span className="hidden xs:inline">
              {profile.availability.open ? "Available for collaboration" : "Currently engaged"}
            </span>
            <Diamond />
          </div>
        </div>
      </Container>

      {/* main composition */}
      <Container className="relative flex flex-1 flex-col justify-center py-10 sm:py-14">
        <div className="grid w-full items-center gap-x-10 gap-y-12 md:grid-cols-12">
          {/* left — identity */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="order-2 md:order-1 md:col-span-7 lg:col-span-7"
          >
            <span className="script block text-4xl text-accent sm:text-5xl">{profile.greeting}</span>
            <h1
              className="display-xl mt-1 text-ink"
              style={{ textShadow: "0 4px 40px rgba(0,0,0,0.75), 0 1px 3px rgba(0,0,0,0.6)" }}
            >
              <ScrambleText as="span" text={profile.fullName} speed={24} />
            </h1>
            <p className="mt-4 font-mono text-[13px] uppercase tracking-[0.18em] text-accent sm:text-sm">
              <RotatingRole />
            </p>
            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-dim sm:text-base">
              {profile.intro}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Magnetic>
                <LinkButton href="/#projects" variant="primary">
                  View projects
                  <ArrowIcon className="text-base transition-transform group-hover:translate-x-0.5" />
                </LinkButton>
              </Magnetic>
              <Magnetic>
                <Button variant="line" onClick={openTerminal}>
                  <TerminalIcon className="text-base" />
                  Launch terminal
                </Button>
              </Magnetic>
            </div>

            <p className="mt-7 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
              {profile.location}
            </p>
          </motion.div>

          {/* right — portrait + darkhamster */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="order-1 md:order-2 md:col-span-5 md:col-start-8 lg:col-span-4 lg:col-start-9"
          >
            <div className="relative mx-auto w-full max-w-[20rem] md:ml-auto md:mr-0">
              <div className="group relative aspect-[4/5] overflow-hidden rounded-[3px] border border-line-strong bg-raise">
                <Image
                  src={profile.portrait!}
                  alt={`${profile.fullName} — ${profile.nickname}`}
                  fill
                  priority
                  sizes="(max-width: 768px) 80vw, 20rem"
                  className="object-cover grayscale-[0.3] contrast-[1.05] transition-all duration-700 group-hover:grayscale-0"
                />
                {/* grade: dark anchor + crimson wash */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg via-bg/15 to-transparent" />
                <div className="pointer-events-none absolute inset-0 bg-accent/10 mix-blend-color opacity-60 transition-opacity duration-700 group-hover:opacity-0" />
                <CornerTicks />
                {/* scan line accent */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-70" />
              </div>

              {/* darkhamster plate */}
              <div className="absolute -bottom-5 -left-2 flex items-center border border-line bg-bg/92 px-3 py-2 backdrop-blur-sm sm:-left-4">
                <Darkhamster size={42} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* stats rail */}
        <motion.dl
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mt-14 flex flex-wrap gap-y-6 border-t border-line pt-8 sm:mt-16"
        >
          {profile.stats.map((s, i) => (
            <div
              key={s.label}
              className={`flex-1 basis-1/3 px-2 sm:px-6 ${i > 0 ? "border-l border-line" : ""}`}
            >
              <dt className="font-display text-4xl text-accent sm:text-5xl">
                <CountUp value={s.value} />
              </dt>
              <dd className="mt-1.5 max-w-[14ch] font-mono text-[10px] uppercase tracking-[0.14em] text-faint sm:text-[11px]">
                {s.label}
              </dd>
            </div>
          ))}
        </motion.dl>
      </Container>

      {/* scroll cue */}
      <div className="pointer-events-none absolute bottom-4 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex">
        <span className="label-mono">scroll</span>
        <motion.span
          className="h-7 w-px bg-gradient-to-b from-accent to-transparent"
          animate={reduced ? undefined : { scaleY: [0.3, 1, 0.3], originY: 0 }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </section>
  );
}
