import './style.css'
// import { setupCounter } from './counter.js'
import QRCode from 'qrcode'
document.querySelector('#app').innerHTML = `
  <div>
    <h1>QR Code Generator</h1>
    <input id="text" type="text" placeholder="https://example.com" size="40" />
    <button id="make">Generate</button>
    <div id="err" style="color:#b00020; margin-top:8px"></div>
    <div id="qr"></div>
    <a id="download" download="qrcode.png" class="download" style="display:none">Download PNG</a>
  </div>
`
const text = document.getElementById("text")
const make = document.getElementById("make")
const qrEl = document.getElementById("qr")
const errEl = document.getElementById("err")
const dlEl = document.getElementById('download');
const showError = (msg = "") => (errEl.textContent = msg)

const normalizeUrl = (s) => {
  const v = (s || "").trim()
  if (!v) return ""
  if (!/^https?:\/\//i.test(v)) return "https://" + v
  return v
}

const isUrl = (s) => {
  try {
    new URL(s)
    return true
  } catch {
    return false
  }
}

async function generate(raw = text.value) {
  showError("")
  const value = normalizeUrl(raw)
  if (!value) return showError("Please enter a URL.")
  if (!isUrl(value)) return showError("That doesn’t look like a valid URL.")

  try {
    const dataUrl = await QRCode.toDataURL(value, {
      width: 256,
      margin: 2,
      errorCorrectionLevel: "M",
    })
    qrEl.innerHTML = `<img src="${dataUrl}" alt="QR Code"/>`
    dlEl.href = dataUrl
    dlEl.style.display = 'inline-block'
  } catch (err) {
    showError(err.message || String(err))
  }
}

// Events
make.addEventListener("click", () => generate())
text.addEventListener("paste", () => requestAnimationFrame(() => generate()))

let t
text.addEventListener("input", () => {
  clearTimeout(t)
  t = setTimeout(() => generate(), 300)
})


// setupCounter(document.querySelector('#counter'))
