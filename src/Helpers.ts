

export class Helpers {
    public static ClampNumber(numberToClamp: number, min : number, max: number): number {
        if(numberToClamp < min) {
            numberToClamp = min;
        } else if(numberToClamp > max) {
            numberToClamp = max;
        }
        return numberToClamp;
    }

    public static ColourBlender(colour1: string, colour2: string, percentage: number): string {
        // Clamp percentage between 0 and 1
        const clampedPercentage = Math.max(0, Math.min(1, percentage));

        // Convert the colors to RGB
        const rgb1 = Helpers.HexToRGB(colour1);
        const rgb2 = Helpers.HexToRGB(colour2);

        // Blend the RGB values based on the percentage
        const r = Math.round(rgb1.r + clampedPercentage * (rgb2.r - rgb1.r));
        const g = Math.round(rgb1.g + clampedPercentage * (rgb2.g - rgb1.g));
        const b = Math.round(rgb1.b + clampedPercentage * (rgb2.b - rgb1.b));

        // Convert the result back to hex and return it
        return Helpers.RGBToHex(r, g, b);
    }

    public static HexToRGB(hex: string): { r: number, g: number, b: number } {
        const bigint = parseInt(hex.slice(1), 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return { r, g, b };
    }

    public static RGBToHex(r: number, g: number, b: number): string {
        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    }

}
