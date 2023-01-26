const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

describe("Exchange", () => {
  let exchange,feeAccount,accounts,token,user1,user2,deployer;
  const feePercent = 10;
  beforeEach(async () => {
    const Exchange = await ethers.getContractFactory("Exchange");
    const Token = await ethers.getContractFactory("Token");
    token = await Token.deploy("Sheryians","SHERY","1000000");
    token2 = await Token.deploy("Technocrats","TIT","1000000"); 

    accounts = await ethers.getSigners();
    deployer = accounts[0];
    feeAccount = accounts[1];
    user1 = accounts[2];
    user2 = accounts[3];

    let transaction = await token.connect(deployer).transfer(user1.address,tokens('10'));
    await transaction.wait(); 

    exchange = await Exchange.deploy(feeAccount.address,feePercent);
});

  describe("deployment", () => {
      it('fee account address',async()=>{
        expect(await exchange.feeAccount()).to.equal(feeAccount.address);
      })  

      it('fee percent ',async()=>{
        expect(await exchange.feePercent()).to.equal(feePercent);
      })   
  });

describe('Deposit token to exchange',()=>{
    let amount = tokens('10');
    let Transaction ,result;
    beforeEach(async()=>{
    //approve
     Transaction = await token.connect(user1).approve(exchange.address,amount);
     result = await Transaction.wait();

    //deposit
     Transaction = await exchange.connect(user1).depositToken(token.address,amount);
     result = await Transaction.wait();
  })

  describe('Succes',()=>{
    it('check exchange balance',async()=>{
      expect(await token.balanceOf(exchange.address)).to.equal(amount);
      expect(await exchange.tokens(token.address,user1.address)).to.be.equal(amount);
      expect(await exchange.balanceOf(token.address,user1.address)).to.be.equal(amount);
    })
    it("emit deposit event", async () => {
      // console.log(result)
      let event = result.events[1];
      expect(await event.event).to.be.equal("Deposit");
      expect(await event.args._token).to.be.equal(token.address);
      expect(await event.args._user).to.be.equal(user1.address);
      expect(await event.args._amount).to.be.equal(amount);
      expect(await event.args._balance).to.be.equal(amount);
    });    
  })

  describe('Failure',()=>{
    it('fails deposit without approval',async()=>{
      await expect(exchange.connect(user1).depositToken(token.address,amount)).to.be.reverted;
    })
  })

})

describe('Withdraw token from exchange',()=>{
  let amount = tokens('10');
  let Transaction ,result;
  beforeEach(async()=>{
  //approve
   Transaction = await token.connect(user1).approve(exchange.address,amount);
   result = await Transaction.wait();

  //deposit
   Transaction = await exchange.connect(user1).depositToken(token.address,amount);
   result = await Transaction.wait();

   //Withdraw
   Transaction = await exchange.connect(user1).withDrawTokens(token.address,amount);
   result = await Transaction.wait();
})

describe('Succes',()=>{
  it('check exchange balance',async()=>{
    expect(await token.balanceOf(exchange.address)).to.equal(0);
    expect(await exchange.tokens(token.address,user1.address)).to.be.equal(0);
    expect(await exchange.balanceOf(token.address,user1.address)).to.be.equal(0);
  })
  it("emit withdraw event", async () => {
    // console.log(result)
    let event = result.events[1];
    expect(await event.event).to.be.equal("Withdraw");
    expect(await event.args._token).to.be.equal(token.address);
    expect(await event.args._user).to.be.equal(user1.address);
    expect(await event.args._amount).to.be.equal(amount);
    expect(await event.args._balance).to.be.equal(0);
  });    
})

describe('Failure',()=>{
  it('insufficient balance',async()=>{
    await expect(exchange.connect(user1).withDrawTokens(token.address,amount)).to.be.reverted;
  })
})

})

describe('make order to exchange the token',()=>{
  let amount = tokens('1');
  let Transaction ,result;
  beforeEach(async()=>{
  //approve
   Transaction = await token.connect(user1).approve(exchange.address,amount);
   result = await Transaction.wait();

  //deposit
   Transaction = await exchange.connect(user1).depositToken(token.address,amount);
   result = await Transaction.wait();

   //Withdraw
   Transaction = await exchange.connect(user1).makeOrder(token2.address,amount,token.address,amount);
   result = await Transaction.wait();
})

describe('Succes',()=>{
  it('check order id',async()=>{
      expect(await exchange.orderCount()).to.be.equal(1);
  })
  it("emit order event", async () => {
    // console.log(result)
    let event = result.events[0];
    expect(await event.event).to.be.equal("OrderEvent");
    expect(await event.args.Order_id).to.be.equal(1);
    expect(await event.args.user).to.be.equal(user1.address);
    expect(await event.args._tokenGet).to.be.equal(token2.address);
    expect(await event.args._amountGet).to.be.equal(amount);
    expect(await event.args._tokenGive).to.be.equal(token.address);
    expect(await event.args._amountGive).to.be.equal(amount);
    expect(await event.args.timestamp).to.at.least(10);
  });    
})

// describe('Failure',()=>{
//   it('insufficient token',async()=>{
//     await expect(exchange.connect(user1).makeOrder(token2.address,amount,token.address,amount)).to.be.reverted;
//   })
// })
})

describe('order action',()=>{
  let amount = tokens('1');
  let Transaction ,result;
  beforeEach(async()=>{
   Transaction = await token.connect(user1).approve(exchange.address,amount);
   result = await Transaction.wait();

   Transaction = await exchange.connect(user1).depositToken(token.address,amount);
   result = await Transaction.wait();

   Transaction = await token2.connect(deployer).transfer(user2.address,tokens('100'));
   result = await Transaction.wait();

   Transaction = await token2.connect(user2).approve(exchange.address,tokens('2'));
   result = await Transaction.wait();

   Transaction = await exchange.connect(user2).depositToken(token2.address,tokens('2'));
   result = await Transaction.wait();
 
   Transaction = await exchange.connect(user1).makeOrder(token2.address,amount,token.address,amount);
   result = await Transaction.wait();
})
  describe('cancel order',()=>{
    beforeEach(async()=>{
      Transaction = await exchange.connect(user1).cancelOrder(1);
      result = await Transaction.wait();
    })

  describe('Succes',()=>{
    it('check cancelled order',async()=>{
        expect(await exchange.cancelledOrder(1)).to.be.equal(true);
    })
    it("emit cancel order event", async () => {
      // console.log(result)
      let event = result.events[0];
      expect(await event.event).to.be.equal("Cancel");
      expect(await event.args.Order_id).to.be.equal(1);
      expect(await event.args.user).to.be.equal(user1.address);
      expect(await event.args._tokenGet).to.be.equal(token2.address);
      expect(await event.args._amountGet).to.be.equal(amount);
      expect(await event.args._tokenGive).to.be.equal(token.address);
      expect(await event.args._amountGive).to.be.equal(amount);
      expect(await event.args.timestamp).to.at.least(10);
    });    
  })
  
  describe('Failure',()=>{
    it('reject invalid order id',async()=>{
      const invalidId = 9999;
      await expect(exchange.connect(user1).cancelOrder(invalidId)).to.be.reverted;
    })
    it('reject invalid user',async()=>{
      await expect(exchange.connect(user2).cancelOrder(1)).to.be.reverted;
    })
  })
  })

  describe('fill order',()=>{
    beforeEach(async()=>{
      Transaction = await exchange.connect(user2).fillOrder(1);
      result = await Transaction.wait();
    })

  describe('Succes',()=>{
    it('check filled order',async()=>{
        expect(await exchange.filledOrder(1)).to.be.equal(true);
    })
    it('execute the trade and check balance',async()=>{
      expect(await exchange.balanceOf(token.address,user1.address)).to.equal(tokens('0'));
      expect(await exchange.balanceOf(token.address,user2.address)).to.equal(tokens('1'));
      expect(await exchange.balanceOf(token.address,feeAccount.address)).to.equal(tokens('0'));

      expect(await exchange.balanceOf(token2.address,user1.address)).to.equal(tokens('1'));
      expect(await exchange.balanceOf(token2.address,user2.address)).to.equal(tokens('0.9'));
      expect(await exchange.balanceOf(token2.address,feeAccount.address)).to.equal(tokens('0.1'));
    })
    it("emit fill order event", async () => {
      // console.log(result)
      let event = result.events[0];
      expect(await event.event).to.be.equal("FilledOrderEvent");
      expect(await event.args.Order_id).to.be.equal(1);
      expect(await event.args.user).to.be.equal(user2.address);
      expect(await event.args._tokenGet).to.be.equal(token2.address);
      expect(await event.args._amountGet).to.be.equal(amount);
      expect(await event.args._tokenGive).to.be.equal(token.address);
      expect(await event.args._amountGive).to.be.equal(amount);
      expect(await event.args._creator).to.be.equal(user1.address);
      expect(await event.args.timestamp).to.at.least(10);
    });    
  })
  
  describe('Failure',()=>{
    it('reject invalid order id',async()=>{
      const invalidId = 9999;
      await expect(exchange.connect(user2).fillOrder(invalidId)).to.be.reverted;
    })
    it('reject already cancelled order',async()=>{
      await expect(exchange.connect(user2).fillOrder(1)).to.be.reverted;
    })
 
  })
  
})

})

});
