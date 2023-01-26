import config from '../config.json';
import { useSelector,useDispatch } from 'react-redux';
import { loadTokens } from '../store/ineraction';

const Markets = () => {
    const dispatch = useDispatch();
    const {chainId,connection} = useSelector(state=>state.provider);
    
    const marketHandler=(e)=>{
      const tokens = (e.target.value).split(',');
       loadTokens(tokens, dispatch,connection);
    }

    return(
      <div className='component exchange__markets'>
        <div className='component__header'>
            <h3>Select Markets</h3>
        </div>
      
      {chainId? (<select name="markets" id="markets" onChange={marketHandler} >
        <option value={`${config[chainId].shery.address},${config[chainId].eTIT.address}`}>shery / eTIT</option>
        <option value={`${config[chainId].shery.address},${config[chainId].sTIT.address}`}>shery / sTIT</option>
       </select>):
       <div>
        <p>tokens not deployed yet</p>
       </div>
  }

      
        <hr />
      </div>
    )
  }
  
  export default Markets;
  