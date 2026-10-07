"use client";
export default function FilterBar({
  tags,
  activeTag,
  onTagChange,
}: {
  tags: string[];
  activeTag: string;
  onTagChange: (tag: string) => void;
}) {
  return (
    <div className="tag-filter" role="group" aria-label="イベントの種類">
      {["all", ...tags].map((tag) => (
        <button key={tag} aria-pressed={activeTag === tag} onClick={() => onTagChange(tag)}>
          {tag === "all" ? "すべて" : tag}
        </button>
      ))}
    </div>
  );
}
