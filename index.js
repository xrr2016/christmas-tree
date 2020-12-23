/*
 * @Author: Cold Stone
 * @Date: 2020-12-21 20:30:50
 * @LastEditTime: 2020-12-23 20:25:15
 * @LastEditors: Please set LastEditors
 * @Description: Christmas Tree
 * @FilePath: /christmas-tree/index.js
 */

const CANVAS_WIDTH = 360
const CANVAS_HEIGHT = 620

function initCanvas(id) {
  const canvas = document.getElementById(id)
  canvas.width = CANVAS_WIDTH
  canvas.height = CANVAS_HEIGHT
  return canvas
}

function main() {
  const canvas = initCanvas('tree')
  const location = [CANVAS_WIDTH * 0.5, CANVAS_HEIGHT]

  drawBranches(canvas, location, 100, 0, 20)
  drawLeaves(canvas)
  drawGifts(canvas)
  drawStar(canvas)
}

function drawBranches(canvas, start, len, angle, branchWidth) {
  const ctx = canvas.getContext('2d')
  ctx.beginPath()
  ctx.save()
  ctx.translate(...start)
  ctx.strokeStyle = '#333'
  ctx.lineWidth = branchWidth
  ctx.rotate((angle * Math.PI) / 180)

  ctx.moveTo(0, 0)
  ctx.lineTo(0, -len)
  ctx.stroke()

  if (len > 5) {
    drawBranches(canvas, [0, -len], len * 0.5, 35, branchWidth * 0.7)
    drawBranches(canvas, [0, -len], len * 0.5, -35, branchWidth * 0.7)
    drawBranches(canvas, [0, -len], len * 0.8, 0, branchWidth * 0.7)
  }

  ctx.restore()
}

const branchPixels = []

function drawLeaves(canvas) {
  const ctx = canvas.getContext('2d')
  const imageData = ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  const data = imageData.data

  for (let y = 0; y < CANVAS_HEIGHT; y++) {
    for (let x = 0; x < CANVAS_WIDTH; x++) {
      const alpha = data[4 * (y * CANVAS_WIDTH + x) + 3]

      if (alpha > 0 && y < CANVAS_HEIGHT - 100) {
        branchPixels.push([x, y])
      }
    }
  }

  for (let i = 0; i < branchPixels.length; i++) {
    if (Math.random() < 0.3) {
      let loc = branchPixels[i]
      loc[0] += (Math.random() - 0.5) * 5
      loc[1] += (Math.random() - 0.5) * 5
      let green = (255 * (CANVAS_HEIGHT - loc[1])) / CANVAS_HEIGHT

      ctx.beginPath()
      ctx.save()
      ctx.translate(...loc)
      ctx.rotate(Math.random() * Math.PI * 2)
      ctx.fillStyle = `rgba(0, ${green}, 0, .2)`
      ctx.arc(0, 0, 4, 0, Math.PI)
      ctx.fill()
      ctx.restore()
    }
  }
}

const gifts = ['🎁', '🍎', '🍭', '🍬', '🎈', '🧸', '🔔']

function drawGifts(canvas) {
  const ctx = canvas.getContext('2d')

  ctx.save()
  ctx.font = '1.5rem sans-serif'
  for (let i = 0; i < 30; i++) {
    const location =
      branchPixels[Math.floor(Math.random() * branchPixels.length)]
    const gift = gifts[i % gifts.length]

    ctx.fillText(gift, ...location)
  }
  ctx.restore()
}

const image = new Image(500, 500)
image.src = 'star.png'

function drawStar(canvas) {
  const ctx = canvas.getContext('2d')
  const size = 50
  const loc = [CANVAS_WIDTH * 0.5 - size / 2, 80]

  ctx.drawImage(image, ...loc, size, size)
}

window.addEventListener('load', main)
