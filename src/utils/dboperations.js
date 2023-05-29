const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');

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
export async function followUser(wallet_address,followed_address)
{
  var alreadyExisting = false;
  const database = createClient(supabaseUrl, supabaseKey);
  console.log("wal:",wallet_address);
  console.log("fol:",followed_address);

  const response = await database
    .from('user_follow')
    .select()
    .eq("wallet_address",wallet_address)
    .match({
      followed_address: followed_address
    });

    console.log(response.data);
  if(response.data.length === 0)
  {
    const { error } = await database
      .from('user_follow')
      .insert({ 
        wallet_address: wallet_address,
        followed_address: followed_address
        });
    //create callback or modify
    console.log("followed")
    const currentUserCallback = await database
    .from('user_details')
    .select()
    .eq("wallet_address",wallet_address);

    if(currentUserCallback.data.callback_id === null)
    {
      //new callback to create
      let data = JSON.stringify({
        network: "devnet",
        addresses: [
          followed_address
        ],
        "callback_url": "https://4c38-2405-201-8010-50c5-c14d-5105-29a5-f9e0.ngrok-free.app/callback/test",
        "events": [
          "SOL_TRANSFER"
        ]
      });
      const endpoint = process.env.SHYFT_API_KEY;
      
      await axios({
        url: `${endpoint}callback/create`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.SHYFT_API_KEY,
        },
        data : data
      })
        .then(async (res) => {
          if (res.data.success === true) {
            const createdCallbackId = res.data.result.id;
            const { error } = await database
              .from('user_details')
              .update({ callback_id: createdCallbackId })
              .eq('wallet_address', wallet_address);
            console.log("callback id to db");
            console.log(error);
          }
        })
        .catch((err) => {
          console.warn(err);
        });

    }
    else
    {
      const callbackIdmModify = currentUserCallback.data.callback_id;
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
          ...followAddresses,followed_address
        ]
      });

      const endpoint = process.env.SHYFT_API_KEY;
      await axios({
        url: `${endpoint}callback/update`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.SHYFT_API_KEY,
        },
        data : data
      })
        .then(async (res) => {
          if (res.data.success === true) {
            console.log(res.data.result);
          }
        })
        .catch((err) => {
          console.warn(err);
        });

    }
  }
  else
  {
    console.log("Already Followed");
  }
}