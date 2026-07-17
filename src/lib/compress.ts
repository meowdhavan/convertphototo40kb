import imageCompression from 'browser-image-compression'

export interface CompressResult {
  file: File
  dataUrl: string
  width: number
  height: number
}

export async function readImageMeta(
  file: Blob,
): Promise<{ dataUrl: string; width: number; height: number }> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })

  const { width, height } = await new Promise<{
    width: number
    height: number
  }>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight })
    img.onerror = () => reject(new Error('Could not read image dimensions'))
    img.src = dataUrl
  })

  return { dataUrl, width, height }
}

export async function compressToTarget(
  file: File,
  targetKB: number,
  onProgress?: (percent: number) => void,
): Promise<CompressResult> {
  const maxSizeMB = Math.max(targetKB / 1024, 0.005)

  const compressed = await imageCompression(file, {
    maxSizeMB,
    useWebWorker: true,
    initialQuality: 0.9,
    maxIteration: 15,
    preserveExif: false,
    onProgress,
  })

  const { dataUrl, width, height } = await readImageMeta(compressed)

  return { file: compressed, dataUrl, width, height }
}
