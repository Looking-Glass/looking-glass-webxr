interface WrapperArgs {
    src: string;
    title: string;
    docs?: string;
}

export default function Wrapper(args: WrapperArgs) {
    
    return (
    <div style={{textAlign: "center"}}>
        <iframe className="react-iframe" src={args.src} title={args.title}/>
        <a href={args.src}>{args.title}</a>
        {args.docs && (<a href={args.docs}>Documentation</a>)}
    </div>
    
)}