//drawing shapes
class Shape {
  constructor(canvas, ctx, color, isFilled) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.color = color;
    this.isFilled = isFilled;
    this.points = [];
  }
}

class Rectangle extends Shape {
  constructor(canvas, ctx, color, isFilled) {
    super(canvas, ctx, color, isFilled);
  }

  draw() {
    this.ctx.fillStyle = this.color;
    if (this.isFilled) {
      this.ctx.fillRect(...this.points);
    } else {
      this.ctx.strokeRect(...this.points);
    }
  }
}

class Circle extends Shape {
  constructor(canvas, ctx, color, isFilled) {
    super(canvas, ctx, color, isFilled);
  }

  draw() {
    this.ctx.fillStyle = this.color;
    const [x, y, radius] = this.points;
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    if (this.isFilled) {
      this.ctx.fill();
    } else {
      this.ctx.stroke();
    }
  }
}

class Triangle extends Shape {
  constructor(canvas, ctx, color, isFilled) {
    super(canvas, ctx, color, isFilled);
  }

  draw() {
    this.ctx.fillStyle = this.color;
    const [x1, y1, x2, y2, x3, y3] = this.points;
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.lineTo(x3, y3);
    this.ctx.closePath();
    if (this.isFilled) {
      this.ctx.fill();
    } else {
      this.ctx.stroke();
    }
  }
}

class DrawingApp {
  constructor(canvas) {
    this.canvas = document.getElementById(canvas);
    this.ctx = this.canvas.getContext("2d");
    this.canvas.height = window.innerHeight;
    this.canvas.width = window.innerWidth;

    this.selectedTool = "brush"; // Default tool (you can change it as needed)
    this.isDrawing = false;
    this.prevX = 0;
    this.prevY = 0;
    this.currentShape = null; // The currently selected shape

    // Add event listeners for pointer events
    this.canvas.addEventListener("pointerdown", this.startDrawing.bind(this));
    this.canvas.addEventListener("pointermove", this.draw.bind(this));
    this.canvas.addEventListener("pointerup", this.stopDrawing.bind(this));

    // Add event listeners to select tools based on HTML elements
    document.getElementById("triangle").addEventListener("click", () => {
      this.setSelectedTool("triangle");
    });
    document.getElementById("rectangle").addEventListener("click", () => {
      this.setSelectedTool("rectangle");
    });
    document.getElementById("circle").addEventListener("click", () => {
      this.setSelectedTool("circle");
    });
  }

  setSelectedTool(tool) {
    this.selectedTool = tool;
  }

  startDrawing(event) {
    this.isDrawing = true;
    const { offsetX, offsetY } = event;

    switch (this.selectedTool) {
      case "triangle":
        this.currentShape = new Triangle(
          this.canvas,
          this.ctx,
          "blue",
          true // Set to true for filled shape, you can change this as needed
        );
        this.currentShape.points.push(offsetX, offsetY);
        break;
      case "rectangle":
        this.currentShape = new Rectangle(
          this.canvas,
          this.ctx,
          "red",
          true // Set to true for filled shape, you can change this as needed
        );
        this.currentShape.points.push(offsetX, offsetY);
        break;
      case "circle":
        this.currentShape = new Circle(
          this.canvas,
          this.ctx,
          "green",
          true // Set to true for filled shape, you can change this as needed
        );
        this.currentShape.points.push(offsetX, offsetY, 0);
        break;
      default:
        break;
    }

    this.prevX = offsetX;
    this.prevY = offsetY;
  }

  draw(event) {
    if (!this.isDrawing || !this.currentShape) return;

    const { offsetX, offsetY } = event;

    switch (this.selectedTool) {
      case "triangle":
      case "rectangle":
        this.currentShape.points.push(offsetX, offsetY);
        break;
      case "circle":
        const dx = offsetX - this.prevX;
        const dy = offsetY - this.prevY;
        const radius = Math.sqrt(dx * dx + dy * dy);
        this.currentShape.points[2] = radius;
        break;
      default:
        break;
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.currentShape.draw();
  }

  stopDrawing() {
    this.isDrawing = false;

    if (this.currentShape) {
      // Store the drawn shape
      // You can implement your storage or further actions here
      // For now, we'll just clear the canvas
      this.currentShape = null;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}

// Usage
const canvasApp = new DrawingApp("canvas");
