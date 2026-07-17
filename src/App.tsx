import { useState } from 'react'
import { Header } from './components/Header'
import { Dropzone } from './components/Dropzone'
import { TargetSizeControl } from './components/TargetSizeControl'
import { ImageCard } from './components/ImageCard'
import { useTheme } from './hooks/useTheme'
import { compressToTarget, readImageMeta } from './lib/compress'
import type { ImageItem } from './types'
import './App.css'

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function App() {
  const { theme, toggleTheme } = useTheme()
  const [items, setItems] = useState<ImageItem[]>([])
  const [globalTargetKB, setGlobalTargetKB] = useState(40)

  const updateItem = (id: string, patch: Partial<ImageItem>) => {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    )
  }

  const runCompression = async (id: string, targetKB: number, file: File) => {
    updateItem(id, { status: 'compressing', progress: 0, targetKB, error: null })
    try {
      const result = await compressToTarget(file, targetKB, (percent) =>
        updateItem(id, { progress: percent }),
      )
      updateItem(id, {
        status: 'done',
        compressedFile: result.file,
        compressedDataUrl: result.dataUrl,
        compressedWidth: result.width,
        compressedHeight: result.height,
        progress: 100,
      })
    } catch (err) {
      updateItem(id, {
        status: 'error',
        error: err instanceof Error ? err.message : 'Compression failed',
      })
    }
  }

  const handleFiles = async (files: File[]) => {
    for (const file of files) {
      const id = makeId()
      const { dataUrl, width, height } = await readImageMeta(file)
      const newItem: ImageItem = {
        id,
        originalFile: file,
        originalDataUrl: dataUrl,
        originalWidth: width,
        originalHeight: height,
        status: 'pending',
        targetKB: globalTargetKB,
        compressedFile: null,
        compressedDataUrl: null,
        compressedWidth: null,
        compressedHeight: null,
        progress: 0,
        error: null,
      }
      setItems((current) => [...current, newItem])
      void runCompression(id, globalTargetKB, file)
    }
  }

  const handleRecompress = (id: string, targetKB: number) => {
    const item = items.find((i) => i.id === id)
    if (!item) return
    void runCompression(id, targetKB, item.originalFile)
  }

  const handleRemove = (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id))
  }

  const handleCompressAll = () => {
    for (const item of items) {
      void runCompression(item.id, globalTargetKB, item.originalFile)
    }
  }

  return (
    <div className="app-shell">
      <Header theme={theme} onToggleTheme={toggleTheme} />

      <main className="app-main">
        <section className="shoutout">
          <h2>
            Thank you{' '}
            <a href="https://youtu.be/PK_zuAuI9x0?t=598" target="_blank" rel="noopener noreferrer">
              Biswa
            </a>
            , very cool. ✨ No ads and no premium membership required ✨.
          </h2>
          <p>
            This website was <s>built</s> vibe-coded in an hour with Claude Code and
            some vodka. I would really appreciate it if you could check out my
            music, which unlike this website, was only made with some vodka:{' '}
            <a href="https://youtu.be/M3rhZJRd0eQ" target="_blank" rel="noopener noreferrer">
              Cute Fluffy Kitten - UwU UwU Bunbuns
            </a>
          </p>
        </section>

        <section className="controls-panel">
          <Dropzone onFiles={handleFiles} />

          <div className="global-controls">
            <TargetSizeControl value={globalTargetKB} onChange={setGlobalTargetKB} />
            <button
              type="button"
              className="btn btn-primary"
              disabled={items.length === 0}
              onClick={handleCompressAll}
            >
              Compress all to {globalTargetKB}KB
            </button>
          </div>
        </section>

        {items.length > 0 && (
          <section className="results-panel">
            {items.map((item) => (
              <ImageCard
                key={item.id}
                item={item}
                onRecompress={handleRecompress}
                onRemove={handleRemove}
              />
            ))}
          </section>
        )}
      </main>

      <footer className="app-footer">
        <p>&copy; 2026 Madhavan Raja. Built with ❤️, Claude Code, Vite, React, and Vodka.</p>
        <p>
          Your images are processed locally and never uploaded to the internet
          (I can't afford server storage). Also, special thanks to the Indian
          Government for not supporting pictures with more than 40 KB, which led
          to this website being a necessity.
        </p>
      </footer>
    </div>
  )
}

export default App
