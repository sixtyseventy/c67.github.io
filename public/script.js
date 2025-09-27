let currentUser=null;
let avatarData=null;
const guestBtn=document.getElementById("guestBtn");
const createAccount=document.getElementById("createAccount");
const usernameInput=document.getElementById("username");
const avatarUpload=document.getElementById("avatarUpload");
const avatarPreview=document.getElementById("avatarPreview");
const loginSection=document.getElementById("login-section");
const forumSection=document.getElementById("forum-section");
const postBtn=document.getElementById("postBtn");
const postText=document.getElementById("postText");
const postsContainer=document.getElementById("postsContainer");

function loadPosts(){
  fetch("/posts").then(r=>r.json()).then(posts=>{
    postsContainer.innerHTML="";
    posts.forEach(p=>{
      const div=document.createElement("div");
      div.className="post";
      div.innerHTML=`<img src="${p.avatar||''}"><div class="post-content"><div class="post-username">${p.username}</div><div class="post-text">${p.text}</div></div>`;
      postsContainer.appendChild(div);
    });
  });
}

guestBtn.onclick=()=>{
  currentUser="Guest_"+Math.floor(Math.random()*1000);
  loginSection.style.display="none";
  forumSection.style.display="block";
  loadPosts();
};

createAccount.onclick=()=>{
  const name=usernameInput.value.trim();
  if(!name) return;
  const formData=new FormData();
  formData.append("username",name);
  if(avatarUpload.files[0]) formData.append("avatar",avatarUpload.files[0]);
  fetch("/create-user",{method:"POST",body:formData}).then(r=>r.json()).then(res=>{
    if(res.success){
      currentUser=res.username;
      loginSection.style.display="none";
      forumSection.style.display="block";
      loadPosts();
    }
  });
};

avatarUpload.addEventListener("change",e=>{
  const file=e.target.files[0];
  if(!file) return;
  const reader=new FileReader();
  reader.onload=()=>{avatarData=reader.result;avatarPreview.src=avatarData;avatarPreview.style.display="block";}
  reader.readAsDataURL(file);
});

postBtn.onclick=()=>{
  const text=postText.value.trim();
  if(!text) return;
  fetch("/create-post",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:currentUser,text})})
  .then(r=>r.json()).then(res=>{if(res.success){postText.value="";loadPosts();}});
};

loadPosts();
