import { useDispatch, useSelector } from "react-redux";
import sort from '../assets/assets/sort.svg'
import {bookOrderSelector} from '../store/selector';
import { filledOrder } from "../store/ineraction";

const OrderBook = () => {
    const provider = useSelector(state=>state.provider.connection);
    const dispatch = useDispatch();
    const exchange = useSelector(state=>state.exchange.exchange);
    const symbols = useSelector(state=>state.tokens.symbols);
    const orderBook = useSelector(bookOrderSelector);

    const filledOrderHandler= async(order)=>{
      await filledOrder(provider,order,dispatch,exchange);
    }

    return (
      <div className="component exchange__orderbook">
        <div className='component__header flex-between'>
          <h2>Order Book</h2>
        </div>
        <div className="flex">
        {(!orderBook || orderBook.length==0)?
       <p className="flex-center">NO selling Orders</p>:
       <table className='exchange__orderbook--sell'>
       <caption>Selling</caption>
       <thead>
         <tr>
           <th>{symbols && symbols[0]} <img src={sort} alt="SORT"/> </th>
           <th>{symbols && symbols[0]}/{symbols && symbols[1]} <img src={sort} alt="SORT"/></th>
           <th>{symbols && symbols[1]}<img src={sort} alt="SORT"/></th>
         </tr>
       </thead>
       <tbody>
        {orderBook && orderBook.sellOrders.map((order , index)=>{
         return( <tr key={index}>
          <td>{ order.token0Amount }</td>
          <td style={{color:'blue'}} >{order.tokenPrice}</td>
          <td>{order.token1Amount}</td>
        </tr>)
        })}
          
       </tbody>
     </table>
       }
        
          
  
          <div className='divider'></div>
          {(!orderBook || orderBook.length==0)?
       <p className="flex-center">NO selling Orders</p>:
            <table className='exchange__orderbook--buy'>
              <caption>Buying</caption>
              <thead>
                <tr>
                <th>{symbols && symbols[0]} <img src={sort} alt="SORT"/> </th>
                  <th>{symbols && symbols[0]}/{symbols && symbols[1]} <img src={sort} alt="SORT"/></th>
                  <th>{symbols && symbols[1]}<img src={sort} alt="SORT"/></th>
                </tr>
              </thead>
              <tbody>
        {orderBook && orderBook.buyOrders.map((order , index)=>{
         return( <tr key={index} onClick={()=>filledOrderHandler(order)}>
          <td>{ order.token0Amount }</td>
          <td style={{color:'green'}} >{order.tokenPrice}</td>
          <td>{order.token1Amount}</td>
        </tr>)
        })}
          
       </tbody>
            </table>
}
  
        </div>
      </div>
    );
  }
  
  export default OrderBook;
  