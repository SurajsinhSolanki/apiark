"use client";

import { Player } from "@remotion/player";
import { ApiArkDemoVideo, VIDEO_CONFIG } from "@/remotion/ApiArkDemo";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Play } from "lucide-react";

export function VideoDemo() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-32 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.08),transparent_70%)]" />
      </div>

      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            <span className="gradient-text">See it in action.</span>
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-xl mx-auto">
            12 seconds. That&apos;s all it takes to see why developers are switching.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative rounded-2xl overflow-hidden border border-[var(--color-border)] glow-indigo"
        >
          {/* Gradient border top */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent" />

          <Player
            component={ApiArkDemoVideo}
            compositionWidth={VIDEO_CONFIG.width}
            compositionHeight={VIDEO_CONFIG.height}
            durationInFrames={VIDEO_CONFIG.durationInFrames}
            fps={VIDEO_CONFIG.fps}
            acknowledgeRemotionLicense
            style={{
              width: "100%",
              aspectRatio: "16/9",
              borderRadius: 16,
            }}
            controls
            autoPlay
            loop
            clickToPlay
            renderPlayPauseButton={({ playing }) =>
              !playing ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer transition-opacity hover:bg-black/30">
                  <div className="w-20 h-20 rounded-full bg-[var(--color-accent)] flex items-center justify-center shadow-lg shadow-indigo-500/30">
                    <Play className="w-8 h-8 text-white ml-1" />
                  </div>
                </div>
              ) : null
            }
          />
        </motion.div>
      </div>
    </section>
  );
}
