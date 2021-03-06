/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

 export interface paths {
  '/attributes': {
    get: operations['getAttributes']
  }
  '/collections': {
    get: operations['getCollections']
  }
  '/market': {
    get: operations['getMarket']
  }
  '/orders': {
    get: operations['getOrders']
    post: operations['postOrders']
  }
  '/owners': {
    get: operations['getOwners']
  }
  '/sales': {
    get: operations['getSales']
  }
  '/stats': {
    get: operations['getStats']
  }
  '/tokens': {
    get: operations['getTokens']
  }
  '/transfers': {
    get: operations['getTransfers']
  }
  '/collections/{collection}': {
    get: operations['getCollectionsCollection']
  }
  '/execute/bid': {
    get: operations['getExecuteBid']
  }
  '/execute/build': {
    get: operations['getExecuteBuild']
  }
  '/execute/buy': {
    get: operations['getExecuteBuy']
  }
  '/execute/cancel': {
    get: operations['getExecuteCancel']
  }
  '/execute/fill': {
    get: operations['getExecuteFill']
  }
  '/execute/list': {
    get: operations['getExecuteList']
  }
  '/execute/sell': {
    get: operations['getExecuteSell']
  }
  '/liquidity/collections': {
    get: operations['getLiquidityCollections']
  }
  '/liquidity/users': {
    get: operations['getLiquidityUsers']
  }
  '/orders/all': {
    get: operations['getOrdersAll']
  }
  '/orders/build': {
    get: operations['getOrdersBuild']
  }
  '/orders/executed': {
    get: operations['getOrdersExecuted']
  }
  '/orders/fill': {
    get: operations['getOrdersFill']
  }
  '/tokens/details': {
    get: operations['getTokensDetails']
  }
  '/tokens/floor': {
    get: operations['getTokensFloor']
  }
  '/collections/{collection}/attributes': {
    get: operations['getCollectionsCollectionAttributes']
  }
  '/collections/{collection}/top-buys': {
    get: operations['getCollectionsCollectionTopbuys']
  }
  '/users/{user}/tokens': {
    get: operations['getUsersUserTokens']
  }
  '/users/{user}/positions': {
    get: operations['getUsersUserPositions']
  }
  '/users/{user}/collections': {
    get: operations['getUsersUserCollections']
  }
  '/apikey': {
    /** The API key can be used optionally in every route, set it as a request header **x-api-key** */
    post: operations['postApikey']
  }
  '/admin/contracts': {
    post: operations['postAdminContracts']
  }
  '/attributes/refresh': {
    post: operations['postAttributesRefresh']
  }
  '/admin/disable/orders': {
    post: operations['postAdminDisableOrders']
  }
  '/admin/fetch/blocks': {
    post: operations['postAdminFetchBlocks']
  }
  '/admin/fix/cache': {
    post: operations['postAdminFixCache']
  }
  '/admin/index/metadata': {
    post: operations['postAdminIndexMetadata']
  }
  '/admin/sync/events': {
    post: operations['postAdminSyncEvents']
  }
  '/admin/sync/orders': {
    post: operations['postAdminSyncOrders']
  }
  '/admin/index/metadata/fast': {
    post: operations['postAdminIndexMetadataFast']
  }
}

export interface definitions {
  Model1: {
    value?: string
    count?: number
  }
  values: definitions['Model1'][]
  Model2: {
    key?: string
    kind?: string
    values?: definitions['values']
  }
  attributes: definitions['Model2'][]
  getAttributesResponse: {
    attributes?: definitions['attributes']
  }
  collection: {
    id?: string
    name?: string
    description?: string
    image?: string
    tokenSetId?: string
  }
  royalties: {
    recipient?: string
    bps?: number
  }
  sampleImages: string[]
  lastBuy: {
    value?: number
    block?: number
  }
  token: {
    contract?: string
    tokenId?: string
    name?: string
    image?: string
  }
  floorSell: {
    hash?: string
    value?: number
    maker?: string
    validFrom?: number
    validUntil?: number
    token?: definitions['token']
  }
  topBuy: {
    hash?: string
    value?: number
    maker?: string
    validFrom?: number
    validUntil?: number
  }
  market: {
    floorSell?: definitions['floorSell']
    topBuy?: definitions['topBuy']
  }
  set: {
    tokenCount?: number
    onSaleCount?: number
    sampleImages?: definitions['sampleImages']
    lastBuy?: definitions['lastBuy']
    market?: definitions['market']
  }
  Model3: {
    collection?: definitions['collection']
    royalties?: definitions['royalties']
    set?: definitions['set']
  }
  collections: definitions['Model3'][]
  getCollectionsResponse: {
    collections?: definitions['collections']
  }
  Model4: {
    value?: number
    quantity?: number
  }
  buys: definitions['Model4'][]
  Model5: {
    buys?: definitions['buys']
    sells?: definitions['buys']
  }
  Model6: {
    market?: definitions['Model5']
  }
  data: { [key: string]: unknown }
  schema: {
    data?: definitions['data']
    kind?: string
  }
  metadata: {
    collectionName?: string
    tokenName?: string
  }
  sourceInfo: {
    id?: string
    bps?: number
  }
  royaltyInfo: definitions['royalties'][]
  Model7: {
    hash?: string
    status?: string
    tokenSetId?: string
    schema?: definitions['schema']
    metadata?: definitions['metadata']
    kind?: string
    side?: string
    maker?: string
    price?: number
    value?: number
    validFrom?: number
    validUntil?: number
    sourceInfo?: definitions['sourceInfo']
    royaltyInfo?: definitions['royaltyInfo']
    rawData?: definitions['data']
  }
  orders: definitions['Model7'][]
  getOrdersResponse: {
    orders?: definitions['orders']
  }
  ownership: {
    tokenCount?: number
    onSaleCount?: number
    floorSellValue?: number
    topBuyValue?: number
    totalBuyValue?: number
    lastAcquiredAt?: number
  }
  Model8: {
    address?: string
    ownership?: definitions['ownership']
  }
  owners: definitions['Model8'][]
  getOwnersResponse: {
    owners?: definitions['owners']
  }
  Model9: {
    id?: string
    name?: string
  }
  Model10: {
    contract?: string
    name?: string
    image?: string
    tokenId?: string
    collection?: definitions['Model9']
  }
  Model11: {
    token?: definitions['Model10']
    from?: string
    to?: string
    amount?: number
    txHash?: string
    block?: number
    timestamp?: number
    price?: number
    tokenSetId?: string
    schema?: string
  }
  sales: definitions['Model11'][]
  getSalesResponse: {
    sales?: definitions['sales']
  }
  getStatsResponse: {
    stats?: definitions['set']
  }
  Model12: {
    contract?: string
    name?: string
    image?: string
    tokenId?: string
    collection?: definitions['Model9']
    topBuyValue?: number
    floorSellValue?: number
  }
  tokens: definitions['Model12'][]
  getTokensResponse: {
    tokens?: definitions['tokens']
  }
  Model13: {
    token?: definitions['Model10']
    from?: string
    to?: string
    amount?: number
    txHash?: string
    block?: number
    timestamp?: number
    price?: number
  }
  transfers: definitions['Model13'][]
  getTransfersResponse: {
    transfers?: definitions['transfers']
  }
  Model14: {
    value?: number
    timestamp?: number
  }
  Model15: {
    id?: string
    name?: string
    description?: string
    image?: string
    tokenSetId?: string
    lastBuy?: definitions['Model14']
    lastSell?: definitions['Model14']
  }
  Model16: {
    collection?: definitions['Model15']
    royalties?: definitions['royalties']
    set?: definitions['set']
  }
  getCollectionResponse: {
    collection?: definitions['Model16']
  }
  Model17: {
    action: string
    description: string
    status: 'complete' | 'incomplete'
    kind: 'request' | 'signature' | 'transaction'
    data?: string
  }
  steps: definitions['Model17'][]
  getExecuteBidResponse: {
    steps?: definitions['steps']
    query?: string
    error?: string
  }
  Model18: {
    action: string
    description: string
    status: 'complete' | 'incomplete'
    kind: 'order-signature' | 'transaction'
    data?: string
  }
  Model19: definitions['Model18'][]
  getExecuteBuildResponse: {
    steps?: definitions['Model19']
    error?: string
  }
  Model20: {
    action: string
    description: string
    status: 'complete' | 'incomplete'
    kind: 'transaction' | 'confirmation'
    data?: string
  }
  Model21: definitions['Model20'][]
  getExecuteBuyResponse: {
    steps?: definitions['Model21']
    error?: string
  }
  Model22: {
    id?: string
    name?: string
    image?: string
  }
  Model23: {
    collection: definitions['Model22']
    tokenCount?: number
    liquidity?: number
    uniqueTopBuyers?: number
    topLiquidityProvider?: string
  }
  liquidity: definitions['Model23'][]
  getCollectionsLiquidityResponse: {
    liquidity?: definitions['liquidity']
  }
  Model24: {
    user?: string
    rank?: number
    tokenCount?: number
    liquidity?: number
    maxTopBuyValue?: number
    wethBalance?: number
  }
  Model25: definitions['Model24'][]
  getUsersLiquidityResponse: {
    liquidity?: definitions['Model25']
  }
  Model26: {
    hash?: string
    tokenSetId?: string
    schema?: definitions['schema']
    metadata?: definitions['metadata']
    kind?: string
    side?: string
    maker?: string
    price?: number
    value?: number
    validFrom?: number
    validUntil?: number
    sourceInfo?: definitions['sourceInfo']
    royaltyInfo?: definitions['royaltyInfo']
    createdAt?: string
    rawData?: definitions['data']
  }
  Model27: definitions['Model26'][]
  getOrdersAllResponse: {
    orders?: definitions['Model27']
    continuation?: string
  }
  params: {
    exchange: string
    maker: string
    taker: string
    makerRelayerFee: number
    takerRelayerFee: number
    feeRecipient: string
    side: 0 | 1
    saleKind: 0 | 1
    target: string
    howToCall: 0 | 1
    calldata: string
    replacementPattern: string
    staticTarget: string
    staticExtradata: string
    paymentToken: string
    basePrice: string
    extra: string
    listingTime: number
    expirationTime: number
    salt: string
    v: number
    r: string
    s: string
  }
  order: {
    params?: definitions['params']
  }
  getOrdersBuildResponse: {
    order?: definitions['order']
  }
  Model28: {
    params?: definitions['params']
    buildMatchingArgs?: definitions['sampleImages']
  }
  getOrdersFillResponse: {
    order?: definitions['Model28']
  }
  Model29: {
    key?: string
    value?: string
  }
  Model30: definitions['Model29'][]
  Model31: {
    contract?: string
    kind?: string
    name?: string
    description?: string
    image?: string
    tokenId?: string
    collection?: definitions['Model9']
    lastBuy?: definitions['Model14']
    lastSell?: definitions['Model14']
    owner?: string
    attributes?: definitions['Model30']
  }
  Model32: {
    token?: definitions['Model31']
    market?: definitions['market']
  }
  Model33: definitions['Model32'][]
  getTokensDetailsResponse: {
    tokens?: definitions['Model33']
  }
  getTokensFloorResponse: {
    tokens?: {
      string?: number
    }
  }
  lastSells: definitions['lastBuy'][]
  floorSellValues: number[]
  Model34: {
    hash?: string
    value?: number
    maker?: string
    validFrom?: number
  }
  Model35: {
    key?: string
    value?: string
    tokenCount?: number
    onSaleCount?: number
    sampleImages?: definitions['sampleImages']
    lastSells?: definitions['lastSells']
    lastBuys?: definitions['lastSells']
    floorSellValues?: definitions['floorSellValues']
    topBuy?: definitions['Model34']
  }
  Model36: definitions['Model35'][]
  getCollectionAttributesResponse: {
    attributes?: definitions['Model36']
  }
  getCollectionTopBuysResponse: {
    topBuys?: definitions['buys']
  }
  Model37: {
    hash?: string
    value?: number
    schema?: string
  }
  Model38: {
    contract?: string
    name?: string
    image?: string
    tokenId?: string
    collection?: definitions['Model9']
    topBuy?: definitions['Model37']
  }
  Model39: {
    tokenCount?: number
    onSaleCount?: number
    floorSellValue?: number
    lastAcquiredAt?: number
  }
  Model40: {
    token?: definitions['Model38']
    ownership?: definitions['Model39']
  }
  Model41: definitions['Model40'][]
  getUserTokensResponse: {
    tokens?: definitions['Model41']
  }
  Model42: {
    id?: string
    schema?: string
    metadata?: string
    sampleImages?: definitions['sampleImages']
    image?: string
    floorSellValue?: number
    topBuyValue?: number
  }
  primaryOrder: {
    value?: number
    expiry?: number
    status?: string
  }
  Model43: {
    set?: definitions['Model42']
    primaryOrder?: definitions['primaryOrder']
    totalValid?: number
  }
  positions: definitions['Model43'][]
  getUserPositionsResponse: {
    positions?: definitions['positions']
  }
  Model44: {
    id?: string
    name?: string
    image?: string
    floorSellValue?: number
    topBuyValue?: number
  }
  Model45: {
    tokenCount?: number
    onSaleCount?: number
    liquidCount?: number
    lastAcquiredAt?: number
  }
  Model46: {
    collection?: definitions['Model44']
    ownership?: definitions['Model45']
  }
  Model47: definitions['Model46'][]
  getUserCollectionsResponse: {
    collections?: definitions['Model47']
  }
  getNewApiKeyResponse: {
    key: string
  }
  attribute: {
    collection: string
    key: string
    value: string
  }
  Model48: {
    kind: 'wyvern-v2'
    /** @default reservoir */
    orderbook?: 'reservoir' | 'opensea'
    data?: definitions['data']
    attribute?: definitions['attribute']
  }
  Model49: definitions['Model48'][]
  Model50: {
    orders?: definitions['Model49']
  }
  contracts: string[]
  Model51: {
    contracts?: definitions['contracts']
  }
  hashes: string[]
  Model52: {
    hashes?: definitions['hashes']
  }
  Model53: {
    fromBlock: number
    toBlock: number
  }
  Model54: {
    kind?: 'tokens-floor-sell' | 'tokens-top-buy' | 'token-sets-top-buy'
    contracts?: definitions['contracts']
  }
  Model55: {
    collection: string
  }
  Model56: string[]
  Model57: {
    contractKind: 'erc20' | 'erc721' | 'erc1155' | 'wyvern-v2'
    contracts?: definitions['Model56']
    fromBlock: number
    toBlock: number
    blocksPerBatch?: number
    handleAsCatchup?: boolean
  }
  Model58: {
    fromBlock: number
    toBlock: number
    blocksPerBatch?: number
  }
}

export interface operations {
  getAttributes: {
    parameters: {
      query: {
        collection: string
      }
    }
    responses: {
      /** Successful */
      200: {
        schema: definitions['getAttributesResponse']
      }
    }
  }
  getCollections: {
    parameters: {
      query: {
        community?: string
        collection?: string
        name?: string
        sortBy?: 'id' | 'floorCap'
        sortDirection?: 'asc' | 'desc'
        offset?: number
        limit?: number
      }
    }
    responses: {
      /** Successful */
      200: {
        schema: definitions['getCollectionsResponse']
      }
    }
  }
  getMarket: {
    parameters: {
      query: {
        contract?: string
        tokenId?: string
        collection?: string
        attributes?: string
      }
    }
    responses: {
      /** Successful */
      200: {
        schema: definitions['Model6']
      }
    }
  }
  getOrders: {
    parameters: {
      query: {
        contract?: string
        tokenId?: string
        collection?: string
        attributeKey?: string
        attributeValue?: string
        maker?: string
        hash?: string
        includeInvalid?: boolean
        side?: 'sell' | 'buy'
        offset?: number
        limit?: number
      }
    }
    responses: {
      /** Successful */
      200: {
        schema: definitions['getOrdersResponse']
      }
    }
  }
  postOrders: {
    parameters: {
      body: {
        body?: definitions['Model50']
      }
    }
    responses: {
      /** Successful */
      default: {
        schema: string
      }
    }
  }
  getOwners: {
    parameters: {
      query: {
        contract?: string
        tokenId?: string
        collection?: string
        owner?: string
        attributes?: string
        offset?: number
        limit?: number
      }
    }
    responses: {
      /** Successful */
      200: {
        schema: definitions['getOwnersResponse']
      }
    }
  }
  getSales: {
    parameters: {
      query: {
        contract?: string
        tokenId?: string
        collection?: string
        attributes?: string
        user?: string
        direction?: 'from' | 'to'
        side?: 'buy' | 'sell'
        offset?: number
        limit?: number
      }
    }
    responses: {
      /** Successful */
      200: {
        schema: definitions['getSalesResponse']
      }
    }
  }
  getStats: {
    parameters: {
      query: {
        contract?: string
        tokenId?: string
        collection?: string
        attributes?: string
      }
    }
    responses: {
      /** Successful */
      200: {
        schema: definitions['getStatsResponse']
      }
    }
  }
  getTokens: {
    parameters: {
      query: {
        contract?: string
        tokenId?: string
        collection?: string
        attributes?: string
        tokenSetId?: string
        onSale?: boolean
        sortBy?: 'tokenId' | 'floorSellValue' | 'topBuyValue'
        sortByAttribute?: string
        sortDirection?: 'asc' | 'desc'
        offset?: number
        limit?: number
      }
    }
    responses: {
      /** Successful */
      200: {
        schema: definitions['getTokensResponse']
      }
    }
  }
  getTransfers: {
    parameters: {
      query: {
        contract?: string
        tokenId?: string
        collection?: string
        attributes?: string
        user?: string
        direction?: 'from' | 'to'
        offset?: number
        limit?: number
      }
    }
    responses: {
      /** Successful */
      200: {
        schema: definitions['getTransfersResponse']
      }
    }
  }
  getCollectionsCollection: {
    parameters: {
      path: {
        collection: string
      }
    }
    responses: {
      /** Successful */
      200: {
        schema: definitions['getCollectionResponse']
      }
    }
  }
  getExecuteBid: {
    parameters: {
      query: {
        contract?: string
        tokenId?: string
        collection?: string
        attributeKey?: string
        attributeValue?: string
        maker: string
        price: string
        orderbook?: 'reservoir' | 'opensea'
        v?: number
        r?: string
        s?: string
        listingTime?: string
        expirationTime?: string
        salt?: string
      }
    }
    responses: {
      /** Successful */
      200: {
        schema: definitions['getExecuteBidResponse']
      }
    }
  }
  getExecuteBuild: {
    parameters: {
      query: {
        contract?: string
        tokenId?: string
        collection?: string
        attributeKey?: string
        attributeValue?: string
        maker: string
        side: 'sell' | 'buy'
        price: string
        fee: string
        feeRecipient: string
        listingTime?: string
        expirationTime?: string
        salt?: string
      }
    }
    responses: {
      /** Successful */
      200: {
        schema: definitions['getExecuteBuildResponse']
      }
    }
  }
  getExecuteBuy: {
    parameters: {
      query: {
        contract: string
        tokenId: string
        taker: string
      }
    }
    responses: {
      /** Successful */
      200: {
        schema: definitions['getExecuteBuyResponse']
      }
    }
  }
  getExecuteCancel: {
    parameters: {
      query: {
        hash: string
        maker: string
      }
    }
    responses: {
      /** Successful */
      200: {
        schema: definitions['getExecuteBuyResponse']
      }
    }
  }
  getExecuteFill: {
    parameters: {
      query: {
        contract: string
        tokenId: string
        taker: string
        side?: 'sell' | 'buy'
      }
    }
    responses: {
      /** Successful */
      200: {
        schema: definitions['getExecuteBuyResponse']
      }
    }
  }
  getExecuteList: {
    parameters: {
      query: {
        contract?: string
        tokenId?: string
        maker: string
        price: string
        orderbook?: 'reservoir' | 'opensea'
        v?: number
        r?: string
        s?: string
        listingTime?: string
        expirationTime?: string
        salt?: string
      }
    }
    responses: {
      /** Successful */
      200: {
        schema: definitions['getExecuteBidResponse']
      }
    }
  }
  getExecuteSell: {
    parameters: {
      query: {
        contract: string
        tokenId: string
        taker: string
      }
    }
    responses: {
      /** Successful */
      200: {
        schema: definitions['getExecuteBuyResponse']
      }
    }
  }
  getLiquidityCollections: {
    parameters: {
      query: {
        offset?: number
        limit?: number
      }
    }
    responses: {
      /** Successful */
      200: {
        schema: definitions['getCollectionsLiquidityResponse']
      }
    }
  }
  getLiquidityUsers: {
    parameters: {
      query: {
        collection?: string
        user?: string
        offset?: number
        limit?: number
      }
    }
    responses: {
      /** Successful */
      200: {
        schema: definitions['getUsersLiquidityResponse']
      }
    }
  }
  getOrdersAll: {
    parameters: {
      query: {
        side?: 'buy' | 'sell'
        sortDirection?: 'asc' | 'desc'
        continuation?: string
        limit?: number
      }
    }
    responses: {
      /** Successful */
      200: {
        schema: definitions['getOrdersAllResponse']
      }
    }
  }
  getOrdersBuild: {
    parameters: {
      query: {
        contract?: string
        tokenId?: string
        collection?: string
        attributeKey?: string
        attributeValue?: string
        maker: string
        side: 'sell' | 'buy'
        price: string
        fee: string
        feeRecipient: string
        listingTime?: string
        expirationTime?: string
        salt?: string
      }
    }
    responses: {
      /** Successful */
      200: {
        schema: definitions['getOrdersBuildResponse']
      }
    }
  }
  getOrdersExecuted: {
    parameters: {
      query: {
        hash: string
      }
    }
    responses: {
      /** Successful */
      200: {
        schema: string
      }
    }
  }
  getOrdersFill: {
    parameters: {
      query: {
        tokenId: string
        contract: string
        side?: 'sell' | 'buy'
      }
    }
    responses: {
      /** Successful */
      200: {
        schema: definitions['getOrdersFillResponse']
      }
    }
  }
  getTokensDetails: {
    parameters: {
      query: {
        contract?: string
        tokenId?: string
        collection?: string
        attributes?: string
        tokenSetId?: string
        onSale?: boolean
        sortBy?: 'tokenId' | 'floorSellValue' | 'topBuyValue'
        sortByAttribute?: string
        sortDirection?: 'asc' | 'desc'
        offset?: number
        limit?: number
      }
    }
    responses: {
      /** Successful */
      200: {
        schema: definitions['getTokensDetailsResponse']
      }
    }
  }
  getTokensFloor: {
    parameters: {
      query: {
        collection: string
      }
    }
    responses: {
      /** Successful */
      200: {
        schema: definitions['getTokensFloorResponse']
      }
    }
  }
  getCollectionsCollectionAttributes: {
    parameters: {
      path: {
        collection: string
      }
      query: {
        attribute?: string
        sortBy?: 'value' | 'floorSellValue' | 'floorCap' | 'topBuyValue'
        sortDirection?: 'asc' | 'desc'
        offset?: number
        limit?: number
      }
    }
    responses: {
      /** Successful */
      200: {
        schema: definitions['getCollectionAttributesResponse']
      }
    }
  }
  getCollectionsCollectionTopbuys: {
    parameters: {
      path: {
        collection: string
      }
      query: {
        attributes?: string
      }
    }
    responses: {
      /** Successful */
      200: {
        schema: definitions['getCollectionTopBuysResponse']
      }
    }
  }
  getUsersUserTokens: {
    parameters: {
      path: {
        user: string
      }
      query: {
        community?: string
        collection?: string
        hasOffer?: boolean
        sortBy?: 'acquiredAt' | 'topBuyValue'
        sortDirection?: 'asc' | 'desc'
        offset?: number
        limit?: number
      }
    }
    responses: {
      /** Successful */
      200: {
        schema: definitions['getUserTokensResponse']
      }
    }
  }
  getUsersUserPositions: {
    parameters: {
      path: {
        user: string
      }
      query: {
        side: 'buy' | 'sell'
        status: 'valid' | 'invalid'
        offset?: number
        limit?: number
      }
    }
    responses: {
      /** Successful */
      200: {
        schema: definitions['getUserPositionsResponse']
      }
    }
  }
  getUsersUserCollections: {
    parameters: {
      path: {
        user: string
      }
      query: {
        community?: string
        collection?: string
        offset?: number
        limit?: number
      }
    }
    responses: {
      /** Successful */
      200: {
        schema: definitions['getUserCollectionsResponse']
      }
    }
  }
  /** The API key can be used optionally in every route, set it as a request header **x-api-key** */
  postApikey: {
    parameters: {
      formData: {
        /** The name of the app */
        appName: string
        /** Your e-mail address so we can reach you */
        email: string
        /** The website of your project */
        website: string
      }
    }
    responses: {
      /** Successful */
      200: {
        schema: definitions['getNewApiKeyResponse']
      }
    }
  }
  postAdminContracts: {
    parameters: {
      header: {
        'x-admin-api-key': string
      }
      body: {
        body?: definitions['Model51']
      }
    }
    responses: {
      /** Successful */
      default: {
        schema: string
      }
    }
  }
  postAttributesRefresh: {
    parameters: {
      query: {
        contract: string
        tokenId: string
      }
    }
    responses: {
      /** Successful */
      default: {
        schema: string
      }
    }
  }
  postAdminDisableOrders: {
    parameters: {
      header: {
        'x-admin-api-key': string
      }
      body: {
        body?: definitions['Model52']
      }
    }
    responses: {
      /** Successful */
      default: {
        schema: string
      }
    }
  }
  postAdminFetchBlocks: {
    parameters: {
      header: {
        'x-admin-api-key': string
      }
      body: {
        body?: definitions['Model53']
      }
    }
    responses: {
      /** Successful */
      default: {
        schema: string
      }
    }
  }
  postAdminFixCache: {
    parameters: {
      header: {
        'x-admin-api-key': string
      }
      body: {
        body?: definitions['Model54']
      }
    }
    responses: {
      /** Successful */
      default: {
        schema: string
      }
    }
  }
  postAdminIndexMetadata: {
    parameters: {
      header: {
        'x-admin-api-key': string
      }
      body: {
        body?: definitions['Model55']
      }
    }
    responses: {
      /** Successful */
      default: {
        schema: string
      }
    }
  }
  postAdminSyncEvents: {
    parameters: {
      header: {
        'x-admin-api-key': string
      }
      body: {
        body?: definitions['Model57']
      }
    }
    responses: {
      /** Successful */
      default: {
        schema: string
      }
    }
  }
  postAdminSyncOrders: {
    parameters: {
      header: {
        'x-admin-api-key': string
      }
      body: {
        body?: definitions['Model58']
      }
    }
    responses: {
      /** Successful */
      default: {
        schema: string
      }
    }
  }
  postAdminIndexMetadataFast: {
    parameters: {
      header: {
        'x-admin-api-key': string
      }
      body: {
        body?: definitions['Model55']
      }
    }
    responses: {
      /** Successful */
      default: {
        schema: string
      }
    }
  }
}

export interface external {}