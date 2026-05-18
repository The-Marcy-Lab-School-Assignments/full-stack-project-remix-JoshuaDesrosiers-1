
import 'material-icons/iconfont/material-icons.css'

export default function ListButton(props:{text:string,onClick?:Function,onBlur?:Function,className?:string}){
return (<li className={'ListButton '+props?.className}
        onClick={(e)=>props.onClick?props.onClick(e):''}
        onBlur={(e)=>props.onBlur?props.onBlur(e):''}>
        <button className="">
            {props.text}
        </button>
    </li>)
}