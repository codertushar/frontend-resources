---
date: 2025-03-28T10:00:16+05:30
description: Build a customizable progress bar component with animations, color transitions, and accessibility features for tracking task completion.
---

# 📊 Progress Bar with Controls

Below is an example React component for a progress bar that has Start, Pause, Stop, and Reset buttons. The component uses a timer (setInterval) to update the progress value, and different buttons change the component's state:

---

### Explanation

* **State Management** :
* `progress` (0–100) tracks the bar width.
* `status` indicates if the progress is `"idle"`, `"running"`, `"paused"`, `"stopped"`, or `"completed"`.
* **Timer Control** :
* When **Start** is clicked, if not already running or stopped, an interval is set that increments progress.
* **Pause** clears the interval, keeping the current progress.
* **Stop** clears the interval and locks the progress (cannot resume).
* **Reset** clears any timer and resets progress and status.
* **Auto-complete** :
* When progress reaches 100%, the interval is cleared and status becomes `"completed"`.

---

### Code

```jsx
import React, { useState, useRef, useEffect } from 'react';

function ProgressBar() {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("idle"); // idle, running, paused, stopped, completed
  const intervalRef = useRef(null);

  // Start or resume progress
  const startProgress = () => {
    // If already running or completed/stopped, do nothing
    if (status === "running" || status === "completed" || status === "stopped") return;

    setStatus("running");
    intervalRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(intervalRef.current);
          setStatus("completed");
          return 100;
        }
        return prev + 1; // Increment progress by 1% per tick
      });
    }, 100); // Update every 100ms
  };

  // Pause the progress
  const pauseProgress = () => {
    if (status === "running") {
      clearInterval(intervalRef.current);
      setStatus("paused");
    }
  };

  // Stop the progress completely (cannot be resumed until reset)
  const stopProgress = () => {
    if (status === "running" || status === "paused") {
      clearInterval(intervalRef.current);
      setStatus("stopped");
    }
  };

  // Reset to initial state
  const resetProgress = () => {
    clearInterval(intervalRef.current);
    setProgress(0);
    setStatus("idle");
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div style={{ padding: "20px", maxWidth: "400px" }}>
      <div style={{ height: "30px", border: "1px solid #ccc", borderRadius: "5px", overflow: "hidden", marginBottom: "10px" }}>
        <div style={{ width: `${progress}%`, height: "100%", background: "green", transition: "width 0.1s" }}></div>
      </div>
      <div style={{ marginBottom: "10px" }}>Progress: {progress}%</div>
      <button onClick={startProgress} disabled={status === "running" || status === "completed" || status === "stopped"}>Start</button>
      <button onClick={pauseProgress} disabled={status !== "running"}>Pause</button>
      <button onClick={stopProgress} disabled={status !== "running" && status !== "paused"}>Stop</button>
      <button onClick={resetProgress}>Reset</button>
    </div>
  );
}

export default ProgressBar;
```

---

### How It Works

* **Start Button** :

  Initiates the timer if the progress is idle or paused. It won’t restart if already running, completed, or stopped.
* **Pause Button** :

  Clears the interval, freezing the progress.
* **Stop Button** :

  Clears the interval and sets the state to `"stopped"`, disallowing resume until the progress is reset.
* **Reset Button** :

  Resets the progress to 0 and the status to `"idle"`, allowing you to start over.

This component demonstrates a simple progress bar that updates on an interval and provides control buttons to manage its state.

=====================================================

Below is a complete example of a reusable Progress Bar component implemented as an ES6 class in plain JavaScript. You can reuse this component by instantiating it on any container element.

---

### Code

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Reusable Progress Bar Component</title>
  <style>
    .progress-wrapper button {
      margin-right: 5px;
      margin-top: 5px;
    }
  </style>
</head>
<body>
  <!-- Container to mount the progress bar component -->
  <div id="app"></div>

  <script>
    class ProgressBar {
      constructor(container) {
        this.container = container;
        this.progress = 0;
        this.status = "idle"; // possible values: "idle", "running", "paused", "stopped", "completed"
        this.intervalId = null;
        this.createDOM();
        this.updateUI();
      }

      createDOM() {
        // Create wrapper element
        this.wrapper = document.createElement("div");
        this.wrapper.classList.add("progress-wrapper");

        // Create progress container element
        this.progressContainer = document.createElement("div");
        this.progressContainer.style.cssText = `
          width: 400px;
          height: 30px;
          border: 1px solid #ccc;
          border-radius: 5px;
          overflow: hidden;
          margin-bottom: 10px;
        `;

        // Create the actual progress bar element
        this.progressBar = document.createElement("div");
        this.progressBar.style.cssText = `
          height: 100%;
          background: green;
          width: 0%;
          transition: width 0.1s;
        `;
        this.progressContainer.appendChild(this.progressBar);

        // Create progress text element
        this.progressText = document.createElement("div");
        this.progressText.style.marginBottom = "10px";
        this.progressText.textContent = "Progress: 0%";

        // Create control buttons
        this.startBtn = document.createElement("button");
        this.startBtn.textContent = "Start";
        this.pauseBtn = document.createElement("button");
        this.pauseBtn.textContent = "Pause";
        this.stopBtn = document.createElement("button");
        this.stopBtn.textContent = "Stop";
        this.resetBtn = document.createElement("button");
        this.resetBtn.textContent = "Reset";

        // Append all elements into the wrapper
        this.wrapper.appendChild(this.progressContainer);
        this.wrapper.appendChild(this.progressText);
        this.wrapper.appendChild(this.startBtn);
        this.wrapper.appendChild(this.pauseBtn);
        this.wrapper.appendChild(this.stopBtn);
        this.wrapper.appendChild(this.resetBtn);

        // Append the wrapper to the provided container element
        this.container.appendChild(this.wrapper);

        // Attach event listeners to control buttons
        this.startBtn.addEventListener("click", () => this.start());
        this.pauseBtn.addEventListener("click", () => this.pause());
        this.stopBtn.addEventListener("click", () => this.stop());
        this.resetBtn.addEventListener("click", () => this.reset());
      }

      updateUI() {
        this.progressBar.style.width = `${this.progress}%`;
        this.progressText.textContent = `Progress: ${this.progress}%`;
      }

      start() {
        if (this.status === "running" || this.status === "completed" || this.status === "stopped") return;
        this.status = "running";
        this.intervalId = setInterval(() => {
          if (this.progress >= 100) {
            clearInterval(this.intervalId);
            this.progress = 100;
            this.status = "completed";
            this.updateUI();
          } else {
            this.progress++;
            this.updateUI();
          }
        }, 100);
      }

      pause() {
        if (this.status === "running") {
          clearInterval(this.intervalId);
          this.status = "paused";
        }
      }

      stop() {
        if (this.status === "running" || this.status === "paused") {
          clearInterval(this.intervalId);
          this.status = "stopped";
        }
      }

      reset() {
        clearInterval(this.intervalId);
        this.progress = 0;
        this.status = "idle";
        this.updateUI();
      }
    }

    // Usage example:
    // Instantiate the ProgressBar component in the container with id "app"
    const appContainer = document.getElementById("app");
    const myProgressBar = new ProgressBar(appContainer);
  </script>
</body>
</html>
```

---

### Explanation

1. **ES6 Class Component**

   The `ProgressBar` class encapsulates the component’s state and DOM structure.

   * The constructor accepts a container element in which the component is rendered.
   * State properties include `progress`, `status`, and `intervalId`.
2. **DOM Creation**

   The `createDOM()` method creates all necessary elements (progress container, bar, text, and buttons) and appends them to the container. Inline styles and class names are used for basic styling.
3. **UI Update**

   The `updateUI()` method adjusts the progress bar's width and updates the displayed percentage.
4. **Control Methods**

   * `start()`: Starts/resumes progress using `setInterval`.
   * `pause()`: Pauses progress by clearing the interval.
   * `stop()`: Stops progress permanently until a reset.
   * `reset()`: Resets the progress to 0 and status to "idle".
5. **Event Listeners**

   Buttons are wired up to call the corresponding methods on click.

This reusable component can be instantiated multiple times in different containers if needed.


# Interactive Demo

[Cluade](https://claude.site/artifacts/ea368905-ef9c-4e65-82f4-7e26fce3599f)
