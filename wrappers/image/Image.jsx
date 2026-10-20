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
  sizes = '100vw',
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
      // Next 16's `priority` only preloads – it no longer sets fetchpriority,
      // and async decoding let the LCP image paint frames after it loaded.
      fetchPriority={priority ? 'high' : undefined}
      decoding={priority ? 'sync' : undefined}
      className={className}
      quality={quality}
      sizes={sizes}
      onError={onError}
    />
  );
};

export default ImageWrapped;
