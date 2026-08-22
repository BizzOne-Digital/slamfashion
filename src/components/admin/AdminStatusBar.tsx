"use client";

import { useEffect, useRef, useState } from "react";
import { Database, Loader2, RefreshCw, Save, WifiOff } from "lucide-react";
import type { SaveStatus } from "@/context/StoreContext";

interface AdminStatusBarProps {
  saveStatus: SaveStatus;
  saveError: string | null;
  dataSource: "database" | "defaults";
  dataWarning: string | null;
  onReload: () => Promise<void>;
}

export function AdminStatusBar({
  saveStatus,
  saveError,
  dataSource,
  dataWarning,
  onReload,
}: AdminStatusBarProps) {
  const [dbOk, setDbOk] = useState<boolean | null>(null);
  const [dbMessage, setDbMessage] = useState("");
  const [reloading, setReloading] = useState(false);
  const autoRetriedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/admin/db-health", { cache: "no-store" })
      .then((res) => res.json())
      .then((data: { ok?: boolean; message?: string }) => {
        if (cancelled) return;
        setDbOk(Boolean(data.ok));
        setDbMessage(data.message || "");
      })
      .catch(() => {
        if (cancelled) return;
        setDbOk(false);
        setDbMessage("Could not check database connection.");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (
      dbOk &&
      dataSource === "defaults" &&
      !autoRetriedRef.current &&
      !reloading
    ) {
      autoRetriedRef.current = true;
      setReloading(true);
      void onReload().finally(() => setReloading(false));
    }
  }, [dbOk, dataSource, onReload, reloading]);

  const handleReload = async () => {
    setReloading(true);
    try {
      await onReload();
    } finally {
      setReloading(false);
    }
  };

  const isChecking = dbOk === null;
  const isLive = dbOk && dataSource === "database";
  const needsReload = dbOk && dataSource === "defaults";

  let statusColor = "border-white/10 text-white/50";
  let statusIcon = <Loader2 className="h-3.5 w-3.5 animate-spin" />;
  let statusText = "Checking connection...";

  if (!isChecking) {
    if (saveStatus === "saving") {
      statusColor = "border-gold/30 bg-gold/10 text-gold";
      statusIcon = <Save className="h-3.5 w-3.5 animate-pulse" />;
      statusText = "Saving to database...";
    } else if (saveStatus === "saved") {
      statusColor = "border-green-400/30 bg-green-400/10 text-green-300";
      statusIcon = <Save className="h-3.5 w-3.5" />;
      statusText = "Saved";
    } else if (isLive) {
      statusColor = "border-green-400/30 bg-green-400/10 text-green-300";
      statusIcon = <Database className="h-3.5 w-3.5" />;
      statusText = "MongoDB connected · Live data";
    } else if (saveStatus === "error" && saveError) {
      statusColor = "border-red-400/30 bg-red-400/10 text-red-300";
      statusIcon = <WifiOff className="h-3.5 w-3.5" />;
      statusText = saveError;
    } else if (needsReload) {
      statusColor = "border-amber-400/30 bg-amber-400/10 text-amber-200";
      statusIcon = <Database className="h-3.5 w-3.5" />;
      statusText = reloading
        ? "MongoDB connected · Loading data..."
        : "MongoDB connected · Data not loaded yet";
    } else {
      statusColor = "border-red-400/30 bg-red-400/10 text-red-300";
      statusIcon = <WifiOff className="h-3.5 w-3.5" />;
      statusText = "MongoDB offline · Using defaults";
    }
  }

  return (
    <div className="mt-4 space-y-2">
      <div className="flex flex-wrap items-center gap-3">
        <div
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${statusColor}`}
        >
          {statusIcon}
          {statusText}
        </div>

        {needsReload && !reloading && saveStatus !== "saving" && (
          <button
            type="button"
            onClick={() => void handleReload()}
            className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 px-3 py-1.5 text-xs font-semibold text-gold transition-colors hover:bg-gold/10"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Reload from database
          </button>
        )}
      </div>

      {!isChecking && !isLive && dataWarning && saveStatus !== "error" && (
        <p className="text-xs text-white/40">{dataWarning}</p>
      )}

      {!isChecking && !dbOk && dbMessage && (
        <p className="text-xs text-white/40">{dbMessage}</p>
      )}
    </div>
  );
}
