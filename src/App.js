import { ethers } from "ethers";
import { abi } from "./abi";
import { useState, useEffect } from "react";
import  xavier  from "./img/xavier.png";
import  nasi  from "./img/nasi.png";
import './App.css';

function App() {
  const [symbol, setSymbol] = useState();
  const [balance, setBalance] = useState();
  const [fundBalance, setFundBalance] = useState();
  const [fundAmount, setFundAmount] = useState("");

  const accountArr = ["0x56574260649bc948ac94686983926D90135dE070"];
  const limitArr = [ethers.parseEther("0.0000000000000002")];

  const getBlock = async () => {
    const wallet = new ethers.BrowserProvider(window.ethereum);
    const address = await wallet.getSigner();

    const token = new ethers.Contract("0xc170bd5653B0d499eE2cAa700E4338B7549424eD", abi, address);

    const name = await token.name();

    const symbol = await token.symbol();
    setSymbol(symbol);

    const balance = await token.balanceOf(address.address);
    setBalance(balance);

    // Replace the address with the second account address

    const fundAddress = "0x56574260649bc948ac94686983926D90135dE070";
    const fundBalance = await token.balanceOf(fundAddress);
    setFundBalance(fundBalance.toString());
  }

  const mintToken = async () => {
    const wallet = new ethers.BrowserProvider(window.ethereum);
    const address = await wallet.getSigner();
    const token = new ethers.Contract("0xc170bd5653B0d499eE2cAa700E4338B7549424eD", abi, address);
    await token.mint(address.address, ethers.parseEther("0.0000000000000003"));
  }

  const transferToken = async () => {
    const wallet = new ethers.BrowserProvider(window.ethereum);
    const address = await wallet.getSigner();
    //const fundAddress = "0x56574260649bc948ac94686983926D90135dE070";
    const fundAddress = accountArr[0];
  
    const token = new ethers.Contract("0xc170bd5653B0d499eE2cAa700E4338B7549424eD", abi, address);
    
    const fundAddressBalance = await token.balanceOf(fundAddress);
    //const fundingLimit = ethers.parseEther("0.0000000000000002");
    const fundingLimit = limitArr[0];

    let fundAmount = 0;
    const storedAmount = sessionStorage.getItem("storedAmount");
    
    if(storedAmount === null) {
      const fundAmountInput = document.getElementById("fundAmountInput");
      fundAmount = fundAmountInput.value;
    }
    else {
      fundAmount = storedAmount;
    }

    const balance = await token.balanceOf(address.address);
    if(balance < fundAmount) {
      alert("Not enough duit bruddah");
    }
    else {
      const plusBalance = fundAddressBalance + fundAmount;
      if(plusBalance < fundingLimit) {
        await token.transfer(fundAddress, fundAmount);
      }
      else {
        if(fundAddressBalance === fundingLimit) {
          alert("Fund completed");
        }
        else {

          const acceptedFund = fundingLimit - fundAddressBalance;
          await token.transfer(fundAddress, acceptedFund.toString());
        }
      }
    }
  }

  const requestFund = async () => {
    // Get the values from the form fields
    const requestAccount = document.getElementById("requestAccount").value;
    const requestDescription = document.getElementById("requestDescription").value;
    const requestAmount = document.getElementById("requestAmount").value;

    sessionStorage.setItem("storeAddress", requestAccount);
    sessionStorage.setItem("storeAmount", requestAmount);

    // Create a new card element
    const newCard = document.createElement("div");
    newCard.className = "card";

    // Create the card content
    newCard.innerHTML = `
      <div class="card-header">
        <img src= ${xavier} alt="xavier">
      </div>
      <div class="card-content">
        ${requestDescription}
      </div>
      <div class="progress-bar">
        <p>Progress: ${balance} / ${requestAmount} </p>
        <img src= ${nasi} alt="nasi" class="token">
      </div>
      <div class="card-bottom">
        <form>
          <input type="number" class="amount" placeholder="Amount" id="amount">
        </form>
        <button class="transfer">Fund Me</button>
      </div>
    `;
    const button = newCard.querySelector(".transfer");
    button.addEventListener("click", () => transferToken());
  
    // Append the new card element to a container in your HTML (e.g., a div with a specific ID)
    const lowerContainer = document.getElementById("lower-container");
    lowerContainer.appendChild(newCard);
  };

  useEffect(() => {
    getBlock();
  }, []);

  return (
    <div>
      <div class="header">
        <div class="nav">
            <img src={nasi} alt="nasi"></img>
          <div class="title">
            <h1>HorFund!</h1>
          </div>
        </div>
      </div>
      <h1 class="balance">{"Your current balance: " + balance + " " + symbol}</h1>
      <h2 class="event">Funding events</h2>
      <div class="first-container">
        <div class="card-container">
          <div class="upper-container">
            <div class="card">
              <div class="card-header">
              <img src={xavier} alt="xavier"></img>
              </div>
              <div class="card-content">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
              </div>
              <div class="progress-bar" id="progress">
                <p>Progress: {fundBalance} / 200 </p>
                <img src={nasi} alt="nasi" class="token"></img>
              </div>
              <div class="card-bottom">
                <form>
                  <input type="number" class="amount" placeholder="Amount" id="fundAmountInput"  value={fundAmount} onChange={(e) => setFundAmount(e.target.value)}></input>
                </form>
                <button class="transfer" onClick={() => transferToken()}> Fund Me </button>
              </div> 
            </div>
            <div class="card">
              <div class="card-header">
                <img src="https://cdn.images.express.co.uk/img/dynamic/1/590x/secondary/126844.jpg" alt="xavier"></img>
              </div>
              <div class="card-content">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
              </div>
              <div class="progress-bar">
                <p>Progress: 23 / 300 </p>
                <img src={nasi} alt="nasi" class="token"></img>
              </div>
              <div class="card-bottom">
                <form>
                  <input type="number" class="amount" placeholder="Amount" id="amount"></input>
                </form>
                <button class="transfer"> Fund Me </button>
              </div>
            </div>
          </div>
          <div class="lower-container">
            <div class="card">
              <div class="card-header">
                <img src="https://news.microsoft.com/wp-content/uploads/prod/sites/430/2020/07/Sustainable-Development-Goals-Chart.png" alt="xavier"></img>
              </div>
              <div class="card-content">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
              </div>
              <div class="progress-bar">
              <p>Progress: 100 / 250 </p>
                <img src={nasi} alt="nasi" class="token"></img>
              </div>
              <div class="card-bottom">
                <form>
                  <input type="number" class="amount" placeholder="Amount" id="amount"></input>
                </form>
                <button class="transfer"> Fund Me </button>
              </div>
            </div>
            <div class="card">
              <div class="card-header">
                <img src="https://files.globalgiving.org/ufil/2401971/reg318110.jpg" alt="xavier"></img>
              </div>
              <div class="card-content">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
              </div>
              <div class="progress-bar">
                <p>Progress: 100 / 150 </p>
                <img src={nasi} alt="nasi" class="token"></img>
              </div>
              <div class="card-bottom">
                <form>
                  <input type="number" class="amount" placeholder="Amount" id="amount"></input>
                </form>
                <button class="transfer"> Fund Me </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="second-container">
        <div class="card-container">
          <div class="upper-container">
            <div class="card">
              <div class="card-header">
              <img src="https://i.ytimg.com/vi/bISAcbOjfHw/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDu_6WB9JPiMZa_MS441v0GkTRSYw" alt="xavier"></img>
              </div>
              <div class="card-content">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
              </div>
              <div class="progress-bar">
                <p>Progress: 100 / 150 </p>
                <img src={nasi} alt="nasi" class="token"></img>
              </div>
              <div class="card-bottom">
                <form>
                  <input type="number" class="amount" placeholder="Amount" id="amount"></input>
                </form>
                <button class="transfer"> Fund Me </button>
              </div>
            </div>
            <div class="card">
              <div class="card-header">
                <img src="https://ca-times.brightspotcdn.com/dims4/default/9d7866e/2147483647/strip/false/crop/5000x3333+0+0/resize/1486x991!/quality/75/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2Ffb%2F8c%2Fb6e8796e450885f50ea8bc22dbec%2Fap23037523545482.jpg" alt="xavier"></img>
              </div>
              <div class="card-content">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
              </div>
              <div class="progress-bar">
                <p>Progress: 100 / 150 </p>
                <img src={nasi} alt="nasi" class="token"></img>
              </div>
              <div class="card-bottom">
                <form>
                  <input type="number" class="amount" placeholder="Amount" id="amount"></input>
                </form>
                <button class="transfer"> Fund Me </button>
              </div>
            </div>
          </div>
          <div class="lower-container" id="lower-container">
            <div class="card">
              <div class="card-header">
                <img src="https://truthout.org/app/uploads/2013/01/4057605504_c703f720ac_o-1200x800.jpg" alt="xavier"></img>
              </div>
              <div class="card-content">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
              </div>
              <div class="progress-bar">
                <p>Progress: 100 / 150 </p>
                <img src={nasi} alt="nasi" class="token"></img>
              </div>
              <div class="card-bottom">
                <form>
                  <input type="number" class="amount" placeholder="Amount" id="amount"></input>
                </form>
                <button class="transfer"> Fund Me </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <h2 class="event">Request Fund</h2>
      <div class="event-container">
        <form>
          <table>
            <tr>
              <td>Account address (0x...): </td>
              <td><input type="text" id="requestAccount"></input></td>
            </tr>
            <tr>
              <td>Description: </td>
              <td><input type="textarea" id="requestDescription"></input></td>
            </tr>
            <tr>
              <td>Fund Goal (NASI): </td>
              <td><input type="number" id="requestAmount"></input></td>
            </tr>
          </table>
        </form>
        <button class="submit" onClick={() => requestFund()}> Request </button>
      </div>
    </div>
  );
}

export default App;
