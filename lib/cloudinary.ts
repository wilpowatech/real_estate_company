/**
 * Cloudinary Upload Widget Integration
 * Requires NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME environment variable
 */

declare global {
  interface Window {
    cloudinary?: {
      createUploadWidget: (
        options: CloudinaryUploadWidgetOptions,
        callback: (error: any, result: CloudinaryUploadResult) => void,
      ) => CloudinaryUploadWidget
    }
  }
}

interface CloudinaryUploadWidgetOptions {
  cloudName: string
  uploadPreset: string
  multiple?: boolean
  maxFiles?: number
  resourceType?: string
  clientAllowedFormats?: string[]
  maxFileSize?: number
}

interface CloudinaryUploadResult {
  event?: string
  info: {
    secure_url: string
    public_id: string
    resource_type: string
    type: string
  }
}

interface CloudinaryUploadWidget {
  open: () => void
}

export function initCloudinaryWidget(): boolean {
  if (typeof window === "undefined") return false

  // Load Cloudinary widget script
  if (!window.cloudinary) {
    const script = document.createElement("script")
    script.src = "https://upload-widget.cloudinary.com/latest/index.js"
    script.async = true
    document.head.appendChild(script)
    return false
  }
  return true
}

export function createCloudinaryUploadWidget(
  options: Partial<CloudinaryUploadWidgetOptions>,
  onSuccess: (url: string, publicId: string) => void,
  onError: (error: any) => void,
): CloudinaryUploadWidget | null {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

  if (!cloudName || !uploadPreset) {
    console.error("Cloudinary credentials not configured")
    return null
  }

  const widget = window.cloudinary?.createUploadWidget(
    {
      cloudName,
      uploadPreset,
      ...options,
    },
    (error: any, result: CloudinaryUploadResult) => {
      if (error) {
        onError(error)
      } else if (result.event === "success") {
        onSuccess(result.info.secure_url, result.info.public_id)
      }
    },
  )

  return widget || null
}
