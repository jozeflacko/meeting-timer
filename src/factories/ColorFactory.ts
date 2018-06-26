export default class ColorFactory {
    
    public static getRandomColor(withTransparency: boolean = true): string {
        const letters = '0123456789ABCDEF';
        let bgcolor = '#';
        for (let i = 0; i < 6; i++) {
            bgcolor += letters[Math.floor(Math.random() * 16)];
        }
        
        return withTransparency ? ColorFactory.addTransparencyToColor(bgcolor) : bgcolor;
    }

    private static invertColor(hex: string): string {
    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
        throw new Error('Invalid HEX color.');
    }
    const r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
        g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
        b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
    return '#' + ColorFactory.padZero(r) + ColorFactory.padZero(g) + ColorFactory.padZero(b);
    }

    private static padZero(str: string, len: number = 2): string {
        const zeros = new Array(len).join('0');
        return (zeros + str).slice(-len);
    }
    
    private static addTransparencyToColor(hex: string): string {
        let c;        
        if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
            c = hex.substring(1).split('');
            if (c.length == 3) {
                c = [c[0], c[0], c[1], c[1], c[2], c[2]];
            }
            c = '0x' + c.join('');
        
            return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',.4)';
        }
        throw new Error('Bad Hex');
    }
}

