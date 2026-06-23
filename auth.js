// auth.js

// ==========================
// REGISTER
// ==========================

async function register() {

  const name =
    document.getElementById(
      'signup-name'
    )?.value.trim();

  const email =
    document.getElementById(
      'signup-email'
    )?.value.trim();

  const password =
    document.getElementById(
      'signup-password'
    )?.value.trim();

  if (!name || !email || !password) {

    alert(
      'Please fill all fields'
    );

    return;
  }

  try {

    const result =
      await postData(
        '/auth/register',
        {
          name,
          email,
          password,
          confirmPassword: password
        }
      );

    console.log(
      'Register Response:',
      result
    );

    if (!result.success) {

      alert(
        result.message ||
        'Registration failed'
      );

      return;
    }

    if (result.token) {

      localStorage.setItem(
        'token',
        result.token
      );
    }

    if (result.user) {

      localStorage.setItem(
        'user',
        JSON.stringify(
          result.user
        )
      );
    }

    alert(
      'Account Created Successfully'
    );

    loadAccount();

    if (
      typeof showPage === 'function'
    ) {
      showPage('account');
    }

  } catch (error) {

    console.error(error);

    alert(
      'Registration Failed'
    );
  }
}


// ==========================
// LOGIN
// ==========================

async function login() {

  const email =
    document.getElementById(
      'login-email'
    )?.value.trim();

  const password =
    document.getElementById(
      'login-password'
    )?.value.trim();

  if (!email || !password) {

    alert(
      'Please enter email and password'
    );

    return;
  }

  try {

    const result =
      await postData(
        '/auth/login',
        {
          email,
          password
        }
      );

    console.log(
      'Login Response:',
      result
    );

    if (!result.success) {

      alert(
        result.message ||
        'Login Failed'
      );

      return;
    }

    localStorage.setItem(
      'token',
      result.token
    );

    localStorage.setItem(
      'user',
      JSON.stringify(
        result.user
      )
    );

    alert(
      'Login Successful'
    );

    loadAccount();

    if (
      typeof showPage === 'function'
    ) {
      showPage('account');
    }

  } catch (error) {

    console.error(error);

    alert(
      'Login Failed'
    );
  }
}


// ==========================
// LOAD ACCOUNT
// ==========================

function loadAccount() {

  const user =
    JSON.parse(
      localStorage.getItem(
        'user'
      )
    );

  if (!user) return;

  const accountName =
    document.getElementById(
      'account-name'
    );

  const accountEmail =
    document.getElementById(
      'account-email'
    );

  if (accountName) {

    accountName.innerText =
      user.name || '';
  }

  if (accountEmail) {

    accountEmail.innerText =
      user.email || '';
  }
}


// ==========================
// LOGIN STATUS
// ==========================

function isLoggedIn() {

  return !!localStorage.getItem(
    'token'
  );
}


// ==========================
// LOGOUT
// ==========================

function logout() {

  localStorage.removeItem(
    'token'
  );

  localStorage.removeItem(
    'user'
  );

  alert(
    'Logged Out Successfully'
  );

  if (
    typeof showPage === 'function'
  ) {
    showPage('login');
  } else {
    window.location.href =
      'login.html';
  }
}


// ==========================
// VERIFY TOKEN
// ==========================

async function verifyLogin() {

  const token =
    localStorage.getItem(
      'token'
    );

  if (!token) {

    return false;
  }

  try {

    const response =
      await fetch(
        `${API_URL}/auth/me`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

    return response.ok;

  } catch (error) {

    console.error(error);

    return false;
  }
}


// ==========================
// AUTO LOAD
// ==========================

document.addEventListener(
  'DOMContentLoaded',
  async () => {

    if (
      isLoggedIn()
    ) {

      loadAccount();

      const valid =
        await verifyLogin();

      if (!valid) {

        localStorage.clear();
      }
    }
  }
);
