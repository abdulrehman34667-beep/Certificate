if(!sessionStorage.getItem('admin')) location.href='index.html';

async function uploadCert(){
  const roll = document.getElementById('roll_no').value.trim();
  const file = document.getElementById('image').files[0];
  if(!roll || !file){ alert('Roll & image required'); return; }

  const path = `certificates/${roll}.${file.name.split('.').pop()}`;

  // 1️⃣ Upload file
  const { data: uploadData, error: uploadError } = await window.supabaseClient.storage
      .from('certificates')
      .upload(path, file, { upsert: true });

  if(uploadError){
    console.error('Upload Error:', uploadError);
    alert('File upload failed: ' + uploadError.message);
    return;
  }

  // 2️⃣ Get public URL
  const { data: urlData, error: urlError } = window.supabaseClient.storage
      .from('certificates')
      .getPublicUrl(path);

  if(urlError || !urlData?.publicUrl){
    console.error('Public URL Error:', urlError);
    alert('Could not get public URL');
    return;
  }

  // 3️⃣ Insert record in table
  const { data: insertData, error: insertError } = await window.supabaseClient
      .from('certificates')
      .insert({ roll_no: roll, image_url: urlData.publicUrl });

  if(insertError){
    console.error('Insert Error:', insertError);
    alert('Database insert failed: ' + insertError.message);
    return;
  }

  alert('Certificate Added Successfully ✅');
}

function logout(){
  sessionStorage.clear();
  window.supabaseClient.auth.signOut();
  location.href='index.html';
}
