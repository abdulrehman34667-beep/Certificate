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

async function loadStudents() {
  const table = document.getElementById('studentsTable');
  table.innerHTML = '<tr><td colspan="3">Loading...</td></tr>';

  const { data, error } = await window.supabaseClient
    .from('certificates')
    .select('student_name, roll_no')
    .order('roll_no', { ascending: true });

  if (error) {
    console.error(error);
    table.innerHTML =
      '<tr><td colspan="3" style="color:red">Failed to load students</td></tr>';
    return;
  }

  if (!data || data.length === 0) {
    table.innerHTML =
      '<tr><td colspan="3">No students found</td></tr>';
    return;
  }

  table.innerHTML = '';

  data.forEach((stu, index) => {
    table.innerHTML += `
      <tr>
        <td>${index + 1}</td>
        <td>${stu.student_name ?? '-'}</td>
        <td>${stu.roll_no}</td>
      </tr>
    `;
  });
}

