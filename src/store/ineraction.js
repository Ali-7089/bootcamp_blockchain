import { ethers } from "ethers";
import TOKEN_ABI from "../abi/Token.json";
import EXCHANGE_ABI from "../abi/Exchange.json";

export const loadProvider = (dispatch) => {
  const connection = new ethers.providers.Web3Provider(window.ethereum);
  dispatch({ type: "PROVIDER_LOADED", connection });

  return connection;
};

export const loadNetwork = async (dispatch, provider) => {
  const network = await provider.getNetwork();
  console.log(network.chainId);
  dispatch({ type: "NETWORK_LOADED", chainId: network.chainId });

  return network.chainId;
};

export const loadAccount = async (dispatch, provider) => {
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  dispatch({ type: "ACCOUNT_LOADED", account: accounts[0] });

  const balance = await provider.getBalance(accounts[0]);
  const amount = await ethers.utils.formatEther(balance.toString());
  dispatch({ type: "ETHERS_LOADED", amount });

  return amount;
};

export const loadTokens = async (addresses, dispatch, provider) => {
  let token, symbol;
  token = new ethers.Contract(addresses[0], TOKEN_ABI, provider);
  symbol = await token.symbol();
  dispatch({ type: "TOKEN_1_LOADED", token, symbol });

  token = new ethers.Contract(addresses[1], TOKEN_ABI, provider);
  symbol = await token.symbol();
  dispatch({ type: "TOKEN_2_LOADED", token, symbol });
};

export const loadExchange = async (address, dispatch, provider) => {
  let exchange;
  exchange = new ethers.Contract(address, EXCHANGE_ABI, provider);

  dispatch({ type: "EXCHANGE_LOADED", exchange });

  return exchange;
};

export const loadBalance = async (dispatch, tokens, account, exchange) => {
  let balance;
  balance = ethers.utils.formatUnits(await tokens[0].balanceOf(account), 18);
  dispatch({ type: "TOKEN_1_BALANCE_LOADED", balance });

  balance = ethers.utils.formatUnits(
    await exchange.balanceOf(tokens[0].address, account),
    18
  );
  dispatch({ type: "TOKEN_1_EXCHANGE_BALANCE_LOADED", balance });

  balance = ethers.utils.formatUnits(await tokens[1].balanceOf(account), 18);
  dispatch({ type: "TOKEN_2_BALANCE_LOADED", balance });

  balance = ethers.utils.formatUnits(
    await exchange.balanceOf(tokens[1].address, account),
    18
  );
  dispatch({ type: "TOKEN_2_EXCHANGE_BALANCE_LOADED", balance });
};

export const subscribeToEvent = async (exchange, dispatch) => {
  exchange.on("Deposit", (_token, _user, _amount, _balance, event) => {
    dispatch({ type: "TRANSFER_SUCCESSFUL", event });
  });
  exchange.on("Withdraw", (_token, _user, _amount, _balance, event) => {
    dispatch({ type: "TRANSFER_SUCCESSFUL", event });
  });
  exchange.on("OrderEvent", (Order_id,user,tokenGet,amountGet,tokenGive,amountGive,timestamp,event) => {
    const order = event.args;
    dispatch({ type: "NEW_ORDER_SUCCESSFUL", event,order });
  });
  exchange.on("Cancel", (Order_id,user,tokenGet,amountGet,tokenGive,amountGive,timestamp,event) => {
    const order = event.args;
    dispatch({ type: "CANCEL_ORDER_SUCCESSFUL", event,order });
  });
  exchange.on("FilledOrderEvent", (Order_id,user,tokenGet,amountGet,tokenGive,amountGive,creator,timestamp,event) => {
    const order = event.args;
    dispatch({ type: "FILLED_ORDER_SUCCESSFUL", event,order });
  });
};

//Load all orders

export const LoadAllOrders = async(provider,exchange,dispatch)=>{
  const block = await provider.getBlockNumber();

  //fetch all cancel Orders
  const cancelOrderStream = await exchange.queryFilter('Cancel',0,block);
  const cancelOrders = cancelOrderStream.map(events=> events.args)

  dispatch({type:'LOAD_ALL_CANCEL_ORDERS', cancelOrders})

  //fetch all Filled orders 
  const filedOrderStream = await exchange.queryFilter('FilledOrderEvent',0,block);
  const fillOrders = filedOrderStream.map(events=> events.args)

  dispatch({type:'LOAD_ALL_FILLED_ORDERS', fillOrders})

  //fetch all orders
  const orderStream = await exchange.queryFilter('OrderEvent',0,block);
  const allOrders = orderStream.map(events=> events.args)

  dispatch({type:'LOAD_ALL_ORDERS', allOrders})

}

// TRANFER (DEPOSIT AND WITHDRAW)

export const TransferToken = async (
  provider,
  exchange,
  transferAmount,
  transactionType,
  token,
  dispatch
) => {
  dispatch({ type: "TRANSFER_PENDING" });
  let Transaction;

  try {
    const signer = await provider.getSigner();
    const amount = ethers.utils.parseUnits(transferAmount.toString(), 18);
    if (transactionType == "deposit") {
      Transaction = await token
        .connect(signer)
        .approve(exchange.address, amount);
      await Transaction.wait();

      //deposit
      Transaction = await exchange
        .connect(signer)
        .depositToken(token.address, amount);
      await Transaction.wait();
    } else {
      // withdraw
      Transaction = await exchange
        .connect(signer)
        .withDrawTokens(token.address, amount);
      await Transaction.wait();
    }
  } catch (error) {
    dispatch({ type: "TRANSACTION_FAIL" });
  }
};

// ORDER (BUY AND SELL)

export const makeBuyOrder = async (
  provider,
  exchange,
  tokens,
  order,
  dispatch
) => {
  dispatch({ type: "NEW_ORDER_PENDING" });
  let transaction;
  const tokenGet = tokens[0].address;
  const amountGet = ethers.utils.parseUnits(order.amount.toString(), 18);
  const tokenGive = tokens[1].address;
  const amountGive = ethers.utils.parseUnits((order.amount * order.price).toString(), 18);

  try {
    const signer = await provider.getSigner();
    transaction = await exchange.connect(signer).makeOrder(tokenGet, amountGet,tokenGive,amountGive);
    await transaction.wait();
  } catch (error) {
    dispatch({ type: "NEW_ORDER_FAIL" });
  }
};

export const makeSellOrder = async (
  provider,
  exchange,
  tokens,
  order,
  dispatch
) => {
  dispatch({ type: "NEW_ORDER_PENDING" });
  let transaction;
  const tokenGet = tokens[1].address;
  const amountGet = ethers.utils.parseUnits((order.amount * order.price).toString(), 18);
  const tokenGive = tokens[0].address;
  const amountGive = ethers.utils.parseUnits(order.amount.toString(), 18);

  try {
    const signer = await provider.getSigner();
    transaction = await exchange.connect(signer).makeOrder(tokenGet, amountGet,tokenGive,amountGive);
    await transaction.wait();
  } catch (error) {
    dispatch({ type: "NEW_ORDER_FAIL" });
  }
};

export const cancellingOrder = async(provider , order,dispatch,exchange)=>{
  dispatch({ type: "CANCEL_ORDER_PENDING" });
let transaction;
  try {
    const signer = await provider.getSigner();
    transaction = await exchange.connect(signer).cancelOrder(order.Order_id);
    await transaction.wait();
  } catch (error) {
    dispatch({ type: "CANCEL_ORDER_FAIL" });
  }
}
export const filledOrder = async(provider , order,dispatch,exchange)=>{
  dispatch({ type: "FILLED_ORDER_PENDING" });
let transaction;
  try {
    const signer = await provider.getSigner();
    transaction = await exchange.connect(signer).fillOrder(order.Order_id);
    await transaction.wait();
  } catch (error) {
    dispatch({ type: "FILLED_ORDER_FAIL" });
  }
}
