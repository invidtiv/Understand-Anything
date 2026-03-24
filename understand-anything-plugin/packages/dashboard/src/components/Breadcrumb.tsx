import { useCallback, useEffect } from "react";
import { useDashboardStore } from "../store";
import type { ViewMode } from "../store";

export default function Breadcrumb() {
  const navigationLevel = useDashboardStore((s) => s.navigationLevel);
  const activeLayerId = useDashboardStore((s) => s.activeLayerId);
  const viewMode = useDashboardStore((s) => s.viewMode);
  const graph = useDashboardStore((s) => s.graph);
  const navigateToOverview = useDashboardStore((s) => s.navigateToOverview);
  const setViewMode = useDashboardStore((s) => s.setViewMode);

  const activeLayer = graph?.layers.find((l) => l.id === activeLayerId);

  // Escape key to go back to overview (only in graph mode)
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (
        e.key === "Escape" &&
        viewMode === "graph" &&
        navigationLevel === "layer-detail"
      ) {
        navigateToOverview();
      }
    },
    [viewMode, navigationLevel, navigateToOverview],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleViewToggle = useCallback(
    (mode: ViewMode) => {
      setViewMode(mode);
    },
    [setViewMode],
  );

  return (
    <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
      {/* View mode toggle */}
      <div className="flex items-center rounded-full bg-elevated border border-border-subtle shadow-lg overflow-hidden">
        <button
          onClick={() => handleViewToggle("graph")}
          className={`px-3 py-2 text-[10px] font-semibold uppercase tracking-wider transition-colors ${
            viewMode === "graph"
              ? "bg-gold/20 text-gold"
              : "text-text-muted hover:text-text-secondary"
          }`}
        >
          Graph
        </button>
        <div className="w-px h-4 bg-border-subtle" />
        <button
          onClick={() => handleViewToggle("flow")}
          className={`px-3 py-2 text-[10px] font-semibold uppercase tracking-wider transition-colors ${
            viewMode === "flow"
              ? "bg-gold/20 text-gold"
              : "text-text-muted hover:text-text-secondary"
          }`}
        >
          Flow
        </button>
      </div>

      {/* Navigation breadcrumb (only in graph mode) */}
      {viewMode === "graph" && navigationLevel === "overview" && (
        <div className="px-4 py-2 rounded-full bg-elevated border border-border-subtle text-xs font-semibold tracking-wider uppercase text-text-secondary shadow-lg">
          Project Overview
        </div>
      )}

      {viewMode === "graph" && navigationLevel === "layer-detail" && (
        <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-elevated border border-gold/30 text-xs font-semibold tracking-wider uppercase shadow-lg">
          <button
            onClick={navigateToOverview}
            className="text-gold hover:text-gold-bright transition-colors"
          >
            Project
          </button>
          <span className="text-text-muted">›</span>
          <span className="text-text-primary">
            {activeLayer?.name ?? "Layer"}
          </span>
          <span className="text-text-muted ml-1 text-[10px] normal-case tracking-normal">
            (Esc to go back)
          </span>
        </div>
      )}

      {viewMode === "flow" && (
        <div className="px-4 py-2 rounded-full bg-elevated border border-border-subtle text-xs font-semibold tracking-wider uppercase text-text-secondary shadow-lg">
          Request Flow
        </div>
      )}
    </div>
  );
}
