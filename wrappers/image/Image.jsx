import Image from 'next/image';

import {getImageUrl} from 'grandus-lib/utils/index';

const ImageWrapped = ({
  photo,
  width,
  height,
  type,
  title,
  alt,
  priority,
  className,
  quality = 80,
  suffix = "@2x",
  onError
}) => {
  const src = getImageUrl(photo, `${width}x${height}${suffix ? suffix : ''}`, type);

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
      sizes="100vw"
      onError={onError}
    />
  );
};

export default ImageWrapped;
