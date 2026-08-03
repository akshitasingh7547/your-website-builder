import { useMemo } from "react";
import { useLocalState } from "./local-store";
import { TRACKS, WEEK_PLAN, type TrackId } from "./data";

export const dateKey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export type MinuteLog = Record<string, Partial<Record<TrackId, number>>>;
export type BlockLog = Record<string, number[]>;
export type Task = { id: string; text: string; track: TrackId; done: boolean };

export function useMinuteLog() {
  const [log, setLog, ready] = useLocalState<MinuteLog>("fd:minutes", {});

  const addMinutes = (track: TrackId, minutes: number, day = dateKey()) =>
    setLog((prev) => ({
      ...prev,
      [day]: { ...prev[day], [track]: Math.max(0, (prev[day]?.[track] ?? 0) + minutes) },
    }));

  const today = log[dateKey()] ?? {};
  const totalToday = TRACKS.reduce((sum, t) => sum + (today[t.id] ?? 0), 0);

  const streak = useMemo(() => {
    let count = 0;
    const cursor = new Date();
    for (let i = 0; i < 400; i++) {
      const day = log[dateKey(cursor)];
      const total = day ? Object.values(day).reduce((a, b) => a + (b ?? 0), 0) : 0;
      if (total > 0) count += 1;
      else if (i > 0) break;
      else if (count === 0 && i === 0) {
        // today may still be empty — keep counting from yesterday
      }
      cursor.setDate(cursor.getDate() - 1);
    }
    return count;
  }, [log]);

  const last7 = useMemo(() => {
    const days: { key: string; label: string; total: number }[] = [];
    const cursor = new Date();
    cursor.setDate(cursor.getDate() - 6);
    for (let i = 0; i < 7; i++) {
      const key = dateKey(cursor);
      const day = log[key];
      days.push({
        key,
        label: cursor.toLocaleDateString(undefined, { weekday: "narrow" }),
        total: day ? Object.values(day).reduce((a, b) => a + (b ?? 0), 0) : 0,
      });
      cursor.setDate(cursor.getDate() + 1);
    }
    return days;
  }, [log]);

  return { log, today, totalToday, streak, last7, addMinutes, ready };
}

export function useTodayBlocks() {
  const [done, setDone, ready] = useLocalState<BlockLog>("fd:blocks", {});
  const day = dateKey();
  const blocks = WEEK_PLAN[new Date().getDay()] ?? [];
  const doneToday = done[day] ?? [];

  const toggle = (index: number) =>
    setDone((prev) => {
      const current = prev[day] ?? [];
      return {
        ...prev,
        [day]: current.includes(index) ? current.filter((i) => i !== index) : [...current, index],
      };
    });

  return { blocks, doneToday, toggle, ready };
}

export function useTasks() {
  const [tasks, setTasks, ready] = useLocalState<Task[]>("fd:tasks", []);

  const add = (text: string, track: TrackId) =>
    setTasks((prev) => [
      ...prev,
      { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, text, track, done: false },
    ]);
  const toggle = (id: string) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const remove = (id: string) => setTasks((prev) => prev.filter((t) => t.id !== id));

  return { tasks, add, toggle, remove, ready };
}

export function useBookProgress() {
  const [pages, setPages, ready] = useLocalState<Record<string, number>>("fd:books", {});
  const setPage = (slug: string, page: number) =>
    setPages((prev) => ({ ...prev, [slug]: Math.max(0, Math.round(page) || 0) }));
  return { pages, setPage, ready };
}

export function formatMinutes(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}
