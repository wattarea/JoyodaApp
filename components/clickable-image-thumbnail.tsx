"use client"

interface ClickableImageThumbnailProps {
  imageUrl: string
  altText: string
}

export function ClickableImageThumbnail({ imageUrl, altText }: ClickableImageThumbnailProps) {
  return (
    <button
      onClick={() => window.open(imageUrl, "_blank")}
      className="w-12 h-12 rounded-lg overflow-hidden hover:opacity-80 transition-opacity cursor-pointer"
    >
      <img src={imageUrl || "/placeholder.svg"} alt={altText} className="w-full h-full object-cover" />
    </button>
  )
}
