/**
 * Lightweight SplitText replacement — no GSAP Club license required.
 * Splits element text into individually-animatable <span> wrappers
 * for chars, words, and/or lines.
 */

export interface SplitResult {
  chars: HTMLElement[];
  words: HTMLElement[];
  lines: HTMLElement[];
  revert: () => void;
}

interface SplitOptions {
  type?: string; // comma-separated: "chars", "words", "lines"
  linesClass?: string;
}

export function splitText(
  target: string | HTMLElement | HTMLElement[],
  options: SplitOptions = {}
): SplitResult {
  const elements = resolveTargets(target);
  const types = (options.type || "chars,words,lines")
    .split(",")
    .map((t) => t.trim().toLowerCase());

  const allChars: HTMLElement[] = [];
  const allWords: HTMLElement[] = [];
  const allLines: HTMLElement[] = [];
  const revertFns: (() => void)[] = [];

  elements.forEach((el) => {
    const originalHTML = el.innerHTML;
    revertFns.push(() => {
      el.innerHTML = originalHTML;
    });

    const text = el.textContent || "";
    el.innerHTML = "";

    const wordStrings = text.split(/(\s+)/);
    const wordSpans: HTMLElement[] = [];

    wordStrings.forEach((segment) => {
      if (/^\s+$/.test(segment)) {
        // Preserve whitespace
        el.appendChild(document.createTextNode(segment));
        return;
      }

      const wordSpan = document.createElement("span");
      wordSpan.style.display = "inline-block";
      wordSpan.className = "split-word";

      if (types.includes("chars")) {
        segment.split("").forEach((char) => {
          const charSpan = document.createElement("span");
          charSpan.style.display = "inline-block";
          charSpan.className = "split-char";
          charSpan.textContent = char;
          wordSpan.appendChild(charSpan);
          allChars.push(charSpan);
        });
      } else {
        wordSpan.textContent = segment;
      }

      el.appendChild(wordSpan);
      wordSpans.push(wordSpan);
      allWords.push(wordSpan);
    });

    // Line detection: group words by their offsetTop
    if (types.includes("lines") && options.linesClass) {
      const lineGroups = new Map<number, HTMLElement[]>();

      wordSpans.forEach((ws) => {
        const top = ws.getBoundingClientRect().top;
        // Round to avoid sub-pixel differences
        const key = Math.round(top);
        if (!lineGroups.has(key)) lineGroups.set(key, []);
        lineGroups.get(key)!.push(ws);
      });

      // Wrap each line group in a div
      el.innerHTML = "";
      const sortedKeys = Array.from(lineGroups.keys()).sort((a, b) => a - b);

      sortedKeys.forEach((key) => {
        const lineDiv = document.createElement("div");
        lineDiv.className = options.linesClass || "split-line";
        lineDiv.style.overflow = "hidden";
        lineGroups.get(key)!.forEach((wordEl, i) => {
          if (i > 0) lineDiv.appendChild(document.createTextNode(" "));
          lineDiv.appendChild(wordEl);
        });
        el.appendChild(lineDiv);
        allLines.push(lineDiv);
      });
    }
  });

  return {
    chars: allChars,
    words: allWords,
    lines: allLines,
    revert: () => revertFns.forEach((fn) => fn()),
  };
}

function resolveTargets(
  target: string | HTMLElement | HTMLElement[]
): HTMLElement[] {
  if (typeof target === "string") {
    return Array.from(document.querySelectorAll<HTMLElement>(target));
  }
  if (Array.isArray(target)) return target;
  return [target];
}
