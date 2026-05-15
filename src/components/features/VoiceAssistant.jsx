import { useVoiceAssistant } from "../../hooks/useVoiceAssistant";
import { Mic, X, Volume2, VolumeX, Loader2, Brain } from "lucide-react";

const VoiceAssistant = () => {
  const {
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
  } = useVoiceAssistant();

  if (!Togg) {
    return (
      <div className="fixed bottom-28 right-6 sm:bottom-10 sm:right-10 z-2500">
        <button
          className="group relative w-16 h-16 rounded-full bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-border flex items-center justify-center transition-all duration-300 hover:shadow-[0_12px_40px_rgba(184,38,9,0.2)] active:scale-95"
          onClick={openAssistant}
          title="Open Voice Assistant"
        >
          <Mic size={26} className={isSpeaking ? "text-brand" : "text-ink"} />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-10 right-10 z-3000 w-[380px] max-w-[calc(100vw-40px)] rounded-[2.5rem] bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-border overflow-hidden ziggy-modal-enter">
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full -mr-16 -mt-16 blur-3xl" />

      <div className="relative flex justify-between items-start mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-brand animate-pulse" />
            <span className="text-[10px] font-bold text-brand uppercase tracking-[0.2em]">
              Smart Assistant
            </span>
          </div>
          <h3 className="font-display text-2xl font-bold text-ink">Ziggy AI</h3>
          {speechMethod === "google" && (
            <p className="text-[9px] text-muted font-medium uppercase tracking-wider mt-1">
              Enhanced TTS Enabled
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 active:scale-90 ${
              isMuted
                ? "bg-brand/10 text-brand"
                : "bg-surface text-muted hover:bg-ink hover:text-white"
            }`}
            onClick={toggleMute}
            title={isMuted ? "Unmute Ziggy" : "Mute Ziggy"}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <button
            className="w-10 h-10 rounded-2xl bg-surface text-muted flex items-center justify-center hover:bg-ink hover:text-white transition-all duration-300 active:scale-90"
            onClick={closeAssistant}
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="relative space-y-6">
        <button
          className={`group w-full py-5 rounded-3xl font-bold text-sm uppercase tracking-widest transition-all duration-500 flex items-center justify-center gap-3 shadow-lg active:scale-[0.98] ${
            isListening
              ? "bg-brand text-white shadow-brand/20 ring-4 ring-brand/10"
              : "bg-ink text-white hover:bg-brand hover:shadow-brand/20"
          }`}
          onClick={isListening ? stopListening : startListening}
          disabled={isProcessing}
        >
          {isListening ? (
            <>
              <div className="flex gap-1 items-center">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></span>
              </div>
              Listening...
            </>
          ) : isProcessing ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Mic
                size={18}
                className="group-hover:rotate-12 transition-transform"
              />
              Ask Anything
            </>
          )}
        </button>

        <div
          className={`transition-all duration-500 overflow-hidden ${isListening || !browserSupportsSpeechRecognition || isMicrophoneAvailable === false ? "h-24 opacity-100 mt-4" : "h-0 opacity-0"}`}
        >
          <div className="flex flex-col items-center justify-center h-full gap-3 bg-surface/50 rounded-2xl border border-border/50 p-4">
            {!browserSupportsSpeechRecognition ? (
              <div className="text-[10px] text-red-600 font-bold text-center">
                Your browser does not support Speech Recognition.
              </div>
            ) : isMicrophoneAvailable === false ? (
              <div className="text-[10px] text-red-600 font-bold text-center">
                Microphone access denied. Please allow permissions.
              </div>
            ) : (
              <>
                <div className="flex items-center gap-1.5 h-4 mb-1">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-brand rounded-full animate-wave"
                      style={{
                        height: "100%",
                        animationDelay: `${i * 0.1}s`,
                        animationDuration: "1s",
                      }}
                    ></div>
                  ))}
                </div>
                <div className="text-[10px] text-ink font-bold italic text-center min-h-[1.5em] line-clamp-2">
                  {transcript
                    ? `"${transcript}..."`
                    : "Listening for your command..."}
                </div>
              </>
            )}
          </div>
        </div>

        <div
          className="space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide py-2"
          ref={(el) => {
            if (el) el.scrollTop = el.scrollHeight;
          }}
        >
          {messages.length === 0 && !isProcessing && !isListening && (
            <div className="flex flex-col items-center justify-center py-10 opacity-20 select-none">
              <Brain size={40} className="mb-4" />
              <p className="text-[10px] font-bold uppercase tracking-[0.2em]">
                Awaiting Command
              </p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex flex-col ${msg.type === "user" ? "items-end" : "items-start"} animate-in fade-in zoom-in-95 duration-300`}
            >
              <div
                className={`max-w-[85%] p-4 rounded-[1.25rem] border ${
                  msg.type === "user"
                    ? "bg-ink text-white border-ink rounded-tr-none"
                    : "bg-surface border-border/50 text-ink rounded-tl-none shadow-sm"
                }`}
              >
                <div
                  className={`text-[8px] font-bold uppercase tracking-widest mb-1.5 opacity-50 ${
                    msg.type === "user" ? "text-white" : "text-muted"
                  }`}
                >
                  {msg.type === "user" ? "You" : "Ziggy"}
                </div>
                <div className="text-sm font-medium leading-relaxed">
                  {msg.text}
                </div>
              </div>
            </div>
          ))}

          {isProcessing && (
            <div className="flex flex-col items-start animate-in fade-in slide-in-from-left-2 duration-300">
              <div className="bg-surface/50 p-4 rounded-[1.25rem] rounded-tl-none border border-border/50 animate-pulse">
                <div className="flex items-center gap-2">
                  <Loader2 size={12} className="animate-spin text-brand" />
                  <span className="text-[9px] text-muted font-bold uppercase tracking-widest">
                    Ziggy is thinking...
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-ink/5 rounded-2xl border border-ink/5 flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
            <Brain size={14} className="text-brand" />
          </div>
          <p className="text-[10px] text-muted font-medium leading-relaxed">
            <span className="text-ink font-bold block mb-0.5">
              Voice Commands
            </span>
            Try: &quot;Go to menu&quot;, &quot;Show pizzas&quot;, &quot;Add 2
            burgers&quot;, &quot;Go to cart&quot;, &quot;Login&quot;, or
            &quot;Logout&quot;
          </p>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;
