export default function ImageUrlFilter(imageList) {
    const isImageUrl = (url) => {
        return /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(url.split('?')[0]);
    };
    const imageUrl = imageList.filter(image => isImageUrl(String(image.url)) ? image : null);
    // console.log(imageUrl)
    return imageUrl
}