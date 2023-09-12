class DrawingUtility {
  static drawCircle(ctx, circles, mouse, strokeColor, lineWidth) {
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (circles.length >= 1) {
      const lastCircle = circles[circles.length - 1];
      ctx.beginPath();
      ctx.moveTo(lastCircle.x, lastCircle.y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.stroke();
    }

    // Store the current mouse position as a circle
    circles.push({ x: mouse.x, y: mouse.y });
  }

  static drawRect(ctx, rectangles, mouse, isDrawingRect) {
    if (!isDrawingRect) {
      return; // Don't draw rectangles if rectangle drawing mode is off
    }

    // Set the fill color with transparency (e.g., 30% transparent cyan)
    ctx.fillStyle = "rgba(0, 255, 255, 0.3)";

    // Set line width to 0 for filled rectangles
    ctx.lineWidth = 0;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Calculate the fixed size for the rectangle
    const rectWidth = 35; // Set the width of the rectangle
    const rectHeight = 20; // Set the height of the rectangle

    let rectX = mouse.x - rectWidth / 2;
    let rectY = mouse.y - rectHeight / 2;

    ctx.fillRect(rectX, rectY, rectWidth, rectHeight);

    // Store the current rectangle
    rectangles.push({
      x: rectX,
      y: rectY,
      width: rectWidth,
      height: rectHeight,
    });
  }
}

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

    this.isDrawingCircle = false;
    this.isDrawingRect = false;
    this.isBrush = false;
    this.isEraser = false;

    this.circles = [[]];
    this.rectangles = [[]];

    this.strokes = [[]];
    this.undoStack = [];
    this.redoStack = [];

    this.isDrawingEnabled = false;
    this.activeButton = null;

    this.canvas.addEventListener("click", () => {
      if (this.isDrawingEnabled) {
        this.handleDrawingClick();
      }
      this.toggleDrawing();
    });

    this.canvas.addEventListener("pointermove", (event) => {
      if (this.isDrawingEnabled) {
        this.handlePointerMove(event);
      }
    });

    window.addEventListener("resize", () => {
      this.canvas.height = window.innerHeight;
      this.canvas.width = window.innerWidth;
    });
  }

  handleDrawingClick() {
    const currentStroke = {
      type: this.activeButton.id,
      data: this.isBrush ? [] : this.circles.slice(),
    };

    this.strokes.push(currentStroke);
    this.redoStack = [];
  }

  toggleDrawing() {
    this.isDrawingEnabled = !this.isDrawingEnabled;

    if (!this.isDrawingEnabled) {
      this.canvas.removeEventListener("pointermove", this.handlePointerMove);
      if (this.isDrawingRect) {
        this.rectangles = [];
      } else if (this.isDrawingCircle || this.isBrush || this.isEraser) {
        this.circles = [];
      }
    } else {
      this.canvas.addEventListener("pointermove", this.handlePointerMove);
    }
  }

  handlePointerMove = (event) => {
    this.mouse.x = event.clientX;
    this.mouse.y = event.clientY;

    if (
      this.isDrawingCircle &&
      !this.isDrawingRect &&
      !this.isBrush &&
      !this.isEraser
    ) {
      DrawingUtility.drawCircle(this.ctx, this.circles, this.mouse, "red", 2);
    }

    if (this.isBrush) {
      DrawingUtility.drawCircle(
        this.ctx,
        this.circles,
        this.mouse,
        "rgba(130, 255, 132, 0.2)",
        50
      );
    } else if (
      !this.isDrawingCircle &&
      !this.isDrawingRect &&
      !this.isBrush &&
      this.isEraser
    ) {
      DrawingUtility.drawCircle(
        this.ctx,
        this.circles,
        this.mouse,
        "cornsilk",
        60
      );
    } else if (
      !this.isDrawingCircle &&
      this.isDrawingRect &&
      !this.isBrush &&
      !this.isEraser
    ) {
      DrawingUtility.drawRect(
        this.ctx,
        this.rectangles,
        this.mouse,
        this.isDrawingRect
      );
    }
  };

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  //similar to clear canvas

  undo() {
    if (this.strokes.length > 0) {
      const lastStroke = this.strokes.pop();

      this.redoStack.push(lastStroke);
      // this.clearCanvas();

      for (const stroke of this.strokes) {
        if (stroke.type === "circle") {
          for (const circle of stroke.data) {
            this.drawCircle("red", 2, circle.x, circle.y);
          }
        } else if (stroke.type === "rectangle") {
          // Redraw rectangles if needed
        } else if (stroke.type === "brush") {
          // Redraw brush strokes if needed
        }
      }
    }
  }
  //not working yet
  redo() {
    if (this.redoStack.length > 0) {
      const nextStroke = this.redoStack.pop();

      this.strokes.push(nextStroke);
      this.clearCanvas();

      for (const stroke of this.strokes) {
        if (stroke.type === "circle") {
          for (const circle of stroke.data) {
            this.drawCircle("red", 2, circle.x, circle.y);
          }
        } else if (stroke.type === "rectangle") {
          // Redraw rectangles if needed
        } else if (stroke.type === "brush") {
          // Redraw brush strokes if needed
        }
      }
    }
  }
  //doesn't work
  redrawStrokes() {
    for (const stroke of this.strokes) {
      if (stroke.data) {
        this.setDrawingMode(stroke.type);

        if (!this.isBrush) {
          this.circles = stroke.data;
          this.drawCircle(
            stroke.type === "brush" ? "rgba(130, 255, 132, 0.2)" : "red",
            2
          );
        }
      }
    }
  }

  startDrawing(targetButton) {
    const toggleDrawingButton = document.getElementById("toggle-drawing");
    const brushHighlighter = document.getElementById("brush-highlighter");
    const paintBrushButton = document.getElementById("paintbrush");
    const eraseButton = document.getElementById("erase-button");

    if (targetButton === toggleDrawingButton) {
      this.isDrawingCircle = !this.isDrawingCircle;
      toggleDrawingButton.classList.toggle("selected-brush");

      this.isDrawingRect = false;
      this.isBrush = false;
      this.isEraser = false;
      brushHighlighter.classList.remove("selected-brush");
      paintBrushButton.classList.remove("selected-brush");
      eraseButton.classList.remove("selected-brush");
    } else if (targetButton === brushHighlighter) {
      this.isDrawingRect = !this.isDrawingRect;
      brushHighlighter.classList.toggle("selected-brush");

      this.isDrawingCircle = false;
      this.isBrush = false;
      this.isEraser = false;
      toggleDrawingButton.classList.remove("selected-brush");
      paintBrushButton.classList.remove("selected-brush");
      eraseButton.classList.remove("selected-brush");
    } else if (targetButton === paintBrushButton) {
      this.isBrush = !this.isBrush;
      paintBrushButton.classList.toggle("selected-brush");

      this.isDrawingCircle = false;
      this.isDrawingRect = false;
      this.isEraser = false;
      toggleDrawingButton.classList.remove("selected-brush");
      brushHighlighter.classList.remove("selected-brush");
      eraseButton.classList.remove("selected-brush");
    } else if (targetButton === eraseButton) {
      this.isEraser = !this.isEraser;
      eraseButton.classList.toggle("selected-brush");

      this.isDrawingCircle = false;
      this.isDrawingRect = false;
      this.isBrush = false;
      toggleDrawingButton.classList.remove("selected-brush");
      brushHighlighter.classList.remove("selected-brush");
      paintBrushButton.classList.remove("selected-brush");
    }

    this.activeButton = targetButton;
  }
}

/*****************class ends *****************/
// Create an instance of the DrawingCanvas class and specify the canvas ID
const canvas1 = new DrawingCanvas("canvas1");
//canvas1.startDrawing();

const toggleDrawingButton = document.getElementById("toggle-drawing");
toggleDrawingButton.addEventListener("click", () => {
  canvas1.startDrawing(toggleDrawingButton);
});

// Add event listener to toggle between drawing circles and rectangles
const brushHighlighter = document.getElementById("brush-highlighter");
brushHighlighter.addEventListener("click", () => {
  canvas1.startDrawing(brushHighlighter);
});

const paintBrushButton = document.getElementById("paintbrush");
paintBrushButton.addEventListener("click", () => {
  // console.log("event listner paint");
  canvas1.startDrawing(paintBrushButton);
});

const eraseButton = document.getElementById("erase-button");
eraseButton.addEventListener("click", () => {
  // console.log("event listner erase");
  canvas1.startDrawing(eraseButton);
});
const undoButton = document.getElementById("undo-btn");
undoButton.addEventListener("click", () => {
  console.log("undo");
  canvas1.undo();
});

const redoButton = document.getElementById("redo-btn");
redoButton.addEventListener("click", () => {
  console.log("redo");
  canvas1.redo();
});

// JavaScript code for toggling the white box
document.addEventListener("DOMContentLoaded", function () {
  const dropdownIcon = document.querySelector(".dropdown-icon");
  const whiteBox = document.querySelector(".white-box");

  dropdownIcon.addEventListener("click", function () {
    whiteBox.classList.toggle("hidden");
  });
});
