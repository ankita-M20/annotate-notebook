/*resizeCanvasToFitContent() {
    // Calculate the new width and height based on the content
    let newWidth = 0;
    let newHeight = 0;

    // Loop through the circles and rectangles to find their maximum dimensions
    for (const circle of this.circles) {
      newWidth = Math.max(newWidth, circle.x);
      newHeight = Math.max(newHeight, circle.y);
    }

    for (const rect of this.rectangles) {
      newWidth = Math.max(newWidth, rect.x + rect.width);
      newHeight = Math.max(newHeight, rect.y + rect.height);
    }

    // Add some padding (if desired)
    const padding = 20;
    newWidth += padding;
    newHeight += padding;

    // Set the canvas's width and height to the new dimensions
    this.canvas.width = newWidth;
    this.canvas.height = newHeight;

    this.ctx.drawImage(newCanvas, 0, 0);
  }
*/
