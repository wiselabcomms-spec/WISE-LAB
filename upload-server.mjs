/**
 * Local-only image upload server for the WISE Lab admin panel.
 *
 * Usage (in a second terminal alongside `npm run dev`):
 *   npm run upload-server
 *
 * POST /upload  multipart/form-data  field: "file"
 *   → saves to  public/team/<original-filename>
 *   → returns   { url: "/team/<filename>" }
 *
 * Only runs locally. Never deployed to Netlify/production.
 * CORS is open to localhost only.
 */

import http from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const TEAM_DIR = path.join(__dirname, 'public', 'team')
const PORT = 4001

// Ensure public/team/ exists
if (!fs.existsSync(TEAM_DIR)) {
  fs.mkdirSync(TEAM_DIR, { recursive: true })
  console.log(`Created directory: ${TEAM_DIR}`)
}

/**
 * Minimal multipart/form-data parser — no dependencies.
 * Returns { filename, mimeType, data: Buffer } for the first file field.
 */
function parseMultipart(body, boundary) {
  const boundaryBuf = Buffer.from('--' + boundary)
  const parts = []
  let start = 0

  while (start < body.length) {
    const bStart = body.indexOf(boundaryBuf, start)
    if (bStart === -1) break
    const headerStart = bStart + boundaryBuf.length + 2 // skip \r\n
    const headerEnd = body.indexOf(Buffer.from('\r\n\r\n'), headerStart)
    if (headerEnd === -1) break
    const headers = body.slice(headerStart, headerEnd).toString()
    const dataStart = headerEnd + 4
    const bEnd = body.indexOf(boundaryBuf, dataStart)
    if (bEnd === -1) break
    const dataEnd = bEnd - 2 // trim trailing \r\n

    const dispMatch = headers.match(/filename="([^"]+)"/)
    const typeMatch = headers.match(/Content-Type:\s*(.+)/i)
    if (dispMatch) {
      parts.push({
        filename: dispMatch[1],
        mimeType: typeMatch ? typeMatch[1].trim() : 'application/octet-stream',
        data: body.slice(dataStart, dataEnd),
      })
    }
    start = bEnd
  }
  return parts
}

const ALLOWED_ORIGINS = ['http://localhost:5173', 'http://localhost:4173', 'http://127.0.0.1:5173']

const server = http.createServer((req, res) => {
  // CORS — localhost only
  const origin = req.headers.origin || ''
  const allowOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]
  res.setHeader('Access-Control-Allow-Origin', allowOrigin)
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  if (req.method === 'POST' && req.url === '/upload') {
    const chunks = []
    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => {
      try {
        const body = Buffer.concat(chunks)
        const contentType = req.headers['content-type'] || ''
        const boundaryMatch = contentType.match(/boundary=(.+)/)
        if (!boundaryMatch) {
          res.writeHead(400, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'No boundary found in Content-Type.' }))
          return
        }

        const parts = parseMultipart(body, boundaryMatch[1])
        if (!parts.length) {
          res.writeHead(400, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'No file found in request.' }))
          return
        }

        const { filename, data } = parts[0]
        // Sanitise filename: keep extension, strip path traversal
        const ext = path.extname(filename).toLowerCase()
        const base = path
          .basename(filename, ext)
          .replace(/[^a-zA-Z0-9_-]/g, '-')
          .toLowerCase()
        const safeName = `${base}-${Date.now()}${ext}`
        const dest = path.join(TEAM_DIR, safeName)

        fs.writeFileSync(dest, data)
        console.log(`[upload-server] Saved: ${dest}`)

        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ url: `/team/${safeName}` }))
      } catch (err) {
        console.error('[upload-server] Error:', err)
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'Server error.' }))
      }
    })
    return
  }

  res.writeHead(404, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ error: 'Not found.' }))
})

server.listen(PORT, '127.0.0.1', () => {
  console.log(`\n✅ WISE Lab upload server running at http://127.0.0.1:${PORT}`)
  console.log(`   Saves images to: ${TEAM_DIR}`)
  console.log(`   Run alongside: npm run dev\n`)
})
