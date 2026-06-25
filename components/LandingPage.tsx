"use client";

import React, { useState } from "react";
import { Terminal, ArrowRight, Play, CheckCircle2, Shield, MessageSquare, Code, Layers, Sparkles, LogIn } from "lucide-react";
import { loginWithGithub } from "@/lib/auth/loginWithGithub";


export default function LandingPage() {
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);
  const [demoStep, setDemoStep] = useState(0);

  const demoSteps = [
    {
      code: `const repoGPT = new Agent({
  context: "entire_workspace",
  model: "gemini-3.5-flash"
});`,
      aiResponse: "RepoGPT: Ready to scan and index your workspace."
    },
    {
      code: `// Analyzing legacy codebase...
await repoGPT.index("./src");`,
      aiResponse: "RepoGPT Assistant: Indexed 452 files. I notice your 'AuthMiddleware' has a potential memory leak in the token invalidation logic. Would you like me to suggest a fix?"
    },
    {
      code: `// Correcting AuthMiddleware memory leak...
authService.teardownWSConnections();`,
      aiResponse: "RepoGPT Assistant: Memory leak patched. All active WS connections will now tear down cleanly when AuthMiddleware unmounts!"
    }
  ];

  const handleNextDemoStep = () => {
    setDemoStep((prev) => (prev + 1) % demoSteps.length);
  };

  return (
    <div className="min-h-screen bg-[#0d141d] text-on-surface select-none">
      {/* Background Decorative Lighting */}
      <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -z-10 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center pt-24 pb-16 px-6 text-center overflow-hidden max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-surface-container-highest/50 px-4 py-1.5 rounded-full border border-outline-variant/50 mb-6 animate-fade-in">
          <span className="flex h-2.5 w-2.5 rounded-full bg-primary animate-pulse"></span>
          <span className="text-xs font-geist text-primary uppercase tracking-wider font-semibold">v2.0 Beta Now Live</span>
        </div>

        <h1 className="font-sans font-bold text-5xl md:text-7xl leading-tight md:leading-[1.1] text-on-surface mb-6 tracking-tight">
          Your codebase, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            now with superpowers.
          </span>
        </h1>

        <p className="font-sans text-lg text-on-surface-variant max-w-2xl mx-auto mb-10 leading-relaxed">
          Instantly index your entire repository and chat with your code. RepoGPT understands dependencies, context, and intent to help you ship faster.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md mx-auto">
          <button
            onClick={loginWithGithub}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-on-primary px-8 py-4 rounded-xl font-geist text-base font-bold hover:brightness-110 hover:scale-[1.02] transition-all primary-glow active:scale-95 group cursor-pointer"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
          
          <button
            onClick={() => {
              setIsPlayingDemo(true);
              handleNextDemoStep();
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-surface-container-low text-on-surface border border-outline-variant/60 px-8 py-4 rounded-xl font-geist text-base hover:bg-surface-variant/80 hover:border-primary/50 transition-all active:scale-95 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current text-primary" />
            Watch Demo Walkthrough
          </button>
        </div>

        {/* Dashboard Preview / Code Editor Interactive Container */}
        <div className="relative z-10 mt-16 w-full max-w-4xl mx-auto rounded-t-2xl border-x border-t border-outline-variant bg-surface-container-low shadow-2xl overflow-hidden transition-all duration-500 hover:border-primary/30">
          {/* Editor Header */}
          <div className="h-11 bg-surface-container-high border-b border-outline-variant flex items-center px-4 justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
              <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
              <div className="ml-4 px-3 py-1 bg-surface-container-highest rounded text-[11px] font-mono text-on-surface-variant">
                repo-gpt / src / engine.ts
              </div>
            </div>
            <span className="text-[10px] uppercase font-bold text-outline">Interactive Playground</span>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="md:col-span-2 space-y-4">
              {/* Code Box */}
              <div 
                onClick={handleNextDemoStep}
                className="bg-surface-container-lowest rounded-xl border border-outline-variant/60 p-4 font-mono text-sm text-on-surface-variant cursor-pointer hover:border-primary/50 transition-all relative group"
              >
                <div className="absolute top-2 right-2 text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  Click to step code
                </div>
                <pre className="text-xs md:text-sm leading-relaxed whitespace-pre-wrap">
                  {demoSteps[demoStep].code}
                </pre>
              </div>

              {/* AI Bubble */}
              <div className="bg-primary/5 border border-primary/20 p-4 rounded-2xl flex gap-3 animate-fade-in">
                <Sparkles className="text-primary w-6 h-6 shrink-0 mt-1" />
                <div>
                  <p className="text-primary font-bold text-xs font-geist mb-1 flex items-center gap-1.5">
                    RepoGPT Assistant <span className="text-[9px] bg-primary/20 text-primary px-1.5 py-0.5 rounded font-normal">Online</span>
                  </p>
                  <p className="text-sm leading-relaxed text-on-surface/90">
                    {demoSteps[demoStep].aiResponse}
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar Context Indicator */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4">
              <h4 className="font-geist text-xs text-on-surface mb-3 flex items-center gap-2 font-bold uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                Indexed Context
              </h4>
              <div className="space-y-3 opacity-75 text-xs">
                <div className="flex justify-between items-center bg-surface-container-high p-2 rounded">
                  <span className="font-mono text-on-surface-variant">src/auth.ts</span>
                  <span className="text-[10px] text-green-400 font-semibold">Indexed</span>
                </div>
                <div className="flex justify-between items-center bg-surface-container-high p-2 rounded">
                  <span className="font-mono text-on-surface-variant">src/App.tsx</span>
                  <span className="text-[10px] text-green-400 font-semibold">Indexed</span>
                </div>
                <div className="flex justify-between items-center bg-surface-container-high p-2 rounded">
                  <span className="font-mono text-on-surface-variant">package.json</span>
                  <span className="text-[10px] text-green-400 font-semibold">Indexed</span>
                </div>
                <div className="border-t border-outline-variant/30 my-3"></div>
                <p className="text-[10px] text-on-surface-variant leading-relaxed">
                  Workspace scanning active. 452 files map parsed automatically.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section className="py-24 px-6 max-w-5xl mx-auto relative" id="features">
        <div className="text-center mb-16">
          <h2 className="font-sans font-bold text-3xl md:text-4xl text-on-surface mb-3">
            Built for modern engineers.
          </h2>
          <p className="text-on-surface-variant max-w-xl mx-auto">
            The ultimate developer companion that lives inside your terminal and editor.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
          {/* Large Feature */}
          <div className="md:col-span-4 bg-surface-container-low border border-outline-variant rounded-2xl p-8 flex flex-col justify-between overflow-hidden relative group hover:border-primary/40 transition-all">
            <div className="relative z-10">
              <Layers className="text-primary w-10 h-10 mb-4" />
              <h3 className="font-sans font-bold text-xl text-on-surface mb-2">Deep Repository Indexing</h3>
              <p className="text-on-surface-variant max-w-md text-sm leading-relaxed">
                RepoGPT creates a semantic map of your entire codebase, understanding imports, logic flows, and documentation across thousands of files.
              </p>
            </div>
            <div className="mt-8 relative z-10 flex gap-2 flex-wrap">
              {["TypeScript", "React", "Python", "Go", "Rust"].map((lang) => (
                <div key={lang} className="bg-surface-container-high border border-outline-variant rounded px-3 py-1 text-xs font-mono">
                  {lang}
                </div>
              ))}
            </div>
          </div>

          {/* Small Feature 1 */}
          <div className="md:col-span-2 bg-surface-container-low border border-outline-variant rounded-2xl p-8 hover:border-primary/40 transition-all flex flex-col justify-between">
            <div>
              <MessageSquare className="text-primary w-8 h-8 mb-4" />
              <h3 className="font-sans font-bold text-lg text-on-surface mb-2">Contextual Chat</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Ask questions about how specific features work and get answers with complete code citations.
              </p>
            </div>
            <span className="text-xs text-primary font-bold mt-4 flex items-center gap-1 cursor-pointer" onClick={loginWithGithub}>
              Launch interactive chat <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Small Feature 2 */}
          <div className="md:col-span-2 bg-surface-container-low border border-outline-variant rounded-2xl p-8 hover:border-primary/40 transition-all flex flex-col justify-between">
            <div>
              <Code className="text-primary w-8 h-8 mb-4" />
              <h3 className="font-sans font-bold text-lg text-on-surface mb-2">Unit Test Generation</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Automatically generate robust test suites for your components with zero effort or configuration.
              </p>
            </div>
          </div>

          {/* Mid Feature */}
          <div className="md:col-span-4 bg-gradient-to-br from-secondary-container/10 to-surface-container-low border border-outline-variant rounded-2xl p-8 flex flex-col md:flex-row items-center gap-6 hover:border-primary/40 transition-all">
            <div className="flex-1">
              <Shield className="text-primary w-8 h-8 mb-4" />
              <h3 className="font-sans font-bold text-lg text-on-surface mb-2">Security & Privacy First</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-4">
                Your code never leaves your infrastructure. We offer SOC2 compliant cloud hosting or complete air-gapped on-premise solutions.
              </p>
              <button 
                className="text-primary text-xs font-bold flex items-center gap-1.5 hover:underline cursor-pointer"
                onClick={() => alert("Simulated: Security policy is SOC2 compliant, enterprise keys are fully isolated.")}
              >
                Read Security Whitepaper <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="w-full md:w-1/3 aspect-video bg-background rounded-xl border border-outline-variant overflow-hidden relative flex items-center justify-center p-4">
              <div className="space-y-2 w-full">
                <div className="h-2.5 bg-primary/10 rounded w-full animate-pulse"></div>
                <div className="h-2.5 bg-primary/25 rounded w-5/6"></div>
                <div className="h-2.5 bg-primary/10 rounded w-4/6"></div>
                <div className="h-2.5 bg-[#FF5F56]/15 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 max-w-4xl mx-auto">
        <div className="bg-surface-container border border-outline-variant rounded-3xl p-10 md:p-14 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-radial-gradient from-primary/10 to-transparent pointer-events-none"></div>
          
          <h2 className="font-sans font-bold text-3xl md:text-4xl text-on-surface mb-4 relative z-10">
            Stop searching. Start building.
          </h2>
          <p className="text-on-surface-variant text-base max-w-xl mx-auto mb-10 relative z-10">
            Join 50,000+ developers who are leveraging RepoGPT to master their complex codebases.
          </p>
          
          <div className="relative z-10">
            <button
              onClick={loginWithGithub}
              className="bg-primary text-on-primary px-8 py-4 rounded-xl font-geist text-base font-bold primary-glow hover:scale-[1.03] transition-all active:scale-95 flex items-center gap-3 mx-auto cursor-pointer"
            >
              <LogIn className="w-5 h-5" />
              Get Started with GitHub
            </button>
            <p className="mt-4 text-outline text-xs">No credit card required. Free instant sandbox.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
