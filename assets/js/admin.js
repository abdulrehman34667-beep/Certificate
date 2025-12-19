if(!sessionStorage.getItem('admin')) location.href='index.html';

async function uploadCert(){
  const roll=document.getElementById('roll_no').value.trim();
  const file=document.getElementById('image').files[0];
  if(!roll||!file){alert('Roll & image required');return;}

  const path=`certificates/${roll}.${file.name.split('.').pop()}`;
  await supabase.storage.from('certificates').upload(path,file,{upsert:true});
  const {data}=supabase.storage.from('certificates').getPublicUrl(path);
  await supabase.from('certificates').insert({roll_no:roll,image_url:data.publicUrl});
  alert('Certificate Added');
}

function logout(){
  sessionStorage.clear();
  supabase.auth.signOut();
  location.href='index.html';
}