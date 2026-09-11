import { useEffect, useState } from "react";

const DISPLAY_MS = 2200;

function DealerMessageBubble({ message, triggerKey }) {
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!message) {
      setVisible(false);
      setText("");
      return;
    }
    setText(message);
    setVisible(true);
    const hideTimer = setTimeout(() => {
      setVisible(false);
      setText("");
    }, DISPLAY_MS);
    return () => clearTimeout(hideTimer);
  }, [message, triggerKey]);

  return (
    <div
      aria-live="polite"
      className={`pointer-events-none transition-all duration-300 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
      }`}
    >
      {text && (
        <div className="relative bg-card-cream text-ink-black font-body text-sm px-3.5 py-2 rounded-lg shadow-md max-w-[220px] text-center">
          {text}
          <span className="absolute left-1/2 -translate-x-1/2 -top-1.5 w-3 h-3 bg-card-cream rotate-45" />
        </div>
      )}
    </div>
  );
}

export default DealerMessageBubble;
