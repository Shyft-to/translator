import axios from "axios";
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.REACT_APP_SUPA_URL;
const supabaseKey = process.env.REACT_APP_SUPA_KEY;
export async function userLogon(wallet_address)
{
    var alreadyExisting = false;
    var message = {
      success: false,
      isNewUser: false,
      token: ""
    }
    const database = createClient(supabaseUrl, supabaseKey);

    const response = await database
    .from('user_details')
    .select();

    //console.log(response);
    
    const allUsers = response.data;

    if(allUsers.length>0)
    {
      allUsers.forEach(user => {
        if(user.wallet_address === wallet_address) //refactor this
        {
            alreadyExisting = true;
            console.log("user exists in database")
            message = {
              success: true,
              isNewUser: false,
              token: ""
            }
        }
      });
    }
    if(alreadyExisting === false)
    {
        console.log("new user");
        const { error } = await database
            .from('user_details')
            .insert({ wallet_address: wallet_address })
        console.log(error);
        message = {
          success: true,
          isNewUser: true,
          token: ""
        }
    }
    return message;
}
export async function followUser(xToken,followed_address,cluster)
{
  var response = {
      success:false,
      message:"Some Error Occured"
    }
  try {
    if(xToken !== "" && followed_address !== "" && cluster !== "")
    {
      await axios({
        url: `${process.env.REACT_APP_BACKEND_EP}/followUser`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${xToken}`
        },
        body: {
          followed_address:followed_address,
          network:cluster
        }
      })
      .then(res => {
        if(res.data.success === true)
        {
          response = {
            success:true,
            message:"User was followed"
          }
        }
      })
      .catch(err => {
        console.log(err);
        throw err;
      })
    }
    else
    {
      throw new Error("WRONG PARAMS")
    }
  } catch (error) {
    console.log(error.message)
  }
  return response;
}
export async function followUserOld(wallet_address,followed_address,cluster)
{
  var alreadyExisting = false;
  const database = createClient(supabaseUrl, supabaseKey);
  console.log("wal:",wallet_address);
  console.log("fol:",followed_address);
  var flag = 0;
  const response = await database
    .from('user_follow')
    .select()
    .eq("wallet_address",wallet_address)
    .match({
      followed_address: followed_address,
      cluster: cluster
    });

    console.log(response.data);
  if(response.data.length === 0)
  {
    const { error } = await database
      .from('user_follow')
      .insert({ 
        wallet_address: wallet_address,
        followed_address: followed_address,
        cluster:cluster
        });
    //create callback or modify
    console.log("followed")
    if(!error)
      flag++;
    const currentUserCallback = await database
    .from('user_details')
    .select()
    .eq("wallet_address",wallet_address);

    console.log("what we got for that user:",currentUserCallback.data);
    
    var callbackToBeModified;
    if(cluster === "devnet")
      callbackToBeModified = currentUserCallback.data[0].callback_devnet;
    else if(cluster === "testnet")
      callbackToBeModified = currentUserCallback.data[0].callback_testnet;
    else
      callbackToBeModified = currentUserCallback.data[0].callback_mainnet; 
    
    console.log("callback to be modified",callbackToBeModified)
    if(!callbackToBeModified)
    {
      //new callback to create
      let data = JSON.stringify({
        network: cluster,
        addresses: [
          followed_address
        ],
        "callback_url": `https://d67c-2405-201-8010-50c5-b878-831f-f9dd-5ed6.ngrok-free.app/callback/${wallet_address}/${cluster}`,
      });
      const endpoint = process.env.REACT_APP_MAINCALLBACK_EP;
      
      await axios({
        url: `${endpoint}callback/create`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.REACT_APP_MAINCALLBACK_KEY,
        },
        data : data
      })
        .then(async (res) => {
          if (res.data.success === true) {
            const createdCallbackId = res.data.result.id;
            var table_to_be_updated;
            if(cluster === "devnet")
              table_to_be_updated = { callback_devnet: createdCallbackId };
            else if(cluster === "testnet")
              table_to_be_updated = { callback_devnet: createdCallbackId };
            else
              table_to_be_updated = { callback_devnet: createdCallbackId }; 

            const { error } = await database
              .from('user_details')
              .update(table_to_be_updated)
              .eq('wallet_address', wallet_address);
            console.log("callback id to db");
            console.log(error);
            if(!error)
            {
              flag++;
            }
          }
        })
        .catch((err) => {
          console.warn(err);
        });

    }
    else
    {
      console.log("callback already exists");
      var callbackIdmModify;

      if(cluster === "devnet")
        callbackIdmModify = currentUserCallback.data[0].callback_devnet;
      else if(cluster === "testnet")
        callbackIdmModify = currentUserCallback.data[0].callback_testnet;
      else
        callbackIdmModify = currentUserCallback.data[0].callback_mainnet; 

      const currentUserfollowed = await database
        .from('user_follow')
        .select()
        .eq("wallet_address",wallet_address);
      var followAddresses = [];
      currentUserfollowed.data.forEach((follow_addr) => {
        followAddresses.push(follow_addr.followed_address)
      })
      let data = JSON.stringify({
        id: callbackIdmModify,
        addresses: [
          ...followAddresses
        ]
      });

      const endpoint = process.env.REACT_APP_MAINCALLBACK_EP;
      await axios({
        url: `${endpoint}callback/update`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.REACT_APP_MAINCALLBACK_KEY,
        },
        data : data
      })
        .then(async (res) => {
          if (res.data.success === true) {
            console.log(res.data.result);
            flag ++;
          }
        })
        .catch((err) => {
          console.warn(err);
        });

    }
    if(flag === 2)
      return {
        success:true,
        message:"User Followed"
      }
    else
      return {
        success:false,
        message:"user not followed"
      }
  }
  else
  {
    console.log("Already Followed");
    return {
      success:true,
      message:"User was already followed"
    }
  }
}
export async function isUserFollowed(followed_address, cluster, xToken)
{
  var response = {
    success:false,
    message: "Wrong Params Supplied"
  }
  if (xToken !== "" && followed_address !== "") {
    await axios.request({
      url: `${process.env.REACT_APP_BACKEND_EP}/isUserFollowed`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${xToken}`
      },
      params: {
        followed_user: followed_address,
        network: cluster
      }
    })
    .then(res => {
      if(res.data.success === true)
      {
        if(res.data.followed === true)
          response = {
            success:true,
            message: "user is followed"
          }
        else
          response = {
            success:false,
            message: "user not followed"
          }
      }
    })
    .catch((err) =>{
      console.log(err);
      response = {
        success:false,
        message: "Internal Server Error"
      }
    })
  } else {
    response =  {
      success:false,
      message: "Wrong Params Supplied"
    }
  }
  return response;
}
export async function isUserFollowedOld(wallet_address, followed_address, cluster)
{
  const database = createClient(supabaseUrl, supabaseKey);
  const { data,error } = await database
    .from('user_follow')
    .select()
    .eq("wallet_address",wallet_address)
    .match({
      followed_address: followed_address,
      cluster:cluster
    });

    if(!error && data.length === 1)
    {
      return {
        success:true,
        message: "user is followed"
      }
    }
    else
    {
      return {
        success:false,
        message: "user not followed"
      }
    }
}
export async function unFollowUser(xToken,followed_address,cluster)
{
  var response = {
      success:false,
      message:"Some Error Occured"
    }
  try {
    if(xToken !== "" && followed_address !== "" && cluster !== "")
    {
      await axios({
        url: `${process.env.REACT_APP_BACKEND_EP}/unfollowUser`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${xToken}`
        },
        body: {
          followed_address:followed_address,
          network:cluster
        }
      })
      .then(res => {
        if(res.data.success === true)
        {
          response = {
            success:true,
            message:"User was unfollowed"
          }
        }
      })
      .catch(err => {
        console.log(err);
        throw err;
      })
    }
    else
    {
      throw new Error("WRONG PARAMS")
    }
  } catch (error) {
    console.log(error.message)
  }
  return response;
}

export async function unFollowUserOld(wallet_address,followed_address,cluster)
{
  const database = createClient(supabaseUrl, supabaseKey);
  console.log("wal:",wallet_address);
  console.log("fol:",followed_address);
  var flag = 0;
  const response = await database
    .from('user_follow')
    .select()
    .eq("wallet_address",wallet_address)
    .match({
      followed_address: followed_address,
      cluster: cluster
    });

    console.log(response.data);
  if(response.data.length > 0)
  {
    const { error } = await database
      .from('user_follow')
      .delete()
      .eq("wallet_address",wallet_address)
      .match({
        followed_address: followed_address,
        cluster:cluster
      });
    //create callback or modify
    console.log("unfollowed")
    if(!error)
      flag++;
    const currentUserCallback = await database
    .from('user_details')
    .select()
    .eq("wallet_address",wallet_address);

    var callbackToBeModified;
    if(cluster === "devnet")
      callbackToBeModified = currentUserCallback.data[0].callback_devnet;
    else if(cluster === "testnet")
      callbackToBeModified = currentUserCallback.data[0].callback_testnet;
    else
      callbackToBeModified = currentUserCallback.data[0].callback_mainnet;
    
    console.log("callback to be modified",callbackToBeModified)
    if(callbackToBeModified)
    {

      const callbackIdmModify = callbackToBeModified;
      const currentUserfollowed = await database
        .from('user_follow')
        .select()
        .eq("wallet_address",wallet_address);
      if(currentUserfollowed.data.length < 1)
      {
        const endpoint = process.env.REACT_APP_MAINCALLBACK_EP;
        await axios({
          url: `${endpoint}callback/remove`,
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.REACT_APP_MAINCALLBACK_KEY,
          },
          data : {
            id :callbackIdmModify
          }
        })
          .then(async (res) => {
            if (res.data.success === true) {
              console.log(res.data.result);
              //remove callback address from database
              flag++;
            }
          })
          .catch((err) => {
            console.warn(err);
          });
      }
      else
      {
        var followAddresses = [];
        currentUserfollowed.data.forEach((follow_addr) => {
          followAddresses.push(follow_addr.followed_address)
        })
        let data = JSON.stringify({
          id: callbackIdmModify,
          addresses: [
            ...followAddresses
          ]
        });
  
        const endpoint = process.env.REACT_APP_MAINCALLBACK_EP;
        await axios({
          url: `${endpoint}callback/update`,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.REACT_APP_MAINCALLBACK_KEY,
          },
          data : data
        })
          .then(async (res) => {
            if (res.data.success === true) {
              console.log(res.data.result);
              flag ++;
            }
          })
          .catch((err) => {
            console.warn(err);
          });
      }
      if(flag === 2)
      return {
        success:true,
        message:"User Unfollowed"
      }
    else
      return {
        success:false,
        message:"user stil followed"
      }
      //new callback to create
    }
  }
  else
  {
    console.log("Already Unfollowed");
    return {
      success:true,
      message:"Already Unfollowed"
    }
  }
}
export async function getFollowData(address,network)
{
  var response = {
    success: true,
    message: "could not get data",
    followers: 0,
    following: 0
  }
  if(address !== "" && network !== "")
  {
      await axios.request({
        url: `${process.env.REACT_APP_BACKEND_EP}/getFollowData`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          
        },
        params: {
          network: network,
          wallet_address: address
        }
      })
      .then(res => {
        
        if(res.data.success === true)
        {
          response =  {
            success: true,
            message: "Follower Data Found",
            followers: res.data.followers,
            following: res.data.following
          }
        }
      })
      .catch(err => {
        console.log(err)
         response =  {
          success: false,
          message: "Follower Data Not Found",
          followers: 0,
          following: 0
        }
      });    
  }
  return response;
}
export async function getFollowDataOld(wallet_address,network)
{
  var response = {
    success: false,
    message: "unable to get followers",
    followers: 0,
    following: 0
  }
  var followers = 0;
  var following = 0;
  try {
    const database = createClient(supabaseUrl, supabaseKey);
    const { data,error } = await database
      .from('user_follow')
      .select()
      .eq("followed_address",wallet_address)
      .match({
        cluster: network
      });
    if(!error && data.length > 0)
    {
      followers = data.length;
    }
    console.log("followers im here");
    const followingData = await getFollowing(wallet_address,network);
    console.log("following im here",followingData);
    if(followingData.success === true)
    {
      following = followingData.following ?? 0;
    }
    response = {
      success: true,
      message: "Follower Data",
      followers: followers,
      following: following
    }
     
    return response;
    
  } catch (error) {
    console.log("Error Occured while getting Followers: ",error.message);
    return response;
  }
  
}
export async function getFollowing(address,network)
{
  var response = {
    success: false,
    message: "unable to get followers",
    following: 0
  }
  try {
    const database = createClient(supabaseUrl, supabaseKey);
    console.log("im here follow get address", address, network);
    const { data,error } = await database
      .from('user_follow')
      .select()
      .eq("wallet_address",address)
      .match({
        cluster: network
      });
    console.log("im here follow get", data);
    if(!error && data.length > 0)
    {
      response = {
        success: true,
        message: "following wallets",
        following: data.length
      }
      console.log("Follow response",response);
    }
    return response;
  } catch (error) {
    console.log("Error Occured while getting Followers: ",error.message);
    return response;
  }
}