/* 🔐 Admin Protection */
if (!sessionStorage.getItem('admin')) {
  location.href = '/admin/index.html';
}

/* 📤 Upload Certificate */
async function uploadCert() {
  console.log('Upload function triggered');

  const studentName = document.getElementById('student_name').value.trim();
  const roll = document.getElementById('roll_no').value.trim();
  const file = document.getElementById('image').files[0];

  if (!studentName || !roll || !file) {
    alert('Student name, roll number & file required');
    return;
  }

  const ext = file.name.split('.').pop().toLowerCase();
  const filePath = `${roll}.${ext}`;

  /* 1️⃣ Upload to Supabase Storage */
  const { error: uploadError } =
    await window.supabaseClient.storage
      .from('certificates')
      .upload(filePath, file, { upsert: true });

  if (uploadError) {
    console.error(uploadError);
    alert('Upload failed: ' + uploadError.message);
    return;
  }

  /* 2️⃣ Get Public URL */
  const { data: urlData } =
    window.supabaseClient.storage
      .from('certificates')
      .getPublicUrl(filePath);

  if (!urlData || !urlData.publicUrl) {
    alert('Public URL not generated');
    return;
  }

  /* 3️⃣ Insert into Database */
  const { error: insertError } =
    await window.supabaseClient
      .from('certificates')
      .insert({
        student_name: studentName,
        roll_no: roll,
        image_url: urlData.publicUrl
      });

  if (insertError) {
    console.error(insertError);
    alert('DB insert failed: ' + insertError.message);
    return;
  }

  alert('Certificate Added Successfully ✅');

  /* clear form */
  document.getElementById('student_name').value = '';
  document.getElementById('roll_no').value = '';
  document.getElementById('image').value = '';
}

/* 🚪 Logout */
function logout() {
  sessionStorage.clear();
  window.supabaseClient.auth.signOut();
  location.href = '/admin/index.html';
}

/* 📋 Load All Students (WITH CERTIFICATE PREVIEW) */
async function loadStudents() {
  const table = document.getElementById('studentsTable');
  table.innerHTML = '<tr><td colspan="4">Loading...</td></tr>';

  const { data, error } = await window.supabaseClient
    .from('certificates')
    .select('student_name, roll_no, image_url')
    .order('roll_no', { ascending: true });

  if (error) {
    console.error(error);
    table.innerHTML =
      '<tr><td colspan="4" style="color:red">Failed to load students</td></tr>';
    return;
  }

  if (!data || data.length === 0) {
    table.innerHTML =
      '<tr><td colspan="4">No students found</td></tr>';
    return;
  }

  table.innerHTML = '';

  data.forEach((stu, index) => {
    const url = stu.image_url || '';
    const isPdf = url.toLowerCase().endsWith('.pdf');

    const previewHtml = isPdf
      ? `<a href="${url}" target="_blank">📄 PDF Preview</a>`
      : `<a href="${url}" target="_blank">
           <img src="${url}"
                style="width:40px;height:40px;object-fit:cover;border:1px solid #ccc">
         </a>`;

    table.innerHTML += `
      <tr>
        <td>${index + 1}</td>
        <td>${stu.student_name || '-'}</td>
        <td>${stu.roll_no}</td>
        <td>${previewHtml}</td>
      </tr>
    `;
  });
}

/* ❌ Delete Student */
async function deleteStudent() {
  const roll = document.getElementById('delete_roll_no').value.trim();

  if (!roll) {
    alert('Please enter Roll Number');
    return;
  }

  if (!confirm(`Are you sure you want to delete student with Roll No: ${roll}?`)) {
    return;
  }

  const { error } = await window.supabaseClient
    .from('certificates')
    .delete()
    .eq('roll_no', roll);

  if (error) {
    console.error(error);
    alert('Failed to delete student: ' + error.message);
    return;
  }

  alert(`Student with Roll No ${roll} deleted successfully ✅`);
  document.getElementById('delete_roll_no').value = '';
  loadStudents();
}
