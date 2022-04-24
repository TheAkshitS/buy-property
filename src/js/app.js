App = {
  web3Provider: null,
  contracts: {},

  init: async function () {
    // Load properties
    $.getJSON('../properties.json', function (data) {
      var propertiesRow = $('#propertiesRow');
      var propertyTemplate = $('#propertyTemplate');

      for (i = 0; i < data.length; i++) {
        propertyTemplate.find('.panel-title').text(data[i].title);
        propertyTemplate.find('.property-address').text(data[i].address);
        propertyTemplate.find('.property-postal').text(data[i].postalZip);
        propertyTemplate.find('.property-region').text(data[i].region);
        propertyTemplate.find('.btn-buy').attr('data-id', data[i].id);

        propertiesRow.append(propertyTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function () {
    // Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.ethereum;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider(
        'http://localhost:8545'
      );
    }
    web3 = new Web3(App.web3Provider);

    window.ethereum
      .request({ method: 'eth_requestAccounts' })
      .then((accounts) => {
        console.log('Account selected:-:', accounts[0]);
        // $("#accountAddress").html("Your Account: " + accounts[0]);
      });

    return App.initContract();
  },

  initContract: function () {
    $.getJSON('Buyer.json', function (data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var BuyerArtifact = data;
      App.contracts.Buyer = TruffleContract(BuyerArtifact);

      // Set the provider for our contract
      App.contracts.Buyer.setProvider(App.web3Provider);

      // Use our contract to retrieve and mark the property sold
      return App.markSold();
    });

    return App.bindEvents();
  },

  bindEvents: function () {
    $(document).on('click', '.btn-buy', App.handleBuy);
  },

  markSold: function (buyers, account) {
    var buyerInstance;

    App.contracts.Buyer.deployed()
      .then(function (instance) {
        buyerInstance = instance;

        return buyerInstance.getBuyers.call();
      })
      .then(function (buyers) {
        for (i = 0; i < buyers.length; i++) {
          if (buyers[i] !== '0x0000000000000000000000000000000000000000') {
            $('.panel-property')
              .eq(i)
              .find('button')
              .text('Sold')
              .attr('class', 'btn btn-danger btn-buy')
              .attr('disabled', true);
          }
        }
      })
      .catch(function (err) {
        console.log(err.message);
      });
  },

  handleBuy: function (event) {
    event.preventDefault();

    var propertyId = parseInt($(event.target).data('id'));
    console.log('Property ID:-:', propertyId);
    var buyerInstance;

    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Buyer.deployed()
        .then(function (instance) {
          buyerInstance = instance;

          // Execute buy as a transaction by sending account
          return buyerInstance.buy(propertyId, { from: account });
        })
        .then(function (result) {
          return App.markSold();
        })
        .catch(function (err) {
          console.log(err.message);
        });
    });
  },
};

$(function () {
  $(window).load(function () {
    App.init();
  });
});
