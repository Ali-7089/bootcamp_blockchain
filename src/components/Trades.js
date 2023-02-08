import { useEffect } from "react";
import { useSelector } from "react-redux";
import sort from '../assets/assets/sort.svg'
import { filledOrders } from "../store/selector";

const Trades = () => {
  const symbols = useSelector(state=> state.tokens.symbols);
  const fillOrder = useSelector(filledOrders);
  console.log(fillOrder)
  
    return (
      <div className="component exchange__trades">
        <div className='component__header flex-between'>
          <h2>Trades</h2>
        </div>

        {Array.isArray(fillOrder) && fillOrder.length !== 0 ?  (
        <table>
        <thead>
          <tr>
            <th>Time<img src={sort} alt="" /></th>
            <th>{symbols && symbols[0]} <img src={sort} alt="" /></th>
            <th>{symbols && symbols[0]}/{symbols && symbols[1]}<img src={sort} alt="" /></th>
          </tr>
        </thead>
        <tbody>

          {fillOrder && fillOrder.map((order, index)=>{
            return(
              <tr key={index}>
              <td>{order.time}</td>
              <td>{order.token0Amount}</td>
              <td>{order.tokenPrice}</td>
            </tr>
            )
          })}
             
        </tbody>
      </table>) : <p className="flex-center" >No trade</p> }




      {/* {fillOrder.length === 0?(
        <p className="flex-center" >No trade</p>
      ):
      (    <table>
        <thead>
          <tr>
            <th>Time<img src={sort} alt="" /></th>
            <th>{symbols && symbols[0]} <img src={sort} alt="" /></th>
            <th>{symbols && symbols[0]}/{symbols && symbols[1]}<img src={sort} alt="" /></th>
          </tr>
        </thead>
        <tbody>

          {fillOrder && fillOrder.map((order, index)=>{
            return(
              <tr key={index}>
              <td>{order.time}</td>
              <td>{order.token0Amount}</td>
              <td>{order.tokenPrice}</td>
            </tr>
            )
          })}
             
        </tbody>
      </table>) } */}

      
        
      </div>
    );
  }
  
  export default Trades;
  