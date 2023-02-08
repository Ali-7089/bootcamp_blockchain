import { useSelector } from "react-redux";
import { useRef } from "react";
import { myOrderSelector } from "../store/selector";

const Transaction = () => {
   const symbols = useSelector(state=>state.tokens.symbols)
   const myOrder = useSelector(myOrderSelector);

   const orderRef = useRef(null)
   const tradeRef = useRef(null)

   const handleBar = (e)=>{
    if(e.target.className !== orderRef.current.className){
        e.target.className = 'tab tab--active'
    }
   }

    return (
      <div className="component exchange__transactions">
        <div>
          <div className='component__header flex-between'>
            <h2>My Orders</h2>
  
            <div className='tabs'>
              <button onClick={handleBar} ref={orderRef} className='tab tab--active'>Orders</button>
              <button onClick={handleBar}  ref={tradeRef} className='tab'>Trades</button>
            </div>
          </div>
    
    {Array.isArray(myOrder) && myOrder.length!==0?(
        
  <table>
      <thead>
        <tr>
         <th>{symbols && symbols[0]}</th>
         <th>{symbols && symbols[0]}/{symbols && symbols[1]}</th>
         <th>{/* cancel To do */}</th>
        </tr>
      </thead>
      <tbody>
     
      {myOrder && myOrder.map((order,index)=>{
        return (
      <tr key={index}>
        <td>{order.token0Amount}</td>
        <td>{order.tokenPrice}</td>
        <td></td>
      </tr>
        )
      })}
      </tbody>
    </table>
    ):(
        <p className="flex-center" >No order yet</p>
    )}
    
         
  
        </div>
  
        <div>
          <div className='component__header flex-between'>
            <h2>My Transactions</h2>
  
            <div className='tabs'>
              <button className='tab tab--active'>Orders</button>
              <button className='tab'>Trades</button>
            </div>
          </div>
  
          <table>
            <thead>
              <tr>
                <th></th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
  
              <tr>
                <td></td>
                <td></td>
                <td></td>
              </tr>
  
            </tbody>
          </table>
  
        </div>
      </div>
    )
  }
  
  export default Transaction;
  