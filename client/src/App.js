import React, { Component } from "react";
import MyToken from "./contracts/MyToken.json";
import MyTokenSale from "./contracts/MyTokenSale.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {

  state = { 
    loaded: false,
    tokenSaleAddress: null,
    tokenAmount: 0,
    tokenBalance: "",
    MyTokenSale:null
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      this.networkId = await this.web3.eth.net.getId();
      // this.deployedNetwork = MyToken.networks[networkId];
      this.tokenInstance = new this.web3.eth.Contract(
        MyToken.abi,
        MyToken.networks[this.networkId] && MyToken.networks[this.networkId].address,
      );

      this.tokenSaleInstance = new this.web3.eth.Contract(
        MyTokenSale.abi,
        MyTokenSale.networks[this.networkId] && MyTokenSale.networks[this.networkId].address,
      );

      const balance = await this.tokenInstance.methods.balanceOf(this.accounts[0]).call();

      // console.log(this.tokenSaleInstance);

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({
        loaded:true,
        tokenSaleAddress: MyTokenSale.networks[this.networkId].address,
        tokenBalance: balance,
        MyTokenSale: this.tokenSaleInstance
      });

      console.log(this.state);

      // console.log(this.state);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  updateTokenAmount(e){
    console.log(e.target.value);
    this.setState({tokenAmount:e.target.value});
  }

  async handlePurchase(){
    // console.log(this.state.MyTokenSale);
    await this.tokenSaleInstance.methods.buyTokens(this.accounts[0]).send({from: this.accounts[0],value: this.web3.utils.toWei(this.state.tokenAmount,"wei")});
  }

  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>TOKENSALE!</h1>
        <p>But Tokens for cheap value for a limited time only!</p>

        <br></br>

        <h2>Your Current balance is {this.state.tokenBalance} GLD</h2>

        <h2>Buy Tokens</h2>
        {/* <p>If you want to buy tokens send ether to this account: {this.state.tokenSaleAddress}</p> */}

        <form>
          <input placeholder="1 WEI = 1 GLD" value={this.state.tokenAmount} onChange={e => this.updateTokenAmount(e)}>
          </input>
          <button type="button" onClick={(event)=>{
            event.preventDefault();
            this.handlePurchase();
          }}>Purchase</button>
        </form>
      </div>
    );
  }
}

export default App;
