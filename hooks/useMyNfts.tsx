import { useEffect, useState } from "react";
import { httpifyUrl } from "../lib/nftUtilis";

export const useFetchDataFromTokenUri = (tokenUri: string, tokenId: number) => {
  const [loading, setLoading] = useState(true);
  const [metadata, setMetadata] = useState<{ [key: string]: any }>();
  const [image, setImage] = useState<string>();

  useEffect(() => {
    if (!tokenUri || !tokenId) return;

    async function fetchMetadata() {
      const httpTokenURI = await httpifyUrl(tokenUri, tokenId.toString());

      const response = await fetch(httpTokenURI);
      const metadata: any = await response.json();

      setMetadata(metadata);

      if (response.status === 404) {
        setLoading(false);
        throw new Error(`Can't find tokenURI for ${httpTokenURI}`);
      }

      if (metadata.image) {
        setImage(await httpifyUrl(metadata.image, tokenId.toString()));
      }

      setLoading(false);
    }

    fetchMetadata();
  }, [tokenUri, tokenId]);

  return { loading, metadata, image };
};
