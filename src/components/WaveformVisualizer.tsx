"use client";

import React, { useEffect, useRef } from "react";

interface WaveformVisualizerProps {
  stream: MediaStream | null;
  isRecording: boolean;
  isPaused?: boolean;
}

export default function WaveformVisualizer({
  stream,
  isRecording,
  isPaused = false,
}: WaveformVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    if (!isRecording || !canvasRef.current) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let localAudioContext: AudioContext | null = null;
    let localAnalyser: AnalyserNode | null = null;

    if (stream && !audioContextRef.current) {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        localAudioContext = new AudioContextClass();
        localAnalyser = localAudioContext.createAnalyser();
        localAnalyser.fftSize = 64;
        const source = localAudioContext.createMediaStreamSource(stream);
        source.connect(localAnalyser);
        audioContextRef.current = localAudioContext;
        analyserRef.current = localAnalyser;
      } catch (err) {
        console.warn("Could not initialize Web Audio Analyser:", err);
      }
    }

    const dataArray = new Uint8Array(32);
    let step = 0;

    const render = () => {
      step += 0.05;
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      const barCount = 28;
      const barWidth = 4;
      const gap = (width - barCount * barWidth) / (barCount - 1);

      if (analyserRef.current && !isPaused) {
        analyserRef.current.getByteFrequencyData(dataArray);
      }

      for (let i = 0; i < barCount; i++) {
        let barHeight = 4;
        if (isRecording && !isPaused) {
          if (analyserRef.current) {
            const freq = dataArray[i % dataArray.length] || 0;
            barHeight = Math.max(4, (freq / 255) * (height - 8));
          } else {
            const wave = Math.sin(step + i * 0.35) * 0.5 + 0.5;
            barHeight = 4 + wave * (height * 0.65);
          }
        }

        const x = i * (barWidth + gap);
        const y = (height - barHeight) / 2;

        ctx.fillStyle = isPaused ? "#9CA3AF" : "#EA580C";
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 2);
        ctx.fill();
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }
    };
  }, [stream, isRecording, isPaused]);

  return (
    <div className="w-full flex items-center justify-center py-2">
      <canvas
        ref={canvasRef}
        width={320}
        height={56}
        className="w-full max-w-xs h-14 rounded-lg bg-gym-surface/60 px-2"
      />
    </div>
  );
}
