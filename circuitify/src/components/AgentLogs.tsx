"use client";

import { AgentLog } from "@/lib/types";

interface Props {
  logs: AgentLog[];
}

export default function AgentLogs({ logs }: Props) {
  return (
    <section>
      <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-purple-400 inline-block" />
        AI Decision Trace
      </h2>
      <div className="bg-gray-800/60 backdrop-blur border border-gray-700/50 rounded-2xl p-5 space-y-3">
        {logs.map((log, i) => (
          <div key={i} className="flex items-start gap-3">
            {/* Status indicator */}
            <div className="mt-1 flex-shrink-0">
              {log.status === "done" && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-500/20 text-brand-400 text-xs">
                  ✓
                </span>
              )}
              {log.status === "running" && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/20">
                  <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
                </span>
              )}
              {log.status === "pending" && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-700/50 text-gray-600 text-xs">
                  ○
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm">{log.icon}</span>
                <span className="text-sm font-semibold text-gray-200">{log.agent}</span>
              </div>
              <p
                className={`text-xs mt-0.5 ${
                  log.status === "done" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {log.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
