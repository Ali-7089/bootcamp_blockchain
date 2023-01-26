// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "hardhat/console.sol";
import "./Token.sol";

contract Exchange {
    address public feeAccount;
    uint256 public feePercent;
    uint256 public orderCount;

    mapping(address => mapping(address => uint256)) public tokens;
    mapping(uint256 => Order) public orders;
    mapping(uint256=>bool) public cancelledOrder;
    mapping(uint256=>bool) public filledOrder;

    event Deposit(
        address _token,
        address _user,
        uint256 _amount,
        uint256 _balance
    );
    event Withdraw(
        address _token,
        address _user,
        uint256 _amount,
        uint256 _balance
    );

    event OrderEvent(
         uint256 Order_id,
        address user,
        address _tokenGet,
        uint256 _amountGet,
        address _tokenGive,
        uint256 _amountGive,
        uint256 timestamp
    );

    event Cancel(
        uint256 Order_id,
        address user,
        address _tokenGet,
        uint256 _amountGet,
        address _tokenGive,
        uint256 _amountGive,
        uint256 timestamp
    );
    event FilledOrderEvent(
        uint256 Order_id,
        address user,
        address _tokenGet,
        uint256 _amountGet,
        address _tokenGive,
        uint256 _amountGive,
        address _creator,
        uint256 timestamp
    );


    struct Order {
        uint256 Order_id;
        address user;
        address _tokenGet;
        uint256 _amountGet;
        address _tokenGive;
        uint256 _amountGive;
        uint256 timestamp;
    }

    constructor(address _feeAccount, uint256 _feePercent) {
        feeAccount = _feeAccount;
        feePercent = _feePercent;
    }

    // deposit
    function depositToken(address _token, uint256 amount) public {
        //deposit tokens to exchange
        require(Token(_token).TransferFrom(msg.sender, address(this), amount));

        //update or mapping
        tokens[_token][msg.sender] = tokens[_token][msg.sender] + amount;

        emit Deposit(_token, msg.sender, amount, tokens[_token][msg.sender]);
    }

    //withdraw tokens
    function withDrawTokens(address _token, uint256 _amount) public {
        require(tokens[_token][msg.sender] >= _amount);

        Token(_token).transfer(msg.sender, _amount);
        //update or mapping
        tokens[_token][msg.sender] = tokens[_token][msg.sender] - _amount;
        emit Withdraw(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

    //make order or cancel order
    // _AmountGive - amount from other party
    //_AmountGet -  taker
    function makeOrder(
        address _tokenGet,
        uint256 _amountGet,
        address _tokenGive,
        uint256 _amountGive
    ) public {
      //  require(balanceOf(_tokenGive,msg.sender)>=_amountGive);
      orderCount++;
      orders[orderCount] = Order(
         orderCount,
         msg.sender,
        _tokenGet,
        _amountGet,
        _tokenGive,
        _amountGive,
        block.timestamp 
      );
      emit OrderEvent(orderCount,msg.sender,_tokenGet,_amountGet,_tokenGive,_amountGive,block.timestamp);
    }

    function cancelOrder(uint256 order_id)public{
      //fetching the order
      Order storage order = orders[order_id]; 

      require(order.user == msg.sender);
      require(order.Order_id == order_id);

      //cancel order
      cancelledOrder[order_id] = true;
      
      //emit cancel event
      emit Cancel(order_id,msg.sender,order._tokenGet,order._amountGet,
      order._tokenGive,order._amountGive,block.timestamp);
    }

    // fill order or coin swapping function

    function fillOrder(uint256 order_id) public {
       require(order_id >0 && order_id <= orderCount);
       require(!cancelledOrder[order_id]);

       Order storage order = orders[order_id];
       trade(order_id,order.user,order._tokenGet,order._amountGet,
       order._tokenGive,order._amountGive);

       filledOrder[order_id] = true;
       emit FilledOrderEvent(order_id,msg.sender,order._tokenGet,order._amountGet,
       order._tokenGive,order._amountGive,order.user,block.timestamp);
    }

    function trade(
        uint256 order_id,
        address user,
        address _tokenGet,
        uint256 _amountGet,
        address _tokenGive,
        uint256 _amountGive
    ) internal{
    //fee account
    uint256 _feeAmount = (_amountGet * feePercent)/100;
    //token receiving 
     tokens[_tokenGet][user] = tokens[_tokenGet][user] + _amountGet;
     tokens[_tokenGet][msg.sender] = tokens[_tokenGet][msg.sender] - (_amountGet+ _feeAmount);

    tokens[_tokenGet][feeAccount] = tokens[_tokenGet][feeAccount] + _feeAmount;  

     //token spending 
     tokens[_tokenGive][user] = tokens[_tokenGive][user] - _amountGive;
     tokens[_tokenGive][msg.sender] = tokens[_tokenGive][msg.sender] + _amountGive;
    }

    function balanceOf(address _token, address _user)
        public
        view
        returns (uint256)
    {
        return tokens[_token][_user];
    }
}
