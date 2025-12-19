async function verifyCert(){
  const roll=document.getElementById('roll').value.trim();
  if(!roll){alert('Enter roll number');return;}
  const {data,error}=await supabase.from('certificates').select('*').eq('roll_no',roll).single();
  document.getElementById('result').innerHTML=data?`<img src="${data.image_url}" width="300">`:'Certificate not found';
}