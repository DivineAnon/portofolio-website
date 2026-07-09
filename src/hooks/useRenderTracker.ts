import { useEffect, useRef } from "react";

/**
 * Custom React hook to measure and log the rendering times of portfolio sections.
 * This hooks into high-precision performance metrics and dispatches an event
 * for live telemetry visualization in the admin dashboard.
 * 
 * @param sectionName The name or identifier of the section being tracked.
 */
export function useRenderTracker(sectionName: string) {
  const renderStartTime = useRef<number>(performance.now());

  // Record time before the upcoming render cycle commits
  renderStartTime.current = performance.now();

  useEffect(() => {
    const renderEndTime = performance.now();
    const duration = renderEndTime - renderStartTime.current;

    // Output formatted cyber-telemetry stats to console
    console.log(
      `%c[Telemetry] %c${sectionName.toUpperCase()} %cSection Render Time: %c${duration.toFixed(3)} ms`,
      "color: #22d3ee; font-weight: bold;",
      "color: #e2e8f0; font-weight: bold; background-color: #1e293b; padding: 1px 4px; rounded: 4px;",
      "color: #94a3b8;",
      duration > 16 
        ? "color: #f43f5e; font-weight: bold;" 
        : duration > 8 
          ? "color: #fbbf24; font-weight: bold;" 
          : "color: #34d399; font-weight: bold;"
    );

    // Dispatch telemetry report event for the on-screen dashboard and debugging analytics
    const telemetryEvent = new CustomEvent("portfolio-telemetry-report", {
      detail: {
        sectionName,
        duration,
        timestamp: new Date().toLocaleTimeString(),
        status: duration > 16 ? "WARN" : duration > 8 ? "MODERATE" : "OPTIMAL",
      },
    });
    window.dispatchEvent(telemetryEvent);
  });
}
