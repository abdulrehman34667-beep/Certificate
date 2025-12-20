console.log('USER JS LOADED - PDF FIX VERSION');


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

  const url = data.image_url;
  const isPDF = url.toLowerCase().endsWith('.pdf');

  if (isPDF) {
    document.getElementById('result').innerHTML = `
      <iframe src="${url}" width="100%" height="500px"
        style="border:1px solid #ccc"></iframe>
      <br><br>
      <a href="${url}" target="_blank">⬇ Download PDF</a>
    `;
  } else {
    document.getElementById('result').innerHTML = `
      <img src="${url}" style="max-width:100%;border:1px solid #ccc"/>
    `;
  }
}
