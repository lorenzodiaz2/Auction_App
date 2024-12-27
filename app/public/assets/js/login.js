const { createApp } = Vue;

createApp({
  data() {
    return {
      signupForm: {
        username: '',
        name: '',
        surname: '',
        password: ''
      },
      signinForm: {
        username: '',
        password: ''
      },
      messages: {
        signin: '',
        signup: ''
      },
      errorMessages: {
        signin: '',
        signup: ''
      }
    };
  },
  methods: {
    async signUp() {
      this.errorMessages.signup = '';
      this.messages.signup = '';

      const { username, name, surname, password } = this.signupForm;

      if (!username || !name || !surname || !password) {
        this.errorMessages.signup = 'All fields required!';
        return;
      }

      const newUser = { username, name, surname, password };

      try {
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newUser),
        });
        const data = await response.json();
        if (response.ok) {
          this.messages.signin = 'user successfully created!';
          setTimeout(() => {
            window.location.href = response.url;
          }, 2000);
          this.signupForm = { username: '', name: '', surname: '', password: '' };
        } else {
          this.errorMessages.signup = data.message;
        }
      } catch (error) {
        this.errorMessages.signup = 'An error occurred. Please try again.';
      }
    },
    async signIn() {
      this.errorMessages.signin = '';
      this.messages.signin = '';
      const { username, password } = this.signinForm;

      if (!username || !password) {
        this.errorMessages.signin = 'All fields required!';
        return;
      }

      try {
        const response = await fetch('/api/auth/signin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        
        if (response.ok) {
          this.messages.signin = 'Successfully logged!';

          setTimeout(() => {
            window.location.href = response.url;
          }, 2000);
        } else {
          const data = await response.json();
          this.errorMessages.signin = data.message;
        }
      } catch (error) {
        this.errorMessages.signin = "An error occurred. Please try again.";
      }
    }
  }
}).mount('#app');
