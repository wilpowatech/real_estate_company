"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Upload, X, ImageIcon, Video } from "lucide-react"
import Image from "next/image"

interface MediaFile {
  id: string
  url: string
  type: "image" | "video"
  file?: File
}

interface MediaUploadProps {
  onMediaUpload: (media: MediaFile[]) => void
  maxFiles?: number
}

export function MediaUpload({ onMediaUpload, maxFiles = 10 }: MediaUploadProps) {
  const [media, setMedia] = useState<MediaFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.currentTarget.files
      if (!files) return

      setError(null)

      const newMedia: MediaFile[] = []
      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        // Validate file type
        if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
          setError("Only image and video files are allowed")
          return
        }

        // Validate file size (max 100MB)
        if (file.size > 100 * 1024 * 1024) {
          setError("File size must be less than 100MB")
          return
        }

        const type = file.type.startsWith("image/") ? "image" : "video"
        newMedia.push({
          id: `${Date.now()}-${i}`,
          url: URL.createObjectURL(file),
          type,
          file,
        })
      }

      if (media.length + newMedia.length > maxFiles) {
        setError(`Maximum ${maxFiles} files allowed`)
        return
      }

      const updatedMedia = [...media, ...newMedia]
      setMedia(updatedMedia)
      onMediaUpload(updatedMedia)
    },
    [media, maxFiles, onMediaUpload],
  )

  const removeMedia = (id: string) => {
    const updatedMedia = media.filter((m) => m.id !== id)
    setMedia(updatedMedia)
    onMediaUpload(updatedMedia)
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
        <input
          type="file"
          id="media-upload"
          multiple
          accept="image/*,video/*"
          onChange={handleFileSelect}
          disabled={uploading || media.length >= maxFiles}
          className="hidden"
        />
        <label htmlFor="media-upload" className="cursor-pointer block">
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-700">Click to upload or drag and drop</p>
          <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF, MP4, WebM (Max 100MB each)</p>
          <p className="text-xs text-gray-500">
            {media.length}/{maxFiles} files
          </p>
        </label>
      </div>

      {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded">{error}</div>}

      {/* Media Preview */}
      {media.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {media.map((item) => (
            <div key={item.id} className="relative group">
              <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                {item.type === "image" ? (
                  <Image src={item.url || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-300">
                    <Video className="w-8 h-8 text-gray-600" />
                  </div>
                )}
              </div>
              <button
                onClick={() => removeMedia(item.id)}
                className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                {item.type === "image" ? <ImageIcon className="w-3 h-3" /> : <Video className="w-3 h-3" />}
                {item.type}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
