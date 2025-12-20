if (!sessionStorage.getItem('admin')) {
  location.href = 'index.html';
}

async function uploadCert() {
  console.log('Upload function triggered');

  const roll = document.getElementById('roll_no').value.trim();
  const file = document.getElementById('image').files[0];

  if (!roll || !file) {
    alert('Roll & image required');
    return;
  }

  const ext = file.name.split('.').pop();
  const filePath = `${roll}.${ext}`; // ✅ FIXED PATH

  // 1️⃣ Upload to Storage
  const { error: uploadError } = await window.supabaseClient.storage
    .from('certificates')
    .upload(filePath, file, { upsert: true });

  if (uploadError) {
    console.error(uploadError);
    alert('Upload failed: ' + uploadError.message);
    return;
  }

  // 2️⃣ Get Public URL
  const { data: urlData } = window.supabaseClient.storage
    .from('certificates')
    .getPublicUrl(filePath);

  if (!urlData?.publicUrl) {
    alert('Public URL not generated');
    return;
  }

  // 3️⃣ Insert into table
  const { error: insertError } = await window.supabaseClient
    .from('certificates')
    .insert({
      roll_no: roll,
      image_url: urlData.publicUrl
    });

  if (insertError) {
    console.error(insertError);
    alert('DB insert failed: ' + insertError.message);
    return;
  }

  alert('Certificate Added Successfully ✅');
}

function logout() {
  sessionStorage.clear();
  window.supabaseClient.auth.signOut();
  location.href = 'index.html';
}
