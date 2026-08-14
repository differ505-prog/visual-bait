"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Image as ImageIcon, Loader2, AlertCircle } from "lucide-react";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  hint?: string;
}

export function ImageUploader({ value, onChange, label, hint }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = useCallback(async (file: File) => {
    setUploading(true);
    setError(null);

    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: fd });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `上傳失敗 (${res.status})`);
      }

      const data = await res.json();
      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "上傳失敗");
    } finally {
      setUploading(false);
    }
  }, [onChange]);

  const handleFile = useCallback((file: File | null) => {
    if (!file) return;
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(file.type)) {
      setError("不支援的格式，請上傳 JPG/PNG/WebP/GIF");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("檔案太大，最大 10MB");
      return;
    }
    setError(null);
    upload(file);
  }, [upload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }, [handleFile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0] ?? null);
  };

  return (
    <div>
      {label && (
        <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      )}

      {/* Preview */}
      {value && !uploading && (
        <div className="relative w-full h-40 rounded-lg overflow-hidden bg-gray-100 mb-2 group">
          <img src={value} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-3 py-1.5 bg-white/90 text-gray-700 text-xs font-medium rounded-lg hover:bg-white transition-colors"
            >
              重新上傳
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="p-1.5 bg-white/90 text-gray-700 rounded-lg hover:bg-white transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Drop zone */}
      {!value && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !uploading && inputRef.current?.click()}
          className={`w-full h-32 rounded-lg border-2 border-dashed transition-colors cursor-pointer flex flex-col items-center justify-center gap-2
            ${dragOver ? "border-amber-500 bg-amber-50" : "border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100"}
            ${uploading ? "cursor-wait" : ""}
          `}
        >
          {uploading ? (
            <>
              <Loader2 size={24} className="text-amber-500 animate-spin" />
              <span className="text-xs text-gray-500">上傳中...</span>
            </>
          ) : (
            <>
              {error ? (
                <>
                  <AlertCircle size={22} className="text-red-400" />
                  <span className="text-xs text-red-500">{error}</span>
                </>
              ) : (
                <>
                  <Upload size={22} className="text-gray-400" />
                  <span className="text-xs text-gray-500">拖放圖片到此處，或點擊選擇</span>
                  <span className="text-xs text-gray-400">JPG / PNG / WebP / GIF，最大 10MB</span>
                </>
              )}
            </>
          )}
        </div>
      )}

      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleInputChange}
      />
    </div>
  );
}
