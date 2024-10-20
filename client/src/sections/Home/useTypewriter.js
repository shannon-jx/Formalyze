import React, { useState, useEffect } from 'react';

const useTypewriter = (prefix, phrases) => {
  const [typedText, setTypedText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];
    const fullText = `${prefix}${currentPhrase}`;
    let typingSpeed = isDeleting ? 70 : 100;
    let timeout;

    if (!isDeleting && charIndex < currentPhrase.length) {
      timeout = setTimeout(() => {
        setTypedText(prefix + currentPhrase.substring(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);
      }, typingSpeed);
    } else if (isDeleting && charIndex > 0) {
      timeout = setTimeout(() => {
        setTypedText(prefix + currentPhrase.substring(0, charIndex - 1));
        setCharIndex((prev) => prev - 1);
      }, typingSpeed);
    } else if (!isDeleting && charIndex === currentPhrase.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2200);
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, phraseIndex, phrases, prefix]);

  return typedText;
};

export default useTypewriter;
