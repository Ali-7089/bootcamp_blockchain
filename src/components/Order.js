import { useState } from "react";
import { useSelector,useDispatch } from "react-redux";
import { useRef } from "react";
import { makeBuyOrder , makeSellOrder } from "../store/ineraction";

const Order = () => {
  const dispatch = useDispatch();
  const provider = useSelector(state=>state.provider.connection);
  const exchange = useSelector(state=>state.exchange.exchange);
  const tokens = useSelector(state=>state.tokens.contracts)

    const buyRef = useRef(null);
    const sellRef = useRef(null);

    const[isBuy,setIsBuy] = useState(true);
    const[amount,setAmount] = useState(0);
    const[price, setPrice] = useState(0);

    const tabHandler = (e)=>{
    if(e.target.className!=buyRef.current.className){
        e.target.className = 'tab tab--active'
        buyRef.current.className = 'tab'
        setIsBuy(false);
    }else {
        e.target.className = 'tab tab--active'
        sellRef.current.className = 'tab'
        setIsBuy(true);
    }
    }

    const buyHandler=(e)=>{
      console.log(e)
        e.preventDefault();
       makeBuyOrder(provider,exchange,tokens,{amount,price},dispatch);
       setAmount(0);
       setPrice(0);

    } 

    const sellHandler=(e)=>{
        e.preventDefault();
        makeSellOrder(provider,exchange,tokens,{amount,price},dispatch);
        setAmount(0);
        setPrice(0);
 
    }

    return (
      <div className="component exchange__orders">
        <div className='component__header flex-between'>
          <h2>New Order</h2>
          <div className='tabs'>
            <button onClick={tabHandler} className='tab tab--active' ref={buyRef}>Buy</button>
            <button onClick={tabHandler} className='tab' ref={sellRef}>Sell</button>
          </div>
        </div>
  
        <form onSubmit={ isBuy?buyHandler:sellHandler}>     
       <label htmlFor="amount">{isBuy?'Buy Amount':'Sell Amount'}</label>
         
          <input
              type="text"
              id='amount'
              placeholder='0.0000'
              onChange={(e)=>setAmount(e.target.value)}
              value = {amount===0?'':amount}
          />
  
         
            <label htmlFor="price">{isBuy?'Buy Price':'Sell Price'}</label>
         
          <input
              type="text"
              id='price'
              placeholder='0.0000'
              onChange={(e)=>setPrice(e.target.value)}
              value = {price===0?'':price}
          />
  
          <button className='button button--filled' type='submit'>
                <span>{isBuy?'Buy Order':'Sell Order'}</span>
          </button>
        </form>
      </div>
    );
  }
  
export default Order;
  