export default {
  ON_UPDATE: "ON_UPDATE",
  ON_BUTTON_CLICK: "ON_BUTTON_CLICK",
  ON_WINDOW_RESIZE: "ON_WINDOW_RESIZE",
  ON_METAMASK_ATTEMPT_CONNECT: "ON_METAMASK_ATTEMPT_CONNECT",
  ON_METAMASK_CONNECTED: "ON_METAMASK_CONNECTED",
  ON_SITE_PROVIDER: "ON_SITE_PROVIDER",
};

export type OnMetamaskConnectedEventArgs = {
  provider: any;
  injectedProvider: any;
  address?: string;
};

export type OnSiteProviderEventArgs = {
  provider: any;
};
