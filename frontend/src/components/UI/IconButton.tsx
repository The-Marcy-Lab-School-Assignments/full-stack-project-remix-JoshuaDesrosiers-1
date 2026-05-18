
import 'material-icons/iconfont/material-icons.css'

export default function IconButton(props:{icon:string,onClick?:Function,onBlur?:Function}){
return (<button className='IconButton'
        onClick={(e)=>props.onClick?props.onClick(e):''}
        onBlur={(e)=>props.onBlur?props.onBlur(e):''}>
    <span className="material-icons">
        {props.icon}
    </span>
</button>)
}