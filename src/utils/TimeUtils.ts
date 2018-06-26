export default class TimeUtils {
    
    public static from_HHmmss_to_Seconds(hms: string, natural: boolean = false): number {
        
        if (hms === undefined) {
            return 0;
        }

        if (natural === false) {
            const a = hms.split(':'); // split it at the colons
    
            // minutes are worth 60 seconds. Hours are worth 60 minutes.
            return (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]); 
        } else {
            let hours = 0;
            let mins = 0;
            let seconds = 0;
            
            hms.trim();

            const h = hms.split('h');
            if (h.length === 2) {
                hours = Number(h[0]);
                hms = h[1].trim();
            }
            const m = hms.split('m');
            if (m.length === 2) {
                mins = Number(m[0]);
                hms = m[1].trim();
            }   
            const s = hms.split('s');         
            if (hms) {
                seconds = Number(s[0]);
            }
            return seconds + (60 * mins) + (60 * 60 * hours);
        }
    }

    public static from_Seconds_to_HHmmss(totalSeconds: number, natural: boolean = false): string {
        
        if (totalSeconds === undefined) {
            return '';
        }

        const ZERO = '0';
        const COLON = ':';

        const hours   = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
        let seconds = totalSeconds - (hours * 3600) - (minutes * 60);

        // round seconds
        seconds = Math.round(seconds * 100) / 100;

        let result: string = '';
        
        if (natural === false) {
            result = (hours < 10 ? ZERO + hours : hours).toString();
            result += COLON + (minutes < 10 ? ZERO + minutes : minutes);
            result += COLON + (seconds  < 10 ? ZERO + seconds : seconds);
        } else {
            result =  hours   === 0 ? '' : hours.toString()   + 'h ';
            result += minutes === 0 ? '' : minutes.toString() + 'm ';
            result += seconds === 0 ? '' : seconds.toString() + 's';
        }
        
        return result.toString();
    }

    public static getOvertimeInSeconds(currentTimeInSeconds, timeLimitInSeconds) {
        return currentTimeInSeconds > timeLimitInSeconds ? currentTimeInSeconds - timeLimitInSeconds : 0;
    }

    public static getOvertimeInHHmmss(
            currentTimeInSeconds: number, 
            timeLimitInSeconds: number, 
            natural: boolean): string {
        const seconds = TimeUtils.getOvertimeInSeconds(currentTimeInSeconds, timeLimitInSeconds);
        return seconds === 0 ? '' : ' + ' + TimeUtils.from_Seconds_to_HHmmss(seconds, natural);
    }

    /**
     * will return current time or time limit when current time is higher
     * 
     * @param currentTimeInSeconds 
     * @param timeLimitInSeconds 
     * @param natural 
     */
    public static getCurrentTimeInHHmmss(
        currentTimeInSeconds: number, 
        timeLimitInSeconds: number, 
        natural: boolean): string {
        const seconds = currentTimeInSeconds <= timeLimitInSeconds ? currentTimeInSeconds : timeLimitInSeconds;
    
        return seconds === 0 ? '' : TimeUtils.from_Seconds_to_HHmmss(seconds, natural);
    }
}

