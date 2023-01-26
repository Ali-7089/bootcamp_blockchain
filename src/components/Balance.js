import logo from '../assets/assets/shery.png'
import { useSelector,useDispatch } from 'react-redux';
import { useEffect , useState} from 'react';
import { loadBalance } from '../store/ineraction';
import { TransferToken } from '../store/ineraction';
import { useRef } from 'react';


const Balance = () => {
  const dispatch = useDispatch();
  const provider = useSelector(state=>state.provider.connection);
  const symbols = useSelector(state=>state.tokens.symbols);
  const contracts = useSelector(state=>state.tokens.contracts);
  const account = useSelector(state =>state.provider.account);
  const exchange = useSelector(state=>state.exchange.exchange);
  const balances = useSelector(state =>state.tokens.balances);
  const exchange_balance = useSelector(state=>state.exchange.balances)
  const transaction_progress = useSelector(state=>state.exchange.transaction_progress);

  const[Token1Transfer , setToken1Transfer] = useState(0);
  const[Token2Transfer , setToken2Transfer] = useState(0);

  const DepositRef = useRef(null);
  const withDrawRef = useRef(null);

  const[isDeposit , setDeposit] = useState(true);


  useEffect(()=>{
    if(contracts && account && exchange){
      loadBalance(dispatch,contracts,account,exchange);
    }
  },[exchange,contracts,account,transaction_progress])

  const balanceHandler = (e,token)=>{
    if(token.address== contracts[0].address){
      setToken1Transfer(e.target.value);
    }else {
      setToken2Transfer(e.target.value);
    }
  }

  const tabHandler = (e)=>{
   if(e.target.className!=DepositRef.current.className){
    e.target.className = 'tab tab--active'
    DepositRef.current.className = 'tab' 
    setDeposit(false);
   }else {
    e.target.className = 'tab tab--active'
    withDrawRef.current.className = 'tab'
    setDeposit(true)
   }
  }

  //[X] Step 1 - do the transfer
  //[X] step 2 - notify the app that transfer is Pending
  //[X] step 3 - fetch the info from blockchain that transfer was successfull
  // step 4 - notify the app that tranfer was successfull

  const depositHandler = (e,token)=>{
    e.preventDefault();
   if(token.address==contracts[0].address){
   TransferToken(provider,exchange,Token1Transfer,'deposit',token,dispatch);
     setToken1Transfer(0);
   }else {
    TransferToken(provider,exchange,Token2Transfer,token,dispatch);
     setToken2Transfer(0);
   }
  }
  const withdrawHandler = (e,token)=>{
    e.preventDefault();
   if(token.address==contracts[0].address){
   TransferToken(provider,exchange,Token1Transfer,'withdraw',token,dispatch);
     setToken1Transfer(0);
   }else {
    TransferToken(provider,exchange,Token2Transfer,token,dispatch);
     setToken2Transfer(0);
   }
  }

    return (
      <div className='component exchange__transfers'>
        <div className='component__header flex-between'>
          <h2>Balance</h2>
          <div className='tabs'>
            <button className='tab tab--active' ref={DepositRef} onClick={tabHandler}>Deposit</button>
            <button className='tab' ref={withDrawRef} onClick={tabHandler}>Withdraw</button>
          </div>
        </div>
  
        {/* Deposit/Withdraw Component 1 (SHERY) */}
  
        <div className='exchange__transfers--form'>
          <div className='flex-between'>
          <p><small>Token</small><br /><img src={logo} className='sheryPng' alt="" />{symbols && symbols[0]}</p>
          <p><small>Balance</small><br />{balances && balances[0]}</p>
           <p><small>Exchange</small><br />{exchange_balance && exchange_balance[0]}</p>
          </div>
  
          <form  onSubmit={isDeposit?(e)=>depositHandler(e,contracts[0])
          :(e)=>withdrawHandler(e,contracts[0])}>
            <label htmlFor="token0">{symbols && symbols[0]} Amount</label>
            <input
              type="text"
              id='token0'
              placeholder='0.0000'
              value = {Token1Transfer===0?'':Token1Transfer}
              onChange={(e)=>balanceHandler(e,contracts[0])}
             />
  
            <button className='button' type='submit'>
              <span>{isDeposit?'Deposit':'Withdraw'}</span>
            </button>
          </form>
        </div>
  
        <hr />
  
        {/* Deposit/Withdraw Component 2 (eTIT) */}
  
        <div className='exchange__transfers--form'>
          <div className='flex-between'>
          <p><small>Token</small><br /><img src={logo} className='sheryPng' alt="" />{symbols && symbols[1]}</p>
          <p><small>Balance</small><br />{balances && balances[1]}</p>
          <p><small>Exchange</small><br />{exchange_balance && exchange_balance[1]}</p>
          </div>
  
          <form  onSubmit={isDeposit?(e)=>depositHandler(e,contracts[1])
          :(e)=>withdrawHandler(e,contracts[1])}>
            <label htmlFor="token1">{symbols && symbols[1]} Amount</label>
            <input
              type="text"
              id='token1'
              placeholder='0.0000'
              value = {Token2Transfer===0?'':Token2Transfer}
              onChange={(e)=>balanceHandler(e,contracts[1])}
             />
  
            <button className='button' type='submit'>
              <span>{isDeposit?'Deposit':'Withdraw'}</span>
            </button>
          </form>
        </div>
  
        <hr />
      </div>
    );
  }
  
  export default Balance;
  