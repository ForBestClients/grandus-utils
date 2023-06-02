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
}) => {
  return (
    <Image
      width={width}
      height={height}
      src={getImageUrl(photo, `${width}x${height}`, type)}
      title={title}
      alt={alt ? alt : ' '}
      priority={priority}
      className={className}
      quality={quality}
    />
  );
};

export default ImageWrapped;
