

import 'material-icons/iconfont/material-icons.css'

export default function Vector2Input(props:{value:[number,number],setter:(val:[number,number])=>{}}){
return (<ul className='VectorInput'>
            <li>x: <input type='number' value={props.value[0]} onChange={(e)=>{props.setter([Number(e.target.value)||0,props.value[1]])}}/></li>
            <li>y: <input type='number' value={props.value[1]} onChange={(e)=>{props.setter([props.value[0],Number(e.target.value)||0])}}/></li>
            </ul>)
}