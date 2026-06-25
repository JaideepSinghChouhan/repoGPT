"use client";

import { useEffect, useState } from "react";
import {
  Folder,
  FolderGit2,
  FileCode2,
  Brain,
  Database,
  CheckCircle2,
} from "lucide-react";

const steps = [
  {
    title: "Cloning Repository",
    icon: Folder,
  },
  {
    title: "Scanning Files",
    icon: FolderGit2,
  },
  {
    title: "Chunking Code",
    icon: FileCode2,
  },
  {
    title: "Generating Embeddings",
    icon: Brain,
  },
  {
    title: "Building Knowledge Base",
    icon: Database,
  },
];

export default function IndexingOverlay() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        return prev;
      });

      setProgress((prev) => {
        if (prev >= 95) return 95;
        return prev + 18;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] bg-background/90 backdrop-blur-md flex items-center justify-center">
      <div className="w-full max-w-xl glass-panel rounded-3xl p-8 border border-outline-variant">

        <div className="flex items-center gap-3 mb-6">
          <Brain className="w-8 h-8 text-primary animate-pulse" />
          <div>
            <h2 className="text-2xl font-bold text-on-surface">
              Indexing Repository
            </h2>
            <p className="text-sm text-on-surface-variant">
              This may take 1-3 minutes for large repositories.
            </p>
          </div>
        </div>

        <div className="mb-8">
          <div className="w-full h-3 bg-surface-container-low rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-1000"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          <div className="mt-2 text-right text-xs text-on-surface-variant">
            {progress}%
          </div>
        </div>

        <div className="space-y-4">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.title}
                className="flex items-center gap-3"
              >
                {index < currentStep ? (
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                ) : (
                  <Icon
                    className={`w-5 h-5 ${
                      index === currentStep
                        ? "text-primary animate-pulse"
                        : "text-outline"
                    }`}
                  />
                )}

                <span
                  className={`text-sm ${
                    index <= currentStep
                      ? "text-on-surface"
                      : "text-outline"
                  }`}
                >
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-8 p-4 rounded-xl bg-primary/5 border border-primary/10">
          <p className="font-mono text-xs text-primary">
            {">"} RepoGPT is analyzing your codebase...
          </p>
        </div>
      </div>
    </div>
  );
}