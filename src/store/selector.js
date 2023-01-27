import {createSelector} from 'reselect';
import {get , groupBy, reject} from 'lodash';
import moment from 'moment';
import { ethers } from 'ethers';

const allOrders = state=>get(state , 'exchange.allOrders.data',[])
const cancelOrder = state=> get(state , 'exchange.cancelOrders.data',[]) 
const filledOrder = state=> get(state , 'exchange.fillOrders.data',[])

const tokens = state=>get(state , 'tokens.contracts')

const openOrder = (state)=>{
   const all = allOrders(state);
   const cancel = cancelOrder(state);
   const fill = filledOrder(state);

   return reject(all, (order)=>{
      const can = cancel.some(o=> o.Order_id.toString()=== order.Order_id);
      const fil = fill.some(o=> o.Order_id.toString()===order.Order_id.toString());

       return (can || fil)
   })
}

const decoracteOrder = (order , tokens)=>{
  let token0Amount , token1Amount;
  if(order._tokenGet==tokens[0].address){
    token0Amount = order._amountGet;
    token1Amount = order._amountGive;
  }else{
    token0Amount = order._amountGive;
    token1Amount = order._amountGet;
  }
  const precise = 100000;
  let tokenPrice = Math.round((token0Amount/token1Amount)* precise) / precise ;
  let time = moment.unix(order.timestamp).format('MMMM Do YYYY, h:mm:ss a')
  let orderType = (order._tokenGive == tokens[1].address)? 'buy' :'sell';
  return({
    ...order,
    token0Amount : ethers.utils.formatEther(token0Amount , 'ether'),
    token1Amount:  ethers.utils.formatEther(token1Amount,'ether'),
    tokenPrice,
    time,
    orderType
  })
}

const mapOrders = (orders , tokens)=>{
  return(
    orders.map(order=>{
      order =  decoracteOrder(order, tokens);
      return order
   })
  )
}

export const bookOrderSelector=createSelector(openOrder,tokens,(orders,tokens)=>{
  orders = orders.filter(o=>o._tokenGet==tokens[0].address || o._tokenGet == tokens[1].address)
  orders = orders.filter(o=>o._tokenGive==tokens[0].address || o._tokenGive == tokens[1].address)

   orders = mapOrders(orders,tokens)
   orders = groupBy(orders , 'orderType');
   
   //fetch sell orders 
   let sellOrders = get(orders , 'sell' , []);

   // sort sell orders 
  orders = {
    ...orders,
    sellOrders : sellOrders.sort((a,b)=>a.tokenPrice - b.tokenPrice)
  }
   //fetch sell orders 
   let buyOrders = get(orders , 'buy' , []);

   // sort sell orders 
  orders = {
    ...orders,
    buyOrders : buyOrders.sort((a,b)=>a.tokenPrice - b.tokenPrice)
  }
   
  return orders;
})

export const filledOrders = createSelector(filledOrder , tokens , (orders, tokens)=>{
  if(!tokens[0] || !tokens[1]) return {}

  //fetch orders according to search market
  orders = orders.filter(o=>o._tokenGet==tokens[0].address || o._tokenGet == tokens[1].address)
  orders = orders.filter(o=>o._tokenGive==tokens[0].address || o._tokenGive == tokens[1].address)
  
  orders = mapOrders(orders, tokens);
  orders = orders.sort((a,b)=>b.time - a.time)
  return orders
}) 