import moment from "moment";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export function shortenAddress(address) {
    try {
        var trimmedString = "";
        if (address === "")
            return "unknown";
        if (address != null || address.length > 16) {
            trimmedString = (address.substring(0, 8) + "..." + address.substring(address.length - 5));
        }
        else {
            trimmedString = address ?? "";
        }
        return trimmedString;    
    } catch (error) {
        return address;
    }
    
}

export function getRelativetime(ISOString) {
    return moment(ISOString).fromNow();
}

export function getFullTime(ISOString) {
    try {
        if(ISOString === "" || ISOString === "--")
            return "--"
        else
            return (moment(ISOString).format('lll') + " (UTC)"); 
    } catch (error) {
        return ISOString;
    }
    
}

export function formatLamports(value) {
    try {
        if (typeof value === "number")
        {
            var num = (parseFloat(value) / LAMPORTS_PER_SOL)
            num = num.toLocaleString('en-US');
            return num;
        }  
        else
            return value;
    } catch (error) {
        return value;
    }

}

export function formatNames(name) {
    try {
        if (name.includes("_")) {
            var words = name.split("_");
            var capitalizedText = "";
            for (let index = 0; index < words.length; index++) {
                capitalizedText += capitalizeText(words[index]) + " ";
            }
            return capitalizedText;
        }
        else
            return (capitalizeText(name))
    } catch (error) {
        return name;
    }

}
function capitalizeText(text) {
    try {
        if (text === "NFT")
            return "NFT";
        else if (text === "SOL")
            return "SOL";
        else
            return text[0].toUpperCase() + text.substring(1).toLowerCase();
    } catch (error) {
        return text;
    }

}

export function convertToDays(value)
{
    try {
        if(value)
        {
            var seconds = Number(value);
            var d = Math.floor(seconds / (3600*24));
            var h = Math.floor(seconds % (3600*24) / 3600);
            var m = Math.floor(seconds % 3600 / 60);
            var s = Math.floor(seconds % 60);

            var dDisplay = d > 0 ? d + (d == 1 ? " day " : " days ") : "";
            var hDisplay = h > 0 ? h + (h == 1 ? " hour " : " hours ") : "";
            var mDisplay = m > 0 ? m + (m == 1 ? " minute " : " minutes ") : "";
            var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
            return dDisplay + hDisplay + mDisplay + sDisplay;
        }
        else
            return null;
        
    } catch (error) {
        return value;
    }
}
export function formatNumbers(value) {
    try {
        if (typeof value === "number")
        { 
            return value.toLocaleString('en-US');
        }
        else if (typeof value === "string" && value !== "")
        {
            return numberWithCommas(value);
        }  
        else
            return value;
    } catch (error) {
        return value;
    }

}
function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}
export function isParsable(action)
{
    try {
        if(action !== "")
        {
            const trimmedAction = action.trim();
            const actionsWeParse = ["SOL_TRANSFER","TOKEN_TRANSFER","NFT_TRANSFER","NFT_MINT","NFT_BURN","TOKEN_MINT","TOKEN_CREATE","TOKEN_BURN","NFT_SALE","NFT_BID","NFT_BID_CANCEL","NFT_LIST","NFT_LIST_UPDATE","NFT_LIST_CANCEL","MARKETPLACE_WITHDRAW","OFFER_LOAN","CANCEL_LOAN","TAKE_LOAN","REPAY_LOAN","REPAY_ESCROW_LOAN","FORECLOSE_LOAN","MEMO","SWAP","CREATE_RAFFLE","BUY_TICKETS","REVEAL_WINNERS","CLAIM_PRIZE","CLOSE_RAFFLE","CANCEL_RAFFLE","COMPRESSED_NFT_MINT","CREATE_TREE","COMPRESSED_NFT_TRANSFER","COMPRESSED_NFT_BURN"];
            if(actionsWeParse.includes(trimmedAction) === true)
                return true;
            else
                return false;
        }
        else
        {
            return false;
        }
    } catch (error) {
        return false;
    }
    
}

export const listOfAddresses = [
    {
        domain:"Bubblegum",
        address:"BGUMAp9Gq7iTEuizy4pqaxsTyUCBK68MDfK752saRPUY", 
        network:"mainnet-beta"
    },
    {
        domain:"Drift v2",
        address:"dRiftyHA39MWEi3m9aunc5MzRF1JYuBsbn6VPcn33UH", 
        network:"mainnet-beta"
    },
    {
        domain:"Drip Program",
        address:"dripTrkvSyQKvkyWg7oi4jmeEGMA5scSYowHArJ9Vwk", 
        network:"mainnet-beta"
    },
    {
        domain:"Foxy Raffle",
        address:"9ehXDD5bnhSpFVRf99veikjgq8VajtRH7e3D9aVPLqYd", 
        network:"mainnet-beta"
    },
    {
        domain:"Hyperspace",
        address:"HYPERfwdTjyJ2SCaKHmpF2MtrXqWxrsotYDsTrshHWq8", 
        network:"mainnet-beta"
    },
    {
        domain:"Jupiter Aggregator v4",
        address:"JUP4Fb2cqiRUcaTHdrPC8h2gNsA2ETXiPDD33WcGuJB", 
        network:"mainnet-beta"
    },
    {
        domain:"MagicEden MP",
        address:"MEisE1HzehtrDpAAT8PnLHjpSSkRYakotTuJRPjTpo8", 
        network:"mainnet-beta"
    },
    {
        domain:"MagicEden v2",
        address:"M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K", 
        network:"mainnet-beta"
    },
    {
        domain:"Mango Market v1",
        address:"JD3bq9hGdy38PuWQ4h2YJpELmHVGPPfFSuFkpzAd9zfu", 
        network:"mainnet-beta"
    },
    {
        domain:"Mango Market v2",
        address:"5fNfvyp5czQVX77yoACa3JJVEhdRaWjPuazuWgjhTqEH", 
        network:"mainnet-beta"
    },
    {
        domain:"Mango Market v3",
        address:"mv3ekLzLbnVPNxjSKvqBpU3ZeZXPQdEC3bp5MDEBG68", 
        network:"mainnet-beta"
    },
    {
        domain:"Mango Market v4",
        address:"4MangoMjqJ2firMokCjjGgoK8d4MXcrgL7XJaL3w6fVg", 
        network:"mainnet-beta"
    },
    {
        domain:"Raydium Liquidity v2",
        address: "RVKd61ztZW9GUwhRbbLoYVRE5Xf1B2tVscKqwZqXgEr",
        network:"mainnet-beta"
    },
    {
        domain:"Raydium Liquidity v3",
        address: "27haf8L6oxUeXrHrgEgsexjSY5hbVUWEmvv9Nyxg8vQv",
        network:"mainnet-beta"
    },
    {
        domain:"Raydium Liquidity v4",
        address: "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
        network:"mainnet-beta"
    },
    {
        domain:"Sharky.fi",
        address:"SHARKobtfF1bHhxD2eqftjHBdVSCbKo9JtgK71FhELP", 
        network:"mainnet-beta"
    },
    {
        domain:"Tensor Swap",
        address:"TSWAPaqyCSx2KABk68Shruf4rp7CxcNi8hAsbdwmHbN", 
        network:"mainnet-beta"
    },
    
  ];
