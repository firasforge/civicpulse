"use client";

import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { CivicReport, HotspotCluster } from "@/lib/types";

interface LeafletMapWrapperProps {
  reports: CivicReport[];
  clusters: HotspotCluster[];
  selectedCluster: HotspotCluster | null;
  onSelectReport: (reportId: string) => void;
  onSelectCluster: (cluster: HotspotCluster) => void;
  centerCoord?: { lat: number; lng: number } | null;
}

export function LeafletMapWrapper({
  reports,
  clusters,
  selectedCluster,
  onSelectReport,
  onSelectCluster,
  centerCoord,
}: LeafletMapWrapperProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const clustersLayerRef = useRef<L.LayerGroup | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center on downtown metro grid (Main St)
    const map = L.map(mapContainerRef.current, {
      center: [40.7145, -74.006],
      zoom: 15,
      zoomControl: true,
    });

    // OpenStreetMap free public tile server (No API key required)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    clustersLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Center pan when coordinate prop changes
  useEffect(() => {
    if (mapInstanceRef.current && centerCoord) {
      mapInstanceRef.current.setView([centerCoord.lat, centerCoord.lng], 17, {
        animate: true,
      });
    }
  }, [centerCoord]);

  // Render Markers & Cluster Hotspots
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !markersLayerRef.current || !clustersLayerRef.current) return;

    markersLayerRef.current.clearLayers();
    clustersLayerRef.current.clearLayers();

    // 1. Draw Cluster Hotspot Radii & Enclosures
    clusters.forEach((cluster) => {
      const isSelected = selectedCluster?.id === cluster.id;
      const circle = L.circle([cluster.center.lat, cluster.center.lng], {
        radius: cluster.radiusMeters,
        color: isSelected ? "#38bdf8" : "#f43f5e",
        fillColor: isSelected ? "#0284c7" : "#e11d48",
        fillOpacity: isSelected ? 0.35 : 0.2,
        weight: isSelected ? 3 : 2,
        dashArray: isSelected ? undefined : "6, 6",
      });

      circle.on("click", () => {
        onSelectCluster(cluster);
        map.setView([cluster.center.lat, cluster.center.lng], 16, { animate: true });
      });

      circle.bindTooltip(
        `<div style="font-weight:bold; color: #fff;">${cluster.name}</div>
         <div style="font-size:11px; color:#cbd5e1;">${cluster.reportCount} Correlated Reports (Severity ${cluster.severityScore}/100)</div>`,
        { sticky: true, className: "custom-leaflet-tooltip" }
      );

      circle.addTo(clustersLayerRef.current!);
    });

    // 2. Draw Individual Report Pins
    reports.forEach((report) => {
      const isCritical = report.priority === "Critical";
      const isHigh = report.priority === "High";

      // Color selection
      const pinColor = isCritical
        ? "#f43f5e"
        : isHigh
        ? "#f59e0b"
        : report.priority === "Medium"
        ? "#38bdf8"
        : "#10b981";

      const pinIconHtml = `
        <div style="
          position: relative;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: ${pinColor};
          border: 2px solid #ffffff;
          border-radius: 50%;
          box-shadow: 0 4px 14px rgba(0,0,0,0.5);
          cursor: pointer;
          ${isCritical ? "animation: pulse 1.5s infinite;" : ""}
        ">
          <div style="width: 8px; height: 8px; background: #ffffff; border-radius: 50%;"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: "custom-div-icon",
        html: pinIconHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([report.location.lat, report.location.lng], {
        icon: customIcon,
      });

      // Rich Glassmorphic Popup
      const popupHtml = `
        <div style="font-family: inherit; min-width: 220px; padding: 4px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 6px;">
            <span style="font-size: 11px; font-weight: bold; color: #38bdf8; font-family: monospace;">${report.id}</span>
            <span style="font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 9999px; background: ${pinColor}33; color: ${pinColor};">
              ${report.priority} (${report.priorityScore})
            </span>
          </div>
          <h4 style="font-size: 13px; font-weight: bold; color: #f8fafc; margin: 0 0 4px 0; line-height: 1.2;">
            ${report.title}
          </h4>
          <p style="font-size: 11px; color: #94a3b8; margin: 0 0 6px 0;">
            ${report.location.street} • ${report.category}
          </p>
          <div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid rgba(255,255,255,0.1); display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size: 11px; color: #cbd5e1;">Status: <strong>${report.status}</strong></span>
            <button id="view-report-${report.id}" style="
              font-size: 10px;
              font-weight: bold;
              background: #38bdf8;
              color: #0f172a;
              border: none;
              padding: 4px 8px;
              border-radius: 6px;
              cursor: pointer;
            ">Details &rarr;</button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on("popupopen", () => {
        const btn = document.getElementById(`view-report-${report.id}`);
        if (btn) {
          btn.onclick = () => onSelectReport(report.id);
        }
      });

      marker.addTo(markersLayerRef.current!);
    });
  }, [reports, clusters, selectedCluster, onSelectReport, onSelectCluster]);

  return <div ref={mapContainerRef} className="w-full h-full" />;
}
