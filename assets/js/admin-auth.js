async function login(){
  const email=document.getElementById('email').value;
  const password=document.getElementById('password').value;

  const {data,error}=await supabase.auth.signInWithPassword({email,password});
  if(data?.session){
    sessionStorage.setItem('admin','true');
    location.href='dashboard.html';
  }else{
    alert(error?.message||'Login failed');
  }
}