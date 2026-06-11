import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let mode = "signin";

const signinTab = document.getElementById("signinTab");
const signupTab = document.getElementById("signupTab");
const nameGroup = document.getElementById("nameGroup");
const authSubmit = document.getElementById("authSubmit");
const authForm = document.getElementById("authForm");
const loginMessage = document.getElementById("loginMessage");
const googleLogin = document.getElementById("googleLogin");
const forgotPassword = document.getElementById("forgotPassword");

function showMessage(message, type = "success") {
  loginMessage.textContent = message;
  loginMessage.className = "login-message show " + type;
}

function setMode(nextMode) {
  mode = nextMode;
  const isSignup = mode === "signup";
  signinTab.classList.toggle("active", !isSignup);
  signupTab.classList.toggle("active", isSignup);
  nameGroup.style.display = isSignup ? "block" : "none";
  authSubmit.textContent = isSignup ? "Create account" : "Sign in";
  loginMessage.className = "login-message";
}

signinTab?.addEventListener("click", () => setMode("signin"));
signupTab?.addEventListener("click", () => setMode("signup"));

async function saveUserProfile(user, extra = {}) {
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    name: user.displayName || extra.name || "",
    email: user.email || "",
    role: "client",
    status: "active",
    company: "",
    createdAt: serverTimestamp(),
    lastLoginAt: serverTimestamp()
  }, { merge: true });
}

googleLogin?.addEventListener("click", async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    await saveUserProfile(result.user);
    window.location.href = "dashboard.html";
  } catch (error) {
    showMessage(error.message, "error");
  }
});

authForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const displayName = document.getElementById("displayName").value.trim();

  try {
    if (mode === "signup") {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName) {
        await updateProfile(result.user, { displayName });
      }
      await saveUserProfile(result.user, { name: displayName });
      window.location.href = "dashboard.html";
    } else {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await saveUserProfile(result.user);
      window.location.href = "dashboard.html";
    }
  } catch (error) {
    showMessage(error.message, "error");
  }
});

forgotPassword?.addEventListener("click", async (event) => {
  event.preventDefault();
  const email = document.getElementById("email").value.trim();
  if (!email) {
    showMessage("Enter your email address first, then click Forgot password.", "error");
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    showMessage("Password reset email sent.", "success");
  } catch (error) {
    showMessage(error.message, "error");
  }
});

onAuthStateChanged(auth, (user) => {
  if (user && window.location.pathname.endsWith("login.html")) {
    // User already signed in. Keep login page available, but they can proceed automatically.
  }
});
