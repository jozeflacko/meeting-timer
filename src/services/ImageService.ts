export default class ImageService {

    private static images: string[]  = ImageService.createImageLinks(11);
    private static lastImageIndex = 0;
    
    private static createImageLinks(howMany: number): string[]  {
        const result: string[] = [];
        
        for (let index = 0; index < howMany; index++ ) {
            result.push('img/avatars/' + index + '.png');
        }
        return result;         
    }

    public getImage(index: number): string {
        if (index < ImageService.images.length) {
            return ImageService.images[index];
        } else  {
            return '';
        }  
    }

    public getNextImage(): string {
        ImageService.lastImageIndex++;
        return this.getImage(ImageService.lastImageIndex);
    }
}
