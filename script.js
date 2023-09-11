class DrawingCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.canvas.height = window.innerHeight;
    this.canvas.width = window.innerWidth;

    this.mouse = {
      x: null,
      y: null,
    };
    this.activeDrawingMode = null; // Track the active drawing mode (circle or rectangle)

    this.shapes = []; // Stores all drawn shapes (circles and rectangles)
    this.strokes = [[]];
    this.undoStack = [];
    this.redoStack = [];

    this.isDrawingEnabled = false; // Flag to control pointer events
    this.activeButton = null; // Reference to the active button

    this.canvas.addEventListener("pointerdown", (event) => {
      if (this.isDrawingEnabled) {
        this.handlePointerDown(event);
      }
      this.toggleDrawing();
    });

    this.canvas.addEventListener("pointermove", (event) => {
      if (this.isDrawingEnabled) {
        this.handlePointerMove(event);
      }
    });

    window.addEventListener("resize", () => {
      this.resizeCanvas();
    });

    this.resizeCanvas();
  }

  setActiveButton(button) {
    this.activeButton = button;
  }

  // Method to set a fixed canvas size
  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  handlePointerDown(event) {
    this.mouse.x = event.clientX;
    this.mouse.y = event.clientY;

    if (this.activeDrawingMode === "circle") {
      this.startDrawingCircle();
    } else if (this.activeDrawingMode === "rectangle") {
      this.startDrawingRectangle();
    }
  }

  handlePointerMove(event) {
    this.mouse.x = event.clientX;
    this.mouse.y = event.clientY;

    if (this.isDrawingEnabled) {
      if (this.activeDrawingMode === "circle") {
        this.continueDrawingCircle();
      } else if (this.activeDrawingMode === "rectangle") {
        this.continueDrawingRectangle();
      }
    }
  }

  // Start drawing a circle
  startDrawingCircle() {
    const circle = new Circle(this.ctx, this.mouse.x, this.mouse.y);
    this.shapes.push(circle);
  }

  // Continue drawing a circle
  continueDrawingCircle() {
    const currentCircle = this.shapes[this.shapes.length - 1];
    currentCircle.update(this.mouse.x, this.mouse.y);
  }

  // Start drawing a rectangle
  startDrawingRectangle() {
    const rectangle = new Rectangle(this.ctx, this.mouse.x, this.mouse.y);
    this.shapes.push(rectangle);
  }

  // Continue drawing a rectangle
  continueDrawingRectangle() {
    const currentRectangle = this.shapes[this.shapes.length - 1];
    currentRectangle.update(this.mouse.x, this.mouse.y);
  }

  // Toggle drawing mode based on the selected button
  toggleDrawing() {
    this.isDrawingEnabled = !this.isDrawingEnabled;
  }

  // Undo the last action
  undo() {
    if (this.shapes.length > 0) {
      const lastShape = this.shapes.pop();
      this.undoStack.push(lastShape);
      this.redrawShapes();
    }
  }

  // Redo the last undone action
  redo() {
    if (this.undoStack.length > 0) {
      const undoneShape = this.undoStack.pop();
      this.shapes.push(undoneShape);
      this.redrawShapes();
    }
  }

  // Redraw all shapes on the canvas
  redrawShapes() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (const shape of this.shapes) {
      shape.draw();
    }
  }

  // Set the active drawing button
  setActiveButton(button) {
    this.activeButton = button;
  }

  setActiveButton(button) {
    if (button === "brush-highlighter") {
      this.activeDrawingMode = "circle"; // For example, set circle mode for brush-highlighter
    } else if (button === "paintbrush") {
      this.activeDrawingMode = "rectangle"; // Set rectangle mode for paintbrush
    } else if (button === "erase") {
      // Set your erase mode logic here
    } else {
      this.activeDrawingMode = null; // Reset to null for other buttons
    }
  }
}

class Shape {
  constructor(ctx, startX, startY) {
    this.ctx = ctx;
    this.startX = startX;
    this.startY = startY;
  }

  draw() {
    // To be implemented by subclasses
  }

  update() {
    // To be implemented by subclasses
  }
}

class Circle extends Shape {
  constructor(ctx, startX, startY) {
    super(ctx, startX, startY);
    this.radius = 0;
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.startX, this.startY, this.radius, 0, Math.PI * 2);
    this.ctx.stroke();
  }

  update(currentX, currentY) {
    this.radius = Math.sqrt(
      Math.pow(currentX - this.startX, 2) + Math.pow(currentY - this.startY, 2)
    );
    this.draw();
  }
}

class Rectangle extends Shape {
  constructor(ctx, startX, startY) {
    super(ctx, startX, startY);
    this.width = 0;
    this.height = 0;
  }

  draw() {
    this.ctx.strokeRect(this.startX, this.startY, this.width, this.height);
  }

  update(currentX, currentY) {
    this.width = currentX - this.startX;
    this.height = currentY - this.startY;
    this.draw();
  }
}

// Create an instance of the DrawingCanvas class and specify the canvas ID
const canvas1 = new DrawingCanvas("canvas1");
//unnessary
const circleButton = document.getElementById("circle-button");
circleButton.addEventListener("click", () => {
  canvas1.setActiveButton(circleButton);
});

const rectangleButton = document.getElementById("rectangle-button");
rectangleButton.addEventListener("click", () => {
  canvas1.setActiveButton(rectangleButton);
});

const undoButton = document.getElementById("undo-btn");
undoButton.addEventListener("click", () => {
  canvas1.undo();
});

const redoButton = document.getElementById("redo-btn");
redoButton.addEventListener("click", () => {
  canvas1.redo();
});

const brushHighlighterButton = document.getElementById("brush-highlighter");
brushHighlighterButton.addEventListener("click", () => {
  canvas1.setActiveButton("brush-highlighter");
});

const paintbrushButton = document.getElementById("paintbrush");
paintbrushButton.addEventListener("click", () => {
  canvas1.setActiveButton("paintbrush");
});

const eraseButton = document.getElementById("erase-button");
eraseButton.addEventListener("click", () => {
  canvas1.setActiveButton("erase");
});

const toggleDrawingButton = document.getElementById("toggle-drawing");
toggleDrawingButton.addEventListener("click", () => {
  canvas1.toggleDrawing();
});
