import logo from "../assets/assets/logo.png";
import { useSelector, useDispatch } from "react-redux";
import { loadAccount } from "../store/ineraction";
import eth from "../assets/assets/eth.svg";
import Blockies from "react-blockies";

const Navbar = () => {
  const { account, amount, connection, chainId } = useSelector(
    (state) => state.provider
  );
  // console.log(connection);
  const dispatch = useDispatch();

  const handleAccount = async() => {
    await loadAccount(dispatch, connection);
  };

  const networkHandler = async(e) => {
    // console.log(e.target.value);
  };

  return (
    <div className="exchange__header grid">
      <div className="exchange__header--brand flex">
        <img src={logo} className="logo" alt="logo" />
        <h4>Token Exchange</h4>
      </div>

      <div
        className="exchange__header--networks flex"
        onChange={networkHandler}
      >
        <img src={eth} alt="ETH logo" className="ETH logo" />
        <select className="networks" id="networks">
          <option value="" disabled>
            Select network
          </option>
          <option value="local">localhost</option>
          <option value="kovan">kovan</option>
        </select>
      </div>

      <div className="exchange__header--account flex">
        {amount ? (
          <p>My Balance : {Number(amount).toFixed(2) + " ETH"}</p>
        ) : (
          <p>My Balance : 0 ETH</p>
        )}

        {account ? (
          <a href="">
            {account.slice(0, 5) + "..." + account.slice(account.length - 3)}
            <Blockies
              account={account}
              size={10}
              scale={3}
              color="#dfe"
              bgColor="#ffe"
              spotColor="#abc"
              className="identicon"
            />
          </a>
        ) : (
          <button className="button" onClick={handleAccount}>
            connect
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
