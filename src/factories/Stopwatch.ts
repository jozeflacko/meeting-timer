export type StopwatchCallback = (time: number) => void;

export default class Stopwatch {

    private id: any = null;
    private startTime: number = 0;
    private currentTimeInSeconds: number = 0;
    private REFRESH_TIME_EVERY_MILISECONDS = 500;

    private secondsToMiliseconds(seconds) {
        return seconds * 1000;
    }

    public setCurrentTimeInSeconds(seconds: number) {
        this.currentTimeInSeconds = seconds;
    }

    public start(callback: StopwatchCallback) {
        if (this.isRunning() === true) {
            throw new Error('Stopwatch already running');
        }
        const now = Date.now();
        this.startTime = now - this.secondsToMiliseconds(this.currentTimeInSeconds);
        this.id = setInterval(() => {
            callback(this.getTime());           
        }, this.REFRESH_TIME_EVERY_MILISECONDS);
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

