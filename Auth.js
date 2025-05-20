// auth.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import { getDatabase, set, ref, update } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js";

// Cấu hình Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAMkGbMlRb8k5bJUnsqbnI69rbZCAaF9f8",
  authDomain: "login-7faa9.firebaseapp.com",
  projectId: "login-7faa9",
  storageBucket: "login-7faa9.appspot.com",
  messagingSenderId: "304300862930",
  appId: "1:304300862930:web:042236209b1d7e7e1bac0b",
  measurementId: "G-QBLJ5T3ZFC"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

// Xử lý sự kiện sau khi DOM đã sẵn sàng
document.addEventListener("DOMContentLoaded", () => {
  const signUpButton = document.getElementById("signUpBtn");
  const signInButton = document.getElementById("signInBtn");

  // Đăng ký tài khoản
  if (signUpButton) {
    signUpButton.addEventListener("click", (event) => {
      event.preventDefault();
      const email = document.getElementById("rEmail").value;
      const password = document.getElementById("rpassword").value;
      const cpassword = document.getElementById("cpassword").value;

      if (password !== cpassword) {
        alert("Mật khẩu xác nhận không đúng!");
        return;
      }

      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          set(ref(database, 'users/' + user.uid), {
            email: email,
            created_at: new Date().toISOString()
          });
          alert("Đăng ký thành công! Vui lòng đăng nhập.");
          
          // Quay lại form đăng nhập thay vì chuyển trang
          document.getElementById('signupForm').classList.add('hidden');
          document.getElementById('loginForm').classList.remove('hidden');
        })
        .catch((error) => {
          alert("Lỗi đăng ký: " + error.message);
        });
    });
  }

  // Đăng nhập tài khoản
  if (signInButton) {
    signInButton.addEventListener("click", (event) => {
      event.preventDefault();
      const email = document.getElementById("email_field").value;
      const password = document.getElementById("password_field").value;

      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;

          update(ref(database, 'users/' + user.uid), {
            last_login: new Date().toISOString()
          });

          localStorage.setItem('loggedInUserId', user.uid);
          window.location.href = "index.html"; // Chuyển sang trang chính
        })
        .catch((error) => {
          alert("Đăng nhập thất bại: " + error.message);
        });
    });
  }

  // Theo dõi trạng thái đăng nhập
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("Đã đăng nhập:", user.email);
    } else {
      console.log("Chưa đăng nhập.");
    }
  });
});
