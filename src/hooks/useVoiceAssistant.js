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
  const [transcriptTimeout, setTranscriptTimeout] = useState(null);
  const [processedCommands, setProcessedCommands] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const isMutedRef = useRef(false);

  const {
    transcript,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition();

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

  const speakResponse = useCallback(
    async (text) => {
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
          utterance.volume = isMutedRef.current ? 0 : 1;
          utterance.onend = () => setIsSpeaking(false);
          utterance.onerror = (event) => {
            setIsSpeaking(false);
            if (event.error === "canceled" || event.error === "interrupted")
              return;
            if (speechMethod !== "google") {
              setSpeechMethod("google");
              speakResponse(text);
            }
          };
          window.speechSynthesis.speak(utterance);
        } else {
          if (!isMutedRef.current) {
            await playAudioFromText(text).catch(console.error);
          }
          setIsSpeaking(false);
        }
      } catch {
        setIsSpeaking(false);
      }
    },
    [speechMethod],
  );

  const handleLogin = async (email, password) => {
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
  };

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

  const processTranscript = useCallback(
    async (text) => {
      if (!text || processedCommands.includes(text)) return;
      setProcessedCommands((prev) => [...prev, text]);
      setMessages((prev) => [...prev, { type: "user", text }]);
      resetTranscript();
      SpeechRecognition.stopListening();
      setIsListening(false);
      if (loginStep === "awaiting_email") {
        setLoginEmail(text);
        setLoginStep("awaiting_password");
        speakResponse("Please say your password");
        return;
      }
      if (loginStep === "awaiting_password") {
        await handleLogin(loginEmail, text);
        return;
      }
      await processVoiceCommand(text);
    },
    [
      processedCommands,
      resetTranscript,
      loginStep,
      processVoiceCommand,
      speakResponse,
      handleLogin,
      loginEmail,
    ],
  );

  useEffect(() => {
    if (!transcript || !isListening) return;
    if (transcriptTimeout) clearTimeout(transcriptTimeout);
    const timeout = setTimeout(() => processTranscript(transcript), 2000);
    setTranscriptTimeout(timeout);
    return () => clearTimeout(timeout);
  }, [transcript, isListening, transcriptTimeout, processTranscript]);

  const startListening = useCallback(() => {
    window.speechSynthesis?.cancel();
    setAssistantResponse("");
    setIsListening(true);
    resetTranscript();
    SpeechRecognition.startListening({
      continuous: true,
      interimResults: true,
    });
  });

  const stopListening = () => {
    SpeechRecognition.stopListening();
    setIsListening(false);
    if (transcript) processTranscript(transcript);
  };

  const openAssistant = () => setTogg(true);
  const closeAssistant = () => {
    window.speechSynthesis?.cancel();
    setTogg(false);
    setIsListening(false);
    setAssistantResponse("");
    setMessages([]);
    setProcessedCommands([]);
    setLoginStep(null);
    setLoginEmail("");
    resetTranscript();
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    isMutedRef.current = newMuted;
    if (newMuted) {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
    }
  };

  useEffect(() => {
    if (Togg && !isListening && !isProcessing && !isSpeaking) {
      const timer = setTimeout(() => startListening(), 150);
      return () => clearTimeout(timer);
    }
  }, [Togg, isListening, isProcessing, isSpeaking, startListening]);

  useEffect(() => {
    if (Togg && !isSpeaking && !isProcessing && !isListening) {
      const timer = setTimeout(() => startListening(), 500);
      return () => clearTimeout(timer);
    }
  }, [Togg, isSpeaking, isProcessing, isListening, startListening]);

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
