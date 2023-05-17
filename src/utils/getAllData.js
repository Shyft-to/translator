import axios from "axios";
import moment from "moment";
import { getDomainKeySync, NameRegistryState } from "@bonfida/spl-name-service";
import { Connection } from "@solana/web3.js";

const endpoint = process.env.REACT_APP_API_EP ?? "";
const xKey = process.env.REACT_APP_API_KEY ?? "";
const rpc = process.env.REACT_APP_RPC_MAINNET ?? "";
const cachingEnabled = process.env.REACT_APP_CACHE_ENABLE ?? "";
const cacheRefreshAfterMins = Number(
  process.env.REACT_APP_REFRESH_AFTER_MINS ?? 0
);

export async function getNFTData(network, address) {
  var data = {
    success: false,
    type: "UNKNOWN",
    details: null,
  };
  const ifCached = await getCacheData(network, address);
  if (ifCached.success === true) {
    data = {
      success: true,
      type: "NFT",
      details: ifCached.details,
    };
  } else {
    await axios({
      url: `${endpoint}nft/read`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": xKey,
      },
      params: {
        network: network,
        token_address: address,
      },
    })
      .then((res) => {
        if (res.data.success === true) {
          data = {
            success: true,
            type: "NFT",
            details: res.data.result,
          };
          pushDatatoCache(network, res.data.result, res.data.result.mint);
        }
      })
      .catch((err) => {
        console.warn(err);
      });
  }

  return data;
}

export async function getCompressedNFTData(network,address)
{
  var data = {
    success: false,
    type: "UNKNOWN",
    details: null,
  };
  const ifCached = await getCacheData(network, address);
  if (ifCached.success === true) {
    data = {
      success: true,
      type: "NFT",
      details: ifCached.details,
    };
  } else {
    await axios({
      url: `${endpoint}nft/compressed/read`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": xKey,
      },
      params: {
        network: network,
        nft_address: address,
      },
    })
      .then((res) => {
        if (res.data.success === true) {
          data = {
            success: true,
            type: "NFT",
            details: res.data.result,
          };
          pushDatatoCache(network, res.data.result, res.data.result.mint);
        }
      })
      .catch((err) => {
        console.warn(err);
      });
  }
  return data;
}
export async function getMetadata(metadata_uri)
{
  var data = {
    success: false,
    type: "UNKNOWN",
    details: null,
  };
  await axios({
    url: metadata_uri,
    method: "GET",
    // headers: {
    //   "Content-Type": "application/json",
    // },
    
  })
    .then((res) => {
      if (res.data.name && res.data.image) {
        var detailsToReturn = {};
        if(res.data.image?.includes("ray-initiative.gift") || res.data.image?.includes("dex-ray.gift"))
        {
          detailsToReturn = {...res.data,image:""}
        }
        else
        {
          detailsToReturn = res.data;
        }
        data = {
          success: true,
          type: "METADATA",
          details: detailsToReturn,
        };
        
      }
    })
    .catch((err) => {
      console.warn(err);
    });
    return data;
}
export async function getTokenData(network, address) {
  var data = {
    success: false,
    type: "UNKNOWN",
    details: null,
  };
  const ifCached = await getCacheData(network, address);
  if (ifCached.success === true) {
    data = {
      success: true,
      type: "TOKEN",
      details: ifCached.details,
    };
  } else {
    await axios({
      url: `${endpoint}token/get_info`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": xKey,
      },
      params: {
        network: network,
        token_address: address,
      },
    })
      .then((res) => {
        if (res.data.success === true) {
          var detailsToReturn = {};
          if(res.data.image?.includes("ray-initiative.gift") || res.data.image?.includes("dex-ray.gift"))
          {
            detailsToReturn = {...res.data.result,image:""}
          }
          else
          {
            detailsToReturn = res.data.result;
          }
          data = {
            success: true,
            type: "TOKEN",
            details: detailsToReturn,
          };
          pushDatatoCache(network, detailsToReturn, res.data.result.address);
        }
      })
      .catch((err) => {
        console.warn(err);
      });
  }

  return data;
}

export async function getCollectionsData(network, address) {
  var data = {
    success: false,
    type: "UNKNOWN",
    details: null,
  };
  await axios({
    url: `${endpoint}wallet/collections`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": xKey,
    },
    params: {
      network: network,
      wallet_address: address,
    },
  })
    .then((res) => {
      if (res.data.success === true) {
        data = {
          success: true,
          type: "COLLECTIONS",
          details: res.data.result.collections,
        };
      }
    })
    .catch((err) => {
      console.warn(err);
    });

  return data;
}

export async function getWalletData(network, address) {
  var data = {
    success: false,
    type: "UNKNOWN",
    details: null,
  };
  var details = {};
  var errorOccured = false;

  try {
    await axios({
      url: `${endpoint}wallet/balance`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": xKey,
      },
      params: {
        network: network,
        wallet: address,
      },
    })
      .then((res) => {
        if (res.data.success === true) {
          details = { ...details, balance: res.data.result.balance };
        }
      })
      .catch((err) => {
        console.warn(err);
        errorOccured = true;
      });

    // await axios({
    //   url: `${endpoint}wallet/all_tokens`,
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //     "x-api-key": xKey,
    //   },
    //   params: {
    //     network: network,
    //     wallet: address,
    //   },
    // })
    //   .then((res) => {
    //     if (res.data.success === true) {
    //       details = { ...details, tokens: res.data.result };
    //     }
    //   })
    //   .catch((err) => {
    //     console.warn(err);
    //     errorOccured = true;
    //   });

    await axios({
      url: `${endpoint}wallet/collections`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": xKey,
      },
      params: {
        network: network,
        wallet_address: address,
      },
    })
      .then((res) => {
        if (res.data.success === true) {
          details = { ...details, collections: res.data.result.collections };
        }
      })
      .catch((err) => {
        console.warn(err);
        errorOccured = true;
      });
    if (Object.keys(details).length === 0) {
      data = {
        success: false,
        type: "UNKNOWN",
        details: details,
      };
    } else {
      data = {
        success: true,
        type: "WALLET",
        details: details,
      };
    }

    return data;
  } catch (error) {
    console.log(error);
    return {
      success: false,
      type: "UNKNOWN",
      details: null,
    };
  }
}
export async function getProtocolData(network, address) {
  var data = {
    success: false,
    type: "UNKNOWN",
    details: null,
  };

  try {
    await axios({
      url: `${endpoint}wallet/balance`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": xKey,
      },
      params: {
        network: network,
        wallet: address,
      },
    })
      .then((res) => {
        if (res.data.success === true) {
          data = {
            success: true,
            type: "PROTOCOL",
            details: {
              balance: res.data.result.balance ?? 0,
            },
          };
        }
      })
      .catch((err) => {
        console.warn(err);
        data = {
          success: false,
          type: "UNKOWN",
          details: 0,
        };
      });

    // if (Object.keys(details).length === 0) {
    //   data = {
    //     success: false,
    //     type: "UNKNOWN",
    //     details: details,
    //   };
    // }
    // else {
    //   data = {
    //     success: true,
    //     type: "WALLET",
    //     details: details,
    //   };
    // }

    return data;
  } catch (error) {
    console.log(error);
    return {
      success: false,
      type: "UNKNOWN",
      details: null,
    };
  }
}

export async function getAllTokens(network, address) {
  var data = {
    success: false,
    type: "UNKNOWN",
    details: null,
  };
  await axios({
    url: `${endpoint}wallet/all_tokens`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": xKey,
    },
    params: {
      network: network,
      wallet: address,
    },
  })
    .then((res) => {
      if (res.data.success === true) {
        data = {
          success: true,
          type: "TOKENS",
          details: res.data.result,
        };
      }
    })
    .catch((err) => {
      console.warn(err);
    });

  return data;
}

export async function getIfTokenData(network, address) {
  var data = {
    success: false,
    type: "UNKNOWN",
    details: null,
  };
  try {
    await axios({
      url: `${endpoint}token/get_info`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": xKey,
      },
      params: {
        network: network,
        token_address: address,
      },
    })
      .then((res) => {
        if (res.data.success === true) {
          if (res.data.result.decimals > 0) {
            data = {
              success: true,
              type: "TOKEN",
              details: res.data.result,
            };
          }
        }
      })
      .catch((err) => {
        console.warn(err);
      });

    return data;
  } catch (error) {
    return {
      success: false,
      type: "UNKNOWN",
      details: null,
    };
  }
}

export async function categorizeAddress(network, address) {
  var data = {
    success: false,
    type: "UNKNOWN",
    details: null,
  };
  try {
    const tokenCheck = await getIfTokenData(network, address);
    if (tokenCheck.type === "TOKEN") {
      data = {
        success: true,
        type: "TOKEN",
        details: tokenCheck.details,
      };
    } else {
      const nftCheck = await getNFTData(network, address);
      if (nftCheck.type === "NFT") {
        data = {
          success: true,
          type: "NFT",
          details: nftCheck.details,
        };
      } else {
        const walletCheck = await getWalletData(network, address);
        if (walletCheck.type === "WALLET") {
          data = {
            success: true,
            type: "WALLET",
            details: walletCheck.details,
          };
        } else {
          data = {
            success: false,
            type: "UNKNOWN",
            details: null,
          };
        }
      }
    }

    return data;
  } catch (err) {
    return {
      success: false,
      type: "UNKNOWN",
      details: null,
    };
  }
}
export async function categorizeAddresswithExplorer(network, address,isCompressed = false) {
  // console.log("compressed",isCompressed);
  var response = {
    success: false,
    type: "UNKNOWN",
    details: null,
  };
  try {
    if (isCompressed === true) {
      const compNftData = await getCompressedNFTData(network,address);
      response = {
        success: compNftData.success,
        type: compNftData.type,
        details: compNftData.details
      }
      return response;
    }
  } catch (error) {
    console.log("Some Error occured while getting compressed NFT data");
  }
  try {
    const data = await knowAddressType(network, address);
    if (data.addressType === "PROTOCOL") {
      const protocolData = await getProtocolData(network, address);
      response = {
        success: protocolData.success,
        type: protocolData.type,
        details: protocolData.details,
      };
    } else if (data.addressType === "WALLET") {
      const walletData = await getWalletData(network, address);
      response = {
        success: walletData.success,
        type: walletData.type,
        details: walletData.details,
      };
    } else if (data.addressType === "NFT") {
      const nftData = await getNFTData(network, address);
      response = {
        success: nftData.success,
        type: nftData.type,
        details: nftData.details,
      };
    } else if (data.addressType === "TOKEN") {
      const tokenData = await getIfTokenData(network, address);
      response = {
        success: tokenData.success,
        type: tokenData.type,
        details: tokenData.details,
      };
    } else if (data.addressType === "CHECKCATEGORYOLD") {
      const categorizedData = await categorizeAddress(network, address);
      response = {
        success: categorizedData.success,
        type: categorizedData.type,
        details: categorizedData.details,
      };
    } else {
      response = {
        success: false,
        type: "UNKNOWN",
        details: null,
      };
    }
    //console.log(response);
    return response;
  } catch (error) {
    //console.log(error);
    console.log("could not categorize the address");
    return response;
  }
}
export async function knowAddressType(network, address) {
  try {
    let reqUrl = "";
    let typeObj = {
      addressType: "UNKNOWN",
    };
    if (network === "testnet") {
      reqUrl = "https://explorer-api.testnet.solana.com/";
    } else if (network === "devnet") {
      reqUrl = "https://explorer-api.devnet.solana.com/";
    } else {
      reqUrl = rpc;
    }
    let data = JSON.stringify({
      method: "getMultipleAccounts",
      jsonrpc: "2.0",
      params: [
        [address],
        {
          encoding: "jsonParsed",
          commitment: "confirmed",
        },
      ],
      // "id": "cad88acb-2e1a-4fb4-a40b-cf632fd3c683"
      id: "",
    });

    await axios({
      url: reqUrl,
      method: "POST",
      maxBodyLength: Infinity,
      headers: {
        "Content-Type": "application/json",
        // "authority": reqUrl,
        // "origin": "https://explorer.solana.com",
        // "referer": "https://explorer.solana.com/",
      },
      data: data,
    })
      .then((res) => {
        if (Array.isArray(res.data.result.value)) {
          let valueReceived = res.data.result.value[0];
          if (valueReceived === null) {
            typeObj = {
              addressType: "CHECKCATEGORYOLD",
            };
          } else {
            if (valueReceived.executable === true) {
              typeObj = {
                addressType: "PROTOCOL",
              };
            } else {
              if (valueReceived.owner === "11111111111111111111111111111111") {
                typeObj = {
                  addressType: "WALLET",
                };
              } else if (valueReceived.data.program === "spl-token") {
                if (valueReceived.data.parsed.info.decimals === 0) {
                  typeObj = {
                    addressType: "NFT",
                  };
                } else if (valueReceived.data.parsed.info.decimals > 0) {
                  typeObj = {
                    addressType: "TOKEN",
                  };
                } else {
                  typeObj = {
                    addressType: "UNKNOWN",
                  };
                }
              } else {
                typeObj = {
                  addressType: "UNKNOWN",
                };
              }
            }
          }
        } else {
          typeObj = {
            addressType: "UNKNOWN",
          };
        }
      })
      .catch((err) => {
        console.warn(err);
        typeObj = {
          addressType: "UNKNOWN",
        };
      });

    return typeObj;
  } catch (error) {
    console.log(error);
    return {
      addressType: "UNKNOWN",
    };
  }
}
export async function getTxns(network,accountAddress,beforeTxnSignature = "") {
  var response = {
    success: false,
    type: "UNKNOWN",
    details: null,
  };
  try {
    var params = {
      network: network,
      account: accountAddress,
    };
    if (beforeTxnSignature !== "") {
      params = {
        ...params,
        before_tx_signature: beforeTxnSignature,
      };
    }
    await axios({
      url: `${endpoint}transaction/history`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": xKey,
      },
      params: params,
    })
      .then((res) => {
        if (res.data.success === true) {
          const txnsReceived = res.data.result;
          response = {
            success: true,
            type: "TXNS",
            details: txnsReceived,
          };
        }
      })
      .catch((err) => {
        console.warn(err);
      });
    return response;
  } catch (error) {
    console.warn(error);
    return response;
  }
}

export async function getTxnUptoSignature(network, address, uptoSign) {
  var response = {
    success: false,
    type: "UNKNOWN",
    details: null,
  };
  try {
    var txnReceivedComplete = false;
    var beforeTxSignature = "";
    var allTxns = [];
    var counter = 0;
    while (txnReceivedComplete === false) {
      
      const txnsFetch = await getTxns(network, address, beforeTxSignature);
      
        if (txnsFetch.success === true) {
          var txnReceived = txnsFetch.details;
          beforeTxSignature = txnReceived[txnReceived.length - 1].signatures[0];
          var txnsToAppend = [];

          for (let index = 0; index < txnReceived.length; index++) {
            
            if (txnReceived[index].signatures?.includes(uptoSign)) {
              txnReceivedComplete = true;
              // console.log("txnMatched At index: ", index, "for", txnReceived[index].signatures[0]);
              break;
            } else txnsToAppend.push(txnReceived[index]);

          }
          allTxns = [...allTxns, ...txnsToAppend];
        }
        
      counter++;
      if (counter > 5 || txnReceivedComplete === true)
        break;
      
    }
    
    response = {
      success: true,
      type: "TXNS",
      details: allTxns
    }
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
    return response;
  }
}
export async function getRawTxn(network, txnAddress) {
  var response = {
    success: false,
    type: "UNKNOWN",
    details: null,
  };
  try {
  } catch (error) {
    console.warn(error);
    return response;
  }
}
export async function getDomainsFromWallet(network,address)
{
    var data = {
      success: false,
      type: "UNKNOWN",
      details: null,
    };
    await axios({
      url: `${endpoint}wallet/get_domains`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": xKey,
      },
      params: {
        network: network,
        wallet: address,
      },
    })
      .then((res) => {
        if (res.data.success === true) {
          data = {
            success: true,
            type: "DOMAINS",
            details: res.data.result,
          };
        }
      })
      .catch((err) => {
        console.warn(err);
      });

    return data;
}

export async function getAddressfromDomain(domainName) {
  try {
    const { pubkey } = await getDomainKeySync(domainName.toLowerCase());
    //const rpcUrl = clusterApiUrl(network);
    const connection = new Connection(rpc, "confirmed");
    if (!connection) {
      return {
        success: false,
        wallet_address: "",
      };
    } else {
      const owner = (
        await NameRegistryState.retrieve(connection, pubkey)
      ).registry.owner.toBase58();
      return {
        success: true,
        wallet_address: owner,
      };
    }
  } catch (error) {
    return {
      success: false,
      wallet_address: "",
    };
  }
  // const domainName = "bonfida";
}

export async function pushDatatoCache(network, data, key) {
  try {
    if (cachingEnabled === "true") {
      let cachedData;
      if (network === "mainnet-beta") {
        cachedData = localStorage.getItem("mainData");
      } else if (network === "devnet") {
        cachedData = localStorage.getItem("devData");
      } else {
        cachedData = localStorage.getItem("testData");
      }

      if (cachedData) {
        let dataSet = new Map(JSON.parse(cachedData));
        dataSet.set(key, JSON.stringify(data));

        // console.log(JSON.stringify(Array.from(dataSet.entries())));
        const valueToStore = JSON.stringify(Array.from(dataSet.entries()));

        if (network === "mainnet-beta") {
          localStorage.setItem("mainData", valueToStore);
        } else if (network === "devnet") {
          localStorage.setItem("devData", valueToStore);
        } else {
          localStorage.setItem("testData", valueToStore);
        }

        return true;
      } else {
        let dataSet = new Map();
        dataSet.set(key, JSON.stringify(data));
        // console.log(":new");
        // console.log(JSON.stringify(Array.from(dataSet.entries())));
        const valueToStore = JSON.stringify(Array.from(dataSet.entries()));
        if (network === "mainnet-beta") {
          localStorage.setItem("mainData", valueToStore);
        } else if (network === "devnet") {
          localStorage.setItem("devData", valueToStore);
        } else {
          localStorage.setItem("testData", valueToStore);
        }

        return true;
      }
    } else {
      return false;
    }
  } catch (error) {
    console.log("Could not save NFT data");
    return false;
  }
}
export async function getCacheData(network, address) {
  var data = {
    success: false,
    details: null,
  };
  try {
    if (cachingEnabled === "true") {
      let dataFromMem;
      if (network === "mainnet-beta") {
        dataFromMem = localStorage.getItem("mainData");
      } else if (network === "devnet") {
        dataFromMem = localStorage.getItem("devData");
      } else {
        dataFromMem = localStorage.getItem("testData");
      }

      if (dataFromMem) {
        const cachedData = new Map(JSON.parse(dataFromMem));
        const token = cachedData.get(address);
        if (token) {
          data = {
            success: true,
            details: JSON.parse(token),
          };
        }
      } else {
        data = {
          success: false,
          details: null,
        };
      }
    }

    return data;
  } catch (error) {
    return data;
  }
}
export async function clearIfOutdated() {
  try {
    if (cachingEnabled === "true" && cacheRefreshAfterMins > 0) {
      const lastCachedTime = localStorage.getItem("lastcatime");
      const timeNow = new Date().toISOString();
      if (lastCachedTime) {
        const timeDiff = moment(timeNow).diff(
          moment(lastCachedTime),
          "minutes",
          true
        );
        if (timeDiff > cacheRefreshAfterMins) {
          localStorage.setItem("mainData", "");
          localStorage.setItem("devData", "");
          localStorage.setItem("testData", "");
          localStorage.setItem("lastcatime", timeNow);
          console.log("All cached data cleared");
          return true;
        } else return false;
      } else {
        localStorage.setItem("lastcatime", timeNow);
        return false;
      }
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}
