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
  }
  else
  {
    console.log("Already Followed");
  }
}