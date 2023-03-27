import moment from "moment";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export function shortenAddress(address) {
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
}

export function getRelativetime(ISOString) {
    return moment(ISOString).fromNow();
}

export function getFullTime(ISOString) {
    return (moment(ISOString).format('lll') + " (UTC)");
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
            const actionsWeParse = ["SOL_TRANSFER","TOKEN_TRANSFER","NFT_TRANSFER","NFT_MINT","NFT_BURN","TOKEN_MINT","TOKEN_CREATE","TOKEN_BURN","NFT_SALE","NFT_BID","NFT_BID_CANCEL","NFT_LIST","NFT_LIST_CANCEL","MARKETPLACE_WITHDRAW","OFFER_LOAN","CANCEL_LOAN","TAKE_LOAN","REPAY_LOAN","REPAY_ESCROW_LOAN","FORECLOSE_LOAN","MEMO"];
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
