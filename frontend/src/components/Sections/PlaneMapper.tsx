
import 'material-icons/iconfont/material-icons.css'
import ListButton from '../UI/ListButton';
export default function MaterialMapper({setSelected,planes}:{setSelected:Function}){
return (<ul className='MaterialMapper'>
    {Object.keys(planes).map((v:string,i:number)=>(<ListButton onClick={(e)=>setSelected(planes[v])} key={'material-'+i} text={v}/>))}
    </ul>)
}