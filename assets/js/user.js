async function verifyCert() {
  const roll = document.getElementById('roll').value.trim();

  if (!roll) {
    alert('Please enter roll number');
    return;
  }

  const { data, error } = await window.supabaseClient
    .from('certificates')
    .select('image_url')
    .eq('roll_no', roll)
    .single();

  if (error || !data) {
    document.getElementById('result').innerHTML =
      '<p style="color:red">❌ Certificate not found</p>';
    return;
  }

  document.getElementById('result').innerHTML = `
    <img src="${data.image_url}" style="max-width:100%;border:1px solid #ccc"/>
  `;
}
