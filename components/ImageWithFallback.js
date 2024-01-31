import { useState, useEffect } from "react";
import Image from "next/image";

import { createAvatar } from "@dicebear/core";
import { initials } from "@dicebear/collection";

const ImageWithFallback = ({ title, alt, src, ...props }) => {
  const [error, setError] = useState(null);

  const avatar = createAvatar(initials, {
    seed: title,
    size: 32,
  }).toDataUriSync();

  useEffect(() => {
    setError(null);
  }, [src]);

  return (
    <Image alt={alt} onError={setError} src={error ? avatar : src} {...props} />
  );
};

export default ImageWithFallback;
