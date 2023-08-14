import Image from 'next/image';

import { getImageUrl } from 'grandus-lib/utils/index';

const ImageWrapped = ({
  photo,
  width,
  height,
  type,
  title,
  alt,
  priority,
  className,
  quality = 75,
  isCropped = false,
}) => {
  const src = getImageUrl(photo, `${width}x${height}${isCropped ? '__cropped' : ''}`, type);

  if (!src) {
    return ''; //todo placeholder
  }

  return (
    <Image
      width={width}
      height={height}
      src={src}
      title={title}
      alt={alt ? alt : ' '}
      priority={priority}
      className={className}
      quality={quality}
    />
  );
};

export default ImageWrapped;
