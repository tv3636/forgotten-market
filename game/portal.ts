import axios from "axios";
import axiosRetry from "axios-retry";
import { SOULS_METADATA_BASE_URL } from "../constants";
import { sleep } from "./gameUtils";

// constants/index.ts
// export const SOULS_IMAGES_BASE_URL = `${process.env.NEXT_PUBLIC_SOULS_API}/api/souls/img/`;
// export const SOULS_METADATA_BASE_URL = `${process.env.NEXT_PUBLIC_SOULS_API}/api/souls/data/`;

export async function fetchSoulsMetadataWithRetry({
  soulId,
}: {
  soulId: number | string;
}) {
  const url = SOULS_METADATA_BASE_URL + soulId;
  console.log("url: ", url);

  axiosRetry(axios, {
    retries: 4, // number of retries
    retryDelay: (retryCount: number) => {
      return retryCount * 2000; // time interval between retries
    },
  });

  let response = await axios.get(url);
  return response.data;
}
