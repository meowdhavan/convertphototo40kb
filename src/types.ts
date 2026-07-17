export type ImageStatus = 'pending' | 'compressing' | 'done' | 'error'

export interface ImageItem {
  id: string
  originalFile: File
  originalDataUrl: string
  originalWidth: number
  originalHeight: number
  status: ImageStatus
  targetKB: number
  compressedFile: File | null
  compressedDataUrl: string | null
  compressedWidth: number | null
  compressedHeight: number | null
  progress: number
  error: string | null
}
