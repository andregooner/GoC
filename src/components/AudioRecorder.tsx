"use client";

import React, { useState, useRef, useEffect } from "react";
import { Mic, Square, Play, Pause, RotateCcw, Trash2, ArrowRight, AlertCircle, Sparkles } from "lucide-react";
import WaveformVisualizer from "./WaveformVisualizer";
import { useLanguage } from "./LanguageContext";
import { trackEvent } from "@/lib/analytics";

interface AudioRecorderProps {
  onAnalyzeAudio: (audioBlob: Blob, durationSeconds: number) => void;
  onUseDemo: () => void;
  isSubmitting?: boolean;
  maxSeconds?: number;
}

export default function AudioRecorder({
  onAnalyzeAudio,
  onUseDemo,
  isSubmitting = false,
  maxSeconds = 90,
}: AudioRecorderProps) {
  const { t } = useLanguage();

  const [recordingState, setRecordingState] = useState<"idle" | "recording" | "paused" | "recorded">("idle");
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (audioStream) {
        audioStream.getTracks().forEach((track) => track.stop());
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioStream, audioUrl]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins.toString().padStart(2, "0")}:${remainingSecs.toString().padStart(2, "0")}`;
  };

  const getBestMimeType = () => {
    const candidates = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/mp4",
      "audio/aac",
      "audio/ogg",
    ];
    for (const type of candidates) {
      if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }
    return "";
  };

  const startRecording = async () => {
    setErrorMessage(null);
    audioChunksRef.current = [];
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setRecordedBlob(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("MICROPHONE_UNSUPPORTED");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      setAudioStream(stream);

      const mimeType = getBestMimeType();
      const options: MediaRecorderOptions = mimeType ? { mimeType } : {};
      const recorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const mime = mimeType || recorder.mimeType || "audio/webm";
        const blob = new Blob(audioChunksRef.current, { type: mime });
        setRecordedBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        stream.getTracks().forEach((track) => track.stop());
        setAudioStream(null);
      };

      recorder.start(250);
      setRecordingState("recording");
      setSecondsElapsed(0);

      trackEvent("recording_started");

      timerIntervalRef.current = setInterval(() => {
        setSecondsElapsed((prev) => {
          if (prev + 1 >= maxSeconds) {
            stopRecording();
            return maxSeconds;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err: any) {
      console.error("Microphone access error:", err);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setErrorMessage(t.assessment.micDenied);
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        setErrorMessage(t.assessment.micNotFound);
      } else {
        setErrorMessage(err.message || "Failed to start recording. You can also use Demo Mode.");
      }
      setRecordingState("idle");
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.pause();
      setRecordingState("paused");
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "paused") {
      mediaRecorderRef.current.resume();
      setRecordingState("recording");
      timerIntervalRef.current = setInterval(() => {
        setSecondsElapsed((prev) => {
          if (prev + 1 >= maxSeconds) {
            stopRecording();
            return maxSeconds;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setRecordingState("recorded");
  };

  const resetRecording = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (audioStream) {
      audioStream.getTracks().forEach((track) => track.stop());
      setAudioStream(null);
    }
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setRecordedBlob(null);
    setSecondsElapsed(0);
    setRecordingState("idle");
    setIsPlayingAudio(false);
  };

  const togglePlayback = () => {
    if (!audioPlayerRef.current) return;
    if (isPlayingAudio) {
      audioPlayerRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioPlayerRef.current.play();
      setIsPlayingAudio(true);
    }
  };

  const handleAudioEnded = () => {
    setIsPlayingAudio(false);
  };

  const handleAnalyzeClick = () => {
    if (!recordedBlob) return;
    if (secondsElapsed < 5) {
      setErrorMessage(t.assessment.tooShortWarn);
      return;
    }
    onAnalyzeAudio(recordedBlob, secondsElapsed);
  };

  return (
    <div className="w-full rounded-3xl border border-gym-border bg-white p-6 sm:p-8 shadow-sm">
      {errorMessage && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl bg-red-50 p-4 text-xs text-red-700 border border-red-200">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">{errorMessage}</p>
            <button
              type="button"
              onClick={onUseDemo}
              className="mt-2 inline-flex items-center gap-1 font-bold underline hover:text-red-900"
            >
              <Sparkles className="h-3 w-3" />
              {t.assessment.demoBtn}
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gym-border/60 pb-6 mb-6">
        <div className="text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <div
              className={`h-2.5 w-2.5 rounded-full ${
                recordingState === "recording"
                  ? "bg-red-500 animate-ping"
                  : recordingState === "paused"
                  ? "bg-amber-500"
                  : recordingState === "recorded"
                  ? "bg-emerald-500"
                  : "bg-gym-muted/40"
              }`}
            />
            <span className="text-xs font-bold uppercase tracking-wider text-gym-muted">
              {recordingState === "recording"
                ? t.assessment.recordingNow
                : recordingState === "paused"
                ? t.assessment.paused
                : recordingState === "recorded"
                ? t.assessment.recordedReady
                : t.assessment.recordPrompt}
            </span>
          </div>
          <p className="text-xs text-gym-muted mt-1">{t.assessment.instruction}</p>
        </div>

        <div className="flex items-baseline gap-1 font-mono text-2xl sm:text-3xl font-extrabold text-gym-dark bg-gym-surface px-4 py-1.5 rounded-xl border border-gym-border/80">
          <span className={recordingState === "recording" ? "text-gym-accent" : "text-gym-dark"}>
            {formatTime(secondsElapsed)}
          </span>
          <span className="text-xs font-semibold text-gym-muted">/ {formatTime(maxSeconds)}</span>
        </div>
      </div>

      <div className="py-2">
        <WaveformVisualizer
          stream={audioStream}
          isRecording={recordingState === "recording" || recordingState === "paused"}
          isPaused={recordingState === "paused"}
        />
      </div>

      <div className="mt-6 flex flex-col items-center justify-center gap-4">
        {recordingState === "idle" && (
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button
              type="button"
              onClick={startRecording}
              className="w-full sm:w-auto flex items-center justify-center gap-3 rounded-full bg-gym-accent px-8 py-4 text-base font-bold text-white shadow-md hover:bg-gym-accentHover active:scale-98 transition-all"
            >
              <Mic className="h-5 w-5 animate-bounce" />
              <span>{t.assessment.startBtn}</span>
            </button>

            <button
              type="button"
              onClick={onUseDemo}
              className="w-full sm:w-auto text-xs font-semibold text-gym-muted hover:text-gym-dark px-4 py-2 rounded-full border border-gym-border hover:bg-gym-surface transition-all flex items-center justify-center gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5 text-gym-accent" />
              <span>{t.assessment.demoBtn}</span>
            </button>
          </div>
        )}

        {recordingState === "recording" && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={pauseRecording}
              className="flex items-center gap-2 rounded-full border border-gym-border bg-white px-5 py-2.5 text-sm font-semibold text-gym-dark hover:bg-gym-surface active:scale-98 transition-all"
            >
              <Pause className="h-4 w-4" />
              <span>{t.assessment.pauseBtn}</span>
            </button>

            <button
              type="button"
              onClick={stopRecording}
              className="flex items-center gap-2 rounded-full bg-gym-dark px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-black active:scale-98 transition-all"
            >
              <Square className="h-4 w-4 fill-white" />
              <span>{t.assessment.stopBtn}</span>
            </button>
          </div>
        )}

        {recordingState === "paused" && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={resumeRecording}
              className="flex items-center gap-2 rounded-full bg-gym-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-gym-accentHover active:scale-98 transition-all"
            >
              <Play className="h-4 w-4 fill-white" />
              <span>{t.assessment.resumeBtn}</span>
            </button>

            <button
              type="button"
              onClick={stopRecording}
              className="flex items-center gap-2 rounded-full bg-gym-dark px-6 py-2.5 text-sm font-bold text-white hover:bg-black active:scale-98 transition-all"
            >
              <Square className="h-4 w-4 fill-white" />
              <span>{t.assessment.stopBtn}</span>
            </button>
          </div>
        )}

        {recordingState === "recorded" && (
          <div className="w-full flex flex-col items-center gap-4">
            {audioUrl && (
              <audio
                ref={audioPlayerRef}
                src={audioUrl}
                onEnded={handleAudioEnded}
                className="hidden"
              />
            )}

            <div className="flex items-center flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={togglePlayback}
                className="flex items-center gap-2 rounded-full border border-gym-border bg-white px-5 py-2.5 text-sm font-semibold text-gym-dark hover:bg-gym-surface active:scale-98 transition-all"
              >
                {isPlayingAudio ? (
                  <>
                    <Pause className="h-4 w-4" />
                    <span>Jeda Audio</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 fill-gym-dark" />
                    <span>{t.assessment.replayBtn}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={resetRecording}
                className="flex items-center gap-2 rounded-full border border-gym-border bg-white px-4 py-2.5 text-sm font-semibold text-gym-muted hover:text-gym-dark hover:bg-gym-surface active:scale-98 transition-all"
              >
                <RotateCcw className="h-4 w-4" />
                <span>{t.assessment.recordAgainBtn}</span>
              </button>

              <button
                type="button"
                onClick={resetRecording}
                className="p-2.5 rounded-full text-gym-muted hover:text-red-600 hover:bg-red-50 transition-colors"
                title={t.assessment.deleteBtn}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleAnalyzeClick}
              className="mt-2 w-full max-w-sm flex items-center justify-center gap-2 rounded-2xl bg-gym-accent px-6 py-4 text-base font-bold text-white shadow-lg hover:bg-gym-accentHover active:scale-98 transition-all disabled:opacity-50"
            >
              <span>{t.assessment.analyzeBtn}</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      <p className="mt-8 text-center text-[11px] text-gym-muted leading-relaxed max-w-md mx-auto">
        {t.assessment.disclaimer}
      </p>
    </div>
  );
}
