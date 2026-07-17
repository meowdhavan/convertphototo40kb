import { useState } from 'react'
import type { ImageItem } from '../types'
import { TargetSizeControl } from './TargetSizeControl'

interface ImageCardProps {
  item: ImageItem
  onRecompress: (id: string, targetKB: number) => void
  onRemove: (id: string) => void
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(kb < 10 ? 2 : 1)} KB`
  return `${(kb / 1024).toFixed(2)} MB`
}

function downloadFile(file: File) {
  const url = URL.createObjectURL(file)
  const a = document.createElement('a')
  const dot = file.name.lastIndexOf('.')
  const base = dot > -1 ? file.name.slice(0, dot) : file.name
  const ext = dot > -1 ? file.name.slice(dot) : ''
  a.href = url
  a.download = `${base}-compressed${ext}`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export function ImageCard({ item, onRecompress, onRemove }: ImageCardProps) {
  const [recompressKB, setRecompressKB] = useState(item.targetKB)

  const originalSize = item.originalFile.size
  const compressedSize = item.compressedFile?.size ?? null
  const reduction =
    compressedSize !== null
      ? Math.round((1 - compressedSize / originalSize) * 100)
      : null
  const hitTarget =
    compressedSize !== null ? compressedSize <= item.targetKB * 1024 : null

  return (
    <div className="image-card">
      <div className="image-card-head">
        <div className="image-card-name" title={item.originalFile.name}>
          {item.originalFile.name}
        </div>
        <button
          type="button"
          className="icon-button"
          aria-label="Remove image"
          title="Remove"
          onClick={() => onRemove(item.id)}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
            <path
              d="M6 6l12 12M18 6 6 18"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <div className="image-compare">
        <div className="image-pane">
          <span className="image-pane-label">Before</span>
          <div className="image-pane-frame">
            <img src={item.originalDataUrl} alt={`Original ${item.originalFile.name}`} />
          </div>
          <dl className="image-meta">
            <div>
              <dt>Size</dt>
              <dd>{formatBytes(originalSize)}</dd>
            </div>
            <div>
              <dt>Dimensions</dt>
              <dd>
                {item.originalWidth}×{item.originalHeight}
              </dd>
            </div>
          </dl>
        </div>

        <div className="image-pane">
          <span className="image-pane-label">After</span>
          <div className="image-pane-frame">
            {item.status === 'compressing' && (
              <div className="image-pane-status">
                <span className="spinner" aria-hidden="true" />
                <span>Compressing… {item.progress}%</span>
              </div>
            )}
            {item.status === 'error' && (
              <div className="image-pane-status image-pane-error">
                <span>{item.error ?? 'Compression failed'}</span>
              </div>
            )}
            {item.status === 'done' && item.compressedDataUrl && (
              <img
                src={item.compressedDataUrl}
                alt={`Compressed ${item.originalFile.name}`}
              />
            )}
            {item.status === 'pending' && (
              <div className="image-pane-status">
                <span>Waiting…</span>
              </div>
            )}
          </div>
          <dl className="image-meta">
            <div>
              <dt>Size</dt>
              <dd>
                {compressedSize !== null ? formatBytes(compressedSize) : '—'}
                {reduction !== null && reduction > 0 && (
                  <span className="badge badge-good"> −{reduction}%</span>
                )}
              </dd>
            </div>
            <div>
              <dt>Dimensions</dt>
              <dd>
                {item.compressedWidth && item.compressedHeight
                  ? `${item.compressedWidth}×${item.compressedHeight}`
                  : '—'}
              </dd>
            </div>
          </dl>
          {hitTarget === false && (
            <p className="target-warning">
              Couldn't reach {item.targetKB}KB without excessive quality loss —
              closest possible size shown.
            </p>
          )}
        </div>
      </div>

      <div className="image-card-actions">
        <TargetSizeControl value={recompressKB} onChange={setRecompressKB} id={`target-${item.id}`} compact />
        <div className="image-card-buttons">
          <button
            type="button"
            className="btn btn-secondary"
            disabled={item.status === 'compressing'}
            onClick={() => onRecompress(item.id, recompressKB)}
          >
            Recompress
          </button>
          <button
            type="button"
            className="btn btn-primary"
            disabled={item.status !== 'done' || !item.compressedFile}
            onClick={() => item.compressedFile && downloadFile(item.compressedFile)}
          >
            Download
          </button>
        </div>
      </div>
    </div>
  )
}
