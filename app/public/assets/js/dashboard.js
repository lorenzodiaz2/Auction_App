const { createApp } = Vue;

createApp({
  data() {
    return {
      activeSection: 'dashBoard',
      search: {
        query: '',
        id: '',
        removeId: ''
      },
      auctionForm: {
        title: '',
        description: '',
        currentPrice: 0,
        expiryDate: ''
      },
      modifiedAuctionForm: {
        id: '',
        newTitle: '',
        newDescription: ''
      },
      modifiedPasswordForm: {
        oldPassword: '',
        newPassword: ''
      },
      logoutMessage: '',
      bidForm: {
        auctionId: '',
        newPrice: null
      },
      objects: null,
      object: null,
      okMessages: {
        insert: '',
        delete: '',
        modify: ''
      },
      errorMessages: {
        query: '',
        id: '',
        insert: '',
        delete: '',
        modify: '',
      } 
    };
  },
  methods: {
    async setActiveSection(section) {
      this.activeSection = section;
      this.search = {id: '', query: '', removeId: ''};
      this.objects = null;
      this.object = null;
      this.errorMessages = {id: '', query: '', insert:'', delete: '', modify: ''};
      this.okMessages = {insert: '', delete: '', modify: ''};
      if (this.activeSection === 'dashBoard') {
        await this.getUserInfo();
      }
    },
    reset(object) {
      this[object] = null;
    },
    async searchAuctionsByQuery() {
      try {
        this.objects = null;
        this.errorMessages.query = '';
        const response = await fetch(`/api/auctions/?q=${this.search.query}`, {
          method: "get",
          headers: { "content-type": "application/json" },
        });
        const data = await response.json();
        if (response.ok) {
          this.objects = data;
          this.search.query = '';
        } else {
          this.errorMessages.query = data.message;
        }
      } catch {
        this.errorMessages.query = 'Error performing search.';
      }
    },
    async searchAuctionById() {
      try {
        this.object = null;
        this.errorMessages.id = '';
        if (this.search.id.trim() == '') {
          this.errorMessages.id = 'Field required!';
          return;
        }
        const response = await fetch(`/api/auctions/${this.search.id}`, {
          method: "get",
          headers: { "content-type": "application/json" },
        });
        const data = await response.json();
        if (response.ok) {
          this.object = data;
          this.search.id = '';
        } else {
          this.errorMessages.id = data.message;
        }
      } catch {
        this.errorMessages.id = 'Error performing search.';
      }
    },
    async insertAuction() {
      this.errorMessages.insert = '';
      this.okMessages.insert = '';
      const { title, description, currentPrice, expiryDate } = this.auctionForm;
      
      console.log(expiryDate)

      if (!title || !description || typeof(currentPrice) !== 'number' || !expiryDate) {
        this.errorMessages.insert = `All fields required!`;
        return;
      }

      const newAuction = { 
        title, 
        description, 
        currentPrice, 
        expiryDate
      };

      try {
        const response = await fetch('/api/auctions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newAuction),
        });        
        const data = await response.json();
        if (response.ok) {
          this.okMessages.insert = data.message;
          this.auctionForm = {title: '', description: '', currentPrice: 0, expiryDate: ''};
        } else {
          this.errorMessages.insert = data.message;
        }
      } catch (error) {
        this.errorMessages.insert = 'An error occurred. Please try again.';
      }
    },
    async deleteAuction() {
      this.errorMessages.delte = '';
      this.okMessages.delete = '';

      if (this.search.removeId.trim() == '') {
        this.errorMessages.delete = 'Field required!';
        return;
      }
      try {
        const response = await fetch(`/api/auctions/${this.search.removeId}`, {
          method: "delete",
          headers: { "content-type": "application/json" },
        });

        if (response.ok) {
          this.okMessages.delete = 'Auction successfully delete';
          this.search.removeId = '';
        } else {
          const data = await response.json();
          this.errorMessages.delete = data.message;
        }
      } catch {
        this.errorMessages.delete = 'Error deleting auction.';
      }
    },
    async modifyAuction() {
      this.errorMessages.modify = '';
      this.okMessages.modify = '';

      const { id, newTitle, newDescription } = this.modifiedAuctionForm;

      if (!id) {
        this.errorMessages.modify = 'ID required!';
        return;
      }

      if (!newTitle && !newDescription) {
        this.errorMessages.modify = 'At least one field required!';
        return;
      }

      try {
        const response = await fetch(`/api/auctions/${id}`, {
          method: 'put',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ newTitle, newDescription }),
        });

        const data = await response.json();

        if (response.ok) {
          this.okMessages.modify = data.message;
          this.modifiedAuctionForm = { id: '', newTitle: '', newDescription: '' };
        } else {
          this.errorMessages.modify = data.message;
        }
      } catch (error) {
        this.errorMessages.modify = 'An error occurred. Please try again.';
      }
    },
    async searchUserById() {
      this.errorMessages.id = '';
      this.object = null;
      if (this.search.id.trim() == '') {
        this.errorMessages.id = 'Field required!';
        return;
      }
      try {
        const response = await fetch(`/api/users/${this.search.id}`, {
          method: "get",
          headers: { "content-type": "application/json" },
        });
        const data = await response.json();

        if (response.ok) {
          this.object = data;
          this.search.id = '';
        } else {
          this.errorMessages.id = data.message;
        }
      } catch {
        this.errorMessages.id = 'Error fetching user by ID.';
      }
    },
    async searchUsersByQuery() {
      try {
        this.objects = null;
        this.errorMessages.query = '';
        const response = await fetch(`/api/users/?q=${this.search.query}`, {
          method: "get",
          headers: { "content-type": "application/json" },
        });
        const data = await response.json();
        if (response.ok) {
          this.objects = data;
          this.search.query = '';
        } else {
          this.errorMessages.query = data.message;
        }
      } catch {
        this.errorMessages.query = 'Error performing search.';
      }
    },
    async getUserInfo() {
      try {
        this.object = null;
        this.errorMessages.id = '';
        const response = await fetch('/api/whoami', {
          method: "get",
          headers: { "content-type": "application/json" },
        });
        const data = await response.json();
        if (response.ok) {
          this.object = data;
        } else {
          this.errorMessages.id = data.message;
        }
      } catch {
        this.errorMessages.id = 'Error fetching user info.';
      }
    },
    async getWinningAuctions() {
      try {
        this.objects = null;
        this.errorMessages.query = '';
        const response = await fetch(`/api/auctions/?q=`, {
          method: "get",
          headers: { "content-type": "application/json" },
        });
        const data = await response.json();
        const winningAuctions = [];
        if (response.ok) {
          const userInfo = this.object ? true : false;
          if (!userInfo) {
            await this.getUserInfo();
          }

          for(let i = 0; i < data.length; i++) {
            if (data[i].WinningUser === this.object.Username) {
              delete data[i].WinningUser;
              winningAuctions.push(data[i]);
            }
          }
          if (!userInfo) {
            this.object = null;
          }

          if (winningAuctions.length > 0) {
            this.objects = winningAuctions;
          } else {
            this.errorMessages.query = 'No winning auctions'
          }

        } else {
          this.errorMessages.query = data.message;
        }

      } catch (error) {
        this.errorMessages.query = 'Error fetching user info.';
      }
    },
    async makeBid() {
      this.errorMessages.insert = '';
      this.okMessages.insert = '';

      const { auctionId, newPrice } = this.bidForm;
      
      if (!auctionId || typeof(newPrice) !== 'number') {
        this.errorMessages.insert = `All fields required!`;
        return;
      }

      try {
        const response = await fetch(`/api/auctions/${auctionId}/bids`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({newPrice}),
        });        
        const data = await response.json();
        if (response.ok) {
          this.okMessages.insert = data.message;
          this.bidForm = { auctionId: '', newPrice: null };
        } else {
          this.errorMessages.insert = data.message;
        }
      } catch (error) {
        this.errorMessages.insert = 'An error occurred. Please try again.';
      }
    },
    async searchBidsByAuctionId() {
      this.errorMessages.query = '';
      this.objects = null;
      
      if (!this.search.query) {
        this.errorMessages.query = `Auction ID required!`;
        return;
      }

      try {
        const response = await fetch(`/api/auctions/${this.search.query}/bids`, {
          method: 'get',
          headers: { 'Content-Type': 'application/json' }
        });    
        const data = await response.json();
        if (response.ok) {
          this.objects = data;
          this.search.query = '';
        } else {
          this.errorMessages.query = data.message;
        }
      } catch (error) {
        this.errorMessages.query = 'An error occurred. Please try again.';
      }
    },
    async searchBidById() {
      this.errorMessages.id = '';
      this.object = null;

      if (this.search.id.trim() == '') {
        this.errorMessages.id = 'Field required!';
        return;
      }
      try {
        const response = await fetch(`/api/bids/${this.search.id}`, {
          method: "get",
          headers: { "content-type": "application/json" }
        });
        const data = await response.json();
        delete data.AuctionId;

        if (response.ok) {
          this.object = data;
          this.search.id = '';
        } else {
          this.errorMessages.id = data.message;
        }
      } catch {
        this.errorMessages.id = 'Error fetching auction by ID.';
      }
    },
    openSignoutModal() {
      const modal = document.getElementById("myModal");

      const close = document.getElementById("close");

      modal.style.display = "block";

      close.onclick = () => {
        modal.style.display = "none";
      };

      window.onclick = event => {
        if (event.target === modal) {
          modal.style.display = "none";
        }
      };
    },
    async logout() {
      this.okMessages.logout = '';
      this.errorMessages.logout = '';
      try {
        const response = await fetch(`/api/logout`, {
          method: "post",
          headers: { "content-type": "application/json" }
        });
        
        if (response.ok) {
          this.okMessages.logout = 'Successfully logged out!';
          setTimeout(() => {
            window.location.href = response.url;
          }, 2000);
        } else {
          const data = await response.json();
          this.errorMessages.logout = data.message;
        }
      } catch (error) {
        this.errorMessages.logout = "Internal Server Error";
        console.log(error)
      }
    },
    async changePassword() {
      this.okMessages.modify = '';
      this.errorMessages.modify = '';
      const {oldPassword, newPassword} = this.modifiedPasswordForm;

      if (oldPassword.trim() === '' || newPassword.trim() === '') {
        this.errorMessages.modify = 'All fields required!';
        return;
      }

      try {
        const response = await fetch('/api/changePassword', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ oldPassword, newPassword })
        });
        const data = await response.json();
        if (response.ok) {
          this.okMessages.modify = data.message;
        } else {
          this.errorMessages.modify = data.message;
        }
        this.modifiedPasswordForm = {oldPassword: '', newPassword: ''};
      } catch (error) {
        this.errorMessages.query = 'An error occurred. Please try again.';
      }
    }
  },
  async mounted() {
    if (this.activeSection === 'dashBoard') {
      await this.getUserInfo();
    }
  }
}).mount('#app');
