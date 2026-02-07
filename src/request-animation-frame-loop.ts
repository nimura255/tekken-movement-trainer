const FRAMES_INTERVAL_MILLISECONDS = 1000 / 60;

export class RequestAnimationFrameLoop {
  private prevTimestamp: number | undefined;
  private requestID: number | undefined;
  private callback: (timestamp: number) => void;
  private isRunning = false;

  constructor(callback: (timestamp: number) => void) {
    this.callback = callback;
  }

  public stop() {
    this.isRunning = false;

    if (this.requestID !== undefined) {
      cancelAnimationFrame(this.requestID);
      this.requestID = undefined;
    }
  }

  public start() {
    this.isRunning = true;
    this.requestID = requestAnimationFrame(this.loopStep);
  }

  private loopStep = (timestamp: number) => {
    if (!this.isRunning) {
      return;
    }

    if (this.prevTimestamp === undefined || timestamp - this.prevTimestamp >= FRAMES_INTERVAL_MILLISECONDS) {
      this.prevTimestamp = timestamp;
      this.callback(timestamp);
    }

    this.requestID = requestAnimationFrame(this.loopStep);
  }
}
