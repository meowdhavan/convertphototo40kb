import { useRef, useState } from 'react'
import type { DragEvent } from 'react'

interface DropzoneProps {
  onFiles: (files: File[]) => void
}

export function Dropzone({ onFiles }: DropzoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const dragDepth = useRef(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const pickImageFiles = (fileList: FileList | null) => {
    if (!fileList) return
    const files = Array.from(fileList).filter((file) =>
      file.type.startsWith('image/'),
    )
    if (files.length > 0) onFiles(files)
  }

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    dragDepth.current += 1
    setIsDragging(true)
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    dragDepth.current -= 1
    if (dragDepth.current <= 0) {
      dragDepth.current = 0
      setIsDragging(false)
    }
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    dragDepth.current = 0
    setIsDragging(false)
    pickImageFiles(e.dataTransfer.files)
  }

  return (
    <div
      className={`dropzone${isDragging ? ' dropzone-active' : ''}`}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click()
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          pickImageFiles(e.target.files)
          e.target.value = ''
        }}
      />

      <svg viewBox="0 0 24 24" width="36" height="36" fill="none" aria-hidden="true">
        <path
          d="M12 15V4M12 4 8 8M12 4l4 4"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <p className="dropzone-title">
        {isDragging ? 'Drop your images here' : 'Drag & drop photos here'}
      </p>
      <p className="dropzone-subtitle">
        or <span className="dropzone-link">browse files</span> — JPG, PNG, WebP supported
      </p>
    </div>
  )
}
