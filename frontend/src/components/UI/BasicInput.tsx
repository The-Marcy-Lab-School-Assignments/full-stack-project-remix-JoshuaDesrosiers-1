

import 'material-icons/iconfont/material-icons.css'

export default function BasicInput(props:{value:string,setter:(val:number)=>{}}){
return (<input className='basicInput' type='number' value={props.value} onChange={(e)=>props.setter(Number(e.target.value))}/>)
}