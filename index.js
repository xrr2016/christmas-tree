/*
 * @Author: Cold Stone
 * @Date: 2020-12-21 20:30:50
 * @LastEditTime: 2020-12-23 21:05:15
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
  // 树的起始位置
  const location = [CANVAS_WIDTH * 0.5, CANVAS_HEIGHT]

  drawBranches(canvas, location, 0, 100, 20)
  drawLeaves(canvas)
  drawGifts(canvas)
  drawStar(canvas)
}

/*
 * canvas       画布
 * start        起始位置
 * angle        旋转角度
 * branchHeight 树枝长度
 * branchWidth  树枝宽度
 */
function drawBranches(canvas, start, angle, branchHeight, branchWidth) {
  const ctx = canvas.getContext('2d')
  ctx.save()
  ctx.beginPath()
  // 将画布原点移动到起始位置
  ctx.translate(...start)
  // 设置绘制颜色
  ctx.strokeStyle = '#333'
  // 设置绘制宽度
  ctx.lineWidth = branchWidth
  // 设置旋转角度
  ctx.rotate((angle * Math.PI) / 180)

  ctx.moveTo(0, 0)
  ctx.lineTo(0, -branchHeight)
  ctx.stroke()

  if (branchHeight > 6) {
    // 绘制右子树
    drawBranches(canvas, [0, -branchHeight], 35, branchHeight * 0.5, branchWidth * 0.7)
    // 绘制左子树
    drawBranches(canvas, [0, -branchHeight], -35, branchHeight * 0.5, branchWidth * 0.7)
    // 绘制中间的树干
    drawBranches(canvas, [0, -branchHeight], 0, branchHeight * 0.8, branchWidth * 0.7)
  }

  ctx.restore()
}

// 使用一个数组保存绘制树的像素点
const branchPixels = []

function drawLeaves(canvas) {
  const ctx = canvas.getContext('2d')
  const imageData = ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  const data = imageData.data

  for (let y = 0; y < CANVAS_HEIGHT; y++) {
    for (let x = 0; x < CANVAS_WIDTH; x++) {
      // 获取图像像素点 alpha 通道值
      const alpha = data[4 * (y * CANVAS_WIDTH + x) + 3]

      // 如果 alpha 值大于 0 说明这个位置有图像
      if (alpha > 0 && y < CANVAS_HEIGHT - 100) {
        branchPixels.push([x, y])
      }
    }
  }

  for (let i = 0; i < branchPixels.length; i++) {
    // 减少绘制几率
    if (Math.random() < 0.3) {
      const loc = branchPixels[i]
      loc[0] += (Math.random() - 0.5) * 5
      loc[1] += (Math.random() - 0.5) * 5
      // 设置绘制颜色，越往外颜色越浅
      const green = (255 * (CANVAS_HEIGHT - loc[1])) / CANVAS_HEIGHT

      ctx.save()
      ctx.beginPath()
      ctx.translate(...loc)
      ctx.rotate(Math.random() * Math.PI * 2)
      ctx.fillStyle = `rgba(0, ${green}, 0, .2)`
      // 绘制半圆
      ctx.arc(0, 0, 5, 0, Math.PI)
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
    const location = branchPixels[Math.floor(Math.random() * branchPixels.length)]
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
