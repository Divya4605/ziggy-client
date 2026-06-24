/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useContext, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalStateContext } from "../context/GlobalStateContext";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { API } from "../config/api";

const playAudioFromText = async (text) => {
  const encodedText = encodeURIComponent(text);
  const googleTTSUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&q=${encodedText}&tl=en/`;
  const audio = new Audio(googleTTSUrl);
  audio.crossOrigin = "anonymous";
  return new Promise((resolve, reject) => {
    audio.onended = resolve;
    audio.onerror = reject;
    audio.play().catch(reject);
  });
};

export const useVoiceAssistant = () => {
  const navigate = useNavigate();
  const { Togg, setTogg, updateQuantity, logout, login, foodData } =
    useContext(GlobalStateContext);

  const [isListening, setIsListening] = useState(false);
  const [, setAssistantResponse] = useState("");
  const [messages, setMessages] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [speechMethod, setSpeechMethod] = useState("native");
  const [loginStep, setLoginStep] = useState(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [isMuted, setIsMuted] = useState(false);

  // Refs for stable, non-stale access inside callbacks
  const isMutedRef = useRef(false);
  const isProcessingRef = useRef(false);
  const isSpeakingRef = useRef(false);
  const isListeningRef = useRef(false);
  const loginStepRef = useRef(null);
  const loginEmailRef = useRef("");
  const lastProcessedRef = useRef(""); // Track last processed command to avoid duplicates

  // Keep refs in sync with state
  useEffect(() => { isProcessingRef.current = isProcessing; }, [isProcessing]);
  useEffect(() => { isSpeakingRef.current = isSpeaking; }, [isSpeaking]);
  useEffect(() => { isListeningRef.current = isListening; }, [isListening]);
  useEffect(() => { loginStepRef.current = loginStep; }, [loginStep]);
  useEffect(() => { loginEmailRef.current = loginEmail; }, [loginEmail]);

  const {
    transcript,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
    listening: srListening,
  } = useSpeechRecognition();

  // Detect TTS voices on mount
  useEffect(() => {
    const updateVoices = () => {
      if ("speechSynthesis" in window) {
        const voices = window.speechSynthesis.getVoices();
        setSpeechMethod(voices.length > 0 ? "native" : "google");
      }
    };
    updateVoices();
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  // ── speakResponse ────────────────────────────────────────────────────────────
  const speakResponse = useCallback(
    async (text) => {
      if (isMutedRef.current) return;
      setIsSpeaking(true);
      try {
        if (speechMethod === "native") {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(text);
          const voices = window.speechSynthesis.getVoices();
          const preferredVoice =
            voices.find(
              (v) => v.name.includes("Google") && v.lang.startsWith("en"),
            ) ||
            voices.find((v) => v.lang.startsWith("en-GB")) ||
            voices.find((v) => v.lang.startsWith("en-US")) ||
            voices[0];

          if (preferredVoice) utterance.voice = preferredVoice;
          utterance.rate = 1.0;
          utterance.pitch = 1.0;
          utterance.volume = 1;
          utterance.onend = () => setIsSpeaking(false);
          utterance.onerror = (event) => {
            setIsSpeaking(false);
            if (event.error === "canceled" || event.error === "interrupted")
              return;
          };
          window.speechSynthesis.speak(utterance);
        } else {
          await playAudioFromText(text).catch(console.error);
          setIsSpeaking(false);
        }
      } catch {
        setIsSpeaking(false);
      }
    },
    [speechMethod],
  );

  // ── handleLogin ──────────────────────────────────────────────────────────────
  const handleLogin = useCallback(async (email, password) => {
    try {
      const res = await fetch(API.login, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        login(data.user);
        speakResponse("Login successful. How can I help you?");
      } else {
        speakResponse("Login failed. Please try again.");
      }
    } catch {
      speakResponse("Login failed. Please try again.");
    } finally {
      setLoginStep(null);
      setLoginEmail("");
    }
  }, [login, speakResponse]);

  // ── handleCommand ────────────────────────────────────────────────────────────
  const handleCommand = useCallback(
    async (commandData) => {
      switch (commandData.command) {
        case "FILTER":
          navigate("/");
          setTimeout(() => {
            document
              .getElementById("items")
              ?.scrollIntoView({ behavior: "smooth" });
            setTimeout(() => {
              const btns = document.querySelectorAll(".category-btn");
              for (const btn of btns) {
                if (btn.textContent === commandData.category) {
                  btn.click();
                  break;
                }
              }
            }, 300);
          }, 300);
          break;
        case "NAVIGATE":
          navigate(commandData.path);
          if (commandData.path === "/#items") {
            setTimeout(() => {
              document
                .getElementById("items")
                ?.scrollIntoView({ behavior: "smooth" });
            }, 100);
          }
          break;
        case "ORDER":
          if (commandData.items?.length) {
            for (const item of commandData.items) {
              const foodItem = foodData.find((f) =>
                f.FoodName.toLowerCase().includes(item.name.toLowerCase()),
              );
              if (foodItem) {
                for (let i = 0; i < item.quantity; i++) {
                  await updateQuantity(foodItem.FoodID, 1);
                }
              }
            }
          }
          break;
        case "REMOVE":
          if (commandData.items?.length) {
            for (const item of commandData.items) {
              const foodItem = foodData.find((f) =>
                f.FoodName.toLowerCase().includes(item.name.toLowerCase()),
              );
              if (foodItem) {
                for (let i = 0; i < item.quantity; i++) {
                  await updateQuantity(foodItem.FoodID, -1);
                }
              }
            }
          }
          break;
        case "LOGOUT":
          await logout();
          speakResponse("Logged out successfully");
          break;
        case "CHECKOUT":
          navigate("/cart");
          setTimeout(() => {
            const checkoutBtn = document.getElementById("checkout-btn");
            if (checkoutBtn) checkoutBtn.click();
          }, 800);
          break;
        default:
          break;
      }
    },
    [navigate, foodData, updateQuantity, logout, speakResponse],
  );

  // ── processVoiceCommand ──────────────────────────────────────────────────────
  const processVoiceCommand = useCallback(
    async (command) => {
      setIsProcessing(true);
      try {
        const res = await fetch(API.voice, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transcript: command }),
        });
        const data = await res.json();
        if (data.aiResponse) {
          setAssistantResponse(data.aiResponse.response);
          setMessages((prev) => [
            ...prev,
            { type: "ziggy", text: data.aiResponse.response },
          ]);
          speakResponse(data.aiResponse.response);
          if (
            data.aiResponse.command === "NAVIGATE" &&
            data.aiResponse.page === "login"
          ) {
            setLoginStep("awaiting_email");
            speakResponse("Please say your email");
          } else {
            await handleCommand(data.aiResponse);
          }
        } else {
          const errorMessage = data.error || "I encountered an error.";
          setAssistantResponse(`Sorry, ${errorMessage}`);
          setMessages((prev) => [
            ...prev,
            { type: "ziggy", text: `Sorry, ${errorMessage}` },
          ]);
          speakResponse(`Sorry, ${errorMessage}`);
        }
      } catch {
        setAssistantResponse("Sorry, I could not connect to the server.");
        setMessages((prev) => [
          ...prev,
          { type: "ziggy", text: "Sorry, I could not connect to the server." },
        ]);
        speakResponse("Sorry, I could not connect to the server.");
      } finally {
        setIsProcessing(false);
      }
    },
    [speakResponse, handleCommand],
  );

  // ── processTranscript ────────────────────────────────────────────────────────
  // Uses refs so it never goes stale but always reads current state
  const processTranscript = useCallback(
    async (text) => {
      const trimmed = text?.trim();
      if (!trimmed) return;
      // Avoid double-processing the exact same command in rapid succession
      if (trimmed === lastProcessedRef.current) return;
      lastProcessedRef.current = trimmed;

      // Stop listening before processing
      SpeechRecognition.stopListening();
      setIsListening(false);
      resetTranscript();

      setMessages((prev) => [...prev, { type: "user", text: trimmed }]);

      if (loginStepRef.current === "awaiting_email") {
        setLoginEmail(trimmed);
        setLoginStep("awaiting_password");
        speakResponse("Please say your password");
        // Clear lastProcessed so user can say password next
        lastProcessedRef.current = "";
        return;
      }
      if (loginStepRef.current === "awaiting_password") {
        const email = loginEmailRef.current;
        await handleLogin(email, trimmed);
        lastProcessedRef.current = "";
        return;
      }

      await processVoiceCommand(trimmed);
      // Allow the same phrase again after processing completes
      lastProcessedRef.current = "";
    },
    [resetTranscript, speakResponse, handleLogin, processVoiceCommand],
  );

  // ── Transcript debounce — fires 1.5 s after the user stops speaking ──────────
  useEffect(() => {
    if (!transcript || !srListening) return;
    const timeout = setTimeout(() => {
      processTranscript(transcript);
    }, 1500);
    return () => clearTimeout(timeout);
  }, [transcript, srListening]);

  // ── startListening ───────────────────────────────────────────────────────────
  const startListening = useCallback(() => {
    if (isProcessingRef.current || isSpeakingRef.current) return;
    window.speechSynthesis?.cancel();
    setAssistantResponse("");
    resetTranscript();
    setIsListening(true);
    SpeechRecognition.startListening({
      continuous: true,
      language: "en-US",
    });
  }, [resetTranscript]);

  // ── stopListening ────────────────────────────────────────────────────────────
  const stopListening = useCallback(() => {
    SpeechRecognition.stopListening();
    setIsListening(false);
    resetTranscript();
  }, [resetTranscript]);

  // ── Auto-restart listening after speaking/processing completes ───────────────
  useEffect(() => {
    if (!Togg) return;
    if (isProcessing || isSpeaking || isListening) return;
    const timer = setTimeout(() => {
      // Double-check with refs to avoid stale closure issues
      if (!isProcessingRef.current && !isSpeakingRef.current && !isListeningRef.current) {
        startListening();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [Togg, isProcessing, isSpeaking, isListening]);

  // ── Open / Close assistant ───────────────────────────────────────────────────
  const openAssistant = useCallback(() => {
    lastProcessedRef.current = "";
    setTogg(true);
  }, [setTogg]);

  const closeAssistant = useCallback(() => {
    window.speechSynthesis?.cancel();
    SpeechRecognition.stopListening();
    setTogg(false);
    setIsListening(false);
    setAssistantResponse("");
    setMessages([]);
    setLoginStep(null);
    setLoginEmail("");
    lastProcessedRef.current = "";
    resetTranscript();
  }, [setTogg, resetTranscript]);

  // ── Mute / Unmute ────────────────────────────────────────────────────────────
  const toggleMute = useCallback(() => {
    const newMuted = !isMutedRef.current;
    isMutedRef.current = newMuted;
    setIsMuted(newMuted);
    if (newMuted) {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return {
    Togg,
    isListening,
    messages,
    isSpeaking,
    isProcessing,
    speechMethod,
    isMuted,
    transcript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
    startListening,
    stopListening,
    openAssistant,
    closeAssistant,
    toggleMute,
  };
};
