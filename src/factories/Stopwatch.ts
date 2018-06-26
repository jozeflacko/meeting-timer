export type StopwatchCallback = (time: number) => void;

export default class Stopwatch {

    private id: any = null;
    private startTime: number = 0;
    private currentTimeInSeconds: number = 0;

    public start(callback: StopwatchCallback) {
        if (this.isRunning() === true) {
            throw new Error('Stopwatch already running');
        }
        this.startTime = Date.now() - ( this.currentTimeInSeconds * 1000);
        this.id = setInterval(() => {
            callback(this.getTime());           
        }, 1000);
    }

    public stop() {
        clearInterval(this.id);
        this.id = null;
    }

    public reset(): void {
        this.stop();
        this.startTime = 0;
        this.currentTimeInSeconds = 0;
    } 

    public getStartTime(): number {
        return this.startTime;
    }

    public getTime(): number {
        if (this.startTime > 0) {
            this.currentTimeInSeconds = parseFloat(Number((Date.now() - this.startTime) / 1000).toFixed(1));            
        }
        return this.currentTimeInSeconds ;

    }

    public isRunning(): boolean {
        return this.id !== null;
    }

}

