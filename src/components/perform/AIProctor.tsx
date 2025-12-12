/* eslint-disable react-hooks/immutability */
"use client";

import { useEffect, useState, useRef } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import { toast } from "sonner";
import { AlertTriangle, Loader2 } from "lucide-react";

interface AIProctorProps {
  testId: string;
  onViolationLimitReached: () => void;
}

export default function AIProctor({
  testId,
  onViolationLimitReached,
}: AIProctorProps) {
  const [warnings, setWarnings] = useState(0);
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  const webcamRef = useRef<Webcam>(null);
  const detectionInterval = useRef<NodeJS.Timeout | null>(null);
  const faceMissingTimer = useRef<number>(0);

  // Unique storage key for THIS specific test session
  const storageKey = `violations_${testId}`;

  // --- 1. LOAD VIOLATIONS (Specific to this test) ---
  useEffect(() => {
    const savedWarnings = localStorage.getItem(storageKey);
    if (savedWarnings) {
      setWarnings(parseInt(savedWarnings));
    } else {
      // If no key exists (New Test), explicitly start at 0
      setWarnings(0);
    }
  }, [testId, storageKey]);

  // --- 2. HANDLE VIOLATION & AUTO-SUBMIT CHECK ---
  const handleViolation = (message: string) => {
    setWarnings((prev) => {
      const newCount = prev + 1;

      // Save to local storage
      localStorage.setItem(storageKey, newCount.toString());

      // *** AUTO-SUBMIT CHECK ***
      if (newCount > 10) {
        // Stop monitoring to prevent multiple triggers
        if (detectionInterval.current) clearInterval(detectionInterval.current);

        toast.error("MAXIMUM VIOLATIONS REACHED (10/10). Auto-submitting...", {
          duration: 5000,
          style: { background: "#7f1d1d", color: "white", fontWeight: "bold" },
        });

        // Trigger the Parent's Submit Function
        onViolationLimitReached();
      }

      return newCount;
    });

    toast.error(`VIOLATION: ${message}`, {
      duration: 3000,
      style: { background: "#dc2626", color: "white" },
    });
  };

  // --- 3. BACK BUTTON BLOCKER ---
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    const handleBackButton = () => {
      window.history.pushState(null, "", window.location.href);
      handleViolation("Attempted to leave page (Back Button)");
    };

    window.addEventListener("popstate", handleBackButton);
    return () => window.removeEventListener("popstate", handleBackButton);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- 4. AI MODEL LOADING ---
  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri("/model");
        setIsModelLoaded(true);
      } catch (err) {
        console.error("Failed to load face-api models", err);
      }
    };
    loadModels();
  }, []);

  // --- 5. MONITORING LOOP ---
  const startMonitoring = () => {
    if (detectionInterval.current) clearInterval(detectionInterval.current);

    detectionInterval.current = setInterval(async () => {
      // If we already passed the limit, stop checking
      if (parseInt(localStorage.getItem(storageKey) || "0") > 10) return;

      if (
        webcamRef.current &&
        webcamRef.current.video &&
        webcamRef.current.video.readyState === 4
      ) {
        const video = webcamRef.current.video;
        const detections = await faceapi.detectAllFaces(
          video,
          new faceapi.TinyFaceDetectorOptions()
        );

        if (detections.length === 1) {
          faceMissingTimer.current = 0;
        } else if (detections.length === 0) {
          faceMissingTimer.current += 1;
          if (faceMissingTimer.current >= 7) {
            handleViolation("Face not visible for 7+ seconds!");
            faceMissingTimer.current = 0;
          }
        } else if (detections.length > 1) {
          handleViolation("Multiple people detected!");
        }
      }
    }, 1000);
  };

  // --- 6. TAB & KEYBOARD SECURITY ---
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleViolation("Tab switching detected!");
      }
    };

    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === "c" || e.key === "v")) {
        e.preventDefault();
        toast.warning("Copy/Paste is disabled.");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      if (detectionInterval.current) clearInterval(detectionInterval.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 items-end pointer-events-none">
      {warnings > 0 && (
        <div
          className={`
            px-4 py-2 rounded shadow-lg animate-pulse flex items-center gap-2 font-bold transition-colors
            ${warnings > 7 ? "bg-red-700 text-white" : "bg-orange-500 text-white"}
        `}
        >
          <AlertTriangle className="w-5 h-5" />
          {warnings} / 10 Violations
        </div>
      )}

      <div className="relative w-48 h-36 bg-black rounded-lg overflow-hidden border-2 border-slate-700 shadow-2xl pointer-events-auto">
        {!isModelLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
            <Loader2 className="animate-spin text-white" />
          </div>
        )}
        <Webcam
          ref={webcamRef}
          audio={false}
          className="w-full h-full object-cover"
          mirrored={true}
          onUserMedia={startMonitoring}
        />
        <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded text-[10px] text-green-400 font-mono">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          REC
        </div>
      </div>
    </div>
  );
}
