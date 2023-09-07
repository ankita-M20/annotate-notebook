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

    this.isDrawing = false; // Flag to control circle drawing mode
    this.isDrawingRect = false; // Flag to control rectangle drawing mode
    this.circles = [];
    this.rectangles = []; // Clear rectangles

    this.isDrawingEnabled = false; // Flag to control pointer event
    this.activeButton = null; // Reference to the active button

    this.canvas.addEventListener("click", () => {
      this.toggleDrawing();
    });

    this.canvas.addEventListener("pointermove", (event) => {
      if (this.isDrawingEnabled) {
        this.handlePointerMove(event);
      }
    });

    /*this.canvas.addEventListener("click", (event) => {
      this.mouse.x = event.x;
      this.mouse.y = event.y;
      if (this.isDrawing && !this.isDrawingRect) {
        this.drawCircle();
      } else if (this.isDrawing && this.isDrawingRect) {
        this.drawRect();
      }
      //this.drawCircle();
    });

    this.canvas.addEventListener("pointermove", (event) => {
      this.mouse.x = event.x;
      this.mouse.y = event.y;
      if (this.isDrawing && !this.isDrawingRect) {
        this.drawCircle();
      } else if (!this.isDrawing && this.isDrawingRect) {
        this.drawRect();
      }
    });*/

    window.addEventListener("resize", () => {
      this.canvas.height = window.innerHeight;
      this.canvas.width = window.innerWidth;
    });
  }

  toggleDrawing() {
    this.isDrawingEnabled = !this.isDrawingEnabled;

    if (!this.isDrawingEnabled) {
      // Disable the pointer event and clear the shapes array based on the drawing mode
      this.canvas.removeEventListener("pointermove", this.handlePointerMove);
      if (this.isDrawingRect) {
        this.rectangles = []; // Clear rectangles
      } else {
        this.circles = []; // Clear circles
      }
    } else {
      this.canvas.addEventListener("pointermove", this.handlePointerMove);
    }
  }

  handlePointerMove = (event) => {
    this.mouse.x = event.clientX;
    this.mouse.y = event.clientY;

    if (this.isDrawing && !this.isDrawingRect) {
      this.drawCircle();
    } else if (!this.isDrawing && this.isDrawingRect) {
      this.drawRect();
    } else {
      if (this.rectangles.length >= 1) {
        const firstRect = this.rectangles[0];
        const distance = Math.sqrt(
          (firstRect.x - this.mouse.x) ** 2 + (firstRect.y - this.mouse.y) ** 2
        );
        if (distance > 30) {
          this.rectangles.shift(); // Remove the first rectangle
        }
      }
    }
  };

  drawCircle() {
    if (!this.isDrawing) {
      return; // Don't draw if drawing mode is off
    }
    this.ctx.strokeStyle = "red"; // "rgba(0, 255, 255, 0.1)";
    //"red";
    this.ctx.lineWidth = 15;
    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";

    if (this.circles.length >= 1) {
      const lastCircle = this.circles[this.circles.length - 1];
      this.ctx.beginPath();
      this.ctx.moveTo(lastCircle.x, lastCircle.y);
      this.ctx.lineTo(this.mouse.x, this.mouse.y);
      this.ctx.stroke();
    }

    // Store the current mouse position as a circle
    this.circles.push({ x: this.mouse.x, y: this.mouse.y });
  }
  drawRect() {
    if (!this.isDrawingRect) {
      return; // Don't draw rectangles if rectangle drawing mode is off
    }

    // Set the fill color with transparency (e.g., 30% transparent cyan)
    this.ctx.fillStyle = "rgba(0, 255, 255, 0.3)";
    //this.highlightCtx.fillStyle = "rgba(0, 255, 255, 0.3)";

    // Set line width to 0 for filled rectangles
    this.ctx.lineWidth = 0;
    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";

    // Calculate the fixed size for the rectangle
    const rectWidth = 35; // Set the width of the rectangle
    const rectHeight = 20; // Set the height of the rectangle

    // Initialize the position for the new rectangle
    let rectX = this.mouse.x;
    let rectY = this.mouse.y;

    // Calculate the position for the new rectangle immediately adjacent to the previous one
    if (this.rectangles.length >= 1) {
      const lastRect = this.rectangles[this.rectangles.length - 1];

      // Calculate the x-coordinate for the new rectangle
      rectX = lastRect.x; //+ rectWidth;

      // Check if the new rectangle would go out of the canvas
      if (rectX + rectWidth > this.canvas.width) {
        // Start a new row of rectangles
        rectX = 0;
        rectY = lastRect.y + rectHeight;
      }

      // Fill the gap between the new rectangle and the previous one
      if (rectX > lastRect.x + lastRect.width) {
        const gapWidth = rectX - (lastRect.x + lastRect.width);
        this.ctx.fillRect(
          lastRect.x + lastRect.width,
          rectY,
          gapWidth,
          rectHeight
        );
      }
    }

    // Draw the filled rectangle at the calculated position
    this.ctx.fillRect(rectX, rectY, rectWidth, rectHeight);
  }

  /*
    if (this.circles.length >= 1) {
      const lastCircle = this.circles[this.circles.length - 1];
      this.ctx.beginPath();
      this.ctx.moveTo(lastCircle.x, lastCircle.y);
      this.ctx.lineTo(this.mouse.x, this.mouse.y);
      this.ctx.stroke();
    }

    // Store the current mouse position as a rectangle start point
    this.circles.push({ x: this.mouse.x, y: this.mouse.y });
  }*/

  /*startDrawing() {
    this.isDrawing = !this.isDrawing; // Toggle drawing mode on button click
    const toggleDrawingButton = document.getElementById("toggle-drawing");

    if (!this.isDrawing) {
      // Clear the canvas when drawing mode is turned off
      toggleDrawingButton.classList.remove("drawing-on");
      toggleDrawingButton.classList.add("drawing-off");
    } else {
      toggleDrawingButton.classList.remove("drawing-off");
      toggleDrawingButton.classList.add("drawing-on");
    }
  }*/
  startDrawing(targetButton) {
    const toggleDrawingButton = document.getElementById("toggle-drawing");
    const brushHighlighter = document.getElementById("brush-highlighter");

    if (targetButton === toggleDrawingButton) {
      this.isDrawing = !this.isDrawing; // Toggle drawing mode
      toggleDrawingButton.classList.toggle("drawing-on");
      toggleDrawingButton.classList.toggle("drawing-off");

      // Ensure the other drawing mode is off
      this.isDrawingRect = false;
      brushHighlighter.classList.remove("selected-brush");
    } else if (targetButton === brushHighlighter) {
      this.isDrawingRect = !this.isDrawingRect; // Toggle rectangle drawing mode
      brushHighlighter.classList.toggle("selected-brush");

      // Ensure circle drawing mode is off
      this.isDrawing = false;
      toggleDrawingButton.classList.remove("drawing-on");
      toggleDrawingButton.classList.add("drawing-off");
    }

    // Set the active button
    this.activeButton = targetButton;
  }
}
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
