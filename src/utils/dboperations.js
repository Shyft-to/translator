const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "";
const supabaseKey ="";
export async function userLogon(wallet_address)
{
    var alreadyExisting = false;
    const database = createClient(supabaseUrl, supabaseKey);

    const response = await database
    .from('user_details')
    .select();

    //console.log(response);
    
    const allUsers = response.data;

    if(allUsers.length>0)
    {
      allUsers.forEach(user => {
        if(user.wallet_address === wallet_address)
        {
            alreadyExisting = true;
            console.log("user exists in database")
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
    }
    
}