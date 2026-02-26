//GameController.ts
export class GameController {
  private listeners: ((msg: any) => void)[] = [];

  onMessage(cb: (msg: any) => void) {
    this.listeners.push(cb);
  }

  sendMessage(msg: any) {
    for (const cb of this.listeners) {
      cb(msg);
    }
  }

  // Dummy spin response
  requestSpin() {
    //console.log("requestSpin");
    //this.sendMessage({ type: "spinStart" });

    const dummy = {
      type: "spinStart",
      reels: [
        ["7", "0", "0"],
        ["2", "2", "2"],
        ["3", "3", "3"],
        ["4", "4", "4"],
        ["5", "5", "7"],
      ],
      win: 120,
      credits: 880,
    };

    this.sendMessage(dummy);
  }
}
