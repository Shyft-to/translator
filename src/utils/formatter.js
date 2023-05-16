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
            const actionsWeParse = ["SOL_TRANSFER","TOKEN_TRANSFER","NFT_TRANSFER","NFT_MINT","NFT_BURN","TOKEN_MINT","TOKEN_CREATE","TOKEN_BURN","NFT_SALE","NFT_BID","NFT_BID_CANCEL","NFT_LIST","NFT_LIST_UPDATE","NFT_LIST_CANCEL","MARKETPLACE_WITHDRAW","OFFER_LOAN","CANCEL_LOAN","TAKE_LOAN","REPAY_LOAN","REPAY_ESCROW_LOAN","EXTEND_LOAN","EXTEND_ESCROW_LOAN","FORECLOSE_LOAN","MEMO","SWAP","CREATE_RAFFLE","BUY_TICKETS","REVEAL_WINNERS","CLAIM_PRIZE","CLOSE_RAFFLE","CANCEL_RAFFLE","COMPRESSED_NFT_MINT","CREATE_TREE","COMPRESSED_NFT_TRANSFER","COMPRESSED_NFT_BURN"];
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
        domain:"Acumen",
        address:"C64kTdg1Hzv5KoQmZrQRcm2Qz7PkxtFBgw7EpFhvYn8W", 
        network:"mainnet-beta"
    },
    {
        domain:"Bonfida Pool Program",
        address:"WvmTNLpGMVbwJVYztYL4Hnsy82cJhQorxjnnXcRm3b6", 
        network:"mainnet-beta"
    },
    {
        domain:"Break Solana Program",
        address:"BrEAK7zGZ6dM71zUDACDqJnekihmwF15noTddWTsknjC", 
        network:"mainnet-beta"
    },
    {
        domain:"Chainlink OCR2 Oracle Program",
        address:"cjg3oHmg9uuPsP8D6g29NWvhySJkdYdAo9D25PRbKXJ", 
        network:"mainnet-beta"
    },
    {
        domain:"Chainlink Store Program",
        address:"HEvSKofvBgfaexv23kMabbYqxasxU3mQ4ibBMEmJWHny", 
        network:"mainnet-beta"
    },
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
        domain:"Mango ICO",
        address:"7sPptkymzvayoSbLXzBsXEF8TSf3typNnAWkrKrDizNb", 
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
        domain:"Marinade Staking Program",
        address:"MarBmsSgKXdrN1egZf5sqe1TMai9K1rChYNDJgjq7aD", 
        network:"mainnet-beta"
    },
    {
        domain:"Mercurial Stable Swap Program",
        address:"MERLuDFBMmsHnsBPZw2sDQZHvXFMwp8EdjudcU2HKky", 
        network:"mainnet-beta"
    },
    {
        domain:"Metaplex Program",
        address:"p1exdMJcjVao65QdewkaZRUnU6VPSXhus9n2GzWfh98", 
        network:"mainnet-beta"
    },
    {
        domain:"NFT Auction",
        address:"auctxRXPeJoc4817jDhf4HbjnhEcr1cCXenosMhK5R8", 
        network:"mainnet-beta"
    },
    {
        domain:"NFT Candy Machine Program",
        address:"cndyAnrLdpjq1Ssp1z8xxDsB8dxe7u4HL5Nxi2K5WXZ", 
        network:"mainnet-beta"
    },
    {
        domain:"NFT Candy Machine V2 Program",
        address:"cndy3Z4yapfJBmL3ShUp5exZKqR3z33thTzeNMm2gRZ", 
        network:"mainnet-beta"
    },
    {
        domain:"Orca Swap Program v1",
        address:"DjVE6JNiYqPL2QXyCUUh8rNjHrbz9hXHNYt99MQ59qw1", 
        network:"mainnet-beta"
    },
    {
        domain:"Orca Swap Program v2",
        address:"9W959DqEETiGZocYWCQPaJ6sBmUzgfxXfqGeTEdp3aQP", 
        network:"mainnet-beta"
    },
    {
        domain:"Orca Aquafarm Program",
        address:"82yxjeMsvaURa4MbZZ7WZZHfobirZYkH1zF8fmeGtyaQ", 
        network:"mainnet-beta"
    },
    {
        domain:"Port Finance Program",
        address:"Port7uDYB3wk6GJAw4KT1WpTeMtSu9bTcChBHkX2LfR", 
        network:"mainnet-beta"
    },
    {
        domain:"Pyth Oracle Program",
        address:"FsJ3A3u2vn5cTVofAjvy6y5kwABJAqYWpe4975bi2epH", 
        network:"mainnet-beta"
    },
    {
        domain:"Quarry Merge Mine",
        address:"QMMD16kjauP5knBwxNUJRZ1Z5o3deBuFrqVjBVmmqto", 
        network:"mainnet-beta"
    },
    {
        domain:"Quarry Mine",
        address:"QMNeHCGYnLVDn1icRAfQZpjPLBNkfGbSKRB83G5d8KB", 
        network:"mainnet-beta"
    },
    {
        domain:"Quarry Mint Wrapper",
        address:"QMWoBmAyJLAsA1Lh9ugMTw2gciTihncciphzdNzdZYV", 
        network:"mainnet-beta"
    },
    {
        domain:"Quarry Redeemer",
        address:"QRDxhMw1P2NEfiw5mYXG79bwfgHTdasY2xNP76XSea9", 
        network:"mainnet-beta"
    },
    {
        domain:"Quarry Registry",
        address:"QREGBnEj9Sa5uR91AV8u3FxThgP5ZCvdZUW2bHAkfNc", 
        network:"mainnet-beta"
    },
    {
        domain:"Raydium AMM Program",
        address: "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
        network:"mainnet-beta"
    },
    {
        domain:"Raydium IDO Program",
        address: "9HzJyW1qZsEiSfMUf6L2jo3CcTKAyBmSyKdwQeYisHrC",
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
        domain:"Raydium Staking",
        address: "EhhTKczWMGQt46ynNeRX1WfeagwwJd7ufHvCDjRxjo5Q",
        network:"mainnet-beta"
    },
    {
        domain:"Saber Router",
        address:"Crt7UoUR6QgrFrN7j8rmSQpUTNWNSitSwWvsWGf1qZ5t", 
        network:"mainnet-beta"
    },
    {
        domain:"Saber Stable Swap",
        address:"SSwpkEEcbUqx4vtoEByFjSkhKdCT862DNVb52nZg1UZ", 
        network:"mainnet-beta"
    },
    {
        domain:"Serum Dex Program v1",
        address:"BJ3jrUzddfuSrZHXSCxMUUQsjKEyLmuuyZebkcaFp2fg", 
        network:"mainnet-beta"
    },
    {
        domain:"Serum Dex Program v2",
        address:"EUqojwWA2rd19FZrzeBncJsm38Jm1hEhE3zsmX3bRc2o", 
        network:"mainnet-beta"
    },
    {
        domain:"Serum Dex Program v3",
        address:"9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin", 
        network:"mainnet-beta"
    },
    {
        domain:"Serum Swap",
        address:"22Y43yTVxuUkoRKdm9thyRhQ3SdgQS7c7kB6UNCiaczD", 
        network:"mainnet-beta"
    },
    {
        domain:"Sharky.fi",
        address:"SHARKobtfF1bHhxD2eqftjHBdVSCbKo9JtgK71FhELP", 
        network:"mainnet-beta"
    },
    {
        domain:"Solend Program",
        address:"So1endDq2YkqhipRh3WViPa8hdiSpxWy6z3Z6tMCpAo", 
        network:"mainnet-beta"
    },
    {
        domain:"Solana Lido",
        address:"CrX7kMhLC3cSsXJdT7JDgqrRVWGnUpX3gfEfxxU2NVLi", 
        network:"mainnet-beta"
    },
    {
        domain:"Solanart",
        address:"CJsLwbP1iu5DuUikHEJnLfANgKy6stB2uFgvBBHoyxwz", 
        network:"mainnet-beta"
    },
    {
        domain:"Solanart Go",
        address:"5ZfZAwP2m93waazg8DkrrVmsupeiPEvaEHowiUP7UAbJ", 
        network:"mainnet-beta"
    },
    {
        domain:"Stepn Dex",
        address:"Dooar9JkhdZ7J3LHN3A7YCuoGRUggXhQaG4kijfLGU2j", 
        network:"mainnet-beta"
    },
    {
        domain:"Step Finance Swap",
        address:"SSwpMgqNDsyV7mAgN9ady4bDVu5ySjmmXejXvy2vLt1", 
        network:"mainnet-beta"
    },
    {
        domain:"Swim Swap",
        address:"SWiMDJYFUGj6cPrQ6QYYYWZtvXQdRChSVAygDZDsCHC", 
        network:"mainnet-beta"
    },
    {
        domain:"Switchboard Oracle Program",
        address:"DtmE9D2CSB4L5D6A15mraeEjrGMm6auWVzgaD8hK2tZM", 
        network:"mainnet-beta"
    },
    {
        domain:"Tensor Swap",
        address:"TSWAPaqyCSx2KABk68Shruf4rp7CxcNi8hAsbdwmHbN", 
        network:"mainnet-beta"
    },
    {
        domain:"Wormhole",
        address:"WormT3McKhFJ2RkiGpdw9GKvNCrB2aB54gb2uV9MfQC", 
        network:"mainnet-beta"
    }
  ];
