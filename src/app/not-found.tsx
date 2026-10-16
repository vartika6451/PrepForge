import React from "react";
import Link from "next/link";
import { Flame, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center space-y-6 p-8 rounded-3xl border border-slate-800 bg-[#0c1220] shadow-xl">
        <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center mx-auto">
          <Flame className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono uppercase text-orange-400">404 Error</span>
          <h1 className="text-2xl font-bold text-white">Page or Resource Not Found</h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            The DSA pattern, technology guide, interview question, or project you requested could not be located in PrepForge.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-orange-500 hover:bg-orange-600 transition flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Home</span>
          </Link>
          <Link
            href="/dsa-patterns"
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 transition"
          >
            Browse Patterns
          </Link>
        </div>
      </div>
    </div>
  );
}
