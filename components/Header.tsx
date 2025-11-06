import { Bot, Activity, Zap } from "lucide-react";
import { ThemeToggle, useTheme } from "./ThemeProvider";

export const Header = () => {
  const {theme} = useTheme();
  return (
    <header className={`absolute top-0 left-0 right-0 z-20 glass-header ${theme === "dark"
      ? "bg-black text-white"
      : "bg-white text-black"}`}>
      <div className="flex items-center justify-between p-4 md:p-2">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="relative">
            <h1 className="text-xl md:text-3xl font-bold font-headline text-transparent bg-linear-to-r from-primary to-primary bg-clip-text">
              Latency Topology Visualizer
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground font-medium opacity-90 group-hover:opacity-100 transition-opacity duration-300">
              Visualizing Global Crypto Exchange Infrastructure
            </p>
            <div className="absolute -bottom-1 left-0 h-0.5 bg-linear-to-r from-transparent via-primary/50 to-transparent w-0 group-hover:w-full transition-all duration-500" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle className="bg-background/50 backdrop-blur-sm border-primary/10 hover:border-primary/30" />
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/50 backdrop-blur-sm border border-primary/10">
            <Activity className="w-3 h-3 text-green-400 animate-pulse" />
            <span className="text-xs text-green-400 font-medium">Active</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 backdrop-blur-sm border border-green-500/20">
            <div className="relative">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping opacity-75" />
            </div>
            <span className="text-xs text-green-400 font-medium hidden md:inline">
              Live Data
            </span>
            <Zap
              className="w-3 h-3 text-green-400 animate-bounce hidden lg:inline"
              style={{ animationDelay: "0.2s" }}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient-x {
          0%,
          100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }

        @keyframes glow {
          0%,
          100% {
            filter: drop-shadow(0 0 5px currentColor);
          }
          50% {
            filter: drop-shadow(0 0 15px currentColor)
              drop-shadow(0 0 25px currentColor);
          }
        }

        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        .animate-shimmer {
          background-size: 200% 100%;
          animation: shimmer 2s ease-in-out infinite;
        }

        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
      `}</style>
    </header>
  );
};