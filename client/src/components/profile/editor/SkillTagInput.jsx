import React, { useMemo, useState } from "react";

function cleanTag(value) {
  return value.trim().replace(/\s+/g, " ");
}

export default function SkillTagInput({ value = [], onChange, placeholder = "Type a skill and press Enter" }) {
  const [draft, setDraft] = useState("");

  const tags = useMemo(() => {
    if (!Array.isArray(value)) return [];
    return value.filter(Boolean);
  }, [value]);

  const addTag = () => {
    const normalized = cleanTag(draft);
    if (!normalized) return;
    if (tags.some((tag) => tag.toLowerCase() === normalized.toLowerCase())) {
      setDraft("");
      return;
    }
    onChange?.([...tags, normalized]);
    setDraft("");
  };

  const removeTag = (tagToRemove) => {
    onChange?.(tags.filter((tag) => tag !== tagToRemove));
  };

  const onKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addTag();
    }
    if (event.key === "Backspace" && !draft && tags.length > 0) {
      onChange?.(tags.slice(0, -1));
    }
  };

  return (
    <div className="rounded-xl border border-slate-300 bg-white px-3 py-2">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="rounded-full bg-white/15 px-1 text-[11px] leading-none hover:bg-white/25"
              aria-label={`Remove ${tag}`}
            >
              x
            </button>
          </span>
        ))}
        <input
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={onKeyDown}
          onBlur={addTag}
          placeholder={placeholder}
          className="min-w-[180px] flex-1 border-none bg-transparent text-sm text-slate-700 outline-none"
        />
      </div>
    </div>
  );
}
