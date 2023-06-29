import { supabase } from '../../../supabase';

export default async function handler(req, res) {
  console.log(req);
  if(req.method === 'POST'){
    const { email, password } = req.body;
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if(error){
      return res.status(401).json({ error: error.message });
    }
    
    res.setHeader('Set-Cookie', `access_token=${data.session.access_token}; HttpOnly; Path=/;`);
    res.status(200).json(data);
    
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
