
import 'material-icons/iconfont/material-icons.css'
import ListButton from '../UI/ListButton';
export default function MaterialMapper({setSelected,materials}:{setSelected:Function}){
return (<ul className='MaterialMapper'>
    {Object.keys(materials).map((v:string,i:number)=>(<ListButton onClick={(e)=>setSelected(materials[v])} key={'material-'+i} text={v}/>))}
    </ul>)
}