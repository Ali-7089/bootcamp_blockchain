export const provider = (state = {}, action) => {
  switch (action.type) {
    case "PROVIDER_LOADED":
      return {
        ...state,
        connection: action.connection,
      };
    case "NETWORK_LOADED":
      return {
        ...state,
        chainId: action.chainId,
      };
    case "ACCOUNT_LOADED":
      return {
        ...state,
        account: action.account,
      };

    case "ETHERS_LOADED":
      return {
        ...state,
        amount: action.amount,
      };
    default:
      return state;
  }
};

export const tokens = (
  state = { contracts: [], symbols: [], loaded: false },
  action
) => {
  // console.log(action.symbol);
  switch (action.type) {
    case "TOKEN_1_LOADED":
      return {
        ...state,
        loaded: true,
        symbols: [action.symbol],
        contracts: [action.token],
      };
    case "TOKEN_1_BALANCE_LOADED":
      return {
        ...state,
        balances: [action.balance],
      };
    case "TOKEN_2_LOADED":
      return {
        ...state,
        loaded: true,
        symbols: [...state.symbols, action.symbol],
        contracts: [...state.contracts, action.token],
      };
    case "TOKEN_2_BALANCE_LOADED":
      return {
        ...state,
        balances: [...state.balances, action.balance],
      };
    default:
      return state;
  }
};

const DEFAULT_EXCHANGE_STATE = {
  loaded: false,
  exchange: {},
  transaction: {
    isSuccessFull: false,
  },
  allOrders: {
    loaded: false,
    data: [],
  },
  cancelOrders: {
    loaded: false,
    data: [],
  },
  events: [],
};

export const exchange = (state = DEFAULT_EXCHANGE_STATE, action) => {
  let data, index;
  switch (action.type) {
    case "EXCHANGE_LOADED":
      return {
        ...state,
        loaded: true,
        exchange: action.exchange,
      };
    case "LOAD_ALL_ORDERS":
      return {
        ...state,
        allOrders: {
          loaded: true,
          data: action.allOrders,
        },
      };

    // load all cancel orders
    case "LOAD_ALL_CANCEL_ORDERS":
      return {
        ...state,
        cancelOrders: {
          loaded: true,
          data: action.cancelOrders,
        },
      };

    // load all cancel orders
    case "LOAD_ALL_FILLED_ORDERS":
      return {
        ...state,
        fillOrders: {
          loaded: true,
          data: action.fillOrders,
        },
      };

    case "TOKEN_1_EXCHANGE_BALANCE_LOADED":
      return {
        ...state,
        balances: [action.balance],
      };
    case "TOKEN_2_EXCHANGE_BALANCE_LOADED":
      return {
        ...state,
        balances: [...state.balances, action.balance],
      };

    /////////TRANSFER (DEPOSIT && WITHDRAW)
    case "TRANSFER_PENDING":
      return {
        ...state,
        transaction: {
          isPending: true,
          isSuccessFull: false,
        },
        transaction_progress: true,
      };
    case "TRANSFER_SUCCESSFUL":
      return {
        ...state,
        transaction: {
          isPending: false,
          isSuccessFull: true,
        },
        transaction_progress: false,
        events: [...state.events, action.event],
      };
    case "TRANSACTION_FAIL":
      return {
        ...state,
        transaction: {
          isPending: false,
          isSuccessFull: false,
          isError: true,
        },
        transaction_progress: false,
      };

    /////////Order (BUY && SELL)
    case "NEW_ORDER_PENDING":
      return {
        ...state,
        transaction: {
          isPending: true,
          isSuccessFull: false,
        },
        transaction_progress: true,
      };
    case "NEW_ORDER_SUCCESSFUL":
      index = state.allOrders.data.findIndex(
        (o) => o.Order_id.toString() === action.order.Order_id.toString()
      );
      if (index == -1) {
        data = [...state.allOrders.data, action.order];
      } else {
        data = state.allOrders.data;
      }
      return {
        ...state,
        allOrders: {
          ...state.allOrders,
          data,
        },
        transaction: {
          isPending: false,
          isSuccessFull: true,
        },
        transaction_progress: false,
        events: [...state.events, action.event],
      };
    case "NEW_ORDER_FAIL":
      return {
        ...state,
        transaction: {
          isPending: false,
          isSuccessFull: false,
          isError: true,
        },
        transaction_progress: false,
      };

    //cancelling order by user
    case "CANCEL_ORDER_PENDING":
      return {
        ...state,
        transaction: {
          isPending: true,
          isSuccessFull: false,
        },
      };
    case "CANCEL_ORDER_SUCCESSFUL":
      return {
        ...state,
        cancelOrders: {
          ...state.cancelOrders,
          data: [...state.cancelOrders.data, action.order],
        },
        transaction: {
          isPending: false,
          isSuccessFull: true,
        },
        events: [...state.events, action.event],
      };
    case "NEW_ORDER_FAIL":
      return {
        ...state,
        transaction: {
          isPending: false,
          isSuccessFull: false,
          isError: true,
        },
        transaction_progress: false,
      };

      //filled order by user
      case "FILLED_ORDER_PENDING":
        return {
          ...state,
          transaction: {
            isPending: true,
            isSuccessFull: false,
          },
        };
      case "FILLED_ORDER_SUCCESSFUL":
        return {
          ...state,
          fillOrders: {
            ...state.fillOrders,
            data: [...state.fillOrders.data, action.order],
          },
          transaction: {
            isPending: false,
            isSuccessFull: true,
          },
          events: [...state.events, action.event],
        };
      case "NEW_ORDER_FAIL":
        return {
          ...state,
          transaction: {
            isPending: false,
            isSuccessFull: false,
            isError: true,
          },
          transaction_progress: false,
        };
  
    default:
      return state;
  }
};
