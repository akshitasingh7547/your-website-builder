import { useCallback, useEffect, useRef, useState } from "react";

/**
 * localStorage-backed state that is SSR-safe: the first render always uses the
 * fallback, then hydrates from storage inside an effect.
 */
export function useLocalState<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(fallback);
  const [ready, setReady] = useState(false);
  const keyRef = useRef(key);

  useEffect(() => {
    keyRef.current = key;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) setValue(JSON.parse(raw) as T);
    } catch {
      /* ignore corrupt values */
    }
    setReady(true);
  }, [key]);

  const update = useCallback((next: T | ((prev: T) => T)) => {
    setValue((prev) => {
      const resolved = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
      try {
        window.localStorage.setItem(keyRef.current, JSON.stringify(resolved));
      } catch {
        /* storage full or unavailable */
      }
      return resolved;
    });
  }, []);

  return [value, update, ready] as const;
}
