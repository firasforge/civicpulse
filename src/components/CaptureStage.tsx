"use client";

import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Waves,
  Cone,
  Trash2,
  LightbulbOff,
  AlertTriangle,
  Upload,
  X,
  MapPin,
  Sparkles,
  CheckCircle2,
  Clock,
  ShieldAlert,
  ArrowRight,
  Flame,
  Zap,
  LocateFixed,
} from "lucide-react";
import confetti from "canvas-confetti";
import { ReportCategory, AuthUser } from "@/lib/types";
import { saveReportToSupabase } from "@/lib/supabase";

// Dynamic import for Leaflet-based Mini Pin Picker
const DynamicMiniPinPickerMap = dynamic(
  () => import("./MiniPinPickerMap").then((m) => m.MiniPinPickerMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-44 rounded-xl glass-panel flex items-center justify-center text-xs text-slate-400">
        Loading Pin Selector Map...
      </div>
    ),
  }
);

interface CaptureStageProps {
  onSuccess: (newReportId: string) => void;
  onViewOnMap: (lat: number, lng: number) => void;
  user?: AuthUser | null;
}

const CATEGORIES: { label: ReportCategory; icon: React.ElementType; description: string; color: string }[] = [
  {
    label: "Waterlogging",
    icon: Waves,
    description: "Flooded roads, clogged storm grates, pooling water",
    color: "from-blue-500/20 to-cyan-500/20 text-cyan-400 border-cyan-500/30",
  },
  {
    label: "Damaged Roads",
    icon: Cone,
    description: "Deep potholes, sinkholes, road collapse, missing covers",
    color: "from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30",
  },
  {
    label: "Garbage Overflow",
    icon: Trash2,
    description: "Dumping, overflowing dumpsters, toxic waste, debris",
    color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30",
  },
  {
    label: "Broken Streetlights",
    icon: LightbulbOff,
    description: "Unlit fixtures, live wires, bent light poles, strobing",
    color: "from-yellow-500/20 to-amber-500/20 text-yellow-400 border-yellow-500/30",
  },
  {
    label: "Disrupted Services",
    icon: AlertTriangle,
    description: "Water main rupture, transit halted, power cuts, signals",
    color: "from-purple-500/20 to-indigo-500/20 text-purple-400 border-purple-500/30",
  },
];

const PRESET_DEMOS = [
  {
    title: "⚡ Critical Sparking Wire (School Zone)",
    category: "Broken Streetlights" as ReportCategory,
    reportTitle: "Live 240V Wire Dangling Over Sidewalk at Lincoln High",
    description: "Heavy wind snapped an overhead conductor outside Lincoln High School. Sparks and smoke are shooting across the sidewalk where children are walking home. Immediate electrocution risk!",
    street: "Oak Street",
    address: "128 Oak Street, Adjacent to Lincoln High East Gate",
    lat: 40.7188,
    lng: -74.0095,
  },
  {
    title: "🌊 Main Street Flood Cluster Trigger",
    category: "Waterlogging" as ReportCategory,
    reportTitle: "Flash Flood Stalling Vehicles on Main & 4th Avenue",
    description: "Storm drain inlet completely blocked with mud and construction sediment. Over 2 feet of standing water trapped two cars at the intersection. Commercial storefronts threatened.",
    street: "Main Street",
    address: "Main St & 4th Avenue Intersection",
    lat: 40.7128,
    lng: -74.006,
  },
  {
    title: "🕳️ Lethal Manhole Fall Hazard",
    category: "Damaged Roads" as ReportCategory,
    reportTitle: "Missing 30-inch Cast Iron Sewer Cover on 5th Ave Bike Lane",
    description: "A sheer 12-foot drop into the active sewer is completely open in the middle of the protected 5th Avenue bicycle lane. High collision risk for cyclists in dusk light.",
    street: "5th Avenue",
    address: "310 5th Avenue Bike Corridor",
    lat: 40.7145,
    lng: -74.0035,
  },
];

export function CaptureStage({ onSuccess, onViewOnMap, user }: CaptureStageProps) {
  const [category, setCategory] = useState<ReportCategory>("Waterlogging");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [street, setStreet] = useState("Main Street");
  const [address, setAddress] = useState("Intersection of Main St & 5th Ave");
  const [lat, setLat] = useState(40.7132);
  const [lng, setLng] = useState(-74.0058);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [citizenName, setCitizenName] = useState(user?.name || "");
  const [citizenEmail, setCitizenEmail] = useState(user?.email || "");

  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => {
        if (user.name) setCitizenName(user.name);
        if (user.email) setCitizenEmail(user.email);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [user]);
  
  // Anti double-submission lock state & ref
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);

  // GPS Geolocation state
  const [isLocating, setIsLocating] = useState(false);
  const [locationSuccess, setLocationSuccess] = useState<string | null>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<{
    id: string;
    priority: string;
    score: number;
    summary: string;
    reasons: string[];
    duplicateDetected?: boolean;
    duplicateMatchId?: string;
  } | null>(null);

  // Quick preset loader for fast hackathon demo
  const handleApplyPreset = (preset: (typeof PRESET_DEMOS)[0]) => {
    setCategory(preset.category);
    setTitle(preset.reportTitle);
    setDescription(preset.description);
    setStreet(preset.street);
    setAddress(preset.address);
    setLat(preset.lat);
    setLng(preset.lng);
    setLocationSuccess(null);
  };

  // GPS Exact Location Detector
  const handleDetectGPS = () => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setErrorMessage("Geolocation is not supported by your browser environment.");
      return;
    }

    setIsLocating(true);
    setErrorMessage(null);
    setLocationSuccess(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const detectedLat = Number(position.coords.latitude.toFixed(6));
        const detectedLng = Number(position.coords.longitude.toFixed(6));
        setLat(detectedLat);
        setLng(detectedLng);
        setIsLocating(false);
        const accuracy = Math.round(position.coords.accuracy);
        setLocationSuccess(`Exact GPS Locked: (${detectedLat}, ${detectedLng}) ±${accuracy}m accuracy`);
      },
      (error) => {
        setIsLocating(false);
        setErrorMessage(
          `GPS acquisition notice: ${error.message}. You can still drag the pin or click on the map to set exact location.`
        );
      },
      { enableHighAccuracy: true, timeout: 9000, maximumAge: 0 }
    );
  };

  // Image Upload with base64 conversion
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("Image exceeds 5MB size limit.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Live Threat Assessment preview based on keywords
  const textToCheck = `${title} ${description}`.toLowerCase();
  const isHighThreat =
    textToCheck.includes("spark") ||
    textToCheck.includes("wire") ||
    textToCheck.includes("manhole") ||
    textToCheck.includes("submerged") ||
    textToCheck.includes("trapped") ||
    textToCheck.includes("gas") ||
    textToCheck.includes("school");

  // Guaranteed single-ticket submission handler (Zero double-firing)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingRef.current || isSubmitting) return; // Prevent double-click firing

    setErrorMessage(null);

    if (title.length < 4) {
      setErrorMessage("Title must be at least 4 characters long.");
      return;
    }
    if (description.length < 10) {
      setErrorMessage("Description must be at least 10 characters long.");
      return;
    }

    // Immediately lock submission state
    isSubmittingRef.current = true;
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          category,
          location: {
            lat,
            lng,
            street,
            address,
            zone: "Central",
          },
          imageUrl: imagePreview || undefined,
          citizenContact: {
            name: citizenName || undefined,
            email: citizenEmail || undefined,
          },
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        setErrorMessage(data.error || "Failed to submit complaint.");
        return;
      }

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#38bdf8", "#10b981", "#f59e0b", "#6366f1"],
      });

      setSuccessResult({
        id: data.report.id,
        priority: data.report.priority,
        score: data.report.priorityScore,
        summary: data.report.summary,
        reasons: data.report.priorityReasons,
        duplicateDetected: data.duplicateDetected,
        duplicateMatchId: data.duplicateMatch?.id,
      });

      if (data.report) {
        saveReportToSupabase(data.report).catch(() => {});
      }

      onSuccess(data.report.id);
    } catch (err) {
      console.error("Submission error:", err);
      setErrorMessage("Network error while submitting complaint.");
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6">
      {/* Target < 1 Minute Speed Callout */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl glass-panel-subtle border border-cyan-500/20 bg-gradient-to-r from-cyan-950/30 to-indigo-950/20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 border border-cyan-500/30">
            <Clock className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-100">
              Stage 1: Lightning-Fast Complaint Capture (&lt; 1 Minute)
            </h2>
            <p className="text-xs text-slate-400">
              Mobile-optimized submission with instant Gemini AI classification &amp; threat scoring.
            </p>
          </div>
        </div>

        {/* Demo Fast Fill Buttons */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">
            Quick Demos:
          </span>
          {PRESET_DEMOS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(p)}
              className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/5 hover:bg-cyan-500/20 hover:text-cyan-300 border border-white/10 transition-colors"
            >
              {p.title}
            </button>
          ))}
        </div>
      </div>

      {/* Success Modal / Card */}
      {successResult && (
        <div className="mb-8 p-6 rounded-2xl glass-panel border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-950/40 via-slate-900/80 to-slate-950 shadow-2xl relative overflow-hidden">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold tracking-wider text-emerald-400 uppercase">
                  Complaint Successfully Registered &amp; AI-Triage Completed
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Ticket #{successResult.id}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mt-1">
                {title}
              </h3>
              <p className="text-sm text-slate-300 mt-2">
                {successResult.summary}
              </p>

              {/* AI Triage Badges */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                    successResult.priority === "Critical"
                      ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                      : successResult.priority === "High"
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                      : "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Priority: {successResult.priority} ({successResult.score}/100)
                </span>

                {successResult.duplicateDetected && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                    <Sparkles className="w-3.5 h-3.5" />
                    Linked Duplicate of #{successResult.duplicateMatchId}
                  </span>
                )}
              </div>

              {/* Explainable Prioritization Factors */}
              {successResult.reasons.length > 0 && (
                <div className="mt-4 p-3 rounded-xl bg-slate-900/60 border border-white/5">
                  <h4 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    Explainable AI Prioritization Logic:
                  </h4>
                  <ul className="mt-1.5 space-y-1">
                    {successResult.reasons.map((r, i) => (
                      <li key={i} className="text-xs text-slate-400 flex items-start gap-1.5">
                        <span className="text-cyan-400 font-bold">•</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Actions */}
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => onViewOnMap(lat, lng)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors flex items-center gap-2 shadow-lg shadow-cyan-500/20"
                >
                  <MapPin className="w-4 h-4" />
                  View Live on Map &amp; Cluster
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSuccessResult(null);
                    setTitle("");
                    setDescription("");
                    setImagePreview(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                >
                  Submit Another Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Submission Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Category Selection */}
        <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-3">
          <label className="block text-sm font-semibold text-slate-200">
            1. Select Incident Category <span className="text-rose-400">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = category === cat.label;
              return (
                <button
                  key={cat.label}
                  type="button"
                  onClick={() => setCategory(cat.label)}
                  className={`text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                    isSelected
                      ? `bg-gradient-to-br ${cat.color} border-cyan-400 shadow-md shadow-cyan-500/10 ring-1 ring-cyan-400`
                      : "bg-slate-900/40 border-white/5 hover:border-white/20 hover:bg-slate-900/80"
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg shrink-0 ${
                      isSelected ? "bg-white/10" : "bg-slate-800/60 text-slate-400"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white leading-tight">
                      {cat.label}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                      {cat.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Details & Description */}
        <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <label htmlFor="report-title" className="block text-sm font-semibold text-slate-200">
              2. Complaint Details <span className="text-rose-400">*</span>
            </label>
            {isHighThreat && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse">
                <Flame className="w-3 h-3 text-rose-400" />
                Urgent Public Safety Keywords Detected
              </span>
            )}
          </div>

          <div>
            <label htmlFor="report-title" className="text-xs text-slate-400">
              Concise Headline / Subject
            </label>
            <input
              id="report-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Severe waterlogging at Main St & 4th Ave trapping vehicles"
              className="mt-1 w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm"
            />
          </div>

          <div>
            <div className="flex justify-between items-center text-xs text-slate-400">
              <label htmlFor="report-description">Detailed Description &amp; Visual Observations</label>
              <span className={description.length >= 10 ? "text-slate-500" : "text-amber-400"}>
                {description.length} chars (min 10)
              </span>
            </div>
            <textarea
              id="report-description"
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue, water depth, road damage dimensions, visible sparks, odor, or safety concerns..."
              className="mt-1 w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm"
            />
          </div>

          {/* Image Upload with Base64 Preview */}
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">
              Photo / Evidence Upload (Optional, Max 5MB)
            </label>
            {imagePreview ? (
              <div className="relative inline-block rounded-xl overflow-hidden border border-cyan-500/40 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagePreview}
                  alt="Evidence Preview"
                  className="w-48 h-32 object-cover"
                />
                <button
                  type="button"
                  onClick={() => setImagePreview(null)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="border-2 border-dashed border-white/10 hover:border-cyan-500/40 rounded-xl p-4 flex items-center justify-center gap-3 cursor-pointer transition-colors bg-slate-900/30">
                <Upload className="w-5 h-5 text-slate-400" />
                <span className="text-xs text-slate-300">
                  Click to upload or take a photo of the incident
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Step 3: Location Coordinates & GPS Pin Selector */}
        <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="block text-sm font-semibold text-slate-200">
              3. Location &amp; Interactive Pin Selector <span className="text-rose-400">*</span>
            </label>
            <button
              type="button"
              onClick={handleDetectGPS}
              disabled={isLocating}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold transition-all disabled:opacity-50"
            >
              <LocateFixed className={`w-3.5 h-3.5 ${isLocating ? "animate-spin" : ""}`} />
              <span>{isLocating ? "Acquiring GPS Fix..." : "Detect My Exact GPS Location"}</span>
            </button>
          </div>

          {locationSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{locationSuccess}</span>
            </div>
          )}

          {/* Mini Interactive Map Pin Selector */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Interactive Incident Pin (Click or drag to position)</span>
              <span className="font-mono text-cyan-400 font-semibold">
                {lat.toFixed(5)}, {lng.toFixed(5)}
              </span>
            </div>
            <DynamicMiniPinPickerMap
              lat={lat}
              lng={lng}
              onLocationChange={(newLat, newLng) => {
                setLat(newLat);
                setLng(newLng);
                setLocationSuccess(null);
              }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label htmlFor="report-street" className="text-xs text-slate-400">Street / Corridor</label>
              <input
                id="report-street"
                type="text"
                required
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="e.g., Main Street"
                className="mt-1 w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm"
              />
            </div>
            <div>
              <label htmlFor="report-address" className="text-xs text-slate-400">Address / Landmark</label>
              <input
                id="report-address"
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g., Opposite Central Bank, Main St & 4th"
                className="mt-1 w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Step 4: Submitter Contact */}
        <div className="p-6 rounded-2xl glass-panel-subtle border border-white/10 space-y-3">
          <label className="block text-sm font-semibold text-slate-300">
            4. Citizen Tracking Contact (Optional)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="submitter-name" className="text-xs text-slate-400">Your Name</label>
              <input
                id="submitter-name"
                type="text"
                value={citizenName}
                onChange={(e) => setCitizenName(e.target.value)}
                placeholder="Jane Citizen"
                className="mt-1 w-full px-4 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm"
              />
            </div>
            <div>
              <label htmlFor="submitter-email" className="text-xs text-slate-400">Email for Progress Alerts</label>
              <input
                id="submitter-email"
                type="email"
                value={citizenEmail}
                onChange={(e) => setCitizenEmail(e.target.value)}
                placeholder="jane@example.com"
                className="mt-1 w-full px-4 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-sm flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Submission Button - Immediate Disable on Click */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-base shadow-xl shadow-cyan-500/25 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              <span>Analyzing with Gemini AI Pipeline &amp; Routing...</span>
            </>
          ) : (
            <>
              <Zap className="w-5 h-5 fill-slate-950" />
              <span>Submit Civic Report &amp; Run Instant AI Triage</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
