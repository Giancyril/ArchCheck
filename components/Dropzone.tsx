"use client";

import React, { useState, useCallback } from "react";
import { useDropzone, FileRejection } from "react-dropzone";

interface DropzoneProps {
  onImageSelected: (base64Image: string) => void;
  onClear: () => void;
  disabled?: boolean;
  maxSizeBytes?: number;
}

const MAX_BYTES_DEFAULT = 10 * 1024 * 1024;

export default function Dropzone({
  onImageSelected,
  onClear,
  disabled = false,
  maxSizeBytes = MAX_BYTES_DEFAULT,
}: DropzoneProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const processFile = useCallback(
    (file: File) => {
      setErrorMessage(null);
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setPreview(base64);
        setFileName(file.name);
        setFileSize(file.size);
        onImageSelected(base64);
      };
      reader.onerror = () => setErrorMessage("Failed to read image file.");
      reader.readAsDataURL(file);
    },
    [onImageSelected]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length > 0) {
        const code = fileRejections[0].errors[0]?.code;
        if (code === "file-too-large")
          setErrorMessage(`File too large. Max ${(maxSizeBytes / 1048576).toFixed(0)}MB.`);
        else if (code === "file-invalid-type")
          setErrorMessage("Invalid type. Please upload PNG, JPG, WebP, or GIF.");
        else setErrorMessage(fileRejections[0].errors[0]?.message || "Upload error.");
        return;
      }
      if (acceptedFiles.length > 0) processFile(acceptedFiles[0]);
    },
    [maxSizeBytes, processFile]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/webp": [".webp"],
      "image/gif": [".gif"],
    },
    maxSize: maxSizeBytes,
    multiple: false,
    disabled,
  });

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    setFileName(null);
    setFileSize(null);
    setErrorMessage(null);
    onClear();
  };

  const formatSize = (b: number) =>
    b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1048576).toFixed(1)} MB`;

  if (preview) {
    return (
      <div className="dropzone-preview">
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 10,
              overflow: "hidden",
              border: "1px solid var(--border)",
              background: "rgba(0,0,0,0.5)",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Preview"
              style={{ width: "100%", height: "100%", objectFit: "contain", padding: 4 }}
            />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span className="badge badge-accent">✓ Ready</span>
              {fileSize && (
                <span style={{ fontSize: 11, color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>
                  {formatSize(fileSize)}
                </span>
              )}
            </div>
            <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {fileName}
            </p>
            <p style={{ fontSize: 11, color: "var(--text-3)", marginTop: 2 }}>
              Architecture diagram ready for AI analysis
            </p>
          </div>

          {!disabled && (
            <button
              type="button"
              onClick={handleRemove}
              style={{
                padding: "6px 12px",
                borderRadius: 8,
                border: "1px solid var(--border)",
                background: "transparent",
                color: "var(--text-3)",
                fontSize: 12,
                cursor: "pointer",
                transition: "all 0.15s ease",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.borderColor = "var(--critical)";
                (e.target as HTMLElement).style.color = "var(--critical)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.borderColor = "var(--border)";
                (e.target as HTMLElement).style.color = "var(--text-3)";
              }}
            >
              Change
            </button>
          )}
        </div>

        {errorMessage && (
          <p style={{ marginTop: 8, fontSize: 12, color: "var(--critical)", display: "flex", alignItems: "center", gap: 5 }}>
            <span>⚠️</span> {errorMessage}
          </p>
        )}
      </div>
    );
  }

  return (
    <div>
      <div
        {...getRootProps()}
        className={
          isDragReject ? "dropzone-reject" :
          isDragActive ? "dropzone-active" :
          "dropzone-idle"
        }
        style={{ opacity: disabled ? 0.5 : 1, pointerEvents: disabled ? "none" : "auto" }}
      >
        <input {...getInputProps()} />


        {/* Text */}
        <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-1)", marginBottom: 6 }}>
          {isDragActive ? (
            <span style={{ color: "var(--accent-hi)" }}>Drop your architecture diagram here</span>
          ) : (
            <>
              Drag &amp; drop diagram image, or{" "}
              <span style={{ color: "var(--accent)", textDecoration: "underline", textUnderlineOffset: 3 }}>
                browse files
              </span>
            </>
          )}
        </p>
        <p style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 16 }}>
          Supports clean exports (draw.io, Lucidchart) &amp; hand-drawn sketches — PNG, JPG, WebP up to 10MB
        </p>

        {/* Format badges */}
        <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" }}>
          {["PNG", "JPG", "WebP", "Hand-drawn"].map((tag) => (
            <span
              key={tag}
              style={{
                padding: "3px 8px",
                borderRadius: 5,
                fontSize: 10,
                fontFamily: "var(--font-mono)",
                fontWeight: 600,
                background: "var(--surface-3)",
                color: "var(--text-3)",
                border: "1px solid var(--border)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {errorMessage && (
        <p style={{ marginTop: 8, fontSize: 12, color: "var(--critical)", display: "flex", alignItems: "center", gap: 5, padding: "0 4px" }}>
          <span>⚠️</span> {errorMessage}
        </p>
      )}
    </div>
  );
}
